const $ = require("jquery");
const d3 = require("d3");


const heatMapColors = ["#ff00ff","#ff0000","#ffff00","#fff000","#ff00ff","#0000ff"];



export function transformCoords(tiles, imageWidth) {
  coordinates = new Array(tiles.length);
  scaleFactor = 1 / imageWidth;
  $.each(tiles, function (index, tile) {
    var tileCoords = new Array();
    $.each(tile.geometry.coordinates, function (junk, coords) {
      x = coords[0] * scaleFactor;
      y = coords[1] * scaleFactor;
      tileCoords.push(x + "," + y);
    });

    index = parseInt(tile.properties.labelindex);
    index = index > tiles.length ? 0 : index;

    coordinates[index] = {
      index: index,
      coords: tileCoords.join(" "),
    };
  });

  return coordinates;
}

export function addOverlay(tiles) {
  $.each(tiles, function (index, tile) {
    var fillColor = d3.schemeCategory10[tile.index % 20];
    d3.select(viewer.svgOverlay().node())
      .append("polygon")
      .attr("points", tile.coords)
      .style("fill", "blue")
      .attr("opacity", 0.0)
      .attr("class", "boundaryClass")
      .attr("id", "boundaryLI" + tile.index)
      .attr("stroke", "blue")
      .attr("stroke-width", 0.001);
  });
}

export function generateRaterAgreements(tiles, allRaterData) {
  /* This will take the data for all the raters and generate an overlay... need to figure out if I can generate one shape
  and then filter that.. instead of drawing 5 shapes*/
  console.log(allRaterData)

  /* The max number of raters is 5--- probably should compute this though instead of just hard coding it  */
  // allRaterData.forE

  var spxMarkupCountDict = allRaterData; 

  var spxMarkupMap = {};


  $.each(spxMarkupCountDict, function (spxId, raterCount) {
    
    (!spxMarkupMap.hasOwnProperty(raterCount)) ? (spxMarkupMap[raterCount] = [spxId]) :  (spxMarkupMap[raterCount].push(spxId));

  })

/* I now have a diciontary where the keys are the number of people who observed the feature at the coordinate, and the value are the coordinates */
  $.each(spxMarkupMap, function (raterCount, spxList) {
    addRaterOverlay(
      tiles,
      spxList,
      heatMapColors[raterCount],
      "twoRaters multiRater raterClass" + " raterCount"+raterCount
    );
      //Probably want to add it twice.. one without the fill.. one with???

  })
  

  // tileInfo.addRaterOverlay(
  //   state.curImgTileData,
  //   twoRaters,
  //   "#ffff00",
  //   "twoRaters multiRater raterClass"
  // );


  // for (rtr in state.curImageMetaData.markupData[id]) {
  

  //   //    update the data table to show the count for the currently displayed feature
  //   $$("raterInfoDataTable").updateItem(raterDataDict[rtr].id, {
  //     raterTotalFeaturesSeen:
  //       state.curImageMetaData.markupData[id][rtr].length,
  //   });

  
}

export function addRaterOverlay(tiles, spxIdsToLabel, raterColor, className) {
  var fillColor = raterColor;
  var spxIntIds = spxIdsToLabel.map(Number);

  //console.log(tiles,spxIdsToLabel,raterColor,className)
  var overlay = $$("slide_viewer").viewer.svgOverlay();
  var mrOpacity = $$("multirater_opacity_slider").getValue();

  $.each(tiles, function (index, tile) {
    if (spxIntIds.includes(parseInt(tile.properties.labelindex))) {
      d3.select(overlay.node())
        .append("polygon")
        .attr("points", tile.geometry.coordinates)
        .style("fill", fillColor) //was fillColor
        .attr("opacity", mrOpacity)
        .attr("fill-opacity", mrOpacity/2)
        .attr("class", "raterClass" + " " + className) //add multiple classes in a single call
        .attr("id", "raterLI" + tile.properties.labelindex)
        .attr("stroke", fillColor)
        .attr("stroke-width", 1);
    }
  });
}

function removeOverlay() {
  $(".boundaryClass").remove();
  $(".multiRater").remove();
  $(".raterClass").remove();
}

export function updateOverlay(className, attributes, styles) {
  $.each(attributes, function (attribute, value) {
    $("." + className).attr(attribute, value);
  });

  $.each(styles, function (style, value) {
    $("." + className).css(style, value);
  });
}

export function addRectangle(svgNode) {
  var rectangle = d3
    .select(svgNode)
    .append("rect")
    .attr("x", 0.1)
    .attr("y", 0.1)
    .attr("width", 0.2)
    .attr("height", 0.4)
    .style("fill", "blue")
    .attr("opacity", 0.2);
}
