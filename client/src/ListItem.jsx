import React, { useEffect, useState } from "react";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function ListItem({ artist }) {
  const [open, setOpen] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState({});
  const [openAlbums, setOpenAlbums] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const albumsResp = await fetch(`http://localhost:3000/albums?artistId=${artist.id}`);
        const albumsData = await albumsResp.json();
        setAlbums(albumsData);

        const songsData = {};
        await Promise.all(albumsData.map(async (album) => {
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

  function expand() {
    setOpen(!open);
  }

  function toggleAlbum(albumId) {
    setOpenAlbums(prev => ({
      ...prev,
      [albumId]: !prev[albumId]
    }));
  }

  return (
    <div className="listItem" style={{ borderRadius: open ? "2cap" : null }}>
      <h1>
        <LibraryMusicIcon style={{ paddingRight: 20 }} />{artist.name}
        <span className="spacer"></span>
        <Fab size="small" color="secondary" aria-label="add" onClick={expand}>
          <AddIcon />
        </Fab>
      </h1>
      {open && (
        <div className={`albums ${open ? 'open' : ''}`}>
          {albums.map(album => (
            <div key={album.id} className="album-item">
               <p style={{ borderRadius: openAlbums[album.id] ? "20px 20px 0px 0px" : "20px" }}>{album.title}
                <span className="spacer"> </span>
                <Fab size="small" color="secondary" aria-label="add" onClick={() => toggleAlbum(album.id)}>
                  <AddIcon />
                </Fab>
              </p>
              {openAlbums[album.id] && (
                <ul className="listed-songs">
                    {songs[album.id]?.map(song => (
                    <li key={song.id} className="song-item">
                        <span className="song-title">{song.title}</span>
                        <span className="song-length">{song.length.hours}:{song.length.minutes}</span>
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
