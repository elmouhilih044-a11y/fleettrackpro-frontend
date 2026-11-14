import { useState } from "react"

function LoginForm({ onLogin, loading, error }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim() || !password) {
      setFormError("Veuillez remplir l'email et le mot de passe.")
      return
    }
    setFormError("")
    const success = await onLogin(email.trim(), password)
    if (success) setPassword("")
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h1>FleetTrackPRO</h1>
      <h2>Connexion</h2>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {(formError || error) && (
        <p className="error" role="alert">
          {formError || error}
        </p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  )
}

export default LoginForm