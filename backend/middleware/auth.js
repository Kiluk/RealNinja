const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Brak tokena, dostęp zabroniony!" });

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Nieprawidłowy token!" });
  }
};

module.exports = authenticateToken;
