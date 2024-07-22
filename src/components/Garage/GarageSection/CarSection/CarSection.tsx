import * as React from 'react';
import { useState } from 'react';
// import Button from '../../../Button/Button.tsx';
import CarControlPanel from './CarControlPanel.tsx';
import './CarContolPanel.css';

interface CarSectionProps {
	onSelectCar: (id: number) => void;
	car: { id: number; name: string; color: string };
}
const CarSection: React.FC<CarSectionProps> = ({ onSelectCar, car }) => {
	const [isDriving, setIsDriving] = useState(false);
	const [carStyle, setCarStyle] = useState<{ animationDuration?: string }>({});
	const handleSelect = () => {
		onSelectCar(car.id);
	};
	const handleStartDriving = (style: { animationDuration?: string }) => {
		setIsDriving(true);
		setCarStyle(style);
	};

	const handleStopDriving = () => {
		setIsDriving(false);
		setCarStyle({});
	};
	return (
		<div
			className='car-card'
			style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'row',
				margin: '20px 5px',
			}}
		>
			<CarControlPanel
				carId={car.id}
				onSelect={handleSelect}
				onStartDriving={handleStartDriving}
				onStopDriving={handleStopDriving}
			/>
			<div
				className={`car-line ${isDriving ? 'driving' : ''}`}
				style={{ display: 'flex', flexDirection: 'row' }}
			>
				<svg
					height='60px'
					width='80px'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 17.485 17.485'
					style={carStyle}
				>
					<g fill={car.color}>
						<path d='M17.477,8.149c-0.079-0.739-3.976-0.581-3.976-0.581L11.853,5.23H4.275L3.168,7.567H0v2.404l2.029,0.682c0.123-0.836,0.843-1.48,1.711-1.48c0.939,0,1.704,0.751,1.73,1.685l6.62,0.041c0.004-0.951,0.779-1.726,1.733-1.726c0.854,0,1.563,0.623,1.704,1.439l1.479-0.17C17.006,10.442,17.556,8.887,17.477,8.149z M4.007,7.568l0.746-1.771h2.864l0.471,1.771H4.007z M8.484,7.568L8.01,5.797h3.67l1.137,1.771H8.484z' />
						<circle cx='3.759' cy='10.966' r='1.289' />
						<circle cx='13.827' cy='10.9' r='1.29' />
					</g>
				</svg>
				<p style={{ color: '#ffffff' }}>{car.name}</p>
			</div>
		</div>
	);
};
export default CarSection;
