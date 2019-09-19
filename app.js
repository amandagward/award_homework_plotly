// 1. Use the D3 library to read in `samples.json`.

function buildMetadata(sample) {
    // Build the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(sample){
  
      // Use d3 to select the panel with id of `#sample-metadata`
      var sample_metadata = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      sample_metadata.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(sample).forEach(function ([key, value]) {
        var row = sample_metadata.append("panel-body");
        row.text(`${key}: ${value} \n`);
      });
    });
  }
  
  function buildCharts(sample) {
  
    // Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;
    d3.json(url).then(function(data) {

// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//     * Use `sample_values` as the values for the bar chart.
//     * Use `otu_ids` as the labels for the bar chart.
//     * Use `otu_labels` as the hovertext for the chart.

      // Build a Bar Chart
      d3.json(url).then(function(data) {  
        var pie_values = data.sample_values.slice(0,10);
          var pie_labels = data.otu_ids.slice(0,10);
          var pie_hover = data.otu_labels.slice(0,10);
    
          var data = [{
            values: pie_values,
            labels: pie_labels,
            hovertext: pie_hover,
            type: 'bar'
          }];
    
          Plotly.newPlot('bar', data);

// 3. Create a bubble chart that displays each sample.
//     * Use `otu_ids` for the x values.
//     * Use `sample_values` for the y values.
//     * Use `sample_values` for the marker size.
//     * Use `otu_ids` for the marker colors.
//     * Use `otu_labels` for the text values.

      // Build a Bubble Chart using the sample data
      var x_values = data.otu_ids;
      var y_values = data.sample_values;
      var m_size = data.sample_values;
      var m_colors = data.otu_ids; 
      var t_values = data.otu_labels;
  
      var trace1 = {
        x: x_values,
        y: y_values,
        text: t_values,
        mode: 'markers',
        marker: {
          color: m_colors,
          size: m_size
        } 
      };
    
      var data = [trace1];
  
      var layout = {
        xaxis: { title: "OTU ID"},
      };
  
      Plotly.newPlot('bubble', data, layout);
    });
});   
}

// 4. Display the sample metadata, i.e., an individual's demographic information.
// 5. Display each key-value pair from the metadata JSON object somewhere on the page.
// 6. Update all of the plots any time that a new sample is selected.
// Additionally, you are welcome to create any layout that you would like for your dashboard.

  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();