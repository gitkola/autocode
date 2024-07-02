import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  id: string;
  name: string;
  path: string;
}

interface ProjectsState {
  list: Project[];
  activeProjectId: string | null;
}

const initialState: ProjectsState = {
  list: [],
  activeProjectId: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.list = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.list.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.list.findIndex(
        (project) => project.id === action.payload.id,
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        (project) => project.id !== action.payload,
      );
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  removeProject,
  setActiveProject,
} = projectsSlice.actions;

export default projectsSlice.reducer;
