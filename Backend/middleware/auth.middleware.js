import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Please authenticate." });
    }

    const isBlackList = await redisClient.get(token);
    if (isBlackList) {
      res.cookie("token", "", { httpOnly: true });
      return res.status(401).json({ message: "Please authenticate." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "unauthenticate." });
  }
};
