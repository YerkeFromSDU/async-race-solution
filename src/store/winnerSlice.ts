import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWinners = createAsyncThunk(
	'winners/fetchWinners',
	async () => {
		const response = await fetch('http://localhost:3000/winners');
		const data = await response.json();
		return data;
	}
);

const winnerSlice = createSlice({
	name: 'winners',
	initialState: {
		items: [],
		status: 'idle',
		error: null,
	},
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
			});
	},
});

export default winnerSlice.reducer;
