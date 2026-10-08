import { useEffect, useState } from 'react'
import { API_BASE_URL, parseCollectionResponse } from '../api.js'
import CollectionTable from './CollectionTable.jsx'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadWorkouts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/workouts/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Unable to load workouts (HTTP ${response.status}).`)
        }
        setWorkouts(parseCollectionResponse(await response.json()))
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load workouts.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadWorkouts()
    return () => controller.abort()
  }, [])

  const columns = [
    { heading: 'Workout', render: (workout) => workout.name || '—' },
    { heading: 'Activity', render: (workout) => workout.activityType || '—' },
    { heading: 'Difficulty', render: (workout) => workout.difficulty || '—' },
    {
      heading: 'Duration',
      render: (workout) => (workout.durationMinutes ? `${workout.durationMinutes} min` : '—'),
    },
    {
      heading: 'Goals',
      render: (workout) =>
        Array.isArray(workout.targetGoals) ? workout.targetGoals.join(', ') : '—',
    },
  ]

  return (
    <CollectionTable
      columns={columns}
      description="Choose a session that supports your personal fitness goals."
      emptyMessage="No workout suggestions are available."
      error={error}
      loading={loading}
      rows={workouts}
      title="Workouts"
    />
  )
}

export default Workouts
