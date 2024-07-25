import React from 'react';
import { useSelector } from 'react-redux'; //eslint-disable-line
import { RootState } from '../../store/store.ts';

const WinnerBanner = () => {
	const winner = useSelector((state: RootState) => state.cars.winner);
	const raceFinished = useSelector(
		(state: RootState) => state.cars.raceFinished
	);

	if (!raceFinished || !winner) return null;

	return (
		<div
			style={{
				position: 'fixed',
				backgroundColor: '#ffffff',
				color: 'black',
				textAlign: 'center',
				padding: '10px',
				zIndex: 1000,
				inset: 0,
				width: '12rem',
				height: '10rem',
				maxWidth: '100vw',
				maxHeight: '100dvh',
				margin: 'auto',
			}}
		>
			<h2>Winner!</h2>
			<h3>{winner.name}</h3>
			<p>Time: {winner.finishTime}</p>
		</div>
	);
};

export default WinnerBanner;
