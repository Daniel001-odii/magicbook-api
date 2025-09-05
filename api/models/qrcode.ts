export interface QRCode {
  id?: string;
  uid: string;
  owner: string; // user id
  // optional in the model because DB/service will supply defaults
  is_active?: boolean;
  no_of_scans?: number;
  created_at?: string;
}
