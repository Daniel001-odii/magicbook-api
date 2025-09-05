import { Router } from 'express';
import * as q from '../controllers/qrcodeControllerExtended';
import * as qa from '../controllers/qrcodeControllerAdvanced';

const router = Router();

router.get('/uid/:uid', q.fetchByUid);
router.post('/:id/activate', qa.setActive);
router.post('/:id/scan', qa.bumpScans);

export default router;
