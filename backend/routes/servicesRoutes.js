//route that gets all services using ES6 module syntax
import express from 'express';
import DbHelper from '../db/dbHelper.js';

const db = new DbHelper();
const servicesRouter = express.Router();

servicesRouter.get('/all', async (req, res) => {
	try {
		const services = await db.executeProcedure('sp_GetServices', {});
		res.status(200).json(services.recordset);
	} catch (error) {
		console.error('Error fetching services:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default servicesRouter;
