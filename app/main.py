from fastapi import FastAPI, Depends, HTTPException
from tgtg import TgtgClient
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.tasks import repeat_every
import asyncio
import subprocess
import os

load_dotenv()  # Charge les variables d'environnement à partir du fichier .env
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
REFRESH_TOKEN = os.getenv("REFRESH_TOKEN")
USER_ID = os.getenv("USER_ID")
COOKIE = os.getenv("COOKIE")
MONGODB_URI = os.getenv("MONGODB_URI")
dbenv = os.getenv("DB")
collection = os.getenv("COLLECTIONS")


client = MongoClient(MONGODB_URI)

db = client.get_database(dbenv)
stores_collection = db.get_collection(collection)

# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)
app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://front-api:3000",
    "https://apitgtg.ninapepite.ovh",
    "https://tgtg.ninapepite.ovh"
    # ajoutez ici d'autres origines si nécessaire
]
# Ajout de la configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # autorise les requêtes depuis ce domaine
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def check_items():
    while True:
        try:
            current_day = datetime.now().strftime('%A').lower()
            print(f"Checking items for {current_day}...")

            stores = stores_collection.find({'day': current_day})

            for store in stores:
                await asyncio.sleep(40)
                subprocess.Popen(["/code/app/cron.sh", str(store['id']), store['name']], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except Exception as e:
            print(f"An error occurred: {e}")

        await asyncio.sleep(1800)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(check_items())

 # 15 minutes

def get_client():
    credentials = {
        "access_token": ACCESS_TOKEN,
        "refresh_token": REFRESH_TOKEN,
        "user_id": USER_ID,
        "cookie": COOKIE,
    }

    if any(value is None for value in credentials.values()):
        raise HTTPException(status_code=400, detail="Missing credentials")

    return TgtgClient(
        access_token=credentials["access_token"],
        refresh_token=credentials["refresh_token"],
        user_id=credentials["user_id"],
        cookie=credentials["cookie"],
    )
# Configuration du planificateur


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/items")
def get_items():
    client = get_client()
    items = client.get_items()
    return items

@app.put("/store/")
def add_store(id: str, name: str, day: str):
    store_data = {
        "id": id,
        "name": name,
        "day": day
    }
    stores_collection.insert_one(store_data)
    return {"message": "Store data added successfully"}

@app.get("/stores/")
async def list_stores():
    stores_list = list(stores_collection.find({}))
    for store in stores_list:
        store['_id'] = str(store['_id'])  # Convertir l'objet ObjectId en string
    return {"stores": stores_list}

@app.delete("/store/{id}")
async def delete_store(id: str):
    delete_result = stores_collection.delete_one({"id": id})
    if delete_result.deleted_count:
        return {"message": f"Successfully deleted store with id {id}"}
    else:
        raise HTTPException(status_code=404, detail="Store not found")
@app.get("/item/{id}")
def get_item(id: str):
    client = get_client()
    return client.get_item(id)

@app.get("/order/{id}")
def create_order(id: str):
    client = get_client()
    order = client.create_order(id, 1)
    return order


