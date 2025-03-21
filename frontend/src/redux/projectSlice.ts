import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Definición de tipos
export interface Project {
  _id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  taskCount?: number;
}

export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  currentProject: Project | null;
  projectTasks: { [key: string]: any[] };
}

interface ProjectData {
  name: string;
  description?: string;
}

interface ProjectUpdateData extends ProjectData {
  id: string;
}

const API_URL = 'http://localhost:4000/api/projects';

// Configuración para incluir el token en las peticiones
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Thunk para obtener todos los proyectos
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, getConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener los proyectos'
      );
    }
  }
);

// Thunk para crear un proyecto
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: ProjectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, projectData, getConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear el proyecto'
      );
    }
  }
);

// Thunk para actualizar un proyecto
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (projectData: ProjectUpdateData, { rejectWithValue }) => {
    try {
      const { id, ...data } = projectData;
      const response = await axios.put(`${API_URL}/${id}`, data, getConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar el proyecto'
      );
    }
  }
);

// Thunk para eliminar un proyecto
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getConfig());
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar el proyecto'
      );
    }
  }
);

// Thunk para obtener tareas de un proyecto
export const fetchProjectTasks = createAsyncThunk(
  'projects/fetchProjectTasks',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${projectId}/tasks`, getConfig());
      return { projectId, tasks: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener las tareas del proyecto'
      );
    }
  }
);

// Thunk para obtener datos del proyecto con cantidad de tareas
export const fetchProjectsWithTaskCount = createAsyncThunk(
  'projects/fetchProjectsWithTaskCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?includeTaskCount=true`, getConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener los proyectos'
      );
    }
  }
);

// Estado inicial actualizado
const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  currentProject: null,
  projectTasks: {}
};

// Slice de proyectos
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearProjectError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // fetchProjects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // createProject
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // updateProject
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map(project => 
          project._id === action.payload._id ? action.payload : project
        );
        state.currentProject = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // deleteProject
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(project => project._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchProjectsWithTaskCount
    builder
      .addCase(fetchProjectsWithTaskCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsWithTaskCount.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectsWithTaskCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchProjectTasks
    builder
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        const { projectId, tasks } = action.payload;
        state.projectTasks[projectId] = tasks;
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setCurrentProject, clearCurrentProject, clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
