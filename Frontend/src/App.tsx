import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { ParentsPage } from './pages/ParentsPage'
import { StudentsPage } from './pages/StudentsPage'
import { ClassesPage } from './pages/ClassesPage'
import { SubscriptionsPage } from './pages/SubscriptionsPage'

function App () {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/parents' element={<ParentsPage />} />
          <Route path='/students' element={<StudentsPage />} />
          <Route path='/classes' element={<ClassesPage />} />
          <Route path='/subscriptions' element={<SubscriptionsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
