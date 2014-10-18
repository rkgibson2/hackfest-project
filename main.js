//Angela Fan, Robbie Gibson

//data global

var champ_data;

var graph_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0,0]);

//margins and bounding boxes for each graph visualization
var bb_spells, bb_items, bb_xpm, bb_gpm, bb_masteries, bb_runes, bb_first_point, bb_maxed_at, bb_winrate;

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

bb_winrate = {
	w: 360,
	h: 80,
	margin: {
		top: 5,
		right: 10,
		bottom: 5,
		left: 10
	}
};

//set up svgs
svg_summoner_spells = d3.select("#summoner_spells_container").append("svg").attr({
	width: bb_summoner_spells.w + bb_summoner_spells.margin.left + bb_summoner_spells.margin.right + 20,
	height: bb_summoner_spells.h + bb_summoner_spells.margin.bottom + bb_summoner_spells.margin.top
});

svg_summoner_spells.call(graph_tip);


svg_winrate = d3.select("#winrate_container").append("svg").attr({
	width: bb_winrate.w + bb_winrate.margin.left + bb_winrate.margin.right,
	height: bb_winrate.h + bb_winrate.margin.bottom + bb_winrate.margin.top
});

svg_winrate.append("rect")
	.attr("height", 40)
	.attr("width", bb_winrate.w-20)
	.attr("stroke", "black")
	.attr("stroke-width", 2)
	.attr("fill", "white")
	.attr("x", 40)
	.attr("y", 40);

svg_winrate.append("text")
	.attr("x", bb_winrate.w/2 - 0)
	.attr("y", 25)
	.attr("font-family", "Dosis")
	.attr("font-size", "20px")
	.text("Winrate")
	.attr("stroke", "black");

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

d3.json("/blurbs/summoner_spell_blurbs.json", function(summoner_spell_blurbs) {

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
			.attr("class", "sum_spell_img")
			.attr("id", summoner_spells[i])
			.attr("xlink:href", "/img/summoner_spells/" + summoner_spells[i] + ".png")
			.attr("opacity", .4)

		svg_summoner_spells.append("rect")
			.attr("x", 10 + i%row_width * (image_size + 5))
			.attr("y", 50 + Math.floor(i/row_width)* (image_size + 5))
			.attr("height", image_size)
			.attr("width", image_size)
			.attr("stroke", "black")
			.attr("stroke-width", 1)
			.attr("fill", "none");
	}

	d3.selectAll(".sum_spell_img")
		.on("mouseover", function(d, i) {


			var current_spell = d3.select(this).attr("id");

			//console.log(summoner_spell_blurbs)

			if (current_spell == "Ignite") {
				current_spell = "Dot";
			}
			else if (current_spell == "Ghost") {
				current_spell = "Haste";
			}
			else if (current_spell == "Clarity") {
				current_spell = "Mana";
			}
			else if (current_spell == "Cleanse") {
				current_spell = "Boost";
			}
			else {
				current_spell = current_spell;
			}

			var spell_name = summoner_spell_blurbs[String("Summoner")+current_spell].name;
			var description = summoner_spell_blurbs[String("Summoner")+current_spell].sanitizedDescription;

			var html_string = "<b>" + spell_name + "</b><br>" + description;
			graph_tip.html(html_string);
			graph_tip.show(d,i);

		})
		.on("mouseout", function(d, i) {
			graph_tip.hide(d,i);
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
			.text(data[current_hero].title);

		d3.select("#champ_blurb")
			.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.attr("class", "champ_blurb")
			.text(data[current_hero].blurb.split("<br>")[0]);

	})

})

