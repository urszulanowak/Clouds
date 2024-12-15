from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

def get_driver():
    """Tworzy połączenie z bazą Neo4j i zwraca sterownik."""
    if not NEO4J_URI or not NEO4J_USER or not NEO4J_PASSWORD:
        raise ValueError("Brak konfiguracji połączenia z Neo4j w zmiennych środowiskowych.")

    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    return driver
