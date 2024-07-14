import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import FloatingActionButtonSize from './FloatingActionButtonSize';

import "./ClickAway.css";

function ClickAway({ artistId, songId }) {
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function fetchPlayList() {
      try {
        const result = await fetch("http://localhost:3000/favorites");
        const data = await result.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchPlayList();
  }, []);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      alert("Song added to your playlist");
      const response = await fetch(`http://localhost:3000/addToPlaylist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playListId: playlistId, songId })
      });
      if (response.ok) {
        console.log('Song added to playlist successfully');
      } else {
        console.error('Failed to add song to playlist');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const styles = {
    position: 'absolute',
    top: '40px',
    right: 0,
    zIndex: 2000,
    border: '1px solid',
    padding: '10px',
    backgroundColor: 'rgb(141, 141, 115)',
    width: '200px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  };

  const listStyles = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  };

  const listItemStyles = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <FloatingActionButtonSize onClick={handleClick}>
          Open menu dropdown
        </FloatingActionButtonSize>
        {open ? (
          <Box sx={styles}>
            <ul className="playlist_li" style={listStyles}>
              {favorites.map((playlist) => (
                <li key={playlist.id} style={listItemStyles} onClick={() => handleAddToPlaylist(playlist.id)}>
                  {playlist.name}
                </li>
              ))}
            </ul>
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
}

export default ClickAway;
