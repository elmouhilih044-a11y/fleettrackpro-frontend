const BASE_URL = import.meta.env.VITE_API_URL

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export function errorMessage(error) {
  if (error.status === 403) return "Accès refusé."
  return error.message
}

export async function request(path, { method = "GET", body, token, signal } = {}) {
  const headers = {}
  if (body) headers["Content-Type"] = "application/json"
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (caught) {
    if (caught.name === "AbortError") throw caught
    const error = new Error("Serveur injoignable. Vérifiez que l'API est démarrée.")
    error.status = 0
    throw error
  }

  let data = null
  try {
    data = await response.json()
  } catch (caught) {
    if (caught.name === "AbortError") throw caught
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Une erreur est survenue")
    error.status = response.status
    if (response.status === 401 && token && unauthorizedHandler) {
      unauthorizedHandler()
    }
    throw error
  }
  return data
}

export function login(email, password) {
  return request("/auth/login", { method: "POST", body: { email, password } })
}

export function createDriver(token, driver) {
  return request("/users/drivers", { method: "POST", body: driver, token })
}

export function suspendDriver(token, id) {
  return request(`/users/drivers/${id}/suspend`, { method: "PUT", token })
}

export function activateDriver(token, id) {
  return request(`/users/drivers/${id}/activate`, { method: "PUT", token })
}

export function createTruck(token, truck) {
  return request("/trucks", { method: "POST", body: truck, token })
}

export function updateTruck(token, id, truck) {
  return request(`/trucks/${id}`, { method: "PUT", body: truck, token })
}

export function archiveTruck(token, id) {
  return request(`/trucks/${id}`, { method: "DELETE", token })
}

export function updateMyTripStatus(token, id, status) {
  return request(`/my-trips/${id}/status`, { method: "PUT", body: { status }, token })
}