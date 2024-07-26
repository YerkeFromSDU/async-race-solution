import React from 'react';
import './Button.css';

export interface IButtonProps {
	title: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
}
const Button: React.FC<IButtonProps> = ({ title, onClick, disabled }) => {
	const styles = {
		height: 25,
		fontSize: 12,
		backgroundColor: 'transparent',
		border: '1px solid #00ff00',
		borderRadius: 10,
		color: '#ffffff',
		boxShadow: '0 0 5px #00ff00, 0 0 5px #00ff00, 0 0 5px #00ff00',
	};
	return (
		<button
			className='uni-button'
			style={styles}
			type='button'
			onClick={onClick}
			disabled={disabled}
		>
			{title}
		</button>
	);
};

Button.defaultProps = {
	onClick: () => {},
	disabled: false,
};

export default Button;
