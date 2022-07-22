d3.json("./static/json/samples.json").then(function(data){
    console.log(data);
});

d3.json("./static/json/samples.json").then(function(data){
    firstPerson = data.metadata[0];
    Object.entries(firstPerson).forEach(([key, value]) =>
    {console.log(key +': ' + value);});
});


function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("./static/json/samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })};
  
  init();

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  };

  function buildMetadata(sample) {
    d3.json("./static/json/samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
      PANEL.append("h6").text("GENDER: " + result.gender);
      PANEL.append("h6").text("AGE: " + result.age);
      PANEL.append("h6").text("LOCATION: " + result.location);
      PANEL.append("h6").text("BBTYPE: " + result.bbtype);
      PANEL.append("h6").text("WFREQ: " + result.wfreq);
    });
  };

  function updatePlotly() {
    var dropdownMenu = d3.select("#dropdownMenu");
    var dataset = dropdownMenu.property("value");
  
    var xData = [1, 2, 3, 4, 5];
    var yData = [];
  
    if (dataset === 'dataset1') {
      yData = [1, 2, 4, 8, 16];
    };
  
    if (dataset === 'dataset2') {
      yData = [1, 10, 100, 1000, 10000];
    };
  
    var trace = {
      x: [xData],
      y: [yData],
    };
  
    Plotly.restyle("plot", trace);
  };