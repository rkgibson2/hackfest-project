//Angela Fan, Robbie Gibson

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
		.attr("x", 1000)
		.attr("y", 0)
		.attr("class", "champ_name")
		.text(current_hero)
		.style("fill", "black");

})