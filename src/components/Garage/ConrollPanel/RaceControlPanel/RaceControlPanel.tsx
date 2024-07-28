import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; //eslint-disable-line
import { AppDispatch, RootState } from '../../../../store/store.ts';
import { startRace, resetRace } from '../../../../store/carSlice.ts';
import Button from '../../../Button/Button.tsx';

const RaceControlPanel = () => {
	const dispatch = useDispatch<AppDispatch>();
	const loading = useSelector((state: RootState) => state.cars.loading);
	const handleRace = () => {
		dispatch(startRace());
	};

	const handleReset = () => {
		dispatch(resetRace());
	};
	return (
		<div className='control-panel'>
			<Button title='RACE' onClick={handleRace} />
			<Button title='RESET' onClick={handleReset} disabled={loading} />
		</div>
	);
};
export default RaceControlPanel;
