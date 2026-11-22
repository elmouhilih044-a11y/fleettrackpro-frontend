import { NavLink, Outlet } from "react-router-dom"
import AppShell from "./AppShell"

function DriverLayout({ user, onLogout }) {
  const items = [
    { to: "/chauffeur", label: "Accueil", end: true },
    { to: "/chauffeur/trajets", label: "Mes trajets" },
  ]

  return (
    <AppShell user={user} onLogout={onLogout}>
      <div className="layout">
        <nav className="menu" aria-label="Menu chauffeur">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <section className="content">
          <Outlet />
        </section>
      </div>
    </AppShell>
  )
}

export default DriverLayout