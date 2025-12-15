export interface Booking {
  propertyId: number;
  tenantName: string;
  email: string;
  phone: string;
  moveInDate: string;
  message?: string;
  status?: string;
}
