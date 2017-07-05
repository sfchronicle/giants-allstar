require("./lib/social"); //Do not delete
var d3 = require("d3");

console.log("HELLO");

// var data = csv.winning_percentage;

var margin = {top: 20, right: 30, bottom: 40, left: 30},
	width = 400 - margin.right - margin.left,
	height = 400 - margin.top - margin.bottom;

var bisectDate = d3.bisector(function(d) { return d.time; }).right;

var seasons = ["First half 2016", "Second half 2016", "First half 2017"];

var x = d3.scaleLinear().range([0, width]),
	y = d3.scaleLinear().range([height, 0]);

// define axes
var xAxis = d3.axisBottom(x);
var yAxis=  d3.axisLeft(y);

var line = d3.line()
	.x(function(d) { return x(d.time); })
	.y(function(d) { return y(d.percentage); });

var svg = d3.select("#chart")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = "assets/winning_percentage.csv";
d3.csv(data, function(data) {
	console.log(data);

	x.domain([-.3, 2.3]);
	// y.domain([.3, d3.max(data, function(d) { return d.percentage; })]);
	y.domain([.3, .65]);

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

    	//if (xPos < i+1 || xPos > i-1) {
    	focus.attr("tranform", "translate(" + x(d.time) + "," + y(d.percentage) + ")");
    	focus.select("text").text(d.percentage);
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







