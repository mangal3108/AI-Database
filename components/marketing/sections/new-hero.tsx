'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Play } from 'lucide-react'

export function NewHero() {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f3] pt-32 pb-20 text-slate-950 sm:pt-40 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(37,99,235,0.11),transparent_30%),linear-gradient(to_bottom,#fafaf9,#f5f5f3)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="max-w-xl">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-7 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">Data, without the detour</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[5.6rem]">Ask better questions of your data.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-7 max-w-lg text-lg leading-8 text-slate-600 sm:text-xl">Internite connects to your databases and turns plain-language questions into reliable answers, charts, and decisions your team can act on.</motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700">Start with your data <ArrowRight size={16} /></Link>
            <Link href="/product/database-chat" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/60 px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-slate-950"><Play size={14} fill="currentColor" /> See how it works</Link>
          </motion.div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500">{['Read-only by default', 'Your credentials stay private', 'Works with your existing stack'].map(item => <span key={item} className="inline-flex items-center gap-2"><Check size={14} className="text-blue-600" />{item}</span>)}</div>
        </div>
        <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.14 }} className="relative lg:-mr-20">
          <div className="absolute -inset-8 rounded-[2.5rem] bg-blue-200/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.4rem] border border-slate-300/80 bg-white shadow-[0_30px_90px_-30px_rgba(15,23,42,0.38)]"><Image src="/internite-product-hero.png" alt="Internite database workspace showing a revenue chart and database schema" width={1536} height={1024} priority className="h-auto w-full" /></div>
          <p className="mt-3 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">A clear view of what your data is saying</p>
        </motion.div>
      </div>
    </section>
  )
}
