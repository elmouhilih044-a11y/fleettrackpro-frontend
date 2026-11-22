import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useApiGet } from "../useApiGet"
import { createTrip, errorMessage } from "../api"
import ResourceState from "./ResourceState"
import TripForm from "./TripForm"

function TripFormPage({ token }) {
  const navigate = useNavigate()
  const driversRes = useApiGet("/users/drivers", token)
  const trucksRes = useApiGet("/trucks", token)
  const trailersRes = useApiGet("/trailers", token)
  const [formError, setFormError] = useState("")

  const pending = [driversRes, trucksRes, trailersRes].find((res) => res.status !== "ready")

  async function handleCreate(data) {
    setFormError("")
    try {
      await createTrip(token, data)
      navigate("/admin/trajets")
    } catch (caught) {
      setFormError(errorMessage(caught))
    }
  }

  return (
    <div>
      <p>
        <Link to="/admin/trajets">← Retour aux trajets</Link>
      </p>
      <h2>Nouveau trajet</h2>

      {pending && (
        <ResourceState status={pending.status} error={pending.error} onRetry={pending.reload} />
      )}

      {!pending && (
        <TripForm
          drivers={driversRes.data.filter((driver) => driver.status === "active")}
          trucks={trucksRes.data.filter((truck) => truck.status === "available")}
          trailers={trailersRes.data.filter((trailer) => trailer.status === "available")}
          onSubmit={handleCreate}
          error={formError}
        />
      )}
    </div>
  )
}

export default TripFormPage