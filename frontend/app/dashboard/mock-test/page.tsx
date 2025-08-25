"use client";

import { useState, useRef } from 'react';
import { Clock, CheckCircle, ArrowRight, ArrowLeft, RefreshCw, Play, FileText, Award } from 'lucide-react';

type Step = 'setup' | 'interview' | 'review' | 'evaluation';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  id: string;
  text: string;
  answer: string;
  userResponse: string;
}

export default function InterviewPage() {
  const [step, setStep] = useState<Step>('setup');
  const [topic, setTopic] = useState('JavaScript');
  const [count, setCount] = useState('5');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState('');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;

   const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${AZURE_BACKEND_URL}/interview/generateQuestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic, 
          difficulty,
          count // Number of questions to generate
        }),
      });
      
      const data = await response.json();
      console.log(data.questions)
      setQuestions(data.questions.map((q: any) => (
        {
        id: Math.random().toString(36).substring(7),
        text: q.question,
        answer: q.answer,
        userResponse: ''
      })));
    
      setStep('interview');
      startTimer();
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const startTimer = () => {
    let seconds = 0;
    timerRef.current = setInterval(() => {
      seconds++;
      setTimer(seconds);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleResponseChange = (id: string, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, userResponse: value } : q
    ));
  };

  const submitInterview = async () => {
    setIsLoading(true);
    stopTimer();
    try {
      const response = await fetch(`${AZURE_BACKEND_URL}/interview/evaluateAnswers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          questions: questions.map(q => ({
            question: q.text,
            userResponse: q.userResponse
          }))
        }),
      });
      
      const data = await response.json();
      console.log(data)
      setEvaluation(data.evaluation);
      setStep('evaluation');
    } catch (error) {
      console.error('Error evaluating interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  function formatEvaluationText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\n/g, '<br/>'); // line breaks
}

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const progressPercentage = step === 'setup' ? 0 : 
                           step === 'interview' ? 33 : 
                           step === 'review' ? 66 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-black">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Technical Mock Interview
              </h1>
            </div>
            {step === 'interview' && (
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-mono text-blue-800 font-medium">{formatTime(timer)}</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Setup Step */}
        {step === 'setup' && (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 animate-in fade-in-50 duration-500">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Setup</h2>
              <p className="text-gray-600">Configure your technical interview parameters</p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Interview Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="e.g., JavaScript, React, Python"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Number of Questions</label>
                <select
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="3">3 Questions</option>
                  <option value="5">5 Questions</option>
                  <option value="7">7 Questions</option>
                  <option value="10">10 Questions</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        difficulty === diff 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-sm font-medium capitalize">{diff}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={generateQuestions}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating Questions...</span>
                  </>
                ) : (
                  <>
                    <span>Start Interview</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Interview Step */}
        {step === 'interview' && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Interview Questions</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(difficulty)}`}>
                      {difficulty.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">{topic}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-900 leading-relaxed">{q.text}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Your Response</label>
                          <textarea
                            value={q.userResponse}
                            onChange={(e) => handleResponseChange(q.id, e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Type your detailed answer here..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setStep('review')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl"
                  disabled={questions.some(q => !q.userResponse.trim())}
                >
                  <span>Review Answers</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Step */}
        {step === 'review' && (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 animate-in fade-in-50 duration-500">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Answers</h2>
              <p className="text-gray-600">Take a final look before submission</p>
            </div>
            
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <h3 className="font-semibold text-gray-900">{q.text}</h3>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{q.userResponse}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setStep('interview')}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Edit Answers</span>
              </button>
              <button
                onClick={submitInterview}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Interview</span>
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Evaluation Step */}
        {step === 'evaluation' && (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 animate-in fade-in-50 duration-500">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Evaluation</h2>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Interview Time: {formatTime(timer)}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8">
              <pre className="text-gray-800 whitespace-pre-wrap leading-relaxed font-sans">
                <div dangerouslySetInnerHTML={{ __html: formatEvaluationText(evaluation) }} />
              </pre>
            </div>
            
            <button
              onClick={() => {
                setQuestions([]);
                setEvaluation('');
                setTimer(0);
                setStep('setup');
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Start New Interview</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}