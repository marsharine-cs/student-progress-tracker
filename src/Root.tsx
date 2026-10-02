import { lazy, Suspense } from 'react'
import DemoPage from './components/DemoPage'

const App = lazy(() => import('./App'))

export default function Root() {
  const isDemo = new URLSearchParams(window.location.search).get('demo') === '1'
  return <Suspense fallback={<p className="p-8 text-white">Loading...</p>}>
    {isDemo ? <DemoPage /> : <App />}
  </Suspense>
}
