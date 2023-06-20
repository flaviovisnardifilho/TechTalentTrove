import prisma from "../prisma/index.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) return res.status(400).json({ sucess: false, msg: "User not found" });

  try {
    const matchPasswords = await bcrypt.compare(password, user.hash);

    if (matchPasswords) {
      generateToken(res, user);
      return res.status(200).json({
        sucess: true,
        msg: `user ${user.name} logged`,
      });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
};

const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ msg: "User logout" });
};

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  const userExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (userExists) {
    return res.status(500).json({
      sucess: false,
      msg: "Email already been used",
    });
  } else {
    try {
      const hash = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          hash,
        },
      });

      generateToken(res, newUser);
      return res
        .status(201)
        .json({ sucess: true, msg: `User ${name} created!` });
    } catch (err) {
      return res.sendStatus(500);
    }
  }
};

const getUserProfile = async (req, res) => {
  const user = req.user;
  return res.status(200).json({ msg: user });
};

const updateUserProfile = async (req, res) => {
  return res.status(200).json({ msg: "Update profile" });
};

export {
  loginUser,
  logoutUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
};
