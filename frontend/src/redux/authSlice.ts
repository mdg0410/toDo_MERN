import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Definición de tipos
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

const API_URL = 'http://localhost:4000/api/auth';

// Thunk para iniciar sesión
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al iniciar sesión'
      );
    }
  }
);

// Thunk para registrar usuario
export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, credentials);
      
      // También guardar el token al registrar (si se retorna)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al registrar usuario'
      );
    }
  }
);

// Thunk para verificar el usuario actual
export const verifyUser = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No hay token');
      }
      
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return { user: response.data, token };
    } catch (error: any) {
      localStorage.removeItem('token'); // Eliminar token inválido
      return rejectWithValue(
        error.response?.data?.message || 'Sesión inválida'
      );
    }
  }
);

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

// Slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Si se devuelve un token y usuario, autenticar
        if (action.payload.token && action.payload.user) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
    // Verify user
    builder
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
