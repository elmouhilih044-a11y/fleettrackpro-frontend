import { Link } from "react-router-dom"
import { homeFor } from "../routing"

function ForbiddenPage({ session }) {
  return (
    <div className="login-form">
      <h1>Accès refusé</h1>
      <p>Vous n'avez pas les droits pour accéder à cette page.</p>
      <Link to={homeFor(session.user.role)}>Retour à l'accueil</Link>
    </div>
  )
}

export default ForbiddenPage