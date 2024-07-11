import React, { useEffect, useState } from "react";

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
    <div className="container">
      <h1>Előadók</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
