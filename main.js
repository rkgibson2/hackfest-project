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
    w: 400,
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

bb_items = {
	w: 750,
	h: 350,
	margin: {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10
	}
};

bb_xpm = {
	w: 350,
	h: 300,
	margin: {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10
	}
};

bb_gpm = {
	w: 350,
	h: 300,
	margin: {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10
	}
};

svg_xpm = d3.select("#xpm_container").append("svg").attr({
	width: bb_xpm.w + bb_xpm.margin.left + bb_xpm.margin.right,
	height: bb_xpm.h + bb_xpm.margin.bottom + bb_xpm.margin.top
});

svg_xpm.call(graph_tip);

svg_gpm = d3.select("#gpm_container").append("svg").attr({
	width: bb_gpm.w + bb_gpm.margin.left + bb_gpm.margin.right,
	height: bb_gpm.h + bb_gpm.margin.bottom + bb_gpm.margin.top
});

svg_gpm.call(graph_tip);

svg_summoner_spells = d3.select("#summoner_spells_container").append("svg").attr({
	width: bb_summoner_spells.w + bb_summoner_spells.margin.left + bb_summoner_spells.margin.right + 20,
	height: bb_summoner_spells.h + bb_summoner_spells.margin.bottom + bb_summoner_spells.margin.top
});

svg_summoner_spells.call(graph_tip);


svg_winrate = d3.select("#winrate_container").append("svg").attr({
	width: bb_winrate.w + bb_winrate.margin.left + bb_winrate.margin.right,
	height: bb_winrate.h + bb_winrate.margin.bottom + bb_winrate.margin.top
});


svg_items = d3.select("#items_container").append("svg").attr({
	width: bb_items.w + bb_items.margin.left + bb_items.margin.right,
	height: bb_items.h + bb_items.margin.bottom + bb_items.margin.top
});

svg_items.call(graph_tip);


//add nice rects and label text
// svg_xpm.append("rect")
// 	.attr("height", bb_xpm.h)
// 	.attr("width", bb_xpm.w)
// 	.attr("fill", "black")
// 	.attr("x", 0)
// 	.attr("y", 0);

// svg_gpm.append("rect")
// 	.attr("height", bb_gpm.h)
// 	.attr("width", bb_gpm.w)
// 	.attr("fill", "black")
// 	.attr("x", 0)
// 	.attr("y", 0);

// svg_items.append("rect")
// 	.attr("height", bb_items.h)
// 	.attr("width", bb_items.w)
// 	.attr("fill", "black")
// 	.attr("x", 0)
// 	.attr("y", 0);

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
	.attr("x", bb_summoner_spells.w/2 - 50)
	.attr("y", 30)
	.attr("font-family", "Dosis")
	.attr("font-size", "20px")
	.text("Summoner Spells")
	.attr("stroke", "black");

// Ahri
load(103);

function update(current_hero) {
    //corner hero image
    d3.select("#champ_image img")
	.attr("src", "/img/champs/"+ l2.getChampionInfo(current_hero).image.full);
    
    d3.select("#champ_name text")
	.text(l2.getChampionDisplayName(current_hero).toUpperCase())
	.on("click", OpenInNewTab);
    
    function OpenInNewTab() {
	  	var win = window.open("http://gameinfo.na.leagueoflegends.com/en/game-info/champions/"+ l2.getChampionDisplayName(current_hero).toLowerCase(), '_blank');
	  	win.focus();
	}

    d3.select("#champ_title text")
	.text(l2.getChampionInfo(current_hero).title);
        
    d3.select("#champ_blurb text")
	.text(l2.getChampionInfo(current_hero).blurb.split("<br>")[0].split(".")[0]+".");

	if (current_hero == "36") {
		d3.select("#champ_blurb text")
			.text("It is said that the man now known as Dr. Mundo was born without any sort of conscience. Instead, he had an unquenchable desire to inflict pain through experimentation.")
	}
}

function load(current_hero) {
    
    l2.loadJson(function() {
        
	var summoner_spells = ['11', '10', '13', '12', '21', '1', '3', '2', '4', '7', '6', '14'];
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
		.attr("id", "summonerspells_" + summoner_spells[i])
		.attr("xlink:href", "/img/summoner_spells/" + l2.getSummonerSpellInfo(summoner_spells[i]).image.full)
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
                
		var current_spell = d3.select(this).attr("id").split("_")[1];
                
		//console.log(summoner_spell_blurbs)
                
		// if (current_spell == "Ignite") {
		// 	current_spell = "Dot";
		// }
		// else if (current_spell == "Ghost") {
		// 	current_spell = "Haste";
		// }
		// else if (current_spell == "Clarity") {
		// 	current_spell = "Mana";
		// }
		// else if (current_spell == "Cleanse") {
		// 	current_spell = "Boost";
		// }
		// else {
		// 	current_spell = current_spell;
		// }
                
		var spell_name = l2.getSummonerSpellInfo(current_spell).name
		var description = l2.getSummonerSpellInfo(current_spell).sanitizedDescription;
                
		var html_string = "<b>" + spell_name + "</b><br>" + description;
                
		graph_tip.direction('e')
                
		graph_tip.html(html_string);
		graph_tip.show(d,i);
                
	    })
	    .on("mouseout", function(d, i) {
		graph_tip.hide(d,i);
	    })
        
        
	var champ_ids = l2.getKeys("champion");
	champ_ids = champ_ids.sort(function(a, b) {
            return d3.ascending(l2.getChampionDisplayName(a).toLowerCase(), 
                                l2.getChampionDisplayName(b).toLowerCase());
        })

        d3.select("#champ_select").selectAll("li a").data(champ_ids)
            .enter().append("li").append("a")
            .attr("href", "#")
            .attr("champ_id", function(d) { return d })
            .text(function(d) { return l2.getChampionDisplayName(d) })

        // bind click handlers

        $(".dropdown-menu li a").click(function(){
            
            var current_hero = d3.select(this).attr("champ_id");
            
            update(current_hero);
            
        });
       
    //add logo
    d3.select("#logo").append("img")
    	.attr("src", "logo.png")
    	.attr("width", 200)
    	.attr("class", "logo_image")
    	.style("border", "5px solid black");

	//corner hero image
	var elem = document.createElement("img");
	document.getElementById("champ_image").appendChild(elem);
	elem.src = "/img/champs/"+ l2.getChampionInfo(current_hero).image.full;
        
	d3.select("#champ_name")
	    .append("text")
	    .attr("x", 0)
	    .attr("y", 0)
	    .attr("class", "champ_name")
	    .text(l2.getChampionDisplayName(current_hero).toUpperCase())
	    .style("fill", "black")
	    .on("click", OpenInNewTab);

	function OpenInNewTab() {
	  	var win = window.open("http://gameinfo.na.leagueoflegends.com/en/game-info/champions/"+ l2.getChampionDisplayName(current_hero).toLowerCase(), '_blank');
	  	win.focus();
	}

	d3.select("#champ_title")
	    .append("text")
	    .attr("x", 0)
	    .attr("y", 0)
	    .attr("class", "champ_title")
	    .text(l2.getChampionInfo(current_hero).title);
        
	d3.select("#champ_blurb")
	    .append("text")
	    .attr("class", "champ_blurb")
	    .attr("x", 0)
	    .attr("y", 0)
	    .text(l2.getChampionInfo(current_hero).blurb.split("<br>")[0].split(".")[0]+".");
        
        
	//xpm histogram
	var values_xpm = d3.range(1000).map(d3.random.bates(10));
        
	var margin_xpm = bb_xpm.margins,
	width_xpm = bb_xpm.w - 50,
	height_xpm = bb_xpm.h - 60;
        
	var x_xpm = d3.scale.linear()
	    .domain([0, 1])
	    .range([0, width_xpm]);
        
	var data_xpm = d3.layout.histogram()
	    .bins(x_xpm.ticks(20))
	(values_xpm);
        
	var y_xpm = d3.scale.linear()
	    .domain([0, d3.max(data_xpm, function(d) { return d.y; })])
	    .range([height_xpm, 0]);
        
	var xAxis_xpm = d3.svg.axis()
	    .scale(x_xpm)
	    .orient("bottom");
        
	var bar_xpm = svg_xpm.selectAll(".bar")
	    .data(data_xpm)
	    .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x_xpm(d.x) + "," + (40+y_xpm(d.y)) + ")"; });
        
	bar_xpm.append("rect")
	    .attr("x", 1)
	    .attr("width", x_xpm(data_xpm[0].dx) - 1)
	    .attr("height", function(d) { return height_xpm - y_xpm(d.y); });
        
	bar_xpm.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", x_xpm(data_xpm[0].dx) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.y; });
        
	svg_xpm.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (height_xpm+40) + ")")
	    .call(xAxis_xpm);

	svg_xpm.append("text")
		.attr("x", 100)
		.attr("y", 20)
		.attr("font-family", "Dosis")
		.attr("font-size", "22px")
		.text("Average XPM");


	//gpm histogram
	var values_gpm = d3.range(1000).map(d3.random.bates(10));
        
	var margin_gpm = bb_gpm.margins,
	width_gpm = bb_gpm.w - 50,
	height_gpm = bb_gpm.h - 60;
        
	var x_gpm = d3.scale.linear()
	    .domain([0, 1])
	    .range([0, width_gpm]);
        
	var data_gpm = d3.layout.histogram()
	    .bins(x_gpm.ticks(20))
	(values_gpm);
        
	var y_gpm = d3.scale.linear()
	    .domain([0, d3.max(data_gpm, function(d) { return d.y; })])
	    .range([height_gpm, 0]);
        
	var xAxis_gpm = d3.svg.axis()
	    .scale(x_gpm)
	    .orient("bottom");
        
	var bar_gpm = svg_gpm.selectAll(".bar")
	    .data(data_gpm)
	    .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x_gpm(d.x) + "," + (40+y_gpm(d.y)) + ")"; });
        
	bar_gpm.append("rect")
	    .attr("x", 1)
	    .attr("width", x_gpm(data_gpm[0].dx) - 1)
	    .attr("height", function(d) { return height_gpm - y_gpm(d.y); });
        
	bar_gpm.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", x_gpm(data_gpm[0].dx) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.y; });
        
	svg_gpm.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (height_gpm+40) + ")")
	    .call(xAxis_gpm);

	svg_gpm.append("text")
		.attr("x", 100)
		.attr("y", 20)
		.attr("font-family", "Dosis")
		.attr("font-size", "22px")
		.text("Average GPM");


	//items histogram
	var values = d3.range(1000).map(d3.random.bates(10));
        
	var margin = bb_items.margins,
	width = bb_items.w - 50,
	height = bb_items.h - 60;
        
	var x = d3.scale.linear()
	    .domain([0, 1])
	    .range([0, width]);
        
	// Generate a histogram using twenty uniformly-spaced bins.
	var data = d3.layout.histogram()
	    .bins(x.ticks(20))
	(values);
        
	var y = d3.scale.linear()
	    .domain([0, d3.max(data, function(d) { return d.y; })])
	    .range([height, 0]);
        
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
        
	var bar = svg_items.selectAll(".bar")
	    .data(data)
	    .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + (40+y(d.y)) + ")"; });
        
	bar.append("rect")
	    .attr("x", 1)
	    .attr("width", x(data[0].dx) - 1)
	    .attr("height", function(d) { return height - y(d.y); });
        
	bar.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", x(data[0].dx) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.y; });
        
	svg_items.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (height+40) + ")")
	    .call(xAxis);
    
    svg_items.append("text")
		.attr("x", 270)
		.attr("y", 20)
		.attr("font-family", "Dosis")
		.attr("font-size", "22px")
		.text("Items Purchased");



	d3.json("/blurbs/mastery_blurbs.json", function(mastery_blurbs) {
	    d3.selectAll(".mastery_row img")
		.each(function(d) {
		    var mastery_id = d3.select(this).attr("mastery_id");
                    if (mastery_id != null) {
                        mastery = l2.getMasteryInfo(mastery_id);
                        d3.select(this.parentNode).attr("tooltip", mastery.name + "\n" + mastery.sanitizedDescription.join("\n"));
                    }
		})
                    
        })
        
    });
    
}
