import { useState } from "react"
import { useApiGet } from "../useApiGet"
import { createTruck, updateTruck, archiveTruck, errorMessage } from "../api"
import ResourceState from "./ResourceState"
import TruckList from "./TruckList"
import TruckForm from "./TruckForm"
import { TRUCK_STATUS_LABELS } from "../truckStatus"

function TrucksPage({ token }) {
  const { data: trucks, status, error, reload } = useApiGet("/trucks", token)
  const [selectedId, setSelectedId] = useState(null)
  const [editingTruck, setEditingTruck] = useState(null)
  const [formError, setFormError] = useState("")
  const [actionError, setActionError] = useState("")

  const selectedTruck = trucks ? trucks.find((truck) => truck._id === selectedId) : undefined

  async function handleSave(data) {
    setFormError("")
    try {
      if (editingTruck) {
        await updateTruck(token, editingTruck._id, data)
      } else {
        await createTruck(token, data)
      }
      reload()
      setEditingTruck(null)
      return true
    } catch (caught) {
      setFormError(errorMessage(caught))
      return false
    }
  }

  async function handleArchive(truck) {
    if (!window.confirm(`Archiver le camion ${truck.registrationNumber} ?`)) return
    setActionError("")
    try {
      await archiveTruck(token, truck._id)
      reload()
    } catch (caught) {
      setActionError(errorMessage(caught))
    }
  }

  function handleEdit(truck) {
    setFormError("")
    setEditingTruck(truck)
  }

  function handleCancelEdit() {
    setFormError("")
    setEditingTruck(null)
  }

  return (
    <div>
      <h2>Camions</h2>

      <ResourceState status={status} error={error} onRetry={reload} />
      {actionError && <p className="error" role="alert">{actionError}</p>}

      {trucks && status !== "error" && (
        <TruckList trucks={trucks} selectedId={selectedId} onSelect={setSelectedId} />
      )}

      {selectedTruck && status !== "error" && (
        <div className="panel">
          <h3>Détail</h3>
          <p>Immatriculation : {selectedTruck.registrationNumber}</p>
          <p>Marque : {selectedTruck.brand}</p>
          <p>Modèle : {selectedTruck.model}</p>
          <p>Kilométrage : {selectedTruck.currentMileage} km</p>
          <p>Statut : {TRUCK_STATUS_LABELS[selectedTruck.status]}</p>
          <div className="actions">
            <button onClick={() => handleEdit(selectedTruck)}>Modifier</button>
            <button
              onClick={() => handleArchive(selectedTruck)}
              disabled={selectedTruck.status === "inactive"}
            >
              Archiver
            </button>
          </div>
        </div>
      )}

      <h3>{editingTruck ? "Modifier le camion" : "Créer un camion"}</h3>
      <TruckForm
        key={editingTruck ? editingTruck._id : "new"}
        initialValues={editingTruck}
        onSubmit={handleSave}
        onCancel={handleCancelEdit}
        error={formError}
      />
    </div>
  )
}

export default TrucksPage