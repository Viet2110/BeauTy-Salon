import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api, money, STATUS } from '../../api';

export default function AppointmentDetail() {
  const { id } = useParams();
  const loc = useLocation();
  const [a, setA] = useState(null);
  const [error, setError] = useState('');

  const load = () => api(`/appointments/${id}`).then(setA).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [id]); // eslint-disable-line

  const cancel = async () => {
    if (!confirm('Bạn chắc chắn muốn hủy lịch hẹn này?')) return;
    try { await api(`/appointments/${id}/cancel`, { method: 'PATCH' }); load(); } catch (e) { alert(e.message); }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!a) return <p>Đang tải...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {loc.state?.justBooked && <p className="rounded-lg bg-green-100 p-3 text-green-800">🎉 Đặt lịch thành công! Salon sẽ sớm xác nhận với bạn.</p>}
      <div className="card space-y-2 p-5 text-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Lịch hẹn #{a.id}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS[a.status].cls}`}>{STATUS[a.status].label}</span>
        </div>
        <p><b>Salon:</b> {a.salon_name} — {a.salon_address}</p>
        <p><b>Nhân viên:</b> {a.beautician_name || 'Salon sắp xếp'}</p>
        <p><b>Thời gian:</b> {a.appointment_time.slice(0, 5)} ngày {a.appointment_date.split('-').reverse().join('/')} (~{a.total_duration} phút)</p>
        <p><b>Khách hàng:</b> {a.customer_name} · {a.customer_phone}</p>
        {a.note && <p><b>Ghi chú:</b> {a.note}</p>}
        <ul className="divide-y rounded-lg border">
          {a.services.map((s) => (
            <li key={s.id} className="flex justify-between p-2"><span>{s.name}</span><span>{money(s.price)}</span></li>
          ))}
        </ul>
        <p className="text-right text-base font-bold text-brand-600">Tổng: {money(a.total_price)}</p>
      </div>
      <div className="flex gap-2">
        <Link to="/appointments" className="btn-outline">← Danh sách</Link>
        {['pending', 'confirmed'].includes(a.status) && <button className="btn-outline text-red-600" onClick={cancel}>Hủy lịch</button>}
        {a.status === 'completed' && <Link to={`/feedback?salon=${a.salon_id}&appointment=${a.id}`} className="btn-primary">Đánh giá dịch vụ</Link>}
      </div>
    </div>
  );
}
