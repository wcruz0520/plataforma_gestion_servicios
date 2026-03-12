import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsersPage from "../pages/users/UsersPage";
import UsersGestionPage from "../pages/users/UsersGestionPage";
import RequestsPage from "../pages/requests/RequestsPage";
import ProtectedRoute from "../auth/ProtectedRoute";
import AppLayout from "../components/layouts/AppLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/usersgestion" element={<UsersGestionPage />} />
            <Route path="/requests" element={<RequestsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}