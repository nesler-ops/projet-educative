from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db_mongo = client["educatif"]
contenus_collection = db_mongo["contenus"]
