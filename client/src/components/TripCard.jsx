function TripCard({ trip, onEdit, onDelete }) {

  const getDestinationClass = () => {
    const destination = trip.destination?.toLowerCase() || "";

    if (destination.includes("bali")) return "bali";
    if (destination.includes("manali")) return "manali";
    if (destination.includes("goa")) return "goa";
    if (
      destination.includes("paris") ||
      destination.includes("france")
    ) {
      return "paris";
    }
    if (destination.includes("munnar")) return "munnar";
    if (
      destination.includes("rajasthan") ||
      destination.includes("jaipur")
    ) {
      return "rajasthan";
    }

    return "goa";
  };

  return (
    <article className="trip-card">

      {/* Image / visual area */}
      <div
        className={`trip-image ${getDestinationClass()}`}
      >

        {trip.rating && (
          <div className="rating-badge">
            {trip.rating}/5
            <span className="rating-star">★</span>
          </div>
        )}

      </div>


      {/* Card content */}
      <div className="trip-card-content">

        <h3 className="trip-title">
          {trip.title}
        </h3>


        <div className="trip-detail">
          <span className="detail-icon">📍</span>

          <span>
            {trip.destination}
          </span>
        </div>


        <div className="trip-detail">
          <span className="detail-icon">📅</span>

          <span>
            {trip.startDate
              ? new Date(
                  trip.startDate
                ).toLocaleDateString()
              : "No start date"}

            {"  –  "}

            {trip.endDate
              ? new Date(
                  trip.endDate
                ).toLocaleDateString()
              : "No end date"}
          </span>
        </div>


        <div className="trip-detail">
          <span className="detail-icon">📝</span>

          <span>
            {trip.description || "No description"}
          </span>
        </div>


        {/* Buttons */}
        <div className="trip-buttons">

          <button
            className="edit-btn"
            onClick={() => onEdit(trip)}
          >
            ✎ &nbsp; Edit
          </button>


          <button
            className="delete-btn"
            onClick={() => onDelete(trip._id)}
          >
            🗑 &nbsp; Delete
          </button>

        </div>

      </div>

    </article>
  );
}

export default TripCard;