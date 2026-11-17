
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';

function Header() {
    const { user, logout } = useAuth();

    const link = ({ isActive }) =>
        `px-4 py-2 text-sm font-medium transition ${isActive
            ? 'text-[#a87945]'
            : 'text-gray-600 hover:text-[#a87945]'
        }`;

    return (
        <header className="sticky top-0 z-50 border-b border-[#eee5d9] bg-[#fffdf9]">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-[#8b623c]">
                    Salon Beauty
                </Link>

                {/* Menu */}
                <nav className="flex items-center">
                    <NavLink to="/" end className={link}>
                        Trang chủ
                    </NavLink>

                    <NavLink to="/salons" className={link}>
                        Salon
                    </NavLink>

                    <NavLink to="/consultants" className={link}>
                        Tư vấn viên
                    </NavLink>

                    <NavLink to="/feedback" className={link}>
                        Đánh giá
                    </NavLink>
                </nav>

                {/* Account */}
                <div>
                    {user ? (
                        <button
                            onClick={logout}
                            className="rounded-full border border-[#a87945] px-5 py-2 text-sm text-[#8b623c] hover:bg-[#a87945] hover:text-white"
                        >
                            {user.name} · Đăng xuất
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-full bg-[#a87945] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#8b623c]"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>

            </div>
        </header>
    );
}

export default Header;
