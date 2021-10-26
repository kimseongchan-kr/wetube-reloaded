import express from "express";
import { protectorMiddleware, publicOnlyMiddleware } from "../middleware";
import {
  getEdit,
  postEdit,
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);
userRouter.get("/delete", remove);

export default userRouter;
