import { useState } from "react"
import { TRUCK_STATUS_LABELS } from "../truckStatus"

function TrailerForm({ initialValues, onSubmit, onCancel, error }) {
  const [registrationNumber, setRegistrationNumber] = useState(
    initialValues ? initialValues.registrationNumber : ""
  )
  const [type, setType] = useState(initialValues ? initialValues.type : "")
  const [currentMileage, setCurrentMileage] = useState(
    initialValues ? String(initialValues.currentMileage) : ""
  )
  const [status, setStatus] = useState(initialValues ? initialValues.status : "available")
  const [localError, setLocalError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    if (!registrationNumber.trim() || !type.trim() || currentMileage === "") {
      setLocalError("Tous les champs sont obligatoires.")
      return
    }
    if (Number.isNaN(Number(currentMileage)) || Number(currentMileage) < 0) {
      setLocalError("Le kilométrage doit être un nombre positif.")
      return
    }
    setLocalError("")

    const data = {
      registrationNumber: registrationNumber.trim(),
      type: type.trim(),
      currentMileage: Number(currentMileage),
    }
    if (initialValues) {
      data.status = status
    }
    await onSubmit(data)
  }

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="trailerRegistration">Immatriculation</label>
      <input
        id="trailerRegistration"
        value={registrationNumber}
        onChange={(event) => setRegistrationNumber(event.target.value)}
      />

      <label htmlFor="trailerType">Type</label>
      <input id="trailerType" value={type} onChange={(event) => setType(event.target.value)} />

      <label htmlFor="trailerMileage">Kilométrage actuel</label>
      <input
        id="trailerMileage"
        type="number"
        value={currentMileage}
        onChange={(event) => setCurrentMileage(event.target.value)}
      />

      {initialValues && (
        <>
          <label htmlFor="trailerStatus">Statut</label>
          <select
            id="trailerStatus"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="available">{TRUCK_STATUS_LABELS.available}</option>
            <option value="maintenance">{TRUCK_STATUS_LABELS.maintenance}</option>
            <option value="inactive">{TRUCK_STATUS_LABELS.inactive}</option>
          </select>
        </>
      )}

      {(localError || error) && (
        <p className="error" role="alert">{localError || error}</p>
      )}

      <div className="actions">
        <button type="submit">{initialValues ? "Enregistrer" : "Créer la remorque"}</button>
        {initialValues && <button type="button" onClick={onCancel}>Annuler</button>}
      </div>
    </form>
  )
}

export default TrailerForm