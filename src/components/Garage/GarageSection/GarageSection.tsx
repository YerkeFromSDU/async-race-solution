import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; //eslint-disable-line
import { RootState, AppDispatch } from '../../../store/store.ts';
import { fetchCars } from '../../../store/carSlice.ts';
import CarSection from './CarSection/CarSection.tsx';
import Pagination from '../../Pagination/Pagination.tsx';

interface GarageSectionProps {
	onSelectCar: (id: number) => void;
}
const GarageSection: React.FC<GarageSectionProps> = ({ onSelectCar }) => {
	const dispatch = useDispatch<AppDispatch>();
	const cars = useSelector((state: RootState) => state.cars.cars);
	const [currentPage, setCurrentPage] = useState(1);
	const n = 7;
	const [carsPerPage] = useState(n);
	useEffect(() => {
		dispatch(fetchCars());
	}, [dispatch]);

	const indexOfLastCar = currentPage * carsPerPage;
	const indexOfFirstCar = indexOfLastCar - carsPerPage;
	const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
	const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<>
			<div className='cars-list' style={{ margin: '30px 0' }}>
				{currentCars.map((car) => (
					<CarSection key={car.id} onSelectCar={onSelectCar} car={car} />
				))}
			</div>
			<Pagination
				totalItems={cars.length}
				itemsPerPage={carsPerPage}
				currentPage={currentPage}
				onPageChange={handlePageChange}
			/>
		</>
	);
};
export default GarageSection;
