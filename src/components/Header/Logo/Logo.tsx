import * as React from 'react';

export default function Logo() {
	const style = {
		width: 400,
		height: 'auto',
		margin: 'auto',
	};
	return (
		<div>
			<img style={style} src='/logoCar.png' alt='logo' />
		</div>
	);
}
