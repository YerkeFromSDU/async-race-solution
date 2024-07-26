import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; //eslint-disable-line
import { AppDispatch, RootState } from '../../../../store/store.ts';
import {
	createCar,
	updateCar,
	fetchCarById,
} from '../../../../store/carSlice.ts';
import Button from '../../../Button/Button.tsx';
import '../../Garage.css';
import { setInputValue } from '../../../../store/viewSlice.ts';

interface CarCreationPanelProps {
	selectedCarId: number | null;
}
const CarCreationPanel: React.FC<CarCreationPanelProps> = ({
	selectedCarId,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const currentCar = useSelector((state: RootState) => state.cars.currentCar);
	const inputValues = useSelector((state: RootState) => state.view.inputValues);
	const isRacing = useSelector((state: RootState) => state.cars.isRacing);

	useEffect(() => {
		if (selectedCarId) {
			dispatch(fetchCarById(selectedCarId));
		} else {
			dispatch(
				setInputValue({ key: 'createName', value: inputValues.createName })
			);
			dispatch(
				setInputValue({ key: 'createColor', value: inputValues.createColor })
			);
		}
	}, [
		selectedCarId,
		dispatch,
		inputValues.createColor,
		inputValues.createName,
	]);

	useEffect(() => {
		if (currentCar && selectedCarId !== null) {
			dispatch(setInputValue({ key: 'updateName', value: currentCar.name }));
			dispatch(setInputValue({ key: 'updateColor', value: currentCar.color }));
		}
	}, [currentCar, selectedCarId, dispatch]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setInputValue({ key: e.target.name, value: e.target.value }));
	};
	const handleCreateClick = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		dispatch(
			createCar({
				name: inputValues.createName,
				color: inputValues.createColor,
			})
		);
		dispatch(setInputValue({ key: 'createName', value: '' }));
		dispatch(setInputValue({ key: 'createColor', value: '#000000' }));
	};

	const handleUpdateClick = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		if (selectedCarId) {
			dispatch(
				updateCar({
					id: selectedCarId,
					name: inputValues.updateName,
					color: inputValues.updateColor,
				})
			);
			dispatch(setInputValue({ key: 'updateName', value: '' }));
			dispatch(setInputValue({ key: 'updateColor', value: '#000000' }));
		}
	};

	return (
		<>
			<div className='create-panel'>
				<form action=''>
					<input
						style={{ paddingLeft: 10, width: 150 }}
						type='text'
						name='createName'
						value={inputValues.createName || ''}
						onChange={handleInputChange}
						placeholder='Car name'
					/>
					<input
						type='color'
						name='createColor'
						value={inputValues.createColor || '#000000'}
						onChange={handleInputChange}
					/>
					<Button
						title='CREATE'
						onClick={handleCreateClick}
						disabled={isRacing}
					/>
				</form>
			</div>
			<div className='update-panel'>
				<form>
					<input
						style={{ paddingLeft: 10, width: 150 }}
						type='text'
						name='updateName'
						value={inputValues.updateName || ''}
						onChange={handleInputChange}
						placeholder='Car name'
					/>
					<input
						type='color'
						name='updateColor'
						value={inputValues.updateColor || '#000000'}
						onChange={handleInputChange}
					/>
					<Button
						title='UPDATE'
						onClick={handleUpdateClick}
						disabled={isRacing}
					/>
				</form>
			</div>
		</>
	);
};
export default CarCreationPanel;
