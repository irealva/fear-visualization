/**
 * app.js
 *
 * Application to render a Highchart showing the number of occurrences of the 
 * term "Venezuela" in the New York Times headlines.
 * @author: Irene Alvarado reusing some demo code on the highcharts website
 */

render() ;


/**
 * Function to render a Highchart based on data pulled from 
 * articlesByYear.csv
 */
function render() {
	$.get('data/articlesByYear.csv', function(csv) {
        $('#container').highcharts({

            data: {
                csv: csv
            },
            chart: {
                type: 'line'
            },
            title: {
                text: 'Occurrences of the term "Venezuela" in the New York Times Headlines'
            },
            subtitle: {
                text: '1954-2014<br><br>(Click on a year to see article details)'
            },
            xAxis: {
                type:'date'
            },
            yAxis: {
                title: {
                    text: 'Occurrences'
                },
                min:0
            },
            legend: {
                enabled:false
            },
            tooltip: { // what shows up when user hovers mouse over a point on the chart
            formatter:function() {
                    return '<b>'+this.y+' matches in '+this.x+'</b>';
                }
            },
            plotOptions: { // what happens when a user clicks on a point on the chart
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) { //function will render a table with the list of articles for a specific year
                                var clickedYear = this.x ;   

                                $("#chartHeader").replaceWith("<div id='chartHeader'><h4>Articles for "+clickedYear+":</h4></div>") ; //appends a coun
                                
                                d3.select("table").remove(); //removes the previous year clicked table

                                d3.csv("data/venezuelaArticles.csv", function(data) {
                                    // columns to display
                                    var columns = ["Publication Date", "Headline", "Snippet", "Section Name", "Type of Material"];

                                    var table = d3.select("#chartData").append("table"),
                                        thead = table.append("thead"),
                                        tbody = table.append("tbody");
                                        
                                    // append header row
                                    thead.append("tr")
                                        .selectAll("th")
                                        .data(columns)
                                        .enter()
                                        .append("th")
                                            .text(function(column) { return column; });

                                    // create a row for each object in the data
                                    var rows = tbody.selectAll("tr")
                                        .data(data)
                                        .enter()
                                        .append("tr")
                                        .filter(function(d){return d.Year==clickedYear}); // filter all the data by year clicked

                                            
                                    // create a cell in each row for each column
                                    var cells = rows.selectAll("td")
                                        .data(function(row) {
                                            return columns.map(function(column) {
                                                return {column: column, value: row[column]};
                                            });
                                        })
                                        .enter()
                                        .append("td")
                                            .text(function(d) { return d.value; });
                                });
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
            },
        });
    });
	
}