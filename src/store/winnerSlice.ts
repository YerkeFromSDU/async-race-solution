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
	async (_, { getState }) => {
		const response = await fetch('http://localhost:3000/winners');
		const { cars } = (getState() as RootState).cars;
		const data = await response.json();
		return data.map((winner: any) => { //eslint-disable-line
			const car = cars.find((car) => car.id === winner.id);//eslint-disable-line
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
		if (!response.ok) {
			throw new Error('Failed to add winner');
		}
		const data = await response.json();
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
export const deleteZeroWinsWinners = createAsyncThunk<number[], void>(
	'winners/deleteZeroWinsWinners',
	async (_, { dispatch, getState, rejectWithValue }) => { //eslint-disable-line
		try {
			// Fetch all winners
			const response = await fetch('http://localhost:3000/winners');
			if (!response.ok) {
				throw new Error('Failed to fetch winners.');
			}
			const winners = await response.json();

			// Find winners with 0 wins
			const zeroWinsWinners = winners.filter(
				(winner: any) => winner.wins === 0 //eslint-disable-line
			);

			// Delete each winner with 0 wins
			const deleteRequests = zeroWinsWinners.map(async (winner: any) => { //eslint-disable-line
				const deleteResponse = await fetch(
					`http://localhost:3000/winners/${winner.id}`,
					{
						method: 'DELETE',
					}
				);
				if (!deleteResponse.ok) {
					throw new Error(`Failed to delete winner with ID ${winner.id}`);
				}
			});

			await Promise.all(deleteRequests);

			// Return the IDs of the deleted winners
			return zeroWinsWinners.map((winner: any) => winner.id); //eslint-disable-line
		} catch (error) {
			return rejectWithValue(error.message);
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
			const existingWinner = state.items.find((w) => w.id === winner.id);//eslint-disable-line
			if (existingWinner) {
				existingWinner.wins = winner.wins;
				existingWinner.time = winner.time;
				// if (time < existingWinner.time) {
				// 	existingWinner.time = time;
				// }
				// existingWinner.wins += 1;
			} else {
				// state.items.push({ ...action.payload, wins: 1 });
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
			.addCase(deleteZeroWinsWinners.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(deleteZeroWinsWinners.fulfilled, (state, action) => {
				state.status = 'succeeded';
				// Remove winners with 0 wins from state
				state.items = state.items.filter(
					(winner) => !action.payload.includes(winner.id)
				);
			})
			.addCase(deleteZeroWinsWinners.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});
export const { addOrUpdateWinner } = winnerSlice.actions;
export default winnerSlice.reducer;
