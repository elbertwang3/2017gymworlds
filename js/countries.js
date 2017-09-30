var margin = {top: 50, left: 50, right: 50, bottom: 50},
	countriesheight = 650 - margin.top - margin.bottom,
	countrieswidth = 1000 - margin.left - margin.right;

var countriessvg = d3.select("#countriessvg")
					.append("g")
					.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var projection = d3.geoMercator()
					.translate([countrieswidth/2, countriesheight/2]);

var path = d3.geoPath()
			.projection(projection);

var countriesColor = d3.scaleOrdinal()
			.domain(["PM", "PNM", "NPM", "NPNM"])
			.range(["#00d0a1", "#64bdff", "#cccccc", "#f0f0f0"])
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
	var countriesGymnasts = [];
	for (var i = 0; i < gymnastsdata.length; i++) {
		
		countryname = gymnastsdata[i].country;
		gymnastname = gymnastsdata[i].gymnast
		countryname = fixCapitalization(countryname);

		if (!countriesParticipatingSet.has(countryname)) {
			countriesGymnasts.push({country: countryname, gymnasts: [gymnastname]})
		} else {
			countriesGymnasts[countriesParticipatingSet.size - 1].gymnasts.push(gymnastname)
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

	countriessvg.selectAll(".country")
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
					return countriesColor("PM");
				}
				else {
					console.log("PNM: " + d.properties.name)
					console.log(countriesColor("PNM"));
					return countriesColor("PNM");
				}
			}
			else {
				if (countriesMedaledSet.has(d.properties.name)) {
					console.log("NPM: " + d.properties.name)
					console.log(countriesColor("NPM"));
					return countriesColor("NPM");
				}
				else {
					console.log("NPNM: " + d.properties.name)
					console.log(countriesColor("NPNM"));
					return countriesColor("NPNM");
				}
			}
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
	return toReturn
}