import { Box } from "@mui/material";

export default function Body({ children }) {
  return (
    <Box
      sx={{
        height: "95vh",
        width: "100%",
        borderRight: "1px solid rgba(255,255,255,0.1)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        p: 3,
        borderRadius: "30px",
        overflow: "hidden",
        WebkitOverflowScrolling: "touch",

        // Hide scrollbars
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },

        // MATCHING GRADIENT FROM DRAWER
        background: `
          radial-gradient(ellipse at 15% 25%, rgba(139,92,246,0.25), transparent 50%),
          radial-gradient(ellipse at 85% 75%, rgba(6,182,212,0.25), transparent 50%),
          linear-gradient(135deg, #0f172a, #1e293b 50%, #0f172a)
        `,

        // MATCHING SHADOW
        boxShadow: "0 0 25px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </Box>
  );
}
