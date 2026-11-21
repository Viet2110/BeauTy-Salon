
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api, money } from '../../api';

export default function AppointmentDetail() {
  const { id } = useParams();
  const loc = useLocation();

  const [a, setA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Lấy chi tiết lịch hẹn từ API
  useEffect(() => {
    api(`/appointments/${id}`)
      .then(setA)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Hủy lịch hẹn
  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      return;
    }

    try {
      setCancelLoading(true);

      const result = await api(`/appointments/${id}/cancel`, {
        method: 'PATCH',
      });

      setA((prev) => ({
        ...prev,
        status: result.status,
      }));

      alert('Hủy lịch thành công!');
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

  // Đang tải
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <p className="text-gray-500">Đang tải thông tin lịch hẹn...</p>
      </div>
    );
  }

  // Lỗi
  if (error) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4">
        <p className="text-red-600">{error}</p>
        <Link to="/appointments" className="mt-5 text-[#a87945] font-semibold">
          ← Quay lại danh sách lịch hẹn
        </Link>
      </div>
    );
  }

  if (!a) return null;

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Tiêu đề */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-[#b18a60]">
            Salon Beauty
          </p>
          <h1 className="text-3xl font-bold text-[#6f4e37]">
            Chi tiết lịch hẹn
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Kiểm tra thông tin lịch hẹn của bạn
          </p>
        </div>

        {/* Thông báo */}
        {loc.state?.justBooked && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            🎉 Đặt lịch thành công! Salon sẽ sớm xác nhận với bạn.
          </div>
        )}

        {/* Thông tin lịch hẹn */}
        <div className="overflow-hidden rounded-3xl border border-[#eee5d9] bg-white shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f5ecdf] p-6">
            <div>
              <p className="text-sm text-gray-500">Mã lịch hẹn</p>
              <h2 className="mt-1 text-2xl font-bold text-[#6f4e37]">
                #{a.id}
              </h2>
            </div>

            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyle[a.status] || 'bg-gray-100 text-gray-600'}`}>
              {statusName[a.status] || a.status}
            </span>
          </div>

          <div className="space-y-7 p-6 md:p-8">

            {/* Salon */}
            <section>
              <h3 className="mb-4 font-bold text-[#6f4e37]">
                ✿ Thông tin salon
              </h3>
              <p className="font-semibold text-gray-800">
                {a.salon_name}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {a.salon_address || 'Chưa có địa chỉ'}
              </p>
            </section>

            <div className="border-t border-[#eee5d9]" />

            {/* Thời gian */}
            <section>
              <h3 className="mb-4 font-bold text-[#6f4e37]">
                ◷ Thời gian đặt lịch
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-[#faf7f2] p-4">
                  <p className="text-xs text-gray-400">Ngày hẹn</p>
                  <p className="mt-2 font-semibold text-[#6f4e37]">
                    {String(a.appointment_date).slice(0, 10).split('-').reverse().join('/')}
                  </p>
                </div>

                <div className="rounded-xl bg-[#faf7f2] p-4">
                  <p className="text-xs text-gray-400">Giờ hẹn</p>
                  <p className="mt-2 font-semibold text-[#6f4e37]">
                    {String(a.appointment_time).slice(0, 5)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#faf7f2] p-4">
                  <p className="text-xs text-gray-400">Thời lượng</p>
                  <p className="mt-2 font-semibold text-[#6f4e37]">
                    {a.total_duration} phút
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                Nhân viên: <b>{a.beautician_name || 'Salon sắp xếp'}</b>
              </p>
            </section>

            <div className="border-t border-[#eee5d9]" />

            {/* Khách hàng */}
            <section>
              <h3 className="mb-4 font-bold text-[#6f4e37]">
                ♡ Thông tin khách hàng
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                <p>Họ tên: <b className="text-gray-800">{a.customer_name}</b></p>
                <p>Điện thoại: <b className="text-gray-800">{a.customer_phone}</b></p>
                <p>Email: <b className="text-gray-800">{a.customer_email || 'Không có'}</b></p>
                <p>Ghi chú: {a.note || 'Không có'}</p>
              </div>
            </section>

            <div className="border-t border-[#eee5d9]" />

            {/* Dịch vụ */}
            <section>
              <h3 className="mb-4 font-bold text-[#6f4e37]">
                Dịch vụ đã chọn
              </h3>

              <div className="space-y-4">
                {a.services?.map((s) => (
                  <div key={s.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-600">{s.name}</span>
                    <span className="font-semibold text-[#6f4e37]">
                      {money(s.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#eee5d9] pt-5">
                <span className="font-semibold text-[#6f4e37]">
                  Tổng thanh toán
                </span>
                <span className="text-2xl font-bold text-[#a87945]">
                  {money(a.total_price)}
                </span>
              </div>
            </section>
          </div>
        </div>

        {/* Nút điều hướng */}
        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Link
            to="/appointments"
            className="rounded-full border border-[#c6a477] px-6 py-3 font-semibold text-[#8b623c] transition hover:bg-[#efe2d0]"
          >
            ← Danh sách lịch hẹn
          </Link>

          <div className="flex flex-wrap gap-3">
            {['pending', 'confirmed'].includes(a.status) && (
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="rounded-full bg-red-50 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                {cancelLoading ? 'Đang hủy...' : 'Hủy lịch'}
              </button>
            )}

            {a.status === 'completed' && (
              <Link
                to={`/feedback?salon=${a.salon_id}&appointment=${a.id}`}
                className="rounded-full bg-[#a87945] px-6 py-3 font-semibold text-white transition hover:bg-[#8b623c]"
              >
                Đánh giá dịch vụ
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
