import { Navigate, useLocation } from "react-router-dom"
import LoginForm from "./LoginForm"
import { allowedDestination } from "../routing"

function LoginPage({ session, onLogin, loading, error }) {
  const location = useLocation()

  if (session) {
    const from = location.state?.from?.pathname
    return <Navigate to={allowedDestination(session.user.role, from)} replace />
  }

  return <LoginForm onLogin={onLogin} loading={loading} error={error} />
}

export default LoginPage