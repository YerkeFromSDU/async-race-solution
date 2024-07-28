import React from 'react';

const EmptyList = () => (
	<div
		className='empty-list'
		style={{
			color: 'white',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: '40vh',
		}}
	>
		<p>No cars available.</p>
		<br />
		<p>Try to refresh the page. Or add some cars to the list!</p>
	</div>
);

export default EmptyList;
