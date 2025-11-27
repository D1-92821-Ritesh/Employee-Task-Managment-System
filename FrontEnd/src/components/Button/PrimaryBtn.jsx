import "./PrimaryBtn.css";

export default function PrimaryBtn({
  onClick,
  disabled,
  loading,
  children,
  className = "submitButton",
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-busy={loading}
    >
      {loading ? "LOGGING IN..." : children}
    </button>
  );
}
