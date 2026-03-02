import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Reusable/Navbar';
import Reviews from '../Reviews/Reviews';
import { Phone, Mail, MapPin, Star } from 'lucide-react';

const ProviderDetails = () => {
	const [providerDetails, setProviderDetails] = useState(null);
	const { id } = useParams();

	useEffect(() => {
		const fetchProviderDetails = async () => {
			try {
				const response = await fetch(`http://localhost:5000/providers/provider-details/${id}`);
				if (!response.ok) throw new Error('Failed to fetch provider details');
				const data = await response.json();
				setProviderDetails(data[0]);
			} catch (error) {
				console.error('Error fetching provider details:', error);
			}
		};
		fetchProviderDetails();
	}, [id]);

	return (
		<>
			<Navbar />
			<div className='min-h-screen bg-gray-50 py-10'>
				<div className='container mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-2xl'>
					{providerDetails ? (
						<div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
							<div className='w-40 h-40 rounded-full bg-green-100 flex items-center justify-center text-5xl font-bold text-green-700'>
								{providerDetails.FullName?.charAt(0)}
							</div>

							<div className='flex-1'>
								<div className='flex justify-between items-start flex-wrap'>
									<h2 className='text-3xl font-bold text-gray-800'>{providerDetails.FullName}</h2>
									<span className='flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium text-sm'>
										<Star className='w-4 h-4 mr-1' />
										{providerDetails.RatingAverage?.toFixed(1) || 'N/A'}
									</span>
								</div>

								<p className='mt-2 text-gray-600 text-lg italic'>
									{providerDetails.ServiceName || 'Service Provider'}
								</p>

								<div className='mt-5 space-y-3 text-gray-700'>
									<p className='flex items-center'>
										<Phone className='w-5 h-5 mr-2 text-green-600' />
										{providerDetails.Phone}
									</p>
									<p className='flex items-center'>
										<Mail className='w-5 h-5 mr-2 text-green-600' />
										{providerDetails.Email}
									</p>
									<p className='flex items-center'>
										<MapPin className='w-5 h-5 mr-2 text-green-600' />
										{providerDetails.Address}
									</p>
								</div>

								<div className='mt-6'>
									<h3 className='text-xl font-semibold text-gray-800 mb-2'>About</h3>
									<p className='text-gray-600 leading-relaxed'>
										{providerDetails.Description || 'No description available at the moment.'}
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className='flex justify-center items-center h-40 text-gray-600'>
							Loading provider details...
						</div>
					)}
				</div>

				{/* Pass providerId to Reviews */}
				<div className='container mx-auto max-w-4xl mt-8'>
					<Reviews providerId={id} />
				</div>
			</div>
		</>
	);
};

export default ProviderDetails;
