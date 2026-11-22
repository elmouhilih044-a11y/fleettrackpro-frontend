import { Link, useParams } from "react-router-dom"
import { useApiGet } from "../useApiGet"
import ResourceState from "./ResourceState"
import { TRIP_STATUS_LABELS } from "../tripStatus"
import { formatDate, personName } from "../format"

function TripDetailPage({ token }) {
  const { id } = useParams()
  const { data: trip, status, error, reload } = useApiGet(`/trips/${id}`, token)

  return (
    <div>
      <p>
        <Link to="/admin/trajets">← Retour aux trajets</Link>
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
          <h3>Ressources assignées</h3>
          <p>Chauffeur : {personName(trip.driver)}</p>
          <p>Camion : {trip.truck ? trip.truck.registrationNumber : "—"}</p>
          <p>Remorque : {trip.trailer ? trip.trailer.registrationNumber : "—"}</p>
        </div>
      )}
    </div>
  )
}

export default TripDetailPage