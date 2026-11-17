
import { NavLink } from 'react-router-dom';

function SideBar() {
    const menu = [
        { name: 'Tổng quan', path: '/admin' },
        { name: 'Quản lý Salon', path: '/admin/salons' },
        { name: 'Quản lý dịch vụ', path: '/admin/services' },
        { name: 'Quản lý lịch đặt', path: '/admin/appointments' },
        { name: 'Quản lý người dùng', path: '/admin/users' },
    ];

    return (
        <aside className="min-h-screen w-64 bg-[#fffdf9] border-r border-[#eee5d9] p-5">
            <h2 className="text-xl font-bold text-[#8b623c] mb-8">
                Salon Beauty
            </h2>

            <nav className="space-y-2">
                {menu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) =>
                            `block rounded-lg px-4 py-3 text-sm transition ${isActive
                                ? 'bg-[#a87945] text-white'
                                : 'text-gray-600 hover:bg-[#f5eee5]'
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default SideBar;
