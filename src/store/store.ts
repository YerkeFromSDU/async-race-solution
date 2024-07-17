import { configureStore } from '@reduxjs/toolkit';
import carReducer from './carSlice.ts';

export const store = configureStore({
	reducer: {
		cars: carReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
