import d3 from "d3";
import $ from "jquery";
import state from "../../../models/state";

import * as tileInfo from "./tileHelperFunctions";

export function handleMouseOver(d, i) {
  // self.deselectCell(d3.select(overlay.node()).selectAll('.boundaryClass'));
  // self.selectCell(d3.select(overlay.node()).select('#' + this.id));
  // console.log(d, i);
  // console.log(this.id);
  $$("curPixelInfo").parse({ curPixelId: this.id });
}

export function createFeatureButtons(featureSetData) {
  //Given a list of feature names, create individual buttons and add them to the featureListButtons element
  $$("curImgFeatureList").clear();
  $$("curImgFeatureList").reconstruct();
  var cols = [];

  //console.log(featureSetData);
  //for each feature create a button and bind it to the curImgFeatureList view (form)
  $.each(featureSetData, function (index, feature) {
    //console.log(index, feature);
    var btn = {
      id: feature.featureName,
      view: "button",
      width: 110,
      badge: Object.keys(feature.markupDataForFeature).length,
      label: feature.featureName.replace(new RegExp("[_|/]", "g"), " "),
      width: 90,
      height: 50,
      type: "iconTop",
      css: "feature_button",
      on: {
        onItemClick: function (id) {
          //perhaps a cleaner way to do this.. but this resets the # of spx marked for the current feature
           // console.log(id);
          $$("raterInfoDataTable").eachRow(function (row) {
            var itm = this.getItem(row);
          //  console.log(itm);
            this.updateItem(row, { raterTotalFeaturesSeen: "" });
          });

          $(".boundaryClass").css("opacity", 0);
          /* Grab the most recent raterData Information so I can use the right color scheme */
          var raterDataDict = {};
          $$("raterInfoDataTable")
            .serialize()
            .forEach(function (rtrData) {
              raterDataDict[rtrData.raterName] = rtrData;
            });
          var rtrColorId = 0;
          //While adding the raters, create the compsite version as well

          var spxMarkupCountDict = new Object();

          $(".raterClass").remove(); //remove all the previously marked up rater
          
          var rtr = {};
          for (rtr in state.curImageMetaData.markupData[id]) {
            $.each(state.curImageMetaData.markupData[id][rtr], function (idx, spx) {
              //     console.log(spx, idx);
              if (!spxMarkupCountDict.hasOwnProperty(spx)) {
                spxMarkupCountDict[spx] = 1;
              } else {
                spxMarkupCountDict[spx]++;
              }
            });

            console.log(raterDataDict[rtr]);
        //    update the data table to show the count for the currently displayed feature
            $$("raterInfoDataTable").updateItem(raterDataDict[rtr].id, {
              raterTotalFeaturesSeen:
              state.curImageMetaData.markupData[id][rtr].length,
            });

            tileInfo.addRaterOverlay(
              state.curImgTileData,
              state.curImageMetaData.markupData[id][rtr],
              raterDataDict[rtr]["raterColor"],
              rtr
            );
            rtrColorId++;
          }
          console.log(spxMarkupCountDict);
          //Now add in data for a composite rater...
          var moreThan1 = [];
          var moreThan2 = [];
          var moreThan3 = [];
          $.each(spxMarkupCountDict, function (spxId, raterCount) {
            if (raterCount > 1) {
              moreThan1.push(spxId);
            }
            if (raterCount > 2) {
              moreThan2.push(spxId);
            }
            if (raterCount > 3) {
              moreThan3.push(spxId);
            }
          });
          //add two clasess one identifying the specific layer name and a second that lets me know it's a multiRater composite
          tileInfo.addRaterOverlay(
            state.curImgTileData,
            moreThan2,
            "#ffff00",
            "moreThan1 multiRater"
          );
          tileInfo.addRaterOverlay(
            state.curImgTileData,
            moreThan3,
            "#ff0000",
            "moreThan2 multiRater"
          );
          tileInfo.addRaterOverlay(
            state.curImgTileData,
            moreThan2,
            "#ffff00",
            "moreThan3 multiRater"
          );

          $$("raterInfoDataTable").updateItem(raterDataDict[rtr].id, {
            raterTotalFeaturesSeen: state.curImageMetaData.markupData[id][rtr].length,
          });

          //now that I have added all of the layers, let's quickly make sure everything is toggled on / off appropriately
          $.each(raterDataDict, function (rtrName, raterData) {
            if (raterData.showRaterMarkupCheckbox == "on") {
              $("." + rtrName).css("opacity", 0.6);
            } else {
              $("." + rtrName).css("opacity", 0);
            }
          });
        },
      },
    };

    cols.push(btn);
    //                we want to create 3 columns (a row with 3 buttons)
    if ((index + 1) % 3 == 0 || index == featureSetData.length - 1) {
      $$("curImgFeatureList").addView({ cols: cols });
      cols = [];
    }
  });
}