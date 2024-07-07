import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; // Make sure to import AuthRequest
import Organisation from '../models/Organisation';
import User from '../models/User';

export const getOrganisations = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ status: 'Unauthorized', message: 'User ID is missing', statusCode: 401 });
  }

  try {
    const organisations = await Organisation.findAll({ where: { owner_id: userId } });
    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved',
      data: { organisations },
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad request', message: 'Failed to retrieve organisations', statusCode: 400 });
  }
};

export const getOrganisation = async (req: AuthRequest, res: Response) => {
  const { orgId } = req.params;

  try {
    const organisation = await Organisation.findOne({ where: { orgId } });

    if (!organisation) {
      return res.status(404).json({ status: 'Not found', message: 'Organisation not found', statusCode: 404 });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation record found',
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad request', message: 'Failed to retrieve organisation', statusCode: 400 });
  }
};

export const createOrganisation = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ status: 'Unauthorized', message: 'User ID is missing', statusCode: 401 });
  }

  if (!name) {
    return res.status(400).json({ status: 'Bad request', message: 'Name is required', statusCode: 400 });
  }

  try {
    const organisation = await Organisation.create({
      name,
      description,
      owner_id: userId,
    });

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad request', message: 'Failed to create organisation', statusCode: 400 });
  }
};

export const addUserToOrganisation = async (req: AuthRequest, res: Response) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const organisation = await Organisation.findOne({ where: { orgId } });
    const user = await User.findOne({ where: { userId } });

    if (!organisation || !user) {
      return res.status(404).json({ status: 'Not found', message: 'Organisation or User not found', statusCode: 404 });
    }

    // Add logic to associate user with organisation here

    res.status(200).json({ status: 'success', message: 'User added to organisation successfully' });
  } catch (error) {
    res.status(400).json({ status: 'Bad request', message: 'Failed to add user to organisation', statusCode: 400 });
  }
};
