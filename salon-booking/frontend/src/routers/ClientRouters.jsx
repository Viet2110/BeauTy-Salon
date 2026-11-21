
import LayoutClient from '../pages/client/LayoutClient';
import Auth from '../pages/client/Auth';
import Salons from '../pages/client/Salon/Salons';
import SalonDetail from '../pages/client/Salon/SalonDetail';
import Booking from '../pages/client/Booking';
import Appointments from '../pages/client/Appointments';
import AppointmentDetail from '../pages/client/AppointmentDetail';
import Consultants from '../pages/client/Consultants';
import Feedback from '../pages/client/Feedback';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/client/home/Home';

function ClientRouters() {
    const routers = [
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/salons",
            element: <Salons />
        },

        {
            path: "/salons/:id",
            element: <SalonDetail />
        },
        {
            path: "/login",
            element: <Auth mode="login" />
        },
        {
            path: "/register",
            element: <Auth mode="register" />
        },

        {
            path: "/book",
            element: <Booking />
        },
        {
            path: "/appointments",
            element: <Appointments />
        },
        {
            path: "/appointments/:id",
            element: <AppointmentDetail />
        },

        {
            path: "/consultants",
            element: <Consultants />
        },
        {
            path: "/feedback",
            element: <Feedback />
        },

    ];
    return (
        <Routes>
            <Route element={<LayoutClient />}>
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

export default ClientRouters;
