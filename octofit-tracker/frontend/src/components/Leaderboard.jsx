import { useEffect, useState } from 'react'
import { API_BASE_URL, displayPerson, parseCollectionResponse } from '../api.js'
import CollectionTable from './CollectionTable.jsx'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadLeaderboard() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Unable to load the leaderboard (HTTP ${response.status}).`)
        }
        setEntries(parseCollectionResponse(await response.json()))
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load the leaderboard.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()
    return () => controller.abort()
  }, [])

  const columns = [
    { heading: 'Rank', render: (entry) => `#${entry.rank ?? '—'}` },
    { heading: 'Athlete', render: (entry) => displayPerson(entry.user) },
    { heading: 'Team', render: (entry) => displayPerson(entry.team) },
    { heading: 'Points', render: (entry) => entry.points ?? 0 },
    { heading: 'Period', render: (entry) => entry.period || 'all-time' },
  ]

  return (
    <CollectionTable
      columns={columns}
      description="Celebrate the athletes putting in the work."
      emptyMessage="Leaderboard standings will appear when points are earned."
      error={error}
      loading={loading}
      rows={entries}
      title="Leaderboard"
    />
  )
}

export default Leaderboard
