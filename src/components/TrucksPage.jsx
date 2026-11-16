import TruckList from "./TruckList"
import TruckForm from "./TruckForm"
import { TRUCK_STATUS_LABELS } from "../truckStatus"

function TrucksPage({
  trucks, loading, error, selectedId, onSelect,
  editingTruck, onEdit, onCancelEdit, onSave, onArchive, formError,
}) {
  const selectedTruck = trucks.find((truck) => truck._id === selectedId)

  function handleArchiveClick(truck) {
    if (window.confirm(`Archiver le camion ${truck.registrationNumber} ?`)) {
      onArchive(truck)
    }
  }

  return (
    <div>
      <h2>Camions</h2>

      {loading && <p>Chargement...</p>}
      {error && <p className="error" role="alert">{error}</p>}

      {!loading && (
        <TruckList trucks={trucks} selectedId={selectedId} onSelect={onSelect} />
      )}

      {selectedTruck && (
        <div className="panel">
          <h3>Détail</h3>
          <p>Immatriculation : {selectedTruck.registrationNumber}</p>
          <p>Marque : {selectedTruck.brand}</p>
          <p>Modèle : {selectedTruck.model}</p>
          <p>Kilométrage : {selectedTruck.currentMileage} km</p>
          <p>Statut : {TRUCK_STATUS_LABELS[selectedTruck.status]}</p>
          <div className="actions">
            <button onClick={() => onEdit(selectedTruck)}>Modifier</button>
            <button
              onClick={() => handleArchiveClick(selectedTruck)}
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
        onSubmit={onSave}
        onCancel={onCancelEdit}
        error={formError}
      />
    </div>
  )
}

export default TrucksPage