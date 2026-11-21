
export default function Consultants() {
  const list = [
    {
      id: 1,
      name: "Nguyễn Thị Minh Anh",
      specialty: "Chuyên viên chăm sóc da",
      phone: "0905123456",
      email: "minhanh@gmail.com",
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
    },
    {
      id: 2,
      name: "Trần Ngọc Hà",
      specialty: "Chuyên viên tư vấn làm đẹp",
      phone: "0905234567",
      email: "ngocha@gmail.com",
      avatar_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400"
    },
    {
      id: 3,
      name: "Lê Thảo Vy",
      specialty: "Chuyên viên chăm sóc cơ thể",
      phone: "0905345678",
      email: "thaovy@gmail.com",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
    }
  ];

  return (
    <div className="bg-[#fffdf9] min-h-screen">

      {/* Banner */}
      <section className="bg-[#f8f1e8] py-20 px-8 text-center">
        <p className="text-sm uppercase tracking-[4px] text-[#b58b5b] mb-4">
          Our Consultants
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-[#594331] mb-5">
          Đội ngũ tư vấn viên
        </h1>

        <p className="max-w-2xl mx-auto text-gray-500 leading-8">
          Những người đồng hành tận tâm sẽ giúp bạn lựa chọn
          dịch vụ làm đẹp phù hợp với nhu cầu của mình.
        </p>
      </section>

      {/* Danh sách */}
      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-[#594331]">
            Gặp gỡ đội ngũ của chúng tôi
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {list.length} tư vấn viên
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-[#eee5d9] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="bg-[#f8f3eb] pt-8 pb-6 flex justify-center">
                <img
                  src={c.avatar_url}
                  alt={c.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>

              <div className="p-7 text-center">
                <h3 className="text-xl font-semibold text-[#594331]">
                  {c.name}
                </h3>

                <p className="text-[#b58b5b] text-sm mt-2 mb-6">
                  {c.specialty}
                </p>

                <div className="border-t border-[#eee5d9] pt-5 space-y-3 text-sm text-gray-500 text-left">
                  <p>☎ {c.phone}</p>
                  <p className="break-all">✉ {c.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
