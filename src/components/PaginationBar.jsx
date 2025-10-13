// src/components/PaginationBar.jsx
const Btn = ({ active, disabled, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={[
      "px-3 py-2 rounded-md border text-sm transition",
      active
        ? "bg-purple-600 text-white border-purple-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-purple-300"
    ].join(" ")}
  >
    {children}
  </button>
);

const PaginationBar = ({ page, totalPages, onPageChange, hasPrev, hasNext }) => {
  if (!totalPages || totalPages <= 1) return null;

  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const prevDisabled = hasPrev === false || page === 1;
  const nextDisabled = hasNext === false || page === totalPages;

  return (
    <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
      <Btn disabled={prevDisabled} onClick={() => onPageChange(page - 1)}>Prev</Btn>

      {start > 1 && (
        <>
          <Btn onClick={() => onPageChange(1)}>1</Btn>
          {start > 2 && <span className="px-2 text-gray-400 select-none">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Btn key={p} active={p === page} onClick={() => onPageChange(p)}>
          {p}
        </Btn>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-gray-400 select-none">…</span>}
          <Btn onClick={() => onPageChange(totalPages)}>{totalPages}</Btn>
        </>
      )}

      <Btn disabled={nextDisabled} onClick={() => onPageChange(page + 1)}>Next</Btn>
    </nav>
  );
};

export default PaginationBar;
