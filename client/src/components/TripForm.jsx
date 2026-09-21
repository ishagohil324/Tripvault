// import { useState } from "react";

// function TripForm({ onTripSaved, editingTrip, onCancelEdit }) {
//   const [title, setTitle] = useState(
//     editingTrip?.title || ""
//   );

//   const [destination, setDestination] = useState(
//     editingTrip?.destination || ""
//   );

//   const [startDate, setStartDate] = useState(
//     editingTrip?.startDate
//       ? editingTrip.startDate.substring(0, 10)
//       : ""
//   );

//   const [endDate, setEndDate] = useState(
//     editingTrip?.endDate
//       ? editingTrip.endDate.substring(0, 10)
//       : ""
//   );

//   const [description, setDescription] = useState(
//     editingTrip?.description || ""
//   );

//   const [rating, setRating] = useState(
//     editingTrip?.rating || ""
//   );

//   constconst [selectedImage, setSelectedImage] = useState(null);
// const [preview, setPreview] = useState(
//   editingTrip?.coverImage || ""
// );

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");

//     const tripData = {
//       title,
//       destination,
//       startDate,
//       endDate,
//       description,
//       rating: rating ? Number(rating) : undefined,
//     };

//     const url = editingTrip
//       ? `http://localhost:5000/api/trips/${editingTrip._id}`
//       : "http://localhost:5000/api/trips";

//     const method = editingTrip ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(tripData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         alert(data.message || "Something went wrong");
//         return;
//       }

//       alert(
//         editingTrip
//           ? "Trip updated successfully!"
//           : "Trip created successfully!"
//       );

//       onTripSaved();

//     } catch (error) {
//       console.error(error);
//       alert("Unable to connect to server");
//     }
//   };

//   const handleImageChange = (e) => {
//   const file = e.target.files[0];

//   if (!file) {
//     return;
//   }

//   setSelectedImage(file);

//   const imagePreview = URL.createObjectURL(file);

//   setPreview(imagePreview);
// };


//   return (
//     <form onSubmit={handleSubmit}>

//       <h2>
//         {editingTrip ? "Edit Trip" : "Create Trip"}
//       </h2>

//       <input
//         type="text"
//         placeholder="Trip title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         required
//       />

//       <input
//         type="text"
//         placeholder="Destination"
//         value={destination}
//         onChange={(e) => setDestination(e.target.value)}
//         required
//       />

//       <input
//         type="date"
//         value={startDate}
//         onChange={(e) => setStartDate(e.target.value)}
//       />

//       <input
//         type="date"
//         value={endDate}
//         onChange={(e) => setEndDate(e.target.value)}
//       />

//       <textarea
//         placeholder="Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />

//       <input
//         type="number"
//         min="1"
//         max="5"
//         placeholder="Rating (1-5)"
//         value={rating}
//         onChange={(e) => setRating(e.target.value)}
//       />

//       <button type="submit">
//         {editingTrip ? "Update Trip" : "Create Trip"}
//       </button>

//       {editingTrip && (
//         <button
//           type="button"
//           onClick={onCancelEdit}
//         >
//           Cancel
//         </button>
//       )}
//     </form>
//   );
  
// }

// export default TripForm;

import { useState } from "react";

function TripForm({
  onTripSaved,
  editingTrip,
  onCancelEdit,
}) {
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

  // ========================================
  // PHOTO UPLOAD STATE
  // ========================================

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [preview, setPreview] = useState(
    editingTrip?.coverImage || ""
  );

  // ========================================
  // IMAGE SELECTION
  // ========================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Check 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    setSelectedImage(file);

    const imagePreview =
      URL.createObjectURL(file);

    setPreview(imagePreview);
  };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const tripData = {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating: rating
        ? Number(rating)
        : undefined,
    };

    const url = editingTrip
      ? `http://localhost:5000/api/trips/${editingTrip._id}`
      : "http://localhost:5000/api/trips";

    const method = editingTrip
      ? "PUT"
      : "POST";

    try {
      // ====================================
      // CREATE / UPDATE TRIP
      // ====================================

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
        throw new Error(
          data.message ||
            "Something went wrong"
        );
      }

      // ====================================
      // GET TRIP ID
      // ====================================

      const tripId = editingTrip
        ? editingTrip._id
        : data.trip?._id || data._id;

      if (!tripId) {
        throw new Error(
          "Trip was created but no Trip ID was returned."
        );
      }

      // ====================================
      // UPLOAD PHOTO
      // ====================================

      if (selectedImage) {
        const formData = new FormData();

        formData.append(
          "image",
          selectedImage
        );

        const uploadResponse = await fetch(
          `http://localhost:5000/api/trips/${tripId}/upload`,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },

            body: formData,
          }
        );

        // Read response as text first
        const uploadText =
          await uploadResponse.text();

        let uploadData;

        try {
          uploadData =
            JSON.parse(uploadText);
        } catch (error) {
          console.error(
            "Upload API returned non-JSON:",
            uploadText
          );

          throw new Error(
            "Photo upload failed. The server did not return JSON."
          );
        }

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.message ||
              "Photo upload failed"
          );
        }
      }

      // ====================================
      // SUCCESS
      // ====================================

      alert(
        editingTrip
          ? "Trip updated successfully!"
          : "Trip created successfully!"
      );

      onTripSaved();
    } catch (error) {
      console.error(
        "Trip form error:",
        error
      );

      alert(error.message);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="trip-form"
    >
      <h2>
        {editingTrip
          ? "Edit Trip"
          : "Create Trip"}
      </h2>

      {/* TITLE */}

      <input
        type="text"
        placeholder="Trip title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        required
      />

      {/* DESTINATION */}

      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) =>
          setDestination(e.target.value)
        }
        required
      />

      {/* START DATE */}

      <input
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(e.target.value)
        }
      />

      {/* END DATE */}

      <input
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(e.target.value)
        }
      />

      {/* DESCRIPTION */}

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      {/* RATING */}

      <input
        type="number"
        min="1"
        max="5"
        placeholder="Rating (1-5)"
        value={rating}
        onChange={(e) =>
          setRating(e.target.value)
        }
      />

      {/* PHOTO UPLOAD */}

      <label>
        Trip Photo
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* IMAGE PREVIEW */}

      {preview && (
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <p>Photo Preview</p>

          <img
            src={preview}
            alt="Trip preview"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "220px",
              objectFit: "cover",
              borderRadius: "14px",
            }}
          />
        </div>
      )}

      {/* BUTTONS */}

      <button type="submit">
        {editingTrip
          ? "Update Trip"
          : "Create Trip"}
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