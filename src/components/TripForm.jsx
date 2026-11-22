import { useState } from "react"

function TripForm({ drivers, trucks, trailers, onSubmit, error }) {
  const [departureSite, setDepartureSite] = useState("")
  const [arrivalSite, setArrivalSite] = useState("")
  const [goods, setGoods] = useState("")
  const [plannedStartDate, setPlannedStartDate] = useState("")
  const [plannedEndDate, setPlannedEndDate] = useState("")
  const [driver, setDriver] = useState("")
  const [truck, setTruck] = useState("")
  const [trailer, setTrailer] = useState("")
  const [sending, setSending] = useState(false)
  const [localError, setLocalError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    if (
      !departureSite.trim() || !arrivalSite.trim() || !goods.trim() ||
      !plannedStartDate || !plannedEndDate || !driver || !truck || !trailer
    ) {
      setLocalError("Tous les champs sont obligatoires.")
      return
    }
    if (new Date(plannedEndDate) <= new Date(plannedStartDate)) {
      setLocalError("La date de fin doit être après la date de début.")
      return
    }
    setLocalError("")
    setSending(true)
    await onSubmit({
      departureSite: departureSite.trim(),
      arrivalSite: arrivalSite.trim(),
      goods: goods.trim(),
      plannedStartDate: new Date(plannedStartDate).toISOString(),
      plannedEndDate: new Date(plannedEndDate).toISOString(),
      driver,
      truck,
      trailer,
    })
    setSending(false)
  }

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="departureSite">Site de départ</label>
      <input
        id="departureSite"
        value={departureSite}
        onChange={(event) => setDepartureSite(event.target.value)}
      />

      <label htmlFor="arrivalSite">Site d'arrivée</label>
      <input
        id="arrivalSite"
        value={arrivalSite}
        onChange={(event) => setArrivalSite(event.target.value)}
      />

      <label htmlFor="goods">Marchandise</label>
      <input id="goods" value={goods} onChange={(event) => setGoods(event.target.value)} />

      <label htmlFor="plannedStartDate">Début prévu</label>
      <input
        id="plannedStartDate"
        type="datetime-local"
        value={plannedStartDate}
        onChange={(event) => setPlannedStartDate(event.target.value)}
      />

      <label htmlFor="plannedEndDate">Fin prévue</label>
      <input
        id="plannedEndDate"
        type="datetime-local"
        value={plannedEndDate}
        onChange={(event) => setPlannedEndDate(event.target.value)}
      />

      <label htmlFor="tripDriver">Chauffeur</label>
      <select id="tripDriver" value={driver} onChange={(event) => setDriver(event.target.value)}>
        <option value="">Choisir un chauffeur</option>
        {drivers.map((item) => (
          <option key={item._id} value={item._id}>
            {item.firstName} {item.lastName}
          </option>
        ))}
      </select>

      <label htmlFor="tripTruck">Camion</label>
      <select id="tripTruck" value={truck} onChange={(event) => setTruck(event.target.value)}>
        <option value="">Choisir un camion</option>
        {trucks.map((item) => (
          <option key={item._id} value={item._id}>
            {item.registrationNumber} - {item.brand} {item.model}
          </option>
        ))}
      </select>

      <label htmlFor="tripTrailer">Remorque</label>
      <select id="tripTrailer" value={trailer} onChange={(event) => setTrailer(event.target.value)}>
        <option value="">Choisir une remorque</option>
        {trailers.map((item) => (
          <option key={item._id} value={item._id}>
            {item.registrationNumber} - {item.type}
          </option>
        ))}
      </select>

      {(localError || error) && (
        <p className="error" role="alert">{localError || error}</p>
      )}

      <button type="submit" disabled={sending}>
        {sending ? "Envoi en cours..." : "Créer et assigner le trajet"}
      </button>
    </form>
  )
}

export default TripForm