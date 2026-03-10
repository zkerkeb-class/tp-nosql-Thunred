import express from 'express';
import Pokemon from '../schemas/pokemons.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/pokemons - list all pokemons (filter, search, sort, paginate)
router.get('/', async (req, res) => {
  try {
    const { type, name, sort } = req.query;
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 50;
    if (page < 1) page = 1;
    if (limit < 1) limit = 50;

    const filter = {};
    if (type) filter.type = type;
    if (name) filter['name.english'] = { $regex: name, $options: 'i' };

    const total = await Pokemon.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    let query = Pokemon.find(filter).skip(skip).limit(limit);
    if (sort) query = query.sort(sort);

    const data = await query.exec();

    res.json({ data, page, limit, total, totalPages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pokemons/:id - get a pokemon by its id field
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const pokemon = await Pokemon.findOne({ id });
    if (!pokemon) return res.status(404).json({ error: 'Pokémon non trouvé' });
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pokemons - create a new pokemon (protected)
router.post('/', auth, async (req, res) => {
  try {
    const created = await Pokemon.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    // validation or duplicate key
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/pokemons/:id - update a pokemon by its id field (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await Pokemon.findOneAndUpdate({ id }, req.body, { returnDocument: 'after', runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Pokémon non trouvé' });
    res.json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/pokemons/:id - delete a pokemon by its id field (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await Pokemon.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ error: 'Pokémon non trouvé' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
