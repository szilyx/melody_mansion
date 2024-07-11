import React from "react";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

function ListItem(props){
    return(
        <div className="listItem">
            <h1> <LibraryMusicIcon />{props.name}  <span className="spacer"></span> <PlayCircleIcon /></h1>
        </div>
    )
}

export default ListItem;