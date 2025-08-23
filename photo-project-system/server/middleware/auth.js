import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, type, name, permissions? }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function permit(...types) {
  return (req, res, next) => {
    const userType = req.user.type;
    if (!req.user || !types.includes(userType)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

export function permitUser(req, res, next) {
  if (!req.user || req.user.type !== 'user') {
    return res.status(403).json({ message: 'User access required' });
  }
  next();
}

export function permitPhotographer(req, res, next) {
  if (!req.user || req.user.type !== 'photographer') {
    return res.status(403).json({ message: 'Photographer access required' });
  }
  next();
}

export function permitAdmin(req, res, next) {
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

export function hasPermission(permission) {
  return (req, res, next) => {
    if (!req.user || req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
}

