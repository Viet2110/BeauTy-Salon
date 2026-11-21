
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from '../../api';

export default function Appointments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    api('/appointments')
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Hủy lịch hẹn
  const handleCancel = async () => {
    try {
      setCancelLoading(true);

      const result = await api(`/appointments/${cancelId}/cancel`, {
        method: 'PATCH',
      });

      setList((prev) =>
        prev.map((a) =>
          a.id === result.id
            ? { ...a, status: result.status }
            : a
        )
      );

      setCancelId(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const statusStyle = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusName = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy',
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Tiêu đề */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-[#b18a60]">
              Salon Beauty
            </p>
            <h1 className="text-3xl font-bold text-[#6f4e37]">
              Lịch hẹn của tôi
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Theo dõi và quản lý các lịch hẹn của bạn
            </p>
          </div>

          <Link
            to="/book"
            className="rounded-full bg-[#a87945] px-6 py-3 font-semibold text-white transition hover:bg-[#8b623c]"
          >
            + Đặt lịch mới
          </Link>
        </div>

        {/* Đang tải */}
        {loading && (
          <p className="py-10 text-center text-gray-500">
            Đang tải lịch hẹn...
          </p>
        )}

        {/* Lỗi */}
        {!loading && error && (
          <p className="rounded-xl bg-red-50 p-5 text-center text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {/* Thống kê */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { name: 'Tổng lịch hẹn', value: list.length },
                { name: 'Chờ xác nhận', value: list.filter(a => a.status === 'pending').length },
                { name: 'Đã xác nhận', value: list.filter(a => a.status === 'confirmed').length },
                { name: 'Hoàn thành', value: list.filter(a => a.status === 'completed').length },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-[#eee5d9] bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-gray-500">{item.name}</p>
                  <p className="mt-2 text-3xl font-bold text-[#a87945]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Danh sách lịch hẹn */}
            <div className="space-y-5">
              {list.length === 0 ? (
                <div className="rounded-2xl border border-[#eee5d9] bg-white p-12 text-center">
                  <p className="text-lg font-semibold text-[#6f4e37]">
                    Bạn chưa có lịch hẹn nào
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Hãy đặt lịch để trải nghiệm dịch vụ của chúng tôi nhé!
                  </p>
                  <Link
                    to="/book"
                    className="mt-5 inline-block rounded-full bg-[#a87945] px-6 py-3 font-semibold text-white hover:bg-[#8b623c]"
                  >
                    Đặt lịch ngay
                  </Link>
                </div>
              ) : (
                list.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-[#eee5d9] bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-bold text-[#6f4e37]">
                          {a.salon_name}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          Mã lịch hẹn: #{a.id}
                        </p>
                      </div>

                      <span className={`rounded-full px-4 py-2 text-xs font-semibold ${statusStyle[a.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusName[a.status] || a.status}
                      </span>
                    </div>

                    <div className="my-5 grid gap-4 border-y border-[#eee5d9] py-5 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-gray-400">Ngày hẹn</p>
                        <p className="mt-1 font-semibold text-[#6f4e37]">
                          {String(a.appointment_date).slice(0, 10).split('-').reverse().join('/')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Giờ hẹn</p>
                        <p className="mt-1 font-semibold text-[#6f4e37]">
                          {String(a.appointment_time).slice(0, 5)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Nhân viên</p>
                        <p className="mt-1 font-semibold text-[#6f4e37]">
                          {a.beautician_name || 'Salon sắp xếp'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Tổng thanh toán</p>
                        <p className="mt-1 text-xl font-bold text-[#a87945]">
                          {money(a.total_price)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/appointments/${a.id}`}
                          className="rounded-full border border-[#c6a477] px-5 py-2.5 text-sm font-semibold text-[#8b623c] transition hover:bg-[#faf5ed]"
                        >
                          Chi tiết →
                        </Link>

                        {['pending', 'confirmed'].includes(a.status) && (
                          <button
                            onClick={() => setCancelId(a.id)}
                            className="rounded-full bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Hủy lịch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Hộp thoại xác nhận hủy */}
      {cancelId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
            <h2 className="text-xl font-bold text-[#6f4e37]">
              Xác nhận hủy lịch
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              Bạn có chắc chắn muốn hủy lịch hẹn này không?
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setCancelId(null)}
                disabled={cancelLoading}
                className="rounded-full border border-gray-300 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
              >
                Không
              </button>

              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
