import React, { useEffect, useState } from "react";
import "./ShortestRoutes.css"; 

function ShortestRoutes() {
  const [cities, setCities] = useState([]);
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [shortestPath, setShortestPath] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const calculateShortestPath = () => {
    if (!startCity || !endCity) {
      setError("Wybierz oba miasta.");
      setShortestPath(null);
      return;
    }

    if (startCity === endCity) {
      setError("Miasto początkowe i końcowe muszą być różne.");
      setShortestPath(null);
      return;
    }

    fetch("http://127.0.0.1:5000/api/shortest_path", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start_city: startCity, end_city: endCity }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          setError(data.error);
          setShortestPath(null);
        } else {
          setError("");
          setShortestPath(data);
        }
      })
      .catch((error) => {
        setError("Błąd podczas obliczania trasy.");
        console.error("Error calculating shortest path:", error);
      });
  };

  return (
    <div className="shortest-path-container">
      <h3>Oblicz najkrótszą trasę</h3>
      <div className="shortest-path-form">
        <select value={startCity} onChange={(e) => setStartCity(e.target.value)}>
          <option value="">Wybierz miasto początkowe</option>
          {cities.sort((a, b) => a.name.localeCompare(b.name)).map((city, index) => (
            <option key={index} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        <select value={endCity} onChange={(e) => setEndCity(e.target.value)}>
          <option value="">Wybierz miasto końcowe</option>
          {cities.sort((a, b) => a.name.localeCompare(b.name)).map((city, index) => (
            <option key={index} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        <button onClick={calculateShortestPath}>Oblicz</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {shortestPath && (
        <div className="shortest-path-result">
          <h4>Najkrótsza trasa:</h4>
          <p>{shortestPath.path.join(" → ")}</p>
          <p>Długość trasy: {parseInt(shortestPath.totalCost).toFixed(0)} km</p>
        </div>
      )}

      <div className="add-info-container">
        <p>
          Jeśli miasto lub trasa nie występuje w systemie, możesz je dodać w sekcji{" "}
          <a href="/baza-miast">Baza miast</a>.
        </p>
      </div>
    </div>
  );
}

export default ShortestRoutes;
