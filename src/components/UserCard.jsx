function UserCard({ user, selected, onSelect }) {
  return (
    <li>
      <button
        className={selected ? "card active" : "card"}
        onClick={() => onSelect(user._id)}
      >
        {user.firstName} {user.lastName} ({user.status === "suspended" ? "Suspendu" : "Actif"})
      </button>
    </li>
  )
}

export default UserCard