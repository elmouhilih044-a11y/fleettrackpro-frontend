import UserList from "./UserList"
import UserForm from "./UserForm"

function UsersPage({
  users, loading, error, selectedId,
  onSelect, onToggleStatus, onCreate, formError,
}) {
  const selectedUser = users.find((user) => user._id === selectedId)

  return (
    <div>
      <h2>Utilisateurs</h2>

      {loading && <p>Chargement...</p>}
      {error && <p className="error" role="alert">{error}</p>}

      {!loading && (
        <UserList users={users} selectedId={selectedId} onSelect={onSelect} />
      )}

      {selectedUser && (
        <div className="panel">
          <h3>Détail</h3>
          <p>Nom : {selectedUser.firstName} {selectedUser.lastName}</p>
          <p>Email : {selectedUser.email}</p>
          <p>Statut : {selectedUser.status === "suspended" ? "Suspendu" : "Actif"}</p>
          <button onClick={() => onToggleStatus(selectedUser)}>
            {selectedUser.status === "suspended" ? "Réactiver" : "Suspendre"}
          </button>
        </div>
      )}

      <h3>Créer un chauffeur</h3>
      <UserForm onCreate={onCreate} error={formError} />
    </div>
  )
}

export default UsersPage