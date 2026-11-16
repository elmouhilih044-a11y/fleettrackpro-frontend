import { useState } from "react"
import TruckCard from "./TruckCard"

function TruckList({ trucks, selectedId, onSelect }) {
  const [filter, setFilter] = useState("all")

  const shownTrucks =
    filter === "all" ? trucks : trucks.filter((truck) => truck.status === filter)

  return (
    <div>
      <label htmlFor="truck-filter">Filtrer par statut</label>
      <select
        id="truck-filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      >
        <option value="all">Tous</option>
        <option value="available">Disponibles</option>
        <option value="maintenance">En maintenance</option>
        <option value="inactive">Archivés</option>
      </select>

      {shownTrucks.length === 0 ? (
        <p>Aucun camion à afficher.</p>
      ) : (
        <ul className="list">
          {shownTrucks.map((truck) => (
            <TruckCard
              key={truck._id}
              truck={truck}
              selected={truck._id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default TruckList