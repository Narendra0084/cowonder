import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const getDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    const destinations = await dataStore.getDestinations();
    res.json({ success: true, count: destinations.length, destinations });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
