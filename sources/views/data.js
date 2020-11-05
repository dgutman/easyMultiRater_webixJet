import {JetView} from "webix-jet";
import {data} from "models/records";
import {localRaterData} from "models/localRaterData"


export default class DataView extends JetView{
	config(){
		return { view:"datatable", autoConfig:true, css:"webix_shadow_medium" };
	}
	init(view){
		// console.log(localRaterData);
		//localRaterData is a dictinoary... I need to make it an array
		view.parse(Object.values(localRaterData));
	}
}
