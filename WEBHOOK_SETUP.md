# Stripe Webhook Setup Guide

## 🎯 Zašto webhooks?

Webhooks su **KRITIČNI** za produkciju jer:

✅ **Pouzdano procesiranje** - Server-side obrada plaćanja  
✅ **Ne ovisi o korisniku** - Radi čak i ako korisnik zatvori browser  
✅ **Potpuna kontrola** - Dobivate sve Stripe događaje  
✅ **Pravi status** - Znate stvarni status plaćanja  
✅ **Email notifikacije** - Pouzdano slanje potvrdi  
✅ **Order tracking** - Spremanje narudžbi u bazu  
✅ **Refund handling** - Automatska obrada povrata novca

---

## 📁 Što je implementirano

### Webhook endpoint: `/api/webhooks/stripe`

Obrađuje sljedeće Stripe događaje:

1. **`checkout.session.completed`** ✅

   - Poziva se kada korisnik uspješno završi checkout
   - Idealno za spremanje narudžbe u bazu
   - Šaljete email potvrdu
   - Updateate inventory

2. **`payment_intent.succeeded`** ✅

   - Payment je uspješno naplaćen
   - Update order status na "paid"

3. **`payment_intent.payment_failed`** ❌

   - Payment nije uspio
   - Notificiraj korisnika
   - Update order status na "failed"

4. **`charge.refunded`** 💰
   - Refund je izdan
   - Restore inventory
   - Notificiraj korisnika

---

## 🚀 Local Development Setup

### 1. Instaliraj Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# ili download binary:
# https://stripe.com/docs/stripe-cli
```

### 2. Login u Stripe

```bash
stripe login
```

### 3. Forward webhooks na local

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Dobit ćeš webhook signing secret koji počinje s `whsec_`

### 4. Dodaj Webhook Secret u `.env.local`

```env
# Add this to your .env.local
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 5. Testiraj webhook

U drugom terminalu:

```bash
stripe trigger checkout.session.completed
```

Trebao bi vidjeti log u konzoli gdje ti radi `stripe listen`.

---

## 🌍 Production Setup

### 1. Kreiraj Webhook u Stripe Dashboard

1. Idi na [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Klikni **"Add endpoint"**
3. Dodaj URL: `https://your-domain.com/api/webhooks/stripe`
4. Odaberi događaje:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Kopiraj **Signing secret** (počinje s `whsec_`)

### 2. Dodaj Production Webhook Secret

U svom hosting provideru (Vercel, Netlify, etc.):

```env
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

### 3. Test Production Webhooks

U Stripe Dashboard → Webhooks → tvoj endpoint → **Send test webhook**

---

## 🧪 Testiranje Webhook-a

### Locally sa Stripe CLI:

```bash
# Terminal 1: Run your Next.js app
pnpm dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: Trigger events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

### Provjeravaj logove:

```bash
# U terminalu gdje ti radi stripe listen
# Vidjet ćeš sve događaje koji dolaze

# U konzoli Next.js app-a
# Vidjet ćeš console.log outpute iz webhook handlera
```

---

## 📋 Što Webhook radi

### ✅ checkout.session.completed

```typescript
- Parsea minimal order data iz metadata (wineId:quantity pairs)
- Dobiva customer info (email, name, address)
- Extrahuje payment details (amount, currency, status)
- TODO: Dohvaća full wine details iz baze koristeći wineId
- TODO: Sprema narudžbu u bazu podataka
- TODO: Šalje confirmation email korisniku
- TODO: Updatea inventory (smanjuje zalihe)
- Console log za debugging

⚠️ NAPOMENA: Metadata sadrži samo "wineId:quantity" (npr. "rose:2,merlot:1")
             zbog Stripe limita od 500 karaktera po polju.
             Full wine detalje trebaš dohvatiti iz baze/API-ja.
```

### ✅ payment_intent.succeeded

```typescript
- Potvrđuje da je payment prošao
- TODO: Updatea order status na "paid"
- Console log payment detalja
```

### ❌ payment_intent.payment_failed

```typescript
- Registruje failed payment
- TODO: Notificiraj korisnika o grešci
- TODO: Updatea order status na "failed"
- Console log error detalja
```

### 💰 charge.refunded

```typescript
- Registruje refund
- TODO: Procesira refund (restore inventory)
- TODO: Šalje refund confirmation email
- Console log refund detalja
```

---

## 🔐 Sigurnost

### Webhook Signature Verification ✅

```typescript
// Webhook automatski verificira Stripe signature
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

Ovo osigurava da webhook dolazi od Stripe-a, ne od napadača.

### Best Practices:

1. ✅ **UVIJEK** verificiraj signature
2. ✅ **NIKADA** ne trustaj request body bez verifikacije
3. ✅ Webhook secret čuvaj kao environment variable
4. ✅ Return 200 status code brzo (prije heavy processing)
5. ✅ Logiraj sve događaje za debugging

---

## 🗄️ Sljedeći Koraci (Integracija s Bazom)

Webhook je spreman, samo treba dodati:

### 1. Database Integration

```typescript
// U webhook handleru, umjesto TODO komentara:

import { prisma } from "@/lib/prisma"; // ili tvoj ORM
import { getWineById } from "@/lib/wines"; // tvoja funkcija za dohvat vina

async function handleCheckoutSessionCompleted(session) {
  // Parse minimal order data (format: "rose:2,merlot:1,crno:3")
  const orderSummary = session.metadata.orderSummary;
  const minimalItems = orderSummary.split(",").map((item) => {
    const [wineId, quantity] = item.split(":");
    return { wineId, quantity: parseInt(quantity) };
  });

  // Fetch full wine details for each item
  const fullItems = await Promise.all(
    minimalItems.map(async (item) => {
      const wine = await getWineById(item.wineId);
      return {
        wineId: item.wineId,
        name: wine.name,
        price: wine.price,
        quantity: item.quantity,
      };
    })
  );

  // Save to database
  await prisma.order.create({
    data: {
      id: session.id,
      customerEmail: session.customer_details.email,
      customerName: session.customer_details.name,
      total: session.amount_total / 100,
      status: "completed",
      items: fullItems, // Now with complete data
      shippingAddress: session.customer_details.address,
    },
  });
}
```

⚠️ **Važno**: Webhook prima samo `wineId` i `quantity` iz metadata.
Trebaš dohvatiti full wine details (name, price, description...) iz svoje baze podataka.

### 2. Email Service Integration

```typescript
// Koristi Resend, SendGrid, Postmark...
import { sendEmail } from "@/lib/email";

await sendEmail({
  to: customerEmail,
  subject: "Order Confirmation",
  template: "order-confirmation",
  data: { orderId, items, total },
});
```

### 3. Inventory Management

```typescript
// Update product quantities
await updateProductQuantities(items);
```

---

## 🐛 Troubleshooting

### Problem: "Metadata values can have up to 500 characters"

**Rješenje**: ✅ **RIJEŠENO!**

- Sada šaljemo minimal order data: samo `wineId:quantity` pairs
- Format: `"rose:2,merlot:1,crno:3"` umjesto cijelog items array-a
- U webhook-u dohvaćaš full wine details iz baze koristeći wineId

### Problem: "No signature provided"

**Rješenje**:

- Provjeri da je request raw (ne JSON parsed)
- Next.js automatski parsea body, webhook ruta mora koristiti `req.text()`

### Problem: "Webhook signature verification failed"

**Rješenje**:

- Provjeri da li je `STRIPE_WEBHOOK_SECRET` postavljen
- Za local development, koristi `stripe listen`
- Za production, kopiraj secret iz Stripe Dashboard

### Problem: Webhook se ne poziva

**Rješenje**:

- Provjeri da je endpoint javno dostupan (production)
- Lokalno, koristi `stripe listen` za forwarding
- Provjeri Stripe Dashboard → Webhooks za error logove

### Problem: Duplicate events

**Rješenje**:

- Stripe može poslati isti event više puta
- Implementiraj idempotency (koristi `event.id` kao unique key)

---

## 📊 Monitoring

### Stripe Dashboard

- **Webhooks** tab → Vidi sve poslane webhooks
- **Event logs** → Vidi response time i status code
- **Failed webhooks** → Automatski retry logic

### Tvoj Server

```typescript
// Dodaj logging u production
console.log("[WEBHOOK]", event.type, event.id);

// Ili koristi logging service (LogRocket, Sentry, etc.)
logger.info("Webhook received", {
  type: event.type,
  id: event.id,
});
```

---

## ✅ Checklist za Production

- [ ] Webhook endpoint je deployovan
- [ ] Production webhook je kreiran u Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` je postavljen u production env
- [ ] Testirano sa "Send test webhook" u Dashboardu
- [ ] Monitoring setup (logovi, alertovi)
- [ ] Error handling implementiran
- [ ] Database save funkcionira
- [ ] Email notifikacije rade
- [ ] Inventory update funkcionira
- [ ] Idempotency handling (za duplicate events)

---

## 📚 Dodatna Dokumentacija

- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Event Types](https://stripe.com/docs/api/events/types)

---

## 💡 Tips

### Brzo Testiranje

```bash
# Send test event odmah
stripe trigger checkout.session.completed --add checkout_session:metadata[orderId]=test123

# Vidi sve dostupne test events
stripe trigger --help
```

### Webhook Event Filtering

Možeš slušati samo specifične događaje:

```bash
stripe listen \
  --events checkout.session.completed,payment_intent.succeeded \
  --forward-to localhost:3000/api/webhooks/stripe
```

### Debug Mode

```bash
# Vidi detaljne webhook payloade
stripe listen --print-json --forward-to localhost:3000/api/webhooks/stripe
```

---

Webhook sistem je **ključan** za pouzdanu e-commerce aplikaciju! 🎉
