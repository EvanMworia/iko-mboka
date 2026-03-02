import express from 'express';
import DbHelper from '../db/dbHelper.js';
import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';

import 'dotenv/config';

// Fetch all the reviews of a specific provider from reviewsRouter.get('/for/provider/:id')
// and generate a summary using Genkit AI
// This summary will be used to display an overview of the provider's reviews on the frontend
// The summary should highlight common themes, overall sentiment, and key points from the reviews
const apiKey = process.env.GEMINI_API_KEY;
const ai = genkit({ plugins: [googleAI({ apiKey })] });
async function generateReviewSummary(reviews) {
	try {
		if (reviews.length === 0) return 'No reviews available.';
		const reviewsText = reviews.map((r) => `Rating: ${r.Rating}, Review: ${r.ReviewText}`).join('\n');
		const prompt = `Summarize the following reviews, highlighting common themes, overall sentiment, and key points:\n\n${reviewsText}\n\nSummary:`;
		const { text } = await ai.generate({ prompt, model: googleAI.model('gemini-2.5-flash') });
		return text;
	} catch (error) {
		console.error('Error generating review summary:', error);
		throw new Error('Failed to generate review summary');
	}
}

const db = new DbHelper();
const reviewsRouter = express.Router();

reviewsRouter.post('/add-review', async (req, res) => {
	try {
		const { ProviderId, Rating, ReviewText } = req.body;
		const result = await db.executeProcedure('sp_AddReview', { ProviderId, Rating, ReviewText });
		res.status(201).json({ message: 'Review added successfully' });
	} catch (error) {
		console.error('Error adding review:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

reviewsRouter.get('/for/provider/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await db.executeProcedure('sp_GetReviewsForProvider', { ProviderId: id });
		res.status(200).json(result.recordset);
	} catch (error) {
		console.error('Error fetching reviews:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
reviewsRouter.post('/summary/for/provider/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await db.executeProcedure('sp_GetReviewsForProvider', { ProviderId: id });
		const summary = await generateReviewSummary(result.recordset);
		res.status(200).json({ summary });
	} catch (error) {
		console.error('Error fetching review summary:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default reviewsRouter;
