import { Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './components/LandingPage/Index';
import RegisterService from './components/ServiceProviders/RegisterService';
import SelectService from './components/Users/SelectService';
import NearbyProviders from './components/Users/NearbyProviders';
import ProviderDetails from './components/ServiceProviders/ProviderDetails';

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Index />} />
				<Route path='/register-service' element={<RegisterService />} />
				<Route path='/select-service' element={<SelectService />} />
				<Route path='/providers-near-me' element={<NearbyProviders />} />
				<Route path='/provider-details/:id' element={<ProviderDetails />} />
			</Routes>
		</>
	);
}

export default App;
