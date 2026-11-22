import { Routes, Route } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import RootRedirect from "./components/RootRedirect"
import RequireAuth from "./components/RequireAuth"
import RequireRole from "./components/RequireRole"
import AdminLayout from "./components/AdminLayout"
import DriverLayout from "./components/DriverLayout"
import HomePage from "./components/HomePage"
import UsersPage from "./components/UsersPage"
import TrucksPage from "./components/TrucksPage"
import MyTripsPage from "./components/MyTripsPage"
import MyTripDetailPage from "./components/MyTripDetailPage"
import ForbiddenPage from "./components/ForbiddenPage"
import NotFoundPage from "./components/NotFoundPage"

function AppRoutes({ session, onLogin, onLogout, loginLoading, loginError }) {
  const token = session?.token
  const user = session?.user

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginPage session={session} onLogin={onLogin} loading={loginLoading} error={loginError} />
        }
      />
      <Route path="/" element={<RootRedirect session={session} />} />

      <Route element={<RequireAuth session={session} />}>
        <Route path="/403" element={<ForbiddenPage session={session} />} />

        <Route element={<RequireRole session={session} role="admin" />}>
          <Route path="/admin" element={<AdminLayout user={user} onLogout={onLogout} />}>
            <Route index element={<HomePage user={user} />} />
            <Route path="utilisateurs" element={<UsersPage token={token} />} />
            <Route path="camions" element={<TrucksPage token={token} />} />
          </Route>
        </Route>

        <Route element={<RequireRole session={session} role="driver" />}>
          <Route path="/chauffeur" element={<DriverLayout user={user} onLogout={onLogout} />}>
            <Route index element={<HomePage user={user} />} />
            <Route path="trajets" element={<MyTripsPage token={token} />} />
            <Route path="trajets/:id" element={<MyTripDetailPage token={token} />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes