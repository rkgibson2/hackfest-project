//Angela Fan, Robbie Gibson

//data global

var champ_data;

var graph_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0,0]);

//margins and bounding boxes for each graph visualization
var bb_spells, bb_items, bb_xpm, bb_gpm, bb_masteries, bb_runes, bb_first_point, bb_maxed_at, bb_winrate;

var x_xpm, y_xpm, data_xpm, xAxis_xpm, bar_xpm, x_gpm, y_gpm, data_gpm, xAxis_gpm, bar_gpm;

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

var margin_xpm = bb_xpm.margins,
	width_xpm = bb_xpm.w - 50,
	height_xpm = bb_xpm.h - 60;

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
    
    filtered_data = filter_by_id(current_hero);

    // mastery stuff
    var mastery_filter = filtered_data.filter(function(d) {
        return "masteries" in d;
    });
    
    var mastery_key_list = l2.getKeys("mastery");
    var mastery_counter = {};

    // set up opacity scale
    var opacity_scale = d3.scale.linear()
        .domain([0, 1])
        .range([0.4, 1])

    for (var i = 0; i < mastery_key_list.length; i++) {
        mastery_counter[mastery_key_list[i]] = 0;
    }

    // count mastery points
    for (var i = 0; i < mastery_filter.length; i++) {
        masteries = mastery_filter[i].masteries;
        for (var j = 0; j < masteries.length; j++) {
            mastery_counter[masteries[j].masteryId] += masteries[j].rank;
        }
    }

    // normalize mastery points and set opacity
    for (var i = 0; i < mastery_key_list.length; i++) {
        id = mastery_key_list[i];
        mastery_counter[id] /= (mastery_filter.length * l2.getMasteryInfo(id).ranks);
        
        img = d3.select("[mastery_id='" + id + "']")
            .style("opacity", opacity_scale(mastery_counter[id]));

        mastery = l2.getMasteryInfo(id);
        d3.select(img.node().parentNode).attr("tooltip", mastery.name + "\n" + 
                                              mastery.sanitizedDescription.join("\n") + "\n" + 
                                              "Taken: " + (mastery_counter[id] * 100).toFixed() + "%");
    }

    // get summoner spells
    var summoner_spells = ['11', '10', '13', '12', '21', '1', '3', '2', '4', '7', '6', '14'];

    var summoner_counter = {};

    for (var i = 0; i < summoner_spells.length; i++) {
        summoner_counter[summoner_spells[i]] = 0;
    }

    // count mastery points
    for (var i = 0; i < filtered_data.length; i++) {
        summoner_counter[filtered_data[i].spell1Id] += 1;
        summoner_counter[filtered_data[i].spell2Id] += 1;
    }

    // normalize mastery points and set opacity
    for (var i = 0; i < summoner_spells.length; i++) {
        id = summoner_spells[i];
        summoner_counter[id] /= filtered_data.length;
        
        img = d3.select("[summoner_spell_id='" + id + "']")
            .style("opacity", opacity_scale(summoner_counter[id]))
            .attr("percentage", summoner_counter[id]);
    }

    // bind new mouseovers
    d3.selectAll(".sum_spell_img")
	.on("mouseover", function(d, i) {
            
	    var current_spell = d3.select(this).attr("summoner_spell_id");
            
	    var spell_name = l2.getSummonerSpellInfo(current_spell).name
	    var description = l2.getSummonerSpellInfo(current_spell).sanitizedDescription;
            var percentage = d3.select(this).attr("percentage")
            
	    var html_string = "<b>" + spell_name + "</b><br>" + description + "<br> <i>Taken: " + (percentage * 100).toFixed() + "%</i>";
            
	    graph_tip.direction('e')
            
	    graph_tip.html(html_string);
	    graph_tip.show(d,i);
            
	})
	.on("mouseout", function(d, i) {
	    graph_tip.hide(d,i);
	});
    
    d3.selectAll("#xpm_container svg *").remove()
    
    var values_xpm = filtered_data.map(function(d) {
	return d.stats.DPM;
    });
    
    x_xpm = d3.scale.linear()
	.domain(d3.extent(values_xpm))
	.range([0, width_xpm]);
    
    data_xpm = d3.layout.histogram()
	.bins(17)
	.range(d3.extent(values_xpm))
    (values_xpm);
    
	y_xpm = d3.scale.linear()
	    .domain([0, d3.max(data_xpm, function(d) { return d.y; })])
	    .range([height_xpm, 0]);
        
	xAxis_xpm = d3.svg.axis()
	    .scale(x_xpm)
	    .orient("bottom")
	    .innerTickSize([0])
	    .outerTickSize([0]);
        
	bar_xpm = svg_xpm.selectAll(".bar")
	    .data(data_xpm)
	    .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x_xpm(d.x) + "," + (40+y_xpm(d.y)) + ")"; });
        
	bar_xpm.append("rect")
	    .attr("x", 1)
	    .attr("width", x_xpm.range()[1]/20)
	    .attr("height", function(d) { return height_xpm - y_xpm(d.y); })
	    .on("mouseover", function(d) {
	    	graph_tip.html("DPM: " + d.x.toFixed());
	    	graph_tip.show(d);
	    })
	    .on("mouseout", function(d) {
	    	graph_tip.hide(d);
	    });
        
	bar_xpm.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", x_xpm.range()[1]/40)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.y; });
        
	svg_xpm.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (height_xpm+40) + ")")
	    .call(xAxis_xpm);

	svg_xpm.append("text")
		.attr("x", 80)
		.attr("y", 20)
		.attr("font-family", "Dosis")
		.attr("font-size", "22px")
		.text("Average Damage/Min");



	d3.selectAll("#gpm_container svg *").remove()

	var values_gpm = filtered_data.map(function(d) {
		return d.stats.GPM;
	});        

	var margin_gpm = bb_gpm.margins,
	width_gpm = bb_gpm.w - 50,
	height_gpm = bb_gpm.h - 60;
        
	x_gpm = d3.scale.linear()
	    .domain(d3.extent(values_gpm))
	    .range([0, width_gpm]);
        
	data_gpm = d3.layout.histogram()
	    .bins(17)
	    .range(d3.extent(values_gpm))
	(values_gpm);
        
	y_gpm = d3.scale.linear()
	    .domain([0, d3.max(data_gpm, function(d) { return d.y; })])
	    .range([height_gpm, 0]);
        
	xAxis_gpm = d3.svg.axis()
	    .scale(x_gpm)
	    .orient("bottom")
	    .innerTickSize([0])
	    .outerTickSize([0]);
        
	bar_gpm = svg_gpm.selectAll(".bar")
	    .data(data_gpm)
	    .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x_gpm(d.x) + "," + (40+y_gpm(d.y)) + ")"; });
        
	bar_gpm.append("rect")
	    .attr("x", 1)
	    .attr("width", x_gpm.range()[1]/20)
	    .attr("height", function(d) { return height_gpm - y_gpm(d.y); })
	    .on("mouseover", function(d) {
	    	graph_tip.html("GPM: " + d.x.toFixed(2));
	    	graph_tip.show(d);
	    })
	    .on("mouseout", function(d) {
	    	graph_tip.hide(d);
	    });
        
	bar_gpm.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", x_gpm.range()[1]/40)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.y; });
        
	svg_gpm.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (height_gpm+40) + ")")
	    .call(xAxis_gpm);

	svg_gpm.append("text")
		.attr("x", 80)
		.attr("y", 20)
		.attr("font-family", "Dosis")
		.attr("font-size", "22px")
		.text("Average Gold/Min");


    d3.selectAll("#items_container svg *").remove()

	var values = filtered_data.map(function(d) {
		return [d.stats.item0, d.stats.item1, d.stats.item2, d.stats.item3, d.stats.item4, d.stats.item5];
	});

	var merged_values = [];

	merged_values = merged_values.concat.apply(merged_values, values);

	var items_dict = [];

	var item_ids = l2.getKeys("item");

	for (var i = 0; i < item_ids.length; i++) {
		items_dict[i] = {"id": item_ids[i], "count": 0, "name": l2.getItemInfo(item_ids[i]).name}
	}

	var merged_values_length = merged_values.length;

	for (var i = 0; i < merged_values_length; i++) {
		if (merged_values[i] != 0) {
			index = item_ids.indexOf(String(merged_values[i]))

			items_dict[index].count += 1;
		}
	}

	items_dict = items_dict.filter(function(d) {
		return d.count != 0
	})

	//console.log(items_dict)

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = bb_items.w
    height = bb_items.h - 40;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1, 1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .innerTickSize([0])
	    .outerTickSize([0])
	    .tickFormat(function (d) { return ''; });

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .innerTickSize([0])
	    .outerTickSize([0]);

	x.domain(items_dict.map(function(d) {
		return d.name
	}))

	y.domain([0, d3.max(items_dict, function(d) {
		return d.count;
	})])

	//console.log(x.domain())

	svg_items.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	// svg_items.append("g")
	//     .attr("class", "y axis")
	//     .call(yAxis)
	//   .append("text")
	//     .attr("transform", "rotate(-90)")
	//     .attr("y", 6)
	//     .attr("dy", ".71em")
	//     .style("text-anchor", "end")
	//     .text("Frequency");

	svg_items.selectAll(".bar")
	    .data(items_dict)
	  .enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d,i) { 
	    	//console.log(d)
	    	return x(d.name); })
	    .attr("width", x.rangeBand())
	    .attr("y", function(d) { return y(d.count); })
	    .attr("height", function(d) { return height - y(d.count); })
	    .on("mouseover", function(d) {

	    	graph_tip.html("<b>" + d.name + "</b><br>Count: " + d.count)
	    	graph_tip.show(d);

	    })
	    .on("mouseout", function(d) {
	    	graph_tip.hide(d);
	    });

	svg_items.append("text")
		.attr("x", 320)
		.attr("y", 20)
		.attr("font-family", "Dosis")
		.attr("font-size", "22px")
		.text("Items Purchased");

	svg_items.selectAll(".text")
		.data(items_dict)
		.enter().append("text")
		.attr("class", "item_text")
		.attr("dy", ".75em")
	    .attr("y", function(d) {
	    	return y(d.count) + 2;
	    })
	    .attr("x", function(d,i) {
	    	return x(d.name) + (x.range()[1] - x.range()[0])/2;
	    })
	    .attr("text-anchor", "middle")
	    .text(function(d) { 
	    	//console.log(d.y)
	    	return d.count; 
	    });


	d3.selectAll("#winrate_container svg *").remove();

	var outcomes = filtered_data.map(function(d) {
		return d.stats.winner;
	});

	var num_wins = 0;
	var total_games = outcomes.length;

	for (var i = 0; i < outcomes.length; i++) {
		if (String(outcomes[i]) == "true") {
			num_wins += 1;
			//console.log("here")
		}
	};

	var winrate = num_wins/total_games;

	//console.log(winrate)

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

	svg_winrate.append("rect")
		.attr("height", 40)
		.attr("stroke", "black")
		.attr("stroke-width", "1px")
		.attr("width", winrate*(bb_winrate.w-20))
		.attr("fill", "green")
		.attr("x", 40)
		.attr("y", 40);

	svg_winrate.append("text")
		.attr("x", 300)
		.attr("y", 65)
		.text(winrate.toFixed(2) + "%")
		.attr("font-family", "Arial")
		.attr("font-size", "18px")
		.attr("font-weight", "bold");

}

function load(current_hero) {
    
    l2.loadJson(function() {
    
    var filtered_data = filter_by_id(current_hero);
    
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
			.attr("summoner_spell_id", summoner_spells[i])
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

	var actives = l2.getChampionInfo(current_hero).spells
	var passive = l2.getChampionInfo(current_hero).passive
	var img_array = [l2.getChampionInfo(current_hero).name + ".png"];

	for (var i = 0; i < actives.length; i++) {
		img_array.push(actives[i].image.full)
	}

	d3.select("#abilities").append("text")
		.attr("x", 80)
		.attr("y", 20)
		.text("Champion Spells");

	//console.log(img_array)

	var abil_size = 65;

	for (var i = 0; i < img_array.length; i++) {
		d3.select("#abilities").append("img")
			.attr("x", 100)
			.attr("y", 10 + (i*abil_size))
			.attr("height", abil_size)
			.attr("width", abil_size)
			.attr("class", "ability_image")
			.attr("src", "/img/spells/" + img_array[i]);
	}

	// d3.select("#abilities")
	// 	.append("image")
	// 	.attr("x", 10)
        
	d3.selectAll(".sum_spell_img")
	    .on("mouseover", function(d, i) {
                
			var current_spell = d3.select(this).attr("summoner_spell_id");
	                
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
        
    //win-loss

	var outcomes = filtered_data.map(function(d) {
		return d.stats.winner;
	});

	var num_wins = 0;
	var total_games = outcomes.length;

	for (var i = 0; i < outcomes.length; i++) {
		if (String(outcomes[i]) == "true") {
			num_wins += 1;
			//console.log("here")
		}
	};

	var winrate = num_wins/total_games;

	//console.log(winrate)

	svg_winrate.append("rect")
		.attr("height", 40)
		.attr("stroke", "black")
		.attr("stroke-width", "1px")
		.attr("width", winrate*(bb_winrate.w-20))
		.attr("fill", "green")
		.attr("x", 40)
		.attr("y", 40);

	svg_winrate.append("text")
		.attr("x", 300)
		.attr("y", 65)
		.text(winrate.toFixed(2) + "%")
		.attr("font-family", "Arial")
		.attr("font-size", "18px")
		.attr("font-weight", "bold");

	//xpm histogram
	var values_xpm = filtered_data.map(function(d) {
		return d.stats.DPM;
	});
        
	//console.log(values_xpm)
        
	x_xpm = d3.scale.linear()
	    .domain(d3.extent(values_xpm))
	    .range([0, width_xpm]);

	data_xpm = d3.layout.histogram()
	    .bins(17)
	    .range(d3.extent(values_xpm))
	(values_xpm);
        
	y_xpm = d3.scale.linear()
	    .domain([0, d3.max(data_xpm, function(d) { return d.y; })])
	    .range([height_xpm, 0]);
        
	xAxis_xpm = d3.svg.axis()
	    .scale(x_xpm)
	    .orient("bottom")
	    .innerTickSize([0])
	    .outerTickSize([0]);
        
	bar_xpm = svg_xpm.selectAll(".bar")
	    .data(data_xpm)
	    .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x_xpm(d.x) + "," + (40+y_xpm(d.y)) + ")"; });
        
	bar_xpm.append("rect")
	    .attr("x", 1)
	    .attr("width", x_xpm.range()[1]/20)
	    .attr("height", function(d) { return height_xpm - y_xpm(d.y); })
	    .on("mouseover", function(d) {
	    	graph_tip.html("DPM: " + d.x.toFixed());
	    	graph_tip.show(d);
	    })
	    .on("mouseout", function(d) {
	    	graph_tip.hide(d);
	    });
        
	bar_xpm.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", x_xpm.range()[1]/40)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.y; });
        
	svg_xpm.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (height_xpm+40) + ")")
	    .call(xAxis_xpm);

	svg_xpm.append("text")
		.attr("x", 80)
		.attr("y", 20)
		.attr("font-family", "Dosis")
		.attr("font-size", "22px")
		.text("Average Damage/Min");


	//gpm histogram
	var values_gpm = filtered_data.map(function(d) {
		return d.stats.GPM;
	});        

	var margin_gpm = bb_gpm.margins,
	width_gpm = bb_gpm.w - 50,
	height_gpm = bb_gpm.h - 60;
        
	x_gpm = d3.scale.linear()
	    .domain(d3.extent(values_gpm))
	    .range([0, width_gpm]);
        
	data_gpm = d3.layout.histogram()
	    .bins(17)
	    .range(d3.extent(values_gpm))
	(values_gpm);
        
	y_gpm = d3.scale.linear()
	    .domain([0, d3.max(data_gpm, function(d) { return d.y; })])
	    .range([height_gpm, 0]);
        
	xAxis_gpm = d3.svg.axis()
	    .scale(x_gpm)
	    .orient("bottom")
	    .innerTickSize([0])
	    .outerTickSize([0]);
        
	bar_gpm = svg_gpm.selectAll(".bar")
	    .data(data_gpm)
	    .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x_gpm(d.x) + "," + (40+y_gpm(d.y)) + ")"; });
        
	bar_gpm.append("rect")
	    .attr("x", 1)
	    .attr("width", x_gpm.range()[1]/20)
	    .attr("height", function(d) { return height_gpm - y_gpm(d.y); })
	    .on("mouseover", function(d) {
	    	graph_tip.html("GPM: " + d.x.toFixed(2));
	    	graph_tip.show(d);
	    })
	    .on("mouseout", function(d) {
	    	graph_tip.hide(d);
	    });
        
	bar_gpm.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", x_gpm.range()[1]/40)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.y; });
        
	svg_gpm.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (height_gpm+40) + ")")
	    .call(xAxis_gpm);

	svg_gpm.append("text")
		.attr("x", 80)
		.attr("y", 20)
		.attr("font-family", "Dosis")
		.attr("font-size", "22px")
		.text("Average Gold/Min");


	//items histogram
	var values = filtered_data.map(function(d) {
		return [d.stats.item0, d.stats.item1, d.stats.item2, d.stats.item3, d.stats.item4, d.stats.item5];
	});

	var merged_values = [];

	merged_values = merged_values.concat.apply(merged_values, values);

	var items_dict = [];

	var item_ids = l2.getKeys("item");

	for (var i = 0; i < item_ids.length; i++) {
		items_dict[i] = {"id": item_ids[i], "count": 0, "name": l2.getItemInfo(item_ids[i]).name}
	}

	var merged_values_length = merged_values.length;

	for (var i = 0; i < merged_values_length; i++) {
		if (merged_values[i] != 0) {
			index = item_ids.indexOf(String(merged_values[i]))

			items_dict[index].count += 1;
		}
	}

	items_dict = items_dict.filter(function(d) {
		return d.count != 0
	})

	//console.log(items_dict)

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = bb_items.w
    height = bb_items.h - 40;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1, 1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .innerTickSize([0])
	    .outerTickSize([0])
	    .tickFormat(function (d) { return ''; });

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .innerTickSize([0])
	    .outerTickSize([0]);

	x.domain(items_dict.map(function(d) {
		return d.name
	}))

	y.domain([0, d3.max(items_dict, function(d) {
		return d.count;
	})])

	//console.log(x.domain())

	svg_items.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	// svg_items.append("g")
	//     .attr("class", "y axis")
	//     .call(yAxis)
	//   .append("text")
	//     .attr("transform", "rotate(-90)")
	//     .attr("y", 6)
	//     .attr("dy", ".71em")
	//     .style("text-anchor", "end")
	//     .text("Frequency");

	svg_items.selectAll(".bar")
	    .data(items_dict)
	  .enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d,i) { 
	    	//console.log(d)
	    	return x(d.name); })
	    .attr("width", x.rangeBand())
	    .attr("y", function(d) { return y(d.count); })
	    .attr("height", function(d) { return height - y(d.count); })
	    .on("mouseover", function(d) {

	    	graph_tip.html("<b>" + d.name + "</b><br>Count: " + d.count)
	    	graph_tip.show(d);

	    })
	    .on("mouseout", function(d) {
	    	graph_tip.hide(d);
	    });

	svg_items.append("text")
		.attr("x", 320)
		.attr("y", 20)
		.attr("font-family", "Dosis")
		.attr("font-size", "22px")
		.text("Items Purchased");

	svg_items.selectAll(".text")
		.data(items_dict)
		.enter().append("text")
		.attr("class", "item_text")
		.attr("dy", ".75em")
	    .attr("y", function(d) {
	    	return y(d.count) + 2;
	    })
	    .attr("x", function(d,i) {
	    	return x(d.name) + (x.range()[1] - x.range()[0])/2;
	    })
	    .attr("text-anchor", "middle")
	    .text(function(d) { 
	    	//console.log(d.y)
	    	return d.count; 
	    });

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

function filter_by_id(champ_id) {
    matches = l2.filterMatchData(champ_id);

    // create GPM and XPM

    matches.forEach(function(d, i) {
        match_in_min = d.matchDuration / 60;
        d.stats.GPM = d.stats.goldEarned / match_in_min;
        d.stats.DPM = d.stats.totalDamageDealt / match_in_min;

        if (d.stats.DPM < 500) {
        	//console.log(i, d);
        }
    })

    return matches;
}
