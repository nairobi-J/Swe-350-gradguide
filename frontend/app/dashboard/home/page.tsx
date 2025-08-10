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
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            {/* Image on the left */}
            <div className="hidden lg:block w-1/2 h-full">
                <img src="/landing.jpg" alt="landing image" />
            </div>
            {/* Text content on the right */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-start lg:pl-16 p-6">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight"
                >
                    Navigate Your Future
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-4 text-xl text-gray-600 max-w-xl"
                >
                    Your comprehensive platform for career guidance, connecting you with real-world data and personalized, AI-driven insights to navigate your professional journey.
                </motion.p>
                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                    Start Your Journey
                </motion.button>
            </div>
        </div>
      </section>

      {/* Feature Section */}
      <div className="py-20 px-6 lg:px-12 bg-gray-50">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Our Core Features</h2>
            <p className="mt-4 text-lg text-gray-600">Discover the tools that will help you succeed.</p>
        </div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company Reviews Module */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 cursor-default transition-all duration-300 hover:shadow-xl hover:scale-105"
            variants={cardVariants}
          >
            <div className="flex flex-col items-start text-left h-full">
              <motion.div 
                className="p-3 bg-blue-100 rounded-xl mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <Briefcase className="h-8 w-8 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Company Reviews</h3>
              <p className="text-base text-gray-600 flex-grow">
                Dive into our extensive database of real-world company data and employee reviews. Gain genuine insights into workplace culture, compensation, and career growth opportunities.
              </p>
            </div>
          </motion.div>

          {/* University Data Module */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 cursor-default transition-all duration-300 hover:shadow-xl hover:scale-105"
            variants={cardVariants}
          >
            <div className="flex flex-col items-start text-left h-full">
              <motion.div 
                className="p-3 bg-purple-100 rounded-xl mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">University Database</h3>
              <p className="text-base text-gray-600 flex-grow">
                Seamlessly access and compare data from multiple real university databases. Select the perfect educational program and institution with complete confidence.
              </p>
            </div>
          </motion.div>

          {/* Events Module */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 cursor-default transition-all duration-300 hover:shadow-xl hover:scale-105"
            variants={cardVariants}
          >
            <div className="flex flex-col items-start text-left h-full">
              <motion.div 
                className="p-3 bg-green-100 rounded-xl mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <CalendarCheck className="h-8 w-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Events & Registration</h3>
              <p className="text-base text-gray-600 flex-grow">
                Effortlessly create, register for, and manage a wide range of events, including exclusive workshops and paid webinars.
              </p>
            </div>
          </motion.div>

          {/* AI Career Coach Module */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 cursor-default transition-all duration-300 hover:shadow-xl hover:scale-105"
            variants={cardVariants}
          >
            <div className="flex flex-col items-start text-left h-full">
              <motion.div 
                className="p-3 bg-amber-100 rounded-xl mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <MicVocal className="h-8 w-8 text-amber-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Career Coach</h3>
              <p className="text-base text-gray-600 flex-grow">
                Update your user profile and receive personalized, AI-guided career recommendations to help you navigate your professional journey with confidence.
              </p>
            </div>
          </motion.div>
          
          {/* New Mock Interview Module */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 cursor-default transition-all duration-300 hover:shadow-xl hover:scale-105"
            variants={cardVariants}
          >
            <div className="flex flex-col items-start text-left h-full">
              <motion.div 
                className="p-3 bg-red-100 rounded-xl mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <MonitorPlay className="h-8 w-8 text-red-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mock Interview</h3>
              <p className="text-base text-gray-600 flex-grow">
                Hone your interview skills with our AI-powered mock interview module. Practice with realistic scenarios and get instant feedback using video analysis.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      
      {/* CAREER PATH SCROLL SECTION */}
      <div className="space-y-12">
        <h2 className="text-3xl font-bold text-center">Your Career Path, Step by Step</h2>
        {["Discover your strengths", "Choose the right program", "Gain real-world experience", "Land your dream job"].map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200"
          >
            <p className="text-lg font-medium">{step}</p>
          </motion.div>
        ))}
      </div>

      {/* About Us Section */}
      <div className="py-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900">About Us</h2>
            <p className="mt-4 text-lg text-gray-600">
                At GradGuide, we believe that navigating your career path should be an empowering and transparent experience. Our mission is to democratize career data, providing students and professionals with the tools and insights they need to make confident, informed decisions about their future. We're committed to building a platform that is not just a resource, but a trusted partner in your professional growth.
            </p>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="bg-blue-600 text-white py-20 px-6 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight">Ready to Take Control of Your Career?</h2>
            <p className="mt-4 text-lg text-blue-100">Join GradGuide today and start making smarter career decisions with our AI-powered platform.</p>
            <button className="mt-8 px-10 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                Sign Up for Free
            </button>
        </div>
      </div>
    </div>
  );
}