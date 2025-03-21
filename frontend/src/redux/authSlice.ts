import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Definición de tipos
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  verificationAttempted: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const API_URL = 'http://localhost:4000/api/auth';

// Cargar usuario desde localStorage al iniciar la aplicación
const loadUserFromStorage = (): { user: User | null; token: string | null } => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token) {
      return { user: null, token: null };
    }
    
    const user = userStr ? JSON.parse(userStr) : null;
    return { user, token };
  } catch (error) {
    console.error('Error loading user from storage:', error);
    return { user: null, token: null };
  }
};

// Thunk para iniciar sesión
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const data: AuthResponse = response.data;
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al iniciar sesión'
      );
    }
  }
);

// Thunk para registro
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      const data: AuthResponse = response.data;
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al registrarse'
      );
    }
  }
);

// Thunk para verificar usuario
export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    
    // Si ya intentamos verificar antes, usar datos en caché directamente
    if (state.auth.verificationAttempted) {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (token && userStr) {
        const cachedUser = JSON.parse(userStr);
        return { user: cachedUser, token };
      }
      return rejectWithValue('No hay datos de usuario disponibles');
    }
    
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token) {
        return rejectWithValue('No hay token disponible');
      }
      
      // Si hay un usuario en localStorage, usarlo temporalmente mientras se verifica
      const cachedUser = userStr ? JSON.parse(userStr) : null;
      
      try {
        // Verificar con el servidor
        const response = await axios.get(`${API_URL}/verify`, {
          headers: { Authorization: `Bearer ${token}` },
          // Añadir un timeout de 3 segundos para evitar esperas largas
          timeout: 3000
        });
        
        // Actualizar la información del usuario desde el servidor
        return { user: response.data, token };
      } catch (serverError: any) {
        // Si el error es 404, simplemente usamos los datos en caché sin mostrar error
        if (serverError.response && serverError.response.status === 404) {
          if (cachedUser) {
            console.info('Ruta de verificación no disponible, usando datos de caché');
            return { user: cachedUser, token };
          }
        }
        
        // Para otros errores, intentamos usar el caché si está disponible
        if (cachedUser) {
          console.warn('Error al verificar con servidor, usando datos de caché:', serverError);
          return { user: cachedUser, token };
        }
        throw serverError; // Re-lanzar el error si no hay caché
      }
    } catch (error: any) {
      // Limpiar localStorage solo si es un error crítico (no 404)
      if (!error.response || error.response.status !== 404) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return rejectWithValue(
        error.response?.data?.message || 'Error al verificar usuario'
      );
    }
  }
);

// Estado inicial con carga desde localStorage
const { user, token } = loadUserFromStorage();

const initialState: AuthState = {
  user,
  token,
  loading: false,
  error: null,
  verificationAttempted: false
};

// Slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setVerificationAttempted: (state, action) => {
      state.verificationAttempted = action.payload;
    }
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // verifyUser
    builder
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.verificationAttempted = true;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        // Si el error fue por 404, no limpiamos el usuario
        if (action.error.message?.includes('404')) {
          state.verificationAttempted = true;
        } else {
          state.user = null;
          state.token = null;
        }
        state.error = action.payload as string;
        state.verificationAttempted = true;
      });
  }
});

export const { logout, clearError, setVerificationAttempted } = authSlice.actions;
export default authSlice.reducer;
