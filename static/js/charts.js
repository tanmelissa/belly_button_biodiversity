function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./static/json/samples.json").then((data) => {
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
  d3.json("./static/json/samples.json").then((data) => {
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
  d3.json("./static/json/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data["samples"];
    console.log("samples: " + samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleData = samples.filter(sampleObj => sampleObj["id"] == sample);
    console.log("sampleData: " + sampleData);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleData[0];
    console.log("firstSample: " + firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample["otu_ids"];
    var otuLabels = firstSample["otu_labels"];
    var sampleValues = firstSample["sample_values"];

    console.log("otuIds: " + otuIds);
    console.log("otuLabels: " + otuLabels);
    console.log("sampleValues: " + sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(label => "OTU " + label).slice(0,10).reverse();

    var xticks = sampleValues.map(val => parseInt(val)).slice(0,10).reverse();

    var hoverText = otuLabels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: hoverText,
      marker: {
        color: 'rgb(65,105,225)'
      }
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Sample Values"}
    };
     //10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: [[0, 'rgb(135,206,250)'], [1, 'rgb(0,0,139)']]
      }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacertia Cultures Per Sample",
      showlegend: false,
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data["metadata"];

    var gaugeMetadata = metadata.filter(sampleObj => sampleObj["id"] == sample);

    console.log("gaugeMetadata: " + gaugeMetadata)

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstGauge = metadata[0]

    console.log("firstGauge: " + firstGauge)

    // 3. Create a variable that holds the washing frequency.
    var washFreq = gaugeMetadata[0]["wfreq"];

    console.log("washFreq: " + washFreq)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0,1], y: [0,1]},
     value: washFreq,
     type: "indicator",
     mode: "gauge+number",
     delta: {reference: 5},
     title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week"},
     gauge: {
      axis: {range: [null, 10]},
      bar: {color: "lightsteelblue"},
      steps: [
        {range: [0, 2], color: "aliceblue"},
        {range: [2, 4], color: "cornflowerblue"},
        {range: [4,6], color:"royalblue"},
        {range: [6,8], color: "navy"},
        {range: [8,10], color: "darkslateblue"}
      ]
     }
   }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: {t: 0, b: 0}
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

