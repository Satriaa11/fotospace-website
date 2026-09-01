import { API } from '../config'

export interface UserRecord {
  id: string
  email: string
  name?: string
  avatar?: string
}

export interface AuthState {
  token: string
  record: UserRecord
}

export interface UserLicense {
  key: string
  tier: 'trial' | 'basic' | 'pro'
  expires: string
  status: 'active' | 'expired' | 'revoked'
  max_devices: number
  devices_count: number
  days_remaining: number
  is_expired: boolean
}

export interface UserOrder {
  order_id: string
  created?: string | null
  pkg: 'basic' | 'pro'
  period: 'weekly' | 'monthly' | 'yearly'
  amount: number
  fee: number
  total_payment: number
  payment_method: string
  payment_number: string
  status: 'pending' | 'completed' | 'cancelled' | 'expired'
  expired_at: string
  completed_at?: string | null
  license_key?: string | null
}

export interface DashboardData {
  user: UserRecord
  license: UserLicense | null
  orders: UserOrder[]
}

export interface PaymentOrderResponse {
  order_id: string
  pkg: 'basic' | 'pro'
  period: 'weekly' | 'monthly' | 'yearly'
  amount: number
  fee: number
  total_payment: number
  payment_method: string
  payment_number: string
  expired_at: string
  checkout_url: string
}

const STORAGE_KEY = 'fotospace_auth_state'


interface OAuth2Provider {
  name: string
  displayName?: string
  state: string
  codeVerifier: string
  codeChallenge: string
  authUrl: string
}

export async function initiateGoogleLogin(): Promise<void> {
  // Buka popup KOSONG dulu (sebelum async) — Safari memblokir window.open
  // setelah await.
  const popup = window.open('', 'fotospace-oauth2', 'width=520,height=640,popup=yes')
  if (!popup) {
    throw new Error(
      'Popup login diblokir browser. Izinkan popup untuk fotospace.online lalu coba lagi.'
    )
  }

  // redirect URI callback PocketBase (wajib terdaftar di Google Cloud Console)
  const redirectURL = `${API.pocketbase}/api/oauth2-redirect`

  const res = await fetch(`${API.pocketbase}/api/collections/users/auth-methods`)
  if (!res.ok) {
    popup.close()
    throw new Error('Gagal mengambil konfigurasi login Google.')
  }

  const data = await res.json()
  const providers: OAuth2Provider[] =
    data.oauth2?.providers || data.authProviders || []
  const google = providers.find((p) => p.name === 'google')

  if (!google) {
    popup.close()
    throw new Error(
      'Login Google belum diaktifkan di PocketBase Admin. Silakan aktifkan OAuth2 Google di https://license.pocketdb.fun/_/ atau login dengan Email.'
    )
  }

  // Alur PB 0.39 (lihat RealtimeService SDK resmi):
  //   1. EventSource /api/realtime → event PB_CONNECT membawa clientId (lastEventId)
  //   2. POST /api/realtime { clientId, subscriptions: ["@oauth2"] }
  //   3. Popup ke authUrl dengan state DIGANTI clientId + redirect_uri callback PB
  //   4. PB /api/oauth2-redirect → kirim code via named event "@oauth2"
  await new Promise<void>((resolve, reject) => {
    let clientId = ''
    let settled = false
    const es = new EventSource(`${API.pocketbase}/api/realtime`)

    const timeout = setTimeout(() => {
      if (settled) return
      settled = true
      es.close()
      popup.close()
      reject(new Error('Login Google melebihi batas waktu. Silakan coba lagi.'))
    }, 120_000)

    const fail = (err: Error) => {
      if (settled) return
      settled = true
      es.close()
      popup.close()
      reject(err)
    }

    es.addEventListener('PB_CONNECT', async (e) => {
      clientId = (e as MessageEvent).lastEventId
      if (!clientId) return

      try {
        const sub = await fetch(`${API.pocketbase}/api/realtime`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId, subscriptions: ['@oauth2'] }),
        })
        if (!sub.ok) {
          throw new Error(`Gagal mendaftar realtime (HTTP ${sub.status}).`)
        }

        // authUrl PB sengaja berakhir dengan "&redirect_uri=" — append callback.
        const url = google.authUrl + encodeURIComponent(redirectURL)
        // state di authUrl WAJIB diganti clientId realtime (ClientById(state)).
        const finalUrl = url.replace(/state=[^&]+/, `state=${encodeURIComponent(clientId)}`)
        popup.location.href = finalUrl
      } catch (err) {
        fail(err instanceof Error ? err : new Error('Gagal menyambungkan realtime.'))
      }
    })

    es.addEventListener('@oauth2', async (e) => {
      if (settled) return
      let msg: { code?: string; error?: string }
      try {
        msg = JSON.parse((e as MessageEvent).data)
      } catch {
        return
      }

      if (msg.error || !msg.code) {
        fail(new Error(msg.error || 'Gagal mendapatkan kode OAuth2 dari Google.'))
        return
      }

      clearTimeout(timeout)
      settled = true
      es.close()
      popup.close()

      try {
        const auth = await completeOAuth2(google.name, msg.code, google.codeVerifier, redirectURL)
        resolve(auth)
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Gagal menyelesaikan login Google.'))
      }
    })

    es.onerror = () => {
      // EventSource auto-reconnect — timeout di atas sebagai pengaman akhir.
    }
  })
}

async function completeOAuth2(
  provider: string,
  code: string,
  codeVerifier: string,
  redirectUrl: string
): Promise<AuthState> {
  const res = await fetch(`${API.pocketbase}/api/collections/users/auth-with-oauth2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, code, codeVerifier, redirectURL: redirectUrl }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Gagal menyelesaikan login Google.')
  }

  const authState: AuthState = {
    token: data.token,
    record: {
      id: data.record.id,
      email: data.record.email,
      name: data.record.name || data.record.email.split('@')[0],
    },
  }

  setStoredAuth(authState.token, authState.record)
  return authState
}

export async function handleOAuth2Callback(): Promise<AuthState | null> {
  // Alur PB 0.39 tidak lagi membawa code+state kembali ke halaman aplikasi —
  // hasil dikirim via realtime @oauth2. Callback ini dipertahankan agar
  // komponen lama tidak perlu diubah.
  if (typeof window === 'undefined') return null
  return null
}

export function getStoredAuth(): AuthState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthState
    if (parsed && typeof parsed.token === 'string' && parsed.record?.email) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export function setStoredAuth(token: string, record: UserRecord): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, record }))
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export async function loginWithPassword(identity: string, password: string): Promise<AuthState> {
  const res = await fetch(`${API.pocketbase}/api/collections/users/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: identity.trim().toLowerCase(),
      password,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    const message = data.message || 'Email atau kata sandi tidak cocok.'
    throw new Error(message)
  }

  const authState: AuthState = {
    token: data.token,
    record: {
      id: data.record.id,
      email: data.record.email,
      name: data.record.name || data.record.email.split('@')[0],
    },
  }

  setStoredAuth(authState.token, authState.record)
  return authState
}

export async function registerWithPassword(
  name: string,
  email: string,
  password: string,
  passwordConfirm: string
): Promise<AuthState> {
  if (password !== passwordConfirm) {
    throw new Error('Konfirmasi kata sandi tidak cocok.')
  }
  if (password.length < 8) {
    throw new Error('Kata sandi minimal 8 karakter.')
  }

  const res = await fetch(`${API.pocketbase}/api/collections/users/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      passwordConfirm,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    let message = data.message || 'Gagal mendaftarkan akun.'
    if (data.data?.email?.message) {
      message = `Email: ${data.data.email.message}`
    } else if (data.data?.password?.message) {
      message = `Kata sandi: ${data.data.password.message}`
    }
    throw new Error(message)
  }

  return await loginWithPassword(email, password)
}

export async function fetchUserDashboard(token: string): Promise<DashboardData> {
  const res = await fetch(`${API.worker}/user/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await res.json()
  if (!res.ok) {
    if (res.status === 401) {
      clearStoredAuth()
      throw new Error('Sesi Anda telah berakhir. Silakan masuk kembali.')
    }
    throw new Error(data.error || 'Gagal memuat data dashboard.')
  }

  return {
    user: data.user,
    license: data.license,
    orders: data.orders || [],
  }
}

export async function createPaymentOrder(
  email: string,
  pkg: 'basic' | 'pro',
  period: 'weekly' | 'monthly' | 'yearly',
  method: string = 'qris'
): Promise<PaymentOrderResponse> {
  const res = await fetch(`${API.worker}/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      pkg,
      period,
      method,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.')
    }
    if (data.error === 'payment_sandbox') {
      throw new Error(
        'Proyek Pakasir masih mode Sandbox. Matikan Sandbox di dashboard Pakasir (proyek fotospace), lalu coba bayar lagi.'
      )
    }
    throw new Error('Gagal membuat pesanan pembayaran. Coba lagi beberapa saat.')
  }
  return data.order
}

export async function checkOrderStatus(orderId: string): Promise<UserOrder> {
  const res = await fetch(`${API.worker}/payment/status?order_id=${encodeURIComponent(orderId)}`)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Gagal memeriksa status pesanan.')
  }
  return data.order
}
