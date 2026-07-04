# LMS-Banglore: A Modern Leave Management System

![Project Status](https://img.shields.io/badge/Status-Actively%20Developed-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)
![Built With Love](https://img.shields.io/badge/Built%20With%20%E2%9D%A4%EF%B8%8F%20By-Alok345-ff69b4.svg?style=for-the-badge)

## 🚀 Overview

**LMS-Banglore** is a robust, modern, and user-friendly Leave Management System designed to streamline HR processes for organizations. Crafted by **Alok345**, this application provides a comprehensive solution for employees to manage their leave requests and for administrators to efficiently oversee and approve them.

Built with the latest web technologies, LMS-Banglore prioritizes performance, security, and a stunning user experience, featuring a professional, glassmorphism-inspired design.

## ✨ Key Features

Our system is engineered to provide a seamless experience for both employees and administrators:

*   **Intuitive Employee Dashboard**: Employees get a clear, real-time overview of their available leave days (starting with a default of 15 days), submitted requests, and leave history.
*   **Powerful Admin Workspace**: A dedicated, secure panel empowering managers and HR to efficiently review, approve, or reject leave requests with a simple interface.
*   **Smart Approval Workflows**: Automated logic ensures that approving a leave request instantly deducts the corresponding days from the employee's total leave balance, maintaining accuracy.
*   **Seamless User Experience**: Utilizes local storage for state persistence, eliminating flickers and ensuring a smooth, consistent experience even on page refreshes.
*   **Secure Authentication & Authorization**: A complete signup/login flow powered by Firebase Authentication and Firestore, safeguarding user data and access.
*   **Modern UI/UX**: Features a professional, visually appealing design with a captivating glassmorphism aesthetic and elegant Outfit typography, enhancing usability.

## 🛠️ Tech Stack

LMS-Banglore is built on a solid foundation of cutting-edge technologies:

| Category          | Technology             | Badge                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :---------------- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | Next.js                | ![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **UI Library**    | React                  | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Backend/DB**    | Firebase (Firestore)   | ![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=firebase&logoColor=white) ![Firestore](https://img.shields.io/badge/Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)                                                                                                                                                                                                                                                                                                                                                       |
| **Authentication**| Firebase Authentication| ![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **State Mgmt**    | React Context API      | ![React Context API](https://img.shields.io/badge/Context_API-61DAFB?style=for-the-badge&logo=react&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Styling**       | Modern CSS             | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Deployment**    | Vercel                 | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Runtime**       | Node.js                | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Package Mgr**   | npm                    | ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## 📂 Project Structure

A clean and intuitive directory structure for easy navigation and development:

```
.
├── .gitignore
├── EXPLANATION.md
├── LOGIC_GUIDE.md
├── README.md
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── public/
│   └── (static assets like images, fonts)
└── src/
    ├── app/               # Next.js App Router root
    │   ├── api/           # API routes
    │   ├── (components)   # UI components
    │   ├── (layout)       # Layouts and templates
    │   └── (pages)        # Page components (e.g., dashboard, login)
    ├── lib/               # Utility functions, Firebase initialization
    ├── styles/            # Global styles
    └── (other modules)    # e.g., hooks, context providers
```

## 🚀 Getting Started

Follow these steps to set up and run the LMS-Banglore project locally.

### Prerequisites

Ensure you have the following installed:

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)
*   A Firebase project configured for Firestore and Authentication.

### Installation

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/Alok345/LMS-Banglore.git
    cd LMS-Banglore
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    *   **Create a Firebase Project:** If you haven't already, create a new project on the [Firebase Console](https://console.firebase.google.com/).
    *   **Enable Services:** In your Firebase project, enable:
        *   **Firestore Database** (start in production mode)
        *   **Authentication** (enable Email/Password provider)
    *   **Get Firebase Config:** Go to Project settings -> Your apps, then select "Web" to get your Firebase configuration object.
    *   **Create `.env.local`:** In the root directory of your project, create a file named `.env.local` and add your Firebase configuration details, replacing the placeholders with your actual values:

        ```dotenv
        NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
        NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
        ```
    *   *(Alternatively, though less recommended for production, you can directly update `src/lib/firebase.js` with your credentials.)*

### Running the Project

1.  **Start the Development Server:**

    ```bash
    npm run dev
    ```

    The application will be accessible at `http://localhost:3000`.

2.  **Build for Production (Optional):**

    ```bash
    npm run build
    ```

    This command creates an optimized production build of your application in the `.next` directory.

3.  **Start Production Server (Optional):**

    ```bash
    npm start
    ```

    This command runs the built application in a production environment.

### Admin Setup

To grant administrative privileges to a user:

1.  **Register a user** through the application's signup process.
2.  **Access your Firebase Firestore console.**
3.  Navigate to the `users` collection.
4.  Find the document corresponding to the user you wish to make an administrator.
5.  **Manually change the `userType` field to `"admin"`** for that specific user document.

*Note: For demonstration purposes, the primary administrator account used in this project is `alok.ad2click@gmail.com`.*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.