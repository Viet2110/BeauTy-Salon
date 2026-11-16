import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Stars } from '../components/Stars';

export default function Salons() {
  const [salons, setSalons] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/salons').then(setSalons).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!salons) return <p>Đang tải danh sách salon...</p>;

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Danh sách salon</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {salons.map((s) => (
          <div key={s.id} className="card overflow-hidden">
            <img src={s.image_url} alt={s.name} className="h-44 w-full object-cover" />
            <div className="space-y-2 p-4">
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <p className="text-sm text-gray-600">📍 {s.address}</p>
              <p className="text-sm text-gray-600">🕒 {s.open_time.slice(0, 5)} - {s.close_time.slice(0, 5)}</p>
              <div className="flex items-center gap-2 text-sm">
                <Stars value={Number(s.avg_rating || 0)} />
                <span className="text-gray-500">{s.avg_rating ? `${s.avg_rating} (${s.review_count})` : 'Chưa có đánh giá'}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Link to={`/salons/${s.id}`} className="btn-outline flex-1">Xem thông tin</Link>
                <Link to={`/book?salon=${s.id}`} className="btn-primary flex-1">Chọn salon</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
