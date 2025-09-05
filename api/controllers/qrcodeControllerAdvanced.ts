// Additional actions: activate/deactivate
import { Request, Response, NextFunction } from 'express';
import { updateQRCode, getQRCodeById } from '../services/qrcodeService';

export async function setActive(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const qr = await updateQRCode(id, { is_active: !!active });
    res.json(qr);
  } catch (err) {
    next(err);
  }
}

export async function bumpScans(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const existing = await getQRCodeById(id);
    const qr = await updateQRCode(id, { no_of_scans: (existing.no_of_scans || 0) + 1 });
    res.json(qr);
  } catch (err) {
    next(err);
  }
}
