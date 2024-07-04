import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Project as ProjectType } from "../store/projectsSlice";
import AIChat from "./AIChat";

const Project: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const projects = useSelector((state: RootState) => state.projects.list);
  const [project, setProject] = useState<ProjectType | null>(null);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId);
    setProject(foundProject || null);
  }, [projectId, projects]);

  if (!project) {
    return null;
  }

  return (
    <AIChat />
  );
};

export default Project;
