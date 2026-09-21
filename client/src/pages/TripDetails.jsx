import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);


  // ========================================
  // GET TRIP
  // ========================================

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/trips/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load trip"
          );
        }

        setTrip(data.trip);

      } catch (error) {
        console.error(error);

        setError(error.message);

      } finally {
        setLoading(false);
      }
    };

    fetchTrip();

  }, [id]);


  // ========================================
  // DATE FORMAT
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="trip-details-page">
        <h2>Loading trip...</h2>
      </div>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="trip-details-page">

        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </div>
    );
  }


  // ========================================
  // TRIP NOT FOUND
  // ========================================

  if (!trip) {
    return (
      <div className="trip-details-page">

        <h2>Trip not found</h2>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </div>
    );
  }


  // ========================================
  // ALL PHOTOS
  // ========================================

  const photos = trip.photos || [];


  return (
    <div className="trip-details-page">

      {/* ==================================
          BACK BUTTON
          ================================== */}

      <button
        className="back-button"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        ← Back to My Trips
      </button>


      {/* ==================================
          HERO IMAGE
          ================================== */}

      {trip.coverImage && (
        <div className="trip-details-hero">

          <img
            src={trip.coverImage}
            alt={trip.title}
          />

        </div>
      )}


      {/* ==================================
          TRIP INFORMATION
          ================================== */}

      <div className="trip-details-card">

        <div className="trip-details-header">

          <div>

            <h1>
              {trip.title}
            </h1>

            <p className="trip-location">
              📍 {trip.destination}
            </p>

          </div>


          <div className="details-rating">
            {trip.rating || 0}/5 ⭐
          </div>

        </div>


        {/* DATE */}

        <div className="details-info">

          <div>
            <span>📅</span>

            <strong>Dates</strong>

            <p>
              {formatDate(
                trip.startDate
              )}
              {" – "}
              {formatDate(
                trip.endDate
              )}
            </p>
          </div>


          {/* DESCRIPTION */}

          <div>
            <span>📝</span>

            <strong>Description</strong>

            <p>
              {trip.description ||
                "No description available."}
            </p>
          </div>

        </div>

      </div>


      {/* ==================================
          PHOTO GALLERY
          ================================== */}

      <section className="trip-photo-section">

        <h2>
          Trip Photos 📸
        </h2>


        {photos.length === 0 ? (

          <div className="no-photos">

            <p>
              No additional photos
              uploaded yet.
            </p>

          </div>

        ) : (

          <div className="photo-gallery">

            {photos.map(
              (photo, index) => (

                <div
                  className="gallery-photo"
                  key={index}
                  onClick={() =>
                    setSelectedImage(
                      photo
                    )
                  }
                >

                  <img
                    src={photo}
                    alt={`Trip photo ${
                      index + 1
                    }`}
                  />

                  <div className="gallery-overlay">
                    🔍 View
                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* ==================================
          FULL IMAGE MODAL
          ================================== */}

      {selectedImage && (

        <div
          className="photo-modal"
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <button
            className="photo-modal-close"
            onClick={() =>
              setSelectedImage(null)
            }
          >
            ✕
          </button>


          <img
            src={selectedImage}
            alt="Trip"
            className="photo-modal-image"
            onClick={(event) =>
              event.stopPropagation()
            }
          />

        </div>

      )}

    </div>
  );
}

export default TripDetails; 