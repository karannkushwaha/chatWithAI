import projectModel from "../models/project.model.js";

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
