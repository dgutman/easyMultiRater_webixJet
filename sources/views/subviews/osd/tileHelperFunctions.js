const $ = require("jquery");
const d3 = require("d3");

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
      .attr("opacity", 0.2)
      .attr("class", "boundaryClass")
      .attr("id", "boundaryLI" + tile.index)
      .attr("stroke", "blue")
      .attr("stroke-width", 0.001);
  });
}

export function addRaterOverlay(tiles, spxIdsToLabel, raterColor, className) {
  var fillColor = raterColor;
  var spxIntIds = spxIdsToLabel.map(Number);

  //console.log(tiles,spxIdsToLabel,raterColor,className)
  var overlay = $$("slide_viewer").viewer.svgOverlay();


  $.each(tiles, function (index, tile) {
    if (spxIntIds.includes(parseInt(tile.properties.labelindex))) {
      d3.select(overlay.node())
        .append("polygon")
        .attr("points", tile.geometry.coordinates)
        .style("fill", fillColor)
        .attr("opacity", 0.7)
        .attr("class", "raterClass" + " " + className) //add multiple classes in a single call
        .attr("id", "raterLI" + tile.properties.labelindex)
        .attr("stroke", "blue")
        .attr("stroke-width", 0.001);
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