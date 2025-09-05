import { Router } from 'express';
import * as qrcodeController from '../controllers/qrcodeController';
import { validateCreateQRCode } from '../controllers/validationController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/', authMiddleware, qrcodeController.createQRCode);
router.post('/bulk', authMiddleware, qrcodeController.createBulkQRCodes);
router.get('/', qrcodeController.listQRCodes);
router.get('/:id', qrcodeController.getQRCode);
router.put('/:id', qrcodeController.updateQRCode);
router.delete('/:id', qrcodeController.deleteQRCode);

export default router;
