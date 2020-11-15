import { JetView } from "webix-jet";
import "globals";

const webix = require("webix");
const $ = require("jquery");
import * as tileInfo from "./subviews/osd/tileHelperFunctions";

export default class curImageFeatureList extends JetView {
  config() {
    const featureAccordion = {
      view: "form",
      id: "curImgFeatureList",
      gravity: 0.5,
      elements: [],
    };

    const curPixelInfo = {
      gravity: 0.1,
      view: "template",
      id: "curPixelInfo",
      template: "#curPixelId# #ratersForSpx# <br>#featuresSeen#",
      data: { curPixelId: "", ratersForSpx: "", "#featuresSeen#": "" },
    };

    const curImageFeatureList = {
      rows: [
        { view: "template", type:"header",template: "Features Present In Image" },
        {
          gravity: 0.3,
          view: "list",
          id: "curImageFeatureList",
          template: "#featureName#",
          select: true,
          on: {
            onItemClick: function (id) {
              curSelectedFeature = this.getItem(id);
              $(".boundaryClass").css("opacity", 0);
              rtrColorId = 0;
              $(".raterClass").remove(); //remove all the previously marked up raters
              for (rtr in curSelectedFeature.markupDataForFeature) {
                // console.log("Rendering data for", rtr)
                // console.log(curSelectedFeature.markupDataForFeature[rtr]);
                tileInfo.addRaterOverlay(
                  currentImgTileData,
                  curSelectedFeature.markupDataForFeature[rtr],
                  rtrColorId
                );
                rtrColorId++;
              }
            },
          },
        },
      ],
    };

    return {
      name: "curImageFeatureList",
      width: 400,
      rows: [
        curImageFeatureList,
        curPixelInfo,
        featureAccordion
       
      ],
    };
  }
}
