import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "./Header";
import MainPage from "./MainPage";
import ListItem from "./ListItem";
import "./ListItem.css";
import "./App.css";

const theme = createTheme({ // A palette ot set the primary and secoandary color for the react MUI components
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#a13800",
    },
  },
});


function App() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const resp = await fetch("http://localhost:3000/artists"); //This will load all of the artists from the database
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await resp.json();
        setArtists(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchArtists();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Header />  
      <MainPage />
      <div className="container">
        <h1 id="main-title">Artists</h1>
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>   {/* the map function will load all of the artists in a ListItem component*/}
              <ListItem artist={artist} />
            </li>
          ))}
        </ul>
      </div>
    </ThemeProvider>
  );
}

export default App;
