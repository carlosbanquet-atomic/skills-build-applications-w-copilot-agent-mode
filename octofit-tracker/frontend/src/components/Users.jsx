import { useEffect, useState } from 'react'
import { API_BASE_URL, displayPerson, parseCollectionResponse } from '../api.js'
import CollectionTable from './CollectionTable.jsx'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Unable to load athletes (HTTP ${response.status}).`)
        }
        setUsers(parseCollectionResponse(await response.json()))
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load athletes.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadUsers()
    return () => controller.abort()
  }, [])

  const columns = [
    { heading: 'Athlete', render: (user) => user.displayName || user.username || '—' },
    { heading: 'Username', render: (user) => user.username || '—' },
    { heading: 'Email', render: (user) => user.email || '—' },
    { heading: 'Team', render: (user) => displayPerson(user.team) },
  ]

  return (
    <CollectionTable
      columns={columns}
      description="Meet the people building healthy habits together."
      emptyMessage="No athletes found."
      error={error}
      loading={loading}
      rows={users}
      title="Athletes"
    />
  )
}

export default Users
