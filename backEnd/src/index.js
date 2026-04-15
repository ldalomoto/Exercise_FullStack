import core from 'cors';
import express from 'express';
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(core());
app.use(express.json());


const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
})

app.get('/', async (req, res) => {
    try {
        const response = await fetch('https://rickandmortyapi.com/api/character');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

app.post("/favorites", async (req, res) => {
    const favorite = req.body;
    console.log(favorite)
    await redis.lpush("favorites", JSON.stringify(favorite));
    res.json({ message: "Favorite added successfully " + favorite});
});

app.delete("/delete-favorite/:id", async (req, res) => {
    const id = Number(req.params.id);
    const favorites = await redis.lrange("favorites", 0, -1);
    const parsedFavorites = favorites.map(fav => JSON.parse(fav));
    const updatedFavorites = parsedFavorites.filter(fav => fav.id !== id);
    await redis.del("favorites");
    for (const fav of updatedFavorites) {
        await redis.rpush("favorites", JSON.stringify(fav));
    }
    res.json({ message: "Favorite deleted successfully" });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
