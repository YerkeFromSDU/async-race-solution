import * as React from 'react';
import Button from '../../../Button/Button.tsx';

const RaceControlPanel = () => {
	const handleClick = () => {
		console.log('Button clicked');
		// Additional logic here if needed
	};
	return (
		<div className='control-panel'>
			<Button title='RACE' onClick={handleClick} />
			<Button title='RESET' onClick={handleClick} />
		</div>
	);
};
export default RaceControlPanel;
