//Robbie Gibson

var l2 = (function() {

    var blurbs = [];
    var mastery = [];
    var item =[];
    var rune = [];
    var champion = [];
    var summoner_spell = [];
    var match = []


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

        d3.json("/data/match_info.json", function(error, data) {
            match = data;
            
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

    function getKeys(datatype) {
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
    function filterMatchData(champ_id) {
        return match.filter(function(d) {
            return (d.championId == champ_id) && (d.stats.champLevel > 1)
        });
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

        getKeys: getKeys,

        filterMatchData: filterMatchData
    }

})();
