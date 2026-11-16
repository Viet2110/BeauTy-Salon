import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, money } from '../api';
import { Stars } from '../components/Stars';

export default function SalonDetail() {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [beauticians, setBeauticians] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api(`/salons/${id}`), api(`/salons/${id}/services`), api(`/salons/${id}/beauticians`)])
      .then(([a, b, c]) => { setSalon(a); setServices(b); setBeauticians(c); })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!salon) return <p>Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden md:flex">
        <img src={salon.image_url} alt={salon.name} className="h-56 w-full object-cover md:w-96" />
        <div className="space-y-2 p-5">
          <h1 className="text-2xl font-bold">{salon.name}</h1>
          <p>📍 {salon.address}</p>
          <p>📞 {salon.phone}</p>
          <p>🕒 {salon.open_time.slice(0, 5)} - {salon.close_time.slice(0, 5)}</p>
          <p className="text-gray-600">{salon.description}</p>
          <Stars value={Number(salon.avg_rating || 0)} />
          <div><Link to={`/book?salon=${salon.id}`} className="btn-primary mt-2">Đặt lịch tại salon này</Link></div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Dịch vụ</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.id} className="card p-4">
              <div className="flex justify-between font-semibold"><span>{s.name}</span><span className="text-brand-600">{money(s.price)}</span></div>
              <p className="text-sm text-gray-600">{s.description}</p>
              <p className="text-xs text-gray-500">⏱ {s.duration_min} phút</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Nhân viên làm đẹp</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {beauticians.map((b) => (
            <div key={b.id} className="card flex items-center gap-3 p-4">
              <img src={b.avatar_url} alt={b.name} className="h-14 w-14 rounded-full object-cover" />
              <div><p className="font-semibold">{b.name}</p><p className="text-sm text-gray-600">{b.specialty}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
