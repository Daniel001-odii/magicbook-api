// Optional convenience: increment scan count when fetching by uid
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export async function fetchByUid(req: Request, res: Response, next: NextFunction) {
  try {
    const { uid } = req.params;
    const { data, error } = await supabase.from('qrcodes').select('*').eq('uid', uid).single();
    if (error) throw error;
    // increment scans
    await supabase.from('qrcodes').update({ no_of_scans: (data.no_of_scans || 0) + 1 }).eq('id', data.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export default {};
