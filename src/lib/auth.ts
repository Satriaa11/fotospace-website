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
  pkg: 'basic' | 'pro'
  period: 'monthly' | 'yearly'
  amount: number
  fee: number
  total_payment: number
  payment_method: string
  payment_number: string
  status: 'pending' | 'completed' | 'cancelled' | 'expired'
  created?: string
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
  period: 'monthly' | 'yearly'
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
  const res = await fetch(`${API.pocketbase}/api/collections/users/auth-methods`)
  if (!res.ok) {
    throw new Error('Gagal mengambil konfigurasi login Google.')
  }

  const data = await res.json()
  const providers: OAuth2Provider[] =
    data.oauth2?.providers || data.authProviders || []
  const google = providers.find((p) => p.name === 'google')

  if (!google) {
    throw new Error(
      'Login Google belum diaktifkan di PocketBase Admin. Silakan aktifkan OAuth2 Google di https://license.pocketdb.fun/_/ atau login dengan Email.'
    )
  }

  // PB 0.39: authUrl sengaja mengosongkan redirect_uri — client wajib
  // menambahkan callback PB. Hasil auth dikirim balik lewat realtime
  // subscription "@oauth2" dengan clientId = state (lihat
  // apis/record_auth_with_oauth2_redirect.go).
  const redirectUri = `${API.pocketbase}/api/oauth2-redirect`

  await new Promise<AuthState>((resolve, reject) => {
    const es = new EventSource(
      `${API.pocketbase}/api/realtime?${new URLSearchParams({
        clientId: google.state,
        'subscriptions[@oauth2]': '@oauth2',
      })}`
    )

    const timeout = setTimeout(() => {
      es.close()
      reject(new Error('Login Google melebihi batas waktu. Silakan coba lagi.'))
    }, 120_000)

    es.onmessage = async (evt) => {
      let msg: { name?: string; data?: { code?: string } }
      try {
        msg = JSON.parse(evt.data)
      } catch {
        return
      }
      if (msg.name !== '@oauth2' || !msg.data?.code) return

      clearTimeout(timeout)
      es.close()

      try {
        const auth = await completeOAuth2(
          google.name,
          msg.data.code,
          google.codeVerifier,
          redirectUri
        )
        resolve(auth)
      } catch (err) {
        reject(err)
      }
    }

    const popup = window.open(
      `${google.authUrl}${encodeURIComponent(redirectUri)}`,
      'fotospace-oauth2',
      'width=520,height=640,popup=yes'
    )

    if (!popup) {
      clearTimeout(timeout)
      es.close()
      reject(
        new Error('Popup login diblokir browser. Izinkan popup untuk fotospace.online lalu coba lagi.')
      )
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
    body: JSON.stringify({ provider, code, codeVerifier, redirectUrl }),
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

  // Auto login setelah registrasi berhasil
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
  period: 'monthly' | 'yearly',
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
    throw new Error(data.error || data.detail || 'Gagal membuat pesanan pembayaran.')
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
