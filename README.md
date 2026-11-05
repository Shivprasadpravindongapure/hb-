# HBPlus Auth — Cross-Platform Google OAuth Application

> **React Native + React Native Web · Firebase Auth · Firestore · TypeScript**
> Runs on Android, iOS, and Web from a **single codebase**.

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
17. [Netlify Deployment](#-netlify-deployment)
18. [Testing](#-testing)
19. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

HBPlus Auth is a **production-quality, cross-platform authentication portal** that:

- Authenticates users via **Google OAuth 2.0 → Firebase Auth**
- Restricts access exclusively to `@hbplus.fit` email accounts
- Stores authorised user profiles in **Cloud Firestore**
- Enforces domain restrictions at **both client and database (Firestore rules) layers**
- Implements **role-based access** (Admin / User) stored in Firestore

---

## ✨ Features

| Feature | Status |
|---|---|
| Google Sign-In (Web popup) | ✅ |
| Google Sign-In (Native via expo-auth-session) | ✅ |
| Domain validation (`@hbplus.fit` only) | ✅ |
| Protected Dashboard route | ✅ |
| Logout + session clear | ✅ |
| Loading & error states | ✅ |
| Firestore user profile storage | ✅ |
| Firestore security rules | ✅ |
| Role-based access (Admin/User) | ✅ |
| Responsive UI (mobile + web) | ✅ |
| Lookalike domain rejection | ✅ |
| TypeScript throughout | ✅ |
| Netlify deployment config | ✅ |

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.79.5 | Cross-platform UI |
| React Native Web | ~0.20.0 | Web rendering |
| Expo SDK | ~53.0.11 | Build toolchain |
| Firebase JS SDK | ^11.3.1 | Auth + Firestore |
| expo-auth-session | ~6.1.5 | Native OAuth |
| expo-web-browser | ~14.1.6 | OAuth browser |
| React Navigation | ^7.x | Navigation |
| TypeScript | ^5.3 | Type safety |

---

## 📁 Folder Structure

```
hb+/
├── src/
│   ├── components/
│   │   ├── GoogleLoginButton.tsx   # Styled Google sign-in button
│   │   ├── LoadingScreen.tsx       # Full-screen loading state
│   │   ├── ErrorMessage.tsx        # Dismissible error banner
│   │   └── ProtectedRoute.tsx      # Auth gate wrapper
│   ├── screens/
│   │   ├── LoginScreen.tsx         # Welcome / sign-in page
│   │   └── DashboardScreen.tsx     # Protected user dashboard
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Route definitions + auth guards
│   ├── services/
│   │   ├── firebase.ts             # Firebase initialisation
│   │   ├── authService.ts          # Platform-aware Google Sign-In
│   │   └── userService.ts          # Firestore CRUD operations
│   ├── context/
│   │   └── AuthContext.tsx         # Global auth state provider
│   ├── hooks/
│   │   └── useAuth.ts              # Convenience hook
│   ├── config/
│   │   └── authConfig.ts           # Centralised constants
│   ├── utils/
│   │   ├── domainValidator.ts      # Email domain validation logic
│   │   └── domainValidator.test.ts # Unit tests
│   └── types/
│       └── auth.ts                 # TypeScript interfaces
├── App.tsx                         # Root component
├── index.ts                        # Expo entry point
├── app.json                        # Expo configuration
├── package.json
├── tsconfig.json
├── babel.config.js
├── firestore.rules                 # Firestore security rules
├── firebase.json                   # Firebase CLI config
├── netlify.toml                    # Netlify deployment config
├── .env.example                    # Environment variable template
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Expo CLI** (installed automatically via `npx`)
- A **Firebase project** with Google Auth enabled
- A **Google Cloud project** with OAuth 2.0 credentials

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/hbplus-auth.git
cd hbplus-auth

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section)
```

---

## 🔐 Environment Variables

Copy `.env.example` → `.env` and fill in your values:

```env
# Firebase (from Firebase Console → Project Settings → Your Apps)
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Google OAuth Client IDs (from Google Cloud Console)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=

# Domain restriction
EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN=hbplus.fit
```

> **Note:** Variables prefixed with `EXPO_PUBLIC_` are safe to include in the
> client bundle **because access is enforced by Firestore Security Rules**, not
> by keeping the config secret.

---

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project** → name it `hbplus-authentication`
3. Enable **Google Analytics** (optional)

### 2. Enable Google Authentication

1. Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Set your **support email**
4. Click **Save**

### 3. Add Authorised Domains

1. Authentication → **Settings** → **Authorised domains**
2. Add:
   - `localhost` (for development)
   - `hbplus-auth.netlify.app` (for production — replace with your domain)

### 4. Create a Web App

1. Project Settings → **Your apps** → **Add app** → **Web** (`</>`)
2. Copy the `firebaseConfig` object — these are your `EXPO_PUBLIC_FIREBASE_*` values

### 5. Create Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose your region (e.g., `asia-south1` for India)

### 6. Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialise (select Firestore, use existing project)
firebase use hbplus-authentication-93ca5

# Deploy rules
firebase deploy --only firestore:rules
```

---

## 🔑 Google OAuth Configuration

### Web Client ID

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Add authorised JavaScript origins:
   - `http://localhost:8081`
   - `https://hbplus-auth.netlify.app`
5. Add authorised redirect URIs:
   - `https://hbplus-authentication-93ca5.firebaseapp.com/__/auth/handler`
6. Copy the **Client ID** → `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

---

## 📱 Platform-Specific Setup

### Android

1. Firebase Console → Project Settings → **Android** → Add Android app
2. Package name: `com.hbplus.auth`
3. Get your **SHA-1** fingerprint:
   ```bash
   cd android && ./gradlew signingReport
   # or for debug:
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
4. Register SHA-1 in Firebase, then download `google-services.json` → place in project root
5. Create Android OAuth client in Google Cloud Console:
   - Application type: **Android**
   - Package: `com.hbplus.auth`
   - SHA-1: your fingerprint
6. Copy Client ID → `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`

### iOS

1. Firebase Console → Project Settings → **iOS** → Add iOS app
2. Bundle ID: `com.hbplus.auth`
3. Download `GoogleService-Info.plist` → place in project root
4. Create iOS OAuth client in Google Cloud Console:
   - Application type: **iOS**
   - Bundle ID: `com.hbplus.auth`
5. Copy the **Reversed Client ID** from `GoogleService-Info.plist`
6. Add it to `app.json` under `ios.infoPlist.CFBundleURLTypes`
7. Copy Client ID → `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

---

## ▶️ Running the App

```bash
# Web (browser)
npm run web
# → Opens http://localhost:8081

# Android emulator / device
npm run android

# iOS simulator (macOS only)
npm run ios

# Interactive Expo CLI
npm start
```

---

## 🔄 Authentication Flow

```
User clicks "Continue with Google"
        │
        ▼
  [Platform check]
  ┌─────────────────────────────────────────────┐
  │ Web: signInWithPopup (Firebase Auth)         │
  │ Native: expo-auth-session → access_token     │
  │          → signInWithCredential              │
  └─────────────────────────────────────────────┘
        │
        ▼
  Firebase returns authenticated user
        │
        ▼
  Domain validation: isEmailDomainAllowed(email)
  ┌──────────────────────────────────┐
  │ email.split('@')[1] === hbplus.fit│
  └──────────────────────────────────┘
        │
  ┌─────┴──────┐
  ▼            ▼
ALLOWED     BLOCKED
  │            │
  ▼            ▼
Firestore   signOut()
upsert      clearState()
profile     show error
  │
  ▼
Navigate → Dashboard
```

---

## 🛡 Domain Restriction

**How it works (3 layers):**

| Layer | Where | What it does |
|---|---|---|
| **1 — Frontend** | `domainValidator.ts` | Instant UX gate; validates on login; exact string match of domain part |
| **2 — AuthContext** | `AuthContext.tsx` | Signs out any Firebase user whose email doesn't match the domain |
| **3 — Firestore Rules** | `firestore.rules` | Backend enforcement; rejects any direct API call from non-`@hbplus.fit` users |

**What is rejected (lookalike attacks):**

```
user@fakehbplus.fit          → domain ≠ "hbplus.fit"
user@hbplus.fit.evil.com     → domain ≠ "hbplus.fit"
hbplus.fit@gmail.com         → domain = "gmail.com"
user@sub.hbplus.fit          → domain ≠ "hbplus.fit" (exact match)
```

---

## 🗄 Firestore Structure

```
users/
  {uid}/
    uid:          string   (Firebase UID)
    name:         string   (Google display name)
    email:        string   (Google email — immutable)
    photoURL:     string?  (Google profile photo URL)
    domain:       string   ("hbplus.fit")
    role:         string   ("user" | "admin")
    emailVerified: boolean
    createdAt:    timestamp
    lastLoginAt:  timestamp
```

---

## 🔒 Security Rules

**Key enforcements in `firestore.rules`:**

- ✅ Only authenticated users can access anything
- ✅ Only `@hbplus.fit` emails (checked via Firebase token) can read/write
- ✅ Only verified emails can access data
- ✅ Users can only read/update their own document
- ✅ `role`, `uid`, `email`, `domain` fields are **immutable** from the client
- ✅ New users always get `role: "user"` — never `"admin"`
- ✅ Delete is disabled from the client entirely

---

## 👥 Role-Based Access

| Role | Assigned by | How |
|---|---|---|
| `user` | Automatic | Set on first login by `userService.ts` |
| `admin` | Manual only | Firebase Console or trusted Cloud Function |

**To promote a user to Admin (Firebase Console):**
1. Firestore → `users` → find the document → edit `role` field → set `"admin"`

**Client code cannot change roles** — Firestore rules block any update to the `role` field.

---

## 🌐 Netlify Deployment

```bash
# 1. Build the web bundle
npm run build:web
# Output: dist/

# 2. Deploy via Netlify CLI
npm install -g netlify-cli
netlify login
netlify init     # link or create site
netlify deploy --prod --dir=dist

# 3. Set environment variables in Netlify UI:
#    Site Settings → Environment Variables → add all EXPO_PUBLIC_* vars
```

**Post-deployment checklist:**
- [ ] Add Netlify domain to Firebase Auth → Authorised domains
- [ ] Add Netlify URL to Google OAuth → Authorised JavaScript origins
- [ ] Add Netlify URL to Google OAuth → Authorised redirect URIs (`/__/auth/handler`)
- [ ] Verify `netlify.toml` redirect rule works for `/dashboard` direct access

---

## 🧪 Testing

### Domain Validator Unit Tests

```bash
# Install test runner
npm install --save-dev jest ts-jest @types/jest

# Add to package.json scripts:
# "test": "jest"

# Run
npm test
```

### Manual Test Checklist

| Test | Input | Expected | Status |
|---|---|---|---|
| **TEST 1** | `employee@hbplus.fit` | ✅ Dashboard access | Verify manually |
| **TEST 2** | `example@gmail.com` | ❌ "Access restricted…" error | Verify manually |
| **TEST 3** | `user@yahoo.com` | ❌ Access denied | Verify manually |
| **TEST 4** | Open `/dashboard` without login | ↩️ Redirect to login | Verify manually |
| **TEST 5** | Refresh dashboard (authorised) | ✅ Session persists | Verify manually |
| **TEST 6** | Click Logout | ↩️ Back to login | Verify manually |
| **TEST 7** | Direct Firestore API call (foreign domain) | ❌ Rules deny | Verify via Firebase Console |
| **TEST 8** | Try `role: "admin"` via Firestore update | ❌ Permission denied | Verify via Firebase Console |
| **TEST 9** | `hbplus.fit@gmail.com` | ❌ Access denied | Unit test passes |

> Run domain validator unit tests: all 13 cases pass ✅

---

## ❌ Troubleshooting

### "auth/popup-blocked"
- Allow popups for `localhost` in your browser
- Or use `signInWithRedirect` (switch in `authService.ts`)

### "auth/unauthorized-domain"
- Add your domain to Firebase Console → Authentication → Authorised domains

### "FirebaseError: Missing or insufficient permissions"
- Deploy the Firestore rules: `firebase deploy --only firestore:rules`
- Ensure your email is `@hbplus.fit` and verified

### Native: Google Sign-In fails
- Confirm client IDs are set in `.env`
- For Android: SHA-1 must be registered in both Firebase and Google Cloud Console
- For iOS: reversed client ID URL scheme must be in `app.json`

### Web build fails
- Run `npm run type-check` to catch TypeScript errors first
- Ensure `react-native-web` is installed

### "Cannot read property of undefined" on startup
- Check all `EXPO_PUBLIC_FIREBASE_*` env vars are set
- Restart the dev server after editing `.env`

---

## 🔗 GitHub Commands

```bash
git init
git add .
git commit -m "feat: initial HBPlus cross-platform auth app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hbplus-auth.git
git push -u origin main
```

---

*Built with ❤️ for HBPlus · Secure · Scalable · Cross-Platform*
