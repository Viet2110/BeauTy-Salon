import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from "../../api";
import { useAuth } from "../../AuthContext";
import { StarInput, Stars } from "../../components/Stars";

export default function Feedback() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [salons, setSalons] = useState([]);
  const [salonId, setSalonId] = useState(params.get('salon') || '');
  const [list, setList] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/salons').then((s) => {
      setSalons(s);
      if (!salonId && s[0]) setSalonId(String(s[0].id));
    });
  }, []); // eslint-disable-line

  const load = () => salonId && api(`/feedbacks?salonId=${salonId}`).then(setList);
  useEffect(() => { load(); }, [salonId]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    if (!rating) return setError('Vui lòng chọn số sao');
    try {
      await api('/feedbacks', {
        method: 'POST',
        body: { salonId: Number(salonId), appointmentId: params.get('appointment') ? Number(params.get('appointment')) : undefined, rating, comment },
      });
      setRating(0); setComment(''); setMsg('Cảm ơn bạn đã gửi đánh giá!');
      load();
    } catch (err) { setError(err.message); }
  };

  const avg = list.length ? list.reduce((s, f) => s + f.rating, 0) / list.length : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Đánh giá</h1>
        <select className="input max-w-xs" value={salonId} onChange={(e) => setSalonId(e.target.value)}>
          {salons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {user ? (
        <form onSubmit={submit} className="card space-y-3 p-5">
          <h2 className="font-semibold">Gửi đánh giá của bạn</h2>
          <StarInput value={rating} onChange={setRating} />
          <textarea className="input" rows={3} maxLength={1000} placeholder="Viết nhận xét..." value={comment} onChange={(e) => setComment(e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {msg && <p className="text-sm text-green-700">{msg}</p>}
          <button className="btn-primary">Gửi đánh giá</button>
        </form>
      ) : (
        <p className="card p-4 text-sm"><Link to="/login" state={{ from: '/feedback' }} className="font-semibold text-brand-600">Đăng nhập</Link> để gửi đánh giá.</p>
      )}

      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-semibold">Tất cả đánh giá ({list.length})</h2>
          {list.length > 0 && <><Stars value={avg} /><span className="text-sm text-gray-500">{avg.toFixed(1)}/5</span></>}
        </div>
        <div className="space-y-3">
          {list.length === 0 && <p className="text-gray-600">Chưa có đánh giá nào.</p>}
          {list.map((f) => (
            <div key={f.id} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{f.user_name}</p>
                <span className="text-xs text-gray-500">{new Date(f.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
              <Stars value={f.rating} size="text-base" />
              {f.comment && <p className="mt-1 text-sm text-gray-700">{f.comment}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
