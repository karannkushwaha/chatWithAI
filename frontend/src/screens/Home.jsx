import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axiosInstance from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setprojectName] = useState(null);
  const [project, setProject] = useState([]);
  const navigate = useNavigate();

  const createProject = (e) => {
    e.preventDefault();
    axiosInstance
      .post("/project/create", { name: projectName })
      .then((res) => {
        setIsModalOpen(false);
        setprojectName(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axiosInstance
      .get("/project/all")
      .then((res) => {
        setProject(res.data.Projects);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project p-4 border border-slate-300 rounded-md"
        >
          New Project
          <i className="ri-link ml-2"></i>
        </button>
        {project.map(({ _id, name, users }) => (
          <div
            key={_id}
            onClick={() => {
              navigate(`/project`, { state: { _id, name, users } });
            }}
            className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200"
          >
            <h2 className="font-semibold"> {name}</h2>
            <div className="flex gap-2">
              <p>
                <small>
                  {" "}
                  <i className="ri-user-line"></i>Collaborators
                </small>{" "}
                :
              </p>
              {users.length}
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  onChange={(e) => setprojectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="mt-1 block w-full border p-2 border-slate-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
