import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { getOrganisations, getOrganisation, createOrganisation, addUserToOrganisation } from '../controllers/organisationController';

const router = Router();

router.get('/', authenticate, getOrganisations);
router.get('/:orgId', authenticate, getOrganisation);
router.post('/', authenticate, createOrganisation);
router.post('/:orgId/users', authenticate, addUserToOrganisation);

export default router;
