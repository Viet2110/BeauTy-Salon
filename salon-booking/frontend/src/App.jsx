import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';


import ClientRouters from './routers/ClientRouters';
import AdminRouters from './routers/AdminRouters';

function Private({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <p className="p-8 text-center">Đang tải...</p>;
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />;
}


export default function App() {
  return (
    <>
      <ClientRouters />
      <AdminRouters />
    </>

  );
}
