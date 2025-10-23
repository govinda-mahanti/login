import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ message: "Token is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded.id;
    console.log("Token received:", token);
    console.log("Decoded token:", decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
