import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TripCard({
  trip,
  onEdit,
  onDelete,
}) {
  const [showImage, setShowImage] = useState(false);

  // ========================================
  // NAVIGATION
  // ========================================

  const navigate = useNavigate();

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

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

  const handleImageClick = (event) => {
    event.stopPropagation();

    if (trip.coverImage) {
      setShowImage(true);
    }
  };

  // ========================================
  // OPEN TRIP DETAILS
  // ========================================

  const handleTripDetails = () => {
    navigate(`/trips/${trip._id}`);
  };

  // ========================================
  // RETURN
  // ========================================

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

          {/* REAL IMAGE */}

          {trip.coverImage ? (
            <img
              src={trip.coverImage}
              alt={`${trip.title} trip`}
              className="trip-cover-image"
            />
          ) : (
            /* PLACEHOLDER */

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

          <h2
            className="trip-title clickable-title"
            onClick={handleTripDetails}
          >
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

            {/* EDIT */}

            <button
              className="edit-btn"
              onClick={(event) => {
                event.stopPropagation();

                onEdit(trip);
              }}
            >
              ✎ Edit
            </button>


            {/* DELETE */}

            <button
              className="delete-btn"
              onClick={(event) => {
                event.stopPropagation();

                onDelete(trip._id);
              }}
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

          {/* CLOSE BUTTON */}

          <button
            className="image-modal-close"
            onClick={(event) => {
              event.stopPropagation();

              setShowImage(false);
            }}
          >
            ✕
          </button>


          {/* LARGE IMAGE */}

          <img
            src={trip.coverImage}
            alt={trip.title}
            className="image-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          />

        </div>

      )}

    </>
  );
}

export default TripCard;