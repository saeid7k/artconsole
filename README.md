# ArtConsole

**ArtConsole** is a SaaS gallery management platform for art galleries. It provides a full back-office console to manage artworks, contacts, invoices, locations, and team members — with AI-powered assistance and subscription billing built in.

**Live app:** https://app.artconsole.ai

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
| Storage | Local (public disk) / AWS S3 |
| Auth | Laravel Breeze + Laravel Socialite (Google) |
| Billing | Laravel Cashier (Stripe) |
| AI | Laravel AI (Google Gemini) |

---

## Local Development

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+ and npm / Yarn
- MySQL
- (Optional) Puppeteer dependencies for PDF generation via Browsershot

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/saeid7k/artconsole.git
cd artconsole

# 2. Install PHP dependencies
composer install

# 3. Install JS dependencies
npm install
# or: yarn install

# 4. Copy and configure environment
cp .env.example .env
# Edit .env — see "External Services" section below

# 5. Generate application key
php artisan key:generate

# 6. Run database migrations and seeders
php artisan migrate --seed

# 7. Create the storage symlink
php artisan storage:link
```

### Running the Dev Server

Use the Composer `dev` script to start all services concurrently (Laravel server, queue worker, log watcher, and Vite):

```bash
composer dev
```

Or start services individually:

```bash
php artisan serve          # Laravel dev server  → http://localhost:8000
php artisan queue:listen   # Background job queue
npm run dev                # Vite HMR dev server
```

### Running Tests

```bash
composer test
# or: php artisan test
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

Register two webhooks in your Stripe dashboard pointing to:
- `https://your-domain.com/stripe/webhook` — subscription lifecycle events
- `https://your-domain.com/stripe/token-webhook` — token checkout events

### Google OAuth (Sign in with Google)

Enables Google social login via Laravel Socialite.

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback
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

### AWS S3 (File Storage — optional)

Optional alternative to local public disk storage for artwork images and media.

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
```

Leave `FILESYSTEM_DISK=public` to use local storage instead.

---

## License

This project is licensed under the [MIT License](LICENSE).
