import { TRUCK_STATUS_LABELS } from "../truckStatus"

function TruckCard({ truck, selected, onSelect }) {
  return (
    <li>
      <button
        className={selected ? "card active" : "card"}
        onClick={() => onSelect(truck._id)}
      >
        {truck.registrationNumber} - {truck.brand} {truck.model} ({TRUCK_STATUS_LABELS[truck.status]})
      </button>
    </li>
  )
}

export default TruckCard