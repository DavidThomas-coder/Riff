import express from "express";
import passport from "passport";
import { User } from "../../../models/index.js";
import UserSerializer from "../../../serializers/UserSerializer.js";

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

usersRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.query().findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const serializedUser = UserSerializer.showUserDetails(user);

    return res.status(200).json({ user: serializedUser });
  } catch (error) {
    return res.status(500).json({ errors: error });
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
