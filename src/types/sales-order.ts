export interface SalesOrder {
  orderId: string;
  merchantId: string;
  amount: number;
  createDate: Date;
  dueDate: Date;
  status: 'pending' | 'verified' | 'approved' | 'confirmed' | 'minted' | 'deposited';
  customerAddress?: string;
  qrCode?: string;
  nftTokenId?: string;
}

export interface ReceivableNFT {
  tokenId: string;
  orderId: string;
  merchantId: string;
  amount: number;
  mintDate: Date;
  dueDate: Date;
  status: 'active' | 'matured' | 'defaulted';
}

export type OrderStatus = SalesOrder['status'];

export interface OrderStatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
}
