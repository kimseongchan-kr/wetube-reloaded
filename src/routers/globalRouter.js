import express from "express";
import { home, search } from "../controllers/videoController";
import { join, login, logout } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/logout", logout);
globalRouter.get("/search", search);

export default globalRouter;
