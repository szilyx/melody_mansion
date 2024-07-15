import React, { useEffect, useState } from "react";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import "./PlayList.css";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
//This jsx file will list all of the playlists we created
function PlayList() {
    const [favorites, setFavorites] = useState([]);
    const [songs, setSongs] = useState({});
    const [openPlaylists, setOpenPlaylists] = useState({});
    const [editPlaylistId, setEditPlaylistId] = useState(null);
    const [editPlaylistName, setEditPlaylistName] = useState("");


    // useEffect to fetch the datas whenewer we add a new album, delete or edit one.
    useEffect(() => {
        async function fetchData() {
            try {
                const favoritesResp = await fetch("http://localhost:3000/favorites");
                if (!favoritesResp.ok) {
                    throw new Error(`Error fetching favorites: ${favoritesResp.statusText}`);
                }
                const favoritesData = await favoritesResp.json();
                //console.log("Favorites:", favoritesData);
                setFavorites(favoritesData);

               //Fetch the songs of the playlist
                const songsData = {};
                for (const playlist of favoritesData) {
                    const favoritesongsResp = await fetch(`http://localhost:3000/favoriteSongsByPlaylist?playlistId=${playlist.id}`);
                    if (!favoritesongsResp.ok) {
                        throw new Error(`Error fetching songs for playlist ${playlist.id}: ${favoritesongsResp.statusText}`);
                    }
                    const favoritesongs = await favoritesongsResp.json();
                    //console.log(`Favoritesongs for playlist ${playlist.id}:`, favoritesongs);

                    //Fetch the datas of the song (name, and length);
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

    //We use this function to delete a song
    const deleteSong = async (playlistId, songId) => {
        try {
            //Calls the backend API with delete statement
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
    //This function deletes the selected playlist
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

    // Playlist mame save after editing
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
                const updatedFavorites = favorites.map(playlist => {
                    if (playlist.id === playlistId) {
                        return { ...playlist, name: newName };
                        //update the name
                    }
                    return playlist;
                });
                setFavorites(updatedFavorites);
                setEditPlaylistId(null);
            } else {
                console.error('Failed to update playlist name');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //Cancel the playlist name editing
    const cancelEditPlaylistName = () => {
        setEditPlaylistId(null);
        setEditPlaylistName("");
    };


    return (
        <div>
            <ul>
                {favorites.map(playlist => (
                    <li key={playlist.id} className="playListsLi">
                        {/* Check if we are editing that playlist, if yes, rendert this:*/}
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
                        {/* Show the song of the playlist if its opened*/}
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
