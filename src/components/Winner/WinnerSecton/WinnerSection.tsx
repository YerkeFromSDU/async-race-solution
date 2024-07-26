import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; //eslint-disable-line
import { RootState, AppDispatch } from '../../../store/store.ts';
import { fetchWinners } from '../../../store/winnerSlice.ts';
import Pagination from '../../Pagination/Pagination.tsx';
import './WinnerSection.css';

function WinnerSection() {
	const dispatch = useDispatch<AppDispatch>();
	const {
		items: winners,
		status,
		error,
	} = useSelector((state: RootState) => state.winners);
	const cars = useSelector((state: RootState) => state.cars.cars);
	const [currentPage, setCurrentPage] = useState(1);
	const n = 10;
	const [winnersPerPage] = useState(n);

	const indexOfLastWinner = currentPage * winnersPerPage;
	const indexOfFirstWinner = indexOfLastWinner - winnersPerPage;
	const currentWinners = winners.slice(indexOfFirstWinner, indexOfLastWinner);
	const handlePageChange = (newPageNumber: number) => {
		setCurrentPage(newPageNumber);
	};
	function winnerName(id: number): string {
		let name: string = '';
		for (const car of cars) { //eslint-disable-line 
			if (id === car.id) {
				name = car.name;
				break;
			}
		}
		return name;
	}
	function winnerColor(id: number): string {
		let color: string = '';
		for (const car of cars) { //eslint-disable-line 
			if (id === car.id) {
				color = car.color;
				break;
			}
		}
		return color;
	}
	useEffect(() => {
		if (status === 'idle') {
			dispatch(fetchWinners());
		} else {
			console.log(error);
		}
	}, [status, dispatch, error]);

	return (
		<>
			<div className='winner-table-container'>
				<table>
					<tr className='winner-head'>
						<th>#</th>
						<th>Car</th>
						<th>Name</th>
						<th>Wins</th>
						<th>Best Time</th>
					</tr>
					{currentWinners.map((winner, index) => (
						<tr key={winner.id}>
							<td>{index + 1}</td>
							<td>
								<svg
									height='60px'
									width='80px'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 17.485 17.485'
								>
									<g fill={winnerColor(winner.id)}>
										<path d='M17.477,8.149c-0.079-0.739-3.976-0.581-3.976-0.581L11.853,5.23H4.275L3.168,7.567H0v2.404l2.029,0.682c0.123-0.836,0.843-1.48,1.711-1.48c0.939,0,1.704,0.751,1.73,1.685l6.62,0.041c0.004-0.951,0.779-1.726,1.733-1.726c0.854,0,1.563,0.623,1.704,1.439l1.479-0.17C17.006,10.442,17.556,8.887,17.477,8.149z M4.007,7.568l0.746-1.771h2.864l0.471,1.771H4.007z M8.484,7.568L8.01,5.797h3.67l1.137,1.771H8.484z' />
										<circle cx='3.759' cy='10.966' r='1.289' />
										<circle cx='13.827' cy='10.9' r='1.29' />
									</g>
								</svg>
							</td>
							<td>{winnerName(winner.id)}</td>
							<td>{winner.wins}</td>
							<td>{winner.time}</td>
						</tr>
					))}
				</table>
			</div>
			<Pagination
				totalItems={winners.length}
				itemsPerPage={winnersPerPage}
				currentPage={currentPage}
				onPageChange={handlePageChange}
			/>
		</>
	);
}

export default WinnerSection;
