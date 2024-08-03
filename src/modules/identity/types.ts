export interface IdentityRequest {
  email?: string;
  phoneNumber?: number;
}

export interface IdentityResponse {
  contact: {
    primaryContactId: number;
    emails: string[]; // first element being email of primary contact
    phoneNumbers: string[]; // first element being phoneNumber of primary conta
    secondaryContactIds: number[]; // Array of all Contact IDs that are "seconda
  };
}
