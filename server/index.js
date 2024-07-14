import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
const app = express();
const port = 3000;

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"MusicDB",
    password:"szili",
    port:5432,
})

db.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/artists",async (req, res) =>{
    try{
        const result = await db.query("SELECT * from artists");
        res.json(result.rows);
        //console.log(result);
    }catch (err){
        console.error(err);
        res.status(500).json({error: "Error while reading data"});
    }
});

app.get("/albums", async (req, res) =>{
    const {artistId} = req.query;
    if(!artistId){
        return res.status(400).json({error: "Missing parameter"});
    }
    try{
        const result = await db.query("SELECT * FROM albums WHERE artist_id=$1",[artistId]);
        res.json(result.rows);
        //console.log(result);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Error while reading data"});
    }
});

app.get("/songs", async (req, res) =>{
    const {albumId} = req.query;
    if(!albumId){
        return res.status(400).json({error: "Missing parameter"});
    }
    try{
        const result = await db.query("SELECT * FROM songs WHERE album_id = $1",[albumId]);
        res.json(result.rows);
        //console.log(result);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Error while reading data"});
    }
});

app.get("/songsById", async (req, res) =>{
    const {songId} = req.query;
    if(!songId){
        return res.status(400).json({error: "Missing parameter"});
    }try{
        const result = await db.query("SELECT * FROM songs WHERE id=$1", [songId]);
        res.json(result.rows);
    }catch(err){
        console.error(err);
        resizeTo.status(500).json({error: "Error while reading data"});
    }
})

app.get("/favorites",async (req, res) =>{
    try{
        const result = await db.query("SELECT * FROM favorites");
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Error while reading data"});
    }
})

app.get("/favoriteSongs", async (req, res) =>{
    try{
        const result = await db.query("SELECT * FROM favoritesongs");
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Error while reading data"});
    }
})

app.get("/favoriteSongsByPlaylist", async (req, res) => {
    const { playlistId } = req.query;
    if (!playlistId) {
        return res.status(400).json({ error: "Missing playlistId parameter" });
    }
    try {
        const result = await db.query("SELECT * FROM favoritesongs WHERE favorites_id = $1", [playlistId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error while reading data" });
    }
});

app.post("/favoritesPost", async (req, res) =>{
    const {name} = req.body;
    if(!name){
        return res.status(400).json({error: "Missing parameter"});
    }
    try{
        const result = await db.query("INSERT INTO favorites (name) VALUES ($1) RETURNING *",[name]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Error while inserting data"});
    }
})

app.post("/addToPlaylist", async (req, res) => {
    const { playListId, songId } = req.body;
    if (!playListId || !songId) {
        return res.status(400).json({ error: "Missing parameters" });
    }
    try {
        const result = await db.query("INSERT INTO favoritesongs (song_id, favorites_id) VALUES ($1, $2) RETURNING *", [songId, playListId]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error while inserting data" });
    }
});

app.post("/deleteSong", async (req, res) => {
    const { playlistId, songId } = req.body;

    if (!songId || !playlistId) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        await db.query("DELETE FROM favoritesongs WHERE favorites_id=$1 AND song_id=$2", [playlistId, songId]);
        console.log(`Deleted song ${songId} from playlist ${playlistId}`);
        return res.status(200).json({ message: "Song deleted successfully" });
    } catch (err) {
        console.error('Error while deleting data:', err);
        return res.status(500).json({ error: "Error while deleting data" });
    }
});

app.get("/search", async (req, res) => {
    const { q } = req.query;
  
    try {
      // Példának szánt adatbázis lekérdezés a keresett kifejezés alapján
      const results = await db.query("SELECT * FROM artists WHERE name ILIKE $1", [`%${q}%`]);
      res.status(200).json({ results });
    } catch (err) {
      console.error("Error searching:", err);
      res.status(500).json({ error: "Failed to search" });
    }
  });

  app.get("/searchPlaylists", async (req, res) => {
    const { q } = req.query;
  
    try {
      // Példának szánt adatbázis lekérdezés a keresett kifejezés alapján
      const results = await db.query("SELECT * FROM favorites WHERE name ILIKE $1", [`%${q}%`]);
      res.status(200).json({ results });
    } catch (err) {
      console.error("Error searching:", err);
      res.status(500).json({ error: "Failed to search" });
    }
  });

app.post("/editPlaylistName", async (req, res) => {
    const { playlistId, newName } = req.body;

    try {
        await db.query("UPDATE favorites SET name = $1 WHERE id = $2", [newName, playlistId]);
        res.status(200).json({ message: `Playlist ${playlistId} name updated successfully` });
    } catch (err) {
        console.error("Error updating playlist name:", err);
        res.status(500).json({ error: "Failed to update playlist name" });
    }
});


app.post("/deletePlaylist", async (req, res) => {
    const { playlistId} = req.body;

    if (!playlistId) {
        return res.status(400).json({ error: "Missing parameter" });
    }

    try {
        await db.query("DELETE FROM favoritesongs WHERE favorites_id=$1", [playlistId]);
        await db.query("DELETE FROM favorites WHERE id=$1", [playlistId]);
        return res.status(200).json({ message: "Song deleted successfully" });
    } catch (err) {
        console.error('Error while deleting data:', err);
        return res.status(500).json({ error: "Error while deleting data" });
    }
});





app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})

