import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store.ts';
import {
	createCar,
	updateCar,
	fetchCarById,
} from '../../../../store/carSlice.ts';
import Button from '../../../Button/Button.tsx';

interface CarCreationPanelProps {
	selectedCarId: number | null;
}
const CarCreationPanel: React.FC<CarCreationPanelProps> = ({
	selectedCarId,
}) => {
	const [createName, setCreateName] = useState('');
	const [createColor, setCreateColor] = useState('#000000');
	const [updateName, setUpdateName] = useState('');
	const [updateColor, setUpdateColor] = useState('#000000');
	const dispatch = useDispatch<AppDispatch>();
	const currentCar = useSelector((state: RootState) => state.cars.currentCar);

	useEffect(() => {
		if (selectedCarId) {
			dispatch(fetchCarById(selectedCarId));
		} else {
			// Reset fields when no car is selected
			setUpdateName('');
			setUpdateColor('#000000');
		}
	}, [selectedCarId, dispatch]);

	useEffect(() => {
		if (currentCar && selectedCarId !== null) {
			setUpdateName(currentCar.name);
			setUpdateColor(currentCar.color);
		}
	}, [currentCar, selectedCarId]);

	const handleCreateClick = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		dispatch(createCar({ name: createName, color: createColor }));
		setCreateName('');
		setCreateColor('#000000');
	};

	const handleUpdateClick = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		if (selectedCarId) {
			dispatch(
				updateCar({ id: selectedCarId, name: updateName, color: updateColor })
			);
			setUpdateName('');
			setUpdateColor('#000000');
		}
	};

	return (
		<>
			<div className='create-panel'>
				<form action=''>
					<input
						type='text'
						value={createName}
						onChange={(e) => setCreateName(e.target.value)}
						placeholder='Car name'
					/>
					<input
						type='color'
						value={createColor}
						onChange={(e) => setCreateColor(e.target.value)}
					/>
					<Button title='CREATE' onClick={handleCreateClick} />
				</form>
			</div>
			<div className='update-panel'>
				<form>
					<input
						type='text'
						value={updateName}
						onChange={(e) => setUpdateName(e.target.value)}
						placeholder='Car name'
					/>
					<input
						type='color'
						value={updateColor}
						onChange={(e) => setUpdateColor(e.target.value)}
					/>
					<Button title='UPDATE' onClick={handleUpdateClick} />
				</form>
			</div>
		</>
	);
};
export default CarCreationPanel;
