export interface User {
  id?: string;
  username: string;
  title?: string | null;
  company_name?: string | null;
  address?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  email: string;
  phone_number?: string | null;
  urls?: string[] | null;
  password: string;
  image_url?: string | null;
  book_name?: string | null;
  created_at?: string;
}
