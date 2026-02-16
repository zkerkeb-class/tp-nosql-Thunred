// Charger les variables d'environnement en PREMIER (avant tout autre import)
// dotenv lit le fichier .env et rend les variables accessibles via process.env
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import pokemons from './schemas/pokemons.js';

import './connect.js'


const app = express();

app.use(cors()); // Permet les requêtes cross-origin (ex: frontend sur un autre port)
app.use(express.json());

app.use('/assets', express.static('assets')); // Permet d'accéder aux fichiers dans le dossier "assets" via l'URL /assets/...



app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/api/pokemons', async (req, res) => {
    // Ici, vous pouvez récupérer les pokémons depuis la base de données
    const pokemonsList = await pokemons.find(); // Récupère tous les pokémons de la collection
    res.json(pokemonsList);
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});