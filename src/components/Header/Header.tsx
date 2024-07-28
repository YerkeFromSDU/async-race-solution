import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; //eslint-disable-line
import { RootState } from '../../store/store.ts';
import Logo from './Logo/Logo.tsx';
import './Header.css';

export interface HeaderProps {}

export default function Header() {
	const navigate = useNavigate();
	const isRacing = useSelector((state: RootState) => state.cars.isRacing);
	const handleNavToGarage = () => navigate('/');
	const handleNavToWinner = () => navigate('/winner');
	return (
		<div className='header-container'>
			<div className='routes'>
				<button
					className='routes-buttons'
					type='button'
					onClick={handleNavToGarage}
					disabled={isRacing}
				>
					GARAGE
				</button>
				<button
					className='routes-buttons'
					type='button'
					onClick={handleNavToWinner}
					disabled={isRacing}
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
