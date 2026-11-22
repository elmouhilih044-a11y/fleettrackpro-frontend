import { useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import { login, setUnauthorizedHandler } from "./api"
import AppRoutes from "./AppRoutes"

function App() {
  const [session, setSession] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setSession(null)
      setLoginError("Session expirée. Veuillez vous reconnecter.")
    })
  }, [])

  async function handleLogin(email, password) {
    setLoginLoading(true)
    setLoginError("")
    try {
      const data = await login(email, password)
      setSession({ token: data.token, user: data.user })
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
    setLoginError("")
  }

  return (
    <BrowserRouter>
      <AppRoutes
        session={session}
        onLogin={handleLogin}
        onLogout={handleLogout}
        loginLoading={loginLoading}
        loginError={loginError}
      />
    </BrowserRouter>
  )
}

export default App