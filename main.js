//Angela Fan, Robbie Gibson

//data global

var champ_data;

//margins and bounding boxes for each graph visualization
var bb_spells, bb_items, bb_xpm, bb_gpm, bb_masteries, bb_runes, bb_first_point, bb_maxed_at;

//set up bounding boxes
bb_summoner_spells = {
    w: 500,
    h: 190,
    margin: {
    	top: 20,
    	right: 10,
    	bottom: 10,
    	left: 20
    }
};

//set up svgs
svg_summoner_spells = d3.select("#summoner_spells_container").append("svg").attr({
	width: bb_summoner_spells.w + bb_summoner_spells.margin.left + bb_summoner_spells.margin.right + 20,
	height: bb_summoner_spells.h + bb_summoner_spells.margin.bottom + bb_summoner_spells.margin.top
});

svg_summoner_spells.append("rect")
	.attr("height", bb_summoner_spells.h - 40)
	.attr("width", bb_summoner_spells.w)
	.attr("y", 40)
	.attr("fill", "white");

svg_summoner_spells.append("text")
	.attr("x", bb_summoner_spells.w/2 - 110)
	.attr("y", 30)
	.attr("font-family", "Dosis")
	.attr("font-size", "20px")
	.text("Summoner Spells")
	.attr("stroke", "black");

var summoner_spells = ["Barrier", "Clairvoyance", "Clarity", "Cleanse", "Exhaust", "Flash", "Ghost", "Heal", "Ignite", "Revive", "Smite", "Teleport"];
var summoner_spells_length = summoner_spells.length;
var row_width = 6;
var image_size = 64;

for (var i = 0; i < summoner_spells_length; i++) {
	svg_summoner_spells.append("image")
		.attr("x", 10 + i%row_width * (image_size + 5))
		.attr("y", 50 + Math.floor(i/row_width)* (image_size + 5))
		.attr("height", image_size)
		.attr("width", image_size)
		.attr("xlink:href", "/img/summoner_spells/" + summoner_spells[i] + ".png")
		.attr("opacity", .4);

	svg_summoner_spells.append("rect")
		.attr("x", 10 + i%row_width * (image_size + 5))
		.attr("y", 50 + Math.floor(i/row_width)* (image_size + 5))
		.attr("height", image_size)
		.attr("width", image_size)
		.attr("stroke", "black")
		.attr("stroke-width", 1)
		.attr("fill", "none");
}

//corner hero image
var elem = document.createElement("img")
document.getElementById("champ_image").appendChild(elem);
elem.src = "/img/champs/katarina.png";
// elem.setAttribute("height", "768");
// elem.setAttribute("width", "1024");

d3.json("/blurbs/champ_blurbs.json", function(data) {

	//set header and champion description
	var current_hero = "Katarina";

	d3.select("#champ_name")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("class", "champ_name")
		.text(current_hero.toUpperCase())
		.style("fill", "black");

	d3.select("#champ_title")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("class", "champ_title")
		.text(data[current_hero].title)

	d3.select("#champ_blurb")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("class", "champ_blurb")
		.text(data[current_hero].blurb.split("<br>")[0])

})
