from LoLAPI import *

url = "/api/lol/static-data/{region}/v1.2/{data}"

# load champion data
params = {"api_key": api_key, "dataById": True, "champData": "all"}
r = my_request.get(url.format(region=region, data="champion"), params)
data = r.json()["keys"]

with open("champion_keys.json", "w") as outfile:
    json.dump(data, outfile, indent=4)
