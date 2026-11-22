export function formatDate(value) {
  return new Date(value).toLocaleDateString("fr-FR")
}
export function personName(person) {
  return person ? `${person.firstName} ${person.lastName}` : "—"
}