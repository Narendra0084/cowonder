import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const getPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await dataStore.getPackages();
    res.json({ success: true, count: packages.length, packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getPackageBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const pkg = await dataStore.getPackageBySlug(slug);
    if (!pkg) {
      res.status(404).json({ error: 'Package not found.' });
      return;
    }
    res.json({ success: true, package: pkg });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPkg = await dataStore.createPackage(req.body);
    res.status(201).json({ success: true, package: newPkg });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await dataStore.updatePackage(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Package not found.' });
      return;
    }
    res.json({ success: true, package: updated });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await dataStore.deletePackage(id);
    res.json({ success: true, message: 'Package deleted successfully.' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
