import { Navigate } from "react-router-dom"
import { homeFor } from "../routing"

function RootRedirect({ session }) {
  if (!session) return <Navigate to="/login" replace />
  return <Navigate to={homeFor(session.user.role)} replace />
}

export default RootRedirect