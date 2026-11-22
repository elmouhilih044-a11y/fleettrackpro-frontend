export function homeFor(role) {
  return role === "admin" ? "/admin" : "/chauffeur"
}

export function allowedDestination(role, from) {
  const prefix = role === "admin" ? "/admin" : "/chauffeur"
  if (from && from.startsWith(prefix)) return from
  return homeFor(role)
}