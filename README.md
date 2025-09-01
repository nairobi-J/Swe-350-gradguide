# GradGuide: AI-Powered Career and University Companion

GradGuide is a full-stack Next.js application designed to be a definitive platform for students and graduates navigating their academic and professional careers. By combining core web functionalities with advanced AI services, the application provides a holistic solution for university information, event management, job market insights, and personalized career development.

## 🌟 Architectural Overview

The application follows a modern decoupled architecture, with a Next.js frontend handling the user interface and a separate Node.js Express backend serving as a robust API layer. The backend controllers are organized by feature, allowing for clean separation of concerns and maintainability.

-----

## 🚀 Core Features & Implementation

### 1\. **University & Event Management**

This module is handled by the **`eventController.js`** and **`paymentController.js`**. It's a complete system for event lifecycle management.

  * **Comprehensive Event System:** Users can create, browse, and register for events. The `eventController` manages all CRUD operations for events, including status updates and attendee management.
  * **Secure Payment Gateway:** The `paymentController` integrates with SSLCOMMerz, handling the entire payment flow for event registrations. It manages payment initiation, validation, and success/failure callbacks to ensure secure transactions.
  * **Community Engagement:** The `eventFeedbackController.js` and `eventQueryController.js` power the interactive features, allowing users to leave comments, replies, and queries on events.

### 2\. **Job & Company Reviews**

This feature is built around a dedicated review and search system, managed by specialized controllers.

  * **Company Review System:** Users can write and read detailed company reviews, providing valuable crowdsourced insights into workplaces.
  * **Favorite Jobs:** The **`favoriteController.js`** handles saving and managing job listings, allowing users to curate a personal list of opportunities.

### 3\. **AI Career Guidance (Gemini API)**

This is a key differentiator of the application, managed by **`generateResponse.js`**.

  * **Personalized Recommendations:** The `generateResponse` utility communicates with the Google Gemini API to dynamically generate career paths and advice based on user input (skills, interests). It's built to be flexible and adaptable, providing highly relevant and editable recommendations.

### 4\. **AI-Driven Interview Simulation**

A sophisticated module managed by **`interviewController.js`**.

  * **Dynamic Interview Flow:** The `interviewController` orchestrates the entire interview process, from generating questions based on user-selected topics to capturing and submitting responses for analysis.
  * **Performance Analytics:** It leverages the Gemini API to evaluate user answers on multiple metrics, including communication clarity, technical accuracy, and confidence, providing a professional assessment.

### 5\. **User Management & Notifications**

Core to the application's functionality is a robust user system managed by a suite of controllers.

  * **Secure Authentication:** **`authControllers.js`** manages user registration and authentication, providing a secure entry point to the application.
  * **Messaging System:** The **`messageControllers.js`** lays the groundwork for a future real-time chat system, demonstrating a forward-looking design for user-to-user communication.

-----

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | **Next.js**, React, TypeScript, Tailwind CSS |
| **Backend** | **Node.js** (Express API Routes), Azure Web App |
| **Database** | **Supabase** (PostgreSQL) |
| **Authentication**| Supabase Auth |
| **Payments**| SSLCOMMERZ |
| **AI & Interviews**| Google **Gemini API**, Web Speech API |
| **Deployment**| Vercel (Frontend), Azure (Backend) |

## 📦 Getting Started

### Prerequisites

Ensure you have Node.js, npm/yarn, and access to the necessary cloud services (Supabase, Gemini, Azure) with valid API keys.

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/nairobi-J/Swe-350-gradguide.git
    cd swe-350-gradguide
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the project root.

    ```
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

    # Gemini AI
    GEMINI_API_KEY=your_gemini_api_key

    # Azure Backend
    AZURE_API_ENDPOINT=your_azure_api_url
    ```

4.  **Run the Development Server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will be available at `http://localhost:3000`.

## 🚀 Deployment

  * **Frontend:** The Next.js application is hosted on **Vercel**, leveraging its integrated Git workflow for continuous deployment.
  * **Backend:** The Node.js API is deployed to **Azure Web Apps**, providing a scalable and reliable backend service.
  * **Database:** **Supabase** serves as the PostgreSQL database backend, with robust security features like **Row-Level Security (RLS)** enabled to protect sensitive data.

## 📜 License

This project is licensed under the MIT License.

## 📬 Contact

For questions, bug reports, or collaboration opportunities, please contact me at:

  * **Email:** jerinusrat001@gmail.com
  * **GitHub:** [https://github.com/nairobi-j](https://github.com/nairobi-j)
