function CollectionTable({ title, description, columns, rows, loading, error, emptyMessage }) {
  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">OCTOFIT TRACKER</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>

      {loading && (
        <div className="alert alert-info" role="status">
          Loading {title.toLowerCase()}…
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-responsive data-card">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.heading} scope="col">
                    {column.heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="empty-state" colSpan={columns.length}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row._id || row.id || `${title}-${index}`}>
                    {columns.map((column) => (
                      <td key={column.heading}>{column.render(row)}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default CollectionTable
