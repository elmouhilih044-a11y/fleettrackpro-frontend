import { NavLink, Outlet } from "react-router-dom"
import AppShell from "./AppShell"

function AdminLayout({ user, onLogout }) {
  const items = [
    { to: "/admin", label: "Accueil", end: true },
    { to: "/admin/utilisateurs", label: "Utilisateurs" },
    { to: "/admin/camions", label: "Camions" },
  ]

  return (
    <AppShell user={user} onLogout={onLogout}>
      <div className="layout">
        <nav className="menu" aria-label="Menu administrateur">
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

export default AdminLayout