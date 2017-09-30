var margin = {top: 50, left: 50, right: 50, bottom: 50},
	countriesheight = 650;
	countrieswidth = 1000;


var countriessvg = d3.select("#countriessvg")


/*countriessvg.append("rect")
    .attr("class", "background")
    .attr("width", countrieswidth)
    .attr("height", countriesheight)
    .on("click", reset)*/

var countriesg = countriessvg
					.append("g")
					//.attr("transform", "translate(0, " + 130 + ")");

countriessvg.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(" + countrieswidth/4 + ", " + (6*countriesheight/7) + ")");


/*var countriestip = countriessvg.append("g")  
        .attr("class", "countriestooltip")
        .attr("width", 500)
        .attr("height", 500)
        .attr("fill", "black")
       // .attr("transform", "translate(" + (countrieswidth/6) + ", " + (3*countriesheight/4) +")");*/
countriestip = d3.select("#countriesgraph").append("div")  
        .attr("class", "tooltip")
        .style("left", 300 + "px")    
        .style("top", 725 + "px");	

var projection = d3.geoMercator()
					.translate([countrieswidth/2, countriesheight/2]);

var zoom = d3.zoom()
    // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
    // .translate([0, 0]) 
    // .scale(1) 
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var path = d3.geoPath()
			.projection(projection);

var countriesColor = d3.scaleOrdinal()
			.domain(["Participating and medaled", "Participating but no medal", "Not participating but medaled", "Not participating and no medal"])
			.range(["#00d0a1", "#64bdff", "#cccccc", "#f0f0f0"])

var legendOrdinal = d3.legendColor()
  //d3 symbol creates a path-string, for example
  //"M0,-8.059274488676564L9.306048591020996,
  //8.059274488676564 -9.306048591020996,8.059274488676564Z"
  .shape('circle')
  .shapePadding(150)
  .orient('horizontal')
  //use cellFilter to hide the "e" cell
  .cellFilter(function(d){ return d.label !== "e" })
  .scale(countriesColor);

countriessvg.select(".legendOrdinal")
  .call(legendOrdinal);

countriessvg.call(zoom);

d3.queue()
	.defer(d3.json, "data/world-countries-sans-antarctica.json")
	.defer(d3.csv, "data/gymnasts.csv")
	.defer(d3.csv, "data/medaled.csv")
	.await(ready)

function ready(error, countriesdata, gymnastsdata, medalsdata) {
	console.log(countriesdata);
	//console.log(gymnastsdata);
	var countryname;

	var countriesParticipatingSet = new Set();
	var countriesMedaledSet = new Set();
	var countriesGymnasts = {};
	for (var i = 0; i < gymnastsdata.length; i++) {
		
		countryname = gymnastsdata[i].country;
		gymnastname = gymnastsdata[i].gymnast
		countryname = fixCapitalization(countryname);

		if (countriesGymnasts.hasOwnProperty(countryname)) {
			countriesGymnasts[countryname].push(gymnastname)
		} else {
			countriesGymnasts[countryname] = [gymnastname]
		}
		countriesParticipatingSet.add(countryname);


	}
	for (var i = 0; i < medalsdata.length; i++) {
		countriesMedaledSet.add(medalsdata[i].country)
	}
	console.log(countriesParticipatingSet);
	console.log(countriesMedaledSet);
	console.log(countriesGymnasts);


	countries = topojson.feature(countriesdata, countriesdata.objects.countries1).features
	//console.log(countries);

	countriesg.selectAll(".country")
		.data(countries)
		.enter()
		.append("path")
		.attr("class", "country")
		.attr("d", path)
		.attr("fill", function(d) { 
			if (countriesParticipatingSet.has(d.properties.name)) {
				if (countriesMedaledSet.has(d.properties.name)) {
					console.log("PM: " + d.properties.name)
					console.log(countriesColor("PM"));
					return countriesColor("Participating and medaled");
				}
				else {
					console.log("PNM: " + d.properties.name)
					console.log(countriesColor("PNM"));
					return countriesColor("Participating but no medal");
				}
			}
			else {
				if (countriesMedaledSet.has(d.properties.name)) {
					console.log("NPM: " + d.properties.name)
					console.log(countriesColor("Not participating but medaled"));
					return countriesColor("NPM");
				}
				else {
					console.log("NPNM: " + d.properties.name)
					console.log(countriesColor("NPNM"));
					return countriesColor("Not participating and no medal");
				}
			}
		})
		.on("mouseover", function(d) {
			if (typeof countriesGymnasts[d.properties.name] !== "undefined") {	
				console.log("getting here");
				htmlstring = "<h5>" +  d.properties.name + "</h5> <ul>"
				for (var i = 0; i < countriesGymnasts[d.properties.name].length; i++) {
					htmlstring += "<li>" + countriesGymnasts[d.properties.name][i] + "</li>"
				}
				htmlstring += "</ul>"
				
				countriestip.html(htmlstring);
		

		
				countriestip.transition()   
					.duration(200)     
            		.style("opacity", "1")
          	}
        })
        .on("mouseout", function(d) {   
	        countriestip.transition()    
	            .duration(200)    
	            .style("opacity", "0"); 
  		});
  }
  



function fixCapitalization(country) {
	var splitCountry = country.split(" ")
	var toReturn = "";
	for (var i = 0; i < splitCountry.length; i++) {
		if (splitCountry[i] == "OF") {
			toReturn += "of ";
		} else {
			toReturn += splitCountry[i].charAt(0) + splitCountry[i].slice(1).toLowerCase() + " ";
		}
	}
	toReturn = toReturn.substring(0, toReturn.length - 1);
	return toReturn;
}

function reset() {

  countriessvg.transition()
      .duration(750)
      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
      .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
}

function zoomed() {
  //countriesg.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  countriesg.attr("transform", d3.event.transform); // updated for d3 v4
}
