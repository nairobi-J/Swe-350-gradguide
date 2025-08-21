
## **📌 Overview**  
A **Next.js**-based web application featuring:  
✅ **University & Event Management** – Browse universities, create/register for events, and manage payments.  
✅ **Event Interaction** – Forms for attendees, comments, and replies.  
✅ **Job & Company Reviews** – Search companies and read/write reviews.  
✅ **AI-Powered Career Guidance** – Gemini API for personalized career advice.  
✅ **Interview Module** – Conduct interviews with AI evaluation.  
✅ **Future Plans** – Real-time chat integration.  

**Deployment:**  
- **Frontend:** Vercel  
- **Backend:** Azure Web App  
- **Database:** Supabase  

---

## **🚀 Features**  

### **1. University & Event Module**  
- **University Database** – Merged Kaggle datasets for global universities & expenditure.  
- **Event Creation & Registration** – Users can create, browse, and register for events.  
- **Payment Integration** – SSLCOMMerz (sandbox) for secure transactions.  
- **Event Interaction** – Forms, comments, and replies for engagement.  

### **2. Job & Company Reviews**  
- **Company Search** – Find companies by name, industry, or location.  
- **Review System** – Rate companies and write detailed reviews.  

### **3. AI Career Guidance (Gemini API)**  
- **Customizable Career Advice** – Users input skills/interests for AI-generated career paths.  
- **Editable Recommendations** – Refine suggestions for better accuracy.  

### **4. Interview Module**  
- **AI-Conducted Interviews** – Simulated interviews with voice/text input.  
- **Performance Evaluation** – AI analyzes responses and provides feedback.  
- **Score & Insights** – Metrics on communication, technical skills, and confidence.  

### **5. Future Integrations**  
- **Real-time Chat** – User discussions, event Q&A, and career advice.  
- **User Profiles** – Track event history, saved jobs, and interview performance.  

---

## **🛠 Tech Stack**  

| **Category**       | **Technologies**                     |
|--------------------|--------------------------------------|
| **Frontend**       | Next.js, React, TypeScript, Tailwind |
| **Backend**        | Node.js, express API Routes, Azure   |
| **Database**       | Supabase (PostgreSQL)                |
| **Authentication** | Supabase Auth / NextAuth.js          |
| **Payments**       | SSLCOMMERZ                      |
| **AI & Interviews**| Google Gemini API, Web Speech API    |
| **Deployment**     | Vercel (Frontend), Azure (Backend)   |

---

## **🔧 Setup & Installation**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/nairobi-J/Swe-350-gradguide.git
cd swe-350-gradguide
```

### **2. Install Dependencies**  
```bash
npm install
# or
yarn install
```

### **3. Configure Environment Variables**  
Create a `.env.local` file:  
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Azure Backend
AZURE_API_ENDPOINT=your_azure_api_url
```

### **4. Run the Development Server**  
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000).  

---

## **📂 Project Structure**  


---

## **🚀 Deployment**  

### **Frontend (Vercel)**  
1. Push code to GitHub.  
2. Import project in Vercel.  
3. Set environment variables.  

### **Backend (Azure Web App)**  
1. Deploy Next.js API routes using Azure Static Web Apps.  
2. Configure Supabase connection.  

### **Database (Supabase)**  
1. Set up PostgreSQL tables.  
2. Enable Row-Level Security (RLS) for safety.  

---

## **🔮 Future Plans**  
- **Real-time Chat** – Socket.io or Supabase Realtime.  
- **User Dashboard** – Track events, interviews, and job applications.  
- **Enhanced AI Interviews** – Multi-language support, video analysis.  

---

## **📜 License**  
MIT  

---

## **📬 Contact**  
For questions or contributions:  
📧 **jerinusrat001@gmail.com**  
🌐 **https://github.com/nairobi-j**  

---
 
