import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useApiGet } from "../useApiGet"
import { updateTrailer, archiveTrailer, errorMessage } from "../api"
import ResourceState from "./ResourceState"
import TrailerForm from "./TrailerForm"
import { TRUCK_STATUS_LABELS } from "../truckStatus"

function TrailerDetailPage({ token }) {
  const { id } = useParams()
  const { data: trailer, status, error, reload } = useApiGet(`/trailers/${id}`, token)
  const [editing, setEditing] = useState(false)
  const [formError, setFormError] = useState("")
  const [actionError, setActionError] = useState("")

  async function handleSave(data) {
    setFormError("")
    try {
      await updateTrailer(token, id, data)
      reload()
      setEditing(false)
    } catch (caught) {
      setFormError(errorMessage(caught))
    }
  }

  async function handleArchive() {
    if (!window.confirm(`Archiver la remorque ${trailer.registrationNumber} ?`)) return
    setActionError("")
    try {
      await archiveTrailer(token, id)
      reload()
    } catch (caught) {
      setActionError(errorMessage(caught))
    }
  }

  function handleCancel() {
    setFormError("")
    setEditing(false)
  }

  return (
    <div>
      <p>
        <Link to="/admin/remorques">← Retour aux remorques</Link>
      </p>
      <h2>Détail de la remorque</h2>

      <ResourceState status={status} error={error} onRetry={reload} />

      {status === "ready" && !editing && (
        <div className="panel">
          <p>Immatriculation : {trailer.registrationNumber}</p>
          <p>Type : {trailer.type}</p>
          <p>Kilométrage : {trailer.currentMileage} km</p>
          <p>Statut : {TRUCK_STATUS_LABELS[trailer.status]}</p>
          <div className="actions">
            <button onClick={() => setEditing(true)}>Modifier</button>
            <button onClick={handleArchive} disabled={trailer.status === "inactive"}>
              Archiver
            </button>
          </div>
          {actionError && <p className="error" role="alert">{actionError}</p>}
        </div>
      )}

      {status === "ready" && editing && (
        <TrailerForm
          initialValues={trailer}
          onSubmit={handleSave}
          onCancel={handleCancel}
          error={formError}
        />
      )}
    </div>
  )
}

export default TrailerDetailPage