export default function Filters({ searchCity, setSearchCity, filterGender, setFilterGender }) {
  return (
    <div className="dash-filters">
      <div className="dash-search">
        <svg className="dash-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher par ville (ex: Dakar, Abidjan...)"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
      </div>

      <div className="dash-gender-filters">
        <button
          className={`dash-filter-btn ${filterGender === 'all' ? 'active' : ''}`}
          onClick={() => setFilterGender('all')}
        >
          🌍 Tous
        </button>
        <button
          className={`dash-filter-btn ${filterGender === 'Femme' ? 'active' : ''}`}
          onClick={() => setFilterGender('Femme')}
        >
          👩 Femme
        </button>
        <button
          className={`dash-filter-btn ${filterGender === 'Homme' ? 'active' : ''}`}
          onClick={() => setFilterGender('Homme')}
        >
          👨 Homme
        </button>
      </div>
    </div>
  )
}