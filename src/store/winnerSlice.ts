import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; //eslint-disable-line
interface Winner {
	id: number;
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
	async () => {
		const response = await fetch('http://localhost:3000/winners');
		const data = await response.json();
		return data;
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
const winnerSlice = createSlice({
	name: 'winners',
	initialState,
	reducers: {},
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
				const index = state.items.findIndex(
					(winner) => winner.id === action.payload.id
				);
				if (index >= 0) {
					state.items[index] = action.payload;
				}
			})
			.addCase(updateWinner.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	},
});

export default winnerSlice.reducer;
