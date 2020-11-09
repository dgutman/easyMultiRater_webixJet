import { JetView } from "webix-jet";
import { localRaterData } from "models/localRaterData";
import ajax from "./services/ajaxActions";
import $ from "jquery";
import { HOST_API } from "globals";

function changeMainImage(imageData) {
  $(".raterClass").remove();
  $(".boundaryClass").remove();

  //Eventually load this from a remoet source..
  $$("slide_viewer").viewer.open({
    width: imageData.baseImageWidth,
    tileSource:
      HOST_API + "/item/" + imageData.mainImage._id + "/tiles/dzi.dzi",
  });
}

export default class multiRaterThumbPanel extends JetView {
  config() {
    return {
      rows: [
        {
          view: "template",
          template: "MultiRaterThumbPanel",
          type: "header",
        },
        
        
        {
          view: "dataview",
          id: "thumbnailPanel",
          template:
            "<div class='webix_strong'>#imageName#<br><img src='#baseImageThumb#' height=120/></div>",
          type: {
            height: 120,
            width: 150,
          },
          width: 150 * 2 + 20,
          select: true,
          on: {
            onItemClick: function (id, e, node) {
              // console.log(id,e,node);
              var item = $$("thumbnailPanel").getItem(id);
              changeMainImage(item);
              curImageMetaData = item;
              //currentSelecetdItem = item; //updated curerntly selectee item.. currently in global  namespace
            },
          },
        },
      ],
    };
  }
  init(view) {
    //For now need to convert the localRateData into a flatter structure for visualization
    var imageData = []; //need to flatten the localRaterData for now
    // Object.keys(localRaterData).map(function (key) {
    // //   imageData.push(localRaterData[key]);
    // //  console.log(localRaterData[key])
    // });

    /* This fires after the view for the thumbnail is created and grabs the metadata from
    the DSA server */
    ajax.getFolder("folder", "5d02992b704d454c50973beb").then((d) => {
      // console.log(d)
      d.forEach((i) => {
        i.meta.baseImageThumb =
          HOST_API + "/item/" + i.meta.mainImage._id + "/tiles/thumbnail";
        i.meta.baseImageFile =
          HOST_API + "/item/" + i.meta.mainImage._id + "/tiles/dzi.dzi";
        imageData.push(i.meta);
      });
      console.log(imageData);

      $$("thumbnailPanel").parse(imageData);
    });

   
  }
}
