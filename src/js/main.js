require("./lib/social"); //Do not delete
var d3 = require("d3");

function miniLineCharts() {
// lists of things to loop through
var data_ids = ['#chart0', '#chart1', '#chart2', '#chart3', '#chart4', '#chart5'];
var all_data = [winningData, runsData, battingData, homerunsData, opsData, eraData];
var y_ranges = [[.3, .65], [3.6, 4.8], [.24, .27], [.7, .9], [.65, .75], [3.5, 4.9]];
var y_axis_labels = ["Winning percentage (wins per game)", "Runs per game", "Batting average", "Home runs per game", "OPS (on-base plus slugging)", "ERA (earned run average)"];

var margin = {top: 20, right: 30, bottom: 40, left: 55},
	width = 400 - margin.right - margin.left,
	height = 300 - margin.top - margin.bottom;


// labels for x axis
var seasons = ["First half 2016", "Second half 2016", "First half 2017"];

var i = 0;

// do everything in here
for (var i = 0; i < all_data.length; i++) {
	var x = d3.scaleLinear().range([0, width]),
		y = d3.scaleLinear().range([height, 0]);

	// define axes
	var xAxis = d3.axisBottom(x);
	var yAxis=  d3.axisLeft(y);

	var bisectDate = d3.bisector(function(d) { return d.time; }).right;
	var data = all_data[i];

	var line = d3.line()
		.x(function(d) { return x(d.time); })
		.y(function(d) { return y(d.val); });

	var svg = d3.select(data_ids[i])
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set range for each chart
	var range = y_ranges[i];
	x.domain([-.3, 2.3]);
	y.domain(range);

	svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", line);

    // draw x axis
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(2)
			.tickFormat(function(d) {
				// console.log(d);
				return seasons[d];
		}));

	// text label for the x axis
  	svg.append("text")
  	.attr("class", "axis-label")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Season");

    // draw y axis
	svg.append("g")
		.call(d3.axisLeft(y).ticks(3));

  	// text label for the y axis
  	svg.append("text")
  		.attr("class", "axis-label")
      	.attr("transform", "rotate(-90)")
      	.attr("y", -55)
      	.attr("x",0 - (height / 2))
      	.attr("dy", "1em")
      	.style("text-anchor", "middle")
      	.text(y_axis_labels[i]);

	var thisFocus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    thisFocus.append("circle")
    	.attr("r", 4.5);

    thisFocus.append("text")
    	.attr("x", 9)
    	.attr("dy", ".35em");

    svg.selectAll("rect")
    	.data(all_data[i])
    	.enter()
    	.append("rect")
    	.attr("transform", "translate(" + margin.left-20 + "," + margin.top + ")")
    	.attr("class", "overlay")
    	.attr("width", width)
    	.attr("height", height)
    	.on("mouseover", function(d) {
    	    var thisFocus = this.parentNode.getElementsByClassName("focus")[0];
    		var thisFocus = d3.select(thisFocus);
    		thisFocus.style("display", "block");
    	})
    	.on("mouseout", function() {
    		var thisFocus = this.parentNode.getElementsByClassName("focus")[0];
    		var thisFocus = d3.select(thisFocus);
    		thisFocus.style("display", "none"); })
    	.on("mousemove", function(d) {
            // update y-range
            var currID = this.parentNode.parentNode.parentNode.getAttribute('id');
    		var i = currID[5];
            var range = y_ranges[i];
            y.domain(range);

            // get correct data for current mouse location
    		var fullData = d3.selectAll("rect").data();
    		var indexOfLast = d3.selectAll("rect").data().indexOf(d);
    		var currData = [];
    		currData.push(fullData[indexOfLast-2]);
    		currData.push(fullData[indexOfLast-1]);
    		currData.push(fullData[indexOfLast]);

    		var xPos = x.invert(d3.mouse(this)[0]) + .7;
    		var _index = bisectDate(currData, xPos) - 1;
    		var _d = currData[_index];

    		var thisFocus = this.parentNode.getElementsByClassName("focus")[0];
    		var thisFocus = d3.select(thisFocus);
    		thisFocus.attr("transform", "translate(" + x(_d.time) + "," + y(_d.val) + ")");
    		thisFocus.select("text").text(_d.val);
    	});
}

}

miniLineCharts();

/* -----------------------------------------------------------*/

//console.log(allTeamsData);

var teams = ["Giants", "Braves", "Marlins", "Mets", "Phillies", "Nationals", "Dodgers", "Rockies", "Dbacks", "Padres", "Reds", "Brewers",
"Pirates", "Cardinals", "Cubs"];

//var teams = {"Giants": "NL West", "Braves": "NL East", "Marlins": "NL East", "Mets": "NL East", "Phillies": "NL East", "Nationals": "NL East", "Dodgers": "NL West", "Rockies": "NL West", "Dbacks": "NL West", "Padres": "NL West", "Reds": "NL Central", "Brewers": "NL Central",
//"Pirates": "NL Central", "Cardinals": "NL Central", "Cubs": "NL Central", "Orioles": "AL East", "Red Sox": "AL East", "Yankees": "AL East", "Rays": "AL East", "Blue Jays": "AL East", };

var margin = {top: 20, right: 20, bottom: 40, left: 50},
    width = 960 - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);



var svg = d3.select("#multiline-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// allTeamsData.forEach(function(d) {
//     console.log(d);
// });

x.domain([0, 167]);
// x.domain(d3.extent(allTeamsData, function(d) { return d.Count; }));
y.domain([-40, 35]);

// svg.append("path")
//     .data([allTeamsData])
//     .attr("class", "line")
//     .attr("d", line);

var teamLabel = svg.append("g")
      .attr("class", "label")
      .style("display", "none");

teamLabel.append("text")
        .attr("x", 200)
        .attr("dy", ".35em");

// var line = d3.line()
//     .curve(d3.curveBasis)
//     .x(function(d) { return x(d.Count); })
//     .y(function(d) {
//         //console.log(d.Giants);
//         return y(d.team); });

// var teams = allTeamsData;
console.log(allTeamsData);

var flatTeamData;

for (var i = 0; i < teams.length; i++) {

    var team = teams[i];

		var teamData = allTeamsData[team];
		flatTeamData = [];
		for (var idx=1; idx<167; idx++){
		  flatTeamData.push(
		    {date: idx, standing: teamData[idx]}
		  );
		};
		console.log(flatTeamData);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) {
					console.log(d);
					// console.log(d.date);
					return x(d.date);
					// return x(d.Count);
				})
        .y(function(d) {
          //console.log(d.Giants);
						// console.log(d.standing);
          	return y(d.standing);
					});

    svg.append("path")
    	.data([flatTeamData])
			.attr("class","line")
			.attr("id",team)
			.attr("d", line)
			.on("mouseover",function(d) {
				console.log(this.getAttribute('id'));
			})
    // .attr("class", function(d) {
				// console.log(d);
        // if (teams[i] == "Giants") {
        //     return "line";
        // } else {
        //     return "_line";
        // }
    // })
    // .attr("id", function(d) {
		// 		console.log(d);
    //     return team;
    // })
    //.attr("class", "_line" + " " + teams[i])
    // .on("mouseover", function(d) {
    //     //console.log(this.getAttribute('id'));
    //     console.log(d);
    //     var thisLabel = this.parentNode.getElementsByClassName("label")[0];
    //     var thisLabel = d3.select(thisLabel);
    //         thisLabel.select("text").text(this.getAttribute('id'));
    // })


}

    // text label for the x axis
    svg.append("text")
    .attr("class", "bigger-axis-label")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top +25) + ")")
      .style("text-anchor", "middle")
      .text("Date");

    svg.append("text")
        .attr("class", "bigger-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -55)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Score");

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));



svg.append("g")
//.attr("transform", "translate(0," + width + ")")
    .call(d3.axisLeft(y).ticks(10));
