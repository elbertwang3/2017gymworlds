d3.csv("data/aa.csv", cast, function(data) {
	console.log(data);

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





  	console.log(maxScoreData);
  	var avgScoreData = d3.nest()
  		.key(function(d) { return d.gymnast; })
  		.rollup(function(v) { return {
  			vt: d3.mean(v, function (d) { if (d.vt != 0) { return d.vt; }}),
  			ub: d3.mean(v, function (d) { return d.ub; }),
  			bb: d3.mean(v, function (d) { return d.bb; }),
  			fx: d3.mean(v, function (d) { if (d.vt != 0) { return d.fx; }})
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
  	
  	console.log(avgScoreData);


  	var radarwidth = 550,
  		radarheight = 550;

  	var superscore = d3.max(maxScoreData, function(d) { return d3.sum(d.axes, function (v) { return v.value; })})
  	var radarColorScale = d3.scaleLinear()
  							.domain([0, superscore])
  							.range(["C2CAD6", "#08306b"]);

  	d3.selectAll("input")
		.on("change", selectDataset);
	
	
  
  	/*var mycfg = {
  		w: radarwidth,
  		h: radarheight,
	  	maxValue: 16,
	  	minValue: 13,
	  	levels: 6,
	  	ExtraWidthX: 300
	  	//color: radarColorScale
	}*/
	change(maxScoreData)
	//RadarChart.draw("#allaroundgraph", maxScoreData, mycfg);
	function selectDataset() {
		var value = +this.value;
		console.log(value);
		if (value == 0) {
			change(maxScoreData);
		} else {
			change(avgScoreData);
		}
		
	}
	function change(dataset) {
		mycfg = generatecfg(dataset);
		RadarChart.draw("#allaroundgraph", dataset.slice(2,5), mycfg);
	}
	function generatecfg(dataset) {
		var maxValueVT = d3.max(dataset, function(d) {  return d.axes[0].value})
	  	var minValueVT = d3.min(dataset, function(d) {  return d.axes[0].value})
	  	var maxValueUB = d3.max(dataset, function(d) {  return d.axes[1].value})
	  	var minValueUB = d3.min(dataset, function(d) {  return d.axes[1].value})
	  	var maxValueBB = d3.max(dataset, function(d) {  return d.axes[2].value})
	  	var minValueBB = d3.min(dataset, function(d) {  return d.axes[2].value})
	  	var maxValueFX = d3.max(dataset, function(d) {  return d.axes[3].value})
	  	var minValueFX = d3.min(dataset, function(d) {  return d.axes[3].value})
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

