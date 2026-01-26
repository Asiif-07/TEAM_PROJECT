import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import logo from "../../assets/images/logo.png";

const Header = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(180deg, #D1E9FF 0%, #FFFFFF 100%)",
        borderTop: "1px solid #49A1F133",
        borderBottom: "1px solid #49A1F133",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1280px",
          width: "100%",
          mx: "auto",
          minHeight: "80px",
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <Box component="img" src={logo} alt="Logo" sx={{ width: 36, height: 36 }} />
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#1E3A8A",
              whiteSpace: "nowrap",
            }}
          >
            CurriculumVit.AI
          </Typography>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "16px", lg: "28px" },
            flexWrap: "wrap",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          {["How It Work", "About", "Contact Us", "Pricing", "Blog"].map(
            (item) => (
              <Typography
                key={item}
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#1F2937",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </Typography>
            )
          )}

          {/* Language */}
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1F2937",
                whiteSpace: "nowrap",
              }}
            >
              Language
            </Typography>
            <ArrowDropDownIcon 
            sx={{ color: "#1F2937", fontSize: 20 }} />
          </Box>
        </Box>

        {/* Auth */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#2563EB",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Log In
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2563EB",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              px: "18px",
              py: "8px",
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1D4ED8" },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
