// Charger les variables d'environnement en PREMIER (avant tout autre import)
// dotenv lit le fichier .env et rend les variables accessibles via process.env
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import pokemons from './schemas/pokemons.js';
import pokemonsRouter from './routes/pokemons.js';
import authRouter from './routes/auth.js';

import connect from './connect.js'


const app = express();

app.use(cors()); // Permet les requêtes cross-origin (ex: frontend sur un autre port)
app.use(express.json());

app.use('/assets', express.static('assets')); // Permet d'accéder aux fichiers dans le dossier "assets" via l'URL /assets/...



app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/pokemons', pokemonsRouter);
app.use('/api/auth', authRouter);


const start = async () => {
    try {
        await connect();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server due to DB connection error.');
        process.exit(1);
    }
};

start();