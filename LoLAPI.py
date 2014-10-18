import json
import requests
import time

class APIProblem(Exception):
    pass

api_key = "19c03581-6d29-43ff-8390-a99ef89132ac"

base_url = "https://na.api.pvp.net"

region = "na"

accounts = [{"real_name": "Jesse", "name": "iRemyxed"}, 
            {"real_name": "Mike", "name": "Shichao"}, 
            {"real_name": "Ray", "name": "Fliedliceman"}, 
            {"real_name": "Richard", "name": "Lightningfax"}]

# keep track of rates
class MyRequest:
    def __init__(self, base_url):
        self.requests = 0
        self.base_url = base_url

    def get(self, url, params):
        if self.requests == 10:
            time.sleep(5)
            self.requests = 0

        r = requests.get(base_url + url, params=params)
        self.requests += 1

        return r

my_request = MyRequest(base_url)

def fetch_summoner_by_name(names):
    """ Returns dict of all users' summoner object"""
    parameters = {"api_key": api_key}

    if isinstance(names, basestring):
        names = [names]
    url = "/api/lol/{region}/v1.4/summoner/by-name/{summonerNames}".format(region=region, summonerNames=",".join(names))

    data = my_request.get(url, parameters).json()

    return data

def fetch_match_history(account_id):
    params = {"api_key": api_key, "rankedQueues": "RANKED_SOLO_5x5", "beginIndex": 0}
    url = "/api/lol/{region}/v2.2/matchhistory/{summonerId}".format(region=region, summonerId=account_id)

    print "Making request at index {0}   ".format(params["beginIndex"]),
    r = my_request.get(url, params)
    data = r.json()["matches"]
    matches = data
    print "{0} games returned".format(len(data))

    # keep looping until we run out of gamesx
    while len(data) >= 15:
        params["beginIndex"] += 15
        print "Making request at index {0}   ".format(params["beginIndex"]),
        r = my_request.get(url, params)
        data = r.json()["matches"]
        matches += data
        print "{0} games returned".format(len(data))

    return matches

if __name__ == "__main__":
    account_data = fetch_summoner_by_name([user["name"] for user in accounts])
    for name, data in account_data.iteritems():
        data["real_name"] = accounts[[user["name"].lower() for user in accounts].index(name)]["real_name"]
    
    for user in account_data.itervalues():
        print "Fetching data for {0}".format(user["name"])
        user["matches"] = fetch_match_history(user["id"])

    with open("match_data.json", "w") as outfile:
        json.dump(account_data, outfile, indent=4)
