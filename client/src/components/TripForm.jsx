import { useState } from "react";

function TripForm({ onTripSaved, editingTrip, onCancelEdit }) {
  const [title, setTitle] = useState(
    editingTrip?.title || ""
  );

  const [destination, setDestination] = useState(
    editingTrip?.destination || ""
  );

  const [startDate, setStartDate] = useState(
    editingTrip?.startDate
      ? editingTrip.startDate.substring(0, 10)
      : ""
  );

  const [endDate, setEndDate] = useState(
    editingTrip?.endDate
      ? editingTrip.endDate.substring(0, 10)
      : ""
  );

  const [description, setDescription] = useState(
    editingTrip?.description || ""
  );

  const [rating, setRating] = useState(
    editingTrip?.rating || ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const tripData = {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating: rating ? Number(rating) : undefined,
    };

    const url = editingTrip
      ? `http://localhost:5000/api/trips/${editingTrip._id}`
      : "http://localhost:5000/api/trips";

    const method = editingTrip ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tripData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert(
        editingTrip
          ? "Trip updated successfully!"
          : "Trip created successfully!"
      );

      onTripSaved();

    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>
        {editingTrip ? "Edit Trip" : "Create Trip"}
      </h2>

      <input
        type="text"
        placeholder="Trip title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        min="1"
        max="5"
        placeholder="Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <button type="submit">
        {editingTrip ? "Update Trip" : "Create Trip"}
      </button>

      {editingTrip && (
        <button
          type="button"
          onClick={onCancelEdit}
        >
          Cancel
        </button>
      )}

    </form>
  );
}

export default TripForm;