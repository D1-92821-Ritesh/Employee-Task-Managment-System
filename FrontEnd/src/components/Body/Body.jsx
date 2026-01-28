import { Box } from "@mui/material";

export default function Body({ children }) {
  return (
    <Box
      sx={{
        height: "96vh",
        width: "100%",
        boxSizing: "border-box",
        borderRadius: "30px",
        margin: "10px",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        color: "white",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",

        // Hide scrollbars but reserve space
        scrollbarWidth: "thin",
        scrollbarColor: "transparent transparent",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "transparent",
        },

        // MATCHING GRADIENT FROM SIDEBAR
        background: `
          radial-gradient(ellipse at 15% 25%, rgba(139,92,246,0.25), transparent 50%),
          radial-gradient(ellipse at 85% 75%, rgba(6,182,212,0.25), transparent 50%),
          linear-gradient(135deg, #0f172a, #1e293b 50%, #0f172a)
        `,

        // MATCHING SHADOW AND BORDER
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 0 25px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </Box>
  );
}
