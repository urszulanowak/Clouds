from flask import Flask, jsonify, request
from flask_cors import CORS 
from database import get_driver

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
driver = get_driver()

def initialize_db():
    try:
        driver = get_driver()
    except Exception as e:
        print(f"Error while initializing the database: {e}")

@app.route("/api/cities", methods=["GET"])
def get_cities():
    with driver.session() as session:
        result = session.run(
            """
            MATCH (c:City)
            RETURN c.name AS name, c.latitude AS lat, c.longitude AS lon
            """
        )
        cities = [{"name": record["name"], "lat": record["lat"], "lon": record["lon"]} for record in result]
    return jsonify(cities)

@app.route("/api/cities", methods=["POST"])
def add_city():
    data = request.get_json()
    city_name = data.get("name")
    latitude = data.get("lat")
    longitude = data.get("lon")
    with driver.session() as session:
        existing_city = session.run(
            """
            MATCH (c:City {name: $name, latitude: $lat, longitude: $lon})
            RETURN c
            """,
            name=city_name, lat=latitude, lon=longitude
        ).single()

        if existing_city:
            return jsonify({"error": "City already exists"}), 400

        session.run(
            """
            CREATE (c:City {name: $name, latitude: $lat, longitude: $lon})
            """,
            name=data["name"],
            lat=data["lat"],
            lon=data["lon"],
        )
    return jsonify({"message": "City added successfully"}), 201

@app.route("/api/routes", methods=["POST"])
def add_route():
    data = request.json
    city1 = data.get("city1")
    city2 = data.get("city2")
    distance = data.get("distance")

    if not city1 or not city2 or distance is None:
        return jsonify({"error": "Invalid route data"}), 400

    try:
        with driver.session() as session:
            result = session.run(
                """
                MATCH (a:City {name: $city1}), (b:City {name: $city2})
                MERGE (a)-[r:CONNECTED_TO]-(b)
                ON CREATE SET r.distance = $distance
                ON MATCH SET r.distance = $distance
                RETURN EXISTS((a)-[r:CONNECTED_TO]->(b)) AS was_created
                """,
                city1=city1, city2=city2, distance=distance
            ).single()

            was_created = result["was_created"]

        if was_created:
            return jsonify({"message": "Route added successfully"}), 201
        else:
            return jsonify({"message": "Route updated successfully"}), 200
    except Exception as e:
        print(f"Error adding/updating route: {e}")
        return jsonify({"error": "Error adding/updating route"}), 500

@app.route("/api/routes", methods=["GET"])
def get_routes():
    with driver.session() as session:
        result = session.run("""
            MATCH (c1:City)-[r:CONNECTED_TO]->(c2:City)
            RETURN c1.name AS city1, c2.name AS city2, r.distance AS distance
        """)
        routes = [
            {"city1": record["city1"], "city2": record["city2"], "distance": record["distance"]}
            for record in result
        ]
    return jsonify(routes)


@app.route("/api/shortest_path", methods=["POST"])
def shortest_path():
    data = request.json
    start_city = data.get("start_city")
    end_city = data.get("end_city")

    with driver.session() as session:
        try:
            result = session.run("""
                MATCH (start:City {name: $startCity}), (end:City {name: $endCity})
                MATCH path = shortestPath((start)-[:CONNECTED_TO*]-(end))
                RETURN [node IN nodes(path) | node.name] AS path,
                    reduce(total = 0, r IN relationships(path) | total + toInteger(r.distance)) AS totalCost
            """, startCity=start_city, endCity=end_city)

            record = result.single()
            if record:
                path = record["path"]
                total_cost = record["totalCost"]
                
                if total_cost is None:
                    total_cost = 0 
                print(f"Path: {path}")
                print(f"Total cost: {total_cost}")
                return {
                    "path": path,
                    "totalCost": total_cost
                }, 200
            else:
                return {
                    "error": "Nie znaleziono ścieżki między podanymi miastami."
                }, 404

        except Exception as e:
            print(f"Error calculating path: {e}")
            return {
                "error": f"Błąd podczas obliczania trasy: {e}"
            }, 500
        
@app.route("/api/routes", methods=["DELETE"])
def delete_route():
    data = request.json
    city1 = data.get("city1")
    city2 = data.get("city2")

    if not city1 or not city2:
        return jsonify({"error": "Invalid route data"}), 400

    try:
        with driver.session() as session:
            result = session.run("""
                MATCH (a:City {name: $city1})-[r:CONNECTED_TO]->(b:City {name: $city2})
                DELETE r
            """, city1=city1, city2=city2)

        return jsonify({"message": "Route deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting route: {e}")
        return jsonify({"error": "Error deleting route"}), 500




if __name__ == "__main__":
    initialize_db() 
    app.run(debug=True)
