import { Link } from "react-router-dom"
import { useApiGet } from "../useApiGet"
import ResourceState from "./ResourceState"
import { TRIP_STATUS_LABELS } from "../tripStatus"
import { formatDate, personName } from "../format"

function TripsListPage({ token }) {
  const { data: trips, status, error, reload } = useApiGet("/trips", token)

  return (
    <div>
      <h2>Trajets</h2>
      <p>
        <Link to="/admin/trajets/nouveau">+ Nouveau trajet</Link>
      </p>

      <ResourceState status={status} error={error} onRetry={reload} />

      {status === "ready" && trips.length === 0 && <p>Aucun trajet enregistré.</p>}

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
              <p>Chauffeur : {personName(trip.driver)}</p>
              <Link to={`/admin/trajets/${trip._id}`}>Voir le détail</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TripsListPage