import psycopg2

def connect_postgres():
    return psycopg2.connect(
        dbname="educative",
        user="admin",
        password="admin",
        host="db_postgres"
    )
