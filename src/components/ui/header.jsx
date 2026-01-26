import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import logo from "../../assets/images/logo.png";

const Header = () => {
  const navLinks = ["How It Work", "About", "Contact Us", "Pricing", "Blog", "Language"];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundImage: "linear-gradient(180deg, #D1E9FF 0%, #FFFFFF 100%)",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          minHeight: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        {/* Logo + Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ height: "36px", width: "36px" }}
          />
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              color: "#1F2937",
            }}
          >
            CurriculumVit.AI
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          {navLinks.map((link) => (
            <Box
              key={link}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: link === "Language" ? 0.5 : 0,
                cursor: "pointer",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  color: "#1F2937",
                  textTransform: "none",
                }}
              >
                {link}
              </Typography>
              {link === "Language" && <ArrowDropDownIcon sx={{ color: "#1F2937" }} />}
            </Box>
          ))}
        </Box>

        {/* Login & Sign Up */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              color: "#2563EB",
              textTransform: "none",
            }}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              borderRadius: "8px",
              backgroundColor: "#2563EB",
              textTransform: "none",
              px: 3,
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
