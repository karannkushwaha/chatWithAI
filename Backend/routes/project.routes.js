import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controller/project.controller.js";
import * as auth from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  auth.authUser,
  body("name").isString().withMessage("Name is required."),
  projectController.createProject
);

router.get("/all", auth.authUser, projectController.getAllProjects);

router.put(
  "/addUser",
  auth.authUser,
  body("projectID").isString().withMessage("Project ID must be a string."),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array of strings.")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Each User must be strings."),
  projectController.addUserToProject
);

export default router;
