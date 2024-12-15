import React, { useEffect, useState } from "react";
import "./RoadTransport.css"; 

function getCoordinates(city) {
  return fetch(`https://nominatim.openstreetmap.org/search?city=${city}&country=Poland&format=json`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      } else {
        throw new Error("City not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching coordinates:", error);
      return null;
    });
}

function RoadTransport() {
  const [cities, setCities] = useState([]);
  const [newCityName, setNewCityName] = useState(""); 
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({ city1: "", city2: "", distance: "" });
  const [activeRoute, setActiveRoute] = useState(null);


  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));

fetch("http://127.0.0.1:5000/api/routes")
    .then((response) => response.json())
    .then((data) => setRoutes(data))
    .catch((error) => console.error("Error fetching routes:", error));
    }, []);


  const addCity = (cityName) => {
    if (!cityName.trim()) {
      alert("Podaj nazwę miasta.");
      setNewCityName(""); 
      return;
    }

    if (cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase())) {
        alert("Miasto już istnieje.");
        setNewCityName("");
        return;
      }

    getCoordinates(cityName).then((coordinates) => {
      if (coordinates) {
        const newCity = { name: cityName, ...coordinates };
        fetch("http://127.0.0.1:5000/api/cities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCity),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Failed to add city");
          })
          .then(() => {
            setCities((prevCities) => [...prevCities, newCity]);
            setNewCityName(""); 
          })
          .catch((error) => console.error("Error adding city:", error));
      } else {
        alert("Nie znaleziono miasta.");
        setNewCityName(""); 
      }
    });
  };

  const addRoute = () => {
    if (!newRoute.city1.trim() || !newRoute.city2.trim() || !newRoute.distance) {
      alert("Wprowadź poprawne dane trasy.");
      return;
    }
  
    if (newRoute.city1.toLowerCase() === newRoute.city2.toLowerCase()) {
      alert("Miasto początkowe i końcowe nie mogą być takie same.");
      return;
    }
  
    const existingRoute = routes.find(
      (route) =>
        (route.city1.toLowerCase() === newRoute.city1.toLowerCase() &&
          route.city2.toLowerCase() === newRoute.city2.toLowerCase()) ||
        (route.city1.toLowerCase() === newRoute.city2.toLowerCase() &&
          route.city2.toLowerCase() === newRoute.city1.toLowerCase())
    );
  
    if (existingRoute) {
        alert("Taka trasa już istnieje.");
        setNewRoute({ city1: "", city2: "", distance: "" });
        return;
    }
  
    fetch("http://127.0.0.1:5000/api/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRoute),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to add or update route");
      })
      .then((response) => {
        if (response.message.includes("updated")) {
          alert("Trasa została zaktualizowana.");
          setRoutes((prevRoutes) =>
            prevRoutes.map((route) =>
              route.city1 === newRoute.city1 && route.city2 === newRoute.city2
                ? { ...route, distance: newRoute.distance }
                : route
            )
          );
        } else {
          alert("Trasa została dodana.");
          setRoutes((prevRoutes) => [...prevRoutes, newRoute]);
        }
  
        setNewRoute({ city1: "", city2: "", distance: "" });
      })
      .catch((error) => console.error("Error adding/updating route:", error));
  };

const deleteRoute = (route) => {
    console.log("Deleting route:", route);
    fetch(`http://127.0.0.1:5000/api/routes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(route),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to delete route");
      })
      .then((data) => {
        console.log("Response data:", data);
        setRoutes((prevRoutes) =>
          prevRoutes.filter(
            (r) => r.city1 !== route.city1 || r.city2 !== route.city2
          )
        );
        setActiveRoute(null); 
      })
      .catch((error) => console.error("Error deleting route:", error));
  };
  

  const handleRouteClick = (route) => {
    setActiveRoute((prevRoute) => (prevRoute === route ? null : route));
  };

  
  return (
    <div className="road-transport-container">
      <div className="cities-container">
        <div className="header-bar">
          <h3>Baza miast</h3>
        </div>
        <div className="cities-list">
          {cities.sort((a, b) => a.name.localeCompare(b.name)).map((city, index) => (
            <div key={index} className="city-card">
              <span className="city-name">{city.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="add-city-container">
        <div className="add-city-box">
          <p className="add-city-header">
            <h3>Nie ma Twojego miasta w naszej bazie? Dodaj je!</h3>
          </p>
          <div className="add-city-form">
            <input
              type="text"
              placeholder="Nazwa miasta"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              className="city-input"
            />
            <button onClick={() => addCity(newCityName)} className="add-city-button">
              <h3>Dodaj miasto</h3>
            </button>
          </div>
        </div>
      </div>
      <div className="routes-container">
        <div className="header-bar">
          <h3>Dostępne trasy</h3>
        </div>
        <div className="routes-list">
          {routes.map((route, index) => (
            <div
              key={index}
              className="route-card"
              onClick={() => handleRouteClick(route)}
            >
              <span>
                {route.city1} - {route.city2}
              </span>
              {activeRoute === route && (
                <div>
                  <h3>{route.distance} km</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      deleteRoute(route);
                    }}
                    className="delete-route-button"
                  >
                    Usuń trasę
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
</div>
      <div className="add-route-container">
  <div className="add-route-box">
    <h3>Dodaj nową trasę</h3>
    <div className="add-route-form">
      <select
        onChange={(e) => setNewRoute({ ...newRoute, city1: e.target.value })}
        value={newRoute.city1}
      >
        <option value="">Wybierz miasto początkowe</option>
        {cities.sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => setNewRoute({ ...newRoute, city2: e.target.value })}
        value={newRoute.city2}
      >
        <option value="">Wybierz miasto końcowe</option>
        {cities.sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Długość trasy (km)"
        value={newRoute.distance}
        onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
      />
      <button onClick={() => addRoute(newRoute)}><h3>Dodaj trasę</h3></button>
    </div>
  </div>
</div>

</div>
    
  );
}

export default RoadTransport;




