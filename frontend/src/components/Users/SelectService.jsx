import { useEffect } from 'react';
import { useState } from 'react';

const SelectService = () => {
	const [services, setServices] = useState([]);
	useEffect(() => {
		const fetchServices = async () => {
			const response = await fetch('http://localhost:5000/services/all');
			const data = await response.json();
			setServices(data);
		};

		fetchServices();
	}, []);
	//make the list of services a dropdown menu so that i can extract the service id when a user selects a service
	//i will then pass the service id to the parent component ProvidersNearMe.jsx so that it can be used to fetch providers near me by service
	return (
		<select className='border border-gray-300 rounded-md p-2 w-full'>
			<option value=''>Select a service</option>
			{services.map((service) => (
				<option key={service.ServiceId} value={service.ServiceId}>
					{service.ServiceName}
				</option>
			))}
		</select>
	);
};

export default SelectService;
