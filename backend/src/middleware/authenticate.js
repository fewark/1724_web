import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // { id, username, email }
    req.userData = {
        email: decoded.email,
        userID: decoded.userID,
        userName: decoded.userName,
        createdAt: decoded.createdAt,
        // user_type: decoded.user_type,
    };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token is invalid or expired" });
  }
};

export default authenticate;
