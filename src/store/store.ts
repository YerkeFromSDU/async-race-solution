import { configureStore } from '@reduxjs/toolkit';
import carReducer from './carSlice.ts';//eslint-disable-line
import winnerReducer from './winnerSlice.ts';
import viewReducer from './viewSlice.ts';

export const store = configureStore({
	reducer: {
		cars: carReducer,
		winners: winnerReducer,
		view: viewReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
