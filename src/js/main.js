require("./lib/social"); //Do not delete
var d3 = require("d3");

console.log("HELLO");

var winning_data = "assets/winning_percentage.csv";
var runs_data = "assets/runs.csv";
var batting_data = "assets/batting.csv";

// var data = csv.winning_percentage;

var margin = {top: 20, right: 30, bottom: 40, left: 40},
	width = 300 - margin.right - margin.left,
	height = 300 - margin.top - margin.bottom;

var bisectDate = d3.bisector(function(d) { return d.time; }).right;

var seasons = ["First half 2016", "Second half 2016", "First half 2017"];

var x = d3.scaleLinear().range([0, width]),
	y = d3.scaleLinear().range([height, 0]);

// define axes
var xAxis = d3.axisBottom(x);
var yAxis=  d3.axisLeft(y);

var winning_line = d3.line()
	.x(function(d) { return x(d.time); })
	.y(function(d) { return y(d.percentage); });

var winning_svg = d3.select("#winning")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(winning_data, function(data) {
	console.log(data);

	x.domain([-.3, 2.3]);
	// y.domain([.3, d3.max(data, function(d) { return d.percentage; })]);
	y.domain([.3, .65]);

	winning_svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", winning_line);

	winning_svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(2)
			.tickFormat(function(d) {
				// console.log(d);
				return seasons[d];
		}));

	winning_svg.append("g")
		.call(d3.axisLeft(y).ticks(3));

	var winning_focus = winning_svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    winning_focus.append("circle")
    	.attr("r", 4.5);

    winning_focus.append("text")
    	.attr("x", 9)
    	.attr("dy", ".35em");

    winning_svg.append("rect")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    	.attr("class", "overlay")
    	.attr("width", width - margin.left - margin.right)
    	.attr("height", height - margin.top - margin.bottom)
    	.on("mouseover", function() { winning_focus.style("display", "block"); })
    	.on("mouseout", function() { winning_focus.style("display", "none"); })
    	.on("mousemove", mousemove);

    function mousemove() {
    	var xPos = x.invert(d3.mouse(this)[0]) + .7;
    	// console.log(xPos);
    	//console.log(this);
    	var i = bisectDate(data, xPos) - 1;
    	var d = data[i];

    	console.log(d.time);

    	//if (xPos < i+1 || xPos > i-1) {
    	winning_focus.attr("transform", "translate(" + x(d.time) + "," + y(d.percentage) + ")");
    	winning_focus.select("text").text(d.percentage);
    	//}
    	// var d0 = data[i - 1];
    	// console.log(d0);
    	//var d1 = data[i];
    	//console.log(d1);
    	//d = x0 - d0.time > d1.time - x0 ? d1 : d0;
    	// focus.attr("tranform", "translate(" + x(d0.time) + "," + y(d0.percentage) + ")");
    	// focus.select("text").text(d0.percentage);
    }
});

/* RUNS PER GAME */

var runs_line = d3.line()
	.x(function(d) { return x(d.time); })
	.y(function(d) { return y(d.runs); });

var runs_svg = d3.select("#runs")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(runs_data, function(data) {
	console.log(data);

	x.domain([-.3, 2.3]);
	// y.domain([.3, d3.max(data, function(d) { return d.percentage; })]);
	y.domain([3.6, 4.8]);

	runs_svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", runs_line);

	runs_svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(3)
			.tickFormat(function(d) {
				// console.log(d);
				return seasons[d];
		}));

	runs_svg.append("g")
		.call(d3.axisLeft(y).ticks(4));

	var runs_focus = runs_svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    runs_focus.append("circle")
    	.attr("r", 4.5);

    runs_focus.append("text")
    	.attr("x", 9)
    	.attr("dy", ".35em");

    runs_svg.append("rect")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    	.attr("class", "overlay")
    	.attr("width", width - margin.left - margin.right)
    	.attr("height", height - margin.top - margin.bottom)
    	.on("mouseover", function() { runs_focus.style("display", "block"); })
    	.on("mouseout", function() { runs_focus.style("display", "none"); })
    	.on("mousemove", mousemove);

    function mousemove() {
    	var xPos = x.invert(d3.mouse(this)[0]) + .7;
    	var i = bisectDate(data, xPos) - 1;
    	var d = data[i];

    	//console.log(y(d.runs));

    	runs_focus.attr("transform", "translate(" + x(d.time) + "," + y(d.runs) + ")");
    	runs_focus.select("text").text(d.runs);

    }
});


/* BATTING AVERAGE */

var batting_line = d3.line()
	.x(function(d) { return x(d.time); })
	.y(function(d) { return y(d.avg); });

var batting_svg = d3.select("#batting")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(batting_data, function(data) {
	console.log(data);

	x.domain([-.3, 2.3]);
	// y.domain([.3, d3.max(data, function(d) { return d.percentage; })]);
	y.domain([.24, .27]);

	batting_svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", batting_line);

	batting_svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(3)
			.tickFormat(function(d) {
				// console.log(d);
				return seasons[d];
		}));

	batting_svg.append("g")
		.call(d3.axisLeft(y).ticks(4));

	var focus = batting_svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
    	.attr("r", 4.5);

    focus.append("text")
    	.attr("x", 9)
    	.attr("dy", ".35em");

    batting_svg.append("rect")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    	.attr("class", "overlay")
    	.attr("width", width - margin.left - margin.right)
    	.attr("height", height - margin.top - margin.bottom)
    	.on("mouseover", function() { focus.style("display", "block"); })
    	.on("mouseout", function() { focus.style("display", "none"); })
    	.on("mousemove", mousemove);

    function mousemove() {
    	var xPos = x.invert(d3.mouse(this)[0]) + .7;
    	// console.log(xPos);
    	//console.log(this);
    	var i = bisectDate(data, xPos) - 1;
    	var d = data[i];

    	console.log(d.time);

    	focus.attr("transform", "translate(" + x(d.time) + "," + y(d.avg) + ")");
    	focus.select("text").text(d.avg);

    }
});






