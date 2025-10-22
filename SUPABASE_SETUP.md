# 🗄️ Supabase + Prisma Setup Guide

Kompletan vodič za integraciju Supabase PostgreSQL baze podataka sa Prisma ORM-om.

---

## 🎯 Što ćemo napraviti

✅ Setup Supabase PostgreSQL baze  
✅ Konfiguracija Prisma ORM-a  
✅ Kreiranje Order tabele  
✅ Integracija sa Stripe webhook-om  
✅ API endpoints za narudžbe  
✅ Spremno za produkciju

---

## 📋 Prerequisites

- ✅ Postojeći Stripe integration (već imaš)
- ✅ Next.js projekt (već imaš)
- ✅ Node.js 18+ (već imaš)

---

## 🚀 Step 1: Kreiraj Supabase Account i Database

### 1.1 Registracija

```bash
# Idi na:
https://supabase.com

# Klikni "Start your project" → Sign Up
# Koristi GitHub account za najbrži setup
```

### 1.2 Kreiraj New Project

```
1. Organization: Create new (ili koristi postojeću)
2. Name: vina-ramljak (ili kako god želiš)
3. Database Password:
   - Generiraj strong password
   - ⚠️ SNIMI GA NEGDJE SIGURNO!
4. Region: Europe West (Frankfurt) ili Europe Central (London)
5. Pricing Plan: Free (dovoljno za početak)
6. Create new project
```

⏰ **Pričekaj 2-3 minute** dok se kreira...

### 1.3 Kopiraj Database URL

```
1. Project Settings (⚙️ icon)
2. Database
3. Connection string → URI
4. Kopiraj connection string (počinje sa postgresql://)
```

Izgleda ovako:

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

---

## 🛠️ Step 2: Setup Prisma

### 2.1 Dodaj Environment Variable

Kreiraj ili updateaj `.env.local`:

```bash
# U root direktoriju projekta
touch .env.local
```

Dodaj:

```env
# ... postojeći Stripe keys ...

# Database URL (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

⚠️ **Zamijeni** sa svojim connection stringom!

### 2.2 Generiraj Prisma Client

Prisma paketi su već instalirani! Samo generiraj klijent:

```bash
npx prisma generate
```

---

## 📊 Step 3: Kreiraj Database Tabele

### 3.1 Push Schema to Database

```bash
npx prisma db push
```

Ovo će kreirati `orders` tabelu u Supabase!

**Output:**

```
✔ Generated Prisma Client
✔ Database synchronized with Prisma schema
```

### 3.2 Provjeri u Supabase Dashboard

```
1. Idi na Supabase Dashboard
2. Table Editor (lijeva strana)
3. Trebao bi vidjeti "orders" tabelu! ✅
```

---

## 🧪 Step 4: Testiraj Integraciju

### 4.1 Restart Dev Server

```bash
# Stop trenutni server (Ctrl+C)
pnpm dev
```

### 4.2 Testiraj Checkout Flow

```bash
1. Dodaj vino u košaricu
2. Klikni "Naruči"
3. Popuni Stripe checkout formu
4. Test kartica: 4242 4242 4242 4242
5. Završi payment
```

### 4.3 Provjeri Database

```
1. Idi u Supabase Dashboard → Table Editor → orders
2. Trebao bi vidjeti novu narudžbu! 🎉
```

### 4.4 Provjeri API Endpoint

```bash
# U browseru ili Postman:
http://localhost:3000/api/orders

# Trebao bi vidjeti JSON sa narudžbama
```

---

## 📊 Prisma Studio (Database GUI)

Možeš pregledavati i editirati podatke direktno:

```bash
npx prisma studio
```

Otvara se na `http://localhost:5555`

- ✅ Pregledaj sve narudžbe
- ✅ Editaj podatke
- ✅ Filter i search
- ✅ Delete records

---

## 🔍 Kako Webhook Sprema Narudžbe

### Flow:

```
1. Korisnik plati → Stripe šalje webhook
2. Webhook prima checkout.session.completed event
3. Parsea order data (wineId, quantity, customer info)
4. createOrder() sprema u Supabase:
   - Customer email, name
   - Total, subtotal, shipping
   - Items (JSON array)
   - Shipping address
   - Stripe session ID
   - Status: PAID
5. Console log: "✅ Order saved to database"
```

### Primjer:

```typescript
// Webhook automatski poziva:
await createOrder({
  stripeSessionId: "cs_test_...",
  customerEmail: "customer@example.com",
  customerName: "John Doe",
  total: 58.00,
  subtotal: 58.00,
  shipping: 0,
  currency: "eur",
  status: "PAID",
  items: [
    { wineId: "rose", quantity: 2 },
    { wineId: "merlot", quantity: 1 }
  ],
  shippingAddress: {...},
});
```

---

## 📡 API Endpoints

### GET /api/orders

Dohvati sve narudžbe (za admin):

```bash
# Basic
GET http://localhost:3000/api/orders

# Sa pagination
GET http://localhost:3000/api/orders?limit=20&offset=0

# Filter by status
GET http://localhost:3000/api/orders?status=PAID
```

**Response:**

```json
{
  "orders": [...],
  "total": 42,
  "limit": 50,
  "offset": 0,
  "hasMore": false
}
```

### GET /api/orders/[id]

Dohvati jednu narudžbu:

```bash
GET http://localhost:3000/api/orders/cm1234567890
```

### PATCH /api/orders/[id]

Update order status (admin):

```bash
PATCH http://localhost:3000/api/orders/cm1234567890
Content-Type: application/json

{
  "status": "SHIPPED",
  "notes": "Sent with DHL"
}
```

---

## 🗃️ Database Schema

### Order Model

```prisma
model Order {
  id              String      @id @default(cuid())
  stripeSessionId String      @unique

  customerEmail   String
  customerName    String?

  total           Float
  subtotal        Float
  shipping        Float
  currency        String
  status          OrderStatus // PENDING, PAID, SHIPPED, etc.

  items           Json        // [{wineId, name, price, quantity}]
  shippingAddress Json?
  billingAddress  Json?

  paymentIntentId String?
  paymentStatus   String?
  notes           String?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}
```

### Order Statuses

- `PENDING` - Order created, payment pending
- `PAID` - Payment successful ✅
- `PROCESSING` - Order being processed
- `SHIPPED` - Order shipped 📦
- `DELIVERED` - Order delivered 🎉
- `CANCELLED` - Order cancelled ❌
- `REFUNDED` - Payment refunded 💰

---

## 📈 Production Setup

### 1. Production Database URL

U Supabase Dashboardu:

```
Settings → Database → Connection Pooling → Transaction Mode
```

Koristi **Transaction mode** connection string za webhook:

```env
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### 2. Environment Variables (Vercel/Netlify)

```env
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Run Migrations

U production, koristi migrations umjesto `db push`:

```bash
# Locally
npx prisma migrate dev --name init

# Deploy migrations to production
npx prisma migrate deploy
```

---

## 🔐 Sigurnost

### Row Level Security (RLS)

Supabase ima built-in RLS. Za dodatnu sigurnost:

```sql
-- U Supabase SQL Editor

-- Samo admin može vidjeti sve narudžbe
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- TODO: Dodaj policies kada dodaš authentication
```

### API Endpoints

API endpoints trenutno **NEMAJU** autentifikaciju!

**Za produkciju, dodaj:**

```typescript
// src/lib/auth.ts
export async function isAdmin(req: NextRequest) {
  // Implementiraj auth check
  // Koristi NextAuth, Supabase Auth, ili custom solution
}

// U API routes:
if (!(await isAdmin(req))) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

## 🐛 Troubleshooting

### Problem: "Can't reach database server"

**Rješenje:**

```bash
# 1. Provjeri DATABASE_URL u .env.local
cat .env.local | grep DATABASE_URL

# 2. Provjeri da li Supabase project radi
# Idi u Supabase Dashboard → Settings → General

# 3. Provjeri password (nije expired)
```

### Problem: "Table doesn't exist"

**Rješenje:**

```bash
# Resetuj bazu i pusni schema
npx prisma db push --force-reset

# Ili kreiraj migraciju
npx prisma migrate dev
```

### Problem: "PrismaClient is unable to run in browser"

**Rješenje:**

```typescript
// Nikada ne importaj prisma u client components!
// Koristi samo u:
// - API routes (/app/api/...)
// - Server Components
// - Server Actions
```

### Problem: Webhook radi ali Order se ne sprema

**Provjeri:**

```bash
# 1. Console logs u terminalu gdje ti radi dev server
# Trebao bi vidjeti: "✅ Order saved to database"

# 2. Provjeri ima li error-a:
# Možda je DATABASE_URL kriv

# 3. Test Prisma connection:
npx prisma studio
# Ako se otvori, connection radi
```

---

## 📊 Monitoring & Analytics

### Supabase Dashboard

- **Database** → Table Editor → Vidi sve orders
- **Database** → Query Performance → Optimiziraj queries
- **Reports** → Vidi database usage
- **Logs** → Vidi Postgres logs

### Prisma Query Logs

U development, već imaš query logging:

```typescript
// src/lib/prisma.ts
log: ["query", "error", "warn"];
```

Vidjet ćeš u terminalu:

```
prisma:query SELECT * FROM orders WHERE...
```

---

## 🎨 Sljedeći Koraci

Sad kad imaš database, možeš dodati:

### 1. Admin Dashboard

```bash
# Kreiraj admin stranicu
src/app/admin/orders/page.tsx

# Prikaži sve narudžbe
# Update order status
# Search/filter orders
```

### 2. Customer Portal

```typescript
// Customers mogu vidjeti svoje narudžbe
GET /api/orders/my-orders?email=customer@example.com
```

### 3. Email Notifikacije

```typescript
// U webhook-u, nakon spremanja:
await sendEmail({
  to: customerEmail,
  subject: "Order Confirmation",
  // Include order details
});
```

### 4. Inventory Tracking

```typescript
// Novi model u schema.prisma
model Wine {
  id           String @id
  name         String
  stock        Int    @default(0)
  // ...
}

// U webhook-u:
await updateWineStock(wineId, -quantity);
```

---

## ✅ Checklist

- [ ] Supabase account kreiran
- [ ] Database kreiran
- [ ] DATABASE_URL dodana u .env.local
- [ ] `npx prisma generate` izvršeno
- [ ] `npx prisma db push` izvršeno
- [ ] Dev server restartovan
- [ ] Test checkout izvršen
- [ ] Order se pojavio u Supabase Table Editor
- [ ] `/api/orders` endpoint radi
- [ ] Webhook logira "✅ Order saved to database"

---

## 🎉 Gotovo!

Sad imaš:

✅ PostgreSQL bazu (Supabase)  
✅ Prisma ORM integraciju  
✅ Automatsko spremanje narudžbi  
✅ API endpoints za narudžbe  
✅ Production-ready setup

**Database je spremna za produkciju! 🚀**

---

## 📚 Korisni Linkovi

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma + Next.js Guide](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

Trebaju li ti detalji za neki specifičan dio? 🍷
