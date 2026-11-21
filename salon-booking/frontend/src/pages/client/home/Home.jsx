
import { Link } from 'react-router-dom';

function Home() {
    const services = [
        {
            name: "Chăm sóc da",
            description: "Nuôi dưỡng làn da khỏe đẹp, mềm mại và rạng rỡ.",
            image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800"
        },
        {
            name: "Massage thư giãn",
            description: "Thư giãn cơ thể, giải tỏa căng thẳng sau ngày dài.",
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800"
        },
        {
            name: "Chăm sóc tóc",
            description: "Tận hưởng những liệu trình chăm sóc tóc chuyên sâu.",
            image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"
        }
    ];

    return (
        <div className="bg-[#fffdf9] text-[#594331]">

            {/* Banner */}
            <section className="relative min-h-[600px] flex items-center">
                <img
                    src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1800"
                    alt="Salon Beauty"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 max-w-7xl mx-auto w-full px-8 py-24">
                    <div className="max-w-2xl text-white">
                        <p className="uppercase tracking-[5px] text-sm mb-6 text-[#f3d6a5]">
                            Welcome to Salon Beauty
                        </p>

                        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                            Vẻ đẹp của bạn,
                            <br />
                            niềm vui của chúng tôi
                        </h1>

                        <p className="text-lg text-white/90 leading-8 mb-10">
                            Khám phá những trải nghiệm làm đẹp và thư giãn
                            tuyệt vời. Chúng tôi luôn đồng hành cùng bạn
                            trên hành trình chăm sóc bản thân.
                        </p>

                        <Link
                            to="/salons"
                            className="inline-block bg-[#c49a65] hover:bg-[#a87945] text-white px-9 py-4 rounded-full transition duration-300"
                        >
                            Khám phá salon
                        </Link>
                    </div>
                </div>
            </section>

            {/* Giới thiệu */}
            <section className="max-w-7xl mx-auto px-8 py-24 text-center">
                <p className="text-[#b58b5b] uppercase tracking-[4px] text-sm mb-4">
                    About Us
                </p>

                <h2 className="text-4xl font-semibold mb-6">
                    Chăm sóc vẻ đẹp từ những điều nhỏ nhất
                </h2>

                <p className="max-w-3xl mx-auto text-gray-500 leading-8">
                    Salon Beauty mang đến không gian làm đẹp chuyên nghiệp,
                    nơi bạn có thể tận hưởng những dịch vụ chất lượng,
                    thư giãn và chăm sóc bản thân một cách trọn vẹn.
                </p>
            </section>

            {/* Dịch vụ */}
            <section className="bg-[#f8f3eb] py-24">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-14">
                        <p className="text-[#b58b5b] uppercase tracking-[4px] text-sm mb-4">
                            Our Services
                        </p>

                        <h2 className="text-4xl font-semibold">
                            Dịch vụ nổi bật
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"
                            >
                                <div className="h-72 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                </div>

                                <div className="p-7 text-center">
                                    <h3 className="text-2xl font-semibold mb-4">
                                        {item.name}
                                    </h3>

                                    <p className="text-gray-500 leading-7 mb-6">
                                        {item.description}
                                    </p>

                                    <Link
                                        to="/salons"
                                        className="text-[#a87945] font-medium hover:text-[#79512f] transition"
                                    >
                                        Khám phá ngay →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lý do lựa chọn */}
            <section className="max-w-7xl mx-auto px-8 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1000"
                            alt="Không gian thư giãn"
                            className="w-full h-[450px] object-cover rounded-2xl shadow-lg"
                        />
                    </div>

                    <div>
                        <p className="text-[#b58b5b] uppercase tracking-[4px] text-sm mb-4">
                            Why Choose Us
                        </p>

                        <h2 className="text-4xl font-semibold leading-tight mb-8">
                            Trải nghiệm làm đẹp
                            <br />
                            theo cách riêng của bạn
                        </h2>

                        <div className="space-y-7">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Không gian thư giãn
                                </h3>
                                <p className="text-gray-500 leading-7">
                                    Không gian nhẹ nhàng, thoải mái giúp bạn
                                    tận hưởng những phút giây thư giãn.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Dịch vụ chuyên nghiệp
                                </h3>
                                <p className="text-gray-500 leading-7">
                                    Đa dạng dịch vụ chăm sóc sắc đẹp phù hợp
                                    với nhu cầu của từng khách hàng.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Đặt lịch dễ dàng
                                </h3>
                                <p className="text-gray-500 leading-7">
                                    Tìm kiếm salon yêu thích và chủ động
                                    lựa chọn lịch hẹn phù hợp.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kêu gọi đặt lịch */}
            <section className="bg-[#8b6848] py-20 text-center px-8">
                <p className="text-[#f1d5ae] uppercase tracking-[4px] text-sm mb-5">
                    Your Beauty Journey
                </p>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                   Đã đến lúc yêu chiều bản thân của bạn
                </h2>

                <p className="text-white/80 mb-9">
                    Hãy lựa chọn salon yêu thích và đặt lịch ngay hôm nay.
                </p>

                <Link
                    to="/salons"
                    className="inline-block bg-[#f4e5cf] text-[#79512f] px-9 py-4 rounded-full font-medium hover:bg-white transition"
                >
                    Đặt lịch ngay
                </Link>
            </section>

        </div>
    );
}

export default Home;
