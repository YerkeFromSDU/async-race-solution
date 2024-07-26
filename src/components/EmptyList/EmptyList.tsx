import React from 'react';

const EmptyList = () => (
	<div
		className='empty-list'
		style={{
			color: 'white',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '40vh',
		}}
	>
		<p>No cars available. Add some cars to the list!</p>
	</div>
);

export default EmptyList;
