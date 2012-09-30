var wixLogLegend=(function(){var c=function(){};
var b={};
b.type={error:10,timing:20,funnel:30,userAction:40};
b.category={editor:1,viewer:2,core:3,server:4};
b.issue={defaultVal:0,components:1,managers:2,modal:4,timing:5,skins:6};
b.severity={recoverable:10,warning:20,error:30,fatal:40};
for(var a in b){c[a]=b[a]
}c.getKey=function(e,f){e=b[e]||{};
for(var d in e){if(f==e[d]){return d
}}return""
};
return c
})();
var l=wixLogLegend;
var wixEvents={EDITOR_FLOW_OPEN_NEW:{desc:"FLOW: Mobile editor launch with new site",type:l.type.funnel,category:l.category.editor,biEventId:100,timerId:"main",callLimit:1},EDITOR_FLOW_OPEN_EDIT:{desc:"FLOW: Mobile editor launch with existing site",type:l.type.funnel,category:l.category.editor,biEventId:107,timerId:"main",callLimit:1},EDITOR_FLOW_TEMPLATE_CHOSEN:{desc:"FLOW: Mobile editor template chosen",type:l.type.funnel,category:l.category.editor,biEventId:102,timerId:"main",callLimit:1},EDITOR_FLOW_CATEGORY_CHOSEN:{desc:"FLOW: Mobile editor category chosen",type:l.type.funnel,category:l.category.editor,biEventId:103,timerId:"main",callLimit:1},EDITOR_FLOW_EDIT_PAGE:{desc:"FLOW: Mobile editor edit page step from new site",type:l.type.funnel,category:l.category.editor,biEventId:105,timerId:"main",callLimit:1},EDITOR_FLOW_PUBLISH_PAGE:{desc:"FLOW: Mobile editor publish page step",type:l.type.funnel,category:l.category.editor,biEventId:104,timerId:"main",callLimit:1},EDITOR_FLOW_CONGRATS_PAGE:{desc:"FLOW: Mobile editor congrats page step",type:l.type.funnel,category:l.category.editor,biEventId:101,timerId:"main",callLimit:1},EDITOR_ENTER_PAGE:{desc:"Mobile editor page change",type:l.type.funnel,category:l.category.editor},EMAIL_SEND:{desc:"Site url sent to mail",type:l.type.userAction,category:l.category.editor},BACK_TO_EDIT_FROM_CONGRATS:{desc:"Back to edit page from congrats page",type:l.type.userAction,category:l.category.editor},ADD_PAGE:{desc:"Page added",type:l.type.userAction,category:l.category.editor},REMOVE_PAGE:{desc:"Page removed",type:l.type.userAction,category:l.category.editor},ADD_COMPONENT:{desc:"Component added",type:l.type.userAction,category:l.category.editor},REMOVE_COMPONENT:{desc:"Component removed",type:l.type.userAction,category:l.category.editor},REORDER_COMPONENT:{desc:"Component reorder",type:l.type.userAction,category:l.category.editor},SITE_READY:{desc:"Mobile site ready",type:l.type.timing,category:l.category.viewer,timerId:"load",thresholdTime:5000,thresholdError:"SITE_READY_DELAY",biEventId:303,biAdapter:"mlt"},LOADING_STEPS:{desc:"loading steps",type:l.type.timing,category:l.category.editor,timerId:"load",thresholdTime:25000,thresholdError:"SITE_DOM_DELAY",biEventId:304,biAdapter:"hed"},SITE_DOM_LOADED:{desc:"Mobile site DOM loaded",type:l.type.timing,category:l.category.viewer,timerId:"load",thresholdTime:5000,thresholdError:"SITE_DOM_DELAY",biEventId:301,biAdapter:"mlt"},PREVIEW_READY:{desc:"Mobile preview ready",type:l.type.timing,category:l.category.viewer,timerId:"load",thresholdTime:5000,thresholdError:"PREVIEW_READY_DELAY"},PREVIEW_DOM_LOADED:{desc:"Mobile preview DOM loaded",type:l.type.timing,category:l.category.viewer,timerId:"load",thresholdTime:3000,thresholdError:"PREVIEW_DOM_DELAY"},EDITOR_READY:{desc:"Mobile editor ready",type:l.type.timing,category:l.category.editor,timerId:"load",thresholdTime:8000,thresholdError:"EDITOR_READY_DELAY",biEventId:302,biAdapter:"mlt"},EDITOR_DOM_LOADED:{desc:"Mobile editor DOM loaded",type:l.type.timing,category:l.category.editor,timerId:"load",thresholdTime:10000,thresholdError:"EDITOR_DOM_DELAY",biEventId:300,biAdapter:"mlt"},SAVE_BUTTON_CLICKED_IN_MAIN_WINDOW:{desc:"Save button was clicked in main window",type:l.type.userAction,category:l.category.editor,timerId:"load",biEventId:201,biAdapter:"hed"},CLOSE_SAVE_DIALOG_CLICKED:{desc:"click close in save dialog",type:l.type.userAction,category:l.category.editor,biEventId:202,biAdapter:"hed"},SAVE_CLICKED_IN_SAVE_DIALOG:{desc:"click save in save dialog",type:l.type.userAction,category:l.category.editor,timerId:"load",biEventId:203,biAdapter:"hed"},PUBLISH_BUTTON_CLICKED_IN_MAIN_WINDOW:{desc:"click on publish button in main window",type:l.type.userAction,category:l.category.editor,timerId:"load",biEventId:204,biAdapter:"hed"},PUBLISH_BUTTON_CLICKED_IN_PUBLISH_DIALOG:{desc:"click publish in first publish dialog",type:l.type.userAction,category:l.category.editor,timerId:"load",biEventId:207,biAdapter:"hed"},UPDATE_BUTTON_CLICKED_IN_PUBLISH_DIALOG:{desc:"click update in publish dialog",type:l.type.userAction,category:l.category.editor,biEventId:208,biAdapter:"hed"},POST_IN_FB_CLICKED_IN_PUBLISH_SHARE_DIALOG:{desc:"click on post to FB in publish dialog",type:l.type.userAction,category:l.category.editor,biEventId:209,biAdapter:"hed"},POST_IN_TWITTER_CLICKED_IN_PUBLISH_SHARE_DIALOG:{desc:"click on post to FB in publish dialog",type:l.type.userAction,category:l.category.editor,biEventId:210,biAdapter:"hed"},PREVIEW_BUTTON_CLICKED_IN_MAIN_WINDOW:{desc:"click on preview button in main window",type:l.type.userAction,category:l.category.editor,biEventId:211,biAdapter:"hed"},COMPONENT_ADDED:{desc:"add component",type:l.type.userAction,category:l.category.editor,biEventId:214,biAdapter:"hed"},COMPONENT_REMOVED:{desc:"remove component",type:l.type.userAction,category:l.category.editor,biEventId:215,biAdapter:"hed"},BACKGROUND_CHANGED:{desc:"some change was made in the background ",type:l.type.userAction,category:l.category.editor,biEventId:219,biAdapter:"hed"},COLOR_PRESET_CHANGED:{desc:"a color preset was selected",type:l.type.userAction,category:l.category.editor,biEventId:220,biAdapter:"hed"},FONT_PRESET_CHANGED:{desc:"a font preset was selected",type:l.type.userAction,category:l.category.editor,biEventId:221,biAdapter:"hed"},CUSTOMIZE_FONTS_OPENED:{desc:"customize font panel was opened",type:l.type.userAction,category:l.category.editor,biEventId:223,biAdapter:"hed"},CUSTOMIZE_COLORS_OPENED:{desc:"customize colors panel was opened",type:l.type.userAction,category:l.category.editor,biEventId:224,biAdapter:"hed"},PAGE_ADDED:{desc:"a page was added",type:l.type.userAction,category:l.category.editor,biEventId:222,biAdapter:"hed"},ADD_COMPONENT_CATEGORY_CLICKED:{desc:"Clicked a Component Category",type:l.type.funnel,category:l.category.editor,biEventId:231,timerId:"main",biAdapter:"hed"},SEO_PANEL_OPENED:{desc:"seo panel was opened",type:l.type.userAction,category:l.category.editor,biEventId:225,biAdapter:"hed"},SEO_CHECKED_IN_SEO_PANEL:{desc:'"allow search engines to find my site" was selected in SEO panel',type:l.type.userAction,category:l.category.editor,biEventId:226,biAdapter:"hed"},SHOW_IN_ALL_PAGES_SELECTED:{desc:'"show in all pages" was selected',type:l.type.userAction,category:l.category.editor,biEventId:227,biAdapter:"hed"},HELP_CENTER_CLOSED:{desc:"help center popup closed",type:l.type.userAction,category:l.category.editor,biEventId:230,biAdapter:"hed"},APPS_FLOW_APP_BUTTON_CLICKED:{desc:"FLOW: Apps - TPA Application button clicked",type:l.type.funnel,category:l.category.editor,biEventId:232,timerId:"main",biAdapter:"hed"},APPS_FLOW_SLIDESHOW_INTERACTION:{desc:"FLOW: Apps - TPA Add dialog - interaction with slideshow",type:l.type.funnel,category:l.category.editor,biEventId:233,timerId:"main",biAdapter:"hed"},APPS_FLOW_ADD_AS_TO_PAGE_BUTTON:{desc:"FLOW: Apps - TPA Add dialog - Add as/to page clicked",type:l.type.funnel,category:l.category.editor,biEventId:234,timerId:"main",biAdapter:"hed"},APPS_FLOW_ADD_DIALOG_CANCELED:{desc:"FLOW: Apps - TPA Add dialog - Add dialog canceled",type:l.type.funnel,category:l.category.editor,biEventId:235,timerId:"main",biAdapter:"hed"},APPS_FLOW_APP_ADDED_TO_STAGE:{desc:"FLOW: Apps - TPA Add dialog - App added to stage",type:l.type.funnel,category:l.category.editor,biEventId:236,timerId:"main",biAdapter:"hed"},APPS_FLOW_APP_SETTINGS_OPEN:{desc:"FLOW: Apps - TPA App settings opened",type:l.type.funnel,category:l.category.editor,biEventId:237,timerId:"main",biAdapter:"hed"},APPS_FLOW_APP_SETTINGS_CLOSE:{desc:"FLOW: Apps - TPA App settings closed",type:l.type.funnel,category:l.category.editor,biEventId:238,timerId:"main",biAdapter:"hed"},APPS_FLOW_APP_LOADED_ON_VIEWER:{desc:"FLOW: Apps - TPA App loaded on viewer",type:l.type.funnel,category:l.category.editor,biEventId:239,timerId:"main",biAdapter:"hed"},EU_COOKIE_CHECKBOX_CLICKED:{desc:"eu cookie checkbox clicked",type:l.type.userAction,category:l.category.editor,biEventId:240,biAdapter:"hed"},WALK_ME_LOADED:{desc:"WalkMe loaded",type:l.type.timing,category:l.category.editor,biEventId:241,biAdapter:"hed"},FIRST_TIME_WALK_ME_PRESENTED:{desc:"Splash screen for first time WalkMe shown to user",type:l.type.timing,category:l.category.editor,biEventId:242,biAdapter:"hed"},WALK_ME_BUTTON_CLICKED:{desc:"WalkMe button was clicked",type:l.type.userAction,category:l.category.editor,biEventId:243,biAdapter:"hed"},WALK_ME_CLOSED:{desc:"WalkThru closed by user",type:l.type.userAction,category:l.category.editor,biEventId:244,biAdapter:"hed"},WALK_ME_STEP_BEGUN:{desc:"WalkThru step was begun by user",type:l.type.userAction,category:l.category.editor,biEventId:245,biAdapter:"hed"},WELCOME_SCREEN_HELP_CENTER_CLOSED:{desc:"first time welcome screen help center closed",type:l.type.userAction,category:l.category.editor,biEventId:246,biAdapter:"hed"},WIXADS_CLICKED_IN_PREVIEW:{desc:"user clicked the wix ad in preview",type:l.type.userAction,category:l.category.viewer,biEventId:250,biAdapter:"hed"}};
var wixErrors={USER_MANAGER_NOT_FOUND:{errorCode:46001,desc:"UserManager is missing",type:l.type.error,category:l.category.viewer,issue:l.issue.defaultVal,severity:l.severity.error},SERVER_NAME_VALIDATION_FAILED:{errorCode:33001,desc:"site name validation failed",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.error},SERVER_NAME_VALIDATION_DEAD:{errorCode:33002,desc:"site name validation failed to many times",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},EDITOR_DOM_DELAY:{errorCode:24001,desc:"Editor DOM not ready in time",type:l.type.timing,category:l.category.editor,issue:l.issue.timing,severity:l.severity.warning},SITE_DOM_DELAY:{errorCode:14001,desc:"Site DOM not ready in time",type:l.type.timing,category:l.category.viewer,issue:l.issue.timing,severity:l.severity.warning},PREVIEW_DOM_DELAY:{errorCode:14003,desc:"Preview DOM not ready in time",type:l.type.timing,category:l.category.viewer,issue:l.issue.timing,severity:l.severity.warning},PREVIEW_MANAGER_PREVIEW_TOO_LONG:{errorCode:14005,desc:"Site preview took too long",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error,callLimit:1},EDITOR_READY_DELAY:{errorCode:24002,desc:"Editor not ready in time",type:l.type.timing,category:l.category.editor,issue:l.issue.timing,severity:l.severity.warning},SITE_READY_DELAY:{errorCode:14002,desc:"Site not ready in time",type:l.type.timing,category:l.category.viewer,issue:l.issue.timing,severity:l.severity.warning},PREVIEW_READY_DELAY:{errorCode:14004,desc:"Preview not ready in time",type:l.type.timing,category:l.category.viewer,issue:l.issue.timing,severity:l.severity.warning},UNKNOWN_ERROR:{errorCode:10000,desc:"Unknown error",type:l.type.error,category:l.category.viewer,issue:l.issue.components,severity:l.severity.fatal},NO_SKIN:{errorCode:2,desc:"No skin Found",type:l.type.error,category:l.category.viewer,issue:l.issue.components,severity:l.severity.fatal},SKIN_PARAM_REF_NOT_FOUND:{errorCode:150001,desc:"No param ref found for param",type:l.type.error,category:l.category.core,issue:l.issue.skins,severity:l.severity.warning},SKIN_PARAM_MUTATOR_FUNC_NOT_FOUND:{errorCode:150002,desc:"Mutator function was not found on value",type:l.type.error,category:l.category.core,issue:l.issue.skins,severity:l.severity.error},SKIN_PART_MISSING:{errorCode:150003,desc:"Skin did not supply required skinPart",type:l.type.error,category:l.category.core,issue:l.issue.skins,severity:l.severity.error},SKIN_CLASS_RULE_ERROR:{errorCode:150004,desc:"Skin rule write to browser failed",type:l.type.error,category:l.category.viewer,issue:l.issue.skins,severity:l.severity.error},MISSING_METHOD:{errorCode:3,desc:"Method not defined",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.fatal},MANAGERS_INVALID_NAME:{errorCode:1201,desc:"Invalid manager name",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},MANAGERS_INVALID_CLASS:{errorCode:12002,desc:"Invalid manager class: check script loading order",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},MANAGERS_INVALID:{errorCode:12012,desc:"invalid manager",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_INVALID_TYPE:{errorCode:12021,desc:"Invalid class data for",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_INVALID_NAME:{errorCode:12025,desc:"Invalid class name (must start with a capital letter, followed by alphanumeric): ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_NAME_ALREADY_EXIST:{errorCode:12026,desc:"Invalid class name - a class with the same name already exist: ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_DOUBLE_TRAIT_NAME:{errorCode:12027,desc:"Invalid trait name - a trait with the same name already exist: ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_INVALID_PENDING_OBJECT:{errorCode:12028,desc:"Invalid object found on pending list for class",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NAME_ALREADY_EXIST:{errorCode:12031,desc:"Invalid component: component already exist",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},CM_NO_EXTEND:{errorCode:12032,desc:"Invalid component extend: no component extend found",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_LOGIC_TYPE:{errorCode:12033,desc:"logic type was not supplied",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_SKIN_TYPE:{errorCode:12034,desc:"skin type was not supplied",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NO_SKINPART:{errorCode:12035,desc:"couldn't find skinPart",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NO_PART:{errorCode:12036,desc:"missing part id or type",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NO_NEW_SKIN:{errorCode:12037,desc:"we currently don't support applying new skins",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_NO_DATA:{errorCode:12038,desc:"data is unavailable for skinPart",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},EXPERIMENT_INVALID_MODIFY:{errorCode:12101,desc:"Invalid use of modify in experiment class",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CM_UNKNOWN_STATE_GROUP:{errorCode:11003,desc:"Unknown component state group",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.warning},CM_MALFORMED_STATES:{errorCode:11004,desc:"Malformed state data in component definition",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.warning},CM_DUPLICATE_STATE_NAME:{errorCode:11005,desc:"Duplicate state name in component data",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.warning},CM_UNKNOWN_STATE_NAME:{errorCode:11006,desc:"Unknown state name",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.warning},IMG_SIZE_ZERO:{errorCode:11007,desc:"image size is zero",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.warning},IMG_VALID_SIZE_AFTER_ZERO:{errorCode:11008,desc:"image size is changed from zero to visible size",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.recoverable},IMG_INVALID_SETTINGS:{errorCode:11009,desc:"set invalid image settings",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},COMPONENT_PROPERTIES_PROP_NOT_FOUND:{errorCode:11010,desc:"component property not found",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.warning},COMPONENT_PROPERTIES_BAD_PROP_DEF:{errorCode:11011,desc:"bad property definition in component property schema",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.warning},COMPONENT_PROPERTIES_PROP_NOT_VALID:{errorCode:11012,desc:"Invalid property values",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.warning},LT_LINK_UNKNOWN:{errorCode:12041,desc:"LinkTypesManager unknown link subtype",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},LT_INVALID_LINK_TYPE:{errorCode:12042,desc:"LinkTypesManager.getNewLink - invalid linkType:",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},SKIN_ALREADY_EXIST:{errorCode:12051,desc:"Invalid skin: skin name already exist",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},SKIN_PARAM_NOT_PROVIDED:{errorCode:12053,desc:"Skin param error: param not provided for skin with tags",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},SKIN_PROBLEM_WITH_RULE:{errorCode:12054,desc:"problem with creating rule",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},SKIN_ALREADY_IN_USE:{errorCode:12055,desc:"Skin already in use",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},VM_INVALID_SITE_NODE:{errorCode:12061,desc:"Invalid site node",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},VM_INVALID_SITE_DATA:{errorCode:12062,desc:"Invalid site node",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},TRAIT_INVALID:{errorCode:12071,desc:"Invalid trait data",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},TRAIT_DOUBLE_NAME:{errorCode:12073,desc:"Invalid trait name - a trait with the same name already exist: ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},TRAIT_DOUBLE_CLASS_NAME:{errorCode:12074,desc:"Invalid trait name - a class with the same name already exist: ",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},UTILS_RULE_ALREADY_EXIST:{errorCode:12081,desc:"Error creating a rule that already exist",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},UTILS_ERR_CREATE_STYLE:{errorCode:12082,desc:"Utils.createStyleSheet(styles.js) error creating stylesheet!",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},UTILS_STYLE_NOT_FOUND:{errorCode:12083,desc:"stylesheet not found on style node in setup",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CONFIG_MANAGER_NO_PARAM:{errorCode:12090,desc:"required param not supplied",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},UPLOAD_FAIL:{errorCode:21011,desc:"upload error",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.fatal},EM_ERROR_CLONE_SITE:{errorCode:22021,desc:"Error cloning site error",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},NO_DEFAULT_SKIN_FOUND:{errorCode:25001,desc:"Default skin not found for component",type:l.type.error,category:l.category.editor,issue:l.issue.skins,severity:l.severity.fatal},STYLE_EXTRA_PARAM_DEFINITION_MISSING:{errorCode:25002,desc:"No extra param definition found for style property",type:l.type.error,category:l.category.editor,issue:l.issue.skins,severity:l.severity.error},STYLE_PROP_SRC_UNKNOWN:{errorCode:25003,desc:"style property source unknown",type:l.type.error,category:l.category.editor,issue:l.issue.skins,severity:l.severity.error},PREVIEW_NOT_READY:{errorCode:22031,desc:"Preview error: Preview not ready",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},PREVIEW_INVALID_ID:{errorCode:22032,desc:"Preview error: invalid div id",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},PREVIEW_COMP_NOT_READY:{errorCode:22033,desc:"Preview component not ready",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},PREVIEW_ATTEMPT_LOAD_3_TIMES:{errorCode:22034,desc:"Preview was not loaded after 3 attempts, W is undefined",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},MEDIA_ERR_GETTING_LIST:{errorCode:22043,desc:"Error getting media list",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_CLASS_EMPTY_STRING:{errorCode:23090,desc:"className must be a non empty string",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_CLASS_RESERVED:{errorCode:23091,desc:"is reserved for WClass",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_INVALID_BIND:{errorCode:23092,desc:"is not a function",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_CLASS_MUST_USE_NEW_OP:{errorCode:23093,desc:'Class must be used with the "new" operator',type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},WCLASS_CLASS_DATA_INVALID:{errorCode:23094,desc:"Invalid class data",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},INVALID_TRAIT_USAGE:{errorCode:23095,desc:"Invalid trait usage",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},CLASS_ALREADY_EXIST:{errorCode:23096,desc:"Class already exist",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SERVER_RETURNED_ERROR:{errorCode:30000,desc:"Server returned an error",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_CONNECTION:{errorCode:30011,desc:"Server connection error",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_CALLBACK:{errorCode:30001,desc:"Invalid callbacks: both onComplete and onError must be defined",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SITE_ID_STRING:{errorCode:30002,desc:"Invalid site id: must be a non-empty string",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SITE_ID_GUID:{errorCode:30003,desc:"Invalid site id: must be a valid GUID",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SITE_NAME_STRING:{errorCode:30004,desc:"Invalid site name: must be a non-empty string",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SITE_NAME_VALID:{errorCode:30005,desc:"Invalid site name: use only small letters, digits, _ and -",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_SERVICE_URL:{errorCode:30006,desc:"invalid serviceBaseUrl",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},SERVER_INVALID_BASE_URL:{errorCode:30007,desc:"Invalid services base url",type:l.type.error,category:l.category.server,issue:l.issue.defaultVal,severity:l.severity.fatal},BULK_INVALID_TARGET:{errorCode:13001,desc:"Invalid targets list: must be an array or Elements",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},BULK_TIMEOUT:{errorCode:13002,desc:"Bulk operation has timed out after",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},BULK_NO_METHOD:{errorCode:13003,desc:"No such method on target",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SCHEMA_MISSING_KEY:{errorCode:12001,desc:"value request for key which is not in schema: [key, data, schema]",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SCHEMA_MISSING:{errorCode:12099,desc:"data was inserted with type that does not exist: [schema]",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SCHEMA_UNIMPLEMENTED_RESET:{errorCode:12003,desc:"re-set of data is not implemented yet",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},EDITOR_NO_SKIN:{errorCode:21001,desc:"no skin provided for item",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},EDITOR_MANAGER_MISSING_SITE_HEADER:{errorCode:22001,desc:"Can't find global var 'siteHeader' on window",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},EDITOR_MANAGER_INVALID_FLOW_EVENT:{errorCode:22002,desc:"Invalid flow event",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},EDITOR_MANAGER_NO_TEMPLATE_CHANGE_PAGE:{errorCode:22003,desc:"No site template selected and trying to change page",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},EDITOR_MANAGER_CLONING_SITE:{errorCode:22004,desc:"Error cloning site",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},EDITOR_MANAGER_SAVE_SITE:{errorCode:22005,desc:"Trying to save a site with no id or template or site is not loaded",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},RESOURCE_MANAGER_BUNDLE_NOT_FOUND:{errorCode:22006,desc:"Bundle not found",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.error},SITE_STRUCTURE_NO_SITE_PAGES:{errorCode:11001,desc:"No SITE_PAGES node found in site",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},IMAGE_LOAD_ERROR:{ignore:true,errorCode:11002,desc:"Image failed to load",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},THEME_MANAGER_UNKNOWN_PROPERTY:{errorCode:12004,desc:"Unknown property",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},THEME_MANAGER_INVALID_PROPERTY:{errorCode:12005,desc:"Invalid property name",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_NO_DATA_FOR_SKIN:{errorCode:12006,desc:"no skin data found for skin",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_MISSING_ARGUMENTS:{errorCode:12007,desc:"missing arguments for skin",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_RE_REGISTER:{errorCode:12008,desc:"can not re-register skin for component",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_METHOD_CALLED_AGAIN:{errorCode:12009,desc:"method cannot be called more than once",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},SKIN_MANAGER_NO_INLINE_CONTENT_SKINPART_FOUND:{errorCode:12010,desc:"component has inline content, but is missing the inlineContent skinPart",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},VIEW_MANAGER_INVALID_PAGE:{errorCode:12011,desc:"invalid pageId and/or URL",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.error},WIXIFY_INVALID_DATA_TYPE:{errorCode:13004,desc:"data type provided didn't match component acceptable data types",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},WIXIFY_MISSING_DATA_TYPE:{errorCode:13012,desc:"The provided data object does not contain a data type",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.warning},WIXIFY_NO_COMP:{errorCode:13005,desc:"no comp attribute found",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},WIXIFY_NO_SKIN:{errorCode:13006,desc:"no skin attribute found",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},WIXIFY_ALREADY_WIXIFIED:{errorCode:13007,desc:"node has already been wixified",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},WIXIFY_TIMEOUT:{ignore:true,errorCode:13008,desc:"node was not wixified on time",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.error},WIXIFY_FINISHED_AFTER_TIMEOUT:{ignore:true,errorCode:13020,desc:"node was wixified after timeout",type:l.type.error,category:l.category.core,issue:l.issue.defaultVal,severity:l.severity.warning},SITE_NAME_NO_SELECTED_CATEGORY:{errorCode:21002,desc:"no category selected",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},EDITOR_INDEX_OUT_OF_RANGE:{errorCode:21003,desc:"The index provided was out of range",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.recoverable},COMMAND_DUPLICATE:{errorCode:13009,desc:"command is already defined",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},BAD_COMMAND:{errorCode:13010,desc:"command is neither string nor a Command object",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},MISSING_COMMAND:{errorCode:13011,desc:"A command with this name was not found",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},INVALID_EDITOR_META_DATA:{errorCode:21006,desc:"The EDITOR_META_DATA object of this component is missing or defective",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},DM_MALFORMED_QUERY:{errorCode:12013,desc:"Malformed data query",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},CM_NO_DICTIONARY_DATA:{errorCode:12039,desc:"dictionary data is unavailable for skinPart",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.fatal},INVALID_METADATA_FIELD:{errorCode:12015,desc:"invalid metadata field name",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},DATA_MISSING_SNAPSHOT:{errorCode:12016,desc:"Missing snapshot for data item",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},GET_ALPHA_OF_NOT_COLOR_PROPERTY:{errorCode:12017,desc:"Attempt to access opacity of a property that is not of type color",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},SET_ALPHA_OF_NOT_COLOR_PROPERTY:{errorCode:12018,desc:"Attempt to set opacity of a property that is not of type color",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},SET_BOX_SHADOW_TOGGLE_OF_NOT_BOX_SHADOW_PROPERTY:{errorCode:12019,desc:"Attempt to set box shadow toggle on of a property that is not of type box shadow",type:l.type.error,category:l.category.core,issue:l.issue.managers,severity:l.severity.recoverable},DRAGGABLE_COMPONENT_MISSING_HANDLE_ERROR:{errorCode:11020,desc:"Draggable component don't define a drag handle skin part",type:l.type.error,category:l.category.core,issue:l.issue.components,severity:l.severity.error},MEDIA_GALLERY_MISSING_CONFIG:{errorCode:21004,desc:"Media Dialog opened without config",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},STYLE_ALREADY_EXISTS:{errorCode:21005,desc:"Attempt to create a style that already exists",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},MENU_CORRUPTION_UNKNOWN_PAGE:{errorCode:22007,desc:"MAIN_MENU has unknown page",type:l.type.error,category:l.category.viewer,issue:l.issue.modal,severity:l.severity.recoverable},MENU_CORRUPTION_MISSING_PAGE:{errorCode:22008,desc:"MAIN_MENU is missing a page",type:l.type.error,category:l.category.viewer,issue:l.issue.modal,severity:l.severity.recoverable},APPS_OPEN_TIMEOUT:{errorCode:220090,desc:"App timeout - application failed to call the init() method",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.recoverable},APPS_UNABLE_TO_COMPLETE_PROVISION_POST_SAVE:{errorCode:220091,desc:"Unable to complete the provisioning of apps after metasite save",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.recoverable},APPS_UNABLE_TO_LOAD_APP_DEFINITIONS:{errorCode:220092,desc:"Unable to load apps definitions",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.recoverable},EXPERIMENT_UNKNOWN:{errorCode:220093,desc:"Experiment id is missing from the ordered list of experiments",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.warning},EXPERIMENT_IN_CONFLICT:{errorCode:220094,desc:"Experiment id is in conflict with another open experiment",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},EXPERIMENT_MISSING_DEPENDENCY:{errorCode:220095,desc:"Experiment id requires another experiment to operate, but that depency was not opened",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},EXPERIMENT_DEPLOYMENT_TIMEOUT:{errorCode:220099,desc:"Timeout while waiting for all marked experiments to deploy",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.fatal},HTML_SCRIPTS_LOADER_UNABLE_TO_LOAD_INDEX:{errorCode:220096,desc:"unable to load index.json",type:l.type.error,category:l.category.editor,issue:l.issue.defaultVal,severity:l.severity.fatal},HTML_SCRIPTS_LOADER_INVALID_INDEX:{errorCode:220097,desc:"Invalid index.json format",type:l.type.error,category:l.category.editor,issue:l.issue.defaultVal,severity:l.severity.fatal},WALK_ME_FAILED_TO_LOAD:{errorCode:220098,desc:"Walk Me failed to load",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.warning},LINK_DATA_ITEM_DOESNT_EXIST:{errorCode:220100,desc:"Link data item does not exsit",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.warning},COMPONENT_ALREADY_REGISTERED_IN_LIFECYCLE:{errorCode:220101,desc:"failed to register component, component already registered to licycle.",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.warning},COMPONENT_NOT_REGISTERED_IN_LIFECYCLE:{errorCode:220102,desc:"cannot update component state - component not registered.",type:l.type.error,category:l.category.editor,issue:l.issue.managers,severity:l.severity.warning}};
var WixGoogleAnalytics=function(d,f,e,b,a,c,g){this._wixAccounts=d;
this._userAccounts=f;
this._version=e;
this._userType=b;
this._userLanguage=a;
this._sendPageTrackToUser=c;
this._sendPageTrackToWix=g;
if(!window._gaq){var h=document.createElement("script");
h.type="text/javascript";
h.async=true;
h.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";
var i=document.getElementsByTagName("script")[0];
i.parentNode.insertBefore(h,i)
}};
WixGoogleAnalytics.prototype.sendEvent=function(c,f){var b=wixLogLegend.getKey("type",c.type);
var e=c.desc;
var a=f.label||((f.c1?"c1: "+f.c1+"|":"")+(f.g1?"g1: "+f.g1+"|":"")+(f.i1?"i1: "+f.i1:""));
var d=f.value||f.time;
this._sendAnalyticEvent(b,e,a,d)
};
WixGoogleAnalytics.prototype.sendError=function(e,c,a,h){var d=wixLogLegend.getKey("type",e.type);
var g=e.desc;
var b=c+"."+a+" : "+h.label;
var f=h.value||h.time;
this._sendAnalyticEvent(d,g,b,f)
};
WixGoogleAnalytics.prototype.sendPageEvent=function(b){window._gaq=window._gaq||[];
var a=function(g,c,e){for(var d=0;
d<g.length;
++d){if(g[d].length>0){var f=(d===0)?"":"t"+d+".";
window._gaq.push([f+"_setAccount",g[d]]);
window._gaq.push([f+"_setAllowAnchor",true]);
if(e){window._gaq.push([f+"_setCustomVar",1,"version",this._version,1]);
window._gaq.push([f+"_setCustomVar",2,"language",this._userLanguage,1]);
window._gaq.push([f+"_setCustomVar",3,"userType",this._userType,1])
}window._gaq.push([f+"_trackPageview",c])
}}}.bind(this);
if(this._sendPageTrackToUser){a(this._userAccounts,b,false)
}else{if(this._sendPageTrackToWix){a(this._wixAccounts,b,true)
}}};
WixGoogleAnalytics.prototype._sendAnalyticEvent=function(a,b,c,f){a=a||"";
b=b||"";
c=c||"";
f=f||0;
var g=function(k,n,h,i,j,m){window._gaq=window._gaq||[];
window._gaq.push([k+"_setAccount",n]);
window._gaq.push([k+"_setCustomVar",1,"version",this._version,1]);
window._gaq.push([k+"_setCustomVar",2,"language",this._userLanguage,1]);
window._gaq.push([k+"_setCustomVar",3,"userType",this._userType,1]);
window._gaq.push([k+"_trackEvent",h,i,j,m])
};
if(this._wixAccounts){for(var d=0;
d<this._wixAccounts.length;
++d){var e=(d===0)?"":"t"+d+".";
g(e,this._wixAccounts[d],a,b,c,f)
}}};
var WixBILogger=function(i,c,g,a,f,e,h,d,j,b){this._wixLogger=i;
j=encodeURIComponent(j);
b=b?b:3;
this.logScript=null;
this._floggerServerURL=(c.charAt(c.length-1)!=="/")?c+"/":c;
this._commonFieldsFiltersByAdapter={hed:["src","evid","ts","esi"],trg:["src","did","uid","gsi","cid","ver","lng","evid","ts","esi","cat","errc","iss","sev","errscp","trgt","dsc"]};
this._common={src:b,did:a,uid:f,gsi:h,cid:d,ver:g,lng:"en-US",evid:0,ts:0};
this._keyArray={errorKeys:["errc","iss","sev","dsc"],funnelKeys:["g1","i1","c1"]}
};
WixBILogger.prototype.setSrc=function(a){this._common.src=a
};
WixBILogger.prototype.setDocId=function(a){this._common.did=a
};
WixBILogger.prototype.setMetaSiteId=function(a){this._common.msid=a
};
WixBILogger.prototype.setEditorSessionId=function(a){this._common.esi=a
};
WixBILogger.prototype.sendError=function(j,b,g,c,k){if(!j){return
}this._common.evid=j.type||10;
var m=j.category;
this._common.cat=m;
this._common.ts=this._wixLogger.getSessionTime();
var h=k||j.httpResponse||0;
var f=j.errorCode;
var e;
var d=this._common;
if(typeof c=="string"){e=c
}else{if(typeof c=="object"&&c.hasOwnProperty("src")){d=Object.clone(this._common);
d.src=c.src;
e=c.desc
}else{e=(W&&W.Utils)?W.Utils.getStackTrace():""
}}e=encodeURI(e);
var a={errc:f,iss:j.issue,sev:j.severity,errscp:b,trgt:g,dsc:e};
var i=this._combineObjectToString(a);
this._createReport("trg",i,d)
};
WixBILogger.prototype.sendEvent=function(c,e){var d=this.generateEventString(c,e);
var a=c.biAdapter?c.biAdapter:"mee";
var b=this._common;
if(typeof e=="object"&&e.hasOwnProperty("src")){b=Object.clone(this._common);
b.src=e.src
}this._createReport(a,d,b)
};
WixBILogger.prototype.generateEventString=function(b,c){if(!b){return""
}c=c||{};
var a=[c.g1,c.i1,c.c1];
this._common.evid=b.biEventId;
this._common.ts=this._wixLogger.getSessionTime();
return this._combineArraysToString(this._keyArray.funnelKeys,a)
};
WixBILogger.prototype._createReport=function(a,d,b){var c=this._objToURLParamsStringWithFilter(b,this._commonFieldsFiltersByAdapter[a]);
this._createHit(this._floggerServerURL+a+"?"+c+d)
};
WixBILogger.prototype._createHit=function(b){if(debugMode&&!(debugMode=="unit_test")){var a=new Image(0,0);
a.src=b
}};
WixBILogger.prototype._combineArraysToString=function(b,e){var d="";
for(var a=0;
a<b.length;
a++){var c=(!e[a]&&e[a]!==0)?"":e[a];
d=d+b[a]+"="+c+"&"
}return d
};
WixBILogger.prototype._combineObjectToString=function(c){var a=[];
for(var b in c){a.push(b+"="+c[b])
}return a.join("&")
};
WixBILogger.prototype._objToURLParamsStringWithFilter=function(c,a){var e="";
for(var b in c){if(!a||(a.indexOf(b)!=-1)){var d=(!c[b]&&c[b]!==0)?"":c[b];
e+=b+"="+d+"&"
}}return e
};
var WixLogger=function(b){this.reset();
this._settings=b;
this.setDebugMode(b.debugMode||false);
this._initGoogleAnalytics(b);
try{this._wixBI=new WixBILogger(this,b.floggerServerURL,b.version,b.siteId,b.userId,b.userType,b.session,b.computerId,b.creationSource,b.wixAppId)
}catch(a){this._wixBI={setDocId:function(){},sendError:function(){},sendEvent:function(){}}
}this.reportEditorLoadingEvent("LOGGER STARTED",110)
};
WixLogger.prototype._initGoogleAnalytics=function(b){var a=(b.enableGoogleAnalytics!==false);
this._analytics={sendError:function(){},sendEvent:function(){},sendPageEvent:function(){}};
if(a){try{this._analytics=new WixGoogleAnalytics(b.wixAnalytics,b.userAnalytics,b.version,b.userType,b.userLanguage,b.sendPageTrackToUser,b.sendPageTrackToWix)
}catch(c){}}};
WixLogger.prototype.reset=function(){this._logList=[];
this._timeData={};
this._initTime=new Date().getTime()
};
WixLogger.prototype.getSessionTime=function(){return new Date().getTime()-this._initTime
};
WixLogger.prototype.updateSetting=function(c,b){var a=this._settings||{};
a[c]=b;
switch(c){case"siteId":this._wixBI.setDocId(b);
break;
case"wixAppId":this._wixBI.setSrc(b);
break;
case"editorSessionId":this._wixBI.setEditorSessionId(b);
break;
case"metaSiteId":this._wixBI.setMetaSiteId(b);
break
}};
WixLogger.prototype.getLog=function(){return this._logList.concat()
};
WixLogger.prototype.clearLog=function(){this._logList=[]
};
WixLogger.prototype.setDebugMode=function(a){this._debugMode=a
};
WixLogger.prototype.reportError=function(c,b,a,d){if(c.ignore){return
}d=d||{};
if(this._handleLogObj("reportError",c,d,{className:b,methodName:a})){this._wixBI.sendError(c,b,a,d);
this._analytics.sendError(c,b,a,d);
this._settings.onError&&this._settings.onError(c,b,a,d)
}if(this._debugMode){return null
}return function(){}
};
WixLogger.prototype.reportEvent=function(a,b){b=b||{};
if(this._handleLogObj("reportEvent",a,b)){if(a.biEventId){this._wixBI.sendEvent(a,b)
}this._analytics.sendEvent(a,b);
this._settings.onEvent&&this._settings.onEvent(a,b)
}};
WixLogger.prototype.reportEditorLoadingEvent=function(a,c){var b=window.viewMode;
if(b!="site"){this.reportEvent(wixEvents.LOADING_STEPS,{c1:c+":"+b+": "+a})
}};
WixLogger.prototype.reportPageEvent=function(a){if(W.Config.getDebugMode()!=="nodebug"){return
}this._analytics.sendPageEvent(this._sanitizePageUrl(a,window.viewMode))
};
WixLogger.prototype._sanitizePageUrl=function(a,b){if(b=="editor"){a=this._sanitizeUrlForWixBI(a)
}return a
};
WixLogger.prototype._sanitizeUrlForWixBI=function(a){return a
};
WixLogger.prototype.addErrors=function(a){Object.forEach(a,this.addError.bind(this))
};
WixLogger.prototype.addError=function(b,a){if(!(a in this._settings.errors)&&this.isUniqueErrorCode(b.errorCode)){this._settings.errors[a]=b
}else{throw new Error("Invalid error object: "+a)
}};
WixLogger.prototype.isUniqueErrorCode=function(a){return Object.every(this._settings.errors,function(b){return a!==b.errorCode
})
};
WixLogger.prototype._handleLogObj=function(c,a,d,e){if(!a){return false
}a.callCount=a.callCount||0;
if(a.callLimit&&a.callLimit<=a.callCount){return false
}else{this._checkTime(a,d);
this._logLog(c,a,d,e);
if((a.thresholdTime||a.thresholdTime===0)&&d.time>=a.thresholdTime){if(a.thresholdError){var b=this._settings.errors[a.thresholdError];
this.reportError(b)
}}a.callCount++
}return true
};
WixLogger.prototype._logLog=function(){this._logList.push(arguments)
};
WixLogger.prototype._checkTime=function(a,b){b=b||{};
b.time=this._getTime(a.timerId)
};
WixLogger.prototype._getTime=function(a){a=a||"initTime";
var b=this._initTime;
var c=new Date().getTime();
if(a!="initTime"){b=this._timeData[a]||this._initTime;
this._timeData[a]=c
}return c-b
};
Object.merge(wixErrors,{INVALID_INPUT_BIND:{errorCode:26001,desc:"Invalid input field bind",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},STYLES_DO_NOT_EXIST:{errorCode:26002,desc:"Styles were not retrieved from editor data",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},COMPONENT_STYLES_DO_NOT_EXIST:{errorCode:26003,desc:"Component styles were not retrieved from editor data",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},AUTOPANEL_SKIN_DOES_NOT_EXIST:{errorCode:26004,desc:"Skin defined in generator does not exist",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},AUTOPANEL_SKIN_STYLES_DOES_NOT_EXIST:{errorCode:26005,desc:"Skin collection defined in generator does not exist",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.error},CKEDITOR__FAILED_DESTROY:{errorCode:26006,desc:"ck-editor destroy failed, entered catch block",type:l.type.error,category:l.category.editor,issue:l.issue.components,severity:l.severity.warning}});