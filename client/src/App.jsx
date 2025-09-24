import './App.css'
import { TaskProvider } from './context/TaskContext'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import FilterBar from './components/FilterBar'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <TaskProvider>
      <div id="root">
        <header className="app-header">
          <h1>Task Manager</h1>
          <ThemeToggle />
        </header>
        <TaskForm />
        <FilterBar />
        <TaskList />
      </div>
    </TaskProvider>
  )
}

export default App
