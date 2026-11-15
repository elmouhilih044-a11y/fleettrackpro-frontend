import { useState } from "react"
import UserCard from "./UserCard"

function UserList({ users, selectedId, onSelect }) {
  const [filter, setFilter] = useState("all")

  const shownUsers =
    filter === "all" ? users : users.filter((user) => user.status === filter)

  return (
    <div>
      <label htmlFor="user-filter">Filtrer par statut</label>
      <select
        id="user-filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      >
        <option value="all">Tous</option>
        <option value="active">Actifs</option>
        <option value="suspended">Suspendus</option>
      </select>

      {shownUsers.length === 0 ? (
        <p>Aucun chauffeur à afficher.</p>
      ) : (
        <ul className="list">
          {shownUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              selected={user._id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserList