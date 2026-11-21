
import { useState } from 'react';

const initialServices = [
    {
        id: 1,
        name: 'Chăm sóc da mặt',
        description: 'Làm sạch và chăm sóc da chuyên sâu.',
        price: 350000,
        duration: 60,
    },
    {
        id: 2,
        name: 'Massage thư giãn',
        description: 'Giúp cơ thể thư giãn và giảm căng thẳng.',
        price: 500000,
        duration: 90,
    },
    {
        id: 3,
        name: 'Gội đầu dưỡng sinh',
        description: 'Thư giãn và chăm sóc tóc, da đầu.',
        price: 180000,
        duration: 45,
    },
];

const formatMoney = (price) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);

function ServicesAdmin() {
    const [services, setServices] = useState(initialServices);
    const [keyword, setKeyword] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
    });

    // Mở form thêm dịch vụ
    const handleAdd = () => {
        setEditId(null);
        setForm({
            name: '',
            description: '',
            price: '',
            duration: '',
        });
        setShowForm(true);
    };

    // Mở form sửa dịch vụ
    const handleEdit = (service) => {
        setEditId(service.id);
        setForm({
            name: service.name,
            description: service.description,
            price: String(service.price),
            duration: String(service.duration),
        });
        setShowForm(true);
    };

    // Lưu dịch vụ
    const handleSubmit = (e) => {
        e.preventDefault();

        const serviceData = {
            ...form,
            price: Number(form.price),
            duration: Number(form.duration),
        };

        if (editId) {
            setServices(services.map((item) =>
                item.id === editId
                    ? { ...item, ...serviceData }
                    : item
            ));
        } else {
            const newService = {
                id: Date.now(),
                ...serviceData,
            };

            setServices([...services, newService]);
        }

        setShowForm(false);
    };

    // Xóa dịch vụ
    const handleDelete = (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa dịch vụ này không?')) return;

        setServices(services.filter((item) => item.id !== id));
    };

    const filteredServices = services.filter((item) =>
        item.name.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#6f4e37]">
                    Quản lý dịch vụ
                </h1>
                <p className="mt-2 text-gray-500">
                    Quản lý các dịch vụ làm đẹp trong hệ thống.
                </p>
            </div>

            <div className="rounded-2xl border border-[#eee5d9] bg-white p-6 shadow-sm">

                {/* Tiêu đề và tìm kiếm */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#6f4e37]">
                            Danh sách dịch vụ
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Tổng cộng {filteredServices.length} dịch vụ
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                        />

                        <button
                            onClick={handleAdd}
                            className="rounded-xl bg-[#a87945] px-5 py-3 font-semibold text-white transition hover:bg-[#8b623c]"
                        >
                            + Thêm dịch vụ
                        </button>
                    </div>
                </div>

                {/* Bảng dịch vụ */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                        <thead>
                            <tr className="border-b border-[#eee5d9] bg-[#faf7f2] text-sm text-[#8b623c]">
                                <th className="px-4 py-4">Tên dịch vụ</th>
                                <th className="px-4 py-4">Mô tả</th>
                                <th className="px-4 py-4">Giá tiền</th>
                                <th className="px-4 py-4">Thời gian</th>
                                <th className="px-4 py-4">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredServices.map((service) => (
                                <tr
                                    key={service.id}
                                    className="border-b border-[#eee5d9] text-sm hover:bg-[#fffdf9]"
                                >
                                    <td className="px-4 py-5 font-semibold text-[#49392d]">
                                        {service.name}
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {service.description}
                                    </td>

                                    <td className="px-4 py-5 font-semibold text-[#a87945]">
                                        {formatMoney(service.price)}
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {service.duration} phút
                                    </td>

                                    <td className="px-4 py-5">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="rounded-lg bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100"
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredServices.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">
                                        Không tìm thấy dịch vụ.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form thêm và sửa */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-7 shadow-xl"
                    >
                        <h2 className="text-2xl font-bold text-[#6f4e37]">
                            {editId ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
                        </h2>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Tên dịch vụ
                            </label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Nhập tên dịch vụ"
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Mô tả
                            </label>
                            <textarea
                                required
                                rows="3"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Nhập mô tả dịch vụ"
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Giá tiền (VNĐ)
                            </label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                placeholder="Nhập giá tiền"
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Thời gian (phút)
                            </label>
                            <input
                                required
                                type="number"
                                min="1"
                                value={form.duration}
                                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                placeholder="Nhập thời gian"
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-xl border border-[#e8ded2] px-5 py-3 text-gray-600 hover:bg-gray-50"
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                className="rounded-xl bg-[#a87945] px-5 py-3 font-semibold text-white hover:bg-[#8b623c]"
                            >
                                {editId ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ServicesAdmin;
