import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../../api';
import { Stars } from '../../../components/Stars';

const formatMoney = (price) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

export default function SalonDetail() {
  const { id } = useParams();

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [beauticians, setBeauticians] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salonData, serviceData, beauticianData] = await Promise.all([
          api(`/salons/${id}`),
          api(`/salons/${id}/services`),
          api(`/salons/${id}/beauticians`),
        ]);

        setSalon(salonData);
        setServices(serviceData);
        setBeauticians(beauticianData);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu salon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  if (loading) {
    return <p className="py-20 text-center">Đang tải dữ liệu...</p>;
  }

  if (!salon) {
    return <p className="py-20 text-center">Không tìm thấy salon.</p>;
  }


  return (
    <div className="bg-[#fffdf9] text-[#49392d]">

      {/* Banner Salon */}
      <section className="relative h-[380px] overflow-hidden">
        <img
          src={salon.image_url}
          alt={salon.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-12 text-white">
            <p className="text-sm uppercase tracking-[4px] text-[#e8c99e]">
              Welcome to
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              {salon.name}
            </h1>
            <p className="mt-4 text-gray-200">
              📍 {salon.address}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-6 py-12">

        {/* Thông tin Salon */}
        <section className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[3px] text-[#b18a5a]">
                About our salon
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Không gian làm đẹp đẳng cấp
              </h2>
            </div>

            <p className="leading-8 text-gray-600">
              {salon.description}
            </p>

            <div className="flex items-center gap-3">
              <Stars value={salon.avg_rating} />
              <span className="font-semibold">
                {salon.avg_rating}/5
              </span>
              <span className="text-sm text-gray-500">
                ({salon.review_count} đánh giá)
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eee5d9] bg-[#faf6f0] p-6">
            <h3 className="mb-5 text-xl font-bold">
              Thông tin hoạt động
            </h3>

            <div className="space-y-5 text-sm">
              <div>
                <p className="text-gray-500">Giờ mở cửa</p>
                <p className="mt-1 font-semibold">
                  ◷ {String(salon.open_time).slice(0, 5)} - {String(salon.close_time).slice(0, 5)}                </p>
              </div>

              <div>
                <p className="text-gray-500">Điện thoại</p>
                <p className="mt-1 font-semibold">
                  ☎ {salon.phone}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Địa chỉ</p>
                <p className="mt-1 font-semibold">
                  {salon.address}
                </p>
              </div>
            </div>

            <Link
              to={`/book?salon=${salon.id}`}
              className="mt-7 block rounded-full bg-[#a87945] py-3 text-center font-semibold text-white transition hover:bg-[#8b623c]"
            >
              Đặt lịch ngay
            </Link>
          </div>
        </section>

        {/* Dịch vụ */}
        <section>
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[3px] text-[#b18a5a]">
              Our services
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Dịch vụ của chúng tôi
            </h2>
            <p className="mt-3 text-gray-500">
              Lựa chọn dịch vụ phù hợp với nhu cầu của bạn.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-[#eee5d9] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold">
                    {s.name}
                  </h3>
                  <span className="whitespace-nowrap font-bold text-[#a87945]">
                    {formatMoney(s.price)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {s.description}
                </p>

                <div className="mt-5 border-t border-[#eee5d9] pt-4 text-sm text-gray-500">
                  ⏱ Thời gian: {s.duration_min} phút
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nhân viên */}
        <section>
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[3px] text-[#b18a5a]">
              Our team
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Đội ngũ chuyên viên
            </h2>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {beauticians.map((b) => (
              <div
                key={b.id}
                className="overflow-hidden rounded-2xl border border-[#eee5d9] bg-white text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={b.avatar_url || 'https://placehold.co/400x400?text=Beauty+Staff'}
                  alt={b.name}
                  className="h-72 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-bold">
                    {b.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#a87945]">
                    {b.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[#8b623c] px-6 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">
            Sẵn sàng thay đổi diện mạo?
          </h2>
          <p className="mt-3 text-[#f0dfca]">
            Đặt lịch ngay hôm nay để trải nghiệm dịch vụ của chúng tôi.
          </p>

          <Link
            to={`/book?salon=${salon.id}`}
            className="mt-7 inline-block rounded-full bg-white px-9 py-3 font-semibold text-[#8b623c] transition hover:bg-[#f4e8d8]"
          >
            Đặt lịch ngay
          </Link>
        </section>

      </div>
    </div>
  );
}
