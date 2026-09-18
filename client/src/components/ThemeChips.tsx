import { useState } from 'react';

const THEME_CHIPS = [
  "Waterfalls",
  "Wine", 
  "Fall Foliage",
  "Lakeside Cabins",
  "Scenic Drives",
  "Photography Spots",
  "Weekend Getaway",
  "Weddings",
  "Graduations",
  "Festivals",
] as const;

const SEASONS = [
  { key: "any", label: "Any Season" },
  { key: "spring", label: "Spring" },
  { key: "summer", label: "Summer" },
  { key: "fall", label: "Fall" },
  { key: "winter", label: "Winter" },
] as const;

const REGIONS = [
  { key: "any", label: "Any Region" },
  { key: "northeast", label: "Northeast" },
  { key: "southeast", label: "Southeast" },
  { key: "midwest", label: "Midwest" },
  { key: "southwest", label: "Southwest" },
  { key: "west", label: "West Coast" },
  { key: "pacific", label: "Pacific Northwest" },
] as const;

type Theme = typeof THEME_CHIPS[number];

interface ThemeChipsProps {
  onThemeChange?: (themes: Theme[]) => void;
  onSeasonChange?: (season: string) => void;
  onRegionChange?: (region: string) => void;
}

export default function ThemeChips({ onThemeChange, onSeasonChange, onRegionChange }: ThemeChipsProps) {
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [selectedSeason, setSelectedSeason] = useState("any");
  const [selectedRegion, setSelectedRegion] = useState("any");

  const handleThemeToggle = (theme: Theme) => {
    const newThemes = selectedThemes.includes(theme)
      ? selectedThemes.filter(t => t !== theme)
      : [...selectedThemes, theme];
    
    setSelectedThemes(newThemes);
    onThemeChange?.(newThemes);
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    onSeasonChange?.(season);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    onRegionChange?.(region);
  };

  return (
    <div className="theme-selection-container">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-orbitron text-3xl md:text-4xl font-bold gradient-title mb-4">
          Bundle Your Perfect Trip
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose themes that inspire you. Our AI will curate experiences, accommodations, and services that bring your vision to life.
        </p>
      </div>

      {/* Theme Chips */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Choose Your Themes</h3>
        <div className="flex flex-wrap gap-3">
          {THEME_CHIPS.map((theme) => (
            <button
              key={theme}
              onClick={() => handleThemeToggle(theme)}
              data-testid={`theme-chip-${theme.toLowerCase().replace(/\s+/g, '-')}`}
              className={`theme-chip ${
                selectedThemes.includes(theme) ? 'theme-chip-selected' : ''
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Season & Region Selection */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Season Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Preferred Season</h3>
          <div className="grid grid-cols-3 gap-2">
            {SEASONS.map((season) => (
              <button
                key={season.key}
                onClick={() => handleSeasonChange(season.key)}
                data-testid={`season-${season.key}`}
                className={`season-button ${
                  selectedSeason === season.key ? 'season-button-selected' : ''
                }`}
              >
                {season.label}
              </button>
            ))}
          </div>
        </div>

        {/* Region Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Target Region</h3>
          <select
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            data-testid="region-select"
            className="region-select"
          >
            {REGIONS.map((region) => (
              <option key={region.key} value={region.key}>
                {region.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedThemes.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-xl p-6 border border-cyan-200">
          <h4 className="font-semibold text-gray-800 mb-2">Your Bundle Preview</h4>
          <p className="text-gray-600">
            <span className="text-cyan-600 font-medium">{selectedThemes.length} theme{selectedThemes.length !== 1 ? 's' : ''}</span>
            {" selected: "}
            <span className="text-gray-800">{selectedThemes.join(", ")}</span>
            {selectedSeason !== "any" && (
              <span> • <span className="text-cyan-600">Season:</span> {SEASONS.find(s => s.key === selectedSeason)?.label}</span>
            )}
            {selectedRegion !== "any" && (
              <span> • <span className="text-cyan-600">Region:</span> {REGIONS.find(r => r.key === selectedRegion)?.label}</span>
            )}
          </p>
        </div>
      )}

      <style>{`
        .theme-selection-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .theme-chip {
          padding: 0.75rem 1.5rem;
          border: 2px solid #d1d5db;
          border-radius: 2rem;
          background: white;
          color: #374151;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .theme-chip:hover {
          border-color: #00D4FF;
          background: rgba(0, 212, 255, 0.05);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 212, 255, 0.15);
        }

        .theme-chip-selected {
          border-color: #00D4FF;
          background: linear-gradient(135deg, #00D4FF, #9B59B6);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 16px rgba(0, 212, 255, 0.25);
        }

        .season-button {
          padding: 0.75rem 1rem;
          border: 2px solid #d1d5db;
          border-radius: 0.75rem;
          background: white;
          color: #374151;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .season-button:hover {
          border-color: #00D4FF;
          background: rgba(0, 212, 255, 0.05);
        }

        .season-button-selected {
          border-color: #00D4FF;
          background: linear-gradient(135deg, #00D4FF, #9B59B6);
          color: white;
          font-weight: 600;
        }

        .region-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #d1d5db;
          border-radius: 0.75rem;
          background: white;
          color: #374151;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .region-select:focus {
          outline: none;
          border-color: #00D4FF;
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }

        .region-select option {
          color: #374151;
          background: white;
        }
      `}</style>
    </div>
  );
}