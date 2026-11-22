function ResourceState({ status, error, onRetry }) {
  if (status === "loading") return <p>Chargement...</p>

  if (status === "error") {
    let message = error.message
    if (error.status === 403) message = "Accès refusé."
    if (error.status === 404) message = "Introuvable."
    return (
      <div>
        <p className="error" role="alert">{message}</p>
        <button onClick={onRetry}>Réessayer</button>
      </div>
    )
  }
  return null
}

export default ResourceState