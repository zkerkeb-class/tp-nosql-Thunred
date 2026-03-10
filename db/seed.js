import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import connect from '../connect.js';
import Pokemon from '../schemas/pokemons.js';

const seed = async () => {
  try {
    await connect();
    console.log('Connecté à MongoDB !');

    const filePath = new URL('../data/pokemons.json', import.meta.url);
    const file = fs.readFileSync(filePath, 'utf8');
    const pokemons = JSON.parse(file);

    await Pokemon.deleteMany({});
    console.log('Collection vidée.');

    await Pokemon.insertMany(pokemons);
    console.log(`${pokemons.length} Pokémon insérés avec succès !`);

    await mongoose.connection.close();
    console.log('Connexion fermée.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed :', error);
    process.exit(1);
  }
};

seed();
