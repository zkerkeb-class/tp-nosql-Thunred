import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token manquant' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Format d\'Authorization invalide' });

  const token = parts[1];
  try {
    const secret = process.env.JWT_SECRET || 'change_this_secret';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

export default auth;
