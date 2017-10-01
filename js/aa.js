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
  					{axis: "Vault", value: round3(group.value['vt'])},
  					{axis: "Uneven Bars", value: round3(group.value['ub'])},
  					{axis: "Balance Beam", value: round3(group.value['bb'])},
  					{axis: "Floor Exercise", value: round3(group.value['fx'])}
  				]
  			}
  		})


  	console.log(maxScoreData);
  	var avgScoreData = d3.nest()
  		.key(function(d) { return d.gymnast; })
  		.rollup(function(v) { return {
  			vt: d3.mean(v, function (d) { return d.vt; }),
  			ub: d3.mean(v, function (d) { return d.ub; }),
  			bb: d3.mean(v, function (d) { return d.bb; }),
  			fx: d3.mean(v, function (d) { return d.fx; })
  			};
  		})
  		.entries(data)
  		.map(function(group) {
  			return {
  				className: group.key,
  				axes: [
  					{axis: "Vault", value: round3(group.value['vt'])},
  					{axis: "Uneven Bars", value: round3(group.value['ub'])},
  					{axis: "Balance Beam", value: round3(group.value['bb'])},
  					{axis: "Floor Exercise", value: round3(group.value['fx'])}
  				]
  			}
  		})
  	console.log(avgScoreData);
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