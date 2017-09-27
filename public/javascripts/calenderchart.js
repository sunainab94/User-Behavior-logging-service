

    var width = 960,

        height = 136;
    //var cellSize = 17; // cell size
    var cellSize = Math.floor((width - 50) / 52);
    console.log("cellSize=", cellSize);
    var legendElementWidth = Math.round(cellSize * 4);
    var legendSvgHeight = 43;

    //var colors =  ['rgb(255,255,217)','rgb(253,224,221)','rgb(252,197,192)','rgb(250,159,181)','rgb(247,104,161)','rgb(221,52,151)','rgb(174,1,126)','rgb(122,1,119)','rgb(73,0,106)'];
    var colors = ["#ffffd9", "#cff9bd", "#a7eec4", "#97d4dd", "#8c96c6", "#4a34c7", "#4b25b9", "#5b056d", "#4d004b"];

    var day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        year = d3.time.format("%Y"),
        valueFormat = d3.format("0.1f"),
        format = d3.time.format("%d/%m/%Y");
    //format = d3.time.format("%x");

    var theData = JSON.parse(document.getElementById('calenderData').innerHTML);
    console.log(theData);

    // interestingly, the only place theData is used is 
    // to create the scale
    console.log("min=", d3.min(d3.values(theData)));
    var colorScale = d3.scale.quantize()
        //.domain([-.05, .05])
        .domain([d3.min(d3.values(theData)), d3.max(d3.values(theData))])
        //.range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
        .range(colors);

    // a *separate* svg for each year.
    // note: data is simply an array of years, going 1 past the max desired year
    var svg = d3.select("#heatMap").selectAll("svg")
        .data(d3.range(2017, 2018))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        //.attr("class", "RdYlGn")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function (d) { return d; });

    var rect = svg.selectAll(".day")
        .data(function (d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (d) { return week(d) * cellSize; })
        .attr("y", function (d) { return day(d) * cellSize; })
        .datum(format);

    rect.append("title")
        .text(function (d) { return d; });

    svg.selectAll(".month")
        .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);

    rect.filter(function (d) { return d in theData; })
        //.attr("class", function(d) { return "day " + color(theData[d]); })
        .style("fill", function (d) { return colorScale(theData[d]); })
        .select("title")
        .text(function (d) { return d + " : " + valueFormat(theData[d]); });
    //});

    var legendSvg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", legendSvgHeight)
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    var legend = legendSvg.selectAll(".legend")
        .data(colors.map(function (y) { return colorScale.invertExtent(y)[0]; }))
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", function (d, i) { return legendElementWidth * i; })
        //.attr("y", height)
        .attr("y", 0)
        .attr("width", legendElementWidth)
        .attr("height", cellSize * 2)
        .style("fill", function (d, i) { return colors[i]; });

    legend.append("text")
        .attr("class", "mono")
        // \u2265 is for >= as one char
        .text(function (d) { return "\u2265" + d.toFixed(1); })
        .attr("x", function (d, i) { return legendElementWidth * i + 5; })
        .attr("y", cellSize + 1);

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0),
            w0 = +week(t0),
            d1 = +day(t1),
            w1 = +week(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
            + "H" + w0 * cellSize + "V" + 7 * cellSize
            + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
            + "H" + (w1 + 1) * cellSize + "V" + 0
            + "H" + (w0 + 1) * cellSize + "Z";
    }

    d3.select(self.frameElement).style("height", "2910px");