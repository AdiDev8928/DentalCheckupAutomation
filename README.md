# 🦷 DentalCheckupAutomation

A modern, AI-powered dental checkup and appointment enquiry application built with **React, TypeScript, Vite, Express.js, Google Gemini, Tailwind CSS, and n8n automation**.

The application provides a responsive dental-care interface where users can submit their details and appointment requirements. Submitted information can be forwarded securely to an **n8n webhook**, allowing external workflows to automate follow-up processes such as notifications, data processing, lead management, or appointment workflows.

---

## ✨ Features

* 🦷 Modern dental checkup web interface
* ⚛️ React-based responsive frontend
* 🎨 Tailwind CSS styling
* 🤖 Google Gemini API integration
* 🔄 n8n webhook automation
* 🚀 Express.js backend
* 🔗 Server-side webhook proxy
* 🧪 Built-in mock n8n webhook for local testing
* ❤️ Health-check API endpoint
* ⚡ Vite-powered development environment
* 📱 Responsive user interface
* 🔐 Environment-variable based API configuration

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      User / Patient │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   TypeScript + UI   │
                    └──────────┬──────────┘
                               │
                               │ Submit enquiry
                               ▼
                    ┌─────────────────────┐
                    │   Express Server    │
                    │   /api/proxy-webhook│
                    └──────────┬──────────┘
                               │
                               │ HTTP POST
                               ▼
                    ┌─────────────────────┐
                    │     n8n Webhook     │
                    │     Automation      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ External Workflows  │
                    │ Notifications / CRM │
                    │ Processing / Actions│
                    └─────────────────────┘
```

The Express server acts as a proxy between the frontend and the external n8n webhook. The repository implements `/api/proxy-webhook` to forward JSON payloads to the configured webhook endpoint and return the webhook response to the application.

---

## 🛠️ Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Lucide React
* Motion

### Backend

* Node.js
* Express.js
* TypeScript
* Vite middleware

### AI

* Google Gemini API
* `@google/genai`

### Automation

* n8n
* HTTP Webhooks
* JSON-based workflow payloads

### Development Tools

* npm
* TypeScript
* tsx
* esbuild
* Git / GitHub

The repository's `package.json` explicitly includes React, Vite, Tailwind CSS, Express, Motion, Lucide React, dotenv and Google's GenAI SDK.

---

## 📂 Project Structure

```text
DentalCheckupAutomation/
│
├── src/
│   └── ...                  # React application source
│
├── server.ts                # Express + Vite server
├── index.html               # Application entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
├── package-lock.json
├── metadata.json
├── .env.example             # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* npm installed
* A Google Gemini API key
* An n8n instance if you want to use the real automation workflow

---

### 1. Clone the repository

```bash
git clone https://github.com/AdiDev8928/DentalCheckupAutomation.git

cd DentalCheckupAutomation
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env.local` file and configure your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The original project instructions require `GEMINI_API_KEY` to be configured before running the application.

> **Important:** Never commit your actual API key to GitHub.

---

### 4. Start the development server

```bash
npm run dev
```

The application runs on:

```text
http://localhost:3000
```

The repository's Express server listens on port `3000` and integrates Vite middleware during development.

---

## 🔄 n8n Automation

One of the main components of this project is the integration between the web application and **n8n**.

When a user submits a dental enquiry, the frontend can send the information to:

```text
/api/proxy-webhook
```

The Express server receives:

```json
{
  "webhookUrl": "https://your-n8n-instance/webhook/...",
  "payload": {
    "...": "..."
  }
}
```

The backend then forwards the payload to the supplied n8n webhook using an HTTP `POST` request.

The proxy includes:

* JSON request handling
* 10-second request timeout
* HTTP status handling
* JSON response parsing
* Network-error handling
* Localhost detection
* n8n response forwarding

These behaviors are implemented directly in `server.ts`.

---

## 🧪 Mock n8n Webhook

For local development and testing, the project includes a built-in mock webhook:

```text
POST /api/mock-n8n-webhook
```

This endpoint accepts the enquiry payload and returns a successful response containing information such as:

* Submission ID
* Patient name
* Patient email
* Requested treatment
* Timestamp

This makes it possible to test the application's automation flow without immediately connecting to a live n8n instance.

---

## ❤️ Health Check

The backend also exposes:

```text
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "timestamp": "2026-09-17T00:00:00.000Z"
}
```

This endpoint can be used to verify that the backend service is running correctly.

---

## 📦 Available Scripts

### Development

```bash
npm run dev
```

Starts the TypeScript/Express development server with Vite.

### Production Build

```bash
npm run build
```

Builds the frontend with Vite and bundles the Express server using esbuild.

### Production Start

```bash
npm start
```

Starts the generated production server.

### Preview

```bash
npm run preview
```

Runs the Vite production preview.

### Type Checking

```bash
npm run lint
```

Runs TypeScript without emitting compiled files.

These scripts are defined in the repository's `package.json`.

---

## 🌐 Production Webhook Considerations

If the application is deployed to a cloud environment, an n8n webhook running on your personal computer at:

```text
http://localhost:5678
```

cannot normally be reached directly by the deployed application.

For development, you can expose your local n8n instance through a secure tunneling solution such as **ngrok**, or use a publicly accessible n8n deployment.

For example:

```text
https://your-public-domain/webhook/dental-checkup
```

The server itself detects localhost webhook URLs and returns an informative error when a cloud deployment cannot reach the user's local machine.

---

## 🔐 Security

Recommended security practices:

* Store API keys in environment variables.
* Never commit `.env` files containing secrets.
* Use HTTPS for production webhook endpoints.
* Validate webhook URLs before forwarding requests.
* Add authentication/signatures to production webhook endpoints.
* Restrict CORS and API access when deploying publicly.
* Avoid sending unnecessary patient information through external services.

> This project is a software automation application and should not be treated as a medical diagnostic system.

---

## 🔮 Future Improvements

Potential improvements include:

* [ ] Persistent patient database
* [ ] Authentication and role-based access
* [ ] Admin dashboard
* [ ] Appointment calendar integration
* [ ] Email notifications
* [ ] WhatsApp notifications
* [ ] Google Calendar integration
* [ ] Appointment status tracking
* [ ] Patient enquiry history
* [ ] Production-grade webhook authentication
* [ ] Automated deployment with CI/CD
* [ ] Automated testing
* [ ] Analytics dashboard

---

## 👨‍💻 Author

**Adityaa Mohan Negi**

Full Stack Developer | AI/ML Developer

* GitHub: https://github.com/AdiDev8928
* LinkedIn: https://linkedin.com/in/adityaa-negi-679804278
* Email: [adityadeveloper8928@gmail.com](mailto:adityadeveloper8928@gmail.com)

---

## 📄 License

This project currently does not specify a license in the repository.

If you intend to make the project open source, consider adding an appropriate license such as MIT.
