import { JetView } from "webix-jet";
const d3 = require("d3");
const $ = require("jquery");
const webix = require("webix");

export default class raterInfoDataTable extends JetView {
  config() {
    var cSt =
      "<span style='background-color:#raterColor#; border-radius:4px; padding-right:10px;'>&nbsp</span> #raterColor#";

    var raterInfoDataTable = {
      view: "datatable",
      gravity: 0.2,
      id: "raterInfoDataTable",
      height: 150, //TO FIX.. this shuold not be fixed height
      columns: [
        { id: "raterName", header: "Rater Name", width: 180 },
        {
          id: "raterColor",
          editor: "color",
          template: cSt,
          header: "Rater Color",
          width: 120,
        },
        {
          id: "raterTotalFeaturesSeen",
          header: "raterTotalFeaturesSeen",
          width: 200,
        },
        { id: "spxMarkedForCurrentFeature", header: "SpxsForSelectedFeature" },
        {
          id: "showRaterMarkupCheckbox",
          header: "DisplayMarkup",
          checkValue: "on",
          uncheckValue: "off",
          value: "on",
          template: "{common.checkbox()}",
        },
      ],
      editable: true,
     // autoheight: true,
      autowidth: true,
      gravity: 1,
      tooltip: true,
      on: {
        onCheck: function (rowId, colId, state) {
          var curItem = $$("raterInfoDataTable").getItem(rowId);
          if (curItem.showRaterMarkupCheckbox == "on") {
            $("." + curItem.raterName).css("opacity", 0.6);
          } else {
            $("." + curItem.raterName).css("opacity", 0);
          }
        },
        onAfterEditStop: function (state, editor) {
        //   console.log(state);
        //   console.log(editor);
          var rowInfo = this.getItem(editor.row);
          console.log(rowInfo);
          if (editor.column == "raterColor" && state.value != state.old) {
            //webix.message("color changed to" + state.value);
            $("." + rowInfo.raterName).css("fill", state.value);
          }
        },
      },
    };

    return {
      name: "raterInfoDataTable",
      rows: [raterInfoDataTable],
    };
  }
}