import express from "express";
import userSessionsRouter from "./api/v1/userSessionsRouter.js";
import usersRouter from "./api/v1/usersRouter.js";
import clientRouter from "./clientRouter.js";
import promptsRouter from "./api/v1/promptsRouter.js";
import riffsRouter from "./api/v1/riffsRouter.js";

const rootRouter = new express.Router();

rootRouter.use("/", clientRouter);
rootRouter.use("/api/v1/user-sessions", userSessionsRouter);
rootRouter.use("/api/v1/users", usersRouter);
rootRouter.use("/api/v1/prompts", promptsRouter)
rootRouter.use("/api/v1/riffs", riffsRouter)

//place your server-side routes here

export default rootRouter;
