
import { useState } from 'react';

const initialUsers = [
    {
        id: 1,
        name: 'Nguyễn Văn An',
        email: 'an@gmail.com',
        phone: '0905123456',
        role: 'Khách hàng',
        status: 'Hoạt động',
    },
    {
        id: 2,
        name: 'Trần Thị Lan',
        email: 'lan@gmail.com',
        phone: '0912345678',
        role: 'Quản trị viên',
        status: 'Hoạt động',
    },
    {
        id: 3,
        name: 'Lê Minh Anh',
        email: 'anh@gmail.com',
        phone: '0987654321',
        role: 'Khách hàng',
        status: 'Đã khóa',
    },
];

function UsersAdmin() {
    const [users, setUsers] = useState(initialUsers);
    const [keyword, setKeyword] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Khách hàng',
        status: 'Hoạt động',
    });

    // Mở form thêm người dùng
    const handleAdd = () => {
        setEditId(null);
        setForm({
            name: '',
            email: '',
            phone: '',
            role: 'Khách hàng',
            status: 'Hoạt động',
        });
        setShowForm(true);
    };

    // Mở form sửa người dùng
    const handleEdit = (user) => {
        setEditId(user.id);
        setForm({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
        });
        setShowForm(true);
    };

    // Lưu người dùng
    const handleSubmit = (e) => {
        e.preventDefault();

        const emailExists = users.some(
            (item) =>
                item.email.toLowerCase() === form.email.trim().toLowerCase() &&
                item.id !== editId
        );

        if (emailExists) {
            alert('Email này đã được sử dụng!');
            return;
        }

        const userData = {
            ...form,
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
        };

        if (editId) {
            setUsers(
                users.map((item) =>
                    item.id === editId ? { ...item, ...userData } : item
                )
            );
        } else {
            setUsers([
                ...users,
                {
                    id: Date.now(),
                    ...userData,
                },
            ]);
        }

        setShowForm(false);
    };

    // Khóa hoặc mở khóa tài khoản
    const handleToggleStatus = (id) => {
        setUsers(
            users.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status:
                            item.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động',
                    }
                    : item
            )
        );
    };

    // Xóa người dùng
    const handleDelete = (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa người dùng này không?')) return;

        setUsers(users.filter((item) => item.id !== id));
    };

    // Tìm kiếm người dùng
    const filteredUsers = users.filter(
        (item) =>
            item.name.toLowerCase().includes(keyword.toLowerCase()) ||
            item.email.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#6f4e37]">
                    Quản lý người dùng
                </h1>
                <p className="mt-2 text-gray-500">
                    Quản lý thông tin và quyền tài khoản trong hệ thống.
                </p>
            </div>

            <div className="rounded-2xl border border-[#eee5d9] bg-white p-6 shadow-sm">

                {/* Tìm kiếm và thêm người dùng */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#6f4e37]">
                            Danh sách người dùng
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Tổng cộng {filteredUsers.length} người dùng
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm tên hoặc email..."
                            className="rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                        />

                        <button
                            onClick={handleAdd}
                            className="rounded-xl bg-[#a87945] px-5 py-3 font-semibold text-white transition hover:bg-[#8b623c]"
                        >
                            + Thêm người dùng
                        </button>
                    </div>
                </div>

                {/* Bảng người dùng */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">
                        <thead>
                            <tr className="border-b border-[#eee5d9] bg-[#faf7f2] text-sm text-[#8b623c]">
                                <th className="px-4 py-4">Họ và tên</th>
                                <th className="px-4 py-4">Email</th>
                                <th className="px-4 py-4">Số điện thoại</th>
                                <th className="px-4 py-4">Vai trò</th>
                                <th className="px-4 py-4">Trạng thái</th>
                                <th className="px-4 py-4">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-[#eee5d9] text-sm hover:bg-[#fffdf9]"
                                >
                                    <td className="px-4 py-5 font-semibold text-[#49392d]">
                                        {user.name}
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {user.email}
                                    </td>

                                    <td className="px-4 py-5 text-gray-600">
                                        {user.phone}
                                    </td>

                                    <td className="px-4 py-5">
                                        <span className="rounded-full bg-[#f5eee5] px-3 py-2 text-xs font-medium text-[#8b623c]">
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-4 py-5">
                                        <span
                                            className={`rounded-full px-3 py-2 text-xs font-medium ${user.status === 'Hoạt động'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-5">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="rounded-lg bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100"
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                onClick={() => handleToggleStatus(user.id)}
                                                className="rounded-lg bg-yellow-50 px-3 py-2 text-yellow-700 hover:bg-yellow-100"
                                            >
                                                {user.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500">
                                        Không tìm thấy người dùng.
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
                            {editId ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
                        </h2>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Họ và tên
                            </label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Nhập họ và tên"
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#6f4e37]">
                                Email
                            </label>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="Nhập email"
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
                                Vai trò
                            </label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="w-full rounded-xl border border-[#e8ded2] px-4 py-3 outline-none focus:border-[#a87945]"
                            >
                                <option value="Khách hàng">Khách hàng</option>
                                <option value="Quản trị viên">Quản trị viên</option>
                            </select>
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
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Đã khóa">Đã khóa</option>
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

export default UsersAdmin;
