import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const createEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, destination, packageId, travelDate, travellers, message } = req.body;

    if (!name || !phone || !destination || !travelDate) {
      res.status(400).json({ error: 'Name, phone, destination, and travel date are required.' });
      return;
    }

    const enquiry = await dataStore.createEnquiry({
      name,
      phone,
      destination,
      packageId,
      travelDate,
      travellers: Number(travellers) || 2,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry received successfully.',
      enquiry,
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ error: 'Internal server error while creating enquiry.' });
  }
};

export const getEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const enquiries = await dataStore.getEnquiries();
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getEnquiryByRef = async (req: Request, res: Response): Promise<void> => {
  try {
    const { referenceId } = req.params;
    const enquiry = await dataStore.getEnquiryByRef(referenceId);
    if (!enquiry) {
      res.status(404).json({ error: 'Enquiry reference not found.' });
      return;
    }
    res.json({ success: true, enquiry });
  } catch (error) {
    console.error('Error fetching enquiry by reference:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { referenceId } = req.params;
    const updates = req.body;
    const updated = await dataStore.updateEnquiry(referenceId, updates);
    if (!updated) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }
    res.json({ success: true, enquiry: updated });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
