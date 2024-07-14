import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "./Header";
import MainPage from "./MainPage";
import ListItem from "./ListItem";
import { ErrorBoundary } from 'react-error-boundary'
import "./ListItem.css";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#a13800",
    },
  },
});

function MyFallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const resp = await fetch("http://localhost:3000/artists");
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
    <ErrorBoundary
    FallbackComponent={MyFallbackComponent}
    onReset={() => {
      // reset the state of your app here
    }}
    resetKeys={['someKey']}
  >
    <ThemeProvider theme={theme}>
      <Header />
      <MainPage />
      <div className="container">
        <h1 id="main-title">Artists</h1>
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              <ListItem artist={artist} />
            </li>
          ))}
        </ul>
      </div>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
