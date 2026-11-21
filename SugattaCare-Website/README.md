# Sugatta Care Foundation website

This is the supplied Sugatta Care Foundation HTML organized into a simple static website project.

## Project structure

```text
SugattaCare-Organized/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── site.js
│   └── chatbot.js
└── assets/
    └── images/
        ├── image-01.jpg
        └── ...
```

## Run in VS Code

For the contact form and Resend API to work, use Node.js 18 or newer:

```bash
cp .env.example .env
# Add your RESEND_API_KEY to .env
npm start
```

Then open `http://localhost:4173`. Opening `index.html` directly or using Live Server will show the page, but the `/api/contact` endpoint will not be available.

## What was organized

- The original page content, layout, wording, section IDs, and existing visual styling are retained.
- The inline CSS was moved to `css/style.css`.
- The two inline JavaScript blocks were moved, unchanged, to `js/site.js` and `js/chatbot.js`.
- Embedded JPEG images were extracted into `assets/images/` and the HTML references were updated.
- The original script order is preserved.

## Resend contact email

The contact form posts to the local Node server, which sends the message through Resend. The Resend API key stays server-side and is never sent to the browser.

1. Copy `.env.example` to `.env`.
2. Add your Resend API key.
3. Set `CONTACT_FROM_EMAIL` to a sender address from a verified Resend domain.
4. Run `npm start` from this folder.
5. Open `http://localhost:4173`.

The frontend uses `POST /api/contact`; the server validates the fields, applies a small rate limit and sends the email to `CONTACT_TO_EMAIL`.

## Existing behavior

The WhatsApp button uses the number already present in the supplied source.

## Editing guide

- Page text and sections: `index.html`
- Colors, spacing, responsive layout and other styling: `css/style.css`
- Main site interactions, donation controls and contact-form behavior: `js/site.js`
- Chatbot behavior and knowledge base: `js/chatbot.js`
- Photos and logo: `assets/images/`
