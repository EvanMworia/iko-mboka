const FindServices = () => {
	// const handleFindServices = async () => {
	// 	if (navigator.geolocation) {
	// 		console.log(navigator.geolocation);
	// 		navigator.geolocation.getCurrentPosition(
	// 			async (position) => {
	// 				const { latitude, longitude } = position.coords;

	// 				// You can store these in localStorage temporarily
	// 				localStorage.setItem('user_latitude', latitude);
	// 				localStorage.setItem('user_longitude', longitude);

	// 				// Send to backend
	// 				// await fetch('http://localhost:5000/api/location', {
	// 				// 	method: 'POST',
	// 				// 	headers: { 'Content-Type': 'application/json' },
	// 				// 	body: JSON.stringify({ latitude, longitude }),
	// 				// });

	// 				alert('Location stored, you can now search for nearby providers!');
	// 			},
	// 			(err) => console.error('Location access denied:', err)
	// 		);
	// 	} else {
	// 		alert('Geolocation not supported on this browser.');
	// 	}
	// };

	//when a user clicks the button capture their location, send it to the backend and redirect them to the find services page
	//i get an error that says "hook.js:608 Location access denied: GeolocationPositionError {code: 2, message:""}"

	const handleFindServices = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;

					// Store location in localStorage
					localStorage.setItem('Latitude', latitude);
					// localStorage.setItem('user_latitude', latitude);
					localStorage.setItem('Longitude', longitude);
					// localStorage.setItem('user_longitude', longitude);

					// Redirect to find services page
					window.location.href = '/providers-near-me';
				},
				(err) => console.error('Location access denied:', err)
			);
		} else {
			alert('Geolocation not supported on this browser.');
		}
	};

	return (
		<>
			<button
				onClick={handleFindServices}
				className='bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 shadow-md'
			>
				Find A Service Provider
			</button>
		</>
	);
};
export default FindServices;
