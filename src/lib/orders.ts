import { supabase } from './supabase'
import type { Order, OrderItem, OrderStatus, OrderWithItems } from '../types/order'

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (orderError) throw orderError
  if (!order) return null

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: true })

  if (itemsError) throw itemsError

  return { ...order, items: (items as OrderItem[]) ?? [] }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
