export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
]

export interface Order {
  id: string
  user_id: string | null
  email: string | null
  total: number
  status: OrderStatus
  shipping_address: Record<string, unknown> | null
  stripe_payment_intent_id: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image_url: string | null
  quantity: number
  price: number
  created_at: string
  updated_at: string
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}
