import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const onlyApproved = req.query.all !== 'true';
    const reviews = await dataStore.getReviews(onlyApproved);
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, packageTitle, rating, review, photo, bookingId } = req.body;

    if (!customerName || !packageTitle || !rating || !review) {
      res.status(400).json({ error: 'Customer name, package title, rating, and review text are required.' });
      return;
    }

    const newReview = await dataStore.createReview({
      customerName,
      packageTitle,
      rating: Number(rating) || 5,
      review,
      photo,
      bookingId,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted for verification by the travel operations desk.',
      review: newReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateReviewStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'approved' && status !== 'rejected') {
      res.status(400).json({ error: 'Status must be either approved or rejected.' });
      return;
    }

    const updated = await dataStore.updateReviewStatus(id, status);
    if (!updated) {
      res.status(404).json({ error: 'Review not found.' });
      return;
    }

    res.json({ success: true, review: updated });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
