
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

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
    <div className="min-h-[80vh] bg-[#faf7f2] px-4 py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* Hình ảnh bên trái */}
        <div className="relative hidden min-h-[600px] md:block">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000"
            alt="Salon Beauty"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#4a3024]/50" />

          <div className="absolute bottom-12 left-10 right-10 text-white">
            <p className="mb-3 text-sm uppercase tracking-[4px] text-[#f1d4a5]">
              Welcome to
            </p>
            <h2 className="mb-4 text-4xl font-bold">
              Salon Beauty
            </h2>
            <p className="text-sm leading-7 text-white/90">
              Nơi tôn vinh vẻ đẹp của bạn. Trải nghiệm
              dịch vụ chăm sóc sắc đẹp chuyên nghiệp
              trong không gian thư giãn và sang trọng.
            </p>
          </div>
        </div>

        {/* Form bên phải */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <form onSubmit={submit} className="w-full max-w-md">

            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#b18a60]">
                Salon Beauty
              </p>

              <h1 className="mb-3 text-3xl font-bold text-[#6f4e37]">
                {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản'}
              </h1>

              <p className="text-sm text-gray-500">
                {isLogin
                  ? 'Đăng nhập để tiếp tục trải nghiệm dịch vụ'
                  : 'Đăng ký để khám phá các dịch vụ làm đẹp'}
              </p>
            </div>

            {!isLogin && (
              <>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                    Họ và tên
                  </label>
                  <input
                    className="w-full rounded-xl border border-[#e8ded2] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a87945] focus:ring-2 focus:ring-[#a87945]/10"
                    placeholder="Nhập họ và tên"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                    Số điện thoại
                  </label>
                  <input
                    className="w-full rounded-xl border border-[#e8ded2] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a87945] focus:ring-2 focus:ring-[#a87945]/10"
                    placeholder="Nhập số điện thoại"
                    value={form.phone}
                    onChange={set('phone')}
                  />
                </div>
              </>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-[#e8ded2] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a87945] focus:ring-2 focus:ring-[#a87945]/10"
                type="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                Mật khẩu
              </label>
              <input
                className="w-full rounded-xl border border-[#e8ded2] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a87945] focus:ring-2 focus:ring-[#a87945]/10"
                type="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              className="w-full rounded-xl bg-[#a87945] py-3.5 font-semibold text-white shadow-md transition hover:bg-[#8b623c] disabled:opacity-60"
              disabled={busy}
            >
              {busy
                ? 'Đang xử lý...'
                : isLogin
                  ? 'Đăng nhập'
                  : 'Đăng ký'}
            </button>
            <p className="mt-7 text-center text-sm text-gray-500">
              {isLogin
                ? 'Bạn chưa có tài khoản? '
                : 'Bạn đã có tài khoản? '}

              <Link
                className="font-semibold text-[#a87945] hover:underline"
                to={isLogin ? '/register' : '/login'}
                state={loc.state}
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </Link>
            </p>

            <Link
              to="/"
              className="mt-6 block text-center text-sm text-gray-400 transition hover:text-[#a87945]"
            >
              ← Quay về trang chủ
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
