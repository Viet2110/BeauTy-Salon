
import { useState } from 'react';
import { StarInput, Stars } from '../../components/Stars';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const list = [
    {
      id: 1,
      name: 'Nguyễn Minh Anh',
      rating: 5,
      comment: 'Không gian đẹp, nhân viên nhiệt tình và dịch vụ rất tốt.',
      date: '15/11/2026'
    },
    {
      id: 2,
      name: 'Trần Ngọc Hà',
      rating: 4,
      comment: 'Dịch vụ tốt, nhân viên tư vấn rất chu đáo.',
      date: '12/11/2026'
    },
    {
      id: 3,
      name: 'Lê Thảo Vy',
      rating: 5,
      comment: 'Mình rất hài lòng với trải nghiệm tại salon.',
      date: '10/11/2026'
    }
  ];

  const avg = list.reduce((sum, item) => sum + item.rating, 0) / list.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã gửi đánh giá!');
    setRating(0);
    setComment('');
  };

  return (
    <div className="bg-[#fffdf9] min-h-screen">

      {/* Banner */}
      <section className="bg-[#f8f1e8] py-20 px-8 text-center">
        <p className="text-sm uppercase tracking-[4px] text-[#b58b5b] mb-4">
          Customer Reviews
        </p>

        <h1 className="text-4xl font-serif text-[#594331] mb-5">
          Đánh giá khách hàng
        </h1>

        <p className="text-gray-500 max-w-2xl mx-auto leading-8">
          Những chia sẻ chân thực từ khách hàng sau khi trải nghiệm
          dịch vụ tại Salon Beauty.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-16">

        {/* Điểm đánh giá */}
        <div className="bg-white border border-[#eee5d9] rounded-2xl p-8 text-center shadow-sm mb-12">
          <h2 className="text-xl font-serif text-[#594331] mb-4">
            Điểm đánh giá trung bình
          </h2>

          <p className="text-5xl font-semibold text-[#a87945] mb-3">
            {avg.toFixed(1)}/5
          </p>

          <div className="flex justify-center mb-3">
            <Stars value={avg} />
          </div>

          <p className="text-sm text-gray-500">
            Dựa trên {list.length} đánh giá
          </p>
        </div>

        {/* Form đánh giá */}
        <div className="bg-[#f8f3eb] rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-serif text-[#594331] mb-6">
            Chia sẻ trải nghiệm của bạn
          </h2>

          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600 mb-3">
              Bạn đánh giá dịch vụ như thế nào?
            </p>

            <StarInput
              value={rating}
              onChange={setRating}
            />

            <textarea
              className="w-full mt-6 p-4 rounded-xl border border-[#e8ddce] outline-none focus:border-[#b58b5b]"
              rows={4}
              placeholder="Viết nhận xét của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              type="submit"
              disabled={!rating}
              className="mt-5 bg-[#a87945] text-white px-8 py-3 rounded-full hover:bg-[#8b623c] transition disabled:opacity-50"
            >
              Gửi đánh giá
            </button>
          </form>
        </div>

        {/* Danh sách đánh giá */}
        <div>
          <h2 className="text-2xl font-serif text-[#594331] mb-7">
            Khách hàng nói gì?
          </h2>

          <div className="space-y-5">
            {list.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#eee5d9] rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-[#594331]">
                    {item.name}
                  </h3>

                  <span className="text-sm text-gray-400">
                    {item.date}
                  </span>
                </div>

                <Stars value={item.rating} />

                <p className="text-gray-600 mt-3 leading-7">
                  {item.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
