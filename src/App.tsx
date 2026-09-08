import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import Auth from './components/Auth'
import DashboardPage from './components/DashboardPage'
import StudentsPage from './components/StudentsPage'
import SkillsPage from './components/SkillsPage'
import AssessmentsPage from './components/AssessmentsPage'

type Tab = 'dashboard' | 'students' | 'skills' | 'assessments'

const TABS: { value: Tab; label: string }[] = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'students', label: 'Students' },
  { value: 'skills', label: 'Skills' },
  { value: 'assessments', label: 'Assessments' },
]

const TAB_PAGES: Record<Tab, () => React.ReactElement> = {
  dashboard: DashboardPage,
  students: StudentsPage,
  skills: SkillsPage,
  assessments: AssessmentsPage,
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
            Student Progress Tracker
          </p>
          <p className="mt-1 text-sm text-slate-400">{session.user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="self-start sm:self-auto bg-red-600 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 text-white px-4 py-2 rounded font-semibold"
        >
          Log Out
        </button>
      </div>

      <nav className="max-w-5xl mx-auto mb-6 overflow-x-auto" aria-label="Application sections">
        <div className="flex min-w-max gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              aria-current={activeTab === tab.value ? 'page' : undefined}
              className={`px-4 py-2 rounded font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                activeTab === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {(() => {
        const ActivePage = TAB_PAGES[activeTab]
        return <ActivePage />
      })()}
    </div>
  )
}

export default App
