import { cartItem } from './cartItem';
import { User } from './user';

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  id: string;
  items: cartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  userId: number;
  address: Address;
  user?: User;  // Optional for display
}

