import { useState } from "react"
import { login } from "./api"
import LoginForm from "./components/LoginForm"
import AppShell from "./components/AppShell"
import AdminLayout from "./components/AdminLayout"
import DriverLayout from "./components/DriverLayout"
import ProtectedView from "./components/ProtectedView"

function App() {
  const [session, setSession] = useState(null)
  const [view, setView] = useState("home")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  async function handleLogin(email, password) {
    setLoginLoading(true)
    setLoginError("")
    try {
      const data = await login(email, password)
      setSession({ token: data.token, user: data.user })
      setView("home")
      return true
    } catch (error) {
      setLoginError(error.message)
      return false
    } finally {
      setLoginLoading(false)
    }
  }

  function handleLogout() {
    setSession(null)
    setView("home")
  }

  if (!session) {
    return <LoginForm onLogin={handleLogin} loading={loginLoading} error={loginError} />
  }

  function renderView() {
    if (view === "users") {
      return (
        <ProtectedView session={session} allowedRoles={["admin"]}>
          <h2>Utilisateurs</h2>
          <p>La liste arrive à l'étape E.</p>
        </ProtectedView>
      )
    }
    if (view === "trucks") {
      return (
        <ProtectedView session={session} allowedRoles={["admin"]}>
          <h2>Camions</h2>
          <p>La liste arrive à l'étape F.</p>
        </ProtectedView>
      )
    }
    if (view === "trips") {
      return (
        <ProtectedView session={session} allowedRoles={["driver"]}>
          <h2>Mes trajets</h2>
          <p>La liste arrive à l'étape G.</p>
        </ProtectedView>
      )
    }
    return (
      <>
        <h2>Accueil</h2>
        <p>
          Bienvenue {session.user.firstName}, vous êtes connecté en tant que{" "}
          {session.user.role === "admin" ? "Admin" : "Chauffeur"}.
        </p>
      </>
    )
  }

  const Layout = session.user.role === "admin" ? AdminLayout : DriverLayout

  return (
    <AppShell user={session.user} onLogout={handleLogout}>
      <Layout user={session.user} view={view} onNavigate={setView}>
        {renderView()}
      </Layout>
    </AppShell>
  )
}

export default App