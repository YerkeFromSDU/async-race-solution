import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; //eslint-disable-line
import { RootState, AppDispatch } from '../../../store/store.ts';
import { fetchCars } from '../../../store/carSlice.ts';
import CarSection from './CarSection/CarSection.tsx';
import Pagination from '../../Pagination/Pagination.tsx';
import EmptyList from '../../EmptyList/EmptyList.tsx';
import { setPageNumber } from '../../../store/viewSlice.ts';
import './GarageSection.css';

interface GarageSectionProps {
	onSelectCar: (id: number) => void;
}
const GarageSection: React.FC<GarageSectionProps> = ({ onSelectCar }) => {
	const dispatch = useDispatch<AppDispatch>();
	const loading = useSelector((state: RootState) => state.cars.loading);
	const cars = useSelector((state: RootState) => state.cars.cars);
	const pageNumber = useSelector((state: RootState) => state.view.pageNumber);
	const itemsPerPage = 7;

	useEffect(() => {
		dispatch(fetchCars());
	}, [dispatch]);

	const indexOfLastCar = pageNumber * itemsPerPage;
	const indexOfFirstCar = indexOfLastCar - itemsPerPage;
	const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

	const handlePageChange = (newPageNumber: number) => {
		dispatch(setPageNumber(newPageNumber));
	};

	return (
		<>
			<div className='cars-list' style={{ margin: '30px 0' }}>
				{loading && (
					<div className='loading-spinner'>
						<div className='spinner' />
						<p>Preparing the cars...</p>
					</div>
				)}

				{cars.length === 0 ? (
					<EmptyList />
				) : (
					currentCars.map((car) => (
						<CarSection key={car.id} onSelectCar={onSelectCar} car={car} />
					))
				)}
			</div>
			<Pagination
				totalItems={cars.length}
				itemsPerPage={itemsPerPage}
				currentPage={pageNumber}
				onPageChange={handlePageChange}
			/>
		</>
	);
};
export default GarageSection;
