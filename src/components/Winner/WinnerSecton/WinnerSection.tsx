import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; //eslint-disable-line
import { RootState, AppDispatch } from '../../../store/store.ts';
import { fetchWinners } from '../../../store/winnerSlice.ts';
import { fetchCars } from '../../../store/carSlice.ts';
import Pagination from '../../Pagination/Pagination.tsx';
import './WinnerSection.css';

function WinnerSection() {
	const dispatch = useDispatch<AppDispatch>();
	const {
		items: winners,
		status,
		error,
	} = useSelector((state: RootState) => state.winners);
	// const cars = useSelector((state: RootState) => state.cars.cars);
	const [currentPage, setCurrentPage] = useState(1);
	const n = 10;
	const [winnersPerPage] = useState(n);

	const indexOfLastWinner = currentPage * winnersPerPage;
	const indexOfFirstWinner = indexOfLastWinner - winnersPerPage;
	const currentWinners = winners.slice(indexOfFirstWinner, indexOfLastWinner);

	const handlePageChange = (newPageNumber: number) => {
		setCurrentPage(newPageNumber);
	};
	// function winnerName(id: number): string {
	// 	let name: string = '';
	// 	for (const car of cars) { //eslint-disable-line
	// 		if (id === car.id) {
	// 			name = car.name;
	// 			break;
	// 		}
	// 	}
	// 	return name;
	// }
	// function winnerColor(id: number): string {
	// 	let color: string = '';
	// 	for (const car of cars) { //eslint-disable-line
	// 		if (id === car.id) {
	// 			color = car.color;
	// 			break;
	// 		}
	// 	}
	// 	return color;
	// }
	useEffect(() => {
		if (status === 'idle') {
			dispatch(fetchCars());
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
					{currentWinners.map((winner) => (
						<tr key={winner.id}>
							<td>{winner.id}</td>
							<td>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									version='1.1'
									height='60px'
									width='80px'
									viewBox='0 0 110 80'
								>
									<g
										fill={winner.color || '#ffffff'}
										transform='scale(-1, 1) translate(-100, 0)'
									>
										<path d='M19.927,50.263c-4.312,0-7.818,3.507-7.818,7.817c0,4.312,3.507,7.819,7.818,7.819s7.819-3.508,7.819-7.819  C27.746,53.77,24.239,50.263,19.927,50.263z M19.927,64.898c-3.76,0-6.818-3.061-6.818-6.818c0-3.76,3.059-6.818,6.818-6.818  c3.761,0,6.819,3.059,6.819,6.818C26.746,61.838,23.688,64.898,19.927,64.898z' />
										<path d='M19.927,52.592c-3.026,0-5.489,2.463-5.489,5.488c0,3.027,2.463,5.49,5.489,5.49c3.027,0,5.49-2.463,5.49-5.49  C25.417,55.055,22.954,52.592,19.927,52.592z M19.927,62.569c-2.476,0-4.489-2.015-4.489-4.489c0-2.476,2.014-4.489,4.489-4.489  c2.477,0,4.49,2.014,4.49,4.489C24.417,60.555,22.403,62.569,19.927,62.569z' />
										<path d='M75.354,50.263c-4.312,0-7.819,3.507-7.819,7.817c0,4.312,3.508,7.819,7.819,7.819s7.819-3.508,7.819-7.819  C83.173,53.77,79.665,50.263,75.354,50.263z M75.354,64.898c-3.759,0-6.819-3.061-6.819-6.818c0-3.76,3.059-6.818,6.819-6.818  c3.76,0,6.819,3.059,6.819,6.818C82.173,61.838,79.112,64.898,75.354,64.898z' />
										<path d='M75.354,52.591c-3.028,0-5.491,2.463-5.491,5.489c0,3.028,2.463,5.492,5.491,5.492s5.491-2.464,5.491-5.492  C80.845,55.054,78.382,52.591,75.354,52.591z M75.354,62.572c-2.476,0-4.491-2.016-4.491-4.492c0-2.476,2.014-4.49,4.491-4.49  s4.491,2.015,4.491,4.49S77.829,62.572,75.354,62.572z' />
										<path d='M99.003,55.617c0.001-0.001,0.002-0.002,0.002-0.003c0.026-0.061,0.041-0.126,0.041-0.196c0-0.849-0.315-1.7-0.826-2.524  c-0.026-0.063-0.066-0.118-0.115-0.165c-0.702-1.072-1.72-2.093-2.81-2.996l2.21-2.79c0.069-0.089,0.107-0.198,0.107-0.311V44.94  c0-0.152-0.068-0.296-0.188-0.391c-0.119-0.095-0.274-0.131-0.424-0.096l-7.229,1.647c-17.031-9.911-29.774-12-37.475-12  c-4.423,0-6.771,0.699-6.87,0.729c-0.011,0.003-0.02,0.011-0.029,0.015c-0.017,0.006-0.031,0.015-0.047,0.022  c-0.021,0.011-0.044,0.017-0.063,0.031l-12.257,8.516l-25.862,2.59c-0.173,0.018-0.326,0.125-0.4,0.282L3.61,52.892  c0,0.001-0.001,0.002-0.001,0.003l-0.216,0.451l-2.26,1.879c-0.006,0.006-0.009,0.014-0.015,0.02  c-0.033,0.03-0.057,0.067-0.081,0.105c-0.013,0.02-0.029,0.036-0.039,0.058c-0.026,0.06-0.041,0.124-0.043,0.192  c0,0.004-0.002,0.007-0.002,0.01v6.379c0,0.276,0.224,0.5,0.5,0.5h8.72c0.122,0,0.24-0.045,0.332-0.126l1.332-1.181  c0.149-0.132,0.206-0.339,0.145-0.528c-0.27-0.829-0.405-1.696-0.405-2.575c0-0.749,0.108-1.471,0.294-2.162  c0.067-0.085,0.114-0.188,0.114-0.306c0-0.023-0.011-0.043-0.014-0.064c1.075-3.369,4.232-5.817,7.951-5.817  c4.606,0,8.354,3.746,8.354,8.35c0,1.105-0.213,2.179-0.631,3.189c-0.064,0.155-0.049,0.331,0.046,0.471  c0.094,0.141,0.243,0.234,0.42,0.221l38.893-0.444c0.162-0.002,0.312-0.081,0.403-0.213c0.093-0.132,0.117-0.302,0.063-0.453  c-0.313-0.888-0.471-1.82-0.471-2.769c0-4.605,3.744-8.352,8.348-8.352c4.607,0,8.354,3.747,8.354,8.352  c0,0.453-0.037,0.907-0.109,1.354c-0.023,0.145,0.018,0.292,0.113,0.404c0.094,0.111,0.234,0.176,0.381,0.176l10.164,0.003  c0.129,0,0.252-0.05,0.344-0.14l4.295-4.099c0,0,0-0.001,0.001-0.001C98.938,55.732,98.977,55.678,99.003,55.617z M97.985,54.918  h-5.074l0.78-1.33h3.775C97.727,54.035,97.903,54.48,97.985,54.918z M96.613,46.458l-2.1,2.651c-1.281-0.978-2.553-1.77-3.434-2.281  l5.533-1.261V46.458z M37.364,44.392l-2.954-0.716l10.664-7.409v1.035L37.364,44.392z M4.117,54.045  c0.055-0.047,0.1-0.105,0.131-0.17l0.138-0.287h2.521l0.74,1.522H2.836L4.117,54.045z M10.603,57.58H1.954v-1.47h8.835  C10.687,56.588,10.629,57.079,10.603,57.58z M9.984,61.488h-8.03V58.58h8.657c0.038,0.7,0.132,1.395,0.323,2.066L9.984,61.488z   M19.923,48.729c-4.115,0-7.61,2.679-8.854,6.382h-2.31l-1.09-2.241c-0.084-0.172-0.259-0.281-0.45-0.281H4.863l2.685-5.617  l25.628-2.565l2.883,0.699l-2.161,1.08c-0.169,0.084-0.276,0.258-0.276,0.447v12.02l-4.403,0.193c0.021-0.256,0.06-0.508,0.06-0.767  C29.277,52.923,25.081,48.729,19.923,48.729z M75.351,48.729c-5.154,0-9.348,4.195-9.348,9.351c0,0.83,0.108,1.649,0.322,2.442  l-37.497,0.429c0.115-0.358,0.189-0.728,0.261-1.098l29-1.271c0.186-0.01,0.351-0.117,0.431-0.285l4.426-9.234  c0.032-0.068,0.049-0.141,0.049-0.216v-2.626h11.864c0.775,0,3.336-0.098,3.711-1.362c0.307-1.037-0.998-2.026-2.006-2.68  c-2.207-1.432-6.765-2.778-11.644-3.745c-0.007-0.003-0.012-0.009-0.02-0.011c-0.033-0.011-0.067-0.008-0.101-0.012  c-0.704-0.138-1.411-0.268-2.122-0.39c-0.009-0.003-0.015-0.01-0.023-0.013c-0.041-0.013-0.083-0.011-0.124-0.013  c-3.759-0.636-7.516-1.024-10.375-1.024c-0.536,0-1.027,0.018-1.498,0.042c-0.015,0-0.028,0.001-0.043,0.002  c-0.892,0.049-1.675,0.14-2.313,0.279c-0.091,0.02-0.175,0.065-0.241,0.13l-8.17,7.938c-0.146,0.141-0.19,0.358-0.114,0.546  s0.259,0.312,0.463,0.312h21.757v2.512l-4.246,8.862l-23.128,1.013V46.941l3.107-1.553c0.021-0.011,0.034-0.029,0.054-0.042  c0.02-0.014,0.043-0.021,0.061-0.038l8.069-7.419c0.103-0.095,0.162-0.228,0.162-0.368v-1.824c0.79-0.186,2.91-0.596,6.226-0.596  c7.595,0,20.194,2.073,37.12,11.946c0.009,0.006,0.017,0.01,0.025,0.015s0.017,0.009,0.024,0.014  c1.707,0.88,5.357,3.126,7.299,5.512h-3.363c-0.178,0-0.342,0.094-0.432,0.246l-1.223,2.084h-7.609  C82.841,51.315,79.396,48.729,75.351,48.729z M48.132,45.221l2.863-7.226c0.367-0.015,0.75-0.024,1.159-0.024  c2.854,0,6.3,0.348,9.71,0.907l-1.95,6.343H48.132z M41.47,45.221l7.183-6.978c0.363-0.073,0.784-0.128,1.238-0.172l-2.834,7.15  H41.47z M62.857,39.048c0.414,0.073,0.827,0.146,1.236,0.225l-1.96,5.948h-1.176L62.857,39.048z M76.018,43.018  c1.702,1.104,1.594,1.553,1.593,1.557c-0.1,0.331-1.436,0.645-2.752,0.646H63.186l1.896-5.75  C69.805,40.437,74.056,41.745,76.018,43.018z M94.052,59.018l-9.395-0.003c0.031-0.312,0.047-0.623,0.047-0.935  c0-0.745-0.097-1.467-0.263-2.162h12.859L94.052,59.018z' />
									</g>
								</svg>
							</td>
							<td>{winner.name}</td>
							<td>{winner.wins}</td>
							{/* eslint-disable-next-line */}
							<td>{winner.time.toFixed(2)} seconds</td>
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
