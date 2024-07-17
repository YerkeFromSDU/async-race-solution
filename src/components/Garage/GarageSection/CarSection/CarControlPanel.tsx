import * as React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store.ts';
import Button from '../../../Button/Button.tsx';
import { deleteCar, fetchCars } from '../../../../store/carSlice.ts';

interface CarControlPanelProps {
	carId: number;
	onSelect: () => void;
}

const CarControlPanel: React.FC<CarControlPanelProps> = ({
	carId,
	onSelect,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		dispatch(deleteCar(carId))
			.then(() => {
				dispatch(fetchCars());
			})
			.catch((error) => {
				console.error('Failed to delete car:', error);
			});
	};
	const handleClick = (action: string) => {
		if (action === 'select') {
			onSelect();
		} else {
			console.log(`${action} button clicked`);
		}
	};

	return (
		<div
			className='car-card'
			style={{ width: '20%', display: 'flex', flexDirection: 'row' }}
		>
			<div style={{ width: 100, display: 'flex', flexDirection: 'column' }}>
				<Button title='SELECT' onClick={() => handleClick('select')} />
				<Button title='REMOVE' onClick={handleDelete} />
			</div>
			<div style={{ width: 40, display: 'flex', flexDirection: 'column' }}>
				<Button title='A' onClick={() => handleClick('A')} />
				<Button title='B' onClick={() => handleClick('B')} />
			</div>
		</div>
	);
};
export default CarControlPanel;
