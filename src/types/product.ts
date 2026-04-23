export interface Product {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  stock: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  created_at: string
  updated_at: string
}
