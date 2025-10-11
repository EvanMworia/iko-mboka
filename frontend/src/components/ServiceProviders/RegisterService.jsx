import Navbar from '../Reusable/Navbar';

const RegisterService = () => {
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
				<h1 className='text-5xl md:text-6xl font-extrabold text-gray-900 mb-4'>Jobs are everywhere</h1>
				<h3 className='text-lg md:text-4xl font-italic text-gray-900 mb-4'>But you aren't</h3>

				{/* Subtext */}
				<p className='text-lg text-gray-600 max-w-2xl mb-8'>
					Let us do the heavy lifting for you, and market your services to a wide range of clients looking for
					your skills.
				</p>

				{/* Buttons */}
				<div className='flex flex-col md:flex-row items-center gap-4'>
					<button className='bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 shadow-md'>
						Register (free)
					</button>
					<a href='#' className='text-gray-700 font-medium hover:text-gray-900'>
						Are you a service provider? Register now →
					</a>
				</div>
			</section>
		</div>
	);
};
export default RegisterService;
