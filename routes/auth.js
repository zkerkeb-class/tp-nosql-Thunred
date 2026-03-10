import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Nom d\'utilisateur déjà utilisé' });
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Identifiants invalides' });

    const secret = process.env.JWT_SECRET || 'change_this_secret';
    const token = jwt.sign({ id: user._id, username: user.username }, secret, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
