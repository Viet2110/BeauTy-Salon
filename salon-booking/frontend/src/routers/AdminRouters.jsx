
import { Navigate, Route, Routes } from 'react-router-dom';

import LayoutAdmin from '../pages/admin/LayoutAdmin';
import Dashboard from '../pages/admin/Dasboard';

export default function AdminRouters() {
    return (
        <Routes>
            <Route path="/admin" element={<LayoutAdmin />}>
                <Route index element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
        </Routes>
    );
}
