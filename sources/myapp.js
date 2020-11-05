import "./styles/app.css";
import 'regenerator-runtime/runtime'
import {JetApp, EmptyRouter, HashRouter } from "webix-jet";

global.curImageMetaData = {};  /* To Do--- probably a cleaner way than making this global to track the currently selected Item */
global.curImgTileData = {};

export default class MyApp extends JetApp{
	constructor(config){
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: "/top/start"
		};

		super({ ...defaults, ...config });
	}
}

if (!BUILD_AS_MODULE){
	webix.ready(() => new MyApp().render() );
}
