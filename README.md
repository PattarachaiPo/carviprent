# Prosper Plus Chauffeur — Web Prototype

Premium chauffeur booking website concept for an **Own Fleet**, **B2C + B2B**, responsive web platform.

## Project contents

```text
prosper-plus/
├── index.html                 # Responsive customer-facing website demo
├── README.md                  # Setup and Git instructions
└── docs/
    ├── requirements.md        # Functional requirements source
    └── requirements.html      # Browser-readable requirements document
```

## Run locally

No build tools or package installation are required.

- Open `index.html` directly in a browser, or
- Run a local static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages deployment

1. Create a GitHub repository, e.g. `prosper-plus`.
2. Upload/commit the project files to the repository root.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. After deployment, open the published GitHub Pages URL.

The homepage is `index.html`; requirements can be opened at `docs/requirements.html`.

## Prototype interactions

- Quick booking form validates required fields and basic date/location rules.
- Demo request is stored in `sessionStorage` and displayed as a browser alert.
- Vehicle category selection pre-fills the booking form.
- Booking tracking modal demonstrates the intended interaction.

## Important limitations

This is a front-end sample only. It does not perform live vehicle availability checks, pricing, booking persistence, customer authentication, payment processing, email/LINE notifications, Google Maps lookup or driver dispatch. The sample phone/email, vehicle capacities and prices are placeholders. Do not use it to accept real bookings or payments.

## Recommended next implementation steps

1. Implement API and database contracts from `docs/requirements.md`.
2. Build availability and quotation services.
3. Implement booking persistence and idempotent confirmation.
4. Integrate a payment gateway with verified webhooks.
5. Build Admin Dispatch, Fleet and Driver workflows.
6. Add privacy, security, legal and operational reviews.
