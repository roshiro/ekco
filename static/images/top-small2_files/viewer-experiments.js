W.Experiments.registerExperimentComponent("PageSecurity","New",{name:"experiments.wysiwyg.viewer.components.AdminLoginPageSecurity",imports:[],skinParts:{blockingLayer:{type:"htmlElement"},passwordInput:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindPasswordField"},submitButton:{type:"htmlElement"},xButton:{type:"htmlElement",command:"WViewerCommands.PasswordLogin.Close"},favIcon:{type:"htmlElement"},header:{type:"htmlElement"},dialog:{type:"htmlElement"}},Class:{Extends:"wysiwyg.viewer.components.PasswordLogin",Binds:["centerDialog","_onSubmit","_reportError","_invalidateErrorState","_onKeyPress"],Static:{},_states:["normal","confirm"],initialize:function(c,a,b){if(!window.userApi&&window.UserApi){this._userApi=window.UserApi.getInstance().init({orgDocID:"",usersDomain:window.usersDomain||'https://users.wix.com/wix-users";',corsEnabled:true,dontHandShake:true,urlThatUserRedirectedFrom:""})
}else{this._userApi=window.userApi
}this.parent(c,a,b);
this.VIEWER_STRINGS.LOGIN_HEADER="Login to edit your site";
this.ERR_MAP={"9975":this.VIEWER_STRINGS.LOGIN_ERR_GENERAL,"9972":this.VIEWER_STRINGS.LOGIN_ERR_WRONG_PASSWORD}
},_validatePassword:function(j,g,c){var k=this._validateInput(j);
if(!k){var d=window.rendererModel;
var e=d.metaSiteId;
var b=d.siteId;
var h=window.siteHeader.userId;
var a=this.injects().Config.getServiceTopologyProperty("serverName");
var l=false;
var f=this.injects().Config.getServiceTopologyProperty("htmlEditorUrl")+"/editor/web/renderer/edit/"+b+"?metaSiteId="+e;
if(!this._userApi){this._reportError(this.VIEWER_STRINGS.LOGIN_ERR_GENERAL);
return
}this._userApi.loginByGuid(h,j,l,function(m){c(this.VIEWER_STRINGS.LOGIN_ERR_GENERAL)
}.bind(this),function(m){var o=m.success;
if(o){g();
if(this.injects().Viewer.isPublicMode()||this._debugMode){window.open(f,"_blank")
}}else{var n=this.ERR_MAP[m.errorCode]||this.ERR_MAP[9975];
c(n)
}}.bind(this))
}else{c(k)
}},_onSubmit:function(){if(!this.injects().Viewer.isPublicMode()){this.injects().Commands.executeCommand("adminLogin.submitAttempt",{component:this._skinParts.submitButton},this)
}else{this.parent()
}},_validateInput:function(a){var b=a.length;
if(b<4||b>15){return this.ERR_MAP["9972"]
}return null
},getAcceptableDataTypes:function(){return["Text"]
}}},"wysiwyg.viewer.components.AdminLogin");
W.Experiments.registerNewExperimentComponent("AudioPlayer","New",{name:"wysiwyg.viewer.components.AudioPlayer",skinParts:{playButton:{type:"htmlElement"},stopButton:{type:"htmlElement"},pauseButton:{type:"htmlElement"}},Class:{EDITOR_META_DATA:{general:{settings:true,design:true},custom:[{label:"AUDIO_REPLACE_AUDIO",command:"WEditorCommands.OpenImageDialog",commandParameter:{galleryTypeID:"audio"},commandParameterDataRef:"SELF"}],dblClick:{command:"WEditorCommands.OpenImageDialog",commandParameter:{galleryTypeID:"audio"},commandParameterDataRef:"SELF"}},Extends:"mobile.core.components.base.BaseComponent",Binds:["_play","_pause","_stop","_setVolume","_onApiLoaded","_createAudioPlayer"],_states:["playing"],initialize:function(c,a,b){this.parent(c,a,b);
this._loadApi()
},_onAllSkinPartsReady:function(a){this._createAudioPlayer()
},_createAudioPlayer:function(){if(!this.$class._audioManagerWasLoaded){W.Utils.callLater(this._createAudioPlayer,null,this,10);
return
}this._skinParts.playButton.addEvent("click",this._play);
this._skinParts.stopButton.addEvent("click",this._stop);
this._skinParts.pauseButton.addEvent("click",this._pause);
this.injects().Commands.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._onModeChange);
if(this.$class._audioManagerWasLoaded){this._audio=this._createAudioObject()
}window.addEventListener("blur",function(){this._pause()
}.bind(this));
if(!this.injects().Viewer.getPreviewMode()&&this.getIsDisplayed()&&this._data.get("autoPlay")){this._play()
}},_onModeChange:function(a){if((this._isInPreviewMode(a)&&this.getIsDisplayed()&&this._data.get("autoPlay")&&this._fileWasSet())){this._play()
}else{this._stop()
}},_fileWasSet:function(){return this._data.get("uri").length>0
},_isInPreviewMode:function(a){return a.toLowerCase()===Constants.ViewManager.VIEW_MODE_PREVIEW.toLowerCase()
},_play:function(){if(this._fileWasSet()){this.setState("playing");
var a={volume:this._data.get("volume")};
if(this._data.get("loop")){a.onfinish=this._play
}this._audio.play(a)
}},_pause:function(){if(this._fileWasSet()){this.removeState("playing");
this._audio.pause()
}},_stop:function(){if(this._fileWasSet()&&this._audio){this.removeState("playing");
this._audio.stop();
this._audio.destruct();
this._audio=this._createAudioObject()
}},_createAudioObject:function(){return soundManager.createSound({id:this._view.getAttribute("id"),url:this._getFullUrl(this._data.get("uri"))})
},_getFullUrl:function(b){if(b.indexOf("http://")===-1){var a=window.serviceTopology.staticAudioUrl;
if(a[a.length-1]!=="/"){a+="/"
}a+=b;
return a
}return b
},_setVolume:function(b){var a=b.value||100;
this._audio.volume=a/100
},_onDataChange:function(a){this.parent(a);
this._stop()
},getAcceptableDataTypes:function(){return["AudioPlayer"]
},_getSoundManagerFolder:function(){var a=window.serviceTopology.scriptsRoot;
if(a[a.length-1]!=="/"){a+="/"
}a+="resources/wysiwyg/media/soundmanager2/";
return a
},_onApiLoaded:function(){soundManager.url=this._getSoundManagerFolder();
soundManager.onready(function(){this.$class._audioManagerWasLoaded=true
}.bind(this))
},_loadApi:function(){if(!this.$class.audioApiLoaded){this.$class.audioApiLoaded=true;
this.apiScriptNode=document.createElement("script");
var a=document.getElementsByTagName("script")[0];
this.apiScriptNode.src=this._getSoundManagerFolder()+"soundmanager2-nodebug-jsmin.js";
this.apiScriptNode.onload=this._onApiLoaded;
a.parentNode.insertBefore(this.apiScriptNode,a)
}},onPageVisibilityChange:function(a){if(window.viewMode==="editor"){return
}if(!a&&(this.getState()==="playing")){this._pause()
}else{if(a&&this._data.get("autoPlay")&&(this.getState()!=="playing")){this._play()
}}}}});
W.Experiments.registerExperimentComponent("GEM","New",{name:"experiments.wysiwyg.viewer.components.DisplayerGEM",skinParts:clone(),Class:{Extends:"wysiwyg.viewer.components.Displayer",_isImageLinked:function(){var a=this.getDataItem().get("href");
return !!a
},_isImageClickable:function(){if(this._galleryImageOnClickAction==="goToLink"){return this._isImageLinked()
}else{return(this._galleryImageOnClickAction!=="disabled")
}},_onOwnerPropsChanged:function(){if(this._isDisposed||(this._owner&&this._owner._isDisposed)){return
}if(this._owner.getComponentProperties().hasField("galleryImageOnClickAction")){this._galleryImageOnClickAction=this._owner.getComponentProperty("galleryImageOnClickAction")
}else{this._galleryImageOnClickAction=(this._owner.getComponentProperty("expandEnabled")===true)?"zoomMode":"disabled"
}this._skinParts.link.set("text",this._owner.getComponentProperty("goToLinkText"));
if(!this._isImageClickable()&&this.getState().indexOf("rollover")!=-1){this.setState("rollover","general")
}this._updateParts()
},_updateParts:function(){var b;
if(this._skinParts){this._skinParts.title.set("text",this._data.get("title"));
this._skinParts.description.set("text",this._data.get("description"));
var a=this._skinParts.zoom||this._skinParts.imageWrapper;
a.setStyle("cursor",this._isImageClickable()?"pointer":"default");
if(this._galleryImageOnClickAction==="goToLink"||!this._isImageLinked()){this._skinParts.link.setStyle("display","none")
}else{this._skinParts.link.setStyle("display","block")
}}},_onMouseOver:function(){if(this._isImageClickable()&&this.getState().indexOf("normal")!=-1){this.setState("rollover","general")
}},_onMouseOut:function(){if(this._isImageClickable()&&this.getState().indexOf("rollover")!=-1){this.setState("normal","general")
}},_onZoomClick:function(b){if(b.rightClick!==false){return
}if(this._galleryImageOnClickAction=="zoomMode"){var c=this._data.get("id");
var a=this._parentList.getData()["items"].indexOf("#"+c);
this.injects().Commands.executeCommand("WViewerCommands.OpenZoom",{itemsList:this._parentList,currentIndex:a,getDisplayerDivFunction:this.injects().Viewer.getDefaultGetZoomDisplayerFunction("Image"),getHashPartsFunction:this.injects().Viewer.getDefaultGetHashPartsFunction("Image")})
}else{if(this._galleryImageOnClickAction=="goToLink"){this._skinParts.link.click()
}}}}});
W.Experiments.registerExperimentComponent("NewComps","New",{name:"experiments.wysiwyg.viewer.components.DisplayerNewComps",skinParts:clone(),traits:["mobile.core.components.traits.LinkableComponent","wysiwyg.viewer.components.traits.SelectableOption"],Class:{Extends:"wysiwyg.viewer.components.Displayer",_states:merge({selectState:["selected","unselected"]}),setSelected:function(a){this.setState(a?"selected":"unselected","selectState")
}}});
W.Experiments.registerNewExperimentComponent("Login","New",{name:"wysiwyg.viewer.components.LoginButton",skinParts:{container:{type:"htmlElement"},actionTitle:{type:"htmlElement"},memberTitle:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onStyleChange"],_states:["auth","no_auth"],Static:{SIGN_IN:"Login/Sign up",SIGN_OUT:"Log out",HELLO:"Hello"},initialize:function(c,b,a){this.parent(c,b,a)
},_onStyleReady:function(){this.parent();
this._style.addEvent(Constants.StyleEvents.PROPERTY_CHANGED,this._onStyleChange)
},_onStyleChange:function(){this._centerButton();
this._wCheckForSizeChangeAndFireAutoSized(10)
},render:function(){this.parent();
this._updateTextsAndEvents();
this._centerButton()
},_updateTextsAndEvents:function(){var d=this._skinParts;
var a=this.injects().SiteMembers;
var e=d.actionTitle;
var c=d.memberTitle;
var b=this;
if(this.injects().SiteMembers.isLoggedIn()){e.set("text",this.SIGN_OUT);
e.addEvent("click",function(){a.logout();
e.removeEvent("click",arguments.callee);
setTimeout(function(){location.reload()
},500)
});
this.injects().SiteMembers.getMemberDetails(function(g){var f=g.attributes&&g.attributes.name||g.email;
c.set("text",this.HELLO+" "+f)
}.bind(this));
this.setState("auth")
}else{e.set("text",this.SIGN_IN);
e.addEvent("click",function(){a.openSiteMembersPopup({authCallback:function(f){if(f.authResponse==true){b._renderIfReady()
}}});
e.removeEvent("click",arguments.callee)
}.bind(this));
c.set("text","");
this.setState("no_auth")
}},_centerButton:function(){var a=this._skinParts.container;
var f=a.getSize();
var e=f.x;
var d=f.y;
var b=this.getHeight()-d;
var c=this.getWidth()-e;
a.setStyle("margin-left",c/2);
a.setStyle("margin-right",c/2);
a.setStyle("margin-top",b/2);
a.setStyle("margin-bottom",b/2);
this._skinParts.actionTitle.setStyle("width",this.getWidth());
this._skinParts.memberTitle.setStyle("width",this.getWidth());
this.setMinH(d)
},_onResize:function(){this._centerButton();
this.parent()
}}});
W.Experiments.registerExperimentComponent("GEM","New",{name:"experiments.wysiwyg.viewer.components.MatrixGalleryGEM",skinParts:clone(),propertiesSchemaName:clone(),Class:{Extends:"wysiwyg.viewer.components.MatrixGallery",_onAllSkinPartsReady:before(function(){var b=this.getComponentProperty("galleryImageOnClickAction");
var a=this.getComponentProperty("expandEnabled");
if(b==="unset"){if(a===false){this.setComponentProperty("galleryImageOnClickAction","disabled",true)
}else{this.setComponentProperty("galleryImageOnClickAction","zoomMode",true)
}}})}});
W.Experiments.registerExperimentComponent("WixApps","New",{name:"experiments.wysiwyg.viewer.components.MediaZoomWixApps",skinParts:clone(),Class:{Extends:"wysiwyg.viewer.components.MediaZoom",_renderCurrentDisplayer:function(d){var a=this._skinParts.virtualContainer;
for(var b=0;
b<a.childNodes.length;
b++){a.childNodes[b].destroy()
}var c=this;
this._getDisplayerDivFunction(this._currentItem,{container:c._skinParts.virtualContainer,x:this._imageMaxWidth,y:this._imageMaxHeight},function(e){if(!e.getParent('[skinpart="virtualContainer"]')){e.insertInto(c._skinParts.virtualContainer)
}c._transitionToCurrentDisplayer(e)
})
},_transitionToCurrentDisplayer:function(c){if(this._inTransition){return
}this._inTransition=true;
c.setStyle("opacity","0.0");
var b=this._skinParts.itemsContainer;
var e=this;
var a=function(){for(var h=0;
h<b.childNodes.length;
h++){b.childNodes[h].destroy()
}b.empty();
var g=c.getStyles("width","height");
var f=e._getTopGap(g.height.replace("px",""));
b.adopt(c);
e._skinParts.virtualContainer.empty();
var j=new Fx.Morph(e._skinParts.dialogBox,{duration:e.transitionTime,link:"chain"});
j.addEvent("complete",function(){var k=new Fx.Tween(c,{duration:e.transitionTime,link:"chain"});
k.addEvent("complete",function(){e.unlock();
e._inTransition=false;
k.removeEvent("complete",arguments.callee)
});
k.start("opacity","1.0");
j.removeEvent("complete",arguments.callee)
});
j.start({width:g.width,"min-height":g.height,"margin-top":f+"px"});
if(d){d.removeEvent("complete",arguments.callee)
}};
if(b.hasChildNodes()){var d=new Fx.Tween(b.firstChild,{duration:e.transitionTime,link:"chain",property:"opacity"});
d.addEvent("complete",a);
d.start("0.0")
}else{a()
}},_changeImageNoTransition:function(b){var a=this._skinParts.itemsContainer;
var f=this;
for(var e=0;
e<a.childNodes.length;
e++){a.childNodes[e].destroy()
}a.empty();
var d=b.getStyles("width","height");
var c=f._getTopGap(d.height.replace("px",""));
a.adopt(b);
f._skinParts.virtualContainer.empty();
f._skinParts.dialogBox.setStyles({width:d.width,"min-height":d.height,"margin-top":c+"px"});
f.unlock()
}}});
W.Experiments.registerExperimentComponent("LazyShare","New",{name:"experiments.viewer.components.MediaZoomDisplayerLazyShare",traits:["mobile.core.components.traits.LinkableComponent"],skinParts:{title:{type:"htmlElement",optional:false},description:{type:"htmlElement",optional:false},link:{type:"htmlElement",optional:true},imageWrapper:{type:"htmlElement",command:"WViewerCommands.MediaZoom.Next"},image:{type:"mobile.core.components.Image",dataRefField:"*",optional:false,hookMethod:"_addImageArgs"},lazyShare:{type:"wysiwyg.viewer.components.LazySocialPanel",optional:false}},Class:{Extends:"wysiwyg.viewer.components.MediaZoomDisplayer",Binds:["_setCorrectImageSize"]}});
W.Experiments.registerExperimentComponent("ZoomWidth","BugFix",{name:"experiments.viewer.components.MediaZoomDisplayerZoomWidth",skinParts:{title:{type:"htmlElement",optional:false},description:{type:"htmlElement",optional:false},link:{type:"htmlElement",optional:true},imageWrapper:{type:"htmlElement",command:"WViewerCommands.MediaZoom.Next"},image:{type:"mobile.core.components.Image",dataRefField:"*",optional:false,hookMethod:"_addImageArgs"}},Class:{Extends:"wysiwyg.viewer.components.MediaZoomDisplayer",Binds:["_setCorrectImageSize"],_setCorrectImageSize:function(c){var a=c.y;
var b=this._getDisplayerWidth(c.x);
this._skinParts.imageWrapper.setStyles({width:b+"px",height:a+"px","min-width":"600px"});
this._skinParts.title.setStyles({"max-width":b,"word-wrap":"break-word"});
this._skinParts.description.setStyles({"max-width":b,"word-wrap":"break-word"})
}}});
W.Experiments.registerNewExperimentComponent("NewComps","New",{name:"wysiwyg.viewer.components.MessageView",imports:[],skinParts:{blockingLayer:{type:"htmlElement"},okButton:{type:"mobile.editor.components.EditorButton"},title:{type:"htmlElement"},description:{type:"htmlElement"},dialog:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_closeView"],initialize:function(c,a,b){this.parent(c,a,b)
},_onAllSkinPartsReady:function(a){a.okButton.setLabel("OK");
a.okButton.addEvent("buttonClick",this._closeView)
},_editModeChanged:function(b,a){this._closeView()
},showMessage:function(a){this.uncollapse();
this._skinParts.title.set("html",a.msgTitle||"");
this._skinParts.description.set("html",a.msgBody||"");
this._visible=true
},visible:function(){return this._visible
},_closeView:function(){this.collapse();
this._visible=false;
this.fireEvent("complete")
}}});
W.Experiments.registerExperimentComponent("GridLines","New",{name:"experiments.wysiwyg.viewer.components.PageGroupGridLinesNew",skinParts:merge({grid:undefined}),Class:{Extends:"wysiwyg.viewer.components.PageGroup",_states:[],Binds:["onCurrentPageResize","_resizePage","_onTransitionFinished"],toggleGrid:function(){},refreshGrid:function(){},_setHorizontalGrid:function(){},_setVerticalGrid:function(){},_resizePage:function(a){if(!a){a=this._currentPage.getLogic().getHeight()
}this.setHeight(a);
W.Layout.enforceAnchors([this])
}}});
W.Experiments.registerExperimentComponent("MasterPage","New",{name:"experiments.wysiwyg.viewer.components.PagesContainer",skinParts:{inlineContent:{type:"htmlElement"},screenWidthBackground:{type:"htmlElement"},bg:{type:"htmlElement"},centeredContent:{type:"htmlElement"}},Class:{Extends:"wysiwyg.viewer.components.PagesContainer",initialize:function(c,a,b){this.parent(c,a,b);
this.setMaxH(this.imports.Page.MAX_HEIGHT);
this.setMinH(this.imports.Page.MIN_HEIGHT);
this._resizableSides=[W.BaseComponent.ResizeSides.BOTTOM]
},getSelectableX:function(){return this.parent()
},getSelectableWidth:function(){return this.parent()
}}});
W.Experiments.registerExperimentComponent("Fix3713","New",{name:"experiments.wysiwyg.viewer.components.PaginatedGridGalleryFix3713",skinParts:clone(),imports:["wysiwyg.viewer.utils.MatrixTransitions","wysiwyg.viewer.utils.GalleryUtils","mobile.core.utils.LinkUtils"],traits:["wysiwyg.viewer.components.traits.GalleryAutoplay"],propertiesSchemaName:clone(),Class:{Extends:"wysiwyg.viewer.components.PaginatedGridGallery",_getNextPageItemIndex:function(){var a=this._currentItemIndex+this._pageItemsCount;
if(a>=this._numItems){a=0
}return a
},_getPrevPageItemIndex:function(){var a=this._currentItemIndex-this._pageItemsCount;
if(a<0){a=(this._getTotalPageCount()-1)*this._pageItemsCount
}return a
},_getTotalPageCount:function(){var a=Math.floor(this._numItems/this._pageItemsCount);
if((this._numItems%this._pageItemsCount)>0){a++
}return a
},_getCounterText:function(a,c){var b=Math.floor(a/this._pageItemsCount);
var d=this._getTotalPageCount();
return String(b+1)+"/"+String(d)
}}});
W.Experiments.registerExperimentComponent("GEM","New",{name:"experiments.wysiwyg.viewer.components.PaginatedGridGalleryGEM",skinParts:clone(),propertiesSchemaName:clone(),Class:{Extends:"wysiwyg.viewer.components.PaginatedGridGallery",_onAllSkinPartsReady:before(function(){var b=this.getComponentProperty("galleryImageOnClickAction");
var a=this.getComponentProperty("expandEnabled");
if(b==="unset"){if(a===false){this.setComponentProperty("galleryImageOnClickAction","disabled",true)
}else{this.setComponentProperty("galleryImageOnClickAction","zoomMode",true)
}this._updateGalleryImageOnClickAction()
}}),_isImageLinked:function(){var a=this._getHighlightedDisplayerData();
if(a){var b=a.get("href");
return !!b
}return false
},_getHighlightedDisplayerData:function(){if(this._highlightedDisplayer&&this._highlightedDisplayer.getLogic){return this._highlightedDisplayer.getLogic().getDataItem()
}return null
},_isImageClickable:function(){if(this._galleryImageOnClickAction==="goToLink"){return this._isImageLinked()
}else{return(this._galleryImageOnClickAction!=="disabled")
}},_onDataChange:before(function(a,b){this._updateGalleryImageOnClickAction()
}),_updateGalleryImageOnClickAction:function(){if(this.getComponentProperties().hasField("galleryImageOnClickAction")){this._galleryImageOnClickAction=this.getComponentProperty("galleryImageOnClickAction")
}else{this._galleryImageOnClickAction=this.getComponentProperty("expandEnabled")?"zoomMode":"disabled"
}},_checkSkinPartsVisibility:function(){if(this._skinParts){this._resetRollOver();
this._skinParts.buttonPrev.setStyle("visibility",this.getComponentProperty("showNavigation")?"visible":"hidden");
this._skinParts.buttonNext.setStyle("visibility",this.getComponentProperty("showNavigation")?"visible":"hidden");
this._skinParts.counter.setStyle("visibility",this.getComponentProperty("showCounter")?"visible":"hidden");
if(this._skinParts.rolloverHolder){this._skinParts.rolloverHolder.setStyle("cursor",this._isImageClickable()?"pointer":"default")
}this._skinParts.link.set("text",this.getComponentProperty("goToLinkText"))
}},_onMouseMove:function(b){if(this._transitionPending===true){return
}var c=this._findDisplayerFromPosition(b.page);
if(c&&this._skinParts.rolloverHolder&&this._hasRollOver){if(this._highlightedDisplayer!==c){this._highlightedDisplayer=c;
var a=c.getCoordinates(this._skinParts.rolloverHolder.getParent());
this._skinParts.rolloverHolder.setStyles({visibility:"visible",position:"absolute",padding:0,left:a.left,top:a.top,width:a.width,height:a.height});
this.setState("idle");
window.requestAnimFrame(function(){if(this._highlightedDisplayer){this._updateDisplayerInfo(c.getLogic().getDataItem());
var e=this._getHighlightedDisplayerData();
if(e.getType&&e.getType()==="Image"){var d=this.getSkinPart("link");
this._linkUtils.linkifyElement(this,d,e,true)
}this._skinParts.rolloverHolder.setStyle("cursor",this._isImageClickable()?"pointer":"default");
if(this._galleryImageOnClickAction=="goToLink"){this._skinParts.link.setStyle("display","none")
}else{this._skinParts.link.setStyle("display",(this._isImageLinked())?"block":"none")
}this.setState("rollover")
}}.bind(this))
}}else{this._resetRollOver()
}},_onClick:function(d){if(d.rightClick!==false){return
}var c;
if(this._galleryImageOnClickAction=="zoomMode"){var e=this._highlightedDisplayer||this._findDisplayer(d.target);
if(e){c=e.getLogic().getDataItem();
var f=c.get("id");
var b=this._data.get("items");
var a=b.indexOf("#"+f);
this.injects().Commands.executeCommand("WViewerCommands.OpenZoom",{itemsList:this._data,currentIndex:a,getDisplayerDivFunction:this.injects().Viewer.getDefaultGetZoomDisplayerFunction("Image"),getHashPartsFunction:this.injects().Viewer.getDefaultGetHashPartsFunction("Image")})
}}else{if(this._galleryImageOnClickAction=="goToLink"&&this._isImageLinked()){this._skinParts.link.click()
}}}}});
W.Experiments.registerExperimentComponent("WixApps","New",{name:"experiments.wysiwyg.viewer.components.PaginatedGridGalleryWixApps",skinParts:clone(),imports:["wysiwyg.viewer.utils.MatrixTransitions","wysiwyg.viewer.utils.GalleryUtils","mobile.core.utils.LinkUtils"],traits:["wysiwyg.viewer.components.traits.GalleryAutoplay"],propertiesSchemaName:clone(),Class:{Extends:"wysiwyg.viewer.components.PaginatedGridGallery",Binds:["_onRollOverViewCreated"],_rolloverSequencer:null,_hasRollOver:true,_fixedRowNumber:false,initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this._transitionUtils=new this.imports.MatrixTransitions();
this._linkUtils=new this.imports.LinkUtils();
this._view.addEvent(Constants.CoreEvents.MOUSE_MOVE,this._onMouseMove);
this._view.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onRollOut);
if("fixedRowNumber" in b){this._fixedRowNumber=(b.fixedRowNumber===true)
}if(b.sequencingHook===undefined){this._sequencer.resolveItem=function(){return{comp:"wysiwyg.viewer.components.ImageLite",skin:"mobile.core.skins.InlineSkin"}
}
}if(b.rolloverHook){this._rolloverSequencer=new this.imports.ComponentSequencer();
this._rolloverSequencer.resolveItem=b.rolloverHook;
this._rolloverSequencer.addEvent("componentSetup",this._onRollOverViewCreated)
}if(b.sequencingHook&&!b.rolloverHook){this._hasRollOver=false
}},getSequencer:function(){return this._sequencer
},_getRowNumber:function(){if(this._fixedRowNumber===true){return parseInt(this.getComponentProperty("maxRows"))
}else{return this.parent()
}},_translateRefList:function(d){var h;
var a=[];
var c;
var g;
var f=this._skinParts.itemsContainer.children;
var b=typeOf(d[0]);
d=d.slice(0);
for(var e=0;
e<f.length;
e++){h=f[e];
c=h.getLogic().getDataItem();
g=(b==="string")?"#"+c.get("id"):c;
if(d.contains(g)){a.push(h);
d.splice(d.indexOf(g),1)
}}return a
},_onDataChange:function(a,b){this._currentItemIndex=0;
this._pageItemsCount=parseInt(this.getComponentProperty("numCols")*this._getRowNumber());
if(this._componentReady&&a===this._data){this._skinParts.itemsContainer.empty()
}this._checkSkinPartsVisibility();
this.parent(a,b)
},_updateDisplayerInfo:function(a){if(this._skinParts.rolloverHolder&&this._rolloverSequencer){this._rolloverSequencer.createComponents(this._skinParts.rolloverHolder,[a])
}else{if(a&&a.getData&&"title" in a.getData()&&"description" in a.getData()){this._skinParts.title.set("text",a.get("title"));
this._skinParts.description.set("text",a.get("description"))
}}},_onRollOverViewCreated:function(a){this._setupItem(a.compView)
},_onMouseMove:function(b){if(this._transitionPending===true){return
}var c=this._findDisplayerFromPosition(b.page);
if(c&&this._skinParts.rolloverHolder&&this._hasRollOver){if(this._highlightedDisplayer!==c){this._highlightedDisplayer=c;
var a=c.getCoordinates(this._skinParts.rolloverHolder.getParent());
this._skinParts.rolloverHolder.setStyles({visibility:"visible",position:"absolute",padding:0,left:a.left,top:a.top,width:a.width,height:a.height});
this.setState("idle");
window.requestAnimFrame(function(){if(this._highlightedDisplayer){this._updateDisplayerInfo(c.getLogic().getDataItem());
var e=this._highlightedDisplayer.getLogic().getDataItem();
if(e.getType&&e.getType()==="Image"){var d=this.getSkinPart("link");
this._linkUtils.linkifyElement(this,d,e,true)
}this.setState("rollover")
}}.bind(this))
}}else{this._resetRollOver()
}},_onDisplayerCreation:function(c,e,b){var a=c.getViewNode();
this._setupItem(a);
var d;
if(c.getRef){d=c.getRef()
}else{d="#"+c.getDataItem().get("id")
}a.addClass("galleryDisplayer");
this._displayerDict[d]=c;
if(b>=this._displayedItems.length){a.setStyles({top:-this._itemHeight*1.5,position:"absolute"})
}},_getNextPageItemIndex:function(){var a=this._currentItemIndex+this._pageItemsCount;
if(a>=this._numItems){a=0
}return a
},_getPrevPageItemIndex:function(){var a=this._currentItemIndex-this._pageItemsCount;
if(a<0){a=(this._getTotalPageCount()-1)*this._pageItemsCount
}return a
},_getTotalPageCount:function(){var a=Math.floor(this._numItems/this._pageItemsCount);
if((this._numItems%this._pageItemsCount)>0){a++
}return a
},_getCounterText:function(a,c){var b=Math.floor(a/this._pageItemsCount);
var d=this._getTotalPageCount();
if(!d){d=1
}return String(b+1)+"/"+String(d)
}}});
W.Experiments.registerNewExperimentComponent("PageSecurity","New",{name:"wysiwyg.viewer.components.PasswordLogin",imports:[],skinParts:{blockingLayer:{type:"htmlElement"},passwordInput:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindPasswordField"},submitButton:{type:"htmlElement"},xButton:{type:"htmlElement",command:"WViewerCommands.PasswordLogin.Close"},cancel:{type:"htmlElement"},favIcon:{type:"htmlElement"},header:{type:"htmlElement"},title:{type:"htmlElement"},dialog:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["centerDialog","_onSubmit","_reportError","_invalidateErrorState","_onKeyPress","_handleCancel","_onPasswordSuccess"],initialize:function(c,a,b){this.parent(c,a,b);
this.VIEWER_STRINGS={LOGIN_HEADER:"Enter password to view this page",LOGIN_ERR_GENERAL:"Server error - Unable to log in",LOGIN_ERR_WRONG_PASSWORD:"Please enter the correct password",PASSWORD_LABEL:"Password"};
this._digestedPassword=b&&b.digestedPassword;
this._authCallback=b&&b.authCallback;
this._disableCancel=b&&b.disableCancel
},centerDialog:function(){var b=this.injects().Utils.getWindowSize();
var a=this._skinParts.dialog;
a.setPosition({x:(b.width/2)-(a.getSize().x/2),y:(b.height/2)-(a.getSize().y/2)})
},_onAllSkinPartsReady:function(b){if(this._disableCancel){b.xButton.hide();
b.cancel.setStyle("visibility","hidden")
}else{b.cancel.addEvent("click",this._handleCancel);
b.xButton.addEvent("click",this._handleCancel);
b.blockingLayer.addEvent("click",function(){if(event.target==b.blockingLayer){this._handleCancel()
}}.bind(this))
}b.submitButton.addEvent("click",this._onSubmit);
b.title.set("text",this.VIEWER_STRINGS.LOGIN_HEADER);
var a=(window.publicModel&&window.publicModel.favicon);
if(a){b.favIcon.src=this.injects().Config.getMediaStaticUrl(a)+a
}b.passwordInput.addEvent(Constants.CoreEvents.KEY_UP,this._onKeyPress)
},_handleCancel:function(){this.injects().Commands.executeCommand("WViewerCommands.PasswordLogin.Close",null,null);
this._reportAuthStatusChange(false,{cancel:true})
},_reportAuthStatusChange:function(b,a){if(this._authCallback){this._authCallback({authResponse:b,data:a})
}},_editModeChanged:function(b,a){this._handleCancel()
},_onKeyPress:function(a){if(a.code==13){this._onSubmit()
}this._invalidateErrorState()
},_onSubmit:function(){this._invalidateErrorState();
var a=this._skinParts.passwordInput._data.get("text");
this._validatePassword(a,function(){this._invalidateErrorState();
this._onPasswordSuccess()
}.bind(this),function(b){this._reportError(b)
}.bind(this))
},_onPasswordSuccess:function(){this.injects().Commands.executeCommand("WViewerCommands.PasswordLogin.Close",null,null);
this._reportAuthStatusChange(true)
},_validatePassword:function(a,d,b){if(this._digestedPassword){var c=W.Utils.hashing.SHA256.b64_sha256(a);
if(c==this._digestedPassword){d()
}else{b(this.VIEWER_STRINGS.LOGIN_ERR_WRONG_PASSWORD)
}}},_reportError:function(a){this._skinParts.passwordInput.setError(a)
},_invalidateErrorState:function(){this._skinParts.passwordInput.setValidationState(true)
},_bindPasswordField:function(a){a.argObject={label:this.VIEWER_STRINGS.PASSWORD_LABEL,passwordField:true};
a.dataItem=this.injects().Data.createDataItem({text:"",type:"Text"},"Text");
return a
}}});
W.Experiments.registerExperimentComponent("GridLines","New",{name:"experiments.wysiwyg.viewer.components.ScreenWidthContainerGridLines",skinParts:clone(),Class:{Extends:"wysiwyg.viewer.components.ScreenWidthContainer",_onResize:function(){this.parent()
}}});
W.Experiments.registerNewExperimentComponent("NewComps","New",{name:"wysiwyg.viewer.components.SelectableSliderGallery",skinParts:{imageItem:{type:"wysiwyg.viewer.components.Displayer",repeater:true,container:"itemsContainer",dataRefField:"items"},itemsContainer:{type:"htmlElement"},swipeLeftHitArea:{type:"htmlElement"},swipeRightHitArea:{type:"htmlElement"}},Class:{Extends:"wysiwyg.viewer.components.SliderGallery",_selectedItem:null,initialize:function(c,a,b){this._expandEnabled=false;
this._initialSelectedIndex=0;
if(b.selectedIndex){this._initialSelectedIndex=b.selectedIndex
}this.parent(c,a,b)
},_setupDisplayer:function(a,b){this.parent(a);
if(b===this._initialSelectedIndex){this.setSelectedState(a)
}a.addEvent("itemSelected",function(){this.setSelectedState(a);
this.fireEvent("imageSelected",a.getDataItem())
}.bind(this))
},setSelectedState:function(a){if(this._selectedItem){if(this._selectedItem===a){return
}this._selectedItem.setSelected(false)
}this._selectedItem=a;
this._selectedItem.setSelected(true)
}}});
W.Experiments.registerExperimentComponent("NewComps","New",{name:"experiments.wysiwyg.viewer.components.SiteButtonNewComps",skinParts:clone(),propertiesSchemaName:"ButtonProperties",Class:{Extends:"wysiwyg.viewer.components.SiteButton",_onMouseDown:function(a){if(this.isEnabled()&&this.getState()!="selected"){this.setState("pressed");
this.fireEvent(Constants.CoreEvents.MOUSE_DOWN,a)
}else{if(!this.isEnabled()){return this._cancelEvent(a)
}}},_onClick:function(b){if(this.isEnabled()){b.target=this.getViewNode();
this.fireEvent(Constants.CoreEvents.CLICK,b);
if(this._toggleMode){var a=(this.getState()!="selected")?"selected":"over";
this.setState(a)
}}else{return this._cancelEvent(b)
}},_cancelEvent:function(a){a.stopPropagation();
a.preventDefault();
return false
},_onDisabled:function(){var a=this._skinParts.view;
a.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._onOver);
a.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onOut);
a.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp)
}}});
W.Experiments.registerExperimentComponent("GEM","New",{name:"experiments.wysiwyg.viewer.components.SlideShowGalleryGEM",skinParts:clone(),propertiesSchemaName:clone(),Class:{Extends:"wysiwyg.viewer.components.SlideShowGallery",_onAllSkinPartsReady:before(function(){var b=this.getComponentProperty("galleryImageOnClickAction");
var a=this.getComponentProperty("expandEnabled");
if(b==="unset"){if(a===false){this.setComponentProperty("galleryImageOnClickAction","disabled",true)
}else{this.setComponentProperty("galleryImageOnClickAction","zoomMode",true)
}}})}});
W.Experiments.registerExperimentComponent("SliderAutoPlay","New",{name:"experiments.viewer.components.SliderGallerySliderAutoPlay",skinParts:{imageItem:{type:"wysiwyg.viewer.components.Displayer",repeater:true,container:"itemsContainer",dataRefField:"items"},itemsContainer:{type:"htmlElement"},swipeLeftHitArea:{type:"htmlElement"},swipeRightHitArea:{type:"htmlElement"}},propertiesSchemaName:"SliderGalleryProperties",traits:["mobile.core.components.traits.SwipeSupport","wysiwyg.viewer.components.traits.GalleryAutoplay"],Class:{EDITOR_META_DATA:{general:{settings:true,design:true},custom:[{label:"GALLERY_ORGANIZE_PHOTOS",command:"WEditorCommands.OpenListEditDialog",commandParameter:{galleryConfigID:"SliderGallery"},commandParameterDataRef:"SELF"}]},Extends:"wysiwyg.viewer.components.SliderGallery",Binds:["gotoNext","gotoPrev","_updateMovementNoLoop","_updateMovementInLoop","_stopMovement"],_states:{autoplay:["on","off"]},_itemHolder:null,_itemWidth:0,_itemHeight:0,_gap:20,_movementSpeed:0,_shiftOffset:0,_shiftOffsetMax:0,_shiftOffsetMin:0,_maxSpeed:0.05,_aspectRatio:0,_movementActive:false,_debugMode:false,_imageMode:"",_lastUpdate:NaN,_updateMovementFunc:null,_loop:false,_itemsHolderSize:0,_contentOverflow:false,_segment:0,_isZoomed:false,initialize:function(c,a,b){this.parent(c,a,b);
this.addEvent("resizeEnd",this._onResizeEnd);
this.injects().Commands.registerCommandListenerByName("WPreviewCommands.WEditModeChanged",this,this._onChangeMode,null)
},_onChangeMode:function(a){if(a!=="PREVIEW"){this._stopMovement()
}},_onResizeEnd:function(){this._recalcItemSize();
this._allRepeatersReady=false;
this._renderIfReady()
},_recalcItemSize:function(){if(this._skinParts){this._itemHeight=Math.floor(this._skinParts.itemsContainer.getHeight());
this._itemWidth=Math.floor(this._itemHeight*this._aspectRatio)
}},_processDataRefs:function(a){if(this._loop===true){return a.concat(a)
}else{return a
}},_onDataChange:function(a){this._enableMovement(false);
this._aspectRatio=this._parseAspectRatioPreset(this.getComponentProperty("aspectRatioPreset"));
if(this._aspectRatio){this.setComponentProperty("aspectRatio",this._aspectRatio,true)
}else{this._aspectRatio=parseFloat(this.getComponentProperty("aspectRatio"))
}this._loop=this.getComponentProperty("loop")===true;
this._maxSpeed=parseInt(this.getComponentProperty("maxSpeed"));
this._imageMode=String(this.getComponentProperty("imageMode"));
this._gap=parseInt(this.getComponentProperty("margin"));
this.parent()
},_parseAspectRatioPreset:function(c){var a=c.split(":");
var b=0;
if(a.length==2){b=parseFloat(a[0])/parseFloat(a[1])
}return b
},_onAllSkinPartsReady:function(){this._itemHolder=this._skinParts.itemsContainer;
this._itemHolder.setStyles({position:"absolute",left:"0px",right:"0px",top:"0px",bottom:"0px","white-space":"nowrap","-webkit-transform":"translateZ(0)"});
this._skinParts.itemsContainer.setStyles({overflow:(this._debugMode)?"visible":"hidden",border:(this._debugMode)?"1px solid black":"0"});
this.injects().Commands.registerCommandListenerByName("WViewerCommands.SetMediaZoomImage",this,this._onMediaZoomClicked,null);
this.injects().Commands.registerCommandListenerByName("WViewerCommands.MediaZoom.Close",this,this._onMediaZoomClosed,null);
this._skinParts.itemsContainer.addEvent(Constants.CoreEvents.MOUSE_OVER,function(){this._stopMovement(1)
}.bind(this));
if(this.getComponentProperties().getData().autoplay){this._hideSwipeArea()
}else{this._showSwipeArea()
}this.injects().ComponentData.addEvent(Constants.DataEvents.DATA_CHANGED,function(a){a.getData().autoplay?this._hideSwipeArea():this._showSwipeArea()
}.bind(this));
this.injects().ComponentData.addEvent(Constants.DataEvents.DATA_CHANGED,function(){this._bindAutoPlayControls()
}.bind(this))
},_showSwipeArea:function(){this._skinParts.swipeLeftHitArea.uncollapse();
this._skinParts.swipeRightHitArea.uncollapse();
this._bindSwipeAreas();
this._unbindAutoPlayControls()
},_hideSwipeArea:function(){this._skinParts.swipeLeftHitArea.collapse();
this._skinParts.swipeRightHitArea.collapse();
this._unbindSwipeAreas();
this._bindAutoPlayControls()
},_bindSwipeAreas:function(){this.setState("off","autoplay");
this._skinParts.swipeLeftHitArea.addEvent(Constants.CoreEvents.MOUSE_MOVE,this.gotoPrev);
this._skinParts.swipeRightHitArea.addEvent(Constants.CoreEvents.MOUSE_MOVE,this.gotoNext);
this._skinParts.swipeLeftHitArea.addEvent(Constants.CoreEvents.MOUSE_OUT,this._stopMovement);
this._skinParts.swipeRightHitArea.addEvent(Constants.CoreEvents.MOUSE_OUT,this._stopMovement)
},_unbindSwipeAreas:function(){this.setState("on","autoplay");
this._skinParts.swipeLeftHitArea.removeEvent(Constants.CoreEvents.MOUSE_MOVE,this.gotoPrev);
this._skinParts.swipeRightHitArea.removeEvent(Constants.CoreEvents.MOUSE_MOVE,this.gotoNext);
this._skinParts.swipeLeftHitArea.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._stopMovement);
this._skinParts.swipeRightHitArea.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._stopMovement)
},_bindAutoPlayControls:function(){if(this.getComponentProperties().getData().autoPlayDirection=="LTR"){this._skinParts.itemsContainer.removeEvent(Constants.CoreEvents.MOUSE_OUT,this.gotoNext);
this._skinParts.itemsContainer.addEvent(Constants.CoreEvents.MOUSE_OUT,this.gotoPrev)
}else{this._skinParts.itemsContainer.removeEvent(Constants.CoreEvents.MOUSE_OUT,this.gotoPrev);
this._skinParts.itemsContainer.addEvent(Constants.CoreEvents.MOUSE_OUT,this.gotoNext)
}},_unbindAutoPlayControls:function(){this._view.removeEvent(Constants.CoreEvents.MOUSE_OUT,this.gotoNext);
this._view.removeEvent(Constants.CoreEvents.MOUSE_OUT,this.gotoPrev);
this._view.addEvent(Constants.CoreEvents.MOUSE_OUT,this._stopMovement)
},_onMediaZoomClicked:function(){this._isZoomed=true;
this._stopMovement(0)
},_onMediaZoomClosed:function(){this._isZoomed=false;
this._enableMovement(true);
if(this.getComponentProperties().getData().autoplay){if(this.getComponentProperties().getData().autoPlayDirection=="LTR"){this.gotoPrev()
}else{this.gotoNext()
}return
}if(this._skinParts.zoom){this._skinParts.zoom.fireEvent("mosuseout")
}},getAcceptableDataTypes:function(){return["ImageList"]
},render:function(){var a;
this._recalcItemSize();
this._updateMovementFunc=(this._loop===true)?this._updateMovementInLoop:this._updateMovementNoLoop;
if(this._loop===false){this._segment=0
}this._shiftOffset=0;
this._itemsHolderSize=0;
for(a=0;
a<this._itemHolder.children.length;
a++){this._setupDisplayer(this._itemHolder.children[a].getLogic());
this._itemsHolderSize+=this._itemHolder.children[a].getLogic().getWidth()+this._gap
}this._checkItemsVisibility();
this._applyShiftOffset()
},_checkItemsVisibility:function(){var b=this._itemHolder.children.length/2;
var a=(this._loop===true?this._itemsHolderSize/2:this._itemsHolderSize);
this._contentOverflow=(a>this._skinParts.itemsContainer.getWidth());
if(this._loop===true&&this._contentOverflow===false){this._segment=0
}for(i=0;
i<this._itemHolder.children.length;
i++){if(this._loop===true&&this._contentOverflow===false&&i>=b){this._itemHolder.children[i].setStyle("opacity","0.0")
}else{this._itemHolder.children[i].setStyle("opacity","1.0")
}}},_setupDisplayer:function(a){a.invalidateSize();
a.setSize(this._itemWidth,this._itemHeight,this._imageMode);
a.setOwner(this);
a.getViewNode().setStyles({position:"static",display:"inline-block","vertical-align":"top","margin-right":String(this._gap)+"px","margin-left":"0px",opacity:"1.0"})
},_moveToRight:function(){if(this._contentOverflow){this._setMovementSpeed(this._maxSpeed);
this._enableMovement(true)
}},_moveToLeft:function(){if(this._contentOverflow){this._setMovementSpeed(-this._maxSpeed);
this._enableMovement(true)
}},gotoNext:function(){if(this._isZoomed){return
}if(this._contentOverflow){this._setMovementSpeed(this._maxSpeed);
this._enableMovement(true)
}},gotoPrev:function(){if(this._isZoomed){return
}if(this._contentOverflow){this._setMovementSpeed(-this._maxSpeed);
this._enableMovement(true)
}},_enableMovement:function(a){if(a===true&&this._movementActive===false){window.requestAnimFrame(this._updateMovementFunc)
}if(a===true){if(!this._movementActive){this._shiftOffsetMin=-(this._itemsHolderSize-this._skinParts.itemsContainer.getWidth()-this._gap);
this._movementActive=true
}}else{this._movementActive=false;
this._movementSpeed=0
}},_stopMovement:function(a){var b=this.injects().Utils.Tween;
b.to(this,a===undefined?1:a,{_movementSpeed:0,onComplete:function(){this.getState("autoplay")==="off"?this._enableMovement(false):this._enableMovement(true)
}.bind(this)})
},_setMovementSpeed:function(a){var b=this.injects().Utils.Tween;
b.to(this,1,{_movementSpeed:a})
},_calcMovementCoeficient:function(){var b=1;
var a=new Date().getTime();
if(!isNaN(this._lastUpdate)){b=((a-this._lastUpdate)/16)
}this._lastUpdate=a;
return 1
},_updateMovementNoLoop:function(){var a=this._calcMovementCoeficient();
if(this._movementActive){this._shiftOffset+=-this._movementSpeed*a;
if(this._shiftOffset>this._shiftOffsetMax){this._shiftOffset=this._shiftOffsetMax;
this._enableMovement(false)
}if(this._shiftOffset<this._shiftOffsetMin){this._shiftOffset=this._shiftOffsetMin;
this._enableMovement(false)
}this._applyShiftOffset()
}if(this._movementActive){window.requestAnimFrame(this._updateMovementFunc)
}},_updateMovementInLoop:function(){var a=this._calcMovementCoeficient();
if(this._movementActive){this._shiftOffset+=-this._movementSpeed*a;
if(this._movementSpeed<0){this._segment=0;
if(this._shiftOffset>(this._shiftOffsetMax)){this._shiftOffset-=this._itemsHolderSize/2
}}if(this._movementSpeed>0){this._segment=1;
if(this._shiftOffset<0){this._shiftOffset+=this._itemsHolderSize/2
}}this._applyShiftOffset()
}if(this._movementActive){window.requestAnimFrame(this._updateMovementFunc)
}},_applyShiftOffset:function(){var a=this._shiftOffset-(this._segment*this._itemsHolderSize/2);
if(this._itemHolder.children.length>0){this._itemHolder.children[0].setStyle("margin-left",String(Math.floor(a))+"px")
}}}});
W.Experiments.registerExperimentComponent("GEM","New",{name:"experiments.wysiwyg.viewer.components.SliderGalleryGEM",skinParts:clone(),propertiesSchemaName:clone(),Class:{Extends:"wysiwyg.viewer.components.SliderGallery",_onAllSkinPartsReady:before(function(){var b=this.getComponentProperty("galleryImageOnClickAction");
var a=this.getComponentProperty("expandEnabled");
if(b==="unset"){if(a===false){this.setComponentProperty("galleryImageOnClickAction","disabled",true)
}else{this.setComponentProperty("galleryImageOnClickAction","zoomMode",true)
}}})}});
W.Experiments.registerExperimentComponent("NewComps","New",{name:"experiments.wysiwyg.viewer.components.SliderGalleryNewComps",skinParts:clone(),propertiesSchemaName:"SliderGalleryProperties",Class:{Extends:"wysiwyg.viewer.components.SliderGallery",render:function(){var a;
this._recalcItemSize();
this._updateMovementFunc=(this._loop===true)?this._updateMovementInLoop:this._updateMovementNoLoop;
if(this._loop===false){this._segment=0
}this._shiftOffset=0;
this._itemsHolderSize=0;
for(a=0;
a<this._itemHolder.children.length;
a++){this._setupDisplayer(this._itemHolder.children[a].getLogic(),a);
this._itemsHolderSize+=this._itemHolder.children[a].getLogic().getWidth()+this._gap
}this._checkItemsVisibility();
this._applyShiftOffset()
},_setupDisplayer:function(a,b){a.invalidateSize();
a.setSize(this._itemWidth,this._itemHeight,this._imageMode);
a.setOwner(this);
a.getViewNode().setStyles({position:"static",display:"inline-block","vertical-align":"top","margin-right":String(this._gap)+"px","margin-left":"0px",opacity:"1.0"})
}}});
W.Experiments.registerNewExperimentComponent("NewComps","New",{name:"wysiwyg.viewer.components.TableComponent",skinParts:{tableBody:{type:"htmlElement"},tableHeader:{type:"htmlElement",optional:true},tableFooter:{type:"htmlElement",optional:true},table:{type:"htmlElement",optional:true}},imports:["wysiwyg.viewer.components.ComponentSequencer"],propertiesSchemaName:"TableComponentProperties",Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_createBodyRow","_createHeaderCell","_createFooterCell","_createBodyCell","_addSpacerRow"],initialize:function(c,a,b){this.parent(c,a,b);
this._rowsSequencer=new this.imports.ComponentSequencer();
this._rowsSequencer.resolveItem=this._createBodyRow;
this._rowsSequencer.addEvent("productionFinished",this._addSpacerRow);
this._bodyCellSequencingHook=b.SequencingHook;
this._headerFooterCellSequencingHook=b.HeaderFooterSequencingHook||b.SequencingHook
},_onAllSkinPartsReady:function(a){this.parent(a);
var b=this.getComponentProperty("minHeight");
if(b){this.setMinH(b)
}if(this.getDataItem()){this._populateTable()
}},_onComponentPropertyChange:function(b,a){if(b==="minHeight"){this.setMinH(a)
}},setMinH:function(a){if(this._skinParts){this._skinParts.table.setStyle("height",a+"px")
}this.parent(a);
this.setHeight(a)
},_onDataChange:function(a,c,b){if(this._skinParts){if(c=="minHeight"){this.setMinH(b.minHeight||b)
}else{this._populateTable();
this.fireEvent("autoSized",{ignoreLayout:false})
}}this.parent(a,c,b)
},_populateTable:function(){var a=this.getDataItem();
this._rowsSequencer.createComponents(this._skinParts.tableBody,a.get("items"));
if(a.hasField("header")){var c=this._createRow(a.get("header"),this._createHeaderCell);
this._skinParts.tableHeader.empty().adopt(c)
}else{this._skinParts.tableHeader.removeFromDOM()
}if(a.hasField("footer")){var b=this._createRow(a.get("footer"),this._createFooterCell);
this._skinParts.tableFooter.empty().adopt(b)
}else{this._skinParts.tableFooter.removeFromDOM()
}},_createBodyRow:function(a){return this._createRow(a,this._createBodyCell)
},_createRow:function(d,a){var c=new Element("tr");
var b=new this.imports.ComponentSequencer();
b.resolveItem=a;
b.createComponents(c,d);
return c
},_createHeaderCell:function(a,b,c){return this._createCell(a,b,c,"th",this._headerFooterCellSequencingHook)
},_createFooterCell:function(a,b,c){return this._createCell(a,b,c,"td",this._headerFooterCellSequencingHook)
},_createBodyCell:function(a,b,c){return this._createCell(a,b,c,"td",this._bodyCellSequencingHook)
},_createCell:function(d,e,g,a,c){var b=new Element(a);
var h=c(d,e,g);
if(h){b.grab(h)
}var f=d.styleData;
if(f){for(var j in f){b.setStyle(j,f[j])
}}return b
},_addSpacerRow:function(){var a=new Element("tr",{"class":"spacer"});
var b=new Element("td",{colspan:"100%"});
a.adopt(b);
this._skinParts.tableBody.adopt(a);
this.fireEvent("autoSized",{ignoreLayout:false})
},getAcceptableDataTypes:function(){return["list","Table"]
}}});
W.Experiments.registerExperimentComponent("likefix","New",{name:"experiments.wysiwyg.viewer.components.WFacebookLike",skinParts:clone(),propertiesSchemaName:"WFacebookLikeProperties",Class:{Extends:"wysiwyg.viewer.components.WFacebookLike",_getLikeUrl:function(){if(this.injects().Viewer.isPublicMode()){var a=window.publicModel["externalBaseUrl"]||location.protocol+"//"+location.host+location.pathname;
if(this.injects().Viewer.isHomePage()){return a
}else{return a+location.hash
}}else{return"http://www.wix.com/create/website"
}}}});
W.Experiments.registerExperimentComponent("PhotoLayoutFix","New",{name:"experiments.wysiwyg.viewer.components.WPhotoPhotoLayoutFix",imports:["mobile.core.components.image.ImageSettings","mobile.core.components.image.ImageDimensionsNew"],skinParts:clone(),propertiesSchemaName:"WPhotoProperties",traits:["mobile.core.components.traits.LinkableComponent"],Class:{Extends:"wysiwyg.viewer.components.WPhoto",Static:merge({_autoSizeStates:{none:1,autoSizeNoLayoutUpdate:2,autoSizeUpdateLayout:3}}),initialize:function(c,a,b){this._imageDimensions=new this.imports.ImageDimensionsNew();
this._SettingsClass=this.imports.ImageSettings;
this.parent(c,a,b);
if(b&&b.props){this.setComponentProperties(b.props)
}this._contentPadding={x:0,y:0};
this._autoSizeState=this._autoSizeStates.none;
this._initialDataChange=true
},_onDataChange:function(a,d,c){if(this._skinParts&&d=="title"){this._setTitle()
}if(d=="displayMode"){var b=this._translateDisplayModeToImageCropMode(c.displayMode);
this._getImageSettings().setCropMode(b)
}if(!this._initialDataChange&&this._isFitMode()&&(d=="displayMode"||!d)){this._autoSizeState=this._autoSizeStates.autoSizeUpdateLayout
}this._initialDataChange=false;
this.parent(a,d,c)
},setWidth:function(b,a,d,c){if(!b||isNaN(b)){return
}if(!c&&this._getDisplayMode()=="fitHeightStrict"){return
}this._getImageSettings().setContainerWidth(b-this._getContentPaddingSize().x);
this.parent(b,a,d);
if(!c){if(this._getImageDisplayMode()==this._SettingsClass.CropModes.FIT_HEIGHT&&this._isDisplayed){this._getImageSettings().setCropMode(this._SettingsClass.CropModes.FIT_WIDTH);
this._autoSizeState=this._autoSizeStates.autoSizeNoLayoutUpdate
}this._renderImage()
}},setHeight:function(b,a,d,c){if(!b||isNaN(b)){return
}if(!c&&this._getDisplayMode()=="fitWidthStrict"){return
}this.parent(b,a,d);
this._getImageSettings().setContainerHeight(b-this._getContentPaddingSize().y);
if(!c){if(this._getImageDisplayMode()==this._SettingsClass.CropModes.FIT_WIDTH&&this._isDisplayed){this._getImageSettings().setCropMode(this._SettingsClass.CropModes.FIT_HEIGHT);
this._autoSizeState=this._autoSizeStates.autoSizeNoLayoutUpdate
}this._renderImage()
}},render:function(){this._styleChanged();
this._renderImage();
this.parent()
},_renderImage:function(){var b=this._skinParts.img;
if(!b||!b.getOriginalClassName){return
}var a=this._getImageSettings();
b.setSettings(a);
if(a.getCropMode()==a.CropModes.FIT_WIDTH){this.setHeight(b.getSize().y+this._getContentPaddingSize().y,false,false,true)
}else{if(a.getCropMode()==a.CropModes.FIT_HEIGHT){this.setWidth(b.getSize().x+this._getContentPaddingSize().x,false,false,true)
}}this._fireAutoSize()
},_fireAutoSize:function(){if(this._autoSizeState!=this._autoSizeStates.none){this.fireEvent("autoSized",{ignoreLayout:this._autoSizeState==this._autoSizeStates.autoSizeNoLayoutUpdate});
this._autoSizeState=this._autoSizeStates.none
}},allowHeightLock:function(){return !this._isFitMode()
},_isFitMode:function(){var a=["fitWidth","fitWidthStrict","fitHeightStrict"];
return a.indexOf(this._getDisplayMode())>=0
}}});
W.Experiments.registerNewExperimentComponent("NewComps","New",{name:"wysiwyg.viewer.components.inputs.ColorOption",skinParts:{tooltip:{type:"wysiwyg.viewer.components.InfoTip"}},Class:{Extends:"wysiwyg.viewer.components.inputs.TextOption",_onAllSkinPartsReady:function(){this.getViewNode().setStyle("background-color",this.getDataItem().get("text"));
this._initializeTooTip(this.getViewNode())
}}});
W.Experiments.registerNewExperimentComponent("NewComps","New",function(){return{name:"wysiwyg.viewer.components.inputs.NumberInput",propertiesSchemaName:"NumberInputProperties",Class:{Extends:"wysiwyg.viewer.components.inputs.TextInput",_origValue:null,_prevValue:null,_valueChanged:true,_onAllSkinPartsReady:function(){this.parent();
this._origValue=this._getValue();
this._prevValue=this._origValue;
this._skinParts.input.setAttribute("min",this.getComponentProperty("minValue"));
this._skinParts.input.setAttribute("max",this.getComponentProperty("maxValue"))
},_changeEventHandler:function(d){if(d.code&&!W.Utils.isInputKey(d.code)){return
}var c=this._getValue();
var a=this._getValidValue();
if(c&&c!=a&&this._valueChanged){this._valueChanged=false;
this.fireEvent("validationFailed",{evt:d,value:c,validValue:a})
}if(a!=this._prevValue){this._prevValue=a;
a=this.injects().Utils.convertToHtmlText(a);
var b={value:a,origEvent:d,compLogic:this};
this.fireEvent("inputChanged",b)
}},_fireBlur:function(a){this._setValidValue();
this.parent(a)
},_fireKeyUp:function(a){if(a.code=="13"){this._setValidValue()
}this.parent(a)
},_getValidValue:function(){var a=this._getValue();
if(!a){a=this._origValue
}else{if(a<this.getComponentProperty("minValue")){a=this.getComponentProperty("minValue")
}else{if(a>this.getComponentProperty("maxValue")){a=this.getComponentProperty("maxValue")
}}}return a
},_setValidValue:function(){var a=this._skinParts.input;
a.set("value",this._getValidValue());
this._valueChanged=true
}}}
});
W.Experiments.registerNewExperimentComponent("NewComps","New",{name:"wysiwyg.viewer.components.inputs.OptionsListInput",skinParts:{},traits:["wysiwyg.viewer.components.traits.ValidationSettings"],imports:["wysiwyg.viewer.components.ComponentSequencer"],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onItemSelected"],_states:{validity:["valid","invalid"]},_selectedItem:null,initialize:function(c,a,b){this.parent(c,a,b);
this._sequencer=new this.imports.ComponentSequencer();
if(b){this._sequencer.resolveItem=function(){return{comp:b.compType,skin:b.compSkin}
}
}},_onAllSkinPartsReady:function(){},_preventRenderOnDataChange:function(a,c,b){return c=="selected"
},_prepareForRender:function(){this._sequencer.addEvent("productionFinished",function(a){this._onSequencerFinished(a)
}.bind(this));
this._sequencer.createComponents(this.getViewNode(),this.getDataItem().get("items"));
return true
},_onSequencerFinished:function(b){var a=b.elements;
a.forEach(function(d){var c=d.getLogic();
c.addEvent("itemSelected",this._onItemSelected);
if(c.getDataItem()===this.getDataItem().get("selected")){this._selectedItem=c;
this._selectedItem.setSelected(true)
}}.bind(this))
},_onItemSelected:function(a){if(this._selectedItem){if(this._selectedItem===a){return
}this._selectedItem.setSelected(false)
}this._selectedItem=a;
this._selectedItem.setSelected(true);
var b=this._selectedItem.getDataItem();
this.setValidationState(true);
this.getDataItem().set("selected",b);
this.fireEvent("selectionChanged",b)
},setValidationState:function(a){this.setState(a?"valid":"invalid","validity");
this.parent(a)
},getAcceptableDataTypes:function(){return["SelectableList"]
}}});
W.Experiments.registerNewExperimentComponent("NewComps","New",{name:"wysiwyg.viewer.components.inputs.TextAreaInput",skinParts:{textarea:{type:"htmlElement"}},traits:["wysiwyg.viewer.components.traits.ValidationSettings"],Class:{Extends:"wysiwyg.viewer.components.inputs.TextInput",Binds:["_checkMaxLength"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._maxLength=b.maxLength||""
},_onAllSkinPartsReady:function(){var a=this._skinParts.textarea;
a.set("value",this.getDataItem().get("text"));
this.addEvent("inputChanged",function(b){this.getDataItem().set("text",b.value)
}.bind(this));
if(this._maxLength){a.setProperty("maxlength",this._maxLength);
if(Browser.ie){a.addEvent(Constants.CoreEvents.KEY_UP,this._checkMaxLength)
}}this._listenToInput()
},_checkMaxLength:function(d){var a=this._skinParts.textarea.get("value");
var b=a.length;
if(a.length>this._maxLength){var c=this._maxLength-b;
a=a.slice(0,c);
this._skinParts.textarea.set("value",a)
}},_changeEventHandler:function(a){if(a.code==13){return false
}this.parent(a)
},_listenToInput:function(){this._skinParts.textarea.addEvent(Constants.CoreEvents.KEY_UP,this._changeEventHandler);
this._skinParts.textarea.addEvent(Constants.CoreEvents.KEY_UP,this._fireKeyUp);
this._skinParts.textarea.addEvent(Constants.CoreEvents.CUT,this._changeEventHandler);
this._skinParts.textarea.addEvent(Constants.CoreEvents.PASTE,this._changeEventHandler);
this._skinParts.textarea.addEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler);
this._skinParts.textarea.addEvent(Constants.CoreEvents.BLUR,this._fireBlur)
},_stopListeningToInput:function(){this._skinParts.textarea.removeEvent(Constants.CoreEvents.KEY_UP,this._changeEventHandler);
this._skinParts.textarea.removeEvent(Constants.CoreEvents.KEY_UP,this._fireKeyUp);
this._skinParts.textarea.removeEvent(Constants.CoreEvents.CUT,this._changeEventHandler);
this._skinParts.textarea.removeEvent(Constants.CoreEvents.PASTE,this._changeEventHandler);
this._skinParts.textarea.removeEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler);
this._skinParts.textarea.removeEvent(Constants.CoreEvents.BLUR,this._fireBlur)
},_getValue:function(){var a=this._skinParts.textarea;
return a.get("value")
}}});
W.Experiments.registerNewExperimentComponent("NewComps","New",{name:"wysiwyg.viewer.components.inputs.TextOption",skinParts:{size:{type:"htmlElement"},tooltip:{type:"wysiwyg.viewer.components.InfoTip"}},traits:["wysiwyg.viewer.components.traits.SelectableOption"],Class:{Extends:"mobile.core.components.base.BaseComponent",_states:{selectState:["selected","unselected"],enabledState:["enabled","disabled"]},initialize:function(c,a,b){this.parent(c,a,b);
this.setSelected(false)
},_onAllSkinPartsReady:function(){var a=this._skinParts.size;
a.set("text",this.getDataItem().get("text"));
this._initializeTooTip(this.getViewNode())
},_initializeTooTip:function(a){var c=this._skinParts.tooltip;
var b=this.getDataItem().get("description");
if(b&&b.trim().length>0){a.addEvent("mouseenter",function(){c._showToolTipCmd({id:1,content:b},{source:a})
});
a.addEvent("mouseleave",function(){c._closeToolTipCmd()
})
}},_onDataChange:function(a,c,b){this.setEnabled(this.getDataItem().get("enabled"))
},setSelected:function(a){this.setState(a?"selected":"unselected","selectState")
},setEnabled:function(a){this.setState(a?"enabled":"disabled","enabledState")
},getAcceptableDataTypes:function(){return["SelectOption"]
}}});
W.Experiments.registerNewExperimentComponent("SM","New",{name:"wysiwyg.viewer.components.sm.SMApplyForMembership",imports:[],skinParts:{email:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindEmailField"},password:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindPasswordField"},re_password:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindRePasswordField"}},Class:{Extends:"wysiwyg.viewer.components.sm.SMRegister",onSubmit:function(){var b=this._emailField._data.get("text");
var a=this._passwordField._data.get("text");
var c=this._rePasswordField._data.get("text");
if(this._validateFields(b,a,c)){this.injects().SiteMembers.applyForMembership(b,a,this._onFormSuccess,this._onFormError)
}},_onFormSuccess:function(b){var a=this._emailField._data.get("text");
this._container.showConfirmation("Success! Your member login request has been sent and is awaiting approval. The site administrator will notify you via email ("+a+") once your request has been approved")
}}});
W.Experiments.registerNewExperimentComponent("SM","New",{name:"wysiwyg.viewer.components.sm.SMContainer",imports:[],skinParts:{blockingLayer:{type:"htmlElement"},submitButton:{type:"htmlElement"},okButton:{type:"htmlElement"},content:{type:"htmlElement"},contentInner:{hookMethod:"_createInnerDialog"},confirmationText:{type:"htmlElement"},errMsg:{type:"htmlElement"},title:{type:"htmlElement"},infoTitle:{type:"htmlElement"},note:{type:"htmlElement"},cancel:{type:"htmlElement"},xButton:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Static:{INTENTS:{LOGIN:"LOGIN",REGISTER:"REGISTER",UPDATE_USER:"UPDATE"}},Binds:["_handleSubmit","onFormError","onFormSuccess","_getCurrentForm","_handleCancel","_handleConfirmationOk"],_states:["normal","confirm"],initialize:function(c,a,b){this.parent(c,a,b);
this._intent=b&&b.intent;
this._authCallback=b&&b.authCallback;
this._hashRedirectTo=b&&b.hashRedirectTo;
this._openedByPageSecurity=b&&b.openedByPageSecurity;
this._disableCancel=b&&b.disableCancel
},_onAllSkinPartsReady:function(a){this.setState("normal");
a.submitButton.addEvent("click",this._handleSubmit);
if(this._disableCancel){a.xButton.hide();
a.cancel.setStyle("visibility","hidden")
}else{a.cancel.addEvent("click",this._handleCancel);
a.xButton.addEvent("click",this._handleCancel);
a.blockingLayer.addEvent("click",function(){if(event.target==a.blockingLayer){this._handleCancel()
}}.bind(this))
}a.okButton.addEvent("click",this._handleConfirmationOk);
this._initializeForm(a.contentInner);
this.callLater(this.centerDialog)
},_getFormType:function(c){var a=this.injects().SiteMembers;
if(!c){if(a.isNotAuthenticatedWithCookie()){c=this.INTENTS.LOGIN
}else{c=this.INTENTS.REGISTER
}}switch(c){case"REGISTER":var b=a.getCollectionType();
switch(b){case"Open":return"register";
break;
case"ApplyForMembership":return"applyForMembership";
break
}break;
case"LOGIN":return"login"
}},_createInnerDialog:function(a){var b=this._getFormType(this._intent);
a.type="wysiwyg.viewer.components.sm.SM"+b.capitalize();
a.skin="wysiwyg.viewer.skins.sm.SM"+b.capitalize()+"Skin";
a.argObject={container:this};
return a
},_initializeForm:function(f){this._currentForm=f;
var g=this._skinParts.title;
g.set("html",this._currentForm.getDisplayName());
var b=this._skinParts.submitButton;
b.set("value",this._currentForm.getButtonLabel());
var e=this._skinParts.note;
var a=this._currentForm.getSubHeaderElement();
if(a){var c=a.el;
var d=a.intent;
c.getElements("a").addEvent("click",function(){this.injects().SiteMembers.openSiteMembersPopup({intent:d,disableCancel:this._disableCancel,openedByPageSecurity:this._openedByPageSecurity,hashRedirectTo:this._hashRedirectTo})
}.bind(this));
e.adopt(c.childNodes)
}this._addCurrentFormEvents();
if(this._openedByPageSecurity){if(this.injects().Viewer.isPublicMode()||W.Config.isInDebugMode()){this._skinParts.infoTitle.set("text","To view this page, you need to be logged in.");
this._skinParts.note.setStyle("float","right");
this._skinParts.infoTitle.setStyle("display","block")
}else{this.showConfirmation("This page is protected with a member login. Your users will be able to see this page once they are logged in. To manage your site's members, go to your site in My Account and click Site Members",function(){this.reportAuthStatusChange(true);
this._closeSMContainer()
}.bind(this))
}}},setActiveForm:function(a){},centerDialog:function(){var a=this._skinParts.dialog;
a.setStyles({"margin-left":-(a.getSize().x/2),"margin-top":-(a.getSize().y/2)})
},_removeCurrentFormEvents:function(){var a=this._getCurrentForm();
a.removeEvent("error",this._onFormError);
a.removeEvent("success",this._onFormSuccess)
},_addCurrentFormEvents:function(){var a=this._getCurrentForm();
a.addEvent("error",this._onFormError);
a.addEvent("success",this._onFormSuccess)
},onFormError:function(a){this._skinParts.errMsg.set("html",a)
},onFormSuccess:function(a){this._closeSMContainer()
},closeAndRedirect:function(){this._closeSMContainer();
if(this._hashRedirectTo){var a=W.Utils.hash.getHashParts(this._hashRedirectTo);
W.Utils.hash.setHash(a.id,a.title,a.extData,true);
window.location.hash=this._hashRedirectTo
}location.reload()
},reportAuthStatusChange:function(b,a){if(this._authCallback){this.injects().SiteMembers.reportAuthStatusChange(this._authCallback,b,a)
}},showConfirmation:function(a,b){this.setState("confirm");
this._skinParts.confirmationText.set("text",a);
this._confirmCallback=b
},_handleConfirmationOk:function(){if(this._confirmCallback){this._confirmCallback()
}this._closeSMContainer()
},_handleCancel:function(){this._getCurrentForm().onCancel();
this.reportAuthStatusChange(false,{cancel:true});
this._closeSMContainer()
},_onKeyPress:function(a){if(a.code==13){this._handleSubmit()
}},_handleSubmit:function(){if(!this.injects().Viewer.isPublicMode()&&!W.Config.isInDebugMode()){this.injects().Commands.executeCommand("adminLogin.submitAttempt",{component:this._skinParts.submitButton},this);
return
}this._skinParts.errMsg.set("html","");
this._getCurrentForm().onSubmit()
},_editModeChanged:function(b,a){this._closeSMContainer()
},_closeSMContainer:function(){this.injects().Commands.executeCommand("WViewerCommands.SiteMembers.Close",null,null)
},_getCurrentForm:function(){return this._currentForm
}}});
W.Experiments.registerNewExperimentComponent("SM","New",{name:"wysiwyg.viewer.components.sm.SMForm",imports:[],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onFormError","_onFormSuccess"],Static:{PASS_MIN_LEN:4,PASS_MAX_LEN:15,ERR_MAP:{GENERAL_ERR:"Server error. try again later.",VAL_ERR_PASSWORD_BLANK:"Password cannot be blank",VAL_ERR_PASSWORD_RETYPE:"Passwords are not the same",VAL_ERR_PASSWORD_LENGTH:"Password length must be between {0} and {1}",VAL_ERR_EMAIL_BLANK:"Email cannot be blank",VAL_ERR_EMAIL_INVALID:"Email is invalid","-19999":"Unknown user","-19995":"Email is already taken","-19972":"Invalid token","-19988":"Validation Error","-19984":"Invalid Session","-19976":"Wrong email or password","-19958":"Your member request is waiting approval from the site owner"},INTENTS:{LOGIN:"LOGIN",REGISTER:"REGISTER",UPDATE_USER:"UPDATE"},LABELS:{EMAIL:"Email",PASSWORD:"Password",RE_PASSWORD:"Retype password",REMEMBER_ME:"Remember Me"}},initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this._container=b.container
},onSubmit:function(){LOG.reportError(wixErrors.MISSING_METHOD,this.className,"performSubmit")
},getDisplayName:function(){LOG.reportError(wixErrors.MISSING_METHOD,this.className,"getDisplayName")
},getSubHeaderElement:function(){LOG.reportError(wixErrors.MISSING_METHOD,this.className,"getSubHeaderElement")
},reportAuthStatusChange:function(b,a){this._container.reportAuthStatusChange(b,a)
},closeAndRedirect:function(){this._container.closeAndRedirect()
},onCancel:function(){},_onFormError:function(b,c){var a=this._getErrorMessage(b);
if(c){c.setError(a)
}else{this._container.onFormError(a)
}},_onFormSuccess:function(a){this._container.onFormSuccess(a)
},_getErrorMessage:function(e){var d=this.ERR_MAP.GENERAL_ERR;
if(e){var f=e.errorCode;
if(f&&this.ERR_MAP[f]){d=this.ERR_MAP[f];
var a=e.errorParams;
if(a){var c=a.length||0;
for(var b=0;
b<c;
b++){d=d.replace("{"+b+"}",a[b])
}}}else{d=this.ERR_MAP.GENERAL_ERR+" ("+f+")"
}LOG.reportError("Site Members error - "+e.errorDescription+"("+e.errorCode+")")
}return d
},_bindRePasswordField:function(a){a.argObject={label:this.LABELS.RE_PASSWORD,passwordField:true};
return this._bindTextDataItem(a)
},_bindPasswordField:function(a){a.argObject={label:this.LABELS.PASSWORD,passwordField:true};
return this._bindTextDataItem(a)
},_bindEmailField:function(a){a.argObject={label:this.LABELS.EMAIL};
return this._bindTextDataItem(a)
},_bindTextDataItem:function(a){a.dataItem=this.injects().Data.createDataItem({text:"",type:"Text"},"Text");
return a
}}});
W.Experiments.registerNewExperimentComponent("SM","New",{name:"wysiwyg.viewer.components.sm.SMLogin",imports:[],skinParts:{email:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindEmailField"},password:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindPasswordField"},rememberMe:{type:"wysiwyg.viewer.components.inputs.CheckBoxInput",hookMethod:"_bindCheckBoxDataItem"}},Class:{Extends:"wysiwyg.viewer.components.sm.SMForm",_onAllSkinPartsReady:function(){this._emailField=this._skinParts.email;
this._passwordField=this._skinParts.password;
this._rememberMeField=this._skinParts.rememberMe
},onSubmit:function(){var b=this._emailField._data.get("text");
var a=this._passwordField._data.get("text");
var c=this._rememberMeField._data.get("value");
if(this._validateFields(b,a)){this.injects().SiteMembers.login(b,a,c,this._onFormSuccess,this._onFormError)
}},_validateFields:function(b,a){this._passwordField.setValidationState(true);
this._emailField.setValidationState(true);
if(!b){this._emailField.setValidationState(false);
this._onFormError({errorCode:"VAL_ERR_EMAIL_BLANK"},this._emailField);
return false
}else{if(!this.injects().Utils.isValidEmail(b)){this._emailField.setValidationState(false);
this._onFormError({errorCode:"VAL_ERR_EMAIL_INVALID"},this._emailField);
return false
}else{if(!a){this._passwordField.setValidationState(false);
this._onFormError({errorCode:"VAL_ERR_PASSWORD_BLANK"},this._passwordField);
return false
}else{if(a.length<this.PASS_MIN_LEN||a.length>this.PASS_MAX_LEN){this._passwordField.setValidationState(false);
this._onFormError({errorCode:"VAL_ERR_PASSWORD_LENGTH",errorParams:[this.PASS_MIN_LEN,this.PASS_MAX_LEN]},this._passwordField);
return false
}}}}return true
},_onFormSuccess:function(a){this.closeAndRedirect()
},onCancel:function(){this.reportAuthStatusChange(false,{cancel:true})
},getDisplayName:function(){return"Login"
},getButtonLabel:function(){return"GO"
},getSubHeaderElement:function(){var a=new Element("DIV");
a.set("html","Or <a>Sign up</a>");
return{el:a,intent:this.INTENTS.REGISTER}
},_bindCheckBoxDataItem:function(a){a.dataItem=this.injects().Data.createDataItem({value:"false",type:"Boolean"},"Boolean");
a.argObject={label:this.LABELS.REMEMBER_ME};
return a
}}});
W.Experiments.registerNewExperimentComponent("SM","New",{name:"wysiwyg.viewer.components.sm.SMProfile",imports:[],skinParts:{name:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindTextDataItem"}},Class:{Extends:"wysiwyg.viewer.components.sm.SMForm",_onAllSkinPartsReady:function(){this._emailField=this._skinParts.email;
this._nameField=this._skinParts.name
},onSubmit:function(){var a=this._nameField._data.get("text");
if(this._validateFields(a)){this.injects().SiteMembers.updateMemberDetails({name:a},this._onFormSuccess,this._onFormError)
}},_validateFields:function(a){return true
},onCancel:function(){this.fireEvent("cancel")
},getDisplayName:function(){return"Update your details"
},getButtonLabel:function(){return"Update"
},getSubHeaderElement:function(){var a=new Element("DIV");
return{el:a}
}}});
W.Experiments.registerNewExperimentComponent("SM","New",{name:"wysiwyg.viewer.components.sm.SMRegister",imports:[],skinParts:{email:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindEmailField"},password:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindPasswordField"},re_password:{type:"wysiwyg.viewer.components.inputs.TextInput",hookMethod:"_bindRePasswordField"}},Class:{Extends:"wysiwyg.viewer.components.sm.SMForm",_onAllSkinPartsReady:function(){this._emailField=this._skinParts.email;
this._passwordField=this._skinParts.password;
this._rePasswordField=this._skinParts.re_password
},onSubmit:function(){var b=this._emailField._data.get("text");
var a=this._passwordField._data.get("text");
var c=this._rePasswordField._data.get("text");
if(this._validateFields(b,a,c)){this.injects().SiteMembers.register(b,a,this._onFormSuccess,this._onFormError)
}},_validateFields:function(b,a,c){this._passwordField.setValidationState(true);
this._rePasswordField.setValidationState(true);
this._emailField.setValidationState(true);
if(!b){this._emailField.setValidationState(false);
this._onFormError({errorCode:"VAL_ERR_EMAIL_BLANK"},this._emailField);
return false
}else{if(!this.injects().Utils.isValidEmail(b)){this._emailField.setValidationState(false);
this._onFormError({errorCode:"VAL_ERR_EMAIL_INVALID"},this._emailField);
return false
}else{if(!a){this._passwordField.setValidationState(false);
this._onFormError({errorCode:"VAL_ERR_PASSWORD_BLANK"},this._passwordField);
return false
}else{if(a.length<this.PASS_MIN_LEN||a.length>this.PASS_MAX_LEN){this._passwordField.setValidationState(false);
this._onFormError({errorCode:"VAL_ERR_PASSWORD_LENGTH",errorParams:[this.PASS_MIN_LEN,this.PASS_MAX_LEN]},this._passwordField);
return false
}else{if(a!=c){this._rePasswordField.setValidationState(false);
this._onFormError({errorCode:"VAL_ERR_PASSWORD_RETYPE"},this._rePasswordField);
return false
}}}}}return true
},_onFormSuccess:function(a){this.closeAndRedirect()
},onCancel:function(){this.reportAuthStatusChange(false,{cancel:true})
},getDisplayName:function(){return"Sign up"
},getButtonLabel:function(){return"GO"
},getSubHeaderElement:function(){var a=new Element("DIV");
a.set("html","I already have a user, <a>Login</a>");
return{el:a,intent:this.INTENTS.LOGIN}
}}});
W.Experiments.registerNewExperimentTrait("NewComps","New",{name:"wysiwyg.viewer.components.traits.SelectableOption",trait:{Static:{ITEM_SELECTED_EVENT:"itemSelected"},_isSelected:false,initialize:function(c,a,b){this.parent(c,a,b);
this.getViewNode().addEvent("click",function(){this.fireEvent(this.ITEM_SELECTED_EVENT,this)
}.bind(this))
},setSelected:function(a){this._isSelected=a
}}});
W.Experiments.registerNewExperimentDataTypeSchema("AudioPlayer","New","AudioPlayer",{uri:{type:"string","default":""},autoPlay:{type:"Boolean","default":false},loop:{type:"Boolean","default":false},visible:{type:"Boolean","default":true},volume:{type:"number","default":100},title:{type:"string","default":""},description:{type:"string","default":""},icon_uri:{type:"string","default":""},originalFileName:{type:"string","default":""}});
W.Experiments.registerNewExperimentDataTypeSchema("NewComps","New","SelectOption",{value:"string",text:"string",enabled:{type:"boolean","default":"true"},description:"string"});
W.Experiments.registerNewExperimentCompSchemaProps("SliderAutoPlay","New","SliderGalleryProperties",{autoplayInterval:{type:"number","default":"0",minimum:0,maximum:30,description:"Autoplay interval"},autoplay:{type:"boolean","default":false,description:""},showAutoplay:{type:"boolean","default":true,description:""},transDuration:{type:"number",minimum:0,maximum:5,"default":0,description:"Duration of the transition in seconds"},autoPlayDirection:{type:"string","default":"LTR"}});
W.Experiments.registerNewExperimentDataTypeSchema("NewComps","New","Table",{items:"refList",header:"refList",footer:"refList"});
W.Experiments.registerNewExperimentManager("SM","New","SiteMembers",{name:"wysiwyg.viewer.managers.SiteMembersManager",Class:{Extends:"mobile.core.managers.BaseManager",Binds:["_initializeAPI","openSiteMembersPopup","closeSiteMembersPopup"],Static:{AUTH_STATES:{AUTH:"auth token and cookie exist",NO_AUTH_WITH_COOKIE:"no auth token, cookie exist",NO_AUTH_WITHOUT_COOKIE:"no auth token, cookie doesnt exist"},INTENTS:{LOGIN:"LOGIN",REGISTER:"REGISTER",UPDATE_USER:"UPDATE"},API_ERRORS:{API_NOT_LOADED:"Site Members API was not loaded",TOKEN_IS_INVALID:"Authentication Token is invalid"}},initialize:function(){W.SiteMembers=this;
if(W.Managers&&W.Managers.list){W.Managers.list.push({target:"SiteMembers"})
}W.Managers.addEvent(W.Managers.DEPLOYMENT_COMPLETED_EVENT,function(){var a=this.injects().Viewer.getAppDataHandler().getSiteMembersData();
this.setData(a)
}.bind(this))
},setData:function(a){this._smData=a;
if(a){this._loadScriptAndInitAPI()
}},_loadScriptAndInitAPI:function(){if(!window.SiteMembers){var a=window.serviceTopology.scriptsLocationMap;
var b=a.sitemembers;
this.injects().Viewer.loadExternalScript(b+"/SiteMembers.js",function(){this._initializeAPI();
this._checkQueryStringForFormOpen();
this._preloadMemberDetails()
}.bind(this))
}else{this._initializeAPI()
}},_initializeAPI:function(){var c=W.Config.getServiceTopologyProperty("siteMembersUrl");
var b="siteMembers";
var a=window.SiteMembers;
var d=this.getCollectionId();
if(d){window[b]=new a(d,c,b);
this._api=window[b];
this._token=this.getData()["smtoken"];
this._apiReady=true
}else{LOG.reportError("Site members - collection Id is undefined? ["+d+"]",this.$className,"_initializeAPI")
}},_checkQueryStringForFormOpen:function(){var a=this.injects().Utils;
var b=a.getQueryParam("intent");
if(b&&!this._queryStringHandled){if(!this.injects().Viewer.isSiteReady()||!this.isApiReady()){a.callLater(this._checkQueryStringForFormOpen,[],this,500);
return
}this.openSiteMembersPopup({intent:b});
this._queryStringHandled=true
}},_preloadMemberDetails:function(){this.getMemberDetails(function(a){this._memberDetails=a
}.bind(this))
},getData:function(){return this._smData||{}
},getCollectionId:function(){return this.getData()["smcollectionId"]||this.getData()["id"]
},getCollectionOwner:function(){return this.getData()["owner"]
},getCollectionType:function(){return this.getData()["collectionType"]||this.getData()["type"]
},isServiceProvisioned:function(){return !!this._smData
},isApiReady:function(){return this._apiReady
},login:function(b,a,e,d,c){if(!this._apiReady){c&&c({code:"API_NOT_LOADED",description:this.API_ERRORS.API_NOT_LOADED})
}else{this._api.login(b,a,e,d,c)
}},register:function(b,a,d,c){if(!this._apiReady){c&&c({code:"API_NOT_LOADED",description:this.API_ERRORS.API_NOT_LOADED})
}else{this._api.register(b,a,d,c)
}},updateMemberDetails:function(c,b,a){if(!this._apiReady){a&&a({code:"API_NOT_LOADED",description:this.API_ERRORS.API_NOT_LOADED})
}else{if(!this._token){a&&a({code:"TOKEN_IS_INVALID",description:this.API_ERRORS.TOKEN_IS_INVALID})
}else{this._api.updateMemberDetails(this._token,c,b,a)
}}},getMemberDetails:function(b,a){if(this._memberDetails){b(this._memberDetails)
}else{if(!this._apiReady){a&&a({code:"API_NOT_LOADED",description:this.API_ERRORS.API_NOT_LOADED})
}else{if(!this._token){a&&a({code:"TOKEN_IS_INVALID",description:this.API_ERRORS.TOKEN_IS_INVALID})
}else{this._api.getMemberDetails(this._token,b,a)
}}}},applyForMembership:function(b,a,d,c){if(!this._apiReady){c&&c({code:"API_NOT_LOADED",description:this.API_ERRORS.API_NOT_LOADED})
}else{this._api.apply(b,a,d,c)
}},logout:function(){if(!this._apiReady){return
}delete this._token;
return this._api.logout()
},isLoggedIn:function(){var a=this._getAuthenticationState();
return a==this.AUTH_STATES.AUTH
},isNotAuthenticatedWithCookie:function(){if(this.isLoggedIn()){return false
}var a=this._getAuthenticationState();
return a==this.AUTH_STATES.NO_AUTH_WITH_COOKIE
},_getAuthenticationState:function(){var a=!!this._token;
var b=(this._api?this._api.isSessionValid():false);
if(a){return this.AUTH_STATES.AUTH
}else{if(!a&&b){return this.AUTH_STATES.NO_AUTH_WITH_COOKIE
}else{if(!a&&!b){return this.AUTH_STATES.NO_AUTH_WITHOUT_COOKIE
}}}},openSiteMembersPopup:function(b){var c=b&&b.intent;
var e=b&&b.authCallback;
if(!c){if(this.isNotAuthenticatedWithCookie()){c=this.INTENTS.LOGIN
}else{c=this.INTENTS.REGISTER
}}var a=[this.INTENTS.LOGIN,this.INTENTS.REGISTER];
if(a.contains(c)&&this.isLoggedIn()){this.injects().SiteMembers.getMemberDetails(function(f){this.reportAuthStatusChange(e,true,f)
}.bind(this))
}else{var d=this.injects().SiteMembers;
if(this._siteMembersContainer){this.closeSiteMembersPopup()
}if(d.isApiReady()&&!this._siteMembersContainer){W.Components.createComponent("wysiwyg.viewer.components.sm.SMContainer","wysiwyg.viewer.skins.sm.SMContainerSkin",null,b,function(){},function(j){this._siteMembersContainer=j;
var g=j.getViewNode();
g.setStyle("opacity","0.0");
var f=this.injects().Viewer.getSiteNode();
g.insertInto(f);
var h=new Fx.Tween(g,{duration:"short",link:"ignore"}).start("opacity","1.0")
}.bind(this))
}}},closeSiteMembersPopup:function(){if(this._siteMembersContainer){var a=this._siteMembersContainer.getViewNode();
var b=new Fx.Tween(a,{duration:"short",link:"chain"});
b.addEvent("complete",function(){b.removeEvent("complete",arguments.callee);
a.removeFromDOM()
}.bind(this));
b.start("opacity","0.0");
delete this._siteMembersContainer
}},reportAuthStatusChange:function(c,b,a){if(c){c({authResponse:b,data:a})
}}}});
W.Experiments.registerExperimentManager("AppMarket","New",{name:"experiments.wysiwyg.viewer.managers.TPAManagerAppMarket",Class:{Extends:"wysiwyg.viewer.managers.TPAManager",Static:{APP_MARKET_URL:"http://market.wix.codeoasis.com"},_handleAppMarketMessage:function(a){switch(a.cmd){case"ADD_APP_TO_SITE":W.Commands.executeCommand("WEditorCommands.AddApp",a.params,this);
W.Commands.executeCommand(Constants.EditorUI.CLOSE_PANEL);
break;
case"ADD_COMPONENT_TO_SITE":W.Commands.executeCommand("WEditorCommands.AddComponent",a.params,this);
W.Commands.executeCommand(Constants.EditorUI.CLOSE_PANEL);
break;
case"OPEN_MARKET_POPUP":W.Commands.executeCommand("WEditorCommands.openMarketPopup",a.params,this);
break;
case"CLOSE_MARKET_POPUP":W.Commands.executeCommand("WEditorCommands.closeMarketPopup",a.params,this);
break;
case"GET_INSTALLED_APPS":var b=W.Preview.getPreviewManagers().Viewer.getAppDataHandler().getAppsData();
var c={eventType:"ON_COMMAND_RESPONSE",callerId:a.id,params:b};
this._marketPanelWindow.postMessage(JSON.stringify(c),this.APP_MARKET_URL);
break
}},setMarketPanelWindow:function(a){this._marketPanelWindow=a
},postMessageEvent:function(b,c){var e=c||this._marketPanelWindow;
var a=location.protocol+"//"+location.host;
var d={eventType:b,origin:a};
e.postMessage(JSON.stringify(d),this.APP_MARKET_URL)
}}});
W.Experiments.registerExperimentManager("PSMenuFix","New",{name:"experiments.wysiwyg.viewer.managers.WViewManagerPSMenuFix",Class:{Extends:"wysiwyg.viewer.managers.WViewManager",_fixPagesOrderByNewMenuData:function(a){if(W.Data.isDataAvailable("#MAIN_MENU")){var c=W.Data.getDataByQuery("#MAIN_MENU");
var b=c.getAllItems();
a=b.map(function(d){return d.get("refId")
})
}return a
}}});
W.Experiments.registerExperimentManager("PageSecurity","New",{name:"experiments.wysiwyg.viewer.managers.WViewManagerPageSecurity",Class:{Extends:"wysiwyg.viewer.managers.WViewManager",_registerCommands:after(function(){var a=W.Commands;
a.registerCommandAndListener("WViewerCommands.PasswordLogin.Open",this,this._openPasswordLogin);
a.registerCommandAndListener("WViewerCommands.PasswordLogin.Close",this,this._closePasswordLogin)
}),_openAdminLogin:function(a){if(!a){a={}
}a.clazz="wysiwyg.viewer.components.AdminLogin";
a.dataItem=W.Data.createDataItem({type:"Text"});
this._openPasswordLogin(a)
},_closeAdminLogin:function(){this._closePasswordLogin()
},_openPasswordLogin:function(d){if(!this._passwordLogin){var c=d&&d.args;
var b=(d&&d.clazz)||"wysiwyg.viewer.components.PasswordLogin";
var a=(d&&d.dataItem)||null;
W.Components.createComponent(b,"wysiwyg.viewer.skins.PasswordLoginSkin",a,c,function(){},function(g){this._passwordLogin=g;
var e=g.getViewNode();
e.setStyle("opacity","0");
g.getViewNode().insertInto(this._siteNode);
g.centerDialog();
var f=new Fx.Tween(e,{duration:"short",link:"ignore"}).start("opacity","1.0")
}.bind(this))
}},_closePasswordLogin:function(){if(this._passwordLogin){var a=this._passwordLogin.getViewNode();
var b=new Fx.Tween(a,{duration:"short",link:"ignore"});
b.addEvent("complete",function(){b.removeEvent("complete",arguments.callee);
a.removeFromDOM();
delete this._passwordLogin
}.bind(this));
b.start("opacity","0.0")
}},_changePageFromHash:function(a){var c=this._getPageDataFromHash(a);
if(c===null){return
}var b=c.get("id");
if(b==this._currentPageId){return
}this._checkRequireLogin(c,function(){if(b){this._pageTransition(b)
}}.bind(this))
},goToPage:function(a,c){if(c){this.parent(a);
return
}var b=this._pagesData[a];
this._checkRequireLogin(b,function(){this.goToPage(a,true)
}.bind(this))
},_checkRequireLogin:function(a,j){var k=this.isPublicMode()||this.getEditorMode()=="PREVIEW";
var c=a.get("pageSecurity");
var b=a.get("id");
var f=this._getFallbackPage(b);
var e=!f;
if(k&&c.requireLogin&&!this.injects().SiteMembers.isLoggedIn()&&!this._isProtectedPageValidated(b)){var d="";
var g=a.get("pageUriSEO");
var h=W.Utils.hash.getHashPartsString(b,g,d);
this.injects().SiteMembers.openSiteMembersPopup({disableCancel:e,hashRedirectTo:"#"+h,openedByPageSecurity:true,authCallback:function(l){this._onAuthCallback(l,b,f,j)
}.bind(this)})
}else{if(k&&c.passwordDigest&&!this._isProtectedPageValidated(b)){W.Commands.executeCommand("WViewerCommands.PasswordLogin.Open",{args:{digestedPassword:c.passwordDigest,disableCancel:e,authCallback:function(l){this._onAuthCallback(l,b,f,j)
}.bind(this)}})
}else{j()
}}},_onAuthCallback:function(c,a,b,d){if(c.authResponse){this._setPageValidated(a);
d()
}else{if(c.data&&c.data.cancel){if(b){location.hash=b
}else{location.reload()
}}}},_getFallbackPage:function(b){var a=this.injects().Viewer.getCurrentPageId();
var d=!!a;
var c=W.Data.getDataMap().SITE_STRUCTURE.get("mainPage");
c=(c?c.replace("#",""):"");
if(d){return a
}else{if(b!=c){return c
}else{return null
}}},_setPageValidated:function(a){if(!this._validatedPages){this._validatedPages={}
}this._validatedPages[a]=true
},setPageAsNotValidated:function(a){if(!this._validatedPages){this._validatedPages={}
}this._validatedPages[a]=false
},_isProtectedPageValidated:function(a){return this._validatedPages&&this._validatedPages[a]
}}});
W.Experiments.registerExperimentManager("SM","New",{name:"experiments.wysiwyg.viewer.managers.WViewManagerSM",Class:{Extends:"wysiwyg.viewer.managers.WViewManager",_registerCommands:after(function(){var a=W.Commands;
a.registerCommandAndListener("WViewerCommands.SiteMembers.Open",this,this._openSiteMembersPopup);
a.registerCommandAndListener("WViewerCommands.SiteMembers.Close",this,this._closeSiteMembersPopup)
}),_openSiteMembersPopup:function(a){this.injects().SiteMembers.openSiteMembersPopup(a)
},_closeSiteMembersPopup:function(){this.injects().SiteMembers.closeSiteMembersPopup()
}}});
W.Experiments.registerExperimentCompDataSchema("GEM","New","GalleryExpandProperties",{expandEnabled:{type:"boolean","default":true},goToLinkText:{type:"string","default":"Go to link"},galleryImageOnClickAction:{type:"string","default":"unset","enum":["disabled","zoomMode","goToLink"]}});
W.Experiments.registerNewExperimentSchemaProps("NewComps","New","NumberInputProperties",{minValue:{type:"number","default":0,description:"minimum allowed value"},maxValue:{type:"number","default":999,description:"maximum allowed value"}});
W.Experiments.registerNewExperimentSchemaProps("NewComps","New","TableComponentProperties",{minHeight:{type:"number","default":undefined,description:"minimum allowed value"}});
W.ComponentEvents=W.ComponentEvents||{};
W.ComponentEvents.COMPONENT_SEQUENCER_COMP_SETUP="componentSetup";
W.ComponentEvents.COMPONENT_SEQUENCER_PRODUCTION_FINISHED="productionFinished";
W.Experiments.registerExperimentClass("WixApps","New",{name:"experiments.wysiwyg.viewer.utils.ComponentSequencerWixApps",imports:["wysiwyg.viewer.utils.GalleryUtils"],Class:{Extends:"wysiwyg.viewer.components.ComponentSequencer",_createCompsFromDataList:function(a,c){this._preExistingElements=a.getChildren().slice(0);
this._pendingElements=[];
this._createdElements=[];
this._reusedElements=[];
for(var b=0;
b<c.length;
b++){this._setupComponent(a,b,c)
}this._preExistingElements.forEach(function(d){if(!this._reusedElements.contains(d)){this._removeElement(d)
}}.bind(this));
this._checkIfAllDone()
},_setupComponent:function(a,c,e){var b=e[c];
var g;
var f;
var d=this._findReusableComponent(this._preExistingElements,b);
if(d){g="reuse";
this._reusedElements.push(d)
}else{g="create";
d=this.createComponent(a,b,c,e)
}a.adopt(d);
this._createdElements.push(d);
if(!this._pendingElements.contains(d)){this.fireEvent(W.ComponentEvents.COMPONENT_SEQUENCER_COMP_SETUP,{method:g,compView:d,index:c})
}},createComponent:function(b,d,c,f){var e;
var h=this.resolveItem(d,c,f);
var g=typeOf(h);
var a=this._getCompStyle(b);
if(g==="element"){e=h;
if(!e.getLogic&&!e.hasAttribute("comp")){this._supplyMinimalLogic(e,d)
}}else{e=new Element("div");
e.setAttribute("comp",h.comp);
e.setAttribute("skin",h.skin);
e.wixify(h.args||{},d,undefined,undefined,a);
this._pendingElements.push(e)
}e.addEvent(Constants.ComponentEvents.READY,function(){this.fireEvent(W.ComponentEvents.COMPONENT_SEQUENCER_COMP_SETUP,{method:"create",compView:e,index:c});
var j=this._pendingElements.indexOf(e);
if(j!=-1){this._pendingElements.splice(j,1);
this._checkIfAllDone()
}}.bind(this));
return e
},isPending:function(){return this._pendingElements.length>0
},_checkIfAllDone:function(){if(!this.isPending()){this._onAllComponentsReady()
}},_onAllComponentsReady:function(){var a=this._createdElements.slice(0);
this._createdElements=[];
this._reusedElements=[];
this._preExistingElements=[];
this.fireEvent(W.ComponentEvents.COMPONENT_SEQUENCER_PRODUCTION_FINISHED,{elements:a})
},_dataItemsIdentical:function(b,a){if(b===a){return true
}else{if(b.get&&a.get&&b.hasField("id")&&a.hasField("id")){var d=b.get("id");
var c=a.get("id");
return(d&&c&&(d===c))
}else{return false
}}}}});
W.Experiments.registerNewExperimentManager("NewComps","New","MessagesController",{name:"wysiwyg.viewer.utils.MessageViewController",Class:{Binds:["_showMessageBox","_messageBoxClosed"],initialize:function(){W.MessagesController=this;
this._messagesQueue=[];
this.BETWEEN_MESSAGES_DELAY=700
},_initIfNeededMessageView:function(a){if(!this._messageBox){this._messageBox=W.Components.createComponent("wysiwyg.viewer.components.MessageView","wysiwyg.viewer.skins.MessageViewSkin",null,null,function(b){$$("body").adopt(this._messageBox);
this._messageBox.getLogic().addEvent("complete",this._messageBoxClosed)
}.bind(this),a)
}else{if(a){a()
}}},showError:function(a,b){var c={};
c.msgTitle=a;
c.msgBody=b;
this._messagesQueue.push(c);
this._initIfNeededMessageView(this._showMessageBox)
},showMessage:function(a,c,d){var b={};
b.msgTitle=a;
b.msgBody=c;
b.cb=d;
this._messagesQueue.push(b);
this._initIfNeededMessageView(this._showMessageBox)
},_showMessageBox:function(){if((this._messagesQueue.length>0)&&(!this._messageBox.getLogic().visible())){this._messageBox.getLogic().showMessage(this._messagesQueue.shift())
}},_messageBoxClosed:function(){setTimeout(function(){this._showMessageBox()
}.bind(this),this.BETWEEN_MESSAGES_DELAY)
},kill:function(){if(this._messageBox){this._messageBox.dispose();
this._messageBox.removeFromDOM()
}},isReady:function(){return true
}}});