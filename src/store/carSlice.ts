import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'; //eslint-disable-line
import { AppDispatch, RootState } from './store.ts'; //eslint-disable-line
import { updateWinner, addWinner, addOrUpdateWinner,fetchWinners,deleteWinner } from './winnerSlice.ts'; //eslint-disable-line
import { useDispatch } from 'react-redux'; //eslint-disable-line
import { randomName, randomModel, randomColor } from '../carUtils.ts';

interface Car {
	id: number;
	name: string;
	color: string;
	isDriving?: boolean;
	position?: number;
	animationDuration?: string;
	finishTime?: number;
	isOverheated?: boolean;
}

interface CarState {
	cars: Car[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	currentCar: Car | null;
	isRacing: boolean;
	winner: Car | null;
	raceFinished: boolean;
	loading: boolean;
}

const initialState: CarState = {
	cars: [],
	status: 'idle',
	error: null,
	currentCar: null,
	isRacing: false,
	winner: null,
	raceFinished: false,
	loading: false,
};

export const generateCars = createAsyncThunk<
	void,
	void,
	{ dispatch: AppDispatch }
>('cars/generateCars', async (_, { dispatch }) => {
	for (let i = 1; i <= 20; i++) {
		const car = {
			name: `${randomName()} ${randomModel()}`,
			color: randomColor(),
		};
		await dispatch(createCar(car));
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
	async (carId: number, { dispatch }) => {
		try {
			const winnersResponse = await fetch('http://localhost:3000/winners');
			if (!winnersResponse.ok) {
				throw new Error('Failed to fetch winners.');
			}
			const winners = await winnersResponse.json();

			const carInWinners = winners.some((winner: any) => winner.id === carId);

			const deleteCarResponse = await fetch(
				`http://localhost:3000/garage/${carId}`,
				{
					method: 'DELETE',
				}
			);
			if (!deleteCarResponse.ok) {
				throw new Error('Failed to delete car.');
			}

			if (carInWinners) {
				dispatch(deleteWinner(carId));
			}
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
	const { cars, isRacing } = getState().cars;
	if (isRacing) return;

	dispatch(setIsRacing(true));
	try {
		// Start engines for all cars
		dispatch(setLoading(true));
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
				const duration = distance / velocity / 1000;
				dispatch(
					updateCarAnimationDuration({
						id: car.id,
						animationDuration: `${duration}s`,
					})
				);

				return { car, duration };
			} catch (error) {
				if (error) {
					console.error(`Error starting engine for car ${car.id}:`, error);
				}
				dispatch(updateCarStatus({ id: car.id, isDriving: false }));
				return null;
			}
		});

		const startResults = await Promise.all(startRequests);

		// dispatch(setLoading(false));

		const driveRequests = startResults.map(async (result) => {
			if (result) {
				const { car, duration } = result;
				try {
					const response = await fetch(
						`http://localhost:3000/engine?id=${car.id}&status=drive`,
						{ method: 'PATCH' }
					);
					if (!response.ok) throw new Error(`Failed to drive car ${car.id}`);
					// dispatch(updateCarStatus({ id: car.id, isDriving: true })); // loads little but winner after last car

					return { car, duration };
				} catch (error) {
					console.error(`The car ${car.id} is overheated`, error);
					dispatch(
						updateCarStatus({
							id: car.id,
							isDriving: false,
							isOverheated: true,
						})
					);
					return null;
				}
			}
			return null;
		});

		const driveResults = await Promise.all(driveRequests);
		dispatch(setLoading(false));
		const finishTimes = driveResults
			.map((result) => {
				if (result) {
					const { car, duration } = result;
					dispatch(updateCarStatus({ id: car.id, isDriving: true })); // loads a lot but winner is after first
					setTimeout(() => {
						dispatch(finishRaceForCar({ id: car.id, time: duration }));
					}, duration * 1000); //eslint-disable-line
					return { carId: car.id, finishTime: duration };
				}
				return null;
			})
			.filter(
				(result): result is { carId: number; finishTime: number } =>
					result !== null
			);
		const minDuration = Math.min( //eslint-disable-line
			...finishTimes.map((result) => result.finishTime)
		);
		dispatch(fetchWinners({ sortBy: 'wins', order: 'DESC' }));
		setTimeout(
			async () => {
				if (!getState().cars.isRacing) return;

				const { cars } = getState().cars;
				const finishedCars = cars.filter((car) => car.finishTime !== undefined);

				if (finishedCars.length > 0) {
					const winner = finishedCars.reduce((prev, current) => {
						return prev.finishTime! < current.finishTime! ? prev : current;
					});
					dispatch(setWinner(winner));

					const winnerData = {
						id: winner.id,
						wins: 0, // Initial wins count
						time: winner.finishTime!,
					};
					console.log('Adding winner:', winnerData);

					const state = getState();
					const existingWinner = state.winners.items.find(
						(w) => w.id === winner.id
					);
					if (existingWinner) {
						// Update existing winner
						console.log('is winner exists:', existingWinner);
						winnerData.wins = existingWinner.wins + 1;
						await dispatch(updateWinner(winnerData)).unwrap();
					} else {
						// Add new winner
						console.log('is winner dont exists:', existingWinner);
						winnerData.wins = 1;
						await dispatch(addWinner(winnerData)).unwrap();
					}
					dispatch(addOrUpdateWinner(winnerData));
				}
			},
			minDuration * 1000 //eslint-disable-line
		);
	} catch (error) {
		console.error('Error starting race:', error);
		// stop all cars if any request fails
		cars.forEach((car) => {
			// dispatch(updateCarStatus({ id: car.id, isDriving: false }));
			dispatch(
				updateCarStatus({ id: car.id, isDriving: false, isOverheated: false })
			);
			dispatch(
				updateCarAnimationDuration({ id: car.id, animationDuration: undefined })
			);
		});
		dispatch(setIsRacing(false));
		dispatch(setLoading(false));
	}
});

export const resetRace = createAsyncThunk<
	void,
	void,
	{ dispatch: AppDispatch }
>('cars/resetRace', async (_, { dispatch }) => {
	dispatch(setIsRacing(false));
	dispatch(resetAllCars());
	dispatch(setWinner(null));
});

const carSlice = createSlice({
	name: 'cars',
	initialState,
	reducers: {
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setIsRacing(state, action: PayloadAction<boolean>) {
			state.isRacing = action.payload;
		},
		updateCarStatus(
			state,
			action: PayloadAction<{
				id: number;
				isDriving: boolean;
				isOverheated?: boolean;
			}>
		) {
			const car = state.cars.find((car) => car.id === action.payload.id);
			// if (car) car.isDriving = action.payload.isDriving;
			if (car) {
				car.isDriving = action.payload.isDriving;
				if (action.payload.isOverheated !== undefined) {
					car.isOverheated = action.payload.isOverheated;
				}
			}
		},
		updateCarAnimationDuration(
			state,
			action: PayloadAction<{ id: number; animationDuration?: string }>
		) {
			const car = state.cars.find((car) => car.id === action.payload.id);
			if (car) car.animationDuration = action.payload.animationDuration;
		},
		startCarAnimation(state, action: PayloadAction<number>) {
			const car = state.cars.find((car) => car.id === action.payload);
			if (car) {
				car.position = 1;
				car.isDriving = true;
			}
		},
		resetAllCars(state) {
			state.cars.forEach((car) => {
				car.isDriving = false;
				car.position = 0;
				car.animationDuration = undefined;
				car.finishTime = undefined;
				car.isOverheated = false;
			});
			state.winner = null;
			state.raceFinished = false;
		},
		finishRaceForCar(
			state,
			action: PayloadAction<{ id: number; time: number }>
		) {
			const car = state.cars.find((car) => car.id === action.payload.id);

			if (car) {
				car.finishTime = action.payload.time;
				state.raceFinished = true;
				// if (
				// 	!state.winner ||
				// 	(car && car.finishTime! < state.winner.finishTime!)
				// ) {
				// 	state.winner = car!;
				// 	console.log(state.winner);
				// }
			}
		},
		setWinner(state, action: PayloadAction<Car>) {
			state.winner = action.payload;
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
	finishRaceForCar,
	setWinner,
	setLoading,
} = carSlice.actions;
export default carSlice.reducer;
