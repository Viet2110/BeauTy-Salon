import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Auth from './pages/Auth';
import Salons from './pages/Salons';
import SalonDetail from './pages/SalonDetail';
import Booking from './pages/Booking';
import Appointments from './pages/Appointments';
import AppointmentDetail from './pages/AppointmentDetail';
import Consultants from './pages/Consultants';
import Feedback from './pages/Feedback';

function Private({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <p className="p-8 text-center">Đang tải...</p>;
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />;
}

function Navbar() {
  const { user, logout } = useAuth();
  const link = ({ isActive }) => `px-3 py-2 text-sm font-medium ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`;
  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-brand-600">💅 Salon Booking</Link>
        <nav className="flex flex-wrap items-center">
          <NavLink to="/" end className={link}>Salon</NavLink>
          <NavLink to="/book" className={link}>Đặt lịch</NavLink>
          <NavLink to="/appointments" className={link}>Lịch hẹn</NavLink>
          <NavLink to="/consultants" className={link}>Tư vấn viên</NavLink>
          <NavLink to="/feedback" className={link}>Đánh giá</NavLink>
          {user ? (
            <button onClick={logout} className="btn-outline ml-2">{user.name} · Đăng xuất</button>
          ) : (
            <Link to="/login" className="btn-primary ml-2">Đăng nhập</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Salons />} />
          <Route path="/salons/:id" element={<SalonDetail />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/book" element={<Private><Booking /></Private>} />
          <Route path="/appointments" element={<Private><Appointments /></Private>} />
          <Route path="/appointments/:id" element={<Private><AppointmentDetail /></Private>} />
          <Route path="/consultants" element={<Consultants />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
