import { useState } from "react"

function UserForm({ onCreate, error }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setLocalError("Tous les champs sont obligatoires.")
      return
    }
    if (password.length < 6) {
      setLocalError("Le mot de passe doit avoir au moins 6 caractères.")
      return
    }
    setLocalError("")

    const success = await onCreate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    })

    if (success) {
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="firstName">Prénom</label>
      <input id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />

      <label htmlFor="lastName">Nom</label>
      <input id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />

      <label htmlFor="newEmail">Email</label>
      <input id="newEmail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />

      <label htmlFor="newPassword">Mot de passe</label>
      <input id="newPassword" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />

      {(localError || error) && (
        <p className="error" role="alert">{localError || error}</p>
      )}

      <button type="submit">Créer le chauffeur</button>
    </form>
  )
}

export default UserForm