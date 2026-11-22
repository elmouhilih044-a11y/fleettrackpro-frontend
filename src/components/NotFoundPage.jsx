import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <div className="login-form">
      <h1>Page introuvable (404)</h1>
      <p>Cette adresse n'existe pas.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  )
}

export default NotFoundPage