import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import Button from './components/Button/Button.tsx';
import Header from './components/Header/Header.tsx';
import Garage from './components/Garage/Garage.tsx';
import Winner from './components/Winner/Winner.tsx';
import './App.css';

function App() {
	return (
		<div className='background-container'>
			<Header />
			<Routes>
				<Route path='/garage' element={<Garage />} />
				<Route path='/winner' element={<Winner />} />
			</Routes>
		</div>
	);
}

export default App;
