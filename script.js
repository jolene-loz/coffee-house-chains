//Chart init
const margin = {top: 40, right: 20, bottom: 20, left: 60}
const width = 1000 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// === Scales without domains === 
const xScale = d3.scaleBand()
                .rangeRound([0, width])
                .paddingInner(0.1);
const yScale = d3.scaleLinear()
                .range([height, 0]);

// ==== Initialize Axes & title containers === 
const xAxis = d3
    .axisBottom()
    .scale(xScale)

const yAxis = d3
    .axisLeft()
    .scale(yScale)

// === Initialize SVG axes groups here === 
svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(" + 0 + ", " + height + ")");

svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + -5 + ", 0 )");

let type = document.querySelector("#group-by").value;
//state is off right now
let state = false;

// === Initialize data ===
let data = null

//===  Call the data ===  
d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
    update(data, type)
    document.querySelector("#sort")
        .addEventListener('click', (event) => {
            if (state == false){
                state = true;
            } else {
                state = false;
            }
            update(data, type)
        })
    document.querySelector("#group-by").addEventListener('change', (event) => {
        update(data, event.target.value)})
    console.log(data)
})


drawAxes();


// CHART UPDATE ------------------------------   
function update(data, type){
type = document.querySelector("#group-by").value
if (state == false){
    data = data.sort((a, b)=>b[type] - a[type]);
    }
else {
    data = data.sort((a, b)=>a[type] - b[type]);
}

xScale.domain(data.map(d => d.company))
yScale.domain([0, d3.max(data,d=>d[type])])
const bars = svg.selectAll('rect')
                .data(data, d => {
                return d.company;
            });
bars
    .enter()
    .append('rect')
    .merge(bars)
    .style('opacity', 0.7)
    .transition()
    .duration(1000) 
    .attr('x', d => xScale(d.company))
    .attr('width', xScale.bandwidth())
    .attr('y', d => yScale(d[type]))
    .attr('height', d=> height - yScale(d[type]))
    .attr('fill', '#6f4e37')
    .attr('stroke', 'black')
   
//Exit
bars.exit()
    .remove();
svg.exit()
    .remove();
    //Draw the Axes
    drawAxes();
}

function drawAxes(){
    svg.select('.x-axis')
     .transition()
     .duration(1000) 
     .call(xAxis)
    svg.select('.y-axis')
        .transition()
        .duration(500)
        .transition()
        .duration(500)
        .style("opacity", 1)
        .call(yAxis)

    type = document.querySelector("#group-by").value
    console.log(type)

    if (type === "stores"){
        svg.select('.axis-title')
        .text('Stores')
    } else {
        svg.select('.axis-title')
        .text('Billion USD')
    }

    svg.append("text")
        .transition()
        .duration(250)
        .attr('class', 'axis-title')
        .attr('x', 5)
        .attr('y', -10)
        .attr("font-size", "14px")

    
}