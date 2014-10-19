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
            time.sleep(10)
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

    print "Making request at game index {0}   ".format(params["beginIndex"]),
    r = my_request.get(url, params)
    data = r.json()["matches"]
    data.reverse()
    matches = data
    print "{0} games returned".format(len(data))

    # keep looping until we run out of gamesx
    while len(data) >= 15:
        params["beginIndex"] += 15
        print "Making request at game index {0}   ".format(params["beginIndex"]),
        r = my_request.get(url, params)
        data = r.json()["matches"]
        data.reverse()
        matches += data
        print "{0} games returned".format(len(data))

    return matches

def fetch_matchlist(account_id):
    params = {"api_key": api_key, "rankedQueues": "RANKED_SOLO_5x5", "beginIndex": 0}
    url = "/api/lol/{region}/v2.2/matchhistory/{summonerId}".format(region=region, summonerId=account_id)
    match_list = []

    print "Making request at game index {0}   ".format(params["beginIndex"]),
    r = my_request.get(url, params)
    data = r.json()["matches"]
    data.reverse()
    for i in range(0, len(data)): 
        match = data[i]
        match_list.append(match["matchId"])
    print "{0} games returned".format(len(data))

    # keep looping until we run out of gamesx
    while len(data) >= 15:
        params["beginIndex"] += 15
        print "Making request at game index {0}   ".format(params["beginIndex"]),
        r = my_request.get(url, params)
        data = r.json()["matches"]
        data.reverse()
        for i in range(0, len(data)): 
            match = data[i]
            match_list.append(match["matchId"])
        print "{0} games returned".format(len(data))

    match_list = list(set(match_list))
    return match_list

def fetch_match_info(match_id):
    params = {"api_key": api_key, "includeTimeline": True}
    url = "/api/lol/{region}/v2.2/match/{matchId}".format(region=region, matchId=match_id)
    match_info = {}
    events = []

    r = my_request.get(url, params)
    data = r.json()["timeline"]
    frames = data["frames"]

    match_duration = r.json()["matchDuration"]
    participants = r.json()["participants"]

    for participant in participants: 
        participant["matchDuration"] = match_duration

    #match_info["participants"]
    print participants

    '''
    for frame in frames:
        if "events" in frame:
            events += frame["events"]

    match_info["timeline"] = events

    #match_info["matchDuration"] = r.json()["matchDuration"]
    #match_info["participantIdentities"] = r.json()["participantIdentities"]
    
    # keep looping until we run out of gamesx
    while len(data) >= 15:
        params["beginIndex"] += 15
        print "Making request at game index {0}   ".format(params["beginIndex"])
        r = my_request.get(url, params)
        data = r.json()["matches"]
        data.reverse()
        for i in range(0, len(data)): 
            match = data[i]
            match_list.append(match["matchId"])
        print "{0} games returned".format(len(data))
    '''
    return participants

def fetch_rune_info(match_id):
    params = {"api_key": api_key, "includeTimeline": True}
    url = "/api/lol/{region}/v2.2/match/{matchId}".format(region=region, matchId=match_id)
    rune_info = {}

    r = my_request.get(url, params)
    #data = r.json()["timeline"]
    #frames = data["frames"]

    participants = r.json()["participants"]

    for participant in participants: 
        print participant
        if "runes" in participant:
            flatlist = []
            runelist = participant["runes"]
            for object in runelist:
                for i in range(0, object["rank"]):
                    flatlist.append(object["runeId"])

            rune_info[participant["championId"]] = flatlist

    return rune_info

def most_common(lst):
    return max(set(lst), key=lst.count)

if __name__ == "__main__":
    account_data = fetch_summoner_by_name([user["name"] for user in accounts])
    match_list = []
    match_info = []
    raw_rune_info = {}
    rune_info = {}

    with open("data/match_list.json") as infile:
        match_list = json.load(infile)

    for i in range(0, len(match_list)):
        match_runes = fetch_rune_info(match_list[i])
        for champion in match_runes:
            if champion in raw_rune_info:
                raw_rune_info[champion].append(match_runes[champion]) 
            else:
                raw_rune_info[champion] = match_runes[champion]  

    for champion in raw_rune_info:
        champ_runes = raw_rune_info[champion]
        flat_champ_runes = []
        runeString = ""
        for i in range(0, len(champ_runes)):
            for j in range(0, champ_runes[i]): 
                runeSet = champ_runes[i]
                runeString += str(runeSet[j])   
            flat_champ_runes.append(runeString)

        runeSet = most_common(flat_champ_runes)
        rune_info[champion] = runeSet

    with open("rune_info.json", "w") as outfile:
        json.dump(rune_info, outfile, indent=4) 

'''
    for user in account_data.itervalues():
        match_list += fetch_matchlist(user["id"])

    with open("match_list.json", "w") as outfile: 
        json.dump(match_list, outfile, indent=4)
'''
'''
    for i in range(0, len(match_list)):
        id = match_list[i]
        match_info += fetch_match_info(id)

    with open("match_info.json", "w") as outfile:
        json.dump(match_info, outfile, indent=4)
'''

'''
    for name, data in account_data.iteritems():
        data["real_name"] = accounts[[user["name"].lower() for user in accounts].index(name)]["real_name"]
    
    for user in account_data.itervalues():
        print "Fetching data for {0}".format(user["name"])
        matches = fetch_match_history(user["id"])
        user["matches"] = matches

    with open("match_data_by_player.json", "w") as outfile:
        json.dump(account_data, outfile, indent=4)
'''

    



