//Robbie Gibson

var l2 = (function() {

    var blurbs = [];
    var mastery = [];
    var item =[];
    var rune = [];
    var champion = [];
    var summoner_spell = [];


    function loadJSON(callback) {
        // if no callback was passed, make function that does nothing
        if (callback === undefined)
            callback = function() {}
        var remaining = 3;

        d3.json("/data/blurbs.json", function(error, data) {   
            blurbs = data;

            if (!--remaining) callback();

        });

        d3.json("/data/static_data.json", function(error, data) {
            mastery = data["mastery"];
            item = data["item"];
            rune = data["rune"];
            champion = data["champion"];
            summoner_spell = data["summoner_spell"]
            
            if (!--remaining) callback();
        });

        d3.json("/data/match_data.json", function(error, data) {
            // array of all usernames we've pulled
            userData = data;

            if (!--remaining) callback();
        })

    }

    // returns champion data for a given id
    function getChampionInfo(id) {
        if (id in champion)
            return champion[id]
        else
            throw new Error ("No champion with id " + id)
    }

    // convenience method for getting name
    function getChampionDisplayName(id)
    {
        return getChampionInfo(id).name;
    }

    // get champion key name
    function getChampionKey(id)
    {
        return getChampionInfo(id).key;
    }

    // get item info by id
    function getItemInfo(id) {
        if (id in item)
            return item[id]
        else
            throw new Error ("No item with id " + id)
    }

    // convenience method for getting item name
    function getItemName(id)
    {
        return getItemInfo(id).dname;
    }

    // get summoner spell info by id
    function getSummonerSpellInfo(id)
    {
        if (id in summoner_spell)
            return summoner_spell[id]
        else
            throw new Error ("No summoner spell with id " + id)
    }

    // get mastery info by id
    function getMasteryInfo(id)
    {
        if (id in mastery)
            return mastery[id]
        else
            throw new Error ("No mastery with id " + id)
    }

    // get rune info by id
    function getRuneInfo(id)
    {
        if (id in rune)
            return rune[id]
        else
            throw new Error ("No rune with id " + id)
    }

    function getKeys (datatype) {
        switch (datatype.toLowerCase()) {
            case "champion":
                return Object.keys(champion);
                break;
            case "item":
                return Object.keys(item);
                break;
            case "summoner_spell":
                return Object.keys(summoner_spell);
                break;
            case "rune":
                return Object.keys(rune);
                break;
            case "mastery":
                return Object.keys(mastery);
                break;
            default:
                throw new Error ("datatype (you entered " + datatype + ") must be \'champion,\" \"item,\" \"summoner_spell,\" \"rune,\" or \"mastery.\"")
        }
    }

    // loads user data using d3.json
    // like d3.json, you need to provide a callback when you call this function.
    // The callback is used in the same way, with paramters error and data.
    // This function was written by Angela Fan !!! :)
    function loadUserData(username, callback) {
        username_lower = username.toLowerCase()

        if (username_lower != "robbie" && username_lower != "benjy" && 
            username_lower != "david" && username_lower != "dendi" && 
            username_lower != "aui_2000" && username_lower != "merlini" &&
            username_lower != "angela") {
            throw new Error ("No data currently for user " + username)
        }

        d3.json("/data/" + username_lower + "_match_details.json", function(error, data) {
            // find the player data for our given player and pull it to the top level
            data.matches.forEach(function(d,i) {
                our_player = d.players.filter(function(e) {
                    return (e.account_id == data.id32)
                })

                //pull out player array
                d.player_info = our_player[0];

                //figure out if player was on radiant or dire
                if (d.player_info.player_slot & 0x80) {
                    d.player_side = "dire";
                }
                else {
                    d.player_side = "radiant";
                }

                //figure out if the player won or lost based on his/her side
                if ((d.player_side == "radiant" && d.radiant_win == true) ||
                    (d.player_side == "dire" && d.radiant_win == false)) {
                    d.player_win = true;
                }
                else {
                    d.player_win = false;
                }

            })

            //player left game before s/he even picked a hero, get rid of these matches
            data.matches = data.matches.filter(function(d) {
                return (d.player_info.hero_id != 0);
            })

            callback(error, data);
        })
    }

    return {
        loadJson: loadJSON,

        getChampionInfo: getChampionInfo,

        getChampionDisplayName: getChampionDisplayName,

        getChampionKey: getChampionKey,

        getChampionInfoCopy: function(id) {
            object = getChampionInfo(id)
            return jQuery.extend(true, {}, object)
        },

        getItemInfo: getItemInfo,

        getItemName: getItemName,

        getSummonerSpellInfo: getSummonerSpellInfo,

        getMasteryInfo: getMasteryInfo,

        getRuneInfo: getRuneInfo,

        getKeys: getKeys
    }

})();
