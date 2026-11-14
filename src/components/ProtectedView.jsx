function ProtectedView({ session, allowedRoles, children }) {
  if (!session) {
    return <p role="alert">Connexion requise.</p>
  }
  if (!allowedRoles.includes(session.user.role)) {
    return (
      <p className="error" role="alert">
        Accès refusé : vous n'avez pas les droits pour cette page.
      </p>
    )
  }
  return children
}

export default ProtectedView