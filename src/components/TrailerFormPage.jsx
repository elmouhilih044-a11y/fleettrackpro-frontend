import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createTrailer, errorMessage } from "../api"
import TrailerForm from "./TrailerForm"

function TrailerFormPage({ token }) {
  const navigate = useNavigate()
  const [formError, setFormError] = useState("")

  async function handleCreate(data) {
    setFormError("")
    try {
      await createTrailer(token, data)
      navigate("/admin/remorques")
    } catch (caught) {
      setFormError(errorMessage(caught))
    }
  }

  return (
    <div>
      <p>
        <Link to="/admin/remorques">← Retour aux remorques</Link>
      </p>
      <h2>Nouvelle remorque</h2>
      <TrailerForm onSubmit={handleCreate} error={formError} />
    </div>
  )
}

export default TrailerFormPage