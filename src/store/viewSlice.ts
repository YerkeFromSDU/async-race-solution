import { createSlice } from '@reduxjs/toolkit'; //eslint-disable-line

export const viewSlice = createSlice({
	name: 'view',
	initialState: {
		pageNumber: 1,
		inputValues: {
			createName: '',
			createColor: '',
			updateName: '',
			updateColor: '',
		},
	},
	reducers: {
		setPageNumber: (state, action) => {
			state.pageNumber = action.payload;
		},
		setInputValue: (state, action) => {
			state.inputValues[action.payload.key] = action.payload.value;
		},
	},
});

export const { setPageNumber, setInputValue } = viewSlice.actions;
export default viewSlice.reducer;
