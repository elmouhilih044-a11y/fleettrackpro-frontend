import { Navigate, Outlet } from "react-router-dom"

function RequireRole({ session, role }) {
  if (session.user.role !== role) {
    return <Navigate to="/403" replace />
  }
  return <Outlet />
}

export default RequireRole