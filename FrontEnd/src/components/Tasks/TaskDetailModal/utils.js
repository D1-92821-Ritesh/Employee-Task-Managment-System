
export const getStatusColor = (status) => {
  if (!status) return "default";
  const s = String(status).toLowerCase().replace(/[_\s-]/g, "");
  if (s.includes("complete") || s.includes("done")) return "success";
  if (s.includes("inprogress") || s.includes("progress")) return "info";
  if (s.includes("todo") || s.includes("new") || s.includes("pending")) return "warning";
  if (s.includes("cancel") || s.includes("closed")) return "default";
  return "default";
};

export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "success";
    default: return "default";
  }
};


export const formatDate = (dt) => {
  if (!dt) return "-";
  return dt.split(" ")[0];
};
