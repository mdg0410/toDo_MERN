import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Aquí se agregarán los reducers cuando se implementen
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
