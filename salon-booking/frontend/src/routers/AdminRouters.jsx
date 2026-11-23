
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

import LayoutAdmin from '../pages/admin/LayoutAdmin';
import Dashboard from '../pages/admin/Dasboard';
import SalonsAdmin from '../pages/admin/SalonsAdmin';
import ServicesAdmin from '../pages/admin/ServicesAdmin';
import AppointmentsAdmin from '../pages/admin/AppointmentsAdmin';
import UsersAdmin from '../pages/admin/UsersAdmin';

function AdminGuard() {
    const { user, loading } = useAuth();

    if (loading) return <div>Đang kiểm tra tài khoản...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
function AdminRouters() {
    return (
        <Routes>
            <Route element={<AdminGuard />}>
                <Route element={<LayoutAdmin />}>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/salons" element={<SalonsAdmin />} />
                    <Route path="/admin/services" element={<ServicesAdmin />} />
                    <Route path="/admin/appointments" element={<AppointmentsAdmin />} />
                    <Route path="/admin/users" element={<UsersAdmin />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default AdminRouters;
