// src/components/Reusable/ProviderCard.jsx
import React from 'react';

const ProviderCard = ({ provider, onClick }) => {
	return (
		<div
			onClick={() => onClick(provider)}
			className='cursor-pointer border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200'
		>
			<div className='flex items-center justify-between'>
				<h3 className='font-semibold text-lg text-gray-800'>{provider.FullName}</h3>
				<span className='text-xs text-gray-500'>#{provider.ProviderId}</span>
			</div>

			<p className='text-sm text-gray-600 mt-1'>{provider.Address}</p>

			{/* Optionally show distance if backend provides it */}
			{provider.DistanceKm && (
				<p className='text-xs text-green-700 mt-2 font-medium'>📍 {provider.DistanceKm.toFixed(2)} km away</p>
			)}

			{/* Example extra field */}
			{provider.RatingAverage && (
				<div className='mt-2 flex items-center text-yellow-500 text-sm'>
					{'⭐'.repeat(Math.round(provider.RatingAverage))}{' '}
					<span className='ml-1 text-gray-600'>({provider.RatingAverage})</span>
				</div>
			)}
		</div>
	);
};

export default ProviderCard;
