import { supabase } from '../lib/supabase';
import { User } from '../models/user';

const TABLE = 'users';

export async function createUser(user: User) {
  const { data, error } = await supabase.from(TABLE).insert(user).select().single();
  if (error) throw error;
  return data as User;
}

export async function getUserById(id: string) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data as User;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('email', email).single();
  if (error) {
    // If no rows found, supabase returns error with code 'PGRST116' or similar; return null for not found.
    // For other errors, throw.
    if ((error as any).code === 'PGRST116' || (error as any).status === 406) return null;
    throw error;
  }
  return data as User | null;
}

export async function listUsers() {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return data as User[];
}

export async function updateUser(id: string, patch: Partial<User>) {
  // Use .maybeSingle() instead of .single() to handle a null return gracefully
  // if no row is found.
  const { data, error } = await supabase.from(TABLE)
    .update(patch)
    .eq('id', id)
    .select()
    .maybeSingle(); // This is the key change!

  if (error) {
    throw error;
  }

  // If data is null, no row was found and updated.
  // Return null or undefined to signal this to the controller.
  return data as User | null;
}

export async function deleteUser(id: string) {
  const { data, error } = await supabase.from(TABLE).delete().eq('id', id).select().single();
  if (error) throw error;
  return data as User;
}
