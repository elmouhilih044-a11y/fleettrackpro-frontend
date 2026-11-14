const BASE_URL = import.meta.env.VITE_API_URL

export async function request(path, { method = "GET", body, token } = {}) {
  const headers = {}
  if (body) headers["Content-Type"] = "application/json"
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    const error = new Error("Serveur injoignable. Vérifiez que l'API est démarrée.")
    error.status = 0
    throw error
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Une erreur est survenue")
    error.status = response.status
    throw error
  }
  return data
}

export function login(email, password) {
  return request("/auth/login", { method: "POST", body: { email, password } })
}