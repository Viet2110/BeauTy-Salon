import { useEffect, useState } from 'react';
import { api } from '../../../api';
import { Link } from 'react-router-dom';
import { Stars } from '../../../components/Stars';

export default function Salons() {
  const [keyword, setKeyword] = useState('');
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const data = await api('/salons');
        setSalons(data);
      } catch (error) {
        console.error('Lỗi lấy danh sách salon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  const filteredSalons = salons.filter((salon) =>
    salon.name.toLowerCase().includes(keyword.toLowerCase()) ||
    (salon.address || '').toLowerCase().includes(keyword.toLowerCase())
  );
  return (
    <div className="bg-[#fffdf9] text-[#49392d]">
      {/* Banner */}
      <section className="relative min-h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800"
          alt="Beauty Salon"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-center px-6">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-sm uppercase tracking-[5px] text-[#e8c99e]">
              Welcome to Salon Beauty
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Vẻ đẹp của bạn,
              <br />
              sự tận tâm của chúng tôi.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-200">
              Khám phá những salon làm đẹp chất lượng,
              trải nghiệm dịch vụ chuyên nghiệp và đặt lịch
              dễ dàng chỉ với vài thao tác.
            </p>

            <a
              href="#salons"
              className="mt-8 inline-block rounded-full bg-[#b18a5a] px-8 py-3 font-semibold text-white transition hover:bg-[#967044]"
            >
              Khám phá ngay
            </a>
          </div>
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[4px] text-[#b18a5a]">
            About us
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Chăm sóc vẻ đẹp của bạn
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-500">
            Salon Beauty giúp bạn tìm kiếm những địa điểm
            làm đẹp phù hợp, lựa chọn dịch vụ yêu thích
            và đặt lịch nhanh chóng.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: '✦',
              title: 'Salon chất lượng',
              desc: 'Khám phá những địa điểm làm đẹp đáng tin cậy.',
            },
            {
              icon: '♡',
              title: 'Dịch vụ chuyên nghiệp',
              desc: 'Lựa chọn dịch vụ phù hợp với nhu cầu của bạn.',
            },
            {
              icon: '◷',
              title: 'Đặt lịch dễ dàng',
              desc: 'Chủ động lựa chọn thời gian làm đẹp.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#eee5d9] bg-white p-8 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl text-[#b18a5a]">
                {item.icon}
              </div>

              <h3 className="mt-5 text-lg font-bold">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Danh sách Salon */}
      <section id="salons" className="bg-[#f8f4ee] px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[4px] text-[#b18a5a]">
                Our salons
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Salon nổi bật
              </h2>

              <p className="mt-3 text-gray-500">
                Những địa điểm làm đẹp được yêu thích.
              </p>
            </div>

            <input
              type="text"
              placeholder="Tìm kiếm salon..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full rounded-full border border-[#e5d8c7] bg-white px-6 py-3 outline-none transition focus:border-[#b18a5a] md:w-80"
            />
          </div>

          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="col-span-full py-12 text-center text-gray-500">
                Đang tải danh sách salon...
              </p>
            ) : (filteredSalons.map((salon) => (
              <div
                key={salon.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={salon.image_url}
                    alt={salon.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-110"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#967044]">
                    Salon nổi bật
                  </span>
                </div>

                <div className="space-y-3 p-5">
                  <h3 className="text-xl font-bold">
                    {salon.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    📍 {salon.address}
                  </p>

                  <p className="text-sm text-gray-500">
                    ◷ {String(salon.open_time).slice(0, 5)} - {String(salon.close_time).slice(0, 5)}
                  </p>

                  <div className="flex items-center gap-2 text-sm">
                    <Stars value={salon.avg_rating} />
                    <span className="text-gray-500">
                      {salon.avg_rating} ({salon.review_count} đánh giá)
                    </span>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <Link
                      to={`/salons/${salon.id}`}
                      className="flex-1 rounded-full border border-[#b18a5a] py-3 text-center text-sm font-semibold text-[#967044] transition hover:bg-[#f8f1e7]"
                    >
                      Chi tiết
                    </Link>

                    <Link
                      to={`/book?salon=${salon.id}`}
                      className="flex-1 rounded-full bg-[#a87945] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#8b623c]"
                    >
                      Đặt lịch
                    </Link>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {!loading && filteredSalons.length === 0 && (
            <p className="py-12 text-center text-gray-500">
              Không tìm thấy salon phù hợp.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}
