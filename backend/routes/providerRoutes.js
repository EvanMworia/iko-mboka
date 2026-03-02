import express from 'express';
import DbHelper from '../db/dbHelper.js';

const db = new DbHelper();
const providerRouter = express.Router();

providerRouter.post('/register', async (req, res) => {
	try {
		const { FullName, Email, Phone, PasswordHash, ServiceId, Latitude, Longitude, Address } = req.body;
		const result = await db.executeProcedure('sp_AddServiceProvider', {
			FullName,
			Email,
			Phone,
			PasswordHash,
			ServiceId,
			Latitude,
			Longitude,
			Address,
		});
		res.status(201).json({ message: 'Provider added successfully' });
	} catch (error) {
		console.error('Error adding provider:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Route to get all providers
providerRouter.get('/by/service', async (req, res) => {
	try {
		const { ServiceId } = req.body;
		const result = await db.executeProcedure('sp_GetProvidersByService', { ServiceId });
		res.status(200).json(result.recordset);
	} catch (error) {
		console.error('Error fetching providers:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
providerRouter.get('/near-me', async (req, res) => {
	try {
		const { Latitude, Longitude, RadiusKm } = req.body;
		const result = await db.executeProcedure('sp_GetProvidersNearLocation', { Latitude, Longitude, RadiusKm });
		res.status(200).json(result.recordset);
	} catch (error) {
		console.error('Error fetching providers near location:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
providerRouter.post('/near-me/by/service', async (req, res) => {
	try {
		const { Latitude, Longitude, RadiusKm, ServiceId } = req.body;
		const result = await db.executeProcedure('sp_GetProvidersNearLocationByService', {
			Latitude,
			Longitude,
			RadiusKm,
			ServiceId,
		});
		res.status(200).json(result.recordset);
	} catch (error) {
		console.error('Error fetching providers near location by service:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
providerRouter.get('/provider-details/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await db.executeProcedure('sp_GetProviderDetails', { ProviderId: id });
		res.status(200).json(result.recordset);
	} catch (error) {
		console.error('Error fetching provider details:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default providerRouter;
