import { ipcRenderer } from "electron";
import * as path from "path";
import store from "../store";
import { setProjects, addProject, Project } from "../store/projectsSlice";
import { CHAT_FILE_NAME, LOCAL_STORAGE_KEY_PROJECTS } from "../constants";

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

export interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

export const createProject = async (): Promise<Project | null> => {
  const result = await ipcRenderer.invoke("select-folder");

  if (result.canceled || !result.filePath) {
    return null;
  }

  const projectPath = result.filePath;
  const folderName = path.basename(projectPath);

  const existingProjects = store.getState().projects.list;
  const existingProject = existingProjects.find((p) => p.path === projectPath);
  if (existingProject) {
    return existingProject;
  }

  const project: Project = {
    id: Date.now().toString(),
    name: folderName,
    path: projectPath,
  };

  store.dispatch(addProject(project));
  await saveProjects();

  return project;
};

export const getProjects = async (): Promise<Project[]> => {
  const projectsJson = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS);
  const projects: Project[] = projectsJson ? JSON.parse(projectsJson) : [];
  store.dispatch(setProjects(projects));
  return projects;
};

const saveProjects = async (): Promise<void> => {
  const projects = store.getState().projects.list;
  localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, JSON.stringify(projects));
};

export const saveChat = async (
  projectPath: string,
  chatThread: ChatThread
): Promise<void> => {
  const chatFilePath = `${projectPath}/${CHAT_FILE_NAME}`;
  const result = await ipcRenderer.invoke(
    "write-file",
    chatFilePath,
    JSON.stringify(chatThread)
  );
  if (!result.success) {
    throw new Error(`Failed to save chat: ${result.error}`);
  }
};

export const getChat = async (
  projectPath: string
): Promise<ChatThread | null> => {
  const chatFilePath = `${projectPath}/${CHAT_FILE_NAME}`;
  const result = await ipcRenderer.invoke("read-file", chatFilePath);
  if (!result.success) {
    if (result.code === "ENOENT") {
      return null; // Chat file doesn't exist yet
    }
    throw new Error(`Failed to read chat file: ${result.error}`);
  }
  return JSON.parse(result.data);
};

export const createNewChatForProject = async (
  projectPath: string,
  chatTitle: string
): Promise<ChatThread> => {
  const newChat: ChatThread = {
    id: Date.now().toString(),
    title: chatTitle,
    messages: [],
    lastUpdated: Date.now(),
  };

  await saveChat(projectPath, newChat);
  return newChat;
};

export const addMessageToChat = async (
  projectPath: string,
  message: Message
): Promise<void> => {
  const chat = await getChat(projectPath);
  if (!chat) {
    throw new Error("Chat not found");
  }

  chat.messages.push(message);
  chat.lastUpdated = Date.now();

  await saveChat(projectPath, chat);
};

// export const updateProjectDetails = async (project: Project): Promise<void> => {
//   store.dispatch(
//     setProjects(
//       store
//         .getState()
//         .projects.list.map((p) => (p.id === project.id ? project : p))
//     )
//   );
//   await saveProjects();
// };

export const deleteProject = async (projectId: string): Promise<void> => {
  const project = store
    .getState()
    .projects.list.find((p) => p.id === projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Note: This doesn't delete the project directory, just removes it from our list
  // You may want to add file system deletion if that's desired behavior
  store.dispatch(
    setProjects(
      store.getState().projects.list.filter((p) => p.id !== projectId)
    )
  );
  await saveProjects();
};
