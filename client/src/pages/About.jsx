import React from 'react';
import { Sparkles, Target, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8faff] font-sans pt-24 pb-20">
      {/* Background Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[50%] bg-purple-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            About StartSahay
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
            Empowering the next generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">innovators</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            StartSahay bridges the gap between visionary startups and essential resources. By leveraging advanced AI, we simplify the complex landscape of government schemes, funding, and mentorship, so you can focus on building your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/60">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" 
              alt="Team collaboration" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-transparent to-transparent"></div>
          </div>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="bg-blue-100 p-3 rounded-2xl h-fit">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Matching Algorithm</h3>
                <p className="text-slate-600 leading-relaxed">Instantly find grants, schemes, and programs tailored specifically to your startup's industry, stage, and unique profile without endless manual searching.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-purple-100 p-3 rounded-2xl h-fit">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">AI Pitch Deck Generator</h3>
                <p className="text-slate-600 leading-relaxed">Transform your raw business ideas into professional, investor-ready pitch decks in minutes. Our AI handles the structure and content framing for you.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-emerald-100 p-3 rounded-2xl h-fit">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">End-to-End Support</h3>
                <p className="text-slate-600 leading-relaxed">From discovering hidden funding opportunities to applying with confidence, we provide the vital tools needed for your entire startup journey.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
