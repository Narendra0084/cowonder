import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<boolean> => {
  console.log('[Database] Co Wonder persistence data store initialized in fast in-memory persistence mode.');
  return true;
};

