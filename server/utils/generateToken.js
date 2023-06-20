import jwt from "jsonwebtoken";

const generateToken = (res, user) => {
  const {id, role, name} = user

  const token = jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
    expiresIn: 10 * 60 * 1000, // 10min
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
  });
};

export default generateToken;
