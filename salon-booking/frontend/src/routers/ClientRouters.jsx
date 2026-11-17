
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

import LayoutClient from '../pages/client/LayoutClient';
import Auth from '../pages/client/Auth';
import Salons from '../pages/client/Salon/Salons';
import SalonDetail from '../pages/client/Salon/SalonDetail';
import Booking from '../pages/client/Booking';
import Appointments from '../pages/client/Appointments';
import AppointmentDetail from '../pages/client/AppointmentDetail';
import Consultants from '../pages/client/Consultants';
import Feedback from '../pages/client/Feedback';

function Private({ children }) {
    const { user, loading } = useAuth();
    const loc = useLocation();

    if (loading) return <p className="p-8 text-center">Đang tải...</p>;

    return user ? children : (
        <Navigate
            to="/login"
            state={{ from: loc.pathname + loc.search }}
            replace
        />
    );
}

export default function ClientRouters() {
    return (
        <Routes>
            <Route path="/" element={<LayoutClient />}>
                <Route index element={<Salons />} />
                <Route path="salons/:id" element={<SalonDetail />} />
                <Route path="login" element={<Auth mode="login" />} />
                <Route path="register" element={<Auth mode="register" />} />
                <Route path="book" element={<Private><Booking /></Private>} />
                <Route path="appointments" element={<Private><Appointments /></Private>} />
                <Route path="appointments/:id" element={<Private><AppointmentDetail /></Private>} />
                <Route path="consultants" element={<Consultants />} />
                <Route path="feedback" element={<Feedback />} />
            </Route>
        </Routes>
    );
}
