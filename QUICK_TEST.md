# 🧪 Quick Test Guide - Stripe Integration

## ✅ Problem riješen: Metadata limit

**Greška koju si dobio:**

```
Metadata values can have up to 500 characters, but you passed in a value that is 585 characters.
```

**Što sam popravio:**

- ✅ Sada šaljemo **minimalne podatke**: samo `wineId:quantity` pairs
- ✅ Format: `"rose:2,merlot:1,crno:3"` (daleko ispod 500 char limita)
- ✅ Webhook dohvaća full wine details iz baze po potrebi

---

## 🚀 Testiraj sada

### 1. Restart Dev Server (važno!)

```bash
cd /Users/kristina/Documents/Project/vina/vina-ramljak-frontend
pnpm dev
```

### 2. Testiraj checkout flow

1. **Dodaj vino u košaricu** (npr. 2x Rosé, 1x Merlot)
2. **Idi u košaricu** (`/cart`)
3. **Klikni "Naruči"**
4. **Trebao bi biti preusmjeren na Stripe Checkout** ✅

### 3. Popuni Stripe formu

**Test kartica:**

- Broj: `4242 4242 4242 4242`
- CVV: `123`
- Datum: `12/34`
- ZIP: `12345`

**Shipping info:**

- Ime: Tvoje ime
- Adresa: Test Address 123
- Grad: Zagreb
- Poštanski broj: 10000
- Država: Croatia

### 4. Završi plaćanje

- Klikni "Pay"
- Trebao bi biti redirect na `/checkout/success` ✅
- Košarica bi trebala biti prazna ✅

---

## 🎯 Što očekivati

### U Browser Console:

```
✅ Success page loaded
✅ Cart cleared
```

### U Server Console (Terminal gdje ti radi pnpm dev):

```
No errors!
Payment completed successfully
```

---

## 🔍 Provjeri što se šalje Stripe-u

### Metadata format (novi):

```json
{
  "orderSummary": "rose:2,merlot:1", // ✅ Kratak format
  "subtotal": "58.00",
  "itemCount": "2"
}
```

**Stari format (koji je pravio problem):**

```json
{
  "items": "[{id:'rose',name:'...',description:'...',tastingNotes:[...]}]" // ❌ Previše karaktera
}
```

---

## 🪝 (Opciono) Testiraj Webhook Locally

### Setup (samo ako želiš):

```bash
# Terminal 1: Dev server (već radi)
pnpm dev

# Terminal 2: Stripe CLI webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Kopiraj `whsec_...` secret i dodaj u `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

Restart server.

### Testiraj webhook:

```bash
# Terminal 3
stripe trigger checkout.session.completed
```

### Očekivani output u Terminal 2:

```
✅ Checkout session completed: cs_test_...
Order details: {
  orderId: 'cs_test_...',
  customerEmail: 'test@example.com',
  items: [
    { wineId: 'rose', quantity: 2 },
    { wineId: 'merlot', quantity: 1 }
  ],
  amount: 58
}
Order cs_test_... processed successfully with 2 items
```

---

## ✅ Checklist

- [ ] Server restartovan
- [ ] Dodao vino u košaricu
- [ ] Checkout radi (redirect na Stripe)
- [ ] Uspješno platio sa test karticom
- [ ] Redirect na success page
- [ ] Košarica ispražnjena
- [ ] Nema errora u konzoli

---

## 🐛 Ako nešto ne radi

### Problem: Još uvijek metadata error

**Rješenje:**

```bash
# Clear cache i restart
rm -rf .next
pnpm dev
```

### Problem: Checkout ne radi

**Provjeri `.env.local`:**

```bash
cat .env.local
```

Trebao bi vidjeti:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Problem: Redirect ne radi

Provjeri da je `NEXT_PUBLIC_APP_URL=http://localhost:3000` postavljen.

---

## 📊 Debug Info

### Kako vidjeti što se šalje Stripe-u:

U `src/app/api/checkout/route.ts`, dodaj prije `stripe.checkout.sessions.create`:

```typescript
console.log("Creating session with metadata:", {
  orderSummary,
  subtotal: subtotal.toFixed(2),
  itemCount: items.length.toString(),
});
```

### Kako vidjeti što webhook prima:

U `src/app/api/webhooks/stripe/route.ts`, već ima console.log:

```typescript
console.log("Order details:", {
  orderId,
  customerEmail,
  items,
  amount,
});
```

---

## 🎉 Ako sve radi

Čestitam! Imaš potpuno funkcionalan Stripe checkout sa:

✅ Cart management  
✅ Stripe Checkout integracija  
✅ Success/Cancel pages  
✅ Webhook support (spreman za produkciju)  
✅ Minimal metadata (optimizirano)  
✅ Order tracking spremno za bazu

### Sljedeći koraci:

1. **Deploy na produkciju** (Vercel/Netlify)
2. **Setup production Stripe webhook**
3. **Dodaj bazu podataka** (Prisma + PostgreSQL)
4. **Dodaj email notifikacije** (Resend/SendGrid)
5. **Dodaj admin panel** za pregled narudžbi

---

## 💬 Feedback

Javi kako je prošlo testiranje! 🍷
