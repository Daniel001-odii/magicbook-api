import { supabase } from "../lib/supabase";
import { QRCode } from "../models/qrcode";
import crypto from "crypto";

const TABLE = "qrcodes";

export async function createQRCode() {
  // Helper function to generate a random 6-character UID
  async function generateUid() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 6;
    let uid = "";
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      uid += alphabet[bytes[i] % alphabet.length];
    }
    return uid;
  }

  // Helper function to ensure the generated UID is unique in the database
  async function generateUniqueUid(attempts = 5) {
    for (let i = 0; i < attempts; i++) {
      const candidate = await generateUid();
      const { data: existing, error: checkErr } = await supabase
        .from(TABLE)
        .select("id")
        .eq("uid", candidate)
        .maybeSingle();

      if (checkErr) throw checkErr;
      if (!existing) return candidate;
    }
    throw new Error("Unable to generate unique uid for QRCode");
  }

  // Generate the unique UID and create the payload
  const payload = {
    uid: await generateUniqueUid(),
    is_active: false,
    no_of_scans: 0,
  };

  // Insert the new QR code into the database
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getQRCodeById(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as QRCode;
}

export async function getQRCodeByUid(uid: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("uid", uid)
    .single();
  if (error) throw new Error("Invalid QR code ID");
  return data as QRCode;
}


/* const { data, error } = await supabase
  .from('qrcodes')
  .select(`
    *,
    owner ( * )
  `);
   */
export async function listQRCodes() {
  const { data, error } = await supabase.from(TABLE).select(`
    *,
    owner ( * )
  `);
  if (error) throw error;
  return data as QRCode[];
}

export async function updateQRCode(id: string, patch: Partial<QRCode>) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq("uid", id)
    .select()
    .single();
  if (error) throw error;
  return data as QRCode;
}

export async function deleteQRCode(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as QRCode;
}
