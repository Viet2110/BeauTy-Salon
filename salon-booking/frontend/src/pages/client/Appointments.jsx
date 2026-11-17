import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money, STATUS } from '../../api';

export default function Appointments() {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');

  const load = () => api('/appointments').then(setList).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm('Bạn chắc chắn muốn hủy lịch hẹn này?')) return;
    try { await api(`/appointments/${id}/cancel`, { method: 'PATCH' }); load(); } catch (e) { alert(e.message); }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!list) return <p>Đang tải...</p>;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lịch hẹn của tôi</h1>
        <Link to="/book" className="btn-primary">+ Đặt lịch mới</Link>
      </div>
      {list.length === 0 && <p className="text-gray-600">Bạn chưa có lịch hẹn nào.</p>}
      <div className="space-y-3">
        {list.map((a) => (
          <div key={a.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{a.salon_name}</p>
              <p className="text-sm text-gray-600">{a.appointment_time.slice(0, 5)} · {a.appointment_date.split('-').reverse().join('/')} · {a.beautician_name || 'Salon sắp xếp'}</p>
              <p className="text-sm font-semibold text-brand-600">{money(a.total_price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS[a.status].cls}`}>{STATUS[a.status].label}</span>
              <Link to={`/appointments/${a.id}`} className="btn-outline">Chi tiết</Link>
              {['pending', 'confirmed'].includes(a.status) && <button className="btn-outline text-red-600" onClick={() => cancel(a.id)}>Hủy</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
