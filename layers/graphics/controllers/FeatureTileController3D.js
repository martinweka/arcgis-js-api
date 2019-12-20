// COPYRIGHT © 2019 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/4.14/esri/copyright.txt for details.

define(["require","exports","../../../core/tsSupport/declareExtendsHelper","../../../core/tsSupport/decorateHelper","../../../core/tsSupport/assignHelper","../../../core/tsSupport/generatorHelper","../../../core/tsSupport/awaiterHelper","../../../core/Accessor","../../../core/asyncUtils","../../../core/Collection","../../../core/compilerUtils","../../../core/Error","../../../core/Handles","../../../core/iteratorUtils","../../../core/lang","../../../core/Logger","../../../core/maybe","../../../core/Promise","../../../core/promiseUtils","../../../core/watchUtils","../../../core/accessorSupport/decorators","../../support/arcgisLayerUrl","../../../portal/support/geometryServiceUtils","../../../tasks/support/StatisticDefinition","../../../views/3d/layers/support/FeatureTileFetcher3D","../../../views/3d/layers/support/FeatureTileFetcher3DDebugger","../../../views/3d/support/debugFlags","../../../views/support/WatchUpdatingTracking"],function(e,t,r,i,n,a,o,s,l,c,u,p,h,d,m,f,y,g,v,F,x,b,T,E,O,w,C,D){function S(e,t){if(e&&-1!==e.indexOf("*"))return!1;if(!e)return!!t;if(!t)return!1;for(var r=d.createSetFromValues(e),i=0,n=t;i<n.length;i++){var a=n[i];if(!r.has(a))return!0}return!1}var _=f.getLogger("esri.layers.graphics.controllers.FeatureTileController3D"),I=function(e){function t(t){var r=e.call(this,t)||this;return r.type="feature-tile-3d",r.watchUpdatingTracking=new D.WatchUpdatingTracking,r.serviceDataExtent=null,r.serviceDataCount=n.constants.NO_SERVICE_DATA_COUNT,r.vertexLimitExceeded=!1,r.displayFeatureLimit=null,r.suspended=!1,r.tileFetcher=null,r.handles=new h,r.fetchDataInfoPromise=null,r.fetchDataInfoAbortController=null,r.lifeCycleAbortController=v.createAbortController(),r}r(t,e),n=t,Object.defineProperty(t.prototype,"extent",{set:function(e){if(e&&!e.spatialReference.equals(this.layerView.view.spatialReference))return void _.error("#extent=","extent needs to be in the same spatial reference as the view");var t=this._get("extent");if(t!==e&&!(t&&e&&t.equals(e))){var r=e?e.clone():null;this._set("extent",r)}},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"updating",{get:function(){return!!(this.tileFetcher&&this.tileFetcher.updating||null!=this.fetchDataInfoPromise||"tiles"===this.mode&&this.layerView.view.featureTiles&&this.layerView.view.featureTiles.updating||this.watchUpdatingTracking&&this.watchUpdatingTracking.updating)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"updatingTotal",{get:function(){return this.updating&&this.tileFetcher?this.tileFetcher.updatingTotal:0},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"updatingRemaining",{get:function(){return this.updating&&this.tileFetcher?this.tileFetcher.updatingRemaining:0},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"expectedFeatureDiff",{get:function(){return this.updating&&this.tileFetcher?this.tileFetcher.expectedFeatureDiff:0},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"memoryForUnusedFeatures",{get:function(){return this.tileFetcher?this.tileFetcher.memoryForUnusedFeatures:0},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"maximumNumberOfFeaturesExceeded",{get:function(){return!(!this.tileFetcher||!this.tileFetcher.maximumNumberOfFeaturesExceeded)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"filteredDataExtent",{get:function(){return this.extent},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"maximumNumberOfFeatures",{get:function(){return this.displayFeatureLimit?this.displayFeatureLimit.maximumNumberOfFeatures:0},set:function(e){e!==this.maximumNumberOfFeatures&&(null==e?this._clearOverride("maximumNumberOfFeatures"):this._override("maximumNumberOfFeatures",e))},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"hasMaximumNumberOfFeaturesOverride",{get:function(){return this._isOverridden("maximumNumberOfFeatures")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"mode",{get:function(){if(this.serviceDataCount===n.constants.NO_SERVICE_DATA_COUNT||this.vertexLimitExceeded)return"tiles";var e=this.layerView,t=e.layer,r=e.view,i=r&&r.featureTiles,a=i&&i.tilingScheme;if(t&&t.minScale&&this.serviceDataExtent&&a){var o=this.approximateExtentSizeAtScale(t.minScale,a);if((this.serviceDataExtent.width/o+this.serviceDataExtent.height/o)/2>n.constants.MAX_SNAPSHOT_MIN_SCALE_FACTOR)return"tiles"}return!this.maximumNumberOfFeatures||this.serviceDataCount<=this.maximumNumberOfFeatures?"snapshot":"tiles"},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"maxTotalSnapshotVertices",{get:function(){var e=this._get("maxTotalSnapshotVertices")||0,t="snapshot"===this.mode&&this.tileFetcher&&this.tileFetcher.totalVertices||0;return Math.max(e,t)},enumerable:!0,configurable:!0}),t.prototype.approximateExtentSizeAtScale=function(e,t){var r=this.layerView.view,i=Math.ceil((r.width/t.pixelSize+r.height/t.pixelSize)/2),n=t.levels[0];return i*((n.tileSize[0]/(n.scale/e)+n.tileSize[1]/(n.scale/e))/2)},Object.defineProperty(t.prototype,"tileDescriptors",{get:function(){return"snapshot"===this.mode?new c([{id:"dummy-tile-full-extent",lij:[0,0,0]}]):this.layerView.view.featureTiles?this.layerView.view.featureTiles.tiles:new c},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"test",{get:function(){return{fetchDataInfoPromise:this.fetchDataInfoPromise,tileFetcher:this.tileFetcher}},enumerable:!0,configurable:!0}),t.prototype.initialize=function(){var e=this;this.watchUpdatingTracking.add(this,"vertexLimitInfo",function(){return e.watchUpdatingTracking.addPromise(e.updateVertexLimitExceeded(null,e.lifeCycleAbortController.signal))}),this.watchUpdatingTracking.add(this,"mode",function(){return e.modeChanged()},2);var t=v.resolve().then(function(){return e.verifyCapabilities()}).then(function(){return e.watchUpdatingTracking.addPromise(e.fetchServiceDataInfo())}).then(function(){return e.initializeTileFetcher()});this.addResolvingPromise(t)},t.prototype.verifyCapabilities=function(){var e=this.layerView.layer;if(!e.get("capabilities.operations.supportsQuery"))throw new p("graphicscontroller:query-capability-required","Service requires query capabilities to be used as a feature layer",{layer:e})},t.prototype.destroy=function(){this.cancelFetchServiceDataInfo(),this.tileFetcher&&(this.tileFetcher.destroy(),this.tileFetcher=null),this.handles&&(this.handles.destroy(),this.handles=null),this.tilesHandle&&(this.tilesHandle.remove(),this.tilesHandle=null),this.lifeCycleAbortController&&(this.lifeCycleAbortController.abort(),this.lifeCycleAbortController=null),this.watchUpdatingTracking.destroy(),this._set("watchUpdatingTracking",null)},t.prototype.suspend=function(){this.suspended||(this.suspended=!0,this.tileFetcher&&this.tileFetcher.suspend())},t.prototype.resume=function(){this.suspended&&(this.suspended=!1,this.tileFetcher&&this.tileFetcher.resume())},t.prototype.restart=function(){var e=this,t=function(){e.tileFetcher&&e.tileFetcher.restart()};this.watchUpdatingTracking.addPromise(this.fetchServiceDataInfo().then(t,t))},t.prototype.refetch=function(){var e=this,t=function(){e.tileFetcher&&e.tileFetcher.refetch()};this.watchUpdatingTracking.addPromise(this.fetchServiceDataInfo().then(t,t))},t.prototype.initializeTileFetcher=function(){var e=this,t=this.layerView.view,r=F.whenOnce(t.featureTiles,"tilingScheme",this.lifeCycleAbortController.signal);this.watchUpdatingTracking.addPromise(r),r.then(function(){var r=e,i=r.layerView,n=r.tileDescriptors,a=i.layer;e.tileFetcher=new O.FeatureTileFetcher3D({context:e.context,filterExtent:e.filteredDataExtent,tileDescriptors:n,features:e.graphics}),e.suspended?e.tileFetcher.suspend():e.tileFetcher.resume();var o=e.layerView.view.resourceController;o&&(e.handles.add(o.memoryController.events.on("quality-changed",function(t){e.tileFetcher.memoryFactor=t})),e.tileFetcher.memoryFactor=o.memoryController.memoryFactor);var s="polygon"===e.context.geometryType?"polygonLodFactor":"polyline"===e.context.geometryType?"polylineLodFactor":null;s&&e.handles.add(F.init(e.layerView.view,"qualitySettings.graphics3D."+s,function(t){e.tileFetcher.lodFactor=t||1}));var l=function(t){e.tileFetcher.maximumNumberOfFeatures=t,e.tileFetcher.useTileCount=e.serviceDataCount>t},c=function(t){return e.tileFetcher.useTileCount=t>e.maximumNumberOfFeatures};e.watchUpdatingTracking.add(a,"definitionExpression",function(){return e.definitionExpressionChanged()}),e.watchUpdatingTracking.add(i,"availableFields",function(t,r){return e.availableFieldsChanged(r,t)}),e.watchUpdatingTracking.add(i,"requiredFields",function(t,r){return e.requiredFieldsChanged(r,t)}),e.handles.add([a.on("apply-edits",function(t){return e.applyEdits(t)}),e.watch("filteredDataExtent",function(t){return e.tileFetcher.filterExtent=t},!0),e.watch("tileDescriptors",function(t){return e.tileFetcher.tileDescriptors=t},!0),F.init(e,"maximumNumberOfFeatures",l,!0),F.init(e,"serviceDataCount",c,!0),F.init(C,"FEATURE_TILE_FETCH_SHOW_TILES",function(r){r&&e.tileFetcher&&!e.tileFetcher.debugger?(e.tileFetcher.debugger=new w.FeatureTileFetcher3DDebugger(e.tileFetcher,t.featureTiles.tilingScheme.toTileInfo(),t),e.tileFetcher.debugger.update()):!r&&e.tileFetcher&&e.tileFetcher.debugger&&(e.tileFetcher.debugger.destroy(),e.tileFetcher.debugger=null)})]),e.supportsExceedsLimitQuery||e.watchUpdatingTracking.add(e,"maxTotalSnapshotVertices",function(){return e.watchUpdatingTracking.addPromise(e.updateVertexLimitExceeded(null,e.lifeCycleAbortController.signal))})}).catch(function(){})},t.prototype.modeChanged=function(){switch(this.mode){case"tiles":this.tilesHandle||(this.tilesHandle=this.layerView.view.featureTiles.addClient());break;default:_.warn("Unhandled feature layer mode "+this.mode);case"snapshot":this.tilesHandle&&(this.tilesHandle.remove(),this.tilesHandle=null)}},t.prototype.definitionExpressionChanged=function(){this._set("maxTotalSnapshotVertices",0),this.notifyChange("maxTotalSnapshotVertices"),this.refetch()},t.prototype.applyEdits=function(e){var t=this;this.tileFetcher.applyEdits(e).then(function(e){e&&(e.deletedFeatures.length||e.updatedFeatures.length||e.addedFeatures.length)&&t.watchUpdatingTracking.addPromise(t.updateServiceDataExtent(t.lifeCycleAbortController.signal))})},t.prototype.availableFieldsChanged=function(e,t){S(e,t)&&this.refetch()},t.prototype.requiredFieldsChanged=function(e,t){S(e,t)&&this.restart()},t.prototype.createVertexLimitExceededQuery=function(e){var t=this.layerView.layer,r=t.createQuery();return r.outStatistics=[new E({statisticType:"exceedslimit",maxVertexCount:e,outStatisticFieldName:"exceedslimit",maxPointCount:1e8,maxRecordCount:1e8})],t.capabilities.query.supportsCacheHint&&(r.cacheHint=!0),r},t.prototype.createDataInfoQuery=function(){var e=this.layerView.layer,t=e.createQuery();return t.outSpatialReference=this.layerView.view.spatialReference,e.capabilities.query.supportsCacheHint&&(t.cacheHint=!0),t},t.prototype.fullExtentIsAccurate=function(){var e=this.layerView,t=e.layer;if(t.definitionExpression)return!1;switch(t.type){case"feature":case"stream":return b.isHostedAgolService(t.url);case"csv":case"geojson":return!0;default:return void u.neverReached(t)}},t.prototype.updateServiceDataExtent=function(e){return o(this,void 0,void 0,function(){var t;return a(this,function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,this.tryUpdateServiceDataExtent(e)];case 1:return r.sent(),[3,3];case 2:return t=r.sent(),v.isAbortError(t)||this._set("serviceDataExtent",m.clone(this.layerView.fullExtentInLocalViewSpatialReference)),[3,3];case 3:return[2]}})})},t.prototype.tryUpdateServiceDataExtent=function(e){return o(this,void 0,void 0,function(){var t,r,i,o,s,l,c,u,p,h,d,f;return a(this,function(a){switch(a.label){case 0:return t=this.layerView,(r=t.layer,i=r.capabilities.query.supportsExtent,o=m.clone(t.fullExtentInLocalViewSpatialReference),s=r.fullExtent,l=this.fullExtentIsAccurate(),c=this.serviceDataCount,u=i&&c<=n.constants.MAX_FEATURE_COUNT_FOR_EXTENT&&(!o||!l))?(p=this.createDataInfoQuery(),[4,r.queryExtent(p,{timeout:n.constants.QUERY_EXTENT_TIMEOUT,signal:e})]):[3,2];case 1:return h=a.sent(),this._set("serviceDataExtent",h.extent),[3,6];case 2:return o?(this._set("serviceDataExtent",o),[3,6]):[3,3];case 3:return s?(d="portalItem"in r?r.portalItem:null,[4,T.projectGeometry(s,t.view.spatialReference,d,e)]):[3,5];case 4:return f=a.sent(),this._set("serviceDataExtent",f),[3,6];case 5:this._set("serviceDataExtent",null),a.label=6;case 6:return[2]}})})},t.prototype.updateServiceDataCount=function(e){return o(this,void 0,void 0,function(){var t,r,i;return a(this,function(a){switch(a.label){case 0:return t=this.layerView.layer,[4,l.result(t.queryFeatureCount(this.createDataInfoQuery(),{timeout:n.constants.QUERY_STATISTICS_TIMEOUT,signal:e}))];case 1:if(r=a.sent(),!0===r.ok)this._set("serviceDataCount",r.value);else{if(v.isAbortError(r.error))throw r.error;i=n.constants.NO_SERVICE_DATA_COUNT,this._set("serviceDataCount",i)}return[2]}})})},Object.defineProperty(t.prototype,"vertexLimitInfo",{get:function(){if(!this.displayFeatureLimit||!this.displayFeatureLimit.maximumSymbolComplexity)return null;var e=this.displayFeatureLimit,t=e.maximumSymbolComplexity,r=e.maximumTotalNumberOfPrimitives,i=t.primitivesPerCoordinate,n=t.primitivesPerFeature,a=this._get("vertexLimitInfo");return y.isNone(a)||a.maximumTotalNumberOfPrimitives!==r||a.primitivesPerCoordinate!==i||a.primitivesPerFeature!==n?{primitivesPerCoordinate:i,primitivesPerFeature:n,maximumTotalNumberOfPrimitives:r}:a},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"supportsExceedsLimitQuery",{get:function(){var e=this.layerView.layer;return e.capabilities&&e.capabilities.operations&&e.capabilities.operations.supportsExceedsLimitStatistics},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"minimumNumberOfVerticesForGeometry",{get:function(){var e=this.layerView.layer.geometryType;switch(e){case"point":case"multipoint":return 1;case"polygon":return 4;case"polyline":return 2;case"multipatch":case"mesh":return 3;default:return u.neverReached(e),0}},enumerable:!0,configurable:!0}),t.prototype.updateVertexLimitExceeded=function(e,t){return o(this,void 0,void 0,function(){var r,i,o,s,c,u,p,h,d,m,f,g,F,x,b;return a(this,function(a){switch(a.label){case 0:return r=y.isSome(this.vertexLimitInfo)&&this.vertexLimitInfo.primitivesPerFeature<=0,(i=this.minimumNumberOfVerticesForGeometry>1,o=this.layerView.layer,s=this.supportsExceedsLimitQuery,y.isNone(this.vertexLimitInfo)||!r&&!i)?(this._set("vertexLimitExceeded",!1),[2]):(c=this.vertexLimitInfo,u=c.primitivesPerFeature,p=c.primitivesPerCoordinate,h=c.maximumTotalNumberOfPrimitives,d=0!==u,d&&y.isSome(e)?[4,e]:[3,2]);case 1:a.sent(),a.label=2;case 2:return m=this.serviceDataCount,g=m!==n.constants.NO_SERVICE_DATA_COUNT,f=g?Math.ceil((h-m*u)/(p||1)):Math.ceil(h/(p||1)),i&&(f=Math.min(f,U)),g&&this.minimumNumberOfVerticesForGeometry*m>f?(this._set("vertexLimitExceeded",!0),[2]):s?[4,l.result(o.queryFeatures(this.createVertexLimitExceededQuery(f),{timeout:n.constants.QUERY_STATISTICS_TIMEOUT,signal:t}))]:(this._set("vertexLimitExceeded",this.maxTotalSnapshotVertices>f),[2]);case 3:if(F=a.sent(),!1===F.ok){if(v.isAbortError(F.error))throw F.error;return this._set("vertexLimitExceeded",!1),[2]}return x=F.value,b=x.features[0],b&&b.attributes?this._set("vertexLimitExceeded",!!b.attributes.exceedslimit):this._set("vertexLimitExceeded",!1),[2]}})})},t.prototype.fetchServiceDataInfo=function(){return o(this,void 0,void 0,function(){var e,t,r,i,n,o=this;return a(this,function(a){return this.cancelFetchServiceDataInfo(),e=v.createAbortController(),t=e.signal,r=this.updateServiceDataCount(t),i=v.eachAlways([r,this.updateVertexLimitExceeded(r,t)]),n=i.then(function(){return o.updateServiceDataExtent(t)}).catch(function(e){v.isAbortError(e)||_.error("#fetchServiceDataInfo()",e)}).then(function(){n===o.fetchDataInfoPromise&&(o.fetchDataInfoPromise=null,o.fetchDataInfoAbortController=null),e=null}),e&&(this.fetchDataInfoPromise=n),this.fetchDataInfoAbortController=e,[2,i.then(function(){},function(){})]})})},t.prototype.cancelFetchServiceDataInfo=function(){var e=this.fetchDataInfoAbortController;e&&(this.fetchDataInfoAbortController=null,this.fetchDataInfoPromise=null,e.abort())},Object.defineProperty(t.prototype,"debug",{get:function(){return{storedFeatures:this.tileFetcher?this.tileFetcher.storedFeatures:0,totalFeatures:this.tileFetcher?this.tileFetcher.totalFeatures:0,totalVertices:this.tileFetcher?this.tileFetcher.totalVertices:0}},enumerable:!0,configurable:!0});var n;return i([x.property({readOnly:!0})],t.prototype,"type",void 0),i([x.property({constructOnly:!0})],t.prototype,"graphics",void 0),i([x.property({constructOnly:!0})],t.prototype,"layerView",void 0),i([x.property({constructOnly:!0})],t.prototype,"context",void 0),i([x.property()],t.prototype,"extent",null),i([x.property({dependsOn:["tileFetcher.updating","mode","layerView.view.featureTiles.updating","fetchDataInfoPromise","watchUpdatingTracking.updating"]})],t.prototype,"updating",null),i([x.property({readOnly:!0})],t.prototype,"watchUpdatingTracking",void 0),i([x.property({dependsOn:["updating","tileFetcher.updatingTotal"]})],t.prototype,"updatingTotal",null),i([x.property({dependsOn:["updating","tileFetcher.updatingRemaining"]})],t.prototype,"updatingRemaining",null),i([x.property({dependsOn:["updating","tileFetcher.expectedFeatureDiff"]})],t.prototype,"expectedFeatureDiff",null),i([x.property({dependsOn:["tileFetcher.memoryForUnusedFeatures"]})],t.prototype,"memoryForUnusedFeatures",null),i([x.property({dependsOn:["tileFetcher.maximumNumberOfFeaturesExceeded"]})],t.prototype,"maximumNumberOfFeaturesExceeded",null),i([x.property({readOnly:!0})],t.prototype,"serviceDataExtent",void 0),i([x.property({readOnly:!0})],t.prototype,"serviceDataCount",void 0),i([x.property({readOnly:!0})],t.prototype,"vertexLimitExceeded",void 0),i([x.property({readOnly:!0,dependsOn:["extent"]})],t.prototype,"filteredDataExtent",null),i([x.property()],t.prototype,"displayFeatureLimit",void 0),i([x.property({type:Number,dependsOn:["displayFeatureLimit"]})],t.prototype,"maximumNumberOfFeatures",null),i([x.property({readOnly:!0,dependsOn:["serviceDataCount","displayFeatureLimit","maximumNumberOfFeatures","vertexLimitExceeded","serviceDataExtent","layerView.layer.minScale","layerView.view.featureTiles.tilingScheme"]})],t.prototype,"mode",null),i([x.property({readOnly:!0,dependsOn:["mode","tileFetcher.totalVertices"]})],t.prototype,"maxTotalSnapshotVertices",null),i([x.property({readOnly:!0,dependsOn:["mode"]})],t.prototype,"tileDescriptors",null),i([x.property()],t.prototype,"tileFetcher",void 0),i([x.property()],t.prototype,"fetchDataInfoPromise",void 0),i([x.property({readOnly:!0,dependsOn:["displayFeatureLimit"]})],t.prototype,"vertexLimitInfo",null),t=n=i([x.subclass("esri.layers.graphics.controllers.FeatureTileController3D")],t)}(x.declared(g.EsriPromiseMixin(s))),U=5e6;return function(e){!function(e){function t(){e.MAX_FEATURE_COUNT_FOR_EXTENT=1e4,e.QUERY_STATISTICS_TIMEOUT=12e3,e.QUERY_EXTENT_TIMEOUT=1e4}e.NO_SERVICE_DATA_COUNT=1/0,e.MAX_SNAPSHOT_MIN_SCALE_FACTOR=5,e.reset=t}(e.constants||(e.constants={}))}(I||(I={})),I.constants.reset(),I});