import { useEffect, useState } from 'react'
import { API_BASE_URL, displayPerson, formatDate, parseCollectionResponse } from '../api.js'
import CollectionTable from './CollectionTable.jsx'

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadActivities() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/activities/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Unable to load activities (HTTP ${response.status}).`)
        }
        setActivities(parseCollectionResponse(await response.json()))
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load activities.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadActivities()
    return () => controller.abort()
  }, [])

  const columns = [
    { heading: 'Athlete', render: (activity) => displayPerson(activity.user) },
    { heading: 'Activity', render: (activity) => activity.activityType || '—' },
    { heading: 'Date', render: (activity) => formatDate(activity.date) },
    {
      heading: 'Duration',
      render: (activity) =>
        activity.durationMinutes ? `${activity.durationMinutes} min` : '—',
    },
    {
      heading: 'Distance',
      render: (activity) => (activity.distanceKm ? `${activity.distanceKm} km` : '—'),
    },
    {
      heading: 'Calories',
      render: (activity) => activity.caloriesBurned ?? '—',
    },
  ]

  return (
    <CollectionTable
      columns={columns}
      description="Recent movement and milestones from the community."
      emptyMessage="No activities have been logged yet."
      error={error}
      loading={loading}
      rows={activities}
      title="Activities"
    />
  )
}

export default Activities
