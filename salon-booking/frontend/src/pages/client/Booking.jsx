
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, money } from '../../api';
import { useAuth } from '../../AuthContext';

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
  const [selected, setSelected] = useState([]);
  const [beautician, setBeautician] = useState(null);
  const [info, setInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    note: ''
  });
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
  }, []);

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

  const chosen = useMemo(
    () => services.filter((s) => selected.includes(s.id)),
    [services, selected]
  );

  const total = chosen.reduce((s, x) => s + Number(x.price), 0);
  const duration = chosen.reduce((s, x) => s + x.duration_min, 0);

  const slots = useMemo(() => {
    if (!salon || !duration) return [];

    const out = [];
    const now = new Date();

    for (
      let m = toMin(salon.open_time);
      m + duration <= toMin(salon.close_time);
      m += 30
    ) {
      const past = new Date(`${date}T${fmt(m)}:00`) < now;
      const clash = busy.some(
        (b) => m < toMin(b.start) + b.duration &&
          toMin(b.start) < m + duration
      );

      out.push({ t: fmt(m), disabled: past || clash });
    }

    return out;
  }, [salon, duration, date, busy]);

  const toggle = (id) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const canNext = [
    !!salon,
    selected.length > 0,
    true,
    info.name.trim() && info.phone.trim() && date && time,
    true
  ][step];

  const confirm = async () => {
    setError('');
    setSubmitting(true);

    try {
      const r = await api('/appointments', {
        method: 'POST',
        body: {
          salonId: salon.id,
          beauticianId: beautician?.id,
          serviceIds: selected,
          customerName: info.name,
          customerPhone: info.phone,
          customerEmail: info.email,
          date,
          time,
          note: info.note,
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
    <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Tiêu đề */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#b18a60]">
            Salon Beauty
          </p>

          <h1 className="mb-3 text-3xl font-bold text-[#6f4e37] md:text-4xl">
            Đặt lịch làm đẹp
          </h1>

          <p className="text-sm text-gray-500">
            Chỉ vài bước đơn giản để đặt lịch chăm sóc sắc đẹp
          </p>
        </div>

        {/* Các bước */}
        <div className="mb-8 overflow-x-auto rounded-2xl border border-[#eee5d9] bg-white p-5 shadow-sm">
          <ol className="flex min-w-[650px] items-center justify-between gap-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition ${i === step
                      ? 'bg-[#a87945] text-white shadow-md'
                      : i < step
                        ? 'bg-[#efe2d0] text-[#8b623c]'
                        : 'bg-[#f3f0eb] text-gray-400'
                    }`}>
                    {i < step ? '✓' : i + 1}
                  </div>

                  <span className={`whitespace-nowrap text-xs font-medium ${i === step ? 'text-[#8b623c]' : 'text-gray-400'
                    }`}>
                    {s}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div className={`mb-5 h-[2px] flex-1 ${i < step ? 'bg-[#c6a477]' : 'bg-[#eee5d9]'
                    }`} />
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Nội dung */}
        <div className="rounded-3xl border border-[#eee5d9] bg-white p-5 shadow-[0_10px_40px_rgba(111,78,55,0.06)] md:p-8">

          {/* Bước 1: Chọn salon */}
          {step === 0 && (
            <div>
              <h2 className="mb-2 text-xl font-bold text-[#6f4e37]">
                Chọn salon
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Lựa chọn địa điểm mà bạn muốn trải nghiệm dịch vụ
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {salons.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSalon(s);
                      setSelected([]);
                      setBeautician(null);
                      setTime('');
                    }}
                    className={`rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-md ${salon?.id === s.id
                        ? 'border-[#a87945] bg-[#faf5ed] ring-1 ring-[#a87945]'
                        : 'border-[#eee5d9] hover:border-[#c6a477]'
                      }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-2xl">✿</span>
                      {salon?.id === s.id && (
                        <span className="text-sm font-semibold text-[#a87945]">
                          ✓ Đã chọn
                        </span>
                      )}
                    </div>

                    <p className="mb-2 font-bold text-[#6f4e37]">
                      {s.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {s.address}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bước 2: Chọn dịch vụ */}
          {step === 1 && (
            <div>
              <h2 className="mb-2 text-xl font-bold text-[#6f4e37]">
                Chọn dịch vụ
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                {salon?.name} · Bạn có thể chọn nhiều dịch vụ
              </p>

              <div className="space-y-3">
                {services.map((s) => (
                  <label
                    key={s.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${selected.includes(s.id)
                        ? 'border-[#a87945] bg-[#faf5ed]'
                        : 'border-[#eee5d9] hover:border-[#c6a477]'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => {
                        toggle(s.id);
                        setTime('');
                      }}
                      className="h-5 w-5 accent-[#a87945]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#6f4e37]">
                        {s.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {s.description}
                      </p>
                      <p className="mt-2 text-xs text-[#a87945]">
                        ⏱ {s.duration_min} phút
                      </p>
                    </div>

                    <span className="whitespace-nowrap font-bold text-[#a87945]">
                      {money(s.price)}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#faf5ed] p-5">
                <div>
                  <p className="font-semibold text-[#6f4e37]">
                    Tổng dịch vụ đã chọn
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {selected.length} dịch vụ · {duration} phút
                  </p>
                </div>

                <p className="text-xl font-bold text-[#a87945]">
                  {money(total)}
                </p>
              </div>
            </div>
          )}

          {/* Bước 3: Chọn nhân viên */}
          {step === 2 && (
            <div>
              <h2 className="mb-2 text-xl font-bold text-[#6f4e37]">
                Chọn nhân viên
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Chọn nhân viên yêu thích hoặc để salon sắp xếp
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => {
                    setBeautician(null);
                    setTime('');
                  }}
                  className={`rounded-2xl border p-5 text-left transition ${!beautician
                      ? 'border-[#a87945] bg-[#faf5ed] ring-1 ring-[#a87945]'
                      : 'border-[#eee5d9] hover:border-[#c6a477]'
                    }`}
                >
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#efe2d0] text-2xl">
                    ✨
                  </div>
                  <p className="font-bold text-[#6f4e37]">
                    Không chọn nhân viên
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Salon sẽ sắp xếp nhân viên phù hợp cho bạn
                  </p>
                </button>

                {beauticians.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBeautician(b);
                      setTime('');
                    }}
                    className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition hover:shadow-md ${beautician?.id === b.id
                        ? 'border-[#a87945] bg-[#faf5ed] ring-1 ring-[#a87945]'
                        : 'border-[#eee5d9] hover:border-[#c6a477]'
                      }`}
                  >
                    <img
                      src={b.avatar_url}
                      alt={b.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-bold text-[#6f4e37]">
                        {b.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {b.specialty}
                      </p>
                      {beautician?.id === b.id && (
                        <p className="mt-2 text-xs font-semibold text-[#a87945]">
                          ✓ Đã chọn
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bước 4: Thông tin và giờ */}
          {step === 3 && (
            <div>
              <h2 className="mb-2 text-xl font-bold text-[#6f4e37]">
                Thông tin đặt lịch
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Điền thông tin và chọn thời gian phù hợp
              </p>

              <div className="mb-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6f4e37]">
                    Họ và tên *
                  </label>
                  <input
                    className="w-full rounded-xl border border-[#e8ded2] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a87945] focus:ring-2 focus:ring-[#a87945]/10"
                    placeholder="Nhập họ tên"
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6f4e37]">
                    Số điện thoại *
                  </label>
                  <input
                    className="w-full rounded-xl border border-[#e8ded2] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a87945] focus:ring-2 focus:ring-[#a87945]/10"
                    placeholder="Nhập số điện thoại"
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#6f4e37]">
                    Email
                  </label>
                  <input
                    className="w-full rounded-xl border border-[#e8ded2] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a87945] focus:ring-2 focus:ring-[#a87945]/10"
                    placeholder="example@gmail.com"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#6f4e37]">
                    Ghi chú
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-[#e8ded2] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a87945] focus:ring-2 focus:ring-[#a87945]/10"
                    rows={3}
                    placeholder="Bạn có yêu cầu gì thêm không?"
                    value={info.note}
                    onChange={(e) => setInfo({ ...info, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="mb-3 block font-semibold text-[#6f4e37]">
                  Chọn ngày đặt lịch
                </label>
                <input
                  type="date"
                  className="w-full max-w-xs rounded-xl border border-[#e8ded2] bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#a87945]"
                  min={today()}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime('');
                  }}
                />
              </div>

              <div>
                <p className="mb-2 font-semibold text-[#6f4e37]">
                  Chọn giờ
                </p>
                <p className="mb-4 text-sm text-gray-500">
                  Dịch vụ kéo dài khoảng {duration} phút
                </p>

                <div className="flex flex-wrap gap-3">
                  {slots.length === 0 && (
                    <p className="text-sm text-gray-500">
                      Không còn khung giờ phù hợp.
                    </p>
                  )}

                  {slots.map((s) => (
                    <button
                      key={s.t}
                      disabled={s.disabled}
                      onClick={() => setTime(s.t)}
                      className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition ${time === s.t
                          ? 'border-[#a87945] bg-[#a87945] text-white'
                          : 'border-[#e8ded2] text-[#6f4e37] hover:border-[#a87945] hover:bg-[#faf5ed]'
                        } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:line-through`}
                    >
                      {s.t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bước 5: Xác nhận */}
          {step === 4 && (
            <div>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf0df] text-3xl text-[#a87945]">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-[#6f4e37]">
                  Xác nhận đặt lịch
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Vui lòng kiểm tra lại thông tin của bạn
                </p>
              </div>

              <div className="space-y-4 rounded-2xl bg-[#faf7f2] p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Salon
                  </p>
                  <p className="mt-1 font-semibold text-[#6f4e37]">
                    {salon.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {salon.address}
                  </p>
                </div>

                <div className="border-t border-[#e8ded2]" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Nhân viên
                    </p>
                    <p className="mt-1 font-semibold text-[#6f4e37]">
                      {beautician ? beautician.name : 'Salon sắp xếp'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Thời gian
                    </p>
                    <p className="mt-1 font-semibold text-[#6f4e37]">
                      {time} · {date.split('-').reverse().join('/')}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#e8ded2]" />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Thông tin khách hàng
                  </p>
                  <p className="mt-2 font-semibold text-[#6f4e37]">
                    {info.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {info.phone}
                  </p>
                  {info.email && (
                    <p className="mt-1 text-sm text-gray-500">
                      {info.email}
                    </p>
                  )}
                </div>

                <div className="border-t border-[#e8ded2]" />

                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Dịch vụ đã chọn
                  </p>
                  <div className="space-y-3">
                    {chosen.map((s) => (
                      <div key={s.id} className="flex justify-between gap-3 text-sm">
                        <span className="text-gray-600">{s.name}</span>
                        <span className="font-semibold text-[#6f4e37]">
                          {money(s.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#e8ded2]" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#6f4e37]">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-[#a87945]">
                    {money(total)}
                  </span>
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Nút điều hướng */}
        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="rounded-full border border-[#c6a477] px-6 py-3 font-semibold text-[#8b623c] transition hover:bg-[#efe2d0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Quay lại
          </button>

          {step < 4 ? (
            <button
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
              className="rounded-full bg-[#a87945] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[#8b623c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Tiếp tục →
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={confirm}
              className="rounded-full bg-[#a87945] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[#8b623c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Xác nhận đặt lịch'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
