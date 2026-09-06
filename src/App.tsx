import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import Auth from './components/Auth'
import StudentsPage from './components/StudentsPage'
import SkillsPage from './components/SkillsPage'
import AssessmentsPage from './components/AssessmentsPage'

type Tab = 'students' | 'skills' | 'assessments'

const TABS: { value: Tab; label: string }[] = [
  { value: 'students', label: 'Students' },
  { value: 'skills', label: 'Skills' },
  { value: 'assessments', label: 'Assessments' },
]

const TAB_PAGES: Record<Tab, () => React.ReactElement> = {
  students: StudentsPage,
  skills: SkillsPage,
  assessments: AssessmentsPage,
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('students')

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
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-8">
        <p className="text-slate-400">{session.user.email}</p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
        >
          Log Out
        </button>
      </div>
      <div className="max-w-2xl mx-auto flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {(() => {
        const ActivePage = TAB_PAGES[activeTab]
        return <ActivePage />
      })()}
    </div>
  )
}

export default App