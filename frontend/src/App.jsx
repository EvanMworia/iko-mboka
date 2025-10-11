import { Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './components/LandingPage/Index';
import RegisterService from './components/ServiceProviders/RegisterService';

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Index />} />
				<Route path='/register-service' element={<RegisterService />} />
			</Routes>
		</>
	);
}

export default App;
