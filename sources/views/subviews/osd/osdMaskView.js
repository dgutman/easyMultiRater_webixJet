import { JetView } from "webix-jet";
import ajax from "../../services/ajaxActions";
import * as tileInfo from "./tileHelperFunctions";
import * as hlprs from "./multiRaterHelpers";
import { HOST_API, colorPalette } from "globals";

const OpenSeadragon = require("openseadragon");
const SVGOverlay = require("svg-overlay");
const d3 = require("d3");
const $ = require("jquery");

webix.protoUI(
  {
    name: "osdViewer", //give it some name you like
    $init: function (config) {
      this.$ready.push(this.createOSDViewer);
      this.$ready.push(this.statusMessage);
      this.$ready.push(this.afterLoadedHandler);
    },
    createOSDViewer: function () {
      this.viewer = new OpenSeadragon({
        element: this.getNode(),
        prefixUrl: "sources/images/images/",
        //tileSources: duomo,  /* To Do-- have it auto select the first thumbnail */
        navigatorPosition: "BOTTOM_RIGHT",
        showNavigator: true,
      });
    },
    afterLoadedHandler: function () {
      this.viewer.addHandler("open", function (event) {
        var overlay = $$("slide_viewer").viewer.svgOverlay();
        var selectedItem = $$("thumbnailPanel").getSelectedItem();

        if (selectedItem) {
          //make sure this only fires if theres actually a selected item... need help with this logic as well..
          console.log(selectedItem.imageName);
          var featureMetaData = [];
          selectedItem.featuresObservedForImage.forEach(function (k) {
            featureMetaData.push({
              featureName: k,
              markupDataForFeature: selectedItem.markupData[k],
            });

            //Add in the code to push data to the rtaerInfo Table
            // $$("curImageRaterList").clearAll();
            //Will create a class for each Rater...
            var curImageRaterDataList = [
              {
                raterName: "moreThan1",
                raterColor: "#ffff00",
                showRaterMarkupCheckbox: "on",
              },
              {
                raterName: "moreThan2",
                raterColor: "#ff0000",
                showRaterMarkupCheckbox: "on",
              },
              {
                raterName: "moreThan3",
                raterColor: "#ff700e",
                showRaterMarkupCheckbox: "on",
              },
            ];

            selectedItem.ratersForCurrentImage.forEach(function (rtr, idx) {
              var fillColor = colorPalette[idx % 10]; //I want each SVG tile to have a uniqueish color
              curImageRaterDataList.push({
                raterName: rtr,
                raterColor: fillColor,
                showRaterMarkupCheckbox: "off",
              });
            });
            $$("raterInfoDataTable").clearAll();
            $$("raterInfoDataTable").parse(curImageRaterDataList);
            //            $$("curImageFeatureList").clearAll();

            /* Going to restructure this a little bit to add some color... */
            featureMetaData = [];
            selectedItem.featuresObservedForImage.forEach(function (k) {
              featureMetaData.push({
                featureName: k,
                markupDataForFeature: selectedItem.markupData[k],
              });
            });
          });

          hlprs.createFeatureButtons(featureMetaData);

          var currentImgTileDict = {};
          curImgTileData = selectedItem.svgJson;
          selectedItem.svgJson.forEach(function (tile, index) {
            var fillColor = colorPalette[index % 10]; //I want each SVG tile to have a uniqueish color
            var overlay = $$("slide_viewer").viewer.svgOverlay();

            var node = d3
              .select(overlay.node())
              .append("polygon")
              .style("fill", fillColor)
              .attr("points", tile.geometry.coordinates)
              .attr("class", "boundaryClass")
              .attr("id", "boundaryLI" + tile.properties.labelindex)
              .style("opacity", 0.05);
            /* To Do-- this should be bound to the value I put in the slider control */
            //.on("mouseover", hlprs.handleMouseOver);
            currentImgTileDict[tile.properties.labelindex] = tile;
          });
        }
        return overlay;
      });
    },
    statusMessage: function () {
      //      webix.message("Printing a status message");
    },
  },
  webix.ui.view
);

var applyOpacity = function (opValue) {
  // var slider_id = this.config.id;
  // var layerId = slider_id.substring(15); //all sliderrs start with opacity_slider_
  //$$("slide_viewer").viewer.world.getItemAt(layerId).setOpacity(opValue);
  //$(".boundaryClass").css('opacity', opValue)  The boundary class is for the SuperPixelMap
};

var applyRaterOpacity = function (opValue) {
  $(".multiRater").css("opacity", opValue);
  // $(".raterClass").attr('opacity',opValue);
};

var applySpxMaskOpacity = function (opValue) {
  $(".boundaryClass").css("opacity", opValue);
};

var applySegMaskOpacity = function (opValue) {
  $(".segMaskClass").css("opacity", opValue);
};

var raterOpacitySliderLayer = {
  view: "slider",
  id: "opacity_slider_1",
  label: "MultiRater Opacity",
  labelPosition: "top",
  value: "0.0",
  step: 0.1,
  min: 0,
  max: 1,
  width: 200,
  on: {
    onSliderDrag: applyRaterOpacity,
    onChange: applyRaterOpacity,
  },
};

var spxOpacitySlider = {
  view: "slider",
  id: "spx_opacity_slider",
  label: "Spx Mask Opacity",
  labelPosition: "top",
  value: "0.0",
  step: 0.1,
  min: 0,
  max: 1,
  width: 200,
  on: {
    onSliderDrag: applySpxMaskOpacity,
    onChange: applySpxMaskOpacity,
  },
};

var segMaskOpacitySlider = {
  view: "slider",
  id: "Seg Mask Opacity",
  label: "Seg Mask Opacity",
  labelPosition: "top",
  value: "0.0",
  step: 0.1,
  min: 0,
  max: 1,
  width: 200,
  on: {
    onSliderDrag: applySegMaskOpacity,
    onChange: applySegMaskOpacity,
  },
};


var showSegBoundaryButton = {
  view: "button",
  id: "showSegBounds",
  label: "ShowSeg",
inputWidth: 200,
  on: {
      onItemClick: function(id) {
          console.log(this)

          var selectedItem = $$("thumbnailPanel").getSelectedItem();

          selectedItem.superpixels_in_mask.forEach(function(val, spxId) {
              if (val == 1 ) {
                  $("#boundaryLI" + spxId).css('opacity', 0.5);
                  $("#boundaryLI" + spxId).css('fill', 'red');

                  console.log(val, spxId);
              }
                  else if (val>0 && val < 1)
                          {
                  $("#boundaryLI" + spxId).css('opacity', 0.4);
                  $("#boundaryLI" + spxId).css('fill', 'yellow');

                          }
          })


          }

      }
  }




export default class osdMaskClass extends JetView {
  config() {
    var osdMaskControls = {
      height: 60,
      cols: [
        { view: "template", template: "Mask Opacity Controls" },
        showSegBoundaryButton, segMaskOpacitySlider,
        raterOpacitySliderLayer, // There is only one layer right now! doh
        spxOpacitySlider,
      ],
    };

    return {
      name: "osdMaskClass",
      rows: [osdMaskControls, { view: "osdViewer", id: "slide_viewer" }],
    };
  }
}
