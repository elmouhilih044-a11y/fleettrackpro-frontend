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

export function getDrivers(token) {
  return request("/users/drivers", { token })
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

export function getTrucks(token) {
  return request("/trucks", { token })
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