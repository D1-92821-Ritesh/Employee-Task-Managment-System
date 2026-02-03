import "./PrimaryBtn.css";

export default function PrimaryBtn({
  onClick,
  disabled,
  loading,
  children,
  className = "submitButton",
  type = "button",
}) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-busy={loading}
    >
      {loading ? "LOGGING IN..." : children}
    </button>
  );
}
