const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function parseCollectionResponse(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  const candidates = [
    payload?.results,
    payload?.items,
    payload?.data,
    payload?.data?.results,
    payload?.data?.items,
  ]

  const records = candidates.find(Array.isArray)
  if (records) {
    return records
  }

  throw new Error('The API returned an unsupported collection response.')
}

export function displayPerson(person) {
  if (!person || typeof person !== 'object') {
    return person || '—'
  }

  return person.displayName || person.username || person.name || '—'
}

export function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}
