import { useState } from "react"
import {
  login, getDrivers, createDriver, suspendDriver, activateDriver,
  getTrucks, createTruck, updateTruck, archiveTruck,
} from "./api"
import LoginForm from "./components/LoginForm"
import AppShell from "./components/AppShell"
import AdminLayout from "./components/AdminLayout"
import DriverLayout from "./components/DriverLayout"
import ProtectedView from "./components/ProtectedView"
import UsersPage from "./components/UsersPage"
import TrucksPage from "./components/TrucksPage"

function App() {
  const [session, setSession] = useState(null)
  const [view, setView] = useState("home")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState("")
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [formError, setFormError] = useState("")


  const [trucks, setTrucks] = useState([])
  const [trucksLoading, setTrucksLoading] = useState(false)
  const [trucksError, setTrucksError] = useState("")
  const [selectedTruckId, setSelectedTruckId] = useState(null)
  const [editingTruck, setEditingTruck] = useState(null)
  const [truckFormError, setTruckFormError] = useState("")

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
    setUsers([])
    setSelectedUserId(null)
    setUsersError("")
    setFormError("")
    setTrucks([])
    setSelectedTruckId(null)
    setEditingTruck(null)
    setTrucksError("")
    setTruckFormError("")
  }

  function handleApiError(error, showMessage) {
    if (error.status === 401) {
      handleLogout()
      setLoginError("Session expirée. Veuillez vous reconnecter.")
      return
    }
    if (error.status === 403) {
      showMessage("Accès refusé.")
      return
    }
    showMessage(error.message)
  }

  async function loadUsers() {
    setUsersLoading(true)
    setUsersError("")
    try {
      setUsers(await getDrivers(session.token))
    } catch (error) {
      handleApiError(error, setUsersError)
    } finally {
      setUsersLoading(false)
    }
  }

  async function loadTrucks() {
    setTrucksLoading(true)
    setTrucksError("")
    try {
      setTrucks(await getTrucks(session.token))
    } catch (error) {
      handleApiError(error, setTrucksError)
    } finally {
      setTrucksLoading(false)
    }
  }

  function handleNavigate(newView) {
    setView(newView)
    if (session.user.role === "admin") {
      if (newView === "users") loadUsers()
      if (newView === "trucks") loadTrucks()
    }
  }

  async function handleCreateUser(driver) {
    setFormError("")
    try {
      await createDriver(session.token, driver)
      await loadUsers()
      return true
    } catch (error) {
      handleApiError(error, setFormError)
      return false
    }
  }

  async function handleToggleStatus(user) {
    setUsersError("")
    try {
      if (user.status === "suspended") {
        await activateDriver(session.token, user._id)
      } else {
        await suspendDriver(session.token, user._id)
      }
      await loadUsers()
    } catch (error) {
      handleApiError(error, setUsersError)
    }
  }

 
  function handleEditTruck(truck) {
    setTruckFormError("")
    setEditingTruck(truck)
  }

  function handleCancelEdit() {
    setTruckFormError("")
    setEditingTruck(null)
  }

  async function handleSaveTruck(data) {
    setTruckFormError("")
    try {
      if (editingTruck) {
        await updateTruck(session.token, editingTruck._id, data)
      } else {
        await createTruck(session.token, data)
      }
      await loadTrucks()
      setEditingTruck(null)
      return true
    } catch (error) {
      handleApiError(error, setTruckFormError)
      return false
    }
  }

  async function handleArchiveTruck(truck) {
    setTrucksError("")
    try {
      await archiveTruck(session.token, truck._id)
      await loadTrucks()
    } catch (error) {
      handleApiError(error, setTrucksError)
    }
  }

  if (!session) {
    return <LoginForm onLogin={handleLogin} loading={loginLoading} error={loginError} />
  }

  function renderView() {
    if (view === "users") {
      return (
        <ProtectedView session={session} allowedRoles={["admin"]}>
          <UsersPage
            users={users}
            loading={usersLoading}
            error={usersError}
            selectedId={selectedUserId}
            onSelect={setSelectedUserId}
            onToggleStatus={handleToggleStatus}
            onCreate={handleCreateUser}
            formError={formError}
          />
        </ProtectedView>
      )
    }
    if (view === "trucks") {
      return (
        <ProtectedView session={session} allowedRoles={["admin"]}>
          <TrucksPage
            trucks={trucks}
            loading={trucksLoading}
            error={trucksError}
            selectedId={selectedTruckId}
            onSelect={setSelectedTruckId}
            editingTruck={editingTruck}
            onEdit={handleEditTruck}
            onCancelEdit={handleCancelEdit}
            onSave={handleSaveTruck}
            onArchive={handleArchiveTruck}
            formError={truckFormError}
          />
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
      <Layout user={session.user} view={view} onNavigate={handleNavigate}>
        {renderView()}
      </Layout>
    </AppShell>
  )
}

export default App