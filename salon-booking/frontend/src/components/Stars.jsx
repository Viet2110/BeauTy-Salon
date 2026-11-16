export function Stars({ value = 0, size = 'text-lg' }) {
  return (
    <span className={`${size} text-yellow-400`} aria-label={`${value} sao`}>
      {[1, 2, 3, 4, 5].map((i) => (i <= Math.round(value) ? '★' : '☆'))}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-1 text-3xl">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} className={i <= value ? 'text-yellow-400' : 'text-gray-300'} aria-label={`${i} sao`}>
          ★
        </button>
      ))}
    </div>
  );
}
