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

### users
- id (uuid, PK)
- email (text)
- role (text)
- created_at (timestamptz)
- updated_at (timestamptz)

### orders
- id (uuid, PK)
- user_id (uuid, FK → users)
- total (numeric)
- status (text)
- created_at (timestamptz)
- updated_at (timestamptz)

### order_items
- id (uuid, PK)
- order_id (uuid, FK → orders)
- product_id (uuid, FK → products)
- quantity (int4)
- price (numeric)
- created_at (timestamptz)
- updated_at (timestamptz)