import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !message) {
      res.status(400).json({ error: 'Name, phone, and message are required.' });
      return;
    }

    const enquiry = await dataStore.createEnquiry({
      name,
      phone,
      email,
      destination: subject || 'General Travel Consultation',
      travelDate: new Date().toISOString().split('T')[0],
      travellers: 2,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message delivered to the travel desk.',
      referenceId: enquiry.referenceId,
    });
  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
