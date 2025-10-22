# 🚀 Quick Start - Database Setup (5 minutes)

Brzi vodič za pokretanje Supabase baze podataka.

---

## ⚡ 5-Minute Setup

### Step 1: Supabase Account (2 min)

```bash
# 1. Open: https://supabase.com
# 2. Click "Start your project"
# 3. Sign up with GitHub (najbrže)
```

### Step 2: Create Project (2 min)

```
Name: vina-ramljak
Password: [Generate strong password] ⚠️ SPREMI GA!
Region: Europe West (Frankfurt)
Plan: Free
```

Click **"Create new project"** → Pričekaj 2-3 min...

### Step 3: Get Database URL (30 sec)

```bash
# U Supabase Dashboard:
Settings (⚙️) → Database → Connection string → URI

# Kopiraj connection string
```

### Step 4: Add to .env.local (30 sec)

```bash
# Kreiraj ili edita .env.local u root direktoriju:

DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@...supabase.com:5432/postgres"
```

⚠️ **Zamijeni sa svojim connection stringom!**

### Step 5: Setup Database (1 min)

```bash
# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma db push
```

**Output:**

```
✔ Generated Prisma Client
✔ Database synchronized with Prisma schema
```

### Step 6: Restart Server (10 sec)

```bash
# Stop trenutni server (Ctrl+C)
pnpm dev
```

---

## ✅ Test Da Li Radi

### 1. Test Checkout

```bash
1. http://localhost:3000
2. Dodaj vino u košaricu
3. Klikni "Naruči"
4. Test kartica: 4242 4242 4242 4242
5. Plati
```

### 2. Check Database

```bash
# Supabase Dashboard → Table Editor → orders
# Trebao bi vidjeti novu narudžbu! 🎉
```

### 3. Check API

```bash
# U browser:
http://localhost:3000/api/orders

# Response:
{
  "orders": [...],
  "total": 1
}
```

### 4. Check Console

```bash
# U terminalu gdje ti radi dev server:
✅ Checkout session completed: cs_test_...
✅ Order saved to database: cm1234567890
Order cs_test_... processed successfully
```

---

## 🎉 Gotovo!

Imaš:

- ✅ PostgreSQL bazu (Supabase)
- ✅ Automatsko spremanje narudžbi
- ✅ API za pregled narudžbi
- ✅ Production-ready setup

---

## 🐛 Problem?

### "Can't reach database server"

```bash
# Provjeri DATABASE_URL:
cat .env.local | grep DATABASE_URL

# Restart server
pnpm dev
```

### "Table doesn't exist"

```bash
# Resetuj i pusni schema
npx prisma db push --force-reset
```

### Webhook ne sprema

```bash
# Provjeri console logs za errore
# Provjeri da li prisma client generiran:
npx prisma generate
```

---

## 📚 Detaljnije Upute

- **`SUPABASE_SETUP.md`** - Kompletan setup guide
- **`DATABASE_INTEGRATION_SUMMARY.md`** - Što je sve implementirano
- **`WEBHOOK_SETUP.md`** - Webhook dokumentacija

---

## 🎨 Sljedeći Koraci

### Explore Data

```bash
# Otvori Prisma Studio (GUI za bazu)
npx prisma studio

# Otvara se na http://localhost:5555
```

### Provjeri Narudžbe

```typescript
// GET all orders
http://localhost:3000/api/orders

// GET with pagination
http://localhost:3000/api/orders?limit=20&offset=0

// GET by status
http://localhost:3000/api/orders?status=PAID
```

### Build Admin Dashboard

Sad kad imaš bazu, možeš kreirati admin stranicu za pregled narudžbi!

---

**Happy coding! 🍷**
