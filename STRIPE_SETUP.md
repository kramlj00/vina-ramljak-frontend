# Stripe Checkout Setup Guide

## 🚀 Quick Start

### 1. Dobivanje Stripe API ključeva

1. Idi na [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Kreiraj account ili se prijavi
3. Prebaci se u **Test mode** (toggle u gornjem desnom kutu)
4. Idi na **Developers** → **API keys**
5. Kopiraj:
   - **Publishable key** (počinje s `pk_test_`)
   - **Secret key** (klikni "Reveal test key", počinje s `sk_test_`)

### 2. Konfiguracija Environment Variables

1. Kreiraj `.env.local` file u root direktoriju projekta:

```bash
touch .env.local
```

2. Dodaj svoje Stripe ključeve:

```env
# Stripe Keys (TEST MODE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Webhook Secret (dobićeš ga preko Stripe CLI)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

⚠️ **VAŽNO**: Zamijeni `your_publishable_key_here` i `your_secret_key_here` sa svojim stvarnim ključevima!

### 2b. Postavljanje Webhook-a (LOCAL)

Za local development:

```bash
# Instaliraj Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks na local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Kopiraj webhook secret koji počinje sa `whsec_` i dodaj ga u `.env.local`

### 3. Restartuj Dev Server

```bash
pnpm dev
```

## 🧪 Testiranje

### Test kartice za Stripe:

- **Uspješna transakcija**: `4242 4242 4242 4242`
- **Odbijeno plaćanje**: `4000 0000 0000 0002`
- **Potrebna autentifikacija**: `4000 0025 0000 3155`

**CVV**: bilo koja 3 broja (npr. 123)  
**Datum isteka**: bilo koji budući datum (npr. 12/34)  
**ZIP**: bilo koji 5-znamenkasti broj (npr. 12345)

### Testni flow:

1. Dodaj proizvode u košaricu
2. Idi u košaricu (`/cart`)
3. Klikni "Naruči"
4. Popuni Stripe checkout formu s test karticom
5. Trebao bi biti preusmjeren na `/checkout/success`
6. Košarica bi trebala biti ispražnjena

## 📁 Kreirane datoteke

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts           # API endpoint za Stripe checkout
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts       # Webhook handler (KRITIČNO!)
│   └── checkout/
│       ├── success/
│       │   └── page.tsx           # Uspješna kupnja
│       └── cancel/
│           └── page.tsx           # Otkazana kupnja
├── lib/
│   └── stripe.ts                  # Stripe client helper
├── types/
│   └── order.ts                   # Order model/types
├── context/
│   └── cart-context.tsx           # Cart state management
└── features/
    └── cart/
        └── cart-view.tsx          # Cart page s checkout funkcijom

Dokumentacija:
├── STRIPE_SETUP.md                # Basic Stripe setup
└── WEBHOOK_SETUP.md               # Webhook setup (PROČITAJ!)
```

## 🌍 Production Setup

Kada budeš spreman za production:

1. U Stripe Dashboardu, prebaci se u **Production mode**
2. Generiraj nove Production API ključeve
3. **Kreiraj Production Webhook** (KRITIČNO!):
   - Idi na Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Odaberi events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Kopiraj Signing Secret
4. U hosting platformi (Vercel/Netlify), dodaj environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...` ⚠️ **NOVI - KRITIČNO!**
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`

⚠️ **BEZ WEBHOOK-A, produkcija NEĆE raditi pouzdano!** Pogledaj `WEBHOOK_SETUP.md` za detalje.

## 🔒 Sigurnost

- ✅ **NIKADA** ne commitaj `.env.local` u git
- ✅ `.env.local` je već u `.gitignore`
- ✅ Secret key (`sk_`) se koristi SAMO na serveru
- ✅ Publishable key (`pk_`) je siguran za klijent

## 📚 Dokumentacija

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## 🛠️ Troubleshooting

### Problem: "Stripe key is not set"

**Rješenje**: Provjeri da li si:

1. Kreirao `.env.local` file
2. Dodao ispravne ključeve
3. Restartovao dev server nakon dodavanja ključeva

### Problem: "Cannot read properties of null"

**Rješenje**: Provjeri da li su environment variables pravilno postavljeni:

```bash
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

Ako je prazan, moraš restartovati server.

## 💡 Features

✅ Stripe Checkout integracija  
✅ **Webhook support** (critical for production!)  
✅ Automatsko pražnjenje košarice nakon kupnje  
✅ Success i Cancel stranice  
✅ Loading states  
✅ Error handling  
✅ Multi-language support (HR/EN)  
✅ Responsive design  
✅ LocalStorage perzistencija  
✅ Order metadata tracking  
✅ Payment event handling

## 📞 Support

Ako imaš problema:

1. Provjeri [Stripe dokumentaciju](https://stripe.com/docs)
2. Provjeri [Stripe status](https://status.stripe.com/)
3. Koristi [Stripe test mode](https://stripe.com/docs/testing) za debugging
