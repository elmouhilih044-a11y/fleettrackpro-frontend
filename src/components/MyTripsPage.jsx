import { Link } from "react-router-dom"
import { useApiGet } from "../useApiGet"
import ResourceState from "./ResourceState"
import { TRIP_STATUS_LABELS } from "../tripStatus"
import { formatDate } from "../format"

function MyTripsPage({ token }) {
  const { data: trips, status, error, reload } = useApiGet("/my-trips", token)

  return (
    <div>
      <h2>Mes trajets</h2>

      <ResourceState status={status} error={error} onRetry={reload} />

      {status === "ready" && trips.length === 0 && (
        <p>Aucun trajet assigné pour le moment.</p>
      )}

      {status === "ready" && (
        <ul className="list">
          {trips.map((trip) => (
            <li key={trip._id} className="panel">
              <p>
                <strong>{trip.departureSite} → {trip.arrivalSite}</strong>
              </p>
              <p>
                Du {formatDate(trip.plannedStartDate)} au {formatDate(trip.plannedEndDate)}
              </p>
              <p>Statut : {TRIP_STATUS_LABELS[trip.status]}</p>
              <Link to={`/chauffeur/trajets/${trip._id}`}>Voir le détail</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyTripsPage