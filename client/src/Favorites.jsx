import React from "react";
import Header from "./Header";
import "./Favorites.css";
import PlayList from "./PlayList";
import CreateList from "./CreateList";
function Favorites(){
  return (<div>
    <Header />
    <h1 className="maintext">Your playlists</h1>
    <CreateList />
    <PlayList />
  </div>)
}

export default Favorites;
