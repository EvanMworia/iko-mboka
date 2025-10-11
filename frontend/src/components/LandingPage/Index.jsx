import Navbar from '../Reusable/Navbar';
import FindServices from '../Users/FindServices';

const Index = () => {
	return (
		<div className='min-h-screen bg-gradient-to-b from-purple-100 via-white to-white'>
			<Navbar />

			{/* Hero Section */}
			<section className='flex flex-col items-center justify-center text-center px-6 py-20'>
				{/* Badge */}
				<div className='bg-indigo-100 text-indigo-700 font-medium px-4 py-1 rounded-full mb-6'>
					GET • Accredited service providers close to you. We vet all our providers for your conveniecne
				</div>

				{/* Heading */}
				<h1 className='text-5xl md:text-6xl font-extrabold text-gray-900 mb-10'>Service Providers Near You</h1>
				<h3 className='text-lg md:text-4xl font-italic text-gray-900 mb-4'>
					Relaible, Close, Fast, Diverse, Convenient
				</h3>

				{/* Subtext */}
				<p className='text-lg text-gray-600 max-w-2xl mb-8'>
					We understand how challenging it can be to find reliable service providers when you need them most
					and Fast. Thats why we built this platform. We connect you with trusted, vetted service providers in
					your area. Whether you need a plumber, electrician, cleaner, or any other service, we've got you
					covered.
				</p>

				{/* Buttons */}
				<div className='flex flex-col md:flex-row items-center gap-4'>
					<FindServices />
				</div>
			</section>
		</div>
	);
};
export default Index;
