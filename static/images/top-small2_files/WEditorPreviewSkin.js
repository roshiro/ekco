W.Skins.newSkin({name:"wysiwyg.editor.skins.WEditorPreviewSkin",Class:{Extends:"mobile.core.skins.BaseSkin",_params:[{id:"webThemeDir",type:Constants.SkinParamTypes.URL,defaultTheme:"WEB_THEME_DIRECTORY"},{id:"editStateBarHeight",type:Constants.SkinParamTypes.OTHER,defaultValue:"35px"}],_html:'<div skinPart="previewContainer"></div><div skinPart="previewLoading" class="eventCatcher"></div><div skinPart="viewFullSize"></div><div skinPart="mouseEventCatcher" class="blockDirectEdit eventCatcher"></div><div skinPart="mouseEventCatcherLeft" class="directEdit eventCatcher"></div><div skinPart="mouseEventCatcherRight" class="directEdit eventCatcher"></div><div skinPart="mouseEventCatcherTop" class="directEdit eventCatcher"></div><div skinPart="mouseEventCatcherBottom" class="directEdit eventCatcher"></div>',_css:["{position:absolute; top:0px; left:0px; bottom:0px; width:100%; }","%.eventCatcher% {position:absolute;top:0px; width:100%; height: 100%;}","%previewContainer% {position:fixed; top:[editStateBarHeight]; bottom:0px; left:0px; width:100%;}",'[state~="loading"] %previewContainer%{visibility:hidden}','[state~="ready"] %previewLoading%{visibility:hidden}',"%previewLoading%{background: #FFFFFF url([webThemeDir]site_loading.gif) center center no-repeat}","%mouseEventCatcherLeft% {display:none}","%mouseEventCatcher% {background:url([webThemeDir]transparent.gif) repeat;}","%mouseEventCatcherRight% {display:none}","%mouseEventCatcherTop% {display:none}","%mouseEventCatcherBottom% {display:none}","[state~=inPlaceEdit] .directEdit{display:block;}","[state~=normalEdit] .directEdit{display:none;}","[state~=inPlaceEdit] .blockDirectEdit{display:none;}","[state~=normalEdit] .blockDirectEdit{display:block;}"]}});