import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, money } from '../api';
import { useAuth } from '../AuthContext';

const STEPS = ['Salon', 'Dịch vụ', 'Nhân viên', 'Thông tin & giờ', 'Xác nhận'];
const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export default function Booking() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(params.get('salon') ? 1 : 0);
  const [salons, setSalons] = useState([]);
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [beauticians, setBeauticians] = useState([]);
  const [selected, setSelected] = useState([]); // id dịch vụ
  const [beautician, setBeautician] = useState(null); // null = không chọn
  const [info, setInfo] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', note: '' });
  const [date, setDate] = useState(today());
  const [time, setTime] = useState('');
  const [busy, setBusy] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api('/salons').then((list) => {
      setSalons(list);
      const pre = list.find((s) => String(s.id) === params.get('salon'));
      if (pre) setSalon(pre);
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!salon) return;
    api(`/salons/${salon.id}/services`).then(setServices);
    api(`/salons/${salon.id}/beauticians`).then(setBeauticians);
  }, [salon]);

  useEffect(() => {
    if (!salon || !date) return;
    const q = new URLSearchParams({ salonId: salon.id, date });
    if (beautician) q.set('beauticianId', beautician.id);
    api(`/appointments/slots?${q}`).then(setBusy).catch(() => setBusy([]));
  }, [salon, date, beautician]);

  const chosen = useMemo(() => services.filter((s) => selected.includes(s.id)), [services, selected]);
  const total = chosen.reduce((s, x) => s + Number(x.price), 0);
  const duration = chosen.reduce((s, x) => s + x.duration_min, 0);

  // Khung giờ cách nhau 30 phút, loại giờ đã bận / ngoài giờ làm / đã qua
  const slots = useMemo(() => {
    if (!salon || !duration) return [];
    const out = [];
    const now = new Date();
    for (let m = toMin(salon.open_time); m + duration <= toMin(salon.close_time); m += 30) {
      const past = new Date(`${date}T${fmt(m)}:00`) < now;
      const clash = busy.some((b) => m < toMin(b.start) + b.duration && toMin(b.start) < m + duration);
      out.push({ t: fmt(m), disabled: past || clash });
    }
    return out;
  }, [salon, duration, date, busy]);

  const toggle = (id) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const canNext = [!!salon, selected.length > 0, true, info.name.trim() && info.phone.trim() && date && time, true][step];

  const confirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      const r = await api('/appointments', {
        method: 'POST',
        body: {
          salonId: salon.id, beauticianId: beautician?.id, serviceIds: selected,
          customerName: info.name, customerPhone: info.phone, customerEmail: info.email,
          date, time, note: info.note,
        },
      });
      nav(`/appointments/${r.id}`, { state: { justBooked: true } });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-bold">Đặt lịch</h1>
      <ol className="mb-6 flex flex-wrap gap-2 text-xs sm:text-sm">
        {STEPS.map((s, i) => (
          <li key={s} className={`rounded-full px-3 py-1 ${i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-brand-100 text-brand-700' : 'bg-gray-200 text-gray-500'}`}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="card space-y-4 p-5">
        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {salons.map((s) => (
              <button key={s.id} onClick={() => { setSalon(s); setSelected([]); setBeautician(null); setTime(''); }}
                className={`rounded-lg border p-3 text-left ${salon?.id === s.id ? 'border-brand-600 bg-brand-50' : 'hover:bg-gray-50'}`}>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-600">{s.address}</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <>
            <p className="font-semibold">{salon?.name} — chọn một hoặc nhiều dịch vụ</p>
            {services.map((s) => (
              <label key={s.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${selected.includes(s.id) ? 'border-brand-600 bg-brand-50' : ''}`}>
                <input type="checkbox" checked={selected.includes(s.id)} onChange={() => { toggle(s.id); setTime(''); }} className="h-4 w-4 accent-pink-600" />
                <div className="flex-1">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.description} · ⏱ {s.duration_min} phút</p>
                </div>
                <span className="font-semibold text-brand-600">{money(s.price)}</span>
              </label>
            ))}
            <div className="flex justify-between rounded-lg bg-gray-100 p-3 font-semibold">
              <span>Tổng ({selected.length} dịch vụ · {duration} phút)</span><span className="text-brand-600">{money(total)}</span>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => { setBeautician(null); setTime(''); }} className={`rounded-lg border p-3 text-left ${!beautician ? 'border-brand-600 bg-brand-50' : 'hover:bg-gray-50'}`}>
              <p className="font-semibold">Không chọn</p><p className="text-sm text-gray-600">Salon sẽ sắp xếp nhân viên phù hợp</p>
            </button>
            {beauticians.map((b) => (
              <button key={b.id} onClick={() => { setBeautician(b); setTime(''); }}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left ${beautician?.id === b.id ? 'border-brand-600 bg-brand-50' : 'hover:bg-gray-50'}`}>
                <img src={b.avatar_url} alt={b.name} className="h-12 w-12 rounded-full object-cover" />
                <div><p className="font-semibold">{b.name}</p><p className="text-sm text-gray-600">{b.specialty}</p></div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="input" placeholder="Họ tên khách hàng *" value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
              <input className="input" placeholder="Số điện thoại *" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
              <input className="input sm:col-span-2" placeholder="Email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
              <textarea className="input sm:col-span-2" rows={2} placeholder="Ghi chú (nếu có)" value={info.note} onChange={(e) => setInfo({ ...info, note: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Ngày</label>
              <input type="date" className="input max-w-xs" min={today()} value={date} onChange={(e) => { setDate(e.target.value); setTime(''); }} />
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold">Giờ (dịch vụ kéo dài {duration} phút)</p>
              <div className="flex flex-wrap gap-2">
                {slots.length === 0 && <p className="text-sm text-gray-500">Không còn khung giờ phù hợp.</p>}
                {slots.map((s) => (
                  <button key={s.t} disabled={s.disabled} onClick={() => setTime(s.t)}
                    className={`rounded-lg border px-3 py-1 text-sm ${time === s.t ? 'border-brand-600 bg-brand-600 text-white' : 'bg-white'} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:line-through`}>
                    {s.t}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <div className="space-y-2 text-sm">
            <h2 className="text-lg font-semibold">Xác nhận đặt lịch</h2>
            <p><b>Salon:</b> {salon.name} — {salon.address}</p>
            <p><b>Nhân viên:</b> {beautician ? beautician.name : 'Salon sắp xếp'}</p>
            <p><b>Thời gian:</b> {time} ngày {date.split('-').reverse().join('/')}</p>
            <p><b>Khách hàng:</b> {info.name} · {info.phone} {info.email && `· ${info.email}`}</p>
            <ul className="list-inside list-disc">
              {chosen.map((s) => <li key={s.id}>{s.name} — {money(s.price)}</li>)}
            </ul>
            <p className="text-base font-bold text-brand-600">Tổng cộng: {money(total)}</p>
            {error && <p className="text-red-600">{error}</p>}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button className="btn-outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Quay lại</button>
        {step < 4 ? (
          <button className="btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>Tiếp tục</button>
        ) : (
          <button className="btn-primary" disabled={submitting} onClick={confirm}>{submitting ? 'Đang gửi...' : 'Xác nhận đặt lịch'}</button>
        )}
      </div>
    </div>
  );
}
