'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Loader2, Lock, ArrowLeft, Database, Upload, Server, Layers, FileCode } from 'lucide-react'
import { toast } from 'sonner'
import { DatabaseLogo } from './database-logo'

const DB_CATEGORIES = [
  {
    category: 'SQL DATABASES',
    providers: [
      { id: 'POSTGRESQL', label: 'PostgreSQL', abbr: 'PG', color: '#336791', description: 'Standard PostgreSQL RDBMS' },
      { id: 'MYSQL', label: 'MySQL', abbr: 'MY', color: '#4479A1', description: 'MySQL 5.7+ / 8.0+' },
      { id: 'SQLSERVER', label: 'SQL Server', abbr: 'MS', color: '#CC2927', description: 'Microsoft SQL Server & Azure SQL' },
      { id: 'SQLITE', label: 'SQLite', abbr: 'SL', color: '#0F80CC', description: 'Local SQLite database file upload' },
      { id: 'MARIADB', label: 'MariaDB', abbr: 'MA', color: '#003545', description: 'MariaDB Relational Server' },
    ]
  },
  {
    category: 'CLOUD POSTGRESQL',
    providers: [
      { id: 'NEON', label: 'Neon', abbr: 'NE', color: '#00E5A0', description: 'Serverless PostgreSQL by Neon' },
      { id: 'SUPABASE', label: 'Supabase', abbr: 'SB', color: '#3ECF8E', description: 'Supabase Cloud Postgres' },
      { id: 'COCKROACHDB', label: 'CockroachDB', abbr: 'CR', color: '#6933FF', description: 'Distributed SQL Database' },
    ]
  },
  {
    category: 'DOCUMENT DATABASES',
    providers: [
      { id: 'MONGODB', label: 'MongoDB', abbr: 'MO', color: '#47A248', description: 'MongoDB & MongoDB Atlas' },
    ]
  }
] as const

type DBType = 'POSTGRESQL' | 'MYSQL' | 'SQLSERVER' | 'SQLITE' | 'MARIADB' | 'NEON' | 'SUPABASE' | 'COCKROACHDB' | 'MONGODB'

const postgresSchema = z.object({
  name: z.string().min(1, 'Connection name is required'),
  connectionString: z.string().min(1, 'Connection string is required'),
})

const mysqlSchema = z.object({
  name: z.string().min(1, 'Connection name is required'),
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().default(3306),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string(),
  ssl: z.boolean().default(false),
})

const sqlServerSchema = z.object({
  name: z.string().min(1, 'Connection name is required'),
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().default(1433),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string(),
  encrypt: z.boolean().default(true),
  trustServerCertificate: z.boolean().default(true),
})

const mongoSchema = z.object({
  name: z.string().min(1, 'Connection name is required'),
  connectionString: z.string().min(1, 'Connection URI is required'),
  database: z.string().optional(),
})

const sqliteSchema = z.object({
  name: z.string().min(1, 'Connection name is required'),
  filePath: z.string().min(1, 'File path is required'),
})

export function NewConnectionWizard() {
  const router = useRouter()
  const [step, setStep] = useState<'type' | 'credentials'>('type')
  const [selectedType, setSelectedType] = useState<DBType | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs?: number; error?: string } | null>(null)

  const handleTypeSelect = (type: DBType) => {
    setSelectedType(type)
    setTestResult(null)
    setStep('credentials')
  }

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (!selectedType) return
    setIsSaving(true)

    try {
      const response = await fetch('/api/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: selectedType,
          credentials: {
            type: selectedType,
            ...formData,
          },
          readOnly: true,
        }),
      })

      const result = await response.json() as { connection?: { id: string }; error?: string }

      if (!response.ok) {
        toast.error(result.error ?? 'Failed to save database connection')
        return
      }

      toast.success('Database saved! Indexing schema in background...')
      router.push(`/dashboard/databases/${result.connection!.id}`)
    } catch {
      toast.error('Failed to connect database')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'type' && (
        <motion.div
          key="type"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          {DB_CATEGORIES.map((cat, catIdx) => (
            <div key={catIdx}>
              <p className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Layers size={14} />
                <span>{cat.category}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.providers.map(db => (
                  <button
                    key={db.id}
                    onClick={() => handleTypeSelect(db.id as DBType)}
                    className="flex items-center gap-3.5 p-4 bg-[#0D111A] border border-slate-800/80 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all text-left group shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800 shrink-0 shadow-md group-hover:border-indigo-500/30 transition-colors"
                    >
                      <DatabaseLogo type={db.id} className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{db.label}</p>
                      <p className="text-xs text-slate-400 truncate">{db.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {step === 'credentials' && selectedType && (
        <motion.div
          key="credentials"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-[#0D111A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <button
            onClick={() => setStep('type')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to database providers
          </button>

          {(selectedType === 'POSTGRESQL' || selectedType === 'NEON' || selectedType === 'SUPABASE' || selectedType === 'COCKROACHDB') && (
            <PostgresForm onSubmit={handleSubmit} isLoading={isSaving} dbType={selectedType} />
          )}
          {(selectedType === 'MYSQL' || selectedType === 'MARIADB') && (
            <MySQLForm onSubmit={handleSubmit} isLoading={isSaving} dbType={selectedType} />
          )}
          {selectedType === 'SQLSERVER' && (
            <SQLServerForm onSubmit={handleSubmit} isLoading={isSaving} />
          )}
          {selectedType === 'MONGODB' && (
            <MongoForm onSubmit={handleSubmit} isLoading={isSaving} />
          )}
          {selectedType === 'SQLITE' && (
            <SQLiteForm onSubmit={handleSubmit} isLoading={isSaving} />
          )}

          {/* Encryption Security Badge */}
          <div className="flex items-start gap-3 mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <Lock size={16} className="text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-300">
              <p className="font-bold text-emerald-400">Server-Side Credentials Encryption</p>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Credentials are encrypted with AES-256-GCM before storage. Your password is never stored in plaintext or sent back to the browser.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PostgresForm({ onSubmit, isLoading, dbType }: { onSubmit: (data: Record<string, unknown>) => Promise<void>; isLoading: boolean; dbType: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(postgresSchema) })
  return (
    <form onSubmit={handleSubmit(data => onSubmit(data as Record<string, unknown>))} className="space-y-4 font-sans">
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Connection Name</label>
        <input {...register('name')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500" placeholder={`My ${dbType} Production DB`} />
        {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message as string}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">{dbType} Connection String (URI)</label>
        <input {...register('connectionString')} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-indigo-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500" placeholder="postgresql://user:password@ep-hidden-haze.aws.neon.tech/neondb?sslmode=require" autoComplete="off" />
        {errors.connectionString && <p className="text-xs text-rose-400 mt-1">{errors.connectionString.message as string}</p>}
      </div>

      <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        <span>{isLoading ? 'Connecting...' : 'Save & Connect Database'}</span>
      </button>
    </form>
  )
}

function MySQLForm({ onSubmit, isLoading, dbType }: { onSubmit: (data: Record<string, unknown>) => Promise<void>; isLoading: boolean; dbType: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(mysqlSchema), defaultValues: { port: 3306, ssl: false } })
  return (
    <form onSubmit={handleSubmit(data => onSubmit(data as Record<string, unknown>))} className="space-y-4 font-sans">
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Connection Name</label>
        <input {...register('name')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500" placeholder={`My ${dbType} DB`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Host</label>
          <input {...register('host')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="127.0.0.1" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Port</label>
          <input {...register('port')} type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" defaultValue={3306} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Database Name</label>
          <input {...register('database')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="production_db" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Username</label>
          <input {...register('username')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="root" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
        <input {...register('password')} type="password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        <span>{isLoading ? 'Connecting...' : 'Save & Connect Database'}</span>
      </button>
    </form>
  )
}

function SQLServerForm({ onSubmit, isLoading }: { onSubmit: (data: Record<string, unknown>) => Promise<void>; isLoading: boolean }) {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(sqlServerSchema), defaultValues: { port: 1433 } })
  return (
    <form onSubmit={handleSubmit(data => onSubmit(data as Record<string, unknown>))} className="space-y-4 font-sans">
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Connection Name</label>
        <input {...register('name')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="Azure SQL Server DB" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Host / Server</label>
          <input {...register('host')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="sqlserver.database.windows.net" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Port</label>
          <input {...register('port')} type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" defaultValue={1433} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Database Name</label>
          <input {...register('database')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="sql_prod" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Username</label>
          <input {...register('username')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="sa" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
        <input {...register('password')} type="password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        <span>{isLoading ? 'Connecting...' : 'Save & Connect SQL Server'}</span>
      </button>
    </form>
  )
}

function MongoForm({ onSubmit, isLoading }: { onSubmit: (data: Record<string, unknown>) => Promise<void>; isLoading: boolean }) {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(mongoSchema) })
  return (
    <form onSubmit={handleSubmit(data => onSubmit(data as Record<string, unknown>))} className="space-y-4 font-sans">
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Connection Name</label>
        <input {...register('name')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="MongoDB Atlas Prod" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">MongoDB URI (mongodb+srv://...)</label>
        <input {...register('connectionString')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-emerald-300 focus:outline-none focus:border-indigo-500" placeholder="mongodb+srv://user:pass@cluster.mongodb.net/dbname" />
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        <span>{isLoading ? 'Connecting...' : 'Save & Connect MongoDB'}</span>
      </button>
    </form>
  )
}

function SQLiteForm({ onSubmit, isLoading }: { onSubmit: (data: Record<string, unknown>) => Promise<void>; isLoading: boolean }) {
  const { register, handleSubmit, setValue } = useForm({ resolver: zodResolver(sqliteSchema) })
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
      setValue('filePath', `./data/uploads/${file.name}`)
      toast.success(`SQLite file "${file.name}" selected`)
    }
  }

  return (
    <form onSubmit={handleSubmit(data => onSubmit(data as Record<string, unknown>))} className="space-y-4 font-sans">
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Connection Name</label>
        <input {...register('name')} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="Local SQLite DB" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">SQLite File Upload (.db, .sqlite, .sqlite3)</label>
        <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center bg-slate-950/60 cursor-pointer transition-colors relative">
          <input type="file" accept=".db,.sqlite,.sqlite3" onChange={handleFileDrop} className="absolute inset-0 opacity-0 cursor-pointer" />
          <Upload size={24} className="text-indigo-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-white">Click or Drag & Drop SQLite file here</p>
          <p className="text-[10px] text-slate-500 mt-1">Supports .db, .sqlite, .sqlite3 files up to 100MB</p>
          {uploadedFile && (
            <p className="mt-3 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 inline-block">
              Selected: {uploadedFile}
            </p>
          )}
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        <span>{isLoading ? 'Uploading & Connecting...' : 'Save & Connect SQLite'}</span>
      </button>
    </form>
  )
}
