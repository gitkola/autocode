import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import { getProjects, createProject } from "../../utils/projectChatUtil";
import { RootState } from "../../store";
import { setActiveProject } from "../../store/projectsSlice";

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: projects, activeProjectId } = useSelector(
    (state: RootState) => state.projects,
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
      const projectName = `New Project ${projects.length + 1}`;
      const newProject = await createProject(projectName);
      dispatch(setActiveProject(newProject.id));
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error("Failed to create new project:", error);
      // Handle error (e.g., show error message to user)
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
