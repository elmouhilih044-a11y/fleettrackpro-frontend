import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useApiGet } from "../useApiGet"
import { updateMyTripStatus, errorMessage } from "../api"
import ResourceState from "./ResourceState"
import { TRIP_STATUS_LABELS } from "../tripStatus"
import { formatDate } from "../format"

const NEXT_STATUS = {
  todo: { value: "in_progress", label: "Démarrer le trajet" },
  in_progress: { value: "completed", label: "Terminer le trajet" },
}

function MyTripDetailPage({ token }) {
  const { id } = useParams()
  const { data: trip, status, error, reload } = useApiGet(`/my-trips/${id}`, token)
  const [sending, setSending] = useState(false)
  const [actionError, setActionError] = useState("")

  const next = status === "ready" ? NEXT_STATUS[trip.status] : undefined

  async function handleAdvance() {
    setSending(true)
    setActionError("")
    try {
      await updateMyTripStatus(token, id, next.value)
      reload()
    } catch (caught) {
      setActionError(errorMessage(caught))
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <p>
        <Link to="/chauffeur/trajets">← Retour à mes trajets</Link>
      </p>
      <h2>Détail du trajet</h2>

      <ResourceState status={status} error={error} onRetry={reload} />

      {status === "ready" && (
        <div className="panel">
          <p>Départ : {trip.departureSite}</p>
          <p>Arrivée : {trip.arrivalSite}</p>
          <p>Marchandise : {trip.goods}</p>
          <p>
            Du {formatDate(trip.plannedStartDate)} au {formatDate(trip.plannedEndDate)}
          </p>
          <p>Statut : {TRIP_STATUS_LABELS[trip.status]}</p>

          {next && (
            <button onClick={handleAdvance} disabled={sending}>
              {sending ? "Envoi en cours..." : next.label}
            </button>
          )}
          {actionError && <p className="error" role="alert">{actionError}</p>}
        </div>
      )}
    </div>
  )
}

export default MyTripDetailPage