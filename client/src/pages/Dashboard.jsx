import { useEffect, useState } from "react";

import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";

import "./Dashboard.css";


function Dashboard() {

  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [editingTrip, setEditingTrip] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");


  // ========================================
  // GET ALL TRIPS
  // ========================================

  const fetchTrips = async () => {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem("token");


      const response = await fetch(
        "http://localhost:5000/api/trips",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to fetch trips"
        );

      }


      setTrips(data.trips || []);

    }

    catch (error) {

      console.error(error);

      setError(error.message);

    }

    finally {

      setLoading(false);

    }

  };


  // ========================================
  // LOAD TRIPS
  // ========================================

  useEffect(() => {

    fetchTrips();

  }, []);


  // ========================================
  // CREATE / UPDATE COMPLETE
  // ========================================

  const handleTripSaved = () => {

    setEditingTrip(null);

    setShowForm(false);

    fetchTrips();

  };


  // ========================================
  // EDIT
  // ========================================

  const handleEdit = (trip) => {

    setEditingTrip(trip);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async (tripId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );


    if (!confirmed) {
      return;
    }


    try {

      const token =
        localStorage.getItem("token");


      const response = await fetch(
        `http://localhost:5000/api/trips/${tripId}`,
        {
          method: "DELETE",

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
          "Failed to delete trip"
        );

      }


      await fetchTrips();

    }

    catch (error) {

      console.error(error);

      alert(error.message);

    }

  };


  // ========================================
  // SEARCH
  // ========================================

  const filteredTrips = trips.filter(
    (trip) => {

      const searchText =
        search.toLowerCase();

      return (
        trip.title
          ?.toLowerCase()
          .includes(searchText) ||

        trip.destination
          ?.toLowerCase()
          .includes(searchText) ||

        trip.description
          ?.toLowerCase()
          .includes(searchText)
      );

    }
  );


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };


  return (

    <div className="dashboard-page">


      {/* ==================================
          NAVBAR
          ================================== */}

      <nav className="navbar">

        <div className="nav-logo">

          <span>✈️</span>

          <span>TripVault</span>

        </div>


        <div className="nav-links">

          <button className="nav-link active">
            🏠 &nbsp; Dashboard
          </button>

          <button className="nav-link">
            🗺️ &nbsp; My Trips
          </button>

          <button className="nav-link">
            👤 &nbsp; Profile
          </button>

        </div>


        <div className="nav-user">

          <div className="avatar">
            TV
          </div>

          <span className="username">
            Traveler
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            ⇥ &nbsp; Logout
          </button>

        </div>

      </nav>


      {/* ==================================
          MAIN
          ================================== */}

      <main className="dashboard-content">


        {/* HERO */}

        <section className="dashboard-header">

          <div>

            <h1 className="hero-title">
              My Travel Memories 
            </h1>

            <p className="hero-subtitle">
              Collect moments, not things.
              Keep your travel stories alive.
            </p>

          </div>


          <div className="header-actions">

            <input
              className="search-box"
              type="text"
              placeholder="🔍  Search trips..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />


            <button
              className="add-trip-btn"
              onClick={() => {

                setEditingTrip(null);

                setShowForm(true);

              }}
            >
              ＋ Add Trip
            </button>

          </div>

        </section>


        {/* CREATE / EDIT FORM */}

        {showForm && (

          <div className="form-wrapper">

            <TripForm

              editingTrip={editingTrip}

              onTripSaved={handleTripSaved}

              onCancelEdit={() => {

                setEditingTrip(null);

                setShowForm(false);

              }}

            />

          </div>

        )}


        {/* LOADING */}

        {loading && (

          <div className="status-message">
            ✈️ Loading your memories...
          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="status-message">
            ❌ {error}
          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredTrips.length === 0 && (

            <div className="status-message">

              {search
                ? "🔍 No trips match your search."
                : "🌎 You haven't added any trips yet."}

            </div>

        )}


        {/* TRIPS */}

        {!loading &&
          !error &&
          filteredTrips.length > 0 && (

            <section className="trip-grid">

              {filteredTrips.map(
                (trip) => (

                  <TripCard

                    key={trip._id}

                    trip={trip}

                    onEdit={handleEdit}

                    onDelete={handleDelete}

                  />

                )
              )}

            </section>

        )}

      </main>

    </div>

  );

}

export default Dashboard;