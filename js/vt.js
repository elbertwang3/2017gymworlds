
var vtmargin = {top: 50, right: 20, bottom: 30, left: 40},
    vtwidth = 960 - vtmargin.left - vtmargin.right,
    vtheight = 500 - vtmargin.top - vtmargin.bottom;

var vtx = d3.scaleBand()
    .rangeRound([0, vtwidth])
    .padding(0.3)

var vty = d3.scaleLinear()
    .rangeRound([vtheight,0]);

var vtcolor = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

var vtxAxis = d3.axisBottom(vtx)

var vtyAxis = d3.axisLeft(vty)
    .tickFormat(d3.format(".2s"));

var vtsvg = d3.select("#vtgraph").append("svg")
    .attr("width", vtwidth + vtmargin.left + vtmargin.right)
    .attr("height", vtheight + vtmargin.top + vtmargin.bottom)
  .append("g")
    .attr("transform", "translate(" + vtmargin.left + "," + vtmargin.top + ")");

var active_link = "0"; //to control legend selections and hover
var legendClicked; //to control legend selections
var legendClassArray = []; //store legend classes to select bars in plotSingle()
var legendClassArray_orig = []; //orig (with spaces)
var sortDescending = false; //if true, bars are sorted by height in descending order
var restoreXFlag = false; //restore order of bars back to original


//disable sort checkbox
d3.select("#vtlabel")             
  .select("#sortvt")
  .property("disabled", true)
  .property("checked", false); 

d3.csv("data/vt.csv", cast, function(data) {
	var maxScoreData = d3.nest()
  		.key(function(d) { return d.gymnast; })
  		.rollup(function(v) { return {
        country: v[0]['country'],
  			dscore1: d3.max(v, function (d) { return d.dscore1; }),
        escore1: d3.max(v, function (d) { return d.escore1 - d.nd1; }),
        dscore2: d3.max(v, function (d) { return d.dscore2; }),
  			escore2: d3.max(v, function (d) { return d.escore2 - d.nd2; })
  			};
  		})
  		.entries(data)
  		.map(function(group) {
  			return {
          gymnast: group.key,
          country: fixCapitalization(group.value['country']),
          dscore1: +round3(group.value['dscore1']),
          escore1: +round3(group.value['escore1']),
          dscore2: +round3(group.value['dscore2']),
          escore2: +round3(group.value['escore2'])
        }
  		});
  

  	var avgScoreData = d3.nest()
  		.key(function(d) { return d.gymnast; })
  		.rollup(function(v) { return {
        country: v[0]['country'],
        dscore1: d3.mean(v, function (d) { return d.dscore1; }),
        escore1: d3.mean(v, function (d) { return d.escore1 - d.nd1; }),
        dscore2: d3.mean(v, function (d) { return d.dscore2; }),
        escore2: d3.mean(v, function (d) { return d.escore2 - d.nd2; })
  			};
  		})
  		.entries(data)
  		.map(function(group) {
        return {
          gymnast: group.key,
          country: fixCapitalization(group.value['country']),
          dscore1: +round3(group.value['dscore1']),
          escore1: +round3(group.value['escore1']),
          dscore2: +round3(group.value['dscore2']),
          escore2: +round3(group.value['escore2'])
        }
      });


  vtcolor.domain(d3.keys(data[0]).filter(function(key) { return key !== "gymnast" && key !== "country" 
                                                      && key !== "nd1" && key != "nd2" && key != "competition"; }));
  
  maxScoreData.forEach(function(d) {
    var mygymnast = d.gymnast; //add to stock code
    var y0 = 0;
    //d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.scores = vtcolor.domain().map(function(name) {
      //return { mystate:mystate, name: name, y0: y0, y1: y0 += +d[name]}; });
      return { 
        mygymnast:mygymnast, 
        name: name, 
        y0: y0, 
        y1: y0 += +d[name], 
        value: d[name],
        y_corrected: 0
      }; 
      });
    d.total = d.scores[d.scores.length - 1].y1;    

  });

  avgScoreData.forEach(function(d) {
    var mygymnast = d.gymnast; //add to stock code
    var y0 = 0;
    //d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.scores = vtcolor.domain().map(function(name) {
      //return { mystate:mystate, name: name, y0: y0, y1: y0 += +d[name]}; });
      return { 
        mygymnast:mygymnast, 
        name: name, 
        y0: y0, 
        y1: y0 += +d[name], 
        value: d[name],
        y_corrected: 0
      }; 
      });
    d.total = d.scores[d.scores.length - 1].y1;    

  });
  //Sort totals in descending order
  maxScoreData.sort(function(a, b) { return b.total - a.total; }); 
  avgScoreData.sort(function(a, b) { return b.total - a.total; }); 
  console.log(maxScoreData);
  console.log(avgScoreData);
  var vtTip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d,i) { return d.name + " : " + (+round3(d.y1 - d.y0))});

  d3.selectAll(".vtradio")
    .on("change", selectDataset); 

  //vtchange(maxScoreData);
  function selectDataset() {
    var value = +this.value;
    if (value == 0) {
      //vtchange2(maxScoreData);
      
    } else {
      //vtchange2(avgScoreData);
    }
  }


  //function vtchange(dataset) {

    vtx.domain(maxScoreData.map(function(d) { return d.gymnast; }));
  vty.domain([0, d3.max(maxScoreData, function(d) { return d.total; })]);
  vtsvg.append("g")
      .attr("class", "vt x axis")
      .attr("transform", "translate(0," + vtheight + ")")
      .call(vtxAxis)
      .selectAll(".tick text")
      .call(wrap, vtx.bandwidth());


  vtsvg.append("g")
      .attr("class", "vt y axis")
      .call(vtyAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
      //.text("Population");
  var gymnast = vtsvg.selectAll(".gymnast")
      .data(maxScoreData)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + "0" + ",0)"; });
      //.attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; })

   height_diff = 0;  //height discrepancy when calculating h based on data vs y(d.y0) - y(d.y1)
   gymnast.selectAll("rect")
      .data(function(d) {
        return d.scores; 
      })
    .enter().append("rect")
      .attr("width", vtx.bandwidth())
      .attr("y", function(d) {
        /*height_diff = height_diff + vty(d.y0) - vty(d.y1) - (vty(0) - vty(d.value));
        y_corrected = vty(d.y1) + height_diff;
        d.y_corrected = y_corrected //store in d for later use in restorePlot()
        if (d.name === "escore2") height_diff = 0; //reset for next d.mystate
          
        return y_corrected;    */
        return vty(d.y1);  //orig, but not accurate  
      })
      .attr("x",function(d) { //add to stock code
          return vtx(d.mygymnast)
        })
      .attr("height", function(d) {       
        return vty(d.y0) - vty(d.y1); //heights calculated based on stacked values (inaccurate)
       //console.log(vty.domain())
        //console.log(vty(9));
        //return vty(0) - vty(d.value); //calculate height directly from value in csv file
      })
      .attr("class", function(d) {        
        classLabel = d.name.replace(/\s/g, ''); //remove spaces
        return "bars class" + classLabel;
      })
      .style("fill", function(d) { return vtcolor(d.name); })
      .call(vtTip);

  gymnast.selectAll("rect")
    .on("mouseover", function(d,i) { vtTip.show(d,i,this);}).on("mouseout", function() { vtTip.hide();});
      

  var vtlegend = vtsvg.selectAll(".legend")
      .data(vtcolor.domain().slice().reverse())
    .enter().append("g")
      .attr("class", function (d) {
        legendClassArray.push(d.replace(/\s/g, '')); //remove spaces
        legendClassArray_orig.push(d); //remove spaces
        return "legend";
      })
      .attr("transform", function(d, i) { return "translate("+ (-330 + i*100) +",-40)"; });

  //reverse order to match order in which bars are stacked    
  legendClassArray = legendClassArray.reverse();
  legendClassArray_orig = legendClassArray_orig.reverse();

  vtlegend.append("rect")
      .attr("x", vtwidth - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", vtcolor)
      .attr("id", function (d, i) {
        return "id" + d.replace(/\s/g, '');
      })
      .on("mouseover",function(){        

        if (active_link === "0") d3.select(this).style("cursor", "pointer");
        else {
          if (active_link.split("class").pop() === this.id.split("id").pop()) {
            d3.select(this).style("cursor", "pointer");
          } else d3.select(this).style("cursor", "auto");
        }
      })
      .on("click",function(d){        
        console.log("getting here2");
        if (active_link === "0") { //nothing selected, turn on this selection
          d3.select(this)           
            .style("stroke", "black")
            .style("stroke-width", 2);

            active_link = this.id.split("id").pop();
            plotSingle(this);

            //gray out the others
            for (i = 0; i < legendClassArray.length; i++) {
              if (legendClassArray[i] != active_link) {
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 0.5);
              } else sortBy = i; //save index for sorting in change()
            }

            //enable sort checkbox
            d3.select("#vtlabel").select("#sortvt").property("disabled", false)
            d3.select("#vtlabel").style("color", "black")
            //sort the bars if checkbox is clicked            
            d3.select("#sortvt").on("change", function() {
              changevt(maxScoreData)});  
           
        } else { //deactivate
          console.log("getting here");
          if (active_link === this.id.split("id").pop()) {//active square selected; turn it OFF
            d3.select(this)           
              .style("stroke", "none");
            
            //restore remaining boxes to normal opacity
            for (i = 0; i < legendClassArray.length; i++) {              
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 1);
            }

            
            if (d3.select("#vtlabel").select("#sortvt").property("checked")) {              
              restoreXFlag = true;
            }
            
            //disable sort checkbox
            d3.select("#vtlabel")
              .style("color", "#D8D8D8")
              .select("#sortvt")
              .property("disabled", true)
              .property("checked", false);   


            //sort bars back to original positions if necessary
            changevt(dataset);            

            //y translate selected category bars back to original y posn
            restorePlot(d);

            active_link = "0"; //reset
          }

        } //end active_link check
                          
                                
      });
   
    vtlegend.append("text")
        .attr("x", vtwidth - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    function vtchange2(dataset) {

    }
    
    // restore graph after a single selection
    function restorePlot(d) {
      //restore graph after a single selection
      d3.selectAll(".bars:not(.class" + class_keep + ")")
            .transition()
            .duration(1000)
            .delay(function() {
              if (restoreXFlag) return 3000;
              else return 750;
            })
            .attr("width", vtx.bandwidth()) //restore bar width
            .style("opacity", 1);

      //translate bars back up to original y-posn
      d3.selectAll(".class" + class_keep)
        .attr("x", function(d) { return vtx(d.mygymnast); })
        .transition()
        .duration(1000)
        .delay(function () {
          if (restoreXFlag) return 2000; //bars have to be restored to orig posn
          else return 0;
        })
        .attr("y", function(d) {
          return vty(d.y1); //not exactly correct since not based on raw data value
          //return d.y_corrected; 
        });

      //reset
      restoreXFlag = false;
      
    }

    // plot only a single legend selection
    function plotSingle(d) {
      
      class_keep = d.id.split("id").pop();
      idx = legendClassArray.indexOf(class_keep);  
      //erase all but selected bars by setting opacity to 0
      d3.selectAll(".bars:not(.class" + class_keep + ")")
            .transition()
            .duration(1000)
            .attr("width", 0) // use because svg has no zindex to hide bars so can't select visible bar underneath
            .style("opacity", 0);

      //lower the bars to start on x-axis  
      //console.log(gymnast.selectAll("rect")['_groups']);
      gymnast.selectAll("rect")['_groups'].forEach(function (d, i) {        
        //console.log("getting here");
        //get height and y posn of base bar and selected bar

        h_keep = d3.select(d[idx]).attr("height");
        y_keep = d3.select(d[idx]).attr("y");  

        h_base = d3.select(d[0]).attr("height");
        y_base = d3.select(d[0]).attr("y");    

        h_shift = h_keep - h_base;
        y_new = y_base - h_shift;
        //console.log(y_new);
        //reposition selected bars
        //console.log(d[idx]);
        d3.select(d[idx])
          .transition()
          .ease(d3.easeBounce)
          .duration(1000)
          .delay(750)
          .attr("y", y_new);

      })
     
    }

    //adapted change() fn in http://bl.ocks.org/mbostock/3885705
    function changevt(dataset) {
      //console.log(dataset);
     


    if ($('#sortvt').is(":checked")) sortDescending = true;
    else sortDescending = false;
    colName = legendClassArray_orig[sortBy];
    var colName2;
    if (colName == "dscore1") {
      colName2 = "escore1";
    } else if (colName == "dscore2") {
       colName2 = "escore2";
    } else if (colName == "escore1") {
      colName2 = "dscore1";
    } else if (colName == "escore2") {
      colName2 = "dscore2";
    }
    var x0 = vtx.domain(dataset.sort(sortDescending
        ? function(a, b) { 
          if (b[colName] - a[colName] == 0) {
            return b[colName2] - a[colName2];
          } else {
          return b[colName] - a[colName]; }}
        : function(a, b) { return b.total - a.total; })
        .map(function(d,i) { return d.gymnast; }))
        .copy();

    gymnast.selectAll(".class" + active_link)
         .sort(function(a, b) { 
            return x0(a.mygymnast) - x0(b.mygymnast); 
          });

    var transition = vtsvg.transition().duration(750),
        delay = function(d, i) { return i * 20; };

    //sort bars
    transition.selectAll(".class" + active_link)
      .delay(delay)
      .attr("x", function(d) {      
        return x0(d.mygymnast); 
      });      

    //sort x-labels accordingly    
    transition.select(".x.axis")
        .call(vtxAxis)
        .selectAll("g")
        .delay(delay);

   
    transition.select(".x.axis")
        .call(vtxAxis)
      .selectAll("g")
        .delay(delay);    
  
  }

});


function cast(d) {
  return {
    country: d.country, // convert "Year" column to Date
    gymnast: d.gymnast,
    dscore1: +d.dscore1,
    escore1: +d.escore1, // convert "Length" column to number
    nd1: +d.nd1,
    dscore2: +d.dscore2,
    escore2: +d.escore2,
    nd2: +d.nd2,
    competition: d.competition
  };
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

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

