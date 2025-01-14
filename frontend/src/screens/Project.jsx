import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [projectID, setProjectID] = useState(location.state);

  const handleUserClick = (id) => {
    if (!selectedUserId.includes(id)) {
      setSelectedUserId((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedUserId((prevSelected) =>
        prevSelected.filter((userId) => userId !== id)
      );
    }
  };

  const addCollaborators = async () => {
    if (!location.state?._id) {
      console.error("Project ID is missing.");
      return;
    }

    if (selectedUserId.length === 0) {
      console.warn("No users selected to add as collaborators.");
      return;
    }

    try {
      const response = await axiosInstance.put("/project/addUser", {
        projectID: location.state._id,
        users: selectedUserId,
      });
      console.log("Collaborators added successfully:", response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding collaborators:", error);
    }
  };

  useEffect(() => {
    initializeSocket();
    axiosInstance
      .get(`/project/getProject/${location.state._id}`)
      .then((res) => {
        setProjectID(res.data.project || []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    axiosInstance
      .get("/user/all")
      .then((res) => {
        setUsersList(res.data.users || []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  if (!location.state) {
    return <div>No project data available.</div>;
  }

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-full min-w-96 bg-slate-300">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100">
          <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator </p>
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area flex-grow flex flex-col">
          <div className="message-box p-1 flex-grow flex flex-col gap-1">
            <div className="max-w-56 message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-xs">demo@demo.com</small>
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
                corrupti aliquam fugit eveniet ab, nesciunt quam ullam ducimus
                optio minima eligendi odio nobis nostrum culpa et, quo
                perferendis qui veniam?
              </p>
            </div>
            <div className="ml-auto max-w-56 message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-xs">demo@demo.com</small>
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                consequuntur at laboriosam corporis perferendis! Ipsam nesciunt
                expedita veniam quisquam, velit architecto magnam laborum nemo
                nihil similique id recusandae alias rem.
              </p>
            </div>
          </div>
          <div className="inputField w-full flex">
            <input
              className="p-2 px-4 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter message"
            />
            <button className="px-5 bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between items-center px-3 p-2 bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborator</h1>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2"
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2">
            {projectID.users &&
              projectID.users.map((user, index) => (
                <div
                  key={user._id || index}
                  className="chartUser cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center"
                >
                  <div className="aspect-square rounded-full w-fit h-fit p-5 text-white flex items-center justify-center bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
          </div>
        </div>
      </section>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {usersList.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                    selectedUserId.includes(user._id) ? "bg-slate-200" : ""
                  } p-2 flex gap-2 items-center`}
                >
                  <div className="aspect-square relative rounded-full w-12 h-12 flex items-center justify-center text-white bg-slate-600">
                    <i className="ri-user-fill"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
            </div>

            <button
              onClick={addCollaborators}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
