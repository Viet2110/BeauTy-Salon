
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

import LayoutAdmin from '../pages/admin/LayoutAdmin';
import Dashboard from '../pages/admin/Dasboard';
import SalonsAdmin from '../pages/admin/SalonsAdmin';
import ServicesAdmin from '../pages/admin/ServicesAdmin';
import AppointmentsAdmin from '../pages/admin/AppointmentsAdmin';
import UsersAdmin from '../pages/admin/UsersAdmin';

function AdminRouters() {
    const { user, loading } = useAuth();

    if (loading) return <div>Đang kiểm tra tài khoản...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const routers = [
        { path: "/admin", element: <Dashboard /> },
        { path: "/admin/salons", element: <SalonsAdmin /> },
        { path: "/admin/services", element: <ServicesAdmin /> },
        { path: "/admin/appointments", element: <AppointmentsAdmin /> },
        { path: "/admin/users", element: <UsersAdmin /> }
    ];

    return (
        <Routes>
            <Route element={<LayoutAdmin />}>
                {routers.map((item, index) => (
                    <Route
                        key={index}
                        path={item.path}
                        element={item.element}
                    />
                ))}
            </Route>
        </Routes>
    );
}

export default AdminRouters;
