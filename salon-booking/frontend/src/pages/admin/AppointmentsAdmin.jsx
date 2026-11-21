
import { useEffect, useState } from 'react';
import { api, money } from '../../api';

function AppointmentsAdmin() {
    const [appointments, setAppointments] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    // Lấy danh sách lịch đặt từ API
    useEffect(() => {
        api('/admin/appointments')
            .then(setAppointments)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Chuyển trạng thái sang tiếng Việt
    const statusName = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        completed: 'Đã hoàn thành',
        cancelled: 'Đã hủy',
    };

    const statusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'confirmed':
                return 'bg-blue-100 text-blue-700';
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Cập nhật trạng thái lên Database
    const handleStatus = async (id, status) => {
        try {
            setUpdatingId(id);
            setError('');

            const result = await api(`/admin/appointments/${id}/status`, {
                method: 'PATCH',
                body: { status },
            });

            setAppointments((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, status: result.status }
                        : item
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    // Tìm kiếm và lọc lịch đặt
    const filteredAppointments = appointments.filter((item) => {
        const search = keyword.toLowerCase();

        const matchKeyword =
            (item.customer_name || '').toLowerCase().includes(search) ||
            (item.customer_phone || '').includes(search) ||
            (item.salon_name || '').toLowerCase().includes(search);

        const matchStatus =
            statusFilter === 'all' || item.status === statusFilter;

        return matchKeyword && matchStatus;
    });

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(`${String(date).slice(0, 10)}T00:00:00`)
            .toLocaleDateString('vi-VN');
    };

    if (loading) {
        return <p className="p-6 text-gray-500">Đang tải lịch đặt...</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#6f4e37]">
                    Quản lý lịch đặt
                </h1>
                <p className="mt-2 text-gray-500">
                    Theo dõi và quản lý lịch đặt dịch vụ của khách hàng.
                </p>
            </div>

            <div className="rounded-2xl border border-[#eee5d9] bg-white p-6 shadow-sm">

                {/* Thống kê và tìm kiếm */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#6f4e37]">
                            Danh sách lịch đặt
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Tổng cộng {filteredAppointments.length} lịch đặt
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm tên, số điện thoại..."
                            className="rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="completed">Đã hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* Bảng lịch đặt */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-left">
                        <thead>
                            <tr className="border-b border-[#eee5d9] bg-[#faf7f2] text-sm text-[#8b623c]">
                                <th className="px-4 py-4">Khách hàng</th>
                                <th className="px-4 py-4">Salon</th>
                                <th className="px-4 py-4">Dịch vụ</th>
                                <th className="px-4 py-4">Ngày đặt</th>
                                <th className="px-4 py-4">Giờ</th>
                                <th className="px-4 py-4">Giá tiền</th>
                                <th className="px-4 py-4">Trạng thái</th>
                                <th className="px-4 py-4">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAppointments.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-[#eee5d9] text-sm hover:bg-[#fffdf9]"
                                >
                                    <td className="px-4 py-5">
                                        <p className="font-semibold text-[#49392d]">
                                            {item.customer_name}
                                        </p>
                                        <p className="mt-1 text-gray-500">
                                            {item.customer_phone}
                                        </p>
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {item.salon_name}
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {item.service_names || 'Chưa có dịch vụ'}
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {formatDate(item.appointment_date)}
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {String(item.appointment_time).slice(0, 5)}
                                    </td>

                                    <td className="px-4 py-5 font-semibold text-[#a87945]">
                                        {money(item.total_price)}
                                    </td>

                                    <td className="px-4 py-5">
                                        <span className={`rounded-full px-3 py-2 text-xs font-medium ${statusColor(item.status)}`}>
                                            {statusName[item.status] || item.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-5">
                                        <select
                                            value={item.status}
                                            disabled={updatingId === item.id}
                                            onChange={(e) =>
                                                handleStatus(item.id, e.target.value)
                                            }
                                            className="rounded-lg border border-[#e8ded2] px-2 py-2 text-xs outline-none disabled:opacity-50"
                                        >
                                            <option value="pending">Chờ xác nhận</option>
                                            <option value="confirmed">Đã xác nhận</option>
                                            <option value="completed">Đã hoàn thành</option>
                                            <option value="cancelled">Đã hủy</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {filteredAppointments.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-500">
                                        Không tìm thấy lịch đặt.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AppointmentsAdmin;
