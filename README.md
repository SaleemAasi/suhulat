# Zphone NextJS App

## Overview

This project is a **VOIP solution for call centers** built with **Next.js App Router**, **Redux**, and **Twilio SDK**.  
It supports **managing agents**, **making calls**, and **sending/receiving SMS**.

---

## Tech Stack

- **Next.js 15.3.5 (App Router)**
- **TypeScript**
- **Redux Toolkit** (state management)
- **Material UI (MUI)** (UI components)
- **MongoDB / Mongoose** (models & DB layer)
- **JWT Authentication**
- **Role-based access control** (Admin, Agent)
- **Ngrok** (for webhook tunneling in local development)
- **Pusher** (real-time events for call status, etc.)

---

## Features

- 🔑 **JWT Authentication** with server-side verification (`verifyAuth`)
- 👥 **Role-based views**:  
  - **Admin** → Manage users (CRUD, assign roles)  
  - **Agent** → Limited dashboard actions  
- 🌐 **Redux Toolkit** for global state (auth, users, etc.)
- 🛠 **Services Layer** for clean API calls
- 🗄 **Mongoose Models** for data persistence
- 🎨 **Material UI** styled UI (tables, dialogs, forms)
- 🔎 **Search, Pagination, and Filtering** for users
- 🔎 **Pusher**  For real-time events (e.g., call status updates)for users
- 🌍 **Ngrok support** for webhook integration during local testing

---

## Setup & Installation

```bash
# Clone the repo
git clone https://github.com/saqibomer/z-phone.git

# Move into folder
cd z-phone

# Install dependencies
npm install
```
## Environment Variables
Update .env and .env.local with your own credentials. Example:

```bash
JWT_SECRET=123123
MONGODB_URI=mongodb://localhost:27017/zphone

NEXT_PUBLIC_API_URL="https://78db693f612d.ngrok-free.app/api"
NEXT_PUBLIC_PUSHER_KEY=123123
NEXT_PUBLIC_PUSHER_CLUSTER=ap2

# Twilio Configuration
TWILIO_ACCOUNT_SID=123123
TWILIO_ACCOUNT_SID_SANDBOX=123123
TWILIO_API_KEY=123123
TWILIO_API_SECRET=123123
TWILIO_API_AUTH_TOKEN=123123
TWILIO_API_AUTH_TOKEN_SANDBOX=123123
TWILIO_TWIML_APP_SID=123123
TWILIO_TWIML_APP_TWIML_VOICE=https://78db693f612d.ngrok-free.app/api/twilio/voice
TWILIO_TWIML_APP_TWIML_SMS=https://78db693f612d.ngrok-free.app/api/twilio/sms
TWILIO_WEBHOOK_URL=https://78db693f612d.ngrok-free.app/api/twilio/call-webhook
TWILIO_WEBHOOK_SMS=https://78db693f612d.ngrok-free.app/api/twilio/sms-webhook

# Pusher Configuration
PUSHER_APP_ID=123123
PUSHER_KEY=123123
PUSHER_SECRET=123123
PUSHER_CLUSTER=ap2
PUSHER_USE_TLS=false


```   
## To-Do List

- [ ] Security verification for each page check if opening page without logging in allows
- [ ] Pagination check for calls with real data
- [ ] Pagination check for sms scrolling and conversation with real data
- [ ] When message is send it is wrongly being appended at top
- [ ] Add unit tests
