import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'; //eslint-disable-line
import { AppDispatch, RootState } from './store.ts'; //eslint-disable-line

interface Car {
	id: number;
	name: string;
	color: string;
	isDriving?: boolean;
	position?: number;
	animationDuration?: string;
}

interface CarState {
	cars: Car[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	currentCar: Car | null;
	isRacing: boolean;
}

const initialState: CarState = {
	cars: [],
	status: 'idle',
	error: null,
	currentCar: null,
	isRacing: false,
};
const randomName = () => {
	const names = [
		'Mercedes',
		'Mazda',
		'Nissan',
		'Audi',
		'Porsche',
		'BMW',
		'Toyota',
		'Tesla',
		'Bentley',
		'Hyundai',
	];
	return names[Math.floor(Math.random() * names.length)];
};
const randomColor = () => {
	const colors = [
		'#CAFC56',
		'#2F3C7E',
		'#990011',
		'#00246B',
		'#2C5F2D',
		'#97BC62',
		'#7A2048',
		'#A1BE95',
		'#735DA5',
	];
	return colors[Math.floor(Math.random() * colors.length)];
};
export const generateCars = createAsyncThunk<
	void,
	void,
	{ dispatch: AppDispatch }
>('cars/generateCars', async (_, { dispatch }) => {
	for (let i = 1; i <= 100; i++) { //eslint-disable-line
		const car = {
			name: randomName(),
			color: randomColor(),
		};
		await dispatch(createCar(car)); //eslint-disable-line
	}
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
export const startRace = createAsyncThunk<
	void,
	void,
	{ dispatch: AppDispatch; state: RootState }
>('cars/startRace', async (_, { dispatch, getState }) => {
	const { cars } = getState().cars;
	dispatch(setIsRacing(true));//eslint-disable-line

	try {
		// Start engines for all cars
		const startRequests = cars.map(async (car) => {
			try {
				const response = await fetch(
					`http://localhost:3000/engine?id=${car.id}&status=started`,
					{ method: 'PATCH' }
				);
				if (!response.ok)
					throw new Error(`Failed to start engine for car ${car.id}`);
				const data = await response.json();
				const { velocity, distance } = data;
				const duration = distance / velocity / 1000;//eslint-disable-line
				dispatch(
					updateCarAnimationDuration({//eslint-disable-line
						id: car.id,
						animationDuration: `${duration}s`,
					})
				);
				return { car, duration };
			} catch (error) {
				console.error(`Error starting engine for car ${car.id}:`, error);
				dispatch(updateCarStatus({ id: car.id, isDriving: false }));//eslint-disable-line
				return null;
			}
		});

		const startResults = await Promise.all(startRequests);

		// Drive all cars
		const driveRequests = startResults.map(async (result) => {
			if (result) {
				const { car } = result;
				try {
					const response = await fetch(
						`http://localhost:3000/engine?id=${car.id}&status=drive`,
						{ method: 'PATCH' }
					);
					if (!response.ok) throw new Error(`Failed to drive car ${car.id}`);
					dispatch(updateCarStatus({ id: car.id, isDriving: true }));//eslint-disable-line
					return car.id;
				} catch (error) {
					console.error(`Error driving car ${car.id}:`, error);
					dispatch(updateCarStatus({ id: car.id, isDriving: false }));//eslint-disable-line
					dispatch(
						updateCarAnimationDuration({//eslint-disable-line
							id: car.id,
							animationDuration: undefined,
						})
					);
					return null;
				}
			}
			return null;
		});

		const driveResults = await Promise.all(driveRequests);

		driveResults.forEach((carId) => {
			if (carId !== null) {
				dispatch(startCarAnimation(carId));//eslint-disable-line
			}
		});
	} catch (error) {
		console.error('Error starting race:', error);
		// Handle error: stop all cars if any request fails
		cars.forEach((car) => {
			dispatch(updateCarStatus({ id: car.id, isDriving: false }));//eslint-disable-line
			dispatch(
				updateCarAnimationDuration({ id: car.id, animationDuration: undefined })//eslint-disable-line
			);
		});
		dispatch(setIsRacing(false));//eslint-disable-line
	}
});

export const resetRace = createAsyncThunk<
	void,
	void,
	{ dispatch: AppDispatch }
>('cars/resetRace', async (_, { dispatch }) => {
	dispatch(setIsRacing(false)); //eslint-disable-line
	dispatch(resetAllCars()); //eslint-disable-line
});
const carSlice = createSlice({
	name: 'cars',
	initialState,
	reducers: {
		setIsRacing(state, action: PayloadAction<boolean>) {
			state.isRacing = action.payload;
		},
		updateCarStatus(
			state,
			action: PayloadAction<{ id: number; isDriving: boolean }>
		) {
			const car = state.cars.find((car) => car.id === action.payload.id); //eslint-disable-line
			if (car) car.isDriving = action.payload.isDriving;
		},
		updateCarAnimationDuration(
			state,
			action: PayloadAction<{ id: number; animationDuration?: string }>
		) {
			const car = state.cars.find((car) => car.id === action.payload.id); //eslint-disable-line
			if (car) car.animationDuration = action.payload.animationDuration;
		},
		startCarAnimation(state, action: PayloadAction<number>) {
			const car = state.cars.find((car) => car.id === action.payload); //eslint-disable-line
			if (car) {
				car.position = 1;
				car.isDriving = true;
			} // Set to some value to trigger CSS animation
		},
		resetAllCars(state) {
			state.cars.forEach((car) => {
				car.isDriving = false;
				car.position = 0; // Assuming initial position is 0
				car.animationDuration = undefined;
			});
		},
	},
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
			});
	},
});
export const {
	setIsRacing,
	updateCarStatus,
	resetAllCars,
	updateCarAnimationDuration,
	startCarAnimation,
} = carSlice.actions;
export default carSlice.reducer;
