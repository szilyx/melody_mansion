import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import "./ListItem.css";
import "./App.css";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#a13800',
    },
  },
});

function App() {
  const [artists, setArtists] = useState([]);

  useEffect(()=>{
    async function fetchArtists(){
      try{
        const resp = await fetch("http://localhost:3000/artists");
        if(!resp.ok){
          throw new Error('Network responese was not ok');
        }
        const data = await resp.json();
        setArtists(data);
      }catch(error){
        console.error("Error fetchin data:", error);
      }
    }
    fetchArtists();
  },[]);

    return (
      <ThemeProvider theme={theme}>
    <div className="container">
      <h1 id="main-title">Artists</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}><ListItem artist={artist}/></li>
        ))}
      </ul>
    </div>
    </ThemeProvider>
  );
}

export default App;
