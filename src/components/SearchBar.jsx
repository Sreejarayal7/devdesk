export default function SearchBar({ search, setSearch }) {
  return (
    <div className="search-wrap">
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>
  )
}