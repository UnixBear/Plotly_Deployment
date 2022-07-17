function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // +
    // 5. Create a variable that holds the first sample in the array.
    var specificSample = samples.filter(sampleObj => sampleObj.id == sample)[0];;


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleOtuIds = specificSample.otu_ids;
    var sampleOtuLabels = specificSample.otu_labels;
    var sampleValues = specificSample.sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    var yticks = sampleOtuIds
      .slice(0,10)
      .map((outID => ` OTU ${outID} `))
      .reverse();
    console.log(yticks)
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: sampleOtuLabels.slice(0, 10).reverse(),
      marker: {
        color: [
          'rgb(36, 84, 164)',
          'rgb(113, 83, 172)',
          'rgb(169, 77, 167)',
          'rgb(215, 72, 150)',
          'rgb(248, 77, 123)',
          'rgb(248, 77, 123)',
          'rgb(255, 99, 92)',
          'rgb(255, 131, 57)',
          'rgb(255, 141, 45)',
          'rgb(255, 166, 0)',
        ],
      },
      type: 'bar',
      orientation: 'h',
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {
        text: 'Top 10 Bacteria Cultures Found',
        font: { size: 24, color: 'rgb(33, 37, 41)' },
      },
      paper_bgcolor: 'rgb(204, 205, 216, 1)',
      plot_bgcolor: 'rgb(204, 205, 216, 1)',
      autosize: true,
      height: 400,
      xaxis: { automargin: true },
      yaxis: { automargin: true },
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
  });
}
