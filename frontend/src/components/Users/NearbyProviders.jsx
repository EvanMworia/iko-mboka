// src/pages/NearbyProviders.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../Reusable/Navbar';
import ProviderCard from '../ServiceProviders/ProviderCard';
import { useNavigate } from 'react-router-dom';

const NearbyProviders = () => {
	const [services, setServices] = useState([]);
	const [selectedServiceId, setSelectedServiceId] = useState('');
	const [providers, setProviders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	useEffect(() => {
		const fetchServices = async () => {
			try {
				const res = await fetch('http://localhost:5000/services/all');
				const data = await res.json();
				setServices(data);
			} catch (err) {
				console.error('Error fetching services:', err);
				setError('Failed to load services.');
			}
		};
		fetchServices();
	}, []);

	const handleServiceChange = async (e) => {
		const serviceId = e.target.value;
		setSelectedServiceId(serviceId);
		setProviders([]);
		setError('');

		if (!serviceId) return;

		const lat = localStorage.getItem('Latitude');
		const lng = localStorage.getItem('Longitude');
		const radius = 5;

		if (!lat || !lng) {
			setError('Your location is missing in local storage.');
			return;
		}

		try {
			setLoading(true);
			const response = await fetch('http://localhost:5000/providers/near-me/by/service', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					Latitude: lat,
					Longitude: lng,
					RadiusKm: radius,
					ServiceId: parseInt(serviceId),
				}),
			});

			if (!response.ok) throw new Error('Failed to fetch providers');

			const data = await response.json();
			setProviders(data);
		} catch (err) {
			console.error('Error fetching providers:', err);
			setError('Failed to load providers near you.');
		} finally {
			setLoading(false);
		}
	};

	// When a provider card is clicked
	const handleProviderClick = (provider) => {
		//alert(`You clicked on ${provider.FullName}`);
		navigate(`/provider-details/${provider.ProviderId}`);
		// You could also navigate to /providers/:id or open a modal here
	};

	return (
		<>
			<Navbar />
			<div className='mt-4 p-4 max-w-3xl mx-auto bg-white shadow rounded-lg'>
				<h2 className='text-xl font-bold mb-4 text-gray-800'>Find Service Providers Near You</h2>

				<select
					className='w-full p-2 border rounded mb-4 bg-gray-50 focus:outline-none focus:ring focus:ring-green-200'
					value={selectedServiceId}
					onChange={handleServiceChange}
				>
					<option value=''>Select a Service</option>
					{services.map((service) => (
						<option key={service.ServiceId} value={service.ServiceId}>
							{service.ServiceName}
						</option>
					))}
				</select>

				{loading && <p className='text-gray-500'>Loading providers...</p>}
				{error && <p className='text-red-500'>{error}</p>}

				{!loading && providers.length > 0 && (
					<div className='grid sm:grid-cols-2 gap-4 mt-4'>
						{providers.map((prov) => (
							<ProviderCard key={prov.ProviderId} provider={prov} onClick={handleProviderClick} />
						))}
					</div>
				)}

				{!loading && !providers.length && selectedServiceId && !error && (
					<p className='text-gray-500'>No providers found near your location.</p>
				)}
			</div>
		</>
	);
};

export default NearbyProviders;
