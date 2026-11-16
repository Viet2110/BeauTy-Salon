const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra');
  return data;
}

export const money = (n) => Number(n).toLocaleString('vi-VN') + 'đ';

export const STATUS = {
  pending: { label: 'Chờ xác nhận', cls: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Hoàn thành', cls: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', cls: 'bg-gray-200 text-gray-600' },
};
