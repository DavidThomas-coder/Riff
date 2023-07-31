import express from "express";
import passport from "passport";
import { User } from "../../../models/index.js";

const usersRouter = new express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const allUsers = await User.query();
    return res.status(200).json({ users: allUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

usersRouter.post("/", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const persistedUser = await User.query().insertAndFetch({ email, username, password });
    return req.login(persistedUser, () => {
      return res.status(201).json({ user: persistedUser });
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ errors: error });
  }
});

export default usersRouter;
