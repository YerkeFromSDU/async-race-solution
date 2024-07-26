import * as React from 'react';
import WinnerSection from './WinnerSecton/WinnerSection.tsx';

function Winner() {
	return (
		<div
			style={{ width: '80%', margin: 'auto', color: 'white' }}
			className='winner-main-container'
		>
			<h2 style={{ fontFamily: 'Beon', fontSize: 40, marginBottom: 20 }}>
				WINNERS
			</h2>
			<WinnerSection />
		</div>
	);
}

export default Winner;
