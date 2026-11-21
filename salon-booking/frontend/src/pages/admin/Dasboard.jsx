
const stats = [
    {
        title: 'Tổng số salon',
        value: '12',
        icon: '🏢',
        note: 'Đang hoạt động',
    },
    {
        title: 'Khách hàng',
        value: '248',
        icon: '👥',
        note: 'Tổng tài khoản',
    },
    {
        title: 'Lịch đặt hôm nay',
        value: '18',
        icon: '📅',
        note: 'Lịch hẹn mới',
    },
    {
        title: 'Doanh thu',
        value: '25.500.000đ',
        icon: '💰',
        note: 'Doanh thu tháng này',
    },
];

const activities = [
    { name: 'Nguyễn Văn An', action: 'đã đặt lịch tại Luxury Beauty Salon', time: '09:30' },
    { name: 'Trần Thị Mai', action: 'đã đăng ký tài khoản', time: '10:15' },
    { name: 'Lê Minh Anh', action: 'đã gửi đánh giá mới', time: '11:00' },
];

function Dashboard() {
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-medium text-[#b18a60]">
                    SALON BEAUTY / ADMIN
                </p>
                <h1 className="mt-2 text-3xl font-bold text-[#6f4e37]">
                    Tổng quan
                </h1>
                <p className="mt-2 text-gray-500">
                    Chào mừng bạn đến với trang quản trị Salon Beauty!
                </p>
            </div>

            {/* Thống kê */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-[#eee5d9] bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">{item.title}</p>
                            <span className="text-2xl">{item.icon}</span>
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-[#6f4e37]">
                            {item.value}
                        </h2>

                        <p className="mt-2 text-xs text-[#a87945]">
                            {item.note}
                        </p>
                    </div>
                ))}
            </div>

            {/* Hoạt động gần đây */}
            <div className="rounded-2xl border border-[#eee5d9] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#6f4e37]">
                    Hoạt động gần đây
                </h2>

                <div className="mt-5 divide-y divide-[#eee5d9]">
                    {activities.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-wrap items-center justify-between gap-3 py-4"
                        >
                            <div>
                                <p className="font-semibold text-[#49392d]">
                                    {item.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {item.action}
                                </p>
                            </div>

                            <span className="text-sm text-[#a87945]">
                                {item.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
