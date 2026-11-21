
import { useState } from 'react';

const initialSalons = [
    {
        id: 1,
        name: 'Luxury Beauty Salon',
        address: '123 Nguyễn Văn Thoại, Đà Nẵng',
        phone: '0905 123 456',
        rating: 4.9,
        status: 'Hoạt động',
    },
    {
        id: 2,
        name: 'Beauty Spa',
        address: '45 Lê Duẩn, Đà Nẵng',
        phone: '0905 234 567',
        rating: 4.7,
        status: 'Hoạt động',
    },
    {
        id: 3,
        name: 'The Beauty House',
        address: '78 Nguyễn Văn Linh, Đà Nẵng',
        phone: '0905 345 678',
        rating: 4.5,
        status: 'Tạm ngưng',
    },
];

function SalonsAdmin() {
    const [salons, setSalons] = useState(initialSalons);
    const [keyword, setKeyword] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        status: 'Hoạt động',
    });

    // Mở form thêm mới
    const handleAdd = () => {
        setEditId(null);
        setForm({
            name: '',
            address: '',
            phone: '',
            status: 'Hoạt động',
        });
        setShowForm(true);
    };

    // Mở form sửa
    const handleEdit = (salon) => {
        setEditId(salon.id);
        setForm({
            name: salon.name,
            address: salon.address,
            phone: salon.phone,
            status: salon.status,
        });
        setShowForm(true);
    };

    // Lưu Salon
    const handleSubmit = (e) => {
        e.preventDefault();

        if (editId) {
            setSalons(salons.map((item) =>
                item.id === editId
                    ? { ...item, ...form }
                    : item
            ));
        } else {
            const newSalon = {
                id: Date.now(),
                ...form,
                rating: 0,
            };

            setSalons([...salons, newSalon]);
        }

        setShowForm(false);
    };

    // Xóa Salon
    const handleDelete = (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa salon này không?')) return;

        setSalons(salons.filter((item) => item.id !== id));
    };

    const filteredSalons = salons.filter((salon) =>
        salon.name.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#6f4e37]">
                    Quản lý Salon
                </h1>
                <p className="mt-2 text-gray-500">
                    Quản lý danh sách salon trong hệ thống.
                </p>
            </div>

            <div className="rounded-2xl border border-[#eee5d9] bg-white p-6 shadow-sm">

                {/* Tiêu đề và tìm kiếm */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#6f4e37]">
                            Danh sách Salon
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Tổng cộng {filteredSalons.length} salon
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm salon..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                        />

                        <button
                            onClick={handleAdd}
                            className="rounded-xl bg-[#a87945] px-5 py-3 font-semibold text-white transition hover:bg-[#8b623c]"
                        >
                            + Thêm Salon
                        </button>
                    </div>
                </div>

                {/* Bảng Salon */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                        <thead>
                            <tr className="border-b border-[#eee5d9] bg-[#faf7f2] text-sm text-[#8b623c]">
                                <th className="px-4 py-4">Tên Salon</th>
                                <th className="px-4 py-4">Địa chỉ</th>
                                <th className="px-4 py-4">Điện thoại</th>
                                <th className="px-4 py-4">Đánh giá</th>
                                <th className="px-4 py-4">Trạng thái</th>
                                <th className="px-4 py-4">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSalons.map((salon) => (
                                <tr
                                    key={salon.id}
                                    className="border-b border-[#eee5d9] text-sm hover:bg-[#fffdf9]"
                                >
                                    <td className="px-4 py-5 font-semibold text-[#49392d]">
                                        {salon.name}
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {salon.address}
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {salon.phone}
                                    </td>

                                    <td className="px-4 py-5 font-semibold text-[#a87945]">
                                        ⭐ {salon.rating}
                                    </td>

                                    <td className="px-4 py-5">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${salon.status === 'Hoạt động'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {salon.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-5">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(salon)}
                                                className="rounded-lg bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100"
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                onClick={() => handleDelete(salon.id)}
                                                className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredSalons.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500">
                                        Không tìm thấy salon.
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
                            {editId ? 'Cập nhật Salon' : 'Thêm Salon mới'}
                        </h2>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Tên Salon
                            </label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Nhập tên Salon"
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Địa chỉ
                            </label>
                            <input
                                required
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                placeholder="Nhập địa chỉ"
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Số điện thoại
                            </label>
                            <input
                                required
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                placeholder="Nhập số điện thoại"
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Trạng thái
                            </label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            >
                                <option>Hoạt động</option>
                                <option>Tạm ngưng</option>
                            </select>
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

export default SalonsAdmin;
