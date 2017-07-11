require("./lib/social"); //Do not delete
var d3 = require("d3");

function miniLineCharts() {
// lists of things to loop through
var data_ids = ['#chart0', '#chart1', '#chart2', '#chart3', '#chart4', '#chart5'];
var all_data = [winningData, runsData, battingData, homerunsData, opsData, eraData];
var y_ranges = [[.3, .65], [3.6, 4.8], [.24, .27], [.7, .9], [.65, .75], [3.5, 4.9]];
var y_axis_labels = ["Winning percentage (wins per game)", "Runs per game", "Batting average", "Home runs per game", "OPS (on-base plus slugging)", "ERA (earned run average)"];

if (screen.width <= 780) {
    var margin = {top: 20, right: 30, bottom: 40, left: 55},
       width = 320 - margin.right - margin.left,
       height = 300 - margin.top - margin.bottom;
} else {
    var margin = {top: 20, right: 30, bottom: 40, left: 55},
	   width = 360 - margin.right - margin.left,
	   height = 300 - margin.top - margin.bottom;
}


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

function multiLineChart() {

var teams = ["Giants", "Giants_last", "Braves", "Marlins", "Mets", "Phillies", "Nationals", "Dodgers", "Rockies", "D'backs", "Padres", "Reds", "Brewers",
"Pirates", "Cardinals", "Cubs", "Orioles", "Red Sox", "Yankees", "Rays", "Blue Jays", "White Sox", "Indians", "Tigers", "Royals", "Twins", "A's", "Astros", "Angels", "Mariners", "Rangers"];
var teams_sanitized = ["Giants", "Giants_last", "Braves", "Marlins", "Mets", "Phillies", "Nationals", "Dodgers", "Rockies", "Dbacks", "Padres", "Reds", "Brewers",
"Pirates", "Cardinals", "Cubs", "Orioles", "RedSox", "Yankees", "Rays", "BlueJays", "WhiteSox", "Indians", "Tigers", "Royals", "Twins", "As", "Astros", "Angels", "Mariners", "Rangers"];
var records = {"Giants": "64-98", "Giants_last": ["Where the Giants stood", "after 2016's break, at +24"], "Braves": "79-80", "Marlins": "73-87", "Mets": "79-81", "Phillies":"58-101", "Nationals": "93-67", "Dodgers": "101-60", "Rockies":"87-78", "D'backs":"84-77", "Padres":"68-93", "Reds":"75-86", "Brewers":"85-81",
"Pirates":"74-87", "Cardinals":"83-79", "Cubs":"93-68", "Orioles":"80-83", "Red Sox":"94-70", "Yankees":"85-75", "Rays":"81-83", "Blue Jays":"79-80", "White Sox":"71-90", "Indians":"89-71", "Tigers":"79-80", "Royals":"80-81", "Twins":"72-90", "A's":"70-92", "Astros":"96-66", "Angels":"82-83", "Mariners":"84-79", "Rangers":"84-76"};

//var teams = {"Giants": "NL West", "Braves": "NL East", "Marlins": "NL East", "Mets": "NL East", "Phillies": "NL East", "Nationals": "NL East", "Dodgers": "NL West", "Rockies": "NL West", "Dbacks": "NL West", "Padres": "NL West", "Reds": "NL Central", "Brewers": "NL Central",
//"Pirates": "NL Central", "Cardinals": "NL Central", "Cubs": "NL Central", "Orioles": "AL East", "Red Sox": "AL East", "Yankees": "AL East", "Rays": "AL East", "Blue Jays": "AL East", };

// var margin = {top: 20, right: 65, bottom: 40, left: 50},
//     width = 960 - margin.right - margin.left,
//     height = 600 - margin.top - margin.bottom;

if (screen.width <= 350) {
    var margin = {top: 15, right: 150, bottom: 40, left: 0},
    width = 380 - margin.right - margin.left,
    height = 300 - margin.top - margin.bottom;
} else if (screen.width <= 480) {
    var margin = {top: 15, right: 150, bottom: 40, left: 0},
    width = 420 - margin.right - margin.left,
    height = 300 - margin.top - margin.bottom;
} else if (screen.width <= 780) {
    console.log(screen.width);
    var margin = {top: 20, right: 160, bottom: 40, left: 0},
    width = 750 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;
} else if (screen.width >= 780) {
    var margin = {top: 20, right: 170, bottom: 40, left: 0},
    width = 1060 - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;
}

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x);
    var yAxis=  d3.axisLeft(y);

var svg = d3.select("#multiline-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ",0)");

// allTeamsData.forEach(function(d) {
//     console.log(d);
// });

x.domain([0, 180]);
// x.domain(d3.extent(allTeamsData, function(d) { return d.Count; }));
y.domain([-49, 45]);

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



// var teams = allTeamsData;
console.log(allTeamsData);

var flatTeamData;
var flatTeamDataNested;

for (var i = 0; i < teams.length; i++) {

    var team = teams[i];
    var team_sanitized = teams_sanitized[i];

		var teamData = allTeamsData[team];
		flatTeamData = [];
        flatTeamDataNested = [];
   
		for (var idx=1; idx<180; idx++){
		  flatTeamData.push(
		    {date: idx, standing: teamData[idx]}
		  );
		};

        // flatTeamData.push(
        //     {team: team, scores: flatTeamDataNested}
        // );

		//console.log(flatTeamData);


    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.standing); })

    svg.append("path")
    	.data([flatTeamData])
			.attr("class", function(d) {
                if (teams[i] == "Giants") {
                    return "line";
                } else {
                    return "_line";
                }
            })
            .attr("transform", "translate(55,0)")
			.attr("id",team_sanitized)
			.attr("d", line)
			.on("mouseover",function(d) {

				console.log(this.getAttribute('id'));

				var id = this.getAttribute('id');
                d3.select("._"+id).classed("show", true);

                if (id != "Giants") {
                    d3.select(this).classed("moused", true);

                } else {
                    d3.select(this).classed("giants-moused", true);
                }
                
			})
            .on("mouseout", function(d) {
                var id = this.getAttribute('id');
                d3.select("._"+id).classed("show", false);

                if (id != "Giants") {
                    d3.select(this).classed("moused", false);
                } else {
                    d3.select(this).classed("giants-moused", false);
                }
            })

        // svg.append("path")
    //     .data([flatTeamData])
    //         .attr("class", "invisible-line")
    //         .attr("id",team_sanitized)
    //         .attr("d", line)
    //         .on("mouseover",function(d) {
    //             //console.log(this);
    //             d3.select(this).classed("moused", true);
    //             var id = this.getAttribute('id');
    //             console.log(id);
    //             console.log(records[id]);
                
    //         })
    //         .on("mouseout", function(d) {
    //             d3.select(this).classed("moused", false);
    //         })

    svg.append("text")
        .data([flatTeamData])
        .attr("id",team_sanitized)
        .attr("transform", function(d) {
            //console.log(d);
            if (screen.width >= 480) {
                var x_posn = x(d[d.length - 1].date);
                var y_posn = y(d[d.length - 1].standing);
                return "translate(" + x_posn + "," + y_posn + ")";
            } else {
                console.log(this.getAttribute('id'));
                if (this.getAttribute('id') == 'Giants') {
                    return "translate(10, 165)";
                } else {
                    return "translate(" + ((width/2)-45) + "," + (height-20) + ")";
                }
            }
        })
        .attr("x", 60)
        .attr("y", ".35em")
        .attr("class", function(d) {
            var id = this.getAttribute('id');
            if (id == 'Giants') {
                return ("_" + id);
            } else {
                return ("_" + id + " label");
            }
        })
        .text(function(d) {
            if (team != "Giants_last") {
                return team + ", " + records[team];
            }
        })


}

    for (var j = 0; j < records["Giants_last"].length; j++) {
        svg.append("text")
            .attr("transform", function(d) {
                if (screen.width >= 480) {
                    return "translate(" + x(8) + "," + y(28) + ")";
                } else {
                    return "translate(10, 40)";
                }
            })
            .attr("x", 60)
            .attr("y", (1.45*j - 1).toString() + "em")
            .attr("id", "Giants_last")
            .attr("class", "_Giants_last")
            .text(records["Giants_last"][j]);
        }

    // text label for the x axis
    svg.append("text")
    .attr("class", "bigger-axis-label")
      .attr("transform",
            "translate(" + (width/2 + 55) + " ," +
                           (height + margin.top +25) + ")")
      .style("text-anchor", "middle")
      .text("Number of games");

    svg.append("text")
        .attr("class", "bigger-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Games above or below .500");

svg.append("g")
    .attr("transform", "translate(55," + height + ")")
    .call(d3.axisBottom(x).ticks(6).tickFormat(function(d) {
        var mapper = {
            0: "Last year's break",
            60: 60,
            120: 120,
            180: "This year's break"

        }
        return mapper[d];
    }));



svg.append("g")
.attr("transform", "translate(55,0)")
    .call(d3.axisLeft(y).ticks(10));

}

multiLineChart();
