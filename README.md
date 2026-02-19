# Zoho Creator LMS | Leave Management System

A modern, fast, and secure Leave Management System built with **Next.js** and **Firebase**. This system handles everything from employee signups to admin approval workflows with a professional, glassmorphism-inspired design.

## Key Features

- **Employee Dashboard**: Real-time tracking of available leave days (starts at 15 days by default).
- **Admin Workspace**: A dedicated panel for managers to approve or reject requests.
- **Smart Workflows**: Approving a leave request automatically deducts days from the employee's total balance.
- **Persistence**: Built-in state management using Local Storage to ensure zero flickering on page refreshes.
- **Secure Auth**: Full Signup/Login flow powered by Firebase Authentication and Firestore.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State Management**: React Context API + LocalStorage Caching
- **Styling**: Modern CSS with Glassmorphism and Outfit Typography

## Getting Started

1. **Clone the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Firebase**:
   Create a `.env.local` or update `src/lib/firebase.js` with your Firebase project credentials.
4. **Run locally**:
   ```bash
   npm run dev
   ```

## Admin Setup

To set yourself as an administrator, manully change the `userType` field to `"admin"` in your Firestore `users` collection for your specific user document.

*Note: The primary administrator account for this demo is alok.ad2click@gmail.com.*

---
Built with focus on user experience and clean code architecture.
