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
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})

