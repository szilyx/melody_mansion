import React, { useEffect, useState } from "react";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ClickAway from "./ClickAway";
import { Link, useNavigate } from 'react-router-dom';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
// This jsx component is for listing the artist and their albums and songs.
function ListItem({ artist }) {
  const [open, setOpen] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState({});
  const [openAlbums, setOpenAlbums] = useState({});
  const navigate = useNavigate();

  //using useEffect to refresh the page on change
  useEffect(() => {
    async function fetchData() {
      try {
        //fetching the albums of the given artist
        const albumsResp = await fetch(`http://localhost:3000/albums?artistId=${artist.id}`);
        const albumsData = await albumsResp.json();
        setAlbums(albumsData);

        const songsData = {};
        await Promise.all(albumsData.map(async (album) => {
          //fetching the songs of the given album
          const resp = await fetch(`http://localhost:3000/songs?albumId=${album.id}`);
          const data = await resp.json();
          songsData[album.id] = data;
        }));
        setSongs(songsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [artist.id]);

  const scrollToArtist = (artistId) => {
    //this will make the page scroll down to the search artist
    const element = document.getElementById(`artist_${artistId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResultClick = (id) => {
    scrollToArtist(id);
  };

  const handleSearchResultClick = (result) => {
    console.log("Kiválasztott eredmény:", result);
    navigate(result.url);
    handleResultClick(result.id);
  };

  function expand() {
    setOpen(!open);
  }

  function toggleAlbum(albumId) {
    //check which of the albums are opened
    setOpenAlbums(prev => ({
      ...prev,
      [albumId]: !prev[albumId]
    }));
  }

  return (
    <div className="listItem" style={{ borderRadius: open ? "2cap" : null }}>
      <h1 id={`artist_${artist.id}`}>
          <LibraryMusicIcon style={{ paddingRight: 20 }} />{artist.name}
          <span className="spacer"></span>
          <Fab size="small" color="secondary" aria-label="add" onClick={expand}>
            <ArrowDropDownCircleIcon />
          </Fab>
      </h1>
      {open && (
        <div className={`albums ${open ? 'open' : ''}`}>
          {/* Listing all of the albums*/}
          {albums.map(album => (
            <div key={album.id} className="album-item">
              <p style={{ borderRadius: openAlbums[album.id] ? "20px 20px 0px 0px" : "20px" }}>{album.title}
                <span className="spacer"> </span>
                  <Fab size="small" color="secondary" aria-label="add" onClick={() => toggleAlbum(album.id)}>
                  <ArrowDropDownCircleIcon />
                  </Fab>
              </p>
              {/* If the album if opened, list its songs*/}
              {openAlbums[album.id] && (
                <ul className="listed-songs">
                  {songs[album.id]?.map(song => (
                    <li key={song.id} className="song-item">
                      <span className="song-title">{song.title}</span>
                      <span className="song-length">{song.length.hours}:{song.length.minutes}</span>
                      <ClickAway artistId={artist.id} songId={song.id} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListItem;
