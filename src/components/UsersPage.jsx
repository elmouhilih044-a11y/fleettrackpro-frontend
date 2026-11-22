import { useState } from "react"
import { useApiGet } from "../useApiGet"
import { createDriver, suspendDriver, activateDriver, errorMessage } from "../api"
import ResourceState from "./ResourceState"
import UserList from "./UserList"
import UserForm from "./UserForm"

function UsersPage({ token }) {
  const { data: users, status, error, reload } = useApiGet("/users/drivers", token)
  const [selectedId, setSelectedId] = useState(null)
  const [formError, setFormError] = useState("")
  const [actionError, setActionError] = useState("")

  const selectedUser = users ? users.find((user) => user._id === selectedId) : undefined

  async function handleCreate(driver) {
    setFormError("")
    try {
      await createDriver(token, driver)
      reload()
      return true
    } catch (caught) {
      setFormError(errorMessage(caught))
      return false
    }
  }

  async function handleToggleStatus(user) {
    setActionError("")
    try {
      if (user.status === "suspended") {
        await activateDriver(token, user._id)
      } else {
        await suspendDriver(token, user._id)
      }
      reload()
    } catch (caught) {
      setActionError(errorMessage(caught))
    }
  }

  return (
    <div>
      <h2>Utilisateurs</h2>

      <ResourceState status={status} error={error} onRetry={reload} />
      {actionError && <p className="error" role="alert">{actionError}</p>}

      {users && status !== "error" && (
        <UserList users={users} selectedId={selectedId} onSelect={setSelectedId} />
      )}

      {selectedUser && status !== "error" && (
        <div className="panel">
          <h3>Détail</h3>
          <p>Nom : {selectedUser.firstName} {selectedUser.lastName}</p>
          <p>Email : {selectedUser.email}</p>
          <p>Statut : {selectedUser.status === "suspended" ? "Suspendu" : "Actif"}</p>
          <button onClick={() => handleToggleStatus(selectedUser)}>
            {selectedUser.status === "suspended" ? "Réactiver" : "Suspendre"}
          </button>
        </div>
      )}

      <h3>Créer un chauffeur</h3>
      <UserForm onCreate={handleCreate} error={formError} />
    </div>
  )
}

export default UsersPage