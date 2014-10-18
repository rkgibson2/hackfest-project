import json
from LoLAPI import *

data_types = ["champion", "item", "mastery", "rune", "summoner-spell"]

url = "/api/lol/static-data/{region}/v1.2/{data}"

data = {}

for dtype in data_types:
    params = {"api_key": api_key}

    r = my_request.get(url.format(region=region, data=dtype), params)

    data[dtype.replace("-", "_")] = r.json()["data"]

with open("data/static_data.json", "w") as outfile:
    json.dump(data, outfile)
