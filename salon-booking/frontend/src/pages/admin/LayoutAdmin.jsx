
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/admin/SideBar';
import HeaderAdmin from '../../components/common/admin/HeaderAdmin';

function LayoutAdmin() {
    return (
        <div className="flex min-h-screen bg-[#faf7f2]">
            <Sidebar />

            <div className="flex-1">
                <HeaderAdmin />

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default LayoutAdmin;
