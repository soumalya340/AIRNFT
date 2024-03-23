import * as React from "react";
import "./Navbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import List from "@mui/material/List";
import { Link, useNavigate } from "react-router-dom";

function Nav(): JSX.Element {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl" className="bg-gray-950">
        <Toolbar disableGutters>
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            AirNFT
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <List>
                <Link to="/launch">
                  <Button
                    style={{
                      color: "rgb(239, 101, 101)",
                    }}
                  >
                    Launch
                  </Button>
                </Link>
                <Link to="/collections">
                  <Button
                    variant="text"
                    style={{
                      color: "rgb(239, 101, 101)",
                    }}
                  >
                    Collection
                  </Button>
                </Link>
                <Link to="/spin">
                  <Button
                    variant="text"
                    style={{
                      color: "rgb(239, 101, 101)",
                    }}
                  >
                    Spin
                  </Button>
                </Link>
                <Link to="/community">
                  <Button
                    variant="text"
                    style={{
                      color: "rgb(239, 101, 101)",
                    }}
                  >
                    Community
                  </Button>
                </Link>
              </List>
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <List>
              <Link to="/launch">
                <Button
                  style={{
                    color: "rgb(239, 101, 101)",
                  }}
                >
                  Launch
                </Button>
              </Link>
              <Link to="/collections">
                <Button
                  variant="text"
                  style={{
                    color: "rgb(239, 101, 101)",
                  }}
                >
                  Collection
                </Button>
              </Link>
              <Link to="/spin">
                <Button
                  variant="text"
                  style={{
                    color: "rgb(239, 101, 101)",
                  }}
                >
                  Spin
                </Button>
              </Link>
              <Link to="/community">
                <Button
                  variant="text"
                  style={{
                    color: "rgb(239, 101, 101)",
                  }}
                >
                  Community
                </Button>
              </Link>
            </List>
          </Box>
          <div className="wallet connect-wallet-button-container bg-red-500 rounded-md">
            <WalletSelector />
          </div>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <List>
                <Button onClick={() => navigate("")} sx={{ color: "grey" }}>
                  Profile
                </Button>{" "}
                <br />
                <Button
                  onClick={() => navigate("/collection")}
                  sx={{ color: "grey" }}
                >
                  Collection
                </Button>
                <br />
                <Button onClick={() => navigate("")} sx={{ color: "grey" }}>
                  Account
                </Button>{" "}
                <br />
                <Button
                  onClick={() => navigate("/owned")}
                  sx={{ color: "grey" }}
                >
                  Owned
                </Button>{" "}
                <br />
                <Button
                  onClick={() => navigate("/settings")}
                  sx={{ color: "grey" }}
                >
                  Settings
                </Button>
                <br />
                <Button
                  onClick={() => navigate("")}
                  sx={{ color: "rgb(239, 101, 101)" }}
                >
                  Logout
                </Button>
              </List>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Nav;
