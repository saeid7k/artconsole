# ArtConsole

**ArtConsole** is a SaaS gallery management platform for art galleries. It provides a full back-office console to manage artworks, contacts, invoices, locations, and team members — with AI-powered assistance and subscription billing built in.

**Live app:** https://app.artconsole.io

---

## Features

- **Dashboard** — At-a-glance overview of key gallery metrics and recent activity.
- **Artwork Management** — Full CRUD for artworks including multi-image upload, SKU generation, location tracking, financial records, status updates, document generation (PDF), and mass operations.
- **Gallery Management** — Multi-gallery support per account; manage logo, address, metadata, and settings per gallery.
- **Contact Management** — Track artists, collectors, and other contacts; attach relationships, invoices, and profile photos.
- **Invoice Management** — Create, update, and send PDF invoices via email; track payment status; download invoice PDFs.
- **Payment Tracking** — Log and delete payments against invoices.
- **Reports** — Generate, download, and regenerate custom reports as PDFs.
- **Locations** — Manage multiple physical storage/display locations for artworks; set primary location.
- **Tags** — Create and assign grouped tags to artworks and contacts.
- **Tax Configuration** — Define and manage tax rates; set a default tax rate per gallery.
- **Subscriptions & Billing** — Stripe-powered subscription plans; manage payment methods, billing details, and subscription lifecycle (subscribe, cancel, resume).
- **Token System** — Purchase AI token packages via Stripe; track transaction history.
- **AI Assistant** — Gemini-powered sidebar assistant for contextual help; AI-generated artwork descriptions and room mockup images.
- **Team Members** — Invite users to a gallery via invite links; manage access levels and remove members.
- **Notifications** — In-app notification centre with mark-as-read/unread support.
- **Activity Logs** — Per-model audit trail of changes.
- **User Management** — Admin panel to view and delete users.
- **Google OAuth** — Sign in with Google via Laravel Socialite.
- **Dark Mode** — Full dark/light mode toggle throughout the UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.3, Laravel 13 |
| Frontend | React 19, TypeScript, Inertia.js |
| UI | Ant Design 6, Tailwind CSS 4 |
| Database | MySQL |
| Queue | Database queue driver |
| PDF | DomPDF, Spatie Laravel PDF (Browsershot/Puppeteer) |
| Storage | AWS S3 (production) / Local public disk (development) |
| Auth | Laravel Breeze + Laravel Socialite (Google) |
| Billing | Laravel Cashier (Stripe) |
| AI | Laravel AI (Google Gemini) |
| Infrastructure | Docker, Docker Compose, Nginx, Redis |

---

## Local Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
- MySQL running on the host (the app connects via `host.docker.internal`)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/saeid7k/artconsole.git
cd artconsole

# 2. Copy and configure environment
cp .env.example .env
# Edit .env — set DB_USERNAME, DB_PASSWORD, and any external service keys (see below)

# 3. Start all containers
docker compose up -d
```

On first start the entrypoint automatically runs `composer install` and generates `APP_KEY` if missing.

### Services

| Service | URL / Port |
|---|---|
| App (Nginx) | http://localhost:8080 |
| Vite HMR | http://localhost:5173 |
| Redis | localhost:6380 |

Queue worker, scheduler, and Pulse worker each run as separate containers and start automatically with `docker compose up`.

### First-Time Database Setup

```bash
docker compose exec app php artisan app:initial-setup
```

> Resets and seeds the database. Only run once (or when you want a clean slate).

### Running Tests

```bash
docker compose exec app php artisan test
```

### Useful Commands

```bash
docker compose exec app bash                 # Shell into app container
docker compose exec app php artisan <cmd>    # Run any Artisan command
docker compose exec app composer <cmd>       # Run any Composer command
docker compose logs -f app                   # Tail app logs
docker compose down                          # Stop all containers
docker compose build --no-cache             # Rebuild images
```

---

## External Services Configuration

All service credentials are configured in `.env`. Copy `.env.example` and fill in the values below.

### Stripe (Billing & Subscriptions)

Handles subscription plans and token package purchases via Laravel Cashier.

```env
STRIPE_KEY=pk_live_...          # Stripe publishable key
STRIPE_SECRET=sk_live_...       # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret for subscription events
STRIPE_TOKEN_WEBHOOK_SECRET=whsec_... # Webhook signing secret for token purchase events
```

Register two webhooks in your [Stripe dashboard](https://dashboard.stripe.com/webhooks) pointing to:

**`https://app.artconsole.io/stripe/webhook`** — subscription lifecycle events (Laravel Cashier)
Enable the following events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `invoice.payment_action_required`
- `payment_method.automatically_updated`
- `customer.updated`
- `customer.deleted`

**`https://app.artconsole.io/stripe/token-webhook`** — token package purchases
Enable the following events:
- `checkout.session.completed`

#### Local webhook forwarding

Use the [Stripe CLI](https://docs.stripe.com/stripe-cli) to forward events to your local server while developing:

```bash
# Install the CLI then log in
stripe login

# Forward subscription webhook events
stripe listen --forward-to http://localhost:8000/stripe/webhook

# In a second terminal, forward token purchase webhook events
stripe listen --forward-to http://localhost:8000/stripe/token-webhook
```

The CLI will print a temporary `whsec_...` signing secret for each listener. Use those values for `STRIPE_WEBHOOK_SECRET` and `STRIPE_TOKEN_WEBHOOK_SECRET` in your local `.env` while testing.

### Google OAuth (Sign in with Google)

Enables Google social login via Laravel Socialite.

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://app.artconsole.io/auth/google/callback
```

Create OAuth 2.0 credentials in the [Google Cloud Console](https://console.cloud.google.com/) and add the redirect URI to the list of authorised redirect URIs.

### SMTP / Email

Used for sending invoice emails, authentication emails, and notifications. The example uses [Brevo (Sendinblue)](https://brevo.com) but any SMTP provider works.

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_FROM_ADDRESS=app@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Google Gemini (AI)

Powers the AI assistant sidebar, artwork description generation, and room mockup image generation via `laravel/ai`.

```env
GEMINI_API_KEY=...
```

Obtain an API key from [Google AI Studio](https://aistudio.google.com/).

### OpenCage (Geocoding)

Resolves latitude/longitude coordinates from addresses for artwork location features.

```env
OPENCAGE_API_KEY=...
```

Obtain an API key from [OpenCage](https://opencagedata.com/).

### AWS S3 (File Storage)

AWS S3 is the primary file storage driver used in production for artwork images and media. Local public disk storage is also supported and is the recommended choice for local development.

**Production (S3):**

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
```

**Local development (public disk):**

```env
FILESYSTEM_DISK=public
```

Set `FILESYSTEM_DISK=public` in your local `.env` to skip S3 configuration entirely and serve files from the `public/drive` directory.

---

## License

This project is licensed under the [MIT License](LICENSE).
