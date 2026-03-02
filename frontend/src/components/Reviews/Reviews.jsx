import { useEffect, useState } from 'react';
import { Star, X, Sparkles } from 'lucide-react';

const Reviews = ({ providerId }) => {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [summary, setSummary] = useState('');
	const [showSummaryModal, setShowSummaryModal] = useState(false);
	const [summarizing, setSummarizing] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!providerId) return;

		const fetchReviews = async () => {
			try {
				const response = await fetch(`http://localhost:5000/reviews/for/provider/${providerId}`);
				if (!response.ok) throw new Error('Failed to fetch reviews');
				const data = await response.json();
				setReviews(data);
			} catch (error) {
				console.error('Error fetching reviews:', error);
				setError('Unable to load reviews.');
			} finally {
				setLoading(false);
			}
		};

		fetchReviews();
	}, [providerId]);

	const handleGenerateSummary = async () => {
		setSummarizing(true);
		setError('');
		setSummary('');

		try {
			const res = await fetch(`http://localhost:5000/reviews/summary/for/provider/${providerId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!res.ok) throw new Error('Failed to generate summary');
			const data = await res.json();
			setSummary(data.summary || 'No summary available.');
			setShowSummaryModal(true);
		} catch (err) {
			console.error('Error generating summary:', err);
			setError('Failed to generate AI summary.');
		} finally {
			setSummarizing(false);
		}
	};

	if (loading) {
		return <p className='text-center text-gray-500'>Loading reviews...</p>;
	}

	return (
		<div className='bg-white shadow-sm rounded-xl p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h3 className='text-2xl font-semibold text-gray-800'>Customer Reviews</h3>

				<button
					onClick={handleGenerateSummary}
					disabled={summarizing}
					className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition 
						${summarizing ? 'bg-gray-300 text-gray-600' : 'bg-green-600 hover:bg-green-700 text-white'}
					`}
				>
					<Sparkles className='w-4 h-4' />
					{summarizing ? 'Generating...' : 'AI Summary'}
				</button>
			</div>

			{error && <p className='text-red-500 mb-4'>{error}</p>}

			{/* Reviews Section */}
			{reviews.length === 0 ? (
				<div className='text-center text-gray-500'>No reviews yet for this provider.</div>
			) : (
				<div className='space-y-5'>
					{reviews.map((review, index) => (
						<div
							key={index}
							className='border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow'
						>
							<div className='flex justify-between items-center mb-2'>
								<span className='font-medium text-gray-800'>{review.ReviewerName || 'Anonymous'}</span>
								<div className='flex items-center'>
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${
												i < review.Rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
											}`}
										/>
									))}
								</div>
							</div>
							<p className='text-gray-700 leading-relaxed'>
								{review.ReviewText || 'No comment provided.'}
							</p>
							<p className='text-xs text-gray-400 mt-2'>
								{new Date(review.CreatedAt).toLocaleDateString()}
							</p>
						</div>
					))}
				</div>
			)}

			{/* Modal for AI Summary */}
			{showSummaryModal && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white rounded-2xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative animate-fadeIn'>
						<button
							onClick={() => setShowSummaryModal(false)}
							className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
						>
							<X className='w-5 h-5' />
						</button>

						<h3 className='text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
							<Sparkles className='w-5 h-5 text-green-600' />
							AI Summary
						</h3>

						<p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
							{summary || 'No summary available.'}
						</p>

						<div className='mt-6 text-right'>
							<button
								onClick={() => setShowSummaryModal(false)}
								className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Reviews;
