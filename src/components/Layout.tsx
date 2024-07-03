import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import { getProjects, createProject } from "../utils/projectChatUtil";
import { RootState } from "../store";
import { setActiveProject } from "../store/projectsSlice";

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: projects, activeProjectId } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await getProjects();
      } catch (error) {
        console.error("Failed to load projects:", error);
        // Handle error (e.g., show error message to user)
      }
    };
    loadProjects();
  }, []);

  const handleNewProject = async () => {
    try {
      const project = await createProject(); // No need to pass a name here
      if (project) {
        dispatch(setActiveProject(project.id));
        navigate(`/project/${project.id}`);
        console.log("Opened project:", project.name);
      }
    } catch (error) {
      console.error("Failed to create/open project:", error);
    }
  };

  const handleSelectProject = (projectId: string) => {
    dispatch(setActiveProject(projectId));
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onNewProject={handleNewProject}
        onSelectProject={handleSelectProject}
      />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;