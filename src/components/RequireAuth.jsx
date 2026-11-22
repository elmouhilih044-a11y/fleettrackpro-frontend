import { Navigate, Outlet, useLocation } from "react-router-dom"

function RequireAuth({ session }) {
  const location = useLocation()
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

export default RequireAuth