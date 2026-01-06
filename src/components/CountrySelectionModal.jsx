import COUNTRIES from "../data/countries";
import "../App.css";

function CountrySelectionModal({ onSelect, availableCountries }) {
  const presentCountryNames = new Set(
    (availableCountries || [])
      .filter((hex) => hex.country)
      .map((hex) => hex.country)
  );

  const displayedCountries = availableCountries
    ? COUNTRIES.filter((c) => presentCountryNames.has(c.name))
    : COUNTRIES;

  return (
    <div className="modal-overlay">
      <div className="country-select-panel">
        <h2>🏳️ Choose Your Country</h2>
        <p>Select a nation to lead in the conflict:</p>

        <div className="country-grid">
          {displayedCountries.map((country) => (
            <button
              key={country.id}
              className="country-select-btn"
              onClick={() => onSelect(country.name)}
              style={{ borderLeft: `6px solid ${country.color}` }}
            >
              <span className="country-name">{country.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CountrySelectionModal;
