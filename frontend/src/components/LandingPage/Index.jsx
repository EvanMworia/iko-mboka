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
			<section className='py-20 bg-white text-center px-6'>
				<p className='text-indigo-700 font-medium mb-2'>Iko Mboka</p>
				<h2 className='text-4xl font-extrabold text-gray-900 mb-4'>What we offer?</h2>
				<p className='text-gray-600 max-w-3xl mx-auto mb-12'></p>

				<div className='grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto'>
					<div className='bg-white border rounded-2xl shadow-sm p-6 text-left'>
						<div className='inline-block bg-indigo-100 text-indigo-700 font-semibold text-sm px-3 py-1 rounded-md mb-3'>
							24/7
						</div>
						<h3 className='font-bold text-lg mb-2 text-gray-800'>24/7 Services</h3>
						<p className='text-gray-600'>
							Access a wide range of services anytime, anywhere. Our platform connects you with service
							providers who are available around the clock to meet your needs.
						</p>
					</div>

					<div className='bg-white border rounded-2xl shadow-sm p-6 text-left'>
						<div className='inline-block bg-green-100 text-green-700 font-semibold text-sm px-3 py-1 rounded-md mb-3'>
							TP
						</div>
						<h3 className='font-bold text-lg mb-2 text-gray-800'>Trusted Providers</h3>
						<p className='text-gray-600'>
							We vet all our service providers for your convenience, ensuring you receive reliable and
							trusted services.
						</p>
					</div>

					<div className='bg-white border rounded-2xl shadow-sm p-6 text-left'>
						<div className='inline-block bg-orange-100 text-orange-700 font-semibold text-sm px-3 py-1 rounded-md mb-3'>
							D
						</div>
						<h3 className='font-bold text-lg mb-2 text-gray-800'>Diversity</h3>
						<p className='text-gray-600'>
							We embrace diversity and inclusion, connecting you with service providers from various
							backgrounds and expertise.
						</p>
					</div>
				</div>

				<div className='grid md:grid-cols-4 gap-6 max-w-4xl mx-auto'>
					<div>
						<div className='bg-indigo-100 text-indigo-700 font-bold text-sm inline-flex items-center justify-center rounded-full w-10 h-10 mb-3 mx-auto'>
							SD
						</div>
						<h4 className='font-semibold text-gray-800'>Service Delivery</h4>
						<p className='text-gray-600 text-sm'>Competitive turnaround times</p>
					</div>

					<div>
						<div className='bg-green-100 text-green-700 font-bold text-sm inline-flex items-center justify-center rounded-full w-10 h-10 mb-3 mx-auto'>
							RB
						</div>
						<h4 className='font-semibold text-gray-800'>Remote Browsing</h4>
						<p className='text-gray-600 text-sm'>Browse from an array of trusted service providers</p>
					</div>

					<div>
						<div className='bg-purple-100 text-purple-700 font-bold text-sm inline-flex items-center justify-center rounded-full w-10 h-10 mb-3 mx-auto'>
							📍
						</div>
						<h4 className='font-semibold text-gray-800'>Locations</h4>
						<p className='text-gray-600 text-sm'>Service providers available in various locations</p>
					</div>
				</div>
			</section>
		</div>
	);
};
export default Index;
