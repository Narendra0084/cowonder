import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'INR', enquiryReference, receipt } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Valid amount is required.' });
      return;
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    res.json({
      success: true,
      order: {
        id: orderId,
        entity: 'order',
        amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
        currency,
        receipt: receipt || `rcpt_${enquiryReference || Date.now()}`,
        status: 'created',
      },
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ error: 'Internal server error while creating payment order.' });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      orderId,
      paymentId,
      razorpay_order_id, 
      razorpay_payment_id, 
      enquiryReference,
      amount,
      customer,
      package: pkgDetails,
      travelDate,
      travellers,
      paymentMethod = 'Direct UPI / NetBanking'
    } = req.body;

    const resolvedOrderId = orderId || razorpay_order_id || `ORD-${Date.now()}`;
    const resolvedPaymentId = paymentId || razorpay_payment_id || `PAY-${Date.now()}`;

    // Server-authoritative booking creation
    const randomBookingNum = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `CW-2026-${randomBookingNum}`;

    const newBooking = await dataStore.createBooking({
      bookingId,
      enquiryId: enquiryReference,
      customer: {
        name: customer?.name || 'Valued Traveler',
        phone: customer?.phone || 'Contact on file',
        email: customer?.email,
      },
      package: {
        id: pkgDetails?.id || 'custom-tour',
        title: pkgDetails?.title || 'Co Wonder Custom Itinerary',
        destination: pkgDetails?.destination || 'India',
      },
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      travellers: {
        adults: travellers?.adults || 2,
        children: travellers?.children || 0,
      },
      amount: Number(amount) || 0,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      paymentId: resolvedPaymentId,
      razorpayOrderId: resolvedOrderId,
      razorpayPaymentId: resolvedPaymentId,
    });

    // Update enquiry status to confirmed if reference was passed
    if (enquiryReference) {
      await dataStore.updateEnquiry(enquiryReference, {
        status: 'confirmed',
      });
    }

    res.json({
      success: true,
      message: 'Booking successfully confirmed and registered with Co Wonder.',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal server error while verifying payment.' });
  }
};


export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await dataStore.getBookings();
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
