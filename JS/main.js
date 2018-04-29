//Time format set up
var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y"); 

//Data reading
d3.csv("data/movies.csv", function(data){  

    data.map(function(d){
        d.budget = +d.budget;
        d.gross = + d.gross;
        d.date = "01/01/"+d.date;
        d.date = parseTime(d.date)
        return d
    })

    allCalls = data;
    calls = data;

    donut = new DonutChart("#company-size")
    stackedArea = new StackedAreaChart("#stacked-area")
    timeline = new Timeline("#timeline")

    $("#var-select").on("change", function(){
        stackedArea.dataProcess();
    })
})

//for dragging timeline
function timeDrag() {
    var selection = d3.event.selection || timeline.x.range();
    var newValues = selection.map(timeline.x.invert)
    dateChange(newValues)
}

function dateChange(values) {
    calls = allCalls.filter(function(d){
        return ((d.date > values[0]) && (d.date < values[1]))
    })
    
    donut.dataProcess();
    stackedArea.dataProcess();
}
