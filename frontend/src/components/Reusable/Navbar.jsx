const Navbar = () => {
	return (
		<nav className='flex items-center justify-between py-4 px-8 bg-white shadow-sm'>
			{/* Logo */}
			<div className='flex items-center space-x-2'>
				<img src='../../assets/logo.svg' alt='Iko Mboka' className='h-8 w-8' />
				<span className='font-semibold text-lg text-gray-800'>Iko Mboka</span>
			</div>

			{/* Links */}
			<ul className='hidden md:flex space-x-8 text-gray-700 font-medium'>
				<li>
					<a href='/' className='hover:text-blue-600'>
						Home
					</a>
				</li>
				<li>
					<a href='/register-service' className='hover:text-blue-600'>
						Register
					</a>
				</li>
				{/* {/* <li>
					<a href='#' className='hover:text-blue-600'>
						Free Workshops
					</a>
				</li> */}
				<li>
					<a href='#' className='hover:text-blue-600'>
						Find Services
					</a>
				</li>
				<li>
					<a href='#' className='hover:text-blue-600'>
						About
					</a>
				</li>
			</ul>

			{/* Contact Button */}
			<button className='bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600'>
				Contact Us →
			</button>
		</nav>
	);
};
export default Navbar;
