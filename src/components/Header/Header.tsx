import * as React from 'react';
import { useNavigate } from 'react-router-dom';
// import Button from '../Button/Button.tsx';
import Logo from './Logo/Logo.tsx';
import './Header.css';

export interface HeaderProps {}

export default function Header() {
	const navigate = useNavigate();
	const handleNavToGarage = () => navigate('/garage');
	const handleNavToWinner = () => navigate('/winner');
	return (
		<div className='header-container'>
			<div className='routes'>
				<button
					className='routes-buttons'
					type='button'
					onClick={handleNavToGarage}
				>
					GARAGE
				</button>
				<button
					className='routes-buttons'
					type='button'
					onClick={handleNavToWinner}
				>
					WINNER
				</button>
			</div>
			<div className='logo'>
				<Logo />
			</div>
		</div>
	);
}
