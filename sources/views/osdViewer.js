import { JetView } from "webix-jet";
const OpenSeadragon = require("openseadragon");

var duomo = {
  Image: {
    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    Url: "//openseadragon.github.io/example-images/duomo/duomo_files/",
    Format: "jpg",
    Overlap: "2",
    TileSize: "256",
    Size: {
      Width: "13920",
      Height: "10200",
    },
  },
};








// function areAllFullyLoaded() {
//   var tiledImage;
//   var count = viewer.world.getItemCount();
//   for (var i = 0; i < count; i++) {
//     tiledImage = viewer.world.getItemAt(i);
//     if (!tiledImage.getFullyLoaded()) {
//       return false;
//     }
//   }
//   return true;
// }

// var isFullyLoaded = false;






webix.protoUI(
  {
    name: "osdViewer", //give it some name you like
    $init: function (config) {
      this.$ready.push(this.createOSDViewer);
      this.$ready.push(this.statusMessage);
      this.$ready.push(this.afterLoadedHandler);
      //    this.$ready.push(this.viewer.svgOverlay());
    },
    createOSDViewer: function () {
      //webix.message("Viewer ready event fired");
      this.viewer = new OpenSeadragon({
        element: this.getNode(),
        prefixUrl: "sources/images/images/",
        tileSources: duomo,
        navigatorPosition: "BOTTOM_RIGHT",
        showNavigator: true,
      });
      //webix.message("Viewer creation should be finished");
    },
    afterLoadedHandler: function()
    {   
      this.viewer.addHandler('open', function(event) {
      console.log("Hello gulliver");
        var tiledImage = event.item;
      tiledImage.addHandler('fully-loaded-change', function() {
        var newFullyLoaded = areAllFullyLoaded();
        if (newFullyLoaded !== isFullyLoaded) {
          isFullyLoaded = newFullyLoaded;
          // Raise event
          console.log('Locked and loaded')
        }
      })});
    },
      statusMessage: function () {
      webix.message("I fired the scalebar as well");
    },
  },
  webix.ui.view
);


export default class osdSVGClass extends JetView {
  config() {
    return {
      id: "slide_viewer",
      header: "A Slide Viewer",
      body: {
        rows: [
          {
            view: "template",
            template: "HI DAVE",
          },
          {
            view: "template",
            template: "MORE  DAVE",
          },
          {
            view: "template",
            id: "main_osd",
            template: "HI",
          },
        ],
      },
    };
  }
  init(view)
  {
      console.log('View Created')
  }

}

//   var applyOpacity = function(opValue) {
//     console.log(opValue);
//     console.log(this);

//    var  slider_id = this.config.id;
//    var layerId = slider_id.substring(15);//all sliderrs start with opacity_slider_
//     console.log(slider_id,layerId);

// var toplayer=$$("slide_viewer").viewer.world.getItemAt(layerId)
// toplayer.setOpacity(opValue);
//     webix.message("Change")

//   }

//    var opacitySliderLayer1 = {
//                 view: "slider",
//                 id: "opacity_slider_1",
//                 label: "Layer1 Opacity",
//                 labelPosition: "top",
//                 value: "0.0",
//                 step: 0.5,
//                 min: 0,
//                 max: 1,
//                 width: 200,

//                 on: {
//                     "onSliderDrag": applyOpacity,
//                     "onChange": applyOpacity
//                 }
//             };

// var opacitySliderLayer0 = {
//                 view: "slider",
//                 id: "opacity_slider_0",
//                 label: "Layer 0 Opacity",
//                 labelPosition: "top",
//                 value: "0.0",
//                 step: 0.5,
//                 min: 0,
//                 max: 1,
//                 width: 200,

//                 on: {
//                     "onSliderDrag": applyOpacity,
//                     "onChange": applyOpacity
//                 }
//             };

// export default class osdMaskClass extends JetView {
//   config() {

//     var osdMaskControls = {
//       height: 50,

//       cols: [
//       { view: "template", template: "Mask Opacity Controls" },
//       opacitySliderLayer1, opacitySliderLayer0
//       ]

//     }

//     return {
//       name: "osdMaskClass",
//       rows: [
//         osdMaskControls,

//         { view: "osdViewer", id: "slide_viewer" },
//         { gravity: 0.25, cols: [
//             { view: "osdViewer", id: "slide_viewer_two"},
//             { gravity: 0.25, view: "osdViewer", id: "slide_viewer_three"}
//                       ]

//           }
//       ]
//     };
//   }

// }