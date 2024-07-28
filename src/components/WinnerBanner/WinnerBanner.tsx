import React from 'react';
import { useSelector } from 'react-redux'; //eslint-disable-line
import { RootState } from '../../store/store.ts';
import './WinnerBanner.css';

const WinnerBanner = () => {
	const winner = useSelector((state: RootState) => state.cars.winner);
	const raceFinished = useSelector(
		(state: RootState) => state.cars.raceFinished
	);

	if (!raceFinished || !winner) return null;
	const finishTime = winner.finishTime.toFixed(2);
	return (
		<div className='winner-banner'>
			<h2>Winner!</h2>
			<h2>{`>>> ${winner.name} <<<`}</h2>
			<h2>Time: {finishTime} seconds</h2>
		</div>
	);
};

export default WinnerBanner;
