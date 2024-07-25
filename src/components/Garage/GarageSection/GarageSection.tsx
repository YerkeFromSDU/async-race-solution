import * as React from 'react';
// import Button from '../../Button/Button.tsx';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; //eslint-disable-line
import { RootState, AppDispatch } from '../../../store/store.ts';
import { fetchCars } from '../../../store/carSlice.ts';
import CarSection from './CarSection/CarSection.tsx';

interface GarageSectionProps {
	onSelectCar: (id: number) => void;
}
const GarageSection: React.FC<GarageSectionProps> = ({ onSelectCar }) => {
	const dispatch = useDispatch<AppDispatch>();
	const cars = useSelector((state: RootState) => state.cars.cars);
	// const isRacing = useSelector((state: RootState) => state.cars.isRacing);
	const [currentPage, setCurrentPage] = useState(1); // Current page number
	const n = 7;
	const [carsPerPage] = useState(n);
	useEffect(() => {
		dispatch(fetchCars());
	}, [dispatch]);
	const indexOfLastCar = currentPage * carsPerPage;
	const indexOfFirstCar = indexOfLastCar - carsPerPage;
	const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);
	return (
		<>
			<div className='cars-list'>
				{currentCars.map((car) => (
					<CarSection
						key={car.id}
						onSelectCar={onSelectCar}
						car={car}
						// isRacing={isRacing}
					/>
				))}
			</div>

			<ul
				className='pagination'
				style={{
					listStyleType: 'none',
					display: 'flex',
					padding: 0,
				}}
			>
				{Array.from({ length: Math.ceil(cars.length / carsPerPage) }).map(
					(_, index) => (
						<li
							style={{
								alignSelf: 'center',
							}}
							key={`page-${index + 1}`}
							className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
						>
							<button
								style={{
									marginRight: 10,
									color: '#ffffff',
									backgroundColor: 'transparent',
									border: '1px solid #ff00ff',
									borderRadius: 3,
									boxShadow:
										'0 0 5px #ff00ff, 0 0 5px #ff00ff, 0 0 5px #ff00ff',
								}}
								type='button'
								onClick={() => paginate(index + 1)}
								className='page-link'
							>
								{index + 1}
							</button>
						</li>
					)
				)}
			</ul>
		</>
	);
};
export default GarageSection;
