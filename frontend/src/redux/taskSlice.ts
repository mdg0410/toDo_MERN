import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Definición de tipos
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdBy: string;
  project?: {
    _id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  currentTask: Task | null;
  projectTasks: { [key: string]: Task[] };
}

interface TaskData {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  project?: string | null;
}

interface TaskUpdateData extends TaskData {
  id: string;
}

const API_URL = 'http://localhost:4000/api/tasks';

// Configuración para incluir el token en las peticiones
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Thunk para obtener todas las tareas
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (arg: { projectId?: string } | undefined, { rejectWithValue }) => {
    try {
      let url = API_URL;
      if (arg && arg.projectId) {
        url += `?project=${arg.projectId}`;
      }
      const response = await axios.get(url, getConfig());
      return { tasks: response.data, projectId: arg?.projectId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener las tareas'
      );
    }
  }
);

// Thunk para obtener tareas sin proyecto
export const fetchTasksWithoutProject = createAsyncThunk(
  'tasks/fetchTasksWithoutProject',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?noProject=true`, getConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener las tareas sin proyecto'
      );
    }
  }
);

// Thunk para crear una tarea
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: TaskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, taskData, getConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear la tarea'
      );
    }
  }
);

// Thunk para actualizar una tarea
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (taskData: TaskUpdateData, { rejectWithValue }) => {
    try {
      const { id, ...data } = taskData;
      const response = await axios.put(`${API_URL}/${id}`, data, getConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar la tarea'
      );
    }
  }
);

// Thunk para eliminar una tarea
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getConfig());
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar la tarea'
      );
    }
  }
);

// Estado inicial
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  currentTask: null,
  projectTasks: {}
};

// Slice de tareas
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearTaskError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // fetchTasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        const { tasks, projectId } = action.payload;
        state.tasks = tasks;
        
        // Si hay un projectId, también actualizar projectTasks
        if (projectId) {
          state.projectTasks[projectId] = tasks;
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // fetchTasksWithoutProject
    builder
      .addCase(fetchTasksWithoutProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksWithoutProject.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksWithoutProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // createTask
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        
        // Actualizar también las tareas del proyecto si corresponde
        const projectId = action.payload.project?._id;
        if (projectId && state.projectTasks[projectId]) {
          state.projectTasks[projectId].push(action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // updateTask
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        );
        state.currentTask = null;
        
        // Actualizar también las tareas del proyecto si corresponde
        const projectId = action.payload.project?._id;
        if (projectId && state.projectTasks[projectId]) {
          state.projectTasks[projectId] = state.projectTasks[projectId].map(task => 
            task._id === action.payload._id ? action.payload : task
          );
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // deleteTask
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const deletedTaskId = action.payload;
        const taskToDelete = state.tasks.find(task => task._id === deletedTaskId);
        const projectId = taskToDelete?.project?._id;
        
        // Eliminar de la lista principal
        state.tasks = state.tasks.filter(task => task._id !== deletedTaskId);
        
        // Eliminar también de las tareas del proyecto si corresponde
        if (projectId && state.projectTasks[projectId]) {
          state.projectTasks[projectId] = state.projectTasks[projectId].filter(
            task => task._id !== deletedTaskId
          );
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setCurrentTask, clearCurrentTask, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
