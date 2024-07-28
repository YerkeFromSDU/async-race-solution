import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; //eslint-disable-line
import { AppDispatch, RootState } from '../../store/store.ts';
import RaceControlPanel from './ConrollPanel/RaceControlPanel/RaceControlPanel.tsx';
import CarCreationPanel from './ConrollPanel/CarCreationPanel/CarCreationPanel.tsx';
import GarageSection from './GarageSection/GarageSection.tsx';
import { generateCars, setWinner } from '../../store/carSlice.ts';
import Button from '../Button/Button.tsx';
import './Garage.css';
import WinnerBanner from '../WinnerBanner/WinnerBanner.tsx';

function Garage() {
	const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { winner, raceFinished } = useSelector(
		(state: RootState) => state.cars
	);
	const isRacing = useSelector((state: RootState) => state.cars.isRacing);

	const handleSelectCar = (id: number) => {
		setSelectedCarId(id);
	};
	const handleGenerateCars = () => {
		dispatch(generateCars());
	};
	useEffect(() => {
		if (!isRacing) {
			dispatch(setWinner(null)); // Clear winner if race is not active
		}
	}, [isRacing, dispatch]);
	return (
		<div className='garage-container'>
			<div className='panel-container'>
				<RaceControlPanel />
				{winner && raceFinished && <WinnerBanner />}
				<CarCreationPanel selectedCarId={selectedCarId} />
				<div className='generation-panel'>
					<Button
						title='GENERATE'
						onClick={handleGenerateCars}
						disabled={isRacing}
					/>
				</div>
			</div>
			<GarageSection onSelectCar={handleSelectCar} />
		</div>
	);
}

export default Garage;
