import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form);
      nav(loc.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={submit} className="card space-y-4 p-6">
        <h1 className="text-2xl font-bold">{isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}</h1>
        {!isLogin && (
          <>
            <input className="input" placeholder="Họ và tên" value={form.name} onChange={set('name')} required />
            <input className="input" placeholder="Số điện thoại" value={form.phone} onChange={set('phone')} />
          </>
        )}
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
        <input className="input" type="password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" value={form.password} onChange={set('password')} required minLength={6} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}</button>
        <p className="text-center text-sm text-gray-600">
          {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <Link className="font-semibold text-brand-600" to={isLogin ? '/register' : '/login'} state={loc.state}>
            {isLogin ? 'Đăng ký' : 'Đăng nhập'}
          </Link>
        </p>
      </form>
    </div>
  );
}
