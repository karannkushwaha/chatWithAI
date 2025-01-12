import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userID = loggedInUser._id;

    const newProject = await projectService.createProject(name, userID);
    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const projects = await projectService.getAllProjectsByUserID({
      userID: loggedInUser._id,
    });
    res.status(200).json({ Projects: projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { projectID, users } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const updatedProject = await projectService.addUserToProject({
      projectID,
      users,
      userID: loggedInUser._id,
    });
    res.status(200).json({ updatedProject });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  const { projectID } = req.params;
  try {
    const project = await projectService.getProjectById({ projectID });
    return res.status(200).json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
