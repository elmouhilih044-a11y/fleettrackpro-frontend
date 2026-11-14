function AppShell({ user, onLogout, children }) {
  const roleLabel = user.role === "admin" ? "Admin" : "Chauffeur"

  return (
    <div>
      <header className="app-header">
        <span>
          {user.firstName} {user.lastName} ({roleLabel})
        </span>
        <button onClick={onLogout}>Se déconnecter</button>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}

export default AppShell