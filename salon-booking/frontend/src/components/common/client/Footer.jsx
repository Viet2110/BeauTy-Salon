
function Footer() {
    return (
        <footer className="bg-[#3d3027] text-white">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <h2 className="mb-3 text-xl font-bold text-[#d6b88c]">
                            Salon Beauty
                        </h2>
                        <p className="text-sm leading-6 text-gray-300">
                            Nơi chăm sóc và tôn vinh vẻ đẹp của bạn.
                            Đặt lịch dễ dàng, trải nghiệm dịch vụ tuyệt vời.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-3 font-semibold text-[#d6b88c]">
                            Liên kết
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>Trang chủ</li>
                            <li>Salon</li>
                            <li>Dịch vụ</li>
                            <li>Đánh giá</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-3 font-semibold text-[#d6b88c]">
                            Liên hệ
                        </h3>
                        <p className="text-sm text-gray-300">
                            Email: salonbeauty@gmail.com
                        </p>
                        <p className="mt-2 text-sm text-gray-300">
                            Hotline: 0900 123 456
                        </p>
                    </div>
                </div>
                <hr className="my-6 border-gray-600" />
                <p className="text-center text-xs text-gray-400">
                    © 2026 Salon Beauty. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
