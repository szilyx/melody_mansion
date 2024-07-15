import React, { useEffect, useState } from "react";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import "./PlayList.css";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

function PlayList() {
    const [favorites, setFavorites] = useState([]);
    const [songs, setSongs] = useState({});
    const [openPlaylists, setOpenPlaylists] = useState({});
    const [editPlaylistId, setEditPlaylistId] = useState(null);
    const [editPlaylistName, setEditPlaylistName] = useState("");

    // useEffect, hogy azonnal lekérje és frissítse a kedvenc playlisteket és zeneszámokat
    useEffect(() => {
        async function fetchData() {
            try {
                // Lekérjük a kedvenc playlisteket
                const favoritesResp = await fetch("http://localhost:3000/favorites");
                if (!favoritesResp.ok) {
                    throw new Error(`Error fetching favorites: ${favoritesResp.statusText}`);
                }
                const favoritesData = await favoritesResp.json();
                //console.log("Favorites:", favoritesData);
                setFavorites(favoritesData);

                // Lekérjük a kedvenc playlistekhez tartozó zeneszámok ID-jait és a zeneszámokat
                const songsData = {};
                for (const playlist of favoritesData) {
                    const favoritesongsResp = await fetch(`http://localhost:3000/favoriteSongsByPlaylist?playlistId=${playlist.id}`);
                    if (!favoritesongsResp.ok) {
                        throw new Error(`Error fetching songs for playlist ${playlist.id}: ${favoritesongsResp.statusText}`);
                    }
                    const favoritesongs = await favoritesongsResp.json();
                    //console.log(`Favoritesongs for playlist ${playlist.id}:`, favoritesongs);

                    // Lekérjük a zeneszámok részleteit
                    const songDetails = await Promise.all(favoritesongs.map(async (favoritesong) => {
                        const songResp = await fetch(`http://localhost:3000/songsById?songId=${favoritesong.song_id}`);
                        if (!songResp.ok) {
                            throw new Error(`Error fetching song details for song ${favoritesong.song_id}: ${songResp.statusText}`);
                        }
                        const songDetail = await songResp.json();
                        return songDetail[0];
                    }));
                    songsData[playlist.id] = songDetails;
                }
                setSongs(songsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [favorites]); 

    function togglePlaylist(playlistId) {
        setOpenPlaylists(prev => ({
            ...prev,
            [playlistId]: !prev[playlistId]
        }));
    }
    const deleteSong = async (playlistId, songId) => {
        try {
            const response = await fetch(`http://localhost:3000/deleteSong`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId, songId })
            });
            if (response.ok) {
                console.log(`Song ${songId} deleted from playlist successfully from ${playlistId}`);
                alert("Song was deleted succesfully!");
            } else {
                console.error('Failed to delete song from playlist');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deletePlaylist = async (playlistId) => {
        try {
            const response = await fetch(`http://localhost:3000/deletePlaylist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId})
            });
            if (response.ok) {
                alert("Playlist was deleted succesfully!");
            } else {
                console.error('Failed to delete playlist');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    
    function formatSongLength(length) {
        if (typeof length === 'object' && length !== null) {
            const { hours, minutes } = length;
            return `${hours ? hours + 'h ' : ''}${minutes}m`;
        }
        return length;
    }

    const handleEditPlaylist = (playlistId, currentName) => {
        setEditPlaylistId(playlistId);
        setEditPlaylistName(currentName);
    };

    // Playlist név mentése szerkesztés után
    const saveEditedPlaylistName = async (playlistId, newName) => {
        try {
            const response = await fetch(`http://localhost:3000/editPlaylistName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId, newName })
            });
            if (response.ok) {
                console.log(`Playlist ${playlistId} name updated successfully`);
                // Frissítsük a kedvenc playlisteket
                const updatedFavorites = favorites.map(playlist => {
                    if (playlist.id === playlistId) {
                        return { ...playlist, name: newName };
                    }
                    return playlist;
                });
                setFavorites(updatedFavorites);
                setEditPlaylistId(null); // Szerkesztés befejezése
            } else {
                console.error('Failed to update playlist name');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Playlist név visszaállítása eredeti állapotra
    const cancelEditPlaylistName = () => {
        setEditPlaylistId(null);
        setEditPlaylistName("");
    };


    return (
        <div>
            <ul>
                {favorites.map(playlist => (
                    <li key={playlist.id} className="playListsLi">
                        {editPlaylistId === playlist.id ? (
                            <div>
                            <input
                                className="editplaylist"
                                type="text"
                                value={editPlaylistName}
                                onChange={(e) => setEditPlaylistName(e.target.value)}
                            />
                            <IconButton aria-label="save" onClick={() => saveEditedPlaylistName(playlist.id, editPlaylistName)}>
                                <AddIcon />
                            </IconButton>
                            <IconButton aria-label="cancel" onClick={cancelEditPlaylistName}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                        ) : (
                            <div>
                                {playlist.name}
                                <Fab
                                    size="small"
                                    color="primary"
                                    aria-label="expand"
                                    onClick={() => togglePlaylist(playlist.id)}
                                    className="add-icon"
                                >
                            <ArrowDropDownCircleIcon />
                            
                        </Fab>
                        <IconButton aria-label="delete" onClick={() => deletePlaylist(playlist.id)}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton aria-label="edit" onClick={() => handleEditPlaylist(playlist.id, playlist.name)}>
                             <EditIcon />
                        </IconButton>
                        {openPlaylists[playlist.id] && (
                            <ul className="playlist-songs">
                                {songs[playlist.id]?.map(song => (
                                    <li key={song.id} className="song-item">
                                        <span className="song-title">{song.title}</span>
                                        <span className="song-length">{formatSongLength(song.length)}</span>
                                        <IconButton aria-label="delete" onClick={() => deleteSong(playlist.id, song.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </li>
                                ))}
                            </ul>
                        )}
                         </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlayList;
