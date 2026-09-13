export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface IOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  created_at: Date;
}

export interface IOrderItemDetail extends IOrderItem {
  product_title: string;
}

export interface IOrder {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  created_at: Date;
}

export interface IOrderDetail extends IOrder {
  customer_name: string;
  customer_email: string;
  items: IOrderItemDetail[];
}

export interface ICreateOrderItemInput {
  product_id: number;
  quantity: number;
}

export interface ICreateOrderPayload {
  user_id: number;
  items: ICreateOrderItemInput[];
}

export interface IUpdateOrderStatusPayload {
  status: OrderStatus;
}