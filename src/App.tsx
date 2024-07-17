import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import Button from './components/Button/Button.tsx';
import Header from './components/Header/Header.tsx';
import Garage from './components/Garage/Garage.tsx';
import './App.css';

function App() {
	return (
		<div>
			<Header />
			<Routes>
				<Route path='/garage' element={<Garage />} />
				{/* <Route path='/winner' element={}/> */}
			</Routes>
		</div>
	);
}

export default App;
