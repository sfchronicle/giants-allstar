require("./lib/social"); //Do not delete
var d3 = require("d3");

console.log("HELLO");

// load data files
var winning_data = "assets/winning_percentage.csv";
var runs_data = "assets/runs.csv";
var batting_data = "assets/batting.csv";
var homeruns_data = "assets/homeruns.csv";
var ops_data = "assets/ops.csv";
var era_data = "assets/era.csv";

// lists of things to loop through
var data_ids = ['#winning', '#runs', '#batting', '#homeruns', '#ops', '#era'];
var all_data = [winning_data, runs_data, batting_data, homeruns_data, ops_data, era_data];
var y_ranges = [[.3, .65], [3.6, 4.8], [.24, .27], [.7, .9], [.65, .75], [3.5, 4.9]];

var margin = {top: 20, right: 30, bottom: 40, left: 40},
	width = 300 - margin.right - margin.left,
	height = 300 - margin.top - margin.bottom;

var bisectDate = d3.bisector(function(d) { return d.time; }).right;

// labels for x axis
var seasons = ["First half 2016", "Second half 2016", "First half 2017"];

var x = d3.scaleLinear().range([0, width]),
	y = d3.scaleLinear().range([height, 0]);

// define axes
var xAxis = d3.axisBottom(x);
var yAxis=  d3.axisLeft(y);

// do everything in here
for (var i = 0; i < all_data.length; i++) {
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

	var range = y_ranges[i];

d3.csv(data, function(data) {

	x.domain([-.3, 2.3]);
	y.domain(range);

	svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", line);

	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(2)
			.tickFormat(function(d) {
				// console.log(d);
				return seasons[d];
		}));

	svg.append("g")
		.call(d3.axisLeft(y).ticks(3));

	var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
    	.attr("r", 4.5);

    focus.append("text")
    	.attr("x", 9)
    	.attr("dy", ".35em");

    svg.append("rect")
    	.attr("transform", "translate(" + margin.left-20 + "," + margin.top + ")")
    	.attr("class", "overlay")
    	.attr("width", width)
    	.attr("height", height)
    	.on("mouseover", function() { focus.style("display", "block"); })
    	.on("mouseout", function() { focus.style("display", "none"); })
    	.on("mousemove", mousemove);

    function mousemove() {
    	var xPos = x.invert(d3.mouse(this)[0]) + .7;
    	// console.log(xPos);
    	//console.log(this);
    	var i = bisectDate(data, xPos) - 1;
    	var d = data[i];

    	// console.log(d.time);

    	//if (xPos < i+1 || xPos > i-1) {
    	focus.attr("transform", "translate(" + x(d.time) + "," + y(d.val) + ")");
    	focus.select("text").text(d.val);
    }
})

}

/* RUNS PER GAME */

// var runs_line = d3.line()
// 	.x(function(d) { return x(d.time); })
// 	.y(function(d) { return y(d.runs); });

// var runs_svg = d3.select("#runs")
// 	.append("svg")
// 	.attr("width", width + margin.left + margin.right)
// 	.attr("height", height + margin.top + margin.bottom)
// 	.append("g")
// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.csv(runs_data, function(data) {
// 	console.log(data);

// 	x.domain([-.3, 2.3]);
// 	// y.domain([.3, d3.max(data, function(d) { return d.percentage; })]);
// 	y.domain([3.6, 4.8]);

// 	runs_svg.append("path")
// 		.data([data])
// 		.attr("class", "line")
// 		.attr("d", runs_line);

// 	runs_svg.append("g")
// 		.attr("transform", "translate(0," + height + ")")
// 		.call(d3.axisBottom(x).ticks(3)
// 			.tickFormat(function(d) {
// 				// console.log(d);
// 				return seasons[d];
// 		}));

// 	runs_svg.append("g")
// 		.call(d3.axisLeft(y).ticks(4));

// 	var runs_focus = runs_svg.append("g")
//       .attr("class", "focus")
//       .style("display", "none");

//     runs_focus.append("circle")
//     	.attr("r", 4.5);

//     runs_focus.append("text")
//     	.attr("x", 9)
//     	.attr("dy", ".35em");

//     runs_svg.append("rect")
//     	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//     	.attr("class", "overlay")
//     	.attr("width", width - margin.left - margin.right)
//     	.attr("height", height - margin.top - margin.bottom)
//     	.on("mouseover", function() { runs_focus.style("display", "block"); })
//     	.on("mouseout", function() { runs_focus.style("display", "none"); })
//     	.on("mousemove", mousemove);

//     function mousemove() {
//     	var xPos = x.invert(d3.mouse(this)[0]) + .7;
//     	var i = bisectDate(data, xPos) - 1;
//     	var d = data[i];

//     	//console.log(y(d.runs));

//     	runs_focus.attr("transform", "translate(" + x(d.time) + "," + y(d.runs) + ")");
//     	runs_focus.select("text").text(d.runs);

//     }
// });


// /* BATTING AVERAGE */

// var batting_line = d3.line()
// 	.x(function(d) { return x(d.time); })
// 	.y(function(d) { return y(d.avg); });

// var batting_svg = d3.select("#batting")
// 	.append("svg")
// 	.attr("width", width + margin.left + margin.right)
// 	.attr("height", height + margin.top + margin.bottom)
// 	.append("g")
// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.csv(batting_data, function(data) {
// 	console.log(data);

// 	x.domain([-.3, 2.3]);
// 	// y.domain([.3, d3.max(data, function(d) { return d.percentage; })]);
// 	y.domain([.24, .27]);

// 	batting_svg.append("path")
// 		.data([data])
// 		.attr("class", "line")
// 		.attr("d", batting_line);

// 	batting_svg.append("g")
// 		.attr("transform", "translate(0," + height + ")")
// 		.call(d3.axisBottom(x).ticks(3)
// 			.tickFormat(function(d) {
// 				// console.log(d);
// 				return seasons[d];
// 		}));

// 	batting_svg.append("g")
// 		.call(d3.axisLeft(y).ticks(4));

// 	var batting_focus = batting_svg.append("g")
//       .attr("class", "focus")
//       .style("display", "none");

//     batting_focus.append("circle")
//     	.attr("r", 4.5);

//     batting_focus.append("text")
//     	.attr("x", 9)
//     	.attr("dy", ".35em");

//     batting_svg.append("rect")
//     	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//     	.attr("class", "overlay")
//     	.attr("width", width - margin.left - margin.right)
//     	.attr("height", height - margin.top - margin.bottom)
//     	.on("mouseover", function() { batting_focus.style("display", "block"); })
//     	.on("mouseout", function() { batting_focus.style("display", "none"); })
//     	.on("mousemove", mousemove);

//     function mousemove() {
//     	var xPos = x.invert(d3.mouse(this)[0]) + .7;
//     	// console.log(xPos);
//     	//console.log(this);
//     	var i = bisectDate(data, xPos) - 1;
//     	var d = data[i];

//     	console.log(d.time);

//     	batting_focus.attr("transform", "translate(" + x(d.time) + "," + y(d.avg) + ")");
//     	batting_focus.select("text").text(d.avg);

//     }
// });

