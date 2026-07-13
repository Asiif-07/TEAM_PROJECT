import { Backdrop, CircularProgress, Typography } from "@mui/material";

export default function LoginLoader({ open, text = "Signing you in..." }) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: "#fff",
        flexDirection: "column",
      }}
    >
      <CircularProgress color="inherit" />
      <Typography sx={{ mt: 2, fontWeight: 700 }}>{text}</Typography>
    </Backdrop>
  );
}

