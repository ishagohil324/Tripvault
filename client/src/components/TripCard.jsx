import { useState } from "react";

function TripCard({
  trip,
  onEdit,
  onDelete,
}) {
  const [showImage, setShowImage] = useState(false);

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };

  // ========================================
  // IMAGE CLICK
  // ========================================

  const handleImageClick = () => {
    if (trip.coverImage) {
      setShowImage(true);
    }
  };

  return (
    <>
      {/* ======================================
          TRIP CARD
          ====================================== */}

      <div className="trip-card">

        {/* ====================================
            IMAGE
            ==================================== */}

        <div
          className={`trip-image ${
            trip.coverImage
              ? "has-cover-image"
              : ""
          }`}
          onClick={handleImageClick}
        >

          {trip.coverImage ? (
            <img
              src={trip.coverImage}
              alt={`${trip.title} trip`}
              className="trip-cover-image"
            />
          ) : (
            <div className="trip-image-placeholder">
              ✈️
            </div>
          )}

          {/* IMAGE HOVER TEXT */}

          {trip.coverImage && (
            <div className="image-view-overlay">
              🔍 Click to view
            </div>
          )}

          {/* RATING */}

          <div className="rating-badge">
            {trip.rating || 0}/5
            <span className="rating-star">
              ⭐
            </span>
          </div>

        </div>


        {/* ====================================
            CARD CONTENT
            ==================================== */}

        <div className="trip-card-content">

          {/* TITLE */}

          <h2 className="trip-title">
            {trip.title}
          </h2>


          {/* DESTINATION */}

          <div className="trip-detail">
            <span className="detail-icon">
              📍
            </span>

            <span>
              {trip.destination}
            </span>
          </div>


          {/* DATE */}

          <div className="trip-detail">
            <span className="detail-icon">
              🗓️
            </span>

            <span>
              {formatDate(trip.startDate)}
              {" – "}
              {formatDate(trip.endDate)}
            </span>
          </div>


          {/* DESCRIPTION */}

          <div className="trip-detail trip-description">
            <span className="detail-icon">
              📝
            </span>

            <span>
              {trip.description ||
                "No description"}
            </span>
          </div>


          {/* ==================================
              BUTTONS
              ================================== */}

          <div className="trip-buttons">

            <button
              className="edit-btn"
              onClick={() =>
                onEdit(trip)
              }
            >
              ✎ Edit
            </button>


            <button
              className="delete-btn"
              onClick={() =>
                onDelete(trip._id)
              }
            >
              🗑 Delete
            </button>

          </div>

        </div>

      </div>


      {/* ======================================
          FULL IMAGE POPUP
          ====================================== */}

      {showImage && trip.coverImage && (

        <div
          className="image-modal"
          onClick={() =>
            setShowImage(false)
          }
        >

          <button
            className="image-modal-close"
            onClick={() =>
              setShowImage(false)
            }
          >
            ✕
          </button>


          <img
            src={trip.coverImage}
            alt={trip.title}
            className="image-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          />

        </div>

      )}

    </>
  );
}

export default TripCard;