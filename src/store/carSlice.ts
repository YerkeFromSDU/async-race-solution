import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Car {
	id: number;
	name: string;
	color: string;
}

interface CarState {
	cars: Car[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	currentCar: Car | null;
}

const initialState: CarState = {
	cars: [],
	status: 'idle',
	error: null,
	currentCar: null,
};

const randomColor = () => {
	const colors = ['#FF5733', '#33FFC5', '#336BFF', '#FF33E0', '#FFE333'];
	return colors[Math.floor(Math.random() * colors.length)];
};
export const generateCars = createAsyncThunk('cars/generateCars', async () => {
	const cars = [];
		for (let i = 1; i <= 100; i++) { //eslint-disable-line
		cars.push({
			id: i + 100, //eslint-disable-line
			name: `Car ${i}`,
			color: randomColor(),
		});
	}
	return cars;
});

export const fetchCars = createAsyncThunk('cars/fetchCars', async () => {
	const response = await fetch('http://localhost:3000/garage');
	return response.json();
});
export const fetchCarById = createAsyncThunk(
	'cars/fetchCarById',
	async (id: number) => {
		const response = await fetch(`http://localhost:3000/garage/${id}`);
		return response.json();
	}
);
export const createCar = createAsyncThunk(
	'cars/createCar',
	async ({ name, color }: { name: string; color: string }) => {
		const response = await fetch('http://localhost:3000/garage', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, color }),
		});
		return response.json();
	}
);
export const updateCar = createAsyncThunk(
	'cars/updateCar',
	async ({ id, name, color }: { id: number; name: string; color: string }) => {
		const response = await fetch(`http://localhost:3000/garage/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, color }),
		});
		return response.json();
	}
);
export const deleteCar = createAsyncThunk<void, number>(
	'cars/deleteCar',
	async (carId: number) => {
		try {
			const response = await fetch(`http://localhost:3000/garage/${carId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete car.');
			}

			// const data = await response.json();
		} catch (error) {
			console.log(error);
		}
	}
);
const carSlice = createSlice({
	name: 'cars',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCars.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
				state.status = 'succeeded';
				state.cars = action.payload;
			})
			.addCase(fetchCars.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(fetchCarById.fulfilled, (state, action: PayloadAction<Car>) => {
				state.currentCar = action.payload;
			})
			.addCase(createCar.fulfilled, (state, action: PayloadAction<Car>) => {
				state.cars.push(action.payload);
			})
			.addCase(updateCar.fulfilled, (state, action: PayloadAction<Car>) => {
				const updatedCar = action.payload;
				const existingCar = state.cars.find((car) => car.id === updatedCar.id);
				if (existingCar) {
					existingCar.name = updatedCar.name;
					existingCar.color = updatedCar.color;
				}
			})
			.addCase(deleteCar.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(deleteCar.fulfilled, (state) => {
				state.status = 'succeeded';
				state.cars = state.cars.filter((car) => car.id !== 0);
			})
			.addCase(deleteCar.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(
				generateCars.fulfilled,
				(state, action: PayloadAction<Car[]>) => {
					state.cars = [...state.cars, ...action.payload];
				}
			);
	},
});

export default carSlice.reducer;
