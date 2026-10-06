import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, FileText, Cpu, LayoutTemplate, BarChart3, Search, UserCheck, Presentation } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8faff] font-sans pt-24">
      {/* Background Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[50%] bg-purple-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-70"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center pt-12 pb-16 lg:pb-24 gap-12 lg:gap-8">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI-Powered Startup Support Platform
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
              Turn Your Startup Idea <br className="hidden lg:block" />
              Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Real Opportunities</span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover relevant government schemes, funding opportunities and support programs with AI-powered recommendations. Create professional pitch decks and accelerate your startup journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="flex-1 relative w-full max-w-2xl lg:max-w-none mt-8 lg:mt-0">
            {/* The businessman image. We use an object-cover image with a mask or just rounded borders */}
            <div className="relative w-full aspect-[4/3] lg:aspect-square flex items-end justify-center">
              {/* Background abstract shape for the image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 to-purple-200/40 rounded-full blur-3xl transform scale-90"></div>

              {/* Main image container */}
              <div className="relative z-10 w-[85%] h-[90%] overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white/50">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
                  alt="Startup Team Analytics"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Floating Card 1: Latest Schemes */}
              <div className="absolute top-[10%] left-[-5%] lg:left-[5%] bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-4 z-20 animate-[bounce_4s_infinite] border border-white/50">
                <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-800">Latest<br />Schemes</span>
              </div>

              {/* Floating Card 2: AI Recommendations */}
              <div className="absolute top-[35%] right-[-5%] lg:right-[0%] bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-4 z-20 animate-[bounce_5s_infinite_0.5s] border border-white/50">
                <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-800">AI<br />Recommendations</span>
              </div>

              {/* Floating Card 3: Pitch Deck Generator */}
              <div className="absolute bottom-[25%] left-[-10%] lg:left-[-5%] bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-4 z-20 animate-[bounce_4.5s_infinite_1s] border border-white/50">
                <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600">
                  <LayoutTemplate className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-800">Pitch Deck<br />Generator</span>
              </div>

              {/* Floating Card 4: Startup Analysis */}
              <div className="absolute bottom-[10%] right-[-5%] lg:right-[10%] bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-4 z-20 animate-[bounce_5s_infinite_1.5s] border border-white/50">
                <div className="bg-orange-100 p-2.5 rounded-xl text-orange-500">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-800">Startup<br />Analysis</span>
              </div>

              {/* Decorative Dots */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full opacity-50"></div>
              <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-purple-500 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Features Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20 relative z-20 mt-10">

          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-blue-600">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Personalized</h3>
            <p className="text-slate-500">Scheme Recommendations</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-purple-600">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Eligibility</h3>
            <p className="text-slate-500">Analysis & Guidance</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-indigo-600">
              <Presentation className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">AI-Powered</h3>
            <p className="text-slate-500">Pitch Deck Generator</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Landing;
