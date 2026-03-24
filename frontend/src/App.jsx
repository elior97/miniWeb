import { useState, useEffect } from 'react'
import './App.css'
import StatusList from './components/StatusList'
import TransitionList from './components/TransitionList'
import { getStatuses, getTransitions, addStatus, deleteStatus, addTransition, deleteTransition, resetAll } from './api'

function App() {
  const [statuses, setStatuses] = useState([])
  const [transitions, setTransitions] = useState([])

  useEffect(() => {
    getStatuses().then(setStatuses)
    getTransitions().then(setTransitions)
  }, [])

  function handleAddStatus(name, isInitial) {
    return addStatus(name, isInitial).then((newStatus) => {
      setStatuses((prev) => [...prev, newStatus])
    })
  }

  function handleDeleteStatus(id) {
    return deleteStatus(id).then(() => {
      // Re-fetch both: backend cascades transition deletes and labels change
      return Promise.all([
        getStatuses().then(setStatuses),
        getTransitions().then(setTransitions),
      ])
    })
  }

  function handleAddTransition(name, fromId, toId) {
    return addTransition(name, fromId, toId).then((newTransition) => {
      setTransitions((prev) => [...prev, newTransition])
      // Re-fetch statuses so labels (final/orphan) update
      getStatuses().then(setStatuses)
    })
  }

  function handleDeleteTransition(id) {
    return deleteTransition(id).then(() => {
      setTransitions((prev) => prev.filter((t) => t.id !== id))
      // Re-fetch statuses so labels update
      getStatuses().then(setStatuses)
    })
  }

  function handleReset() {
    resetAll().then(() => {
      setStatuses([])
      setTransitions([])
    })
  }

  return (
    <>
      <h1>Build a Workflow</h1>
      <div className="panels">
        <StatusList
          statuses={statuses}
          onAdd={handleAddStatus}
          onDelete={handleDeleteStatus}
        />
        <TransitionList
          statuses={statuses}
          transitions={transitions}
          onAdd={handleAddTransition}
          onDelete={handleDeleteTransition}
        />
      </div>
      <div className="reset-area">
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>
      <footer className="app-footer">
        <span>Methoda computers ltd.</span>
      </footer>
    </>
  )
}

export default App
