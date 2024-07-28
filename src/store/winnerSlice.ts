import { createSlice, createAsyncThunk,PayloadAction } from '@reduxjs/toolkit'; //eslint-disable-line
import { AppDispatch, RootState } from './store.ts'; //eslint-disable-line
interface Winner {
	id: number;
	name?: string;
	color?: string;
	time: number;
	wins: number;
}

// Define the initial state and its type
interface WinnerState {
	items: Winner[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: WinnerState = {
	items: [],
	status: 'idle',
	error: null,
};
export const fetchWinners = createAsyncThunk(
	'winners/fetchWinners',
	async (
		params: { sortBy: 'wins' | 'time' | 'id'; order: 'ASC' | 'DESC' },
		{ getState }
	) => {
		const { sortBy, order } = params;
		const response = await fetch(
			`http://localhost:3000/winners?_sort=${sortBy}&_order=${order}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch winners');
		}
		const data = await response.json();
		const { cars } = (getState() as RootState).cars;
		return data.map((winner: any) => {
			const car = cars.find((car) => car.id === winner.id);
			return {
				...winner,
				name: car ? car.name : 'Unknown',
				color: car ? car.color : '#000000',
			};
		});
	}
);
export const fetchWinnerById = createAsyncThunk(
	'winners/fetchWinnerById',
	async (id: number) => {
		const response = await fetch(`http://localhost:3000/winners/${id}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch winner with id ${id}`);
		}
		return response.json();
	}
);
export const addWinner = createAsyncThunk(
	'winners/addWinner',
	async (winner: Winner) => {
		const response = await fetch('http://localhost:3000/winners', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(winner),
		});
		console.log('Response:', response);
		if (!response.ok) {
			throw new Error('Failed to add winner');
		}
		const data = await response.json();
		console.log('Response data:', data);
		return data;
	}
);
export const updateWinner = createAsyncThunk(
	'winners/updateWinner',
	async (winner: Winner) => {
		const response = await fetch(`http://localhost:3000/winners/${winner.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(winner),
		});
		if (!response.ok) {
			throw new Error('Failed to update winner');
		}
		return response.json();
	}
);
export const deleteWinner = createAsyncThunk<void, number>(
	'winners/deleteWinner',
	async (winnerId: number) => {
		try {
			const response = await fetch(
				`http://localhost:3000/winners/${winnerId}`,
				{
					method: 'DELETE',
				}
			);

			if (!response.ok) {
				throw new Error('Failed to delete winner.');
			}
		} catch (error) {
			console.log(error);
		}
	}
);

const winnerSlice = createSlice({
	name: 'winners',
	initialState,
	reducers: {
		addOrUpdateWinner(
			state,
			action: PayloadAction<{ id: number; time: number; wins: number }>
		) {
			// const { id, time } = action.payload;
			const winner = action.payload;
			const existingWinner = state.items.find((w) => w.id === winner.id);
			if (existingWinner) {
				existingWinner.wins = winner.wins;
				existingWinner.time = winner.time;
			} else {
				state.items.push(winner);
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWinners.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchWinners.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.items = action.payload;
			})
			.addCase(fetchWinners.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(fetchWinnerById.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchWinnerById.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const index = state.items.findIndex(
					(winner) => winner.id === action.payload.id
				);
				if (index >= 0) {
					state.items[index] = action.payload;
				} else {
					state.items.push(action.payload);
				}
			})
			.addCase(fetchWinnerById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(addWinner.fulfilled, (state, action) => {
				state.items.push(action.payload);
			})
			.addCase(addWinner.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(updateWinner.fulfilled, (state, action) => {
				const updatedWinner = action.payload;
				const existingWinner = state.items.find(
					(w) => w.id === updatedWinner.id
				);
				if (existingWinner) {
					existingWinner.wins = updatedWinner.wins;
					existingWinner.time = updatedWinner.time;
				}
			})
			.addCase(updateWinner.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(deleteWinner.fulfilled, (state, action) => {
				const id = action.meta.arg;
				state.items = state.items.filter((winner) => winner.id !== id);
			})
			.addCase(deleteWinner.rejected, (state, action) => {
				console.error('Failed to delete winner:', action.error.message);
			});
	},
});
export const { addOrUpdateWinner } = winnerSlice.actions;
export default winnerSlice.reducer;
