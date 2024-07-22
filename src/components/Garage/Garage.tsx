import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux'; //eslint-disable-line
import { AppDispatch } from '../../store/store.ts';
import RaceControlPanel from './ConrollPanel/RaceControlPanel/RaceControlPanel.tsx';
import CarCreationPanel from './ConrollPanel/CarCreationPanel/CarCreationPanel.tsx';
import GarageSection from './GarageSection/GarageSection.tsx';
import { generateCars } from '../../store/carSlice.ts';
import Button from '../Button/Button.tsx';
import './Garage.css';

function Garage() {
	const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	// const [isRacing, setIsRacing] = useState(false);

	const handleSelectCar = (id: number) => {
		setSelectedCarId(id);
	};
	const handleGenerateCars = () => {
		dispatch(generateCars());
	};

	// const handleRace = () => {
	// 	// setIsRacing(true);
	// 	dispatch(startRace() as any); //eslint-disable-line
	// };

	// const handleReset = () => {
	// 	// setIsRacing(false);
	// 	dispatch(resetRace() as any); //eslint-disable-line
	// 	// Logic to reset all cars
	// };
	return (
		<div className='garage-container'>
			<div className='panel-container'>
				<RaceControlPanel />
				<CarCreationPanel selectedCarId={selectedCarId} />
				<div className='generation-panel'>
					<Button title='GENERATE' onClick={handleGenerateCars} />
				</div>
			</div>
			<GarageSection onSelectCar={handleSelectCar} />
		</div>
	);
}

export default Garage;
