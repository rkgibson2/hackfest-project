//Angela Fan, Robbie Gibson

//data global

var champ_data;

//margins and bounding boxes for each graph visualization
var bb_spells, bb_items, bb_xpm, bb_gpm, bb_masteries, bb_runes, bb_first_point, bb_maxed_at;

//set up bounding boxes
bb_win_loss = {
    w: 450,
    h: 100,
    margin: {
    	top: 10,
    	right: 10,
    	bottom: 10,
    	left: 10
    }
};

//set up svgs
svg_win_loss = d3.select("#win_loss_container").append("svg").attr({
	width: bb_win_loss.w + bb_win_loss.margin.left + bb_win_loss.margin.right + 20,
	height: bb_win_loss.h + bb_win_loss.margin.bottom + bb_win_loss.margin.top
})

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
