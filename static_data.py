import json
from LoLAPI import *

url = "/api/lol/static-data/{region}/v1.2/{data}"

data = {}

# load champion data
params = {"api_key": api_key, "dataById": True, "champData": "all"}
r = my_request.get(url.format(region=region, data="champion"), params)
data["champion"] = r.json()["data"]

# load item data
params = {"api_key": api_key, "itemListData": "all"}
r = my_request.get(url.format(region=region, data="item"), params)
data["item"] = r.json()["data"]

# load mastery data
params = {"api_key": api_key, "masteryListData": "all"}
r = my_request.get(url.format(region=region, data="mastery"), params)
data["mastery"] = r.json()["data"]

# load rune data
params = {"api_key": api_key, "runeListData": "all"}
r = my_request.get(url.format(region=region, data="rune"), params)
data["rune"] = r.json()["data"]

# load summoner spell data
params = {"api_key": api_key, "dataById": True, "spellData": "all"}
r = my_request.get(url.format(region=region, data="summoner-spell"), params)
data["summoner_spell"] = r.json()["data"]

with open("data/static_data.json", "w") as outfile:
    json.dump(data, outfile)
