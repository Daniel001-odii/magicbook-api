import { Request, Response, NextFunction } from 'express';
import * as qrcodeService from '../services/qrcodeService';

export async function createQRCode(req: Request, res: Response, next: NextFunction) {
  try {
    const qr = await qrcodeService.createQRCode();
    res.status(201).json(qr);
  } catch (err) {
    next(err);
  }
}

export async function createBulkQRCodes(req: Request, res: Response, next: NextFunction) {
  try {
    const count = req.body.count || 1;
    const qrs = [];
    for (let i = 0; i < count; i++) {
      qrs.push(await qrcodeService.createQRCode());
    }
    res.status(201).json(qrs);
    } catch (err) {
    next(err);
  }
}


export async function getQRCode(req: Request, res: Response, next: NextFunction) {
  try {
    const qr = await qrcodeService.getQRCodeById(req.params.id);
    res.json(qr);
  } catch (err) {
    next(err);
  }
}

export async function listQRCodes(req: Request, res: Response, next: NextFunction) {
  try {
    const qrs = await qrcodeService.listQRCodes();
    res.json(qrs);
  } catch (err) {
    next(err);
  }
}

export async function updateQRCode(req: Request, res: Response, next: NextFunction) {
  try {
    const qr = await qrcodeService.updateQRCode(req.params.id, req.body);
    res.json(qr);
  } catch (err) {
    next(err);
  }
}

export async function deleteQRCode(req: Request, res: Response, next: NextFunction) {
  try {
    const qr = await qrcodeService.deleteQRCode(req.params.id);
    res.json(qr);
  } catch (err) {
    next(err);
  }
}
