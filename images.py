import requests
import json
import urllib

#gets masteries
# url = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/mastery?masteryListData=image&api_key=6aa42afb-3421-4a81-ba5d-6ba661b323ee"
# fetch_url = "http://ddragon.leagueoflegends.com/cdn/4.17.1/img/mastery/"


#gets runes
# url = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/rune?runeListData=image&api_key=6aa42afb-3421-4a81-ba5d-6ba661b323ee"
# fetch_url = "http://ddragon.leagueoflegends.com/cdn/4.17.1/img/rune/"


#gets items
# url = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=image&api_key=6aa42afb-3421-4a81-ba5d-6ba661b323ee"
# fetch_url = "http://ddragon.leagueoflegends.com/cdn/4.17.1/img/item/"


#gets champs
# url = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=image&api_key=6aa42afb-3421-4a81-ba5d-6ba661b323ee"
# fetch_url = "http://ddragon.leagueoflegends.com/cdn/4.17.1/img/champion/"


#gets champ spell images
url = "https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=passive&api_key=6aa42afb-3421-4a81-ba5d-6ba661b323ee"

#fetch_url = "http://ddragon.leagueoflegends.com/cdn/4.18.1/img/spell/"
passives_url = "http://ddragon.leagueoflegends.com/cdn/4.18.1/img/passive/"
#http://ddragon.leagueoflegends.com/cdn/4.17.1/img/spell/ThreshQ.png

#http://ddragon.leagueoflegends.com/cdn/4.17.1/img/passive/Thresh_Passive.png


data = requests.get(url).json()['data']
open_url = urllib.URLopener()

for _,img_obj in data.iteritems():

	print img_obj['passive']['image']['full']

	current_image_link = passives_url + str(img_obj['passive']['image']['full']) 
	print current_image_link
	open_url.retrieve(current_image_link, "img/spells/" + img_obj["name"] + ".png")




