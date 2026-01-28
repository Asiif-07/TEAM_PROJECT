import { AppBar, Toolbar, Box, Button, Typography, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [mobileOpen, setMobileOpen] = useState(false);

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


  // ["How It Work", "About", "Contact Us", "Pricing", "Blog"]
  let navLinks = [
    {
      pageName:"How It Work",
      path:"/how-it-works"
    },
    {
      pageName:"Services",
      path:"/services"
    },
    {
      pageName:"About",
      path:"/about"
    },
    {
      pageName:"Contact Us",
      path:"/contact-us"
    },
    {
      pageName:"Blog",
      path:"/blog"
    }
  ]

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
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", ml: "auto" }}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="open navigation"
            onClick={handleDrawerToggle}
          >
            <MenuIcon sx={{ color: "#1F2937" }} />
          </IconButton>
        </Box>

        {/* Auth (desktop) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: "12px", flexShrink: 0 }}>
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

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{ width: 260, p: 2 }}
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#1E3A8A",
              }}
            >
              CurriculumVit.AI
            </Typography>
          </Box>
          <List>
            {navLinks.map((item) => (
              <ListItem key={item.pageName} disablePadding>
                <ListItemText>
                  <Link to={item.path} style={{ textDecoration: "none", color: "#1F2937" }}>
                    {item.pageName}
                  </Link>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
