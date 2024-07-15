import React, { useState, useEffect } from "react";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Favorites', path: '/favorites' }
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function SearchAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleSearchInputChange = async (event) => {
    const query = event.target.value;
    setSearchText(query);

    console.log("Keresés:", query);

    try {
      const response = await fetch(`http://localhost:3000/search?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Keresési eredmények:", data);

        if (data.results && Array.isArray(data.results.rows)) {
          const results = data.results.rows.map((row) => ({
            id: row.id,
            name: row.name,
            url: row.url // Hozzáadhatunk egy URL-t az elemhez, ahol az található az oldalon
          }));
          setSearchResults(results);
        } else {
          console.error('Nem várt keresési eredmény struktúra:', data);
        }
      } else {
        console.error('Keresési eredmények lekérése sikertelen');
      }
    } catch (error) {
      console.error('Hiba történt a keresési eredmények lekérésében:', error);
    }
  };

  const handleSearchResultClick = (result) => {
    console.log("Kiválasztott eredmény:", result);
    navigate(result.url);
    handleResultClick(result.id); // Hozzáadva: görgetés az adott elemhez
    setSearchText("");
    setSearchResults([]);
  };

  const handleResultClick = (id) => {
    // Gördesd le az oldalt az adott elemhez
    const element = document.getElementById(`artist_${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    setSearchText("");
    setSearchResults([]);
  }, [location.pathname]); // Reset search state when pathname changes

  return (
    <AppBar position="static" sx={{ backgroundColor: '#6F4E37' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            src="../images/logo_without_bg.png"
            alt="logo"
            style={{ display: { xs: 'none', md: 'flex' }, marginRight: '10px', height: '40px' }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {page.name}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {page.name}
                </Link>
              </Button>
            ))}
          </Box>

          {location.pathname !== "/favorites" && ( // Render search input only if not on /favorites
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchText}
                onChange={handleSearchInputChange}
              />
              {searchResults.length > 0 && (
                <Box sx={{ position: 'absolute', backgroundColor: 'grey', boxShadow: 1, zIndex: 1, width: '100%' }}>
                  {searchResults.map((result) => (
                    <Box
                      key={result.id}
                      sx={{ padding: 1, cursor: 'pointer' }}
                      onClick={() => handleSearchResultClick(result)}
                    >
                      {result.name}
                    </Box>
                  ))}
                </Box>
              )}
            </Search>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default SearchAppBar;
