import React, { useEffect, useState } from "react";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function ListItem({ artist }) {
  const [open, setOpen] = useState(false);
  const [albums, setAlbums] = useState([]);

  useEffect(()=>{
    async function fetchAlbums(){
      try{
        const resp = await fetch(`http://localhost:3000/albums?artistId=${artist.id}`);
        if(!resp.ok){
          throw new Error('Network responese was not ok');
        }
        const data = await resp.json();
        console.log(data);
        setAlbums(data);
      }catch(error){
        console.error("Error fetching data:", error);
      }
    }
    fetchAlbums();
  },[]);

  function expand() {
    setOpen(!open);
  }

  return (
    <div className="listItem" style={{borderRadius: open ? "2cap" : null}}>
      <h1> <LibraryMusicIcon style={{paddingRight:20}}/>{artist.name}  
        <span className="spacer"></span> 
        <Fab size="small" color="secondary" aria-label="add" onClick={expand}>
          <AddIcon />
        </Fab>
      </h1>
      {open && (
        <div className={`albums ${open ? 'open' : ''}`}>
        {albums.map(album => (
          <p key={album.id}>{album.title}</p>
        ))}
      </div>
      )}
    </div>
  );
}

export default ListItem;
