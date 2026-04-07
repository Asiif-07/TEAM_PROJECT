import { AppBar, Toolbar, Box, Button, Typography, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText, Avatar } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleUserMenuClick = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const navLinks = [
    { pageName: "How It Work", path: "/how-it-works" },
    { pageName: "Services", path: "/services" },
    { pageName: "About", path: "/about" },
    { pageName: "Contact Us", path: "/contact-us" },
    { pageName: "Blog", path: "/blog" }
  ];

  return (
    <AppBar
      className="glass"
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.5)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "none",
        zIndex: 1100
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
        {/* Logo (clickable, goes to home) */}
        <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, textDecoration: "none" }}>
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
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: { xs: "16px", lg: "28px" },
            flexWrap: "wrap",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          {navLinks.map((item) => (
            <Link key={item.pageName} to={item.path} style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#1F2937",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {item.pageName}
              </Typography>
            </Link>
          ))}

          {/* Language */}
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleLanguageClick}>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1F2937",
                whiteSpace: "nowrap",
              }}
            >
              {selectedLanguage}
            </Typography>
            <ArrowDropDownIcon
              sx={{ color: "#1F2937", fontSize: 20 }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageClose}
            sx={{
              "& .MuiPaper-root": {
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                borderRadius: "8px",
                mt: 1,
              },
            }}
          >
            <MenuItem
              onClick={() => handleLanguageSelect("English")}
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                backgroundColor: selectedLanguage === "English" ? "#EFF6FF" : "transparent",
              }}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageSelect("Spanish")}
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                backgroundColor: selectedLanguage === "Spanish" ? "#EFF6FF" : "transparent",
              }}
            >
              Spanish
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageSelect("French")}
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                backgroundColor: selectedLanguage === "French" ? "#EFF6FF" : "transparent",
              }}
            >
              French
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageSelect("German")}
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                backgroundColor: selectedLanguage === "German" ? "#EFF6FF" : "transparent",
              }}
            >
              German
            </MenuItem>
          </Menu>
        </Box>

        {/* Mobile hamburger */}
        <Box
          onClick={handleDrawerToggle}
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 44,
            height: 44,
            cursor: "pointer",
            zIndex: 1300,
            ml: "auto",
            position: "relative",
          }}
        >
          <Box sx={{ width: 24, height: 2.5, bgcolor: "#1E3A8A", borderRadius: "2px", transition: "all 0.3s ease-in-out", position: "absolute", transform: mobileOpen ? "rotate(45deg)" : "translateY(-8px)" }} />
          <Box sx={{ width: 24, height: 2.5, bgcolor: "#1E3A8A", borderRadius: "2px", transition: "all 0.3s ease-in-out", position: "absolute", opacity: mobileOpen ? 0 : 1 }} />
          <Box sx={{ width: 24, height: 2.5, bgcolor: "#1E3A8A", borderRadius: "2px", transition: "all 0.3s ease-in-out", position: "absolute", transform: mobileOpen ? "rotate(-45deg)" : "translateY(8px)" }} />
        </Box>

        {/* Auth (desktop) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={handleUserMenuClick}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                  color: "#1F2937",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "12px",
                  gap: "8px",
                  px: 1,
                  "&:hover": { backgroundColor: "#F3F4F6" },
                }}
              >
                <Avatar
                  src={user.profileImage?.secure_url}
                  sx={{ width: 32, height: 32, bgcolor: "#2563EB", fontSize: "14px", fontWeight: 700 }}
                >
                  {!user.profileImage?.secure_url && user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography sx={{ display: { xs: "none", sm: "block" }, fontSize: "14px", fontWeight: 600 }}>
                  Hi, {user?.name?.split(" ")[0] || "User"}
                </Typography>
              </Button>
              <Menu
                anchorEl={userAnchorEl}
                open={Boolean(userAnchorEl)}
                onClose={handleUserMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    borderRadius: "12px",
                    mt: 1,
                    minWidth: "160px",
                  },
                }}
              >
                <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose} sx={{ fontFamily: "Inter, sans-serif", fontSize: "14px", py: 1.5 }}>
                  My Profile
                </MenuItem>
                <MenuItem component={Link} to="/my-cvs" onClick={handleUserMenuClose} sx={{ fontFamily: "Inter, sans-serif", fontSize: "14px", py: 1.5 }}>
                  My CVs
                </MenuItem>
                <Box sx={{ borderTop: "1px solid #E5E7EB", my: 1 }} />
                <MenuItem
                  onClick={() => { logout(); handleUserMenuClose(); }}
                  sx={{ fontFamily: "Inter, sans-serif", fontSize: "14px", py: 1.5, color: "#DC2626" }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#2563EB",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Log In
                </Typography>
              </Link>

              <Link to="/signup" style={{ textDecoration: "none" }}>
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
              </Link>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile drawer */}
      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "320px",
            background: "#FFFFFF",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            px: 3,
            py: 4,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 4 }}>
          <Box component="img" src={logo} alt="Logo" sx={{ width: 36, height: 36 }} />
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#1E3A8A",
            }}
          >
            CurriculumVit.AI
          </Typography>
        </Box>

        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {navLinks.map((item) => (
            <ListItem
              key={item.pageName}
              disablePadding
              sx={{ borderBottom: "1px solid #F3F4F6", pb: 1 }}
            >
              <Link
                to={item.path}
                onClick={handleDrawerToggle}
                style={{
                  textDecoration: "none",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#1F2937",
                    py: 1,
                  }}
                >
                  {item.pageName}
                </Typography>
              </Link>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Mobile Language Selector */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Language
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["English", "Spanish", "French", "German"].map((lang) => (
                <Box
                  key={lang}
                  onClick={() => {
                    handleLanguageSelect(lang);
                    handleDrawerToggle(); // Optional: close on select
                  }}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: "20px",
                    backgroundColor: selectedLanguage === lang ? "#EFF6FF" : "#F3F4F6",
                    color: selectedLanguage === lang ? "#2563EB" : "#4B5563",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    border: selectedLanguage === lang ? "1px solid #BFDBFE" : "1px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  {lang}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ height: "1px", bgcolor: "#E5E7EB", my: 1 }} />

          {/* Mobile Auth */}
          {user ? (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 2 }}>
                <Avatar
                  src={user.profileImage?.secure_url}
                  sx={{ width: 64, height: 64, bgcolor: "#2563EB", fontSize: "24px", fontWeight: 700, border: "2px solid #E5E7EB" }}
                >
                  {!user.profileImage?.secure_url && user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {user?.name || "User"}
                </Typography>
              </Box>
              <Link to="/profile" onClick={handleDrawerToggle} style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: "#111827",
                    borderColor: "#111827",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    textTransform: "none",
                    py: "12px",
                    mb: 1.5,
                  }}
                >
                  My Profile
                </Button>
              </Link>
              <Link to="/my-cvs" onClick={handleDrawerToggle} style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#111827",
                    color: "white",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    textTransform: "none",
                    py: "12px",
                    mb: 1,
                    "&:hover": { backgroundColor: "#374151" },
                  }}
                >
                  My CVs Dashboard
                </Button>
              </Link>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  logout();
                  handleDrawerToggle();
                }}
                sx={{
                  color: "#2563EB",
                  borderColor: "#2563EB",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "none",
                  py: "12px",
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={handleDrawerToggle} style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#2563EB",
                    cursor: "pointer",
                    textAlign: "center",
                    py: 1,
                  }}
                >
                  Log In
                </Typography>
              </Link>

              <Link to="/signup" onClick={handleDrawerToggle} style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#2563EB",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    textTransform: "none",
                    py: "12px",
                    boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.1), 0 2px 4px -1px rgba(37, 99, 235, 0.06)",
                    "&:hover": { backgroundColor: "#1D4ED8" },
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
