import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'; //eslint-disable-line
import { AppDispatch } from '../../../../store/store.ts';
import { startRace, resetRace } from '../../../../store/carSlice.ts';
import Button from '../../../Button/Button.tsx';

const RaceControlPanel = () => {
	const dispatch = useDispatch<AppDispatch>();
	const handleRace = () => {
		dispatch(startRace());
	};

	const handleReset = () => {
		dispatch(resetRace());
	};
	return (
		<div className='control-panel'>
			<Button title='RACE' onClick={handleRace} />
			<Button title='RESET' onClick={handleReset} />
		</div>
	);
};
export default RaceControlPanel;
