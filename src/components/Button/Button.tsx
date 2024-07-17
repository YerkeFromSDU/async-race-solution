import React from 'react';

export interface IButtonProps {
	title: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
const Button: React.FC<IButtonProps> = ({ title, onClick }) => {
	const styles = {
		height: 25,
		fontSize: 12,
		backgroundColor: 'transparent',
		border: '1px solid #00ff00',
		borderRadius: 10,
		color: '#ffffff',
		cursor: 'pointer',
		boxShadow: '0 0 5px #00ff00, 0 0 5px #00ff00, 0 0 5px #00ff00',
	};
	return (
		<button style={styles} type='button' onClick={onClick}>
			{title}
		</button>
	);
};

Button.defaultProps = {
	onClick: () => {},
};

export default Button;
