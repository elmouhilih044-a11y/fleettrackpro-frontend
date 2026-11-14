function DriverLayout({ user, view, onNavigate, children }) {
  const items = [
    { id: "home", label: "Accueil" },
    { id: "trips", label: "Mes trajets" },
  ]

  return (
    <div className="layout">
      <nav className="menu" aria-label={`Menu de ${user.firstName}`}>
        {items.map((item) => (
          <button
            key={item.id}
            className={view === item.id ? "active" : ""}
            aria-current={view === item.id ? "page" : undefined}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <section className="content">{children}</section>
    </div>
  )
}

export default DriverLayout