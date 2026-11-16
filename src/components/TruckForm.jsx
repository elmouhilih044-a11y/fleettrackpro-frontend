import { useState } from "react"
import { TRUCK_STATUS_LABELS } from "../truckStatus"

function TruckForm({ initialValues, onSubmit, onCancel, error }) {
  const [registrationNumber, setRegistrationNumber] = useState(
    initialValues ? initialValues.registrationNumber : ""
  )
  const [brand, setBrand] = useState(initialValues ? initialValues.brand : "")
  const [model, setModel] = useState(initialValues ? initialValues.model : "")
  const [currentMileage, setCurrentMileage] = useState(
    initialValues ? String(initialValues.currentMileage) : ""
  )
  const [status, setStatus] = useState(initialValues ? initialValues.status : "available")
  const [localError, setLocalError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    if (!registrationNumber.trim() || !brand.trim() || !model.trim() || currentMileage === "") {
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
      brand: brand.trim(),
      model: model.trim(),
      currentMileage: Number(currentMileage),
    }
    if (initialValues) {
      data.status = status
    }

    const success = await onSubmit(data)

    if (success && !initialValues) {
      setRegistrationNumber("")
      setBrand("")
      setModel("")
      setCurrentMileage("")
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="registrationNumber">Immatriculation</label>
      <input
        id="registrationNumber"
        value={registrationNumber}
        onChange={(event) => setRegistrationNumber(event.target.value)}
      />

      <label htmlFor="brand">Marque</label>
      <input id="brand" value={brand} onChange={(event) => setBrand(event.target.value)} />

      <label htmlFor="model">Modèle</label>
      <input id="model" value={model} onChange={(event) => setModel(event.target.value)} />

      <label htmlFor="currentMileage">Kilométrage actuel</label>
      <input
        id="currentMileage"
        type="number"
        value={currentMileage}
        onChange={(event) => setCurrentMileage(event.target.value)}
      />

      {initialValues && (
        <>
          <label htmlFor="truckStatus">Statut</label>
          <select
            id="truckStatus"
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
        <button type="submit">{initialValues ? "Enregistrer" : "Créer le camion"}</button>
        {initialValues && (
          <button type="button" onClick={onCancel}>Annuler</button>
        )}
      </div>
    </form>
  )
}

export default TruckForm