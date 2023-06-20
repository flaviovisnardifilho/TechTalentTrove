import jwt from "jsonwebtoken";

const authenticateToken = async (req, res, next) => {
  //   const authHeader = req.headers["authorization"];
  //   const token = authHeader && authHeader.split(" ")[1];
  const token = req.cookies.jwt;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
    });
    next();
  } else {
    return res
      .status(401)
      .json({ sucess: false, msg: "You need to be logged to do that." });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "ADMIN") {
    return next();
  }
  res.sendStatus(401);
};

export { authenticateToken, isAdmin };
