import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import * as qrcodeService from "../services/qrcodeService";
import { hashPassword, signToken } from "../services/authService";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const qrcode_id = req.params.qrcode_id;
    const input = { ...req.body, password: hashPassword(req.body.password) };

    if (!qrcode_id) {
      return res.status(400).json({ error: "QR code ID is required" });
    }

    // const qr_code = await qrcodeService.getQRCodeById(qrcode_id);
    const qr_code = await qrcodeService.getQRCodeByUid(qrcode_id);
    console.log("QR Code fetched: ", qr_code);
    if (!qr_code) {
      return res.status(400).json({ error: "Invalid QR code ID" });
    }

    if (qr_code.is_active) {
      return res.status(400).json({ error: "QR code is already used" });
    }

    if (!input.password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const {
      username,
      title,
      company_name,
      bio,
      email,
      phone_number,
      urls,
      book_name,
      password,
    } = input;

    const user = await userService.createUser({
      username,
      title,
      company_name,
      bio,
      email,
      phone_number,
      urls,
      book_name,
      password,
    });
    await qrcodeService.updateQRCode(qrcode_id, {
      owner: user.id as string,
      is_active: true,
    });

    const token = signToken({ sub: user.id, email: user.email });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: any, res: any, next: NextFunction) {
  try {
    console.log("Fetching user with ID: ", req?.user);
    const user = await userService.getUserById(req?.user?.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getUserByQrCodeId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const qrcode_id = req.params.qrcode_id;
    const qr = await qrcodeService.getQRCodeByUid(qrcode_id);
    if (!qr) return res.status(404).json({ error: "QR code not found" });
    if (!qr.owner)
      return res.status(204).json({ error: "QR code has no associated user" });
    const user = await userService.getUserById(qr.owner);
    if (!user) return res.status(404).json({ error: "User not found" });

    // update no of scans for qrcode
    await qrcodeService.updateQRCode(qrcode_id, {
      no_of_scans: (qr.no_of_scans || 0) + 1,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("trying to edit user with ID: ", req.params.id);
    if (req.body.password) req.body.password = hashPassword(req.body.password);
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
