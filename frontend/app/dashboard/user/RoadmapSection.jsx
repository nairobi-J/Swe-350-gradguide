'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const sectionThemes = {
  'Skill Development Roadmap': {
    icon: '📚',
    bgGradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-300',
    iconColor: 'text-blue-600',
  },
  'Project Recommendations': {
    icon: '💻',
    bgGradient: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-300',
    iconColor: 'text-purple-600',
  },
  'Job Search Strategies': {
    icon: '🔍',
    bgGradient: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-300',
    iconColor: 'text-amber-600',
  },
  'Networking Advice': {
    icon: '🤝',
    bgGradient: 'from-green-50 to-green-100',
    borderColor: 'border-green-300',
    iconColor: 'text-green-600',
  },
  'Salary Expectations & Negotiation': {
    icon: '💰',
    bgGradient: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-300',
    iconColor: 'text-emerald-600',
  },
  'Industry Trends Analysis': {
    icon: '📈',
    bgGradient: 'from-rose-50 to-rose-100',
    borderColor: 'border-rose-300',
    iconColor: 'text-rose-600',
  },
  'default': {
    icon: '✨',
    bgGradient: 'from-gray-50 to-gray-100',
    borderColor: 'border-gray-300',
    iconColor: 'text-gray-600',
  }
};

const RoadmapSection = ({ section }) => {
  const theme = sectionThemes[section.title] || sectionThemes['default'];
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={`mb-6 rounded-xl border ${theme.borderColor} bg-gradient-to-br ${theme.bgGradient} p-6 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${theme.iconColor} text-xl`}>
          {isClient ? theme.icon : '•'}
        </span>
        <h3 className="text-lg font-semibold text-slate-800 md:text-xl">
          {section.title}
        </h3>
      </div>
      <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-800 prose-li:marker:text-slate-400">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {section.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default RoadmapSection;