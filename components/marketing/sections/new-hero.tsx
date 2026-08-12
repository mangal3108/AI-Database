'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles, Database, Settings, HelpCircle, Send } from 'lucide-react'

export function NewHero() {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden bg-white text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 bg-purple-100 border border-purple-200 rounded-full px-3 py-1 mb-8"
            >
              <Sparkles size={12} className="text-purple-600" />
              <span className="text-[10px] font-bold tracking-widest text-purple-700 uppercase">AI-POWERED DATABASE INTELLIGENCE</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-[4rem] font-black tracking-tight mb-6 leading-[1.1]"
            >
              <span className="text-slate-900">Chat with your database.</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent">
                Get real answers.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Internite AI lets you ask questions in natural language and get accurate, instant answers with beautiful visualizations.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-700 font-bold px-8 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              >
                View Demo
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[11px] font-bold text-slate-500"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-500" />
                <span>Setup in minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-pink-500" />
                <span>Secure & private</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Static Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative lg:ml-10"
          >
            {/* Colorful Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 via-purple-300 to-orange-200 rounded-3xl blur-3xl opacity-50 transform scale-105" />
            
            {/* Mockup Container */}
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex h-[500px]">
              
              {/* Sidebar */}
              <div className="w-48 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200 flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-slate-900">
                    INTERN<span className="text-blue-600">ITE</span>
                  </span>
                </div>
                <div className="p-3">
                  <div className="bg-indigo-50 text-indigo-700 font-semibold text-xs py-2 px-3 rounded-lg flex items-center gap-2 mb-4 border border-indigo-100">
                    <Sparkles size={12} />
                    New Chat
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mb-2 px-2 uppercase tracking-wider">Recent Chats</div>
                  <div className="space-y-1">
                    {['Monthly Revenue', 'Top Customers', 'Product Sales', 'Inventory Status', 'User Signups'].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600 px-2 py-1.5">
                        <Database size={10} className="text-slate-400" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto p-3 border-t border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 px-2 py-1.5">
                    <Settings size={12} /> Settings
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 px-2 py-1.5">
                    <HelpCircle size={12} /> Help
                  </div>
                </div>
              </div>

              {/* Main Area */}
              <div className="flex-1 flex flex-col bg-slate-50/50 relative">
                {/* Header */}
                <div className="h-12 border-b border-slate-200 flex items-center px-4 justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900">My Database</span>
                  </div>
                  <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Connected</div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4 flex flex-col gap-4">
                  {/* User message */}
                  <div className="self-end bg-blue-50 border border-blue-100 text-blue-900 text-[11px] px-3 py-2 rounded-xl rounded-tr-sm max-w-[80%] font-medium">
                    Show me monthly revenue growth for the last 12 months
                  </div>
                  {/* AI Response */}
                  <div className="self-start bg-white border border-slate-200 text-slate-700 text-[11px] p-3 rounded-xl rounded-tl-sm max-w-[90%] shadow-sm">
                    <p className="mb-3">Here is your monthly revenue growth for the last 12 months.</p>
                    <div className="font-bold text-xs text-slate-900 mb-2">Monthly Revenue Growth</div>
                    {/* Dummy Chart Area */}
                    <div className="h-32 bg-gradient-to-b from-indigo-50 to-white border-b border-indigo-100 relative mt-2 rounded-lg flex items-end">
                      <svg viewBox="0 0 100 40" className="w-full h-full preserve-aspect-ratio-none" preserveAspectRatio="none">
                        <path d="M0,35 L10,32 L20,33 L30,22 L40,23 L50,12 L60,8 L70,14 L80,5 L90,12 L100,20 L100,40 L0,40 Z" fill="rgba(99, 102, 241, 0.1)" />
                        <path d="M0,35 L10,32 L20,33 L30,22 L40,23 L50,12 L60,8 L70,14 L80,5 L90,12 L100,20" fill="none" stroke="#6366f1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                        <circle cx="10" cy="32" r="1.5" fill="#6366f1" />
                        <circle cx="20" cy="33" r="1.5" fill="#6366f1" />
                        <circle cx="30" cy="22" r="1.5" fill="#6366f1" />
                        <circle cx="40" cy="23" r="1.5" fill="#6366f1" />
                        <circle cx="50" cy="12" r="1.5" fill="#6366f1" />
                        <circle cx="60" cy="8" r="1.5" fill="#6366f1" />
                        <circle cx="70" cy="14" r="1.5" fill="#6366f1" />
                        <circle cx="80" cy="5" r="1.5" fill="#6366f1" />
                        <circle cx="90" cy="12" r="1.5" fill="#6366f1" />
                        <circle cx="100" cy="20" r="1.5" fill="#6366f1" />
                      </svg>
                    </div>
                    {/* Y Axis Labels */}
                    <div className="absolute left-3 top-[6.5rem] flex flex-col justify-between h-32 text-[7px] text-slate-400 font-mono">
                      <span>$60K</span>
                      <span>$40K</span>
                      <span>$20K</span>
                      <span>$0</span>
                    </div>
                    {/* X Axis Labels */}
                    <div className="flex justify-between px-2 mt-1 text-[7px] text-slate-400 font-mono pl-8">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-slate-200">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="text-[10px] text-slate-400 flex-1">Ask anything about your database...</span>
                    <Send size={12} className="text-slate-900" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
