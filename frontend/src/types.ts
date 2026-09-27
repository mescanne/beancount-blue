export interface ImporterStatus {
  filename: string;
  path: string;
  importer_name: string;
  status: "ok" | "error";
  last_sync: string | null;
  balances: string | null;
  error_msg?: string | null;
}

export interface Alert {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
}
