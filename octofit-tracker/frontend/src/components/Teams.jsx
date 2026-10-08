import { useEffect, useState } from 'react'
import { API_BASE_URL, displayPerson, parseCollectionResponse } from '../api.js'
import CollectionTable from './CollectionTable.jsx'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadTeams() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teams/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Unable to load teams (HTTP ${response.status}).`)
        }
        setTeams(parseCollectionResponse(await response.json()))
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load teams.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadTeams()
    return () => controller.abort()
  }, [])

  const columns = [
    { heading: 'Team', render: (team) => team.name || '—' },
    { heading: 'Description', render: (team) => team.description || '—' },
    { heading: 'Captain', render: (team) => displayPerson(team.captain) },
    {
      heading: 'Members',
      render: (team) =>
        Array.isArray(team.members)
          ? team.members.map(displayPerson).join(', ') || '—'
          : '—',
    },
  ]

  return (
    <CollectionTable
      columns={columns}
      description="Find your crew and reach your goals together."
      emptyMessage="No teams have been created yet."
      error={error}
      loading={loading}
      rows={teams}
      title="Teams"
    />
  )
}

export default Teams
