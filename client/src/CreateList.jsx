import React, {useState, useEffect} from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import "./CreateList.css"
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';

function CreateList(){
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    function handleChange(event){
        console.log(event.target.value);
        setName(event.target.value);
    }
    function expand() {
        setOpen(!open);
      }

    async function handleClick(event){
        event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/favoritesPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        console.log('Favorite added successfully');
        setName(""); 
      } else {
        console.error('Failed to add favorite');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    }
    return(
        <div className="listItem" style={{ borderRadius: open ? "2cap" : null }}>
      <h1>
       Create Playlist
        <span className="spacer"></span>
        <Fab size="small" color="primary" aria-label="add" onClick={expand}>
          <AddIcon />
        </Fab>
      </h1>
      {open && (
        <div className={`albums ${open ? 'open' : ''}`}>
            <div  className="album-item">
                <form action="submit" onSubmit={handleClick}>
                    <input type="text" className="inputPlaylist"
                    onChange={handleChange}
                    value={name}/>
                        <Fab
                            type="submit"
                            variant="extended"
                            className="navigationIcon"
                            sx={{ marginBottom: 2 }}
                            >
                            <NavigationIcon sx={{ mr: 1 }} />
                            Create
                        </Fab>
                </form>
            </div>
        </div>
      )}
    </div>
    )
}

export default CreateList;