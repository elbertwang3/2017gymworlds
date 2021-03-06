
aatip = d3.select("#allaroundgraph").append("div")  
        .attr("class", "aa tooltip")
        .style("left", 400 + "px")    
        .style("top", 3100 + "px");
d3.csv("data/aa.csv", cast, function(data) {
	//console.log(data);
	var maxValueVT = d3.max(data, function(d) {  if (d.vt != 0) {return d.vt;}})
  	var minValueVT = d3.min(data, function(d) {  if (d.vt != 0) {return d.vt;}})
  	var maxValueUB = d3.max(data, function(d) {  if (d.ub != 0) {return d.ub;}})
  	var minValueUB = d3.min(data, function(d) {  if (d.ub != 0) { return d.ub;}})
  	var maxValueBB = d3.max(data, function(d) {  if (d.bb != 0) { return d.bb;}})
  	var minValueBB = d3.min(data, function(d) {  if (d.bb != 0) { return d.bb;}})
  	var maxValueFX = d3.max(data, function(d) {  if (d.fx != 0) { return d.fx;}})
  	var minValueFX = d3.min(data, function(d) {  if (d.fx != 0) {return d.fx;}})
  	
	var maxScoreData = d3.nest()
  		.key(function(d) { return d.gymnast; })
  		.rollup(function(v) { return {
  			vt: d3.max(v, function (d) { return d.vt; }),
  			ub: d3.max(v, function (d) { return d.ub; }),
  			bb: d3.max(v, function (d) { return d.bb; }),
  			fx: d3.max(v, function (d) { return d.fx; })
  			};
  		})
  		.entries(data)
  		.map(function(group) {
  			return {
  				className: group.key,
  				axes: [
  					{axis: "VT", value: +round3(group.value['vt'])},
  					{axis: "UB", value: +round3(group.value['ub'])},
  					{axis: "BB", value: +round3(group.value['bb'])},
  					{axis: "FX", value: +round3(group.value['fx'])}
  				]
  			}
  		})





  	//console.log(maxScoreData);
  	var avgScoreData = d3.nest()
  		.key(function(d) { return d.gymnast; })
  		.rollup(function(v) { return {
  			vt: d3.mean(v, function (d) { if (d.vt != 0) { return d.vt; }}),
  			ub: d3.mean(v, function (d) { if (d.ub != 0) return d.ub; }),
  			bb: d3.mean(v, function (d) { if (d.bb != 0) return d.bb; }),
  			fx: d3.mean(v, function (d) { if (d.fx != 0) { return d.fx; }})
  			};
  		})
  		.entries(data)
  		.map(function(group) {
  			return {
  				className: group.key,
  				axes: [
  					{axis: "VT", value: +round3(group.value['vt'])},
  					{axis: "UB", value: +round3(group.value['ub'])},
  					{axis: "BB", value: +round3(group.value['bb'])},
  					{axis: "FX", value: +round3(group.value['fx'])}
  				]
  			}
  		})
  	for (var i = 0; i < maxScoreData.length; i++) {
  		maxScoreData[i].axes[0]['yOffset'] = 10;
	  	maxScoreData[i].axes[0]['xOffset'] = -20;
	  	maxScoreData[i].axes[2]['xOffset'] = -20;
	  	maxScoreData[i].axes[2]['yOffset'] = -10;
	  	maxScoreData[i].axes[3]['xOffset'] = -45;
	  	maxScoreData[i].axes[3]['yOffset'] = -5;
	  	maxScoreData[i].axes[1]['yOffset'] = -5;
	  	avgScoreData[i].axes[0]['yOffset'] = 10;
	  	avgScoreData[i].axes[0]['xOffset'] = -20;
	  	avgScoreData[i].axes[2]['xOffset'] = -20;
	  	avgScoreData[i].axes[2]['yOffset'] = -10;
	  	avgScoreData[i].axes[3]['xOffset'] = -45;
	  	avgScoreData[i].axes[3]['yOffset'] = -5;
	  	avgScoreData[i].axes[1]['yOffset'] = -5;
  	}
  	
  	//console.log(avgScoreData);


  	var radarwidth = 550,
  		radarheight = 550;

  	var superscore = d3.max(maxScoreData, function(d) { return d3.sum(d.axes, function (v) { return v.value; })})
  	var radarColorScale = d3.scaleLinear()
  							.domain([0, superscore])
  							.range(["C2CAD6", "#08306b"]);

  	d3.selectAll(".aaradio")
		.on("change", selectCheckboxes);

	d3.selectAll(".checkbox")
		.on("change", selectCheckboxes);
	var checkedValues = [];
	
  
  	/*var mycfg = {
  		w: radarwidth,
  		h: radarheight,
	  	maxValue: 16,
	  	minValue: 13,
	  	levels: 6,
	  	ExtraWidthX: 300
	  	//color: radarColorScale
	}*/
	var dummygymnast = maxScoreData[0]
	dummygymnast.className = "";
	var checkedData = [];
	for (var i = 0; i < 14; i++) {
		checkedData[i] = dummygymnast;
	}
	console.log(checkedData);
	change(checkedData);
	/*aatip = d3.select("#allaroundgraph").append("div")  
        .attr("class", "aa tooltip")
        .style("left", 325 + "px")    
        .style("top", 3150 + "px");	*/
	//RadarChart.draw("#allaroundgraph", maxScoreData, mycfg);
	function selectDataset() {
		var value = +this.value;
		console.log(value);
		if (value == 0) {
			change(checkedData);
		} else {
			change(checkedData);
		}
	}

	function selectCheckboxes() {
		var value = d3.select('input[name="dataset"]:checked').node().value;
		console.log(value);
		var checkedBoxes = document.querySelectorAll('input[name=gymnast]:checked');
		checkedValues = []
		for (var i = 0; i < checkedBoxes.length; i++) {
			checkedValues.push(+checkedBoxes[i].defaultValue);

		}
		console.log(checkedValues);
		for (var i = 0; i < 14; i++) {
			checkedData[i] = dummygymnast;
		}
		if (value == 0) {
			for (var i = 0; i < checkedValues.length; i++) {
				checkedData[checkedValues[i]-1] = maxScoreData[checkedValues[i]];
			}

		
			console.log(checkedData);
			change(checkedData);
		} else {
			for (var i = 0; i < checkedValues.length; i++) {
				checkedData[checkedValues[i]-1] = avgScoreData[checkedValues[i]];
			}
			console.log(checkedData);
			change(checkedData);
		}
		return checkedData;
	}
	function change(dataset) {
		console.log(dataset);
		mycfg = generatecfg(dataset);
		RadarChart.draw("#allaroundgraph", dataset, mycfg);
	}
	function generatecfg(dataset) {
		
	  	/*console.log(maxValueVT);
	  	console.log(minValueVT);
	  	console.log(maxValueUB);
	  	console.log(minValueUB);
	  	console.log(maxValueBB);
	  	console.log(minValueBB);
	  	console.log(maxValueFX);
	  	console.log(minValueFX);*/
	  	maxValues = [maxValueVT, maxValueUB, maxValueBB, maxValueFX]
		minValues = [minValueVT, minValueUB, minValueBB, minValueFX]
	
	  	var mycfg = {
	  		w: radarwidth,
	  		h: radarheight,
		  	maxValues: maxValues,
		  	minValues: minValues,
		  	levels: 6,
		  	ExtraWidthX: 300
		  	//color: radarColorScale
		}
		return mycfg;
	}
});


function cast(d) {
  return {
    country: d.country, // convert "Year" column to Date
    gymnast: d.gymnast,
    vt: +d.VT,
    ub: +d.UB, // convert "Length" column to number
    bb: +d.BB,
    fx: +d.FX,
    competition: d.competition
  };
}

function round3(num) {
	return parseFloat(Math.round(num * 1000) / 1000).toFixed(3);
}

