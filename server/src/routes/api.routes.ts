import { Router } from 'express';
import { 
  createEnquiry, 
  getEnquiries, 
  getEnquiryByRef, 
  updateEnquiry 
} from '../controllers/enquiry.controller';
import { 
  getPackages, 
  getPackageBySlug, 
  createPackage, 
  updatePackage, 
  deletePackage 
} from '../controllers/package.controller';
import { getDestinations } from '../controllers/destination.controller';
import { 
  getReviews, 
  createReview, 
  updateReviewStatus 
} from '../controllers/review.controller';
import { submitContact } from '../controllers/contact.controller';
import { 
  createOrder, 
  verifyPayment, 
  getBookings 
} from '../controllers/payment.controller';

const router = Router();

// Enquiries
router.post('/enquiries', createEnquiry);
router.get('/enquiries', getEnquiries);
router.get('/enquiries/:referenceId', getEnquiryByRef);
router.patch('/enquiries/:referenceId', updateEnquiry);

// Destinations
router.get('/destinations', getDestinations);

// Packages
router.get('/packages', getPackages);
router.get('/packages/:slug', getPackageBySlug);
router.post('/packages', createPackage);
router.put('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

// Reviews
router.get('/reviews', getReviews);
router.post('/reviews', createReview);
router.patch('/reviews/:id', updateReviewStatus);

// Contact
router.post('/contact', submitContact);

// Payments & Bookings
router.post('/payments/create-order', createOrder);
router.post('/payments/verify', verifyPayment);
router.get('/bookings', getBookings);

export default router;
