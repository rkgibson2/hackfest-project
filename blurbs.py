import requests
import json
import urllib

#gets champion blurbs
#url = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=blurb&api_key=6aa42afb-3421-4a81-ba5d-6ba661b323ee"

url = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/summoner-spell?spellData=sanitizedDescription&api_key=6aa42afb-3421-4a81-ba5d-6ba661b323ee"


data = requests.get(url).json()['data']

with open("summoner_spell_blurbs.json", "w") as outfile:
	json.dump(data, outfile, indent=4)
