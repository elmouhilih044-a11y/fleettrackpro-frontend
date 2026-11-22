import { Link } from "react-router-dom"
import { useApiGet } from "../useApiGet"
import ResourceState from "./ResourceState"
import { TRUCK_STATUS_LABELS } from "../truckStatus"

function TrailersListPage({ token }) {
  const { data: trailers, status, error, reload } = useApiGet("/trailers", token)

  return (
    <div>
      <h2>Remorques</h2>
      <p>
        <Link to="/admin/remorques/nouveau">+ Nouvelle remorque</Link>
      </p>

      <ResourceState status={status} error={error} onRetry={reload} />

      {status === "ready" && trailers.length === 0 && <p>Aucune remorque enregistrée.</p>}

      {status === "ready" && (
        <ul className="list">
          {trailers.map((trailer) => (
            <li key={trailer._id} className="panel">
              <p>
                <strong>{trailer.registrationNumber}</strong> - {trailer.type}
              </p>
              <p>Statut : {TRUCK_STATUS_LABELS[trailer.status]}</p>
              <Link to={`/admin/remorques/${trailer._id}`}>Voir le détail</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TrailersListPage