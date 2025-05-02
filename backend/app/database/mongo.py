from pymongo import MongoClient

def connect_mongo():
    client = MongoClient("mongodb://db_mongo:27017/")
    return client.educative
