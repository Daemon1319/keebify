## Database Schema

### categories
- id (uuid, PK)
- name (text)
- created_at (timestamptz)
- updated_at (timestamptz)

### products
- id (uuid, PK)
- category_id (uuid, FK → categories)
- name (text)
- description (text)
- price (numeric)
- image_url (text)
- stock (int4)
- created_at (timestamptz)
- updated_at (timestamptz)

### profiles
- id (uuid, PK, FK → auth.users)
- role (text, default 'customer')
- created_at (timestamptz)
- updated_at (timestamptz)

### orders
- id (uuid, PK)
- user_id (uuid, FK → profiles, nullable)
- email (text, nullable)
- total (numeric)
- status (text)
- shipping_address (jsonb, nullable)
- stripe_payment_intent_id (text, nullable)
- created_at (timestamptz)
- updated_at (timestamptz)

### order_items
- id (uuid, PK)
- order_id (uuid, FK → orders)
- product_id (uuid, FK → products)
- product_name (text)
- product_image_url (text, nullable)
- quantity (int4)
- price (numeric)
- created_at (timestamptz)
- updated_at (timestamptz)