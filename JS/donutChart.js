DonutChart = function(_parentElement){
	this.parentElement = _parentElement;
	this.visConstructor();
};

DonutChart.prototype.visConstructor = function(){
	var vis = this;
	vis.margin = { left:190, right:10, top:10, bottom:10 };
    vis.width = 800 - vis.margin.left - vis.margin.right;
    vis.height = 600 - vis.margin.top - vis.margin.bottom;
	vis.radius = 180;
   //parentElement is 'company-size'
    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
    
    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + (vis.margin.left + (vis.width / 2) - 50) + 
            ", " + (vis.margin.top + (vis.height / 2)) + ")");

	vis.pie = d3.pie()
		.value((d) => { 
            return d.count; 
        })
		.sort(null);

	vis.arc = d3.arc()
		.innerRadius(vis.radius - 40)
		.outerRadius(vis.radius);

    vis.color = d3.scaleOrdinal(d3.schemeCategory20);

    vis.addLegend();
	vis.dataProcess();
}

DonutChart.prototype.dataProcess = function(){
	var vis = this;

    //divide companies into two categories
	sizeNest = d3.nest()
		.key(function(d){
            //category1: major top six
            if(d.company == "Walt Disney" || d.company == "Warner Bros" || d.company == "Universal Pictures" ||
                d.company == "20th Century Fox" || d.company == "Columbia Pictures" || d.company == "Paramount Pictures" ){
                return "Major Film Studios";
            }
            else{ //category2: others
                return "Independent Film Studios";
            }

		})
		.entries(calls)

    vis.dataFiltered = sizeNest.map(function(size){
        // if(size.key != "others"){ // only consider  the major 6 film companies
        //     return {
        //         value: size.key,
        //         count: size.values.length
        //    }
        // }else{ 
        //     return {
        //         value: size.key,
        //         count: 0
        //    }
        // }
        return {
            value: size.key,
            count: size.values.length
        }
    })
	vis.update();
}

//update dounut 
DonutChart.prototype.update = function(){
	var vis = this;

	vis.path = vis.g.selectAll("path")
		.data(vis.pie(vis.dataFiltered));

	vis.path.attr("class", "update arc")
		.transition()
	        .duration(750)
	        .attrTween("d", arcTween);

	vis.path.enter().append("path") 
		.attr("class", "enter arc")
		.attr("fill", (d) => { 
            //if(d.data.value != "others")
            console.log(d.data)
            console.log(vis.color(d.data.value))
            return vis.color(d.data.value); })
            // .on("mouseover", tip.show)
            // .on("mouseout", tip.hide)
			.transition()
	        .duration(750)
	        .attrTween("d", arcTween);

	// Only want to attach this once!
	d3.selectAll(".enter.arc")
		.append("title")
		.text(function(d) { return d.data.count; })

	function arcTween(d) {
		var i = d3.interpolate(this._current, d);
		this._current = i(0);
		return function(t) { return vis.arc(i(t)); };
	}
}

DonutChart.prototype.addLegend = function(){
	var vis = this;

    var legend = vis.g.append("g")
        .attr("transform", "translate(" + (-50) + 
                    ", " + (-20) + ")");

    var legendArray = [
        {label: "Major", color: vis.color("Independent Film Studios")},
        {label: "Independent", color: vis.color("Major Film Studios")}
    ]

    console.log("xxxxxxxx23434");

    var legendRow = legend.selectAll(".legendRow")
        .data(legendArray)
        .enter()
            .append("g")
            .attr("class", "legendRow")
            .attr("transform", (d, i) => {
                return "translate(" + 50 + ", " + (i * 25) + ")"
            });
        
    console.log("tttxxxxxx");

    legendRow.append("rect")
        .attr("class", "legendRect")
        .attr("width", 10)
        .attr("height", 10)
        //.attr("fill", d => { return d.color; });
        .attr("fill", d => { 
            console.log(d)
            //return vis.color(d.data.value);});
            return d.color; });

    legendRow.append("text")
        .attr("class", "legendText")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .text(d => { return d.label; }); 
}