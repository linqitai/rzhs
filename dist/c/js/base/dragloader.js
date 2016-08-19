define("xg/jx-business/1.0.0/c/js/base/dragloader",[],function(require,exports,module){!function(window){var document=window.document,navigator=window.navigator,msPointerEnabled=navigator.msPointerEnabled,TOUCH_EVENTS={start:msPointerEnabled?"MSPointerDown":"touchstart",move:msPointerEnabled?"MSPointerMove":"touchmove",end:msPointerEnabled?"MSPointerUp":"touchend"},dummyStyle=document.createElement("div").style,vendor=function(){for(var t,vendors="t,webkitT,MozT,msT,OT".split(","),i=0,l=vendors.length;i<l;i++)if(t=vendors[i]+"ransform",t in dummyStyle)return vendors[i].substr(0,vendors[i].length-1);return!1}(),prefixStyle=function(style){return""===vendor?style:(style=style.charAt(0).toUpperCase()+style.substr(1),vendor+style)},transition=prefixStyle("transition"),transitionEndEvent=function(){return"webkit"==vendor||"O"===vendor?vendor.toLowerCase()+"TransitionEnd":"transitionend"}(),listenTransition=function(target,duration,callbackFn){var me=this,clear=function(){target.transitionTimer&&clearTimeout(target.transitionTimer),target.transitionTimer=null,target.removeEventListener(transitionEndEvent,handler,!1)},handler=function(){clear(),callbackFn&&callbackFn.call(me)};clear(),target.addEventListener(transitionEndEvent,handler,!1),target.transitionTimer=setTimeout(handler,duration+100)},DragLoader=function(el,options){this.ct=el?"string"==typeof el?document.querySelector(el):el:document.body,options=options||{},this.options=options,"undefined"==typeof options.threshold&&(options.threshold=80),"undefined"==typeof options.dragDownThreshold&&(options.dragDownThreshold=options.threshold),"undefined"==typeof options.dragUpThreshold&&(options.dragUpThreshold=options.threshold),this._events={},this._draggable=!0,this.ct.addEventListener(TOUCH_EVENTS.start,this,!1)};DragLoader.prototype={STATUS:{"default":"default",prepare:"prepare",load:"load"},_createDragDownRegion:function(){return this._removeDragDownRegion(),this.header=document.createElement("div"),this.header.style.cssText="position:relative;top:0;left:0;margin:0;padding:0;overflow:hidden;width:100%;height:0px;",this.header.className=this.options.dragDownRegionCls||"",this._touchCoords.status=this._processStatus("down",0,null,!0),this.ct.insertBefore(this.header,this.ct.children[0]),this.header},_removeDragDownRegion:function(){this.header&&(this.ct.removeChild(this.header),this.header=null)},_createDragUpRegion:function(){return this._removeDragUpRegion(),this.footer=document.createElement("div"),this.footer.style.cssText="position:relative;bottom:0;left:0;margin:0;padding:0;overflow:hidden;width:100%;height:0px;",this.footer.className=this.options.dragUpRegionCls||"",this._touchCoords.status=this._processStatus("up",0,null,!0),this.ct.appendChild(this.footer),this.footer},_removeDragUpRegion:function(){this.footer&&(this.ct.removeChild(this.footer),this.footer=null)},_processDragDownHelper:function(status){var options=this.options,helper=options.dragDownHelper;!options.preventDragHelper&&helper&&(this.header.innerHTML=helper.call(this,status))},_processDragUpHelper:function(status){var options=this.options,helper=options.dragUpHelper;!options.preventDragHelper&&helper&&(this.footer.innerHTML=helper.call(this,status))},_processStatus:function(orient,offsetY,currentStatus,moved){var overflow,upperStr,options=this.options,STATUS=this.STATUS,nextStatus=currentStatus;return orient&&(upperStr=orient.charAt(0).toUpperCase()+orient.substr(1),overflow=offsetY>options["drag"+upperStr+"Threshold"],overflow||currentStatus==STATUS["default"]?moved&&overflow&&currentStatus!=STATUS.prepare?(this["_processDrag"+upperStr+"Helper"].call(this,STATUS.prepare),this._fireEvent("drag"+upperStr+"Prepare"),nextStatus=STATUS.prepare):!moved&&overflow&&currentStatus!=STATUS.load&&(this["_processDrag"+upperStr+"Helper"].call(this,STATUS.load),this._fireEvent("drag"+upperStr+"Load"),nextStatus=STATUS.load):(this["_processDrag"+upperStr+"Helper"].call(this,STATUS["default"]),this._fireEvent("drag"+upperStr+"Default"),nextStatus=STATUS["default"])),nextStatus},_onTouchStrat:function(e){this.ct.removeEventListener(TOUCH_EVENTS.move,this,!1),this.ct.removeEventListener(TOUCH_EVENTS.end,this,!1);var body=document.body,startScrollY=this.ct===body?window.pageYOffset||window.scrollY||document.documentElement.scrollTop:this.ct.scrollTop;!this._draggable||this.options.disableDragDown===!0&&this.options.disableDragUp===!0||this._fireEvent("beforeDrag")===!1||(this._draggable=!1,this.ct.addEventListener(TOUCH_EVENTS.move,this,!1),this.ct.addEventListener(TOUCH_EVENTS.end,this,!1),this._touchCoords={},this._touchCoords.startY=msPointerEnabled?e.screenY:e.touches[0].screenY,this._touchCoords.startScrollY=startScrollY)},_onTouchMove:function(e){var offsetY,overY,ct=this.ct,header=this.header,footer=this.footer,options=this.options,innerHeight=window.innerHeight,ctHeight=ct.scrollHeight,coords=this._touchCoords,startScrollY=coords.startScrollY,blockY=coords.blockY,startY=coords.startY,stopY=msPointerEnabled?e.screenY:e.touches[0].screenY;"undefined"==typeof coords.canDragDown&&(coords.canDragDown=options.disableDragDown!==!0&&startY<stopY&&startScrollY<=0),"undefined"==typeof coords.canDragUp&&(coords.canDragUp=options.disableDragUp!==!0&&startY>stopY&&startScrollY+innerHeight>=ctHeight),coords.canDragDown&&coords.dragUp!==!0&&(coords.dragDown||startY-stopY+startScrollY<0)?(e.preventDefault(),coords.dragDown=!0,header||(header=this._createDragDownRegion()),"undefined"==typeof blockY&&(coords.blockY=blockY=stopY),offsetY=stopY-blockY,offsetY=offsetY>0?offsetY:0,overY=offsetY-options.dragDownThreshold,overY>100?offsetY=options.dragDownThreshold+75+.25*(overY-100):overY>50&&(offsetY=options.dragDownThreshold+50+.5*(overY-50)),header.style.height=offsetY+"px",coords.status=this._processStatus("down",offsetY,coords.status,!0)):coords.canDragUp&&coords.dragDown!==!0&&(coords.dragUp||startY-stopY+startScrollY+innerHeight>ctHeight)?(e.preventDefault(),coords.dragUp=!0,footer||(footer=this._createDragUpRegion()),"undefined"==typeof blockY&&(coords.blockY=blockY=stopY),offsetY=blockY-stopY,offsetY=offsetY>0?offsetY:0,overY=offsetY-options.dragUpThreshold,overY>100?offsetY=options.dragUpThreshold+75+.2*(overY-100):overY>50&&(offsetY=options.dragUpThreshold+50+.5*(overY-50)),ct.scrollTop=startScrollY+offsetY,footer.style.height=offsetY+"px",coords.status=this._processStatus("up",offsetY,coords.status,!0)):coords.blockY=stopY},_onTouchEnd:function(e){this.ct.removeEventListener(TOUCH_EVENTS.move,this,!1),this.ct.removeEventListener(TOUCH_EVENTS.end,this,!1),this._translate()},_translate:function(){var orient,target,targetHeight,adjustHeight,duration,upperStr,threshold,me=this,options=me.options,coords=me._touchCoords,maxDuration=200,endFn=function(){coords.status=me._processStatus(orient,targetHeight,coords.status,!1),orient&&coords.status===me.STATUS.load?"down"==orient?me._removeDragUpRegion():"up"==orient&&me._removeDragDownRegion():(me._removeDragDownRegion(),me._removeDragUpRegion(),me._touchCoords=null,me._draggable=!0)};coords&&(orient=coords.dragDown?"down":coords.dragUp?"up":null,orient?(target="down"==orient?me.header:me.footer,targetHeight=target.offsetHeight,upperStr=orient.charAt(0).toUpperCase()+orient.substr(1),threshold=options["drag"+upperStr+"Threshold"],adjustHeight=!options.preventDragHelper&&targetHeight>threshold?threshold:0,duration=Math.ceil((targetHeight-adjustHeight)/threshold*maxDuration),duration=duration>maxDuration?maxDuration:duration,listenTransition(target,duration,endFn),target.style[transition]="height "+duration+"ms",setTimeout(function(){target.style.height=adjustHeight+"px"},0)):endFn())},reset:function(){this._translate()},on:function(type,fn){this._events[type]||(this._events[type]=[]),this._events[type].push(fn)},off:function(type,fn){this._events[type]&&this._events[type].every(function(cb,i){if(cb===fn)return this._events[type].splice(i,1),!1})},_fireEvent:function(type,args){var ret,me=this;return me._events[type]&&me._events[type].forEach(function(fn){ret=fn.apply(me,args||[])}),ret},setDragDownDisabled:function(disabled){this.options.disableDragDown=disabled},setDragUpDisabled:function(disabled){this.options.disableDragUp=disabled},handleEvent:function(e){switch(e.type){case TOUCH_EVENTS.start:this._onTouchStrat(e);break;case TOUCH_EVENTS.move:this._onTouchMove(e);break;case TOUCH_EVENTS.end:this._onTouchEnd(e)}},destroy:function(){this.destroyed||(this.destroyed=!0,this._removeDragDownRegion(),this._removeDragUpRegion(),this.ct.removeEventListener(TOUCH_EVENTS.start,this,!1),this.ct.removeEventListener(TOUCH_EVENTS.move,this,!1),this.ct.removeEventListener(TOUCH_EVENTS.end,this,!1),this.ct=null)}},dummyStyle=null,window.DragLoader=DragLoader}(window)});