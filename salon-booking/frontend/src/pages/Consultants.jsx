import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Consultants() {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/consultants').then(setList).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!list) return <p>Đang tải...</p>;

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Tư vấn viên</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <div key={c.id} className="card flex items-center gap-4 p-4">
            <img src={c.avatar_url} alt={c.name} className="h-16 w-16 rounded-full object-cover" />
            <div className="text-sm">
              <p className="text-base font-semibold">{c.name}</p>
              <p className="text-gray-600">{c.specialty}</p>
              {c.phone && <p>📞 {c.phone}</p>}
              {c.email && <p>✉️ {c.email}</p>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
