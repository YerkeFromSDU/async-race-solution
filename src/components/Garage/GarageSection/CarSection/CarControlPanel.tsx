import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux'; //eslint-disable-line
import { AppDispatch } from '../../../../store/store.ts';
import Button from '../../../Button/Button.tsx';
import { deleteCar, fetchCars } from '../../../../store/carSlice.ts';
import './CarContolPanel.css';

interface CarControlPanelProps {
	carId: number;
	onSelect: () => void;
	onStartDriving: (style: { animationDuration?: string }) => void;
	onStopDriving: () => void;
}

const CarControlPanel: React.FC<CarControlPanelProps> = ({
	carId,
	onSelect,
	onStartDriving,
	onStopDriving,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const [status, setStatus] = useState<'stopped' | 'started' | 'driving'>(
		'stopped'
	);

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
	const handleStartEngine = async () => {
		try {
			const startResponse = await fetch(
				`http://localhost:3000/engine?id=${carId}&status=started`,
				{
					method: 'PATCH',
				}
			);
			const startData = await startResponse.json();
			console.log(startData);
			setStatus('started');

			const { velocity } = startData;
			const { distance } = startData;
			const seconds = 1000;
			const duration = distance / velocity / seconds;
			console.log(duration);
			onStartDriving({ animationDuration: `${duration}s` });
			try {
				const driveResponse = await fetch(
					`http://localhost:3000/engine?id=${carId}&status=drive`,
					{
						method: 'PATCH',
					}
				);
				console.log(driveResponse);
				if (driveResponse.status === 500) { //eslint-disable-line
					setStatus('stopped');
					onStopDriving();
				}
				setStatus('driving');
			} catch (error) {
				setStatus('stopped');
				onStopDriving();
				throw new Error('Failed to drive');
			}
		} catch (error) {
			console.error('Error starting engine:', error);
			setStatus('stopped');
		}
	};

	const handleStopEngine = async () => {
		try {
			await fetch(`http://localhost:3000/engine?id=${carId}&status=stopped`, {
				method: 'PATCH',
			});
			setStatus('stopped');
			onStopDriving();
		} catch (error) {
			console.error('Error stopping engine:', error);
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
				<button
					type='button'
					onClick={handleStartEngine}
					disabled={status === 'driving'}
				>
					A
				</button>
				<button
					type='button'
					onClick={handleStopEngine}
					disabled={status === 'stopped'}
				>
					B
				</button>
			</div>
		</div>
	);
};
export default CarControlPanel;
