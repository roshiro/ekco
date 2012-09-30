W.Experiments.registerExperimentComponent("HomepageSettings","New",{name:"experiments.core.components.PageHomepageSettingsNew",skinParts:clone(),Class:{Extends:"mobile.core.components.Page",_onDataChange:function(d){var a=d.get("hidePage"),c=d.get("id"),b=W.Viewer._siteStructureData.get("mainPage").replace("#","")
}}});
W.Experiments.registerExperimentComponent("MasterPage","New",{name:"experiments.mobile.core.components.PageMasterPageNew",skinParts:{},Class:{Extends:"mobile.core.components.Page",render:function(){var a=this.injects().Viewer._siteStructureData.get("renderModifiers");
var c=true;
if(a&&a.pageAutoShrink&&a.pageAutoShrink==false){c=false
}if(c&&W.Layout&&W.Layout.getComponentMinResizeHeight){var b=W.Layout.getComponentMinResizeHeight(this);
this.setHeight(b)
}}}});
W.Experiments.registerExperimentTrait("RefactorLinkUtils","New",{name:"experiments.core.components.traits.LinkableComponentRefactorLinkUtils",trait:{Extends:"mobile.core.components.traits.LinkableComponent",Binds:[],initialize:function(){var a=W.Utils.linkUtils;
var b=this.render.bind(this);
this.render=function(){b();
var c=this.getDataItem();
a.renderLinks.call(this,c,this._skinParts.link);
if(W.Viewer.getEditorMode()=="PREVIEW"){a.linkableComponentEditModeChanged.call(this,"PREVIEW",c,this._skinParts.link)
}}.bind(this);
this.injects().Commands.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,a.linkableComponentEditModeChanged.bind(this))
}}});
W.Experiments.registerExperimentDataSchema("PageSecurity","New","Page",{title:"string",hideTitle:"boolean",icon:"string",windowTitle:"string",descriptionSEO:"string",metaKeywordsSEO:"string",pageTitleSEO:"string",pageUriSEO:"string",hidePage:"boolean",underConstruction:"boolean",tpaApplicationId:"number",pageSecurity:{type:"object","default":{requireLogin:false,passwordDigest:""}}});
W.Experiments.registerExperimentManager("NewComps","New",{name:"experiments.mobile.core.managers.ConfigurationManagerEcomNew",Class:{Extends:"mobile.core.managers.ConfigurationManager",getCurrentOrigin:function(){var a="http://"+window.location.host;
return a
},getMetaSiteData:function(){return this.getEditorModelProperty("metaSiteData")
},getPremiumFeatures:function(){var b=this.getRendererModelProperty("premiumFeatures");
if(!b){var a=this.getMetaSiteData();
b=a&&a.premiumFeatures
}return b
}}});
W.Experiments.registerExperimentManager("Staff","Wix",{name:"experiments.core.managers.CssManagerStaff",Class:{Extends:"mobile.core.managers.CssManager",_configureSystemFonts:function(){Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue"]);
Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue Italic"]);
Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue Thin"]);
Constants.CSS.SYSTEM_FONTS["sans-serif"].push(["Helvetica Neue Medium"]);
this._systemFontsCssDefinition={};
this._systemFontsNames=[];
this._addFontsLoaderCssTag(window.serviceTopology.publicStaticsUrl+"/css/Helvetica/fontFace.css");
for(var a in Constants.CSS.SYSTEM_FONTS){var f=Constants.CSS.SYSTEM_FONTS[a];
for(var c=0;
c<f.length;
++c){var e=f[c];
var d=(typeOf(e)=="array")?e[0]:e;
this._systemFontsNames.push(d);
var b=(typeOf(e)=="array")?e.concat().reverse():[e];
b.push(a);
this._addQuoteToArrayElementsIfContainSpaces(b);
this._systemFontsCssDefinition[d]=b.join(",")
}}}}});
W.Experiments.registerExperimentManager("SlowCssGC","New",{name:"experiments.core.managers.SkinManagerSlowCssGC",Class:{Extends:"mobile.core.managers.SkinManager",initialize:function(){this._SkinParserClass=W.Classes.get("mobile.core.managers.skin.SkinParser");
this._SkinRendererClass=W.Classes.get("mobile.core.managers.skin.SkinRenderer");
this._CssGarbageCollectorClass=W.Classes.get("mobile.core.managers.skin.CssGarbageCollector");
this._skinParser=new this._SkinParserClass();
this._skinRenderer=new this._SkinRendererClass();
this._skinQue=new W.Queue();
this._skinClassMap={};
this._skinDataMap={};
this._styleDataMap={};
this._cssGarbageCollector=new this._CssGarbageCollectorClass(this._styleDataMap,this._skinDataMap,this._skinRenderer);
if(W.Classes.getClassStatus("mobile.core.skins.BaseSkin")=="missing"){this.newSkin(W.BaseSkinClassData)
}W.Theme.addEvent("propertyChange",this._onThemeChange);
setInterval(this._cssGarbageCollector.runGarbageCollector,120000)
}}});
W.Experiments.registerExperimentManager("SyncWixify","New",{name:"experiments.core.managers.SkinManagerSyncWixify",Class:{Extends:"mobile.core.managers.SkinManager",getSkin:function(a,b){if(this._skinClassMap[a]){if(b){b(this._skinClassMap[a])
}return this._skinClassMap[a]
}else{this._skinQue.add(a,b);
W.Classes.get(a,function(){});
return null
}}}});
W.Experiments.registerExperimentManager("StyleRefactor","New",{name:"experiments.mobile.core.managers.ThemeManagerStyleRefactor",imports:["mobile.core.managers.style.SkinParamMapper"],Class:{Extends:"mobile.core.managers.ThemeManager",getStyle:function(b,d,a){if(this._styleCache[b]){W.Utils.callLater(d,[this._styleCache[b]])
}else{this._styleQueue.add(b,d);
if(this._styleQueue.getQueue(b).length>1){return
}var c=function(e){this._styleCache[b]=e;
this._styleQueue.getQueue(b).forEach(function(f){f(e)
});
this._styleQueue.removeKey(b)
}.bind(this);
if(this.isStyleAvailable(b)){this.getDataByQuery("#"+b,function(e){var f=e.get("style");
W.Skins.getSkin(e.get("skin"),function(h){var g=new this.SkinParamMapperClass(e,e.get("style"),h);
c(g)
}.bind(this))
}.bind(this))
}else{this.createStyle(b,"",a,c)
}}},createStyle:function(b,d,a,f){if(this._styleCache[b]){LOG.reportError(wixErrors.STYLE_ALREADY_EXISTS,"ThemeManager","createStyle",b)()
}var e=Object.clone(this.INIT_STYLE_RAW_DATA);
e.skin=a;
var c=this.addDataItem(b,e);
W.Skins.getSkin(c.get("skin"),function(i){var g=new this.SkinParamMapperClass(c,c.get("style"),i);
var h=g.getId();
this._styleCache[h]=g;
f(g)
}.bind(this))
},initialize:function(a){this.parent();
this.SkinParamMapperClass=this.imports.SkinParamMapper;
this._placeHoldersMap={};
this._isReady=false;
this._styleQueue=new W.Queue();
this._styleCache={};
this._isOperating=false;
if(a){this._onDataReady(a)
}}}});
W.Experiments.registerExperimentClass("SyncWixify","New",{name:"experiments.mobile.core.managers.data.DataItemBaseSyncWixify",Class:{Extends:"mobile.core.managers.data.DataItemBase",isReady:function(){return true
}}});
W.Experiments.registerExperimentClass("SyncWixify","New",{name:"experiments.mobile.core.managers.data.DataItemWithSchemaSyncWixify",Class:{Extends:"mobile.core.managers.data.DataItemWithSchema",isReady:function(){if(this._isReady){return true
}var a=this.getWaitingForReadyList();
if(a.length>0){this._isReady=false
}else{this._isReady=true
}return this._isReady
},getWaitingForReadyList:function(){var f=[];
var d=this.getData();
var b=this.getDataManager();
for(var g in d){var e=this.getFieldType(g);
var a,j;
if(e=="ref"){a=this.get(g);
j=b.isDataAvailable(a);
if(!j){f.push(a)
}}else{if(e=="refList"){var h=this.get(g);
for(var c=0;
c<h.length;
c++){a=h[c];
j=b.isDataAvailable(a);
if(!j){f.push(a)
}}}}}return f
}}});
Constants.DataEvents={DATA_CHANGED:"dataChanged",BEFORE_CHANGE:"beforeDataChange",AFTER_CHANGE:"afterDataChange"};
Constants.DataTypes={TYPE_RESOURCE_KEY:"resourceKey"};
W.Experiments.registerExperimentClass("SyncWixify","New",{name:"experiments.mobile.core.managers.data.DataManagerSyncWixify",Class:{Extends:"mobile.core.managers.data.DataManager",initialize:after(function(){this._notReadyDataMap={};
this._waitingForReadyDataMap={}
}),addDataItem:function(d,c){this._appendDataPropAdds(d,c);
var a=this.createDataItem(c);
a._data.id=d;
if(!this.skipDirtyMarking){this.markDirtyObject(a)
}var b=a.isReady();
if(!b){this._addToWaitingForReady(a)
}else{this._setDataReady(a)
}return a
},_addToWaitingForReady:function(c){var b=c.get("id");
this._notReadyDataMap[b]=c;
var e=c.getWaitingForReadyList();
for(var d=0;
d<e.length;
d++){var a=e[d];
if(a.indexOf("#")===0){a=a.substr(1)
}if(!this._waitingForReadyDataMap[a]){this._waitingForReadyDataMap[a]=[]
}this._waitingForReadyDataMap[a].push(b)
}},_setDataReady:function(b){var a=b.get("id");
this.dataMap[a]=b;
this._runCallbacks(a,b);
this._updateDataWaitingList(b);
if(this._notReadyDataMap[a]){delete this._notReadyDataMap[a]
}},_updateDataWaitingList:function(b){var a=b.get("id");
var e=this._waitingForReadyDataMap[a];
if(e){delete this._waitingForReadyDataMap[a];
for(var d=0;
d<e.length;
d++){var c=this._notReadyDataMap[e[d]];
if(c){if(c.isReady()){this._setDataReady(c)
}}}}},getDataByQuery:function(d,c){var b=null;
if(d.indexOf("#")===0){var a=d.substr(1);
b=this.dataMap[a];
if(c){if(!b){this.callbackQueue.add(a,c)
}else{c(b)
}}return b
}else{LOG.reportError(wixErrors.DM_MALFORMED_QUERY,"DataManager","getDataByQuery",d);
W.Utils.callLater(c,[null])
}},isReady:function(){if(Object.getLength(this._notReadyDataMap)>0&&Object.getLength(this._waitingForReadyDataMap)>0){return false
}else{return true
}}}});
W.Experiments.registerExperimentClass("StyleRefactor","New",{name:"experiments.mobile.core.managers.skin.SkinRendererStyleRefactor",Class:{Extends:"mobile.core.managers.skin.SkinRenderer",_getParamValue:function(g,a){var b=null;
if(g.defaultParam){var e=g.defaultParam;
return this._applyParamMutators(this._getParamValue(e,a),g)
}if(a&&a.getProperty(g.id)){var h=a.getPropertySource(g.id);
b=a.getProperty(g.id);
if(h=="theme"){b=this.injects().Theme.getProperty(b)
}b=this._castToType(b,g);
b=this._addExtraToParamByType(g,b,a);
return this._applyParamMutators(b,g)
}if(g.defaultTheme){var f=g.defaultTheme;
var j=W.Theme.getProperty(f);
j=this._castToType(j,g);
return this._applyParamMutators(j,g)
}if(g.sumParams){var d=g.sumParams;
if(d&&typeOf(d)=="array"&&d.length>0){var k=this._getParamValue(d[0],a);
if(k.add&&typeof k.add==="function"){for(var c=1;
c<d.length;
c++){k.add(this._getParamValue(d[c],a))
}}return this._applyParamMutators(k,g)
}}if(g.defaultValue){b=this._castToType(g.defaultValue,g);
return this._applyParamMutators(b,g)
}return null
}}});