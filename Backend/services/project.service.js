import mongoose from "mongoose";
import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";

export const createProject = async (name, userID) => {
  if (!name) {
    throw new Error("Project name is required");
  }
  if (!userID) {
    throw new Error("User ID is required");
  }

  let project;
  try {
    project = await projectModel.create({
      name,
      users: [userID],
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name already exists.");
    }
    throw error;
  }

  return project;
};

export const getAllProjectsByUserID = async ({ userID }) => {
  if (!userID) {
    throw new Error("User ID is required");
  }

  const allUserProjects = await projectModel.find({ users: userID });
  return allUserProjects;
};

export const addUserToProject = async ({ projectID, users, userID }) => {
  if (!projectID) {
    throw new Error("Project ID is required");
  }
  if (!mongoose.Types || !mongoose.Types.ObjectId) {
    throw new Error("Invalid Project ID");
  }
  if (!users) {
    throw new Error("Users are required");
  }
  if (!userID) {
    throw new Error("User ID is required");
  }
  if (!Array.isArray(users)) {
    throw new Error("Invalid UsersIDs in the array");
  }

  const project = await projectModel.findOne({ _id: projectID, users: userID });

  if (!project) {
    throw new Error("User is not belong to this project.");
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    {
      _id: projectID,
    },
    {
      $addToSet: { users: { $each: users } },
    },
    { new: true }
  );

  return updatedProject;
};

export const getProjectById = async ({ projectID }) => {
  if (!projectID) {
    throw new Error("Project ID is required.");
  }
  if (!mongoose.Types || !mongoose.Types.ObjectId) {
    throw new Error("Invalid Project ID");
  }

  const project = await projectModel
    .findOne({ _id: projectID })
    .populate("users");
  return project;
};
