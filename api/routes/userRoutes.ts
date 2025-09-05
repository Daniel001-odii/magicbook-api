import { Router } from 'express';
import * as userController from '../controllers/userController';
import { validateCreateUser } from '../controllers/validationController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// support optional qrcode_id param when creating user: POST /users or POST /users/:qrcode_id
// router.post('/:qrcode_id', validateCreateUser, userController.createUser);
router.post('/:qrcode_id', userController.createUser);
router.get('/', authMiddleware, userController.listUsers);


// router.get('/:id', userController.getUser);
router.get('/me', authMiddleware, userController.getUser);


router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

router.get('/qr/:qrcode_id', userController.getUserByQrCodeId);

export default router;
