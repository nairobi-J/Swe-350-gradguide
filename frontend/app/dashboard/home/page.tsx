'use client';
import { Briefcase, University, CalendarCheck, MicVocal, GraduationCap, MonitorPlay } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10 } },
};

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: [0, -10, 10, -10, 0],
    transition: { duration: 0.4 }
  }
};

export default function HomePage() {
  return (
    <div className="space-y-16 p-6 lg:p-12 bg-white min-h-screen font-sans text-gray-900">
      {/* Welcome Banner: Updated for a professional, light theme */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white p-12 shadow-2xl text-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-4 tracking-tight"
        >
          Welcome to GradGuide
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/90 text-xl max-w-2xl mx-auto"
        >
          Your comprehensive platform for career guidance, connecting you with real-world data and personalized, AI-driven insights to navigate your professional journey.
        </motion.p>
      </div>

      {/* Feature Modules: Redesigned with a light theme, new icons, and detailed descriptions */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Companies & Reviews Module */}
        <motion.div 
          className="bg-gray-100 rounded-3xl p-8 shadow-lg border border-gray-200 cursor-default transition-all duration-300 hover:shadow-xl hover:bg-gray-200"
          variants={cardVariants}
        >
          <div className="flex flex-col items-center text-center h-full">
            <motion.div 
              className="p-4 bg-blue-600 rounded-2xl mb-6 shadow-lg"
              variants={iconVariants}
              whileHover="hover"
            >
              <Briefcase className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Reviews</h2>
            <p className="text-base text-gray-600 flex-grow">
              Dive into our extensive database of real-world company data and employee reviews. Gain genuine insights into workplace culture, compensation, and career growth opportunities to make truly informed decisions about your future.
            </p>
          </div>
        </motion.div>

        {/* University Data Module */}
        <motion.div 
          className="bg-gray-100 rounded-3xl p-8 shadow-lg border border-gray-200 cursor-default transition-all duration-300 hover:shadow-xl hover:bg-gray-200"
          variants={cardVariants}
        >
          <div className="flex flex-col items-center text-center h-full">
            <motion.div 
              className="p-4 bg-purple-600 rounded-2xl mb-6 shadow-lg"
              variants={iconVariants}
              whileHover="hover"
            >
              <GraduationCap className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">University Database</h2>
            <p className="text-base text-gray-600 flex-grow">
              Seamlessly access and compare data from multiple real university databases. Our platform provides the detailed information you need to select the perfect educational program and institution with complete confidence.
            </p>
          </div>
        </motion.div>
        
        {/* Events Module */}
        <motion.div 
          className="bg-gray-100 rounded-3xl p-8 shadow-lg border border-gray-200 cursor-default transition-all duration-300 hover:shadow-xl hover:bg-gray-200"
          variants={cardVariants}
        >
          <div className="flex flex-col items-center text-center h-full">
            <motion.div 
              className="p-4 bg-green-600 rounded-2xl mb-6 shadow-lg"
              variants={iconVariants}
              whileHover="hover"
            >
              <CalendarCheck className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Events & Registration</h2>
            <p className="text-base text-gray-600 flex-grow">
              Effortlessly create, register for, and manage a wide range of events, including exclusive workshops and paid webinars. Your next professional opportunity or networking event is just a click away.
            </p>
          </div>
        </motion.div>
        
        {/* AI Career Coach Module */}
        <motion.div 
          className="bg-gray-100 rounded-3xl p-8 shadow-lg border border-gray-200 cursor-default transition-all duration-300 hover:shadow-xl hover:bg-gray-200"
          variants={cardVariants}
        >
          <div className="flex flex-col items-center text-center h-full">
            <motion.div 
              className="p-4 bg-amber-600 rounded-2xl mb-6 shadow-lg"
              variants={iconVariants}
              whileHover="hover"
            >
              <MicVocal className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Career Coach</h2>
            <p className="text-base text-gray-600 flex-grow">
              Update your user profile and receive personalized, AI-guided career recommendations. Our intelligent coach analyzes your skills and aspirations to help you navigate your professional journey with confidence.
            </p>
          </div>
        </motion.div>
        
        {/* New Mock Interview Module */}
        <motion.div 
          className="bg-gray-100 rounded-3xl p-8 shadow-lg border border-gray-200 cursor-default transition-all duration-300 hover:shadow-xl hover:bg-gray-200"
          variants={cardVariants}
        >
          <div className="flex flex-col items-center text-center h-full">
            <motion.div 
              className="p-4 bg-red-600 rounded-2xl mb-6 shadow-lg"
              variants={iconVariants}
              whileHover="hover"
            >
              <MonitorPlay className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mock Interview</h2>
            <p className="text-base text-gray-600 flex-grow">
              Hone your interview skills with our AI-powered mock interview module. Practice with realistic scenarios and get instant feedback on your performance, tone, and body language using video analysis.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
