# HBPlus Auth — Cross-Platform Google OAuth Application

> **React Native + React Native Web · Firebase Auth · Firestore · TypeScript**
> Runs on Android, iOS, and Web from a **single codebase**.

---

## 📸 Application Preview

![HBPlus Login Screen](assets/screenshots/login-screen.png)

---

## Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Folder Structure](#-folder-structure)
5. [Prerequisites](#-prerequisites)
6. [Installation](#-installation)
7. [Environment Variables](#-environment-variables)
8. [Firebase Setup](#-firebase-setup)
9. [Google OAuth Configuration](#-google-oauth-configuration)
10. [Platform-Specific Setup](#-platform-specific-setup)
11. [Running the App](#-running-the-app)
12. [Authentication Flow](#-authentication-flow)
13. [Domain Restriction](#-domain-restriction)
14. [Firestore Structure](#-firestore-structure)
15. [Security Rules](#-security-rules)
16. [Role-Based Access](#-role-based-access)
17. [Netlify Deployment (Complete Guide)](#-netlify-deployment-complete-guide)
18. [Testing](#-testing)
19. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

HBPlus Auth is a **production-quality, cross-platform authentication portal** that:

- Authenticates users via **Google OAuth 2.0 → Firebase Auth**
- Restricts access to exact, configured email domains; production supports `@hbplus.fit` and `@gmail.com`
- Stores authorised user profiles in **Cloud Firestore**
- Enforces domain restrictions across **frontend, state management, and backend (Firestore security rules)**
- Implements **role-based access** (Admin / User) stored in Firestore

---

## ✨ Features

| Feature | Status | Description |
|---|---|---|
| Google Sign-In (Web popup) | ✅ | Firebase `signInWithPopup` with popup-blocked fallbacks |
| Google Sign-In (Native) | ✅ | `expo-auth-session` + `expo-crypto` PKCE |
| Domain validation | ✅ | Exact match against the configured allowlist; rejects lookalikes and unlisted domains |
| Protected Dashboard route | ✅ | Route guarded; unauthenticated access redirects to login |
| Logout + session clear | ✅ | Firebase `signOut` + full client state cleanup |
| Loading & error states | ✅ | Non-blocking states with 8s timeout protection |
| Firestore user profile storage | ✅ | Stores UID, email, name, role, photo, and timestamps |
| Fallback resiliency | ✅ | Gracefully handles offline or uninitialized Firestore with Auth profile |
| Firestore security rules | ✅ | Granular read/create/update rules preventing unauthorized access |
| Role-based access (Admin/User) | ✅ | Default 'user' role with immutable client fields |
| Responsive UI (mobile + web) | ✅ | Mobile-first layout adaptable from 320px mobile to 4K desktop |
| Full TypeScript | ✅ | 0 errors across entire source tree |
| Netlify deployment config | ✅ | Preconfigured `netlify.toml` with SPA rewrites & security headers |

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.3.0 | Core UI Library |
| React Native | 0.88.1 | Cross-platform mobile foundation |
| React Native Web | ~0.20.0 | Web runtime for React Native components |
| Expo SDK | ~58.0.23 | Modern universal application toolchain |
| Firebase JS SDK | ^11.3.1 | Authentication & Cloud Firestore database |
| expo-auth-session | ~6.1.5 | Native Google OAuth session handler |
| expo-web-browser | ~14.2.0 | In-app browser for native OAuth redirection |
| expo-crypto | ~14.1.5 | Cryptographic nonces for PKCE authentication |
| React Navigation | ^7.1.6 | Universal navigation & route protection |
| TypeScript | ~6.0.3 | Strict type definitions and compile checks |

---

## 📁 Folder Structure

```
hb+/
├── assets/
│   └── screenshots/
│       └── login-screen.png        # UI screenshot
├── src/
│   ├── components/
│   │   ├── GoogleLoginButton.tsx   # Styled Google sign-in button
│   │   ├── LoadingScreen.tsx       # Full-screen loading indicator
│   │   ├── ErrorMessage.tsx        # Dismissible error alert banner
│   │   └── ProtectedRoute.tsx      # Auth gate wrapper
│   ├── screens/
│   │   ├── LoginScreen.tsx         # Welcome / sign-in screen
│   │   └── DashboardScreen.tsx     # Protected user dashboard
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Route definitions + auth guards
│   ├── services/
│   │   ├── firebase.ts             # Firebase app initialisation
│   │   ├── authService.ts          # Cross-platform Google sign-in
│   │   └── userService.ts          # Firestore user profile management
│   ├── context/
│   │   └── AuthContext.tsx         # Centralized authentication provider
│   ├── hooks/
│   │   └── useAuth.ts              # Hook exposing auth context
│   ├── config/
│   │   └── authConfig.ts           # Centralised configuration constants
│   ├── utils/
│   │   ├── domainValidator.ts      # Domain verification logic
│   │   └── domainValidator.test.ts # Comprehensive unit tests
│   └── types/
│       └── auth.ts                 # TypeScript interfaces
├── App.tsx                         # App entry & provider wrapper
├── index.ts                        # Expo registerRootComponent
├── app.json                        # Expo app metadata & platform settings
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # Strict TypeScript compiler options
├── firestore.rules                 # Cloud Firestore security rules
├── netlify.toml                    # Netlify build & redirect rules
├── .env.example                    # Environment variable template
├── .gitignore                      # Git exclusion rules
└── README.md                       # Complete documentation
```

---

## 📋 Prerequisites

- **Node.js** ≥ 20.x or 22.x
- **npm** ≥ 10.x
- A **Firebase project** with Google Authentication enabled
- A **Google Cloud Console** OAuth 2.0 Web Client ID
- *(Optional)* A **Netlify** account for web hosting

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/Shivprasadpravindongapure/hb-.git
cd hb-

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your credentials
```

---

## 🔐 Environment Variables

Variables with the `EXPO_PUBLIC_` prefix are bundled into the client build by Expo/Metro. All confidential restrictions are enforced server-side through **Firebase Security Rules**.

| Variable | Description | Example / Production Value |
|---|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key | `AIzaSyDyfqf-y4ZvBp2cyMX4GPis7eJxf0nXXZE` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `hbplus-authentication-93ca5.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `hbplus-authentication-93ca5` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Cloud Storage bucket | `hbplus-authentication-93ca5.firebasestorage.app` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging ID | `443207669424` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase Web App ID | `1:443207669424:web:0de4ce0fd9710fc5cd4d75` |
| `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` | Google Analytics ID | `G-JKZYTEZSN8` |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google OAuth Web Client ID | `443268477918-ej2kfuuopqiselacod7gn2ad6jcj5rrr.apps.googleusercontent.com` |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | Google OAuth Android Client ID | *(from Google Cloud Console)* |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google OAuth iOS Client ID | *(from Google Cloud Console)* |
| `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAINS` | Comma-separated authorized email domains | `hbplus.fit,gmail.com` |
| `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN` | Legacy single-domain setting (used only when the plural setting is absent) | `hbplus.fit` |

> **Production access note:** Allowing `gmail.com` authorizes every Google account with a `@gmail.com` address, not just your test accounts. Remove it from `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAINS` and the Firestore rules when testing is finished.

> ⚠️ **SECURITY WARNING:** Never place the Google OAuth **Client Secret** (`GOCSPX-...`) in `.env` or client code. Client secrets are exclusively meant for trusted server environments.

---

## 🔥 Firebase Setup

1. **Create Project**: Go to [Firebase Console](https://console.firebase.google.com/) and create `hbplus-authentication-93ca5`.
2. **Enable Google Provider**: Navigate to **Authentication** → **Sign-in method** → **Google** → **Enable** → Set project support email → **Save**.
3. **Add Authorized Domains**:
   - `localhost` (for local development)
   - `hbplus-authentication-93ca5.firebaseapp.com`
   - `jolly-entremet-88c205.netlify.app` (the deployed site shown in the production screenshot)
   - Any custom production hostname used to open the app
4. **Deploy Firestore Rules**:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use hbplus-authentication-93ca5
   firebase deploy --only firestore:rules
   ```

---

## 🔑 Google OAuth Configuration

1. In [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials):
2. Select your OAuth 2.0 Web Client ID.
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost`
   - `http://localhost:8081`
   - `https://jolly-entremet-88c205.netlify.app`
4. Under **Authorized redirect URIs**, add:
   - `https://hbplus-authentication-93ca5.firebaseapp.com/__/auth/handler`
   *(Use the `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` value if your Firebase Auth domain differs.)*
5. Under **OAuth consent screen** → **Test users**, add test email accounts while in testing mode.

---

## ▶️ Running the App

```bash
# Run web version in browser
npm run web
# → Opens http://localhost:8081

# Run in Android emulator
npm run android

# Run in iOS simulator (macOS required)
npm run ios

# TypeScript verification
npm run type-check

# Production web export
npm run build:web
```

---

## 🛡 Domain Restriction

The domain validation operates through a multi-layered defense mechanism:

1. **Layer 1 — Client Validation (`src/utils/domainValidator.ts`)**:
   - Normalizes email and configured domains to lowercase.
   - Allows only exact domains in `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAINS`.
   - Rejects lookalike patterns (e.g., `user@fakehbplus.fit`, `hbplus.fit@gmail.com`, `user@sub.hbplus.fit`).
2. **Layer 2 — Context Enforcement (`src/context/AuthContext.tsx`)**:
   - Detects domain mismatch immediately upon token issuance.
   - Signs out the unauthorized user from Firebase.
   - Shows the exact error message: `"Access restricted. Please login using your official domain email."`
3. **Layer 3 — Database Authorization (`firestore.rules`)**:
   - Validates the token email against the production allowlist (`@hbplus.fit` or `@gmail.com`).
   - Prohibits unauthorized users from reading or writing Firestore documents, even with direct REST API requests.

---

## 🌐 Netlify Deployment (Complete Guide)

### Method 1: Automatic Deployment via Git (Recommended)

1. **Log in to Netlify**: Go to [app.netlify.com](https://app.netlify.com).
2. **Add New Site**: Click **Add new site** → **Import an existing project**.
3. **Connect GitHub**: Authorize GitHub and select the repository: `Shivprasadpravindongapure/hb-`.
4. **Build & Deploy Settings**:
   - **Branch to deploy**: `main`
   - **Build command**: `npx expo export --platform web`
   - **Publish directory**: `dist`
   *(These are pre-configured in `netlify.toml` and will auto-populate)*.
5. **Add Environment Variables**:
   Click **Add environment variables** and enter each key from below:

   ```
   EXPO_PUBLIC_FIREBASE_API_KEY = AIzaSyDyfqf-y4ZvBp2cyMX4GPis7eJxf0nXXZE
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = hbplus-authentication-93ca5.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID = hbplus-authentication-93ca5
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = hbplus-authentication-93ca5.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 443207669424
   EXPO_PUBLIC_FIREBASE_APP_ID = 1:443207669424:web:0de4ce0fd9710fc5cd4d75
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID = G-JKZYTEZSN8
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = 443268477918-ej2kfuuopqiselacod7gn2ad6jcj5rrr.apps.googleusercontent.com
   EXPO_PUBLIC_ALLOWED_EMAIL_DOMAINS = hbplus.fit,gmail.com
   ```
   *(Do not set only `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN`; that legacy setting replaces the plural allowlist when the plural variable is absent.)*

6. Click **Deploy site**.

---

### Method 2: Manual Deployment via Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to your Netlify account
netlify login

# 3. Build production bundle
npm run build:web

# 4. Deploy production build
netlify deploy --prod --dir=dist
```

---

### ⚠️ Crucial Post-Deployment Steps (Do Not Skip!)

For the deployed URL shown in the reported error (`https://jolly-entremet-88c205.netlify.app`):

1. **Firebase Console**:
   - Open **Authentication** → **Settings** → **Authorized domains**.
   - Click **Add domain** and enter `jolly-entremet-88c205.netlify.app` (hostname only; no scheme or path).

2. **Google Cloud Console**:
   - Open **APIs & Services** → **Credentials** → Select your **Web Client ID**.
   - Under **Authorized JavaScript origins**, add:
     ```
     https://jolly-entremet-88c205.netlify.app
     ```
   - Under **Authorized redirect URIs**, add:
     ```
     https://jolly-entremet-88c205.netlify.app/__/auth/handler
     ```
   - Click **Save**.

---

## 🧪 Testing

### Test Matrix

| Test Case | Account / Input | Expected Result |
|---|---|---|
| **TEST 1: Authorized organisation login** | `employee@hbplus.fit` | Authentication succeeds; redirected to Dashboard |
| **TEST 2: Authorized Gmail test login** | `example@gmail.com` | Authentication succeeds; redirected to Dashboard |
| **TEST 3: Blocked Domain (Yahoo)** | `user@yahoo.com` | Access denied immediately |
| **TEST 4: Direct Protected URL** | Direct URL to `/dashboard` | Redirected to `/login` without revealing content |
| **TEST 5: Session Persistence** | Refresh dashboard page | Session persists through Firebase auth listener |
| **TEST 6: Logout** | Click "Sign out" | Session cleared; redirected to Login; back-navigation blocked |
| **TEST 7: Lookalike Domain** | `user@fakehbplus.fit` | Denied access |
| **TEST 8: Subdomain Injection** | `user@sub.hbplus.fit` | Denied access (exact match enforced) |

---

## ❌ Troubleshooting

- **`auth/unauthorized-domain`**: Add the exact hostname you opened (`jolly-entremet-88c205.netlify.app`) in Firebase Console → Authentication → Settings → Authorized domains, then redeploy after setting `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAINS`.
- **`auth/popup-blocked`**: Allow popups in your browser settings for the deployment URL.
- **Access blocked: Authorization Error (403)**: Add your test account to **Google Cloud Console → OAuth consent screen → Test users**.
- **Blank page on Netlify refresh**: Verified handled by `netlify.toml` SPA rewrite rule (`/* -> /index.html`).

---

## 📄 License & Attribution

Developed for HBPlus Cross-Platform Authentication Portal. All rights reserved.
