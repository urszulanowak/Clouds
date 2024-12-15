from database import get_driver

def initialize_database():
    driver = get_driver()
    cities = [
        {"name": "Warszawa", "lat": 52.2297, "lon": 21.0122},
        {"name": "Kraków", "lat": 50.0647, "lon": 19.9450},
        {"name": "Gdańsk", "lat": 54.3521, "lon": 18.6464},
    ]

    with driver.session() as session:

        session.run("MATCH (c:City) DETACH DELETE c")
        
        for city in cities:
            session.run(
                """
                MERGE (c:City {name: $name})
                ON CREATE SET c.latitude = $lat, c.longitude = $lon
                """,
                name=city["name"],
                lat=city["lat"],
                lon=city["lon"],
            )
        print("Database initialized with cities.")

if __name__ == "__main__":
    initialize_database()
