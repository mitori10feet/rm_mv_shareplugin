//=============================================================================
// Chimaki_EventPlus.js
// Version: 1.0
//=============================================================================
/*:
* @plugindesc 影子事件設定
* @author Chimaki 
* 
* ============================================================================
* @help
* 此插件由 Maker 製造機粽子 撰寫，禁止二次發佈
* 使用此插件在遊戲中時，希望可以附上來源網址
* 來源網址 : http://www.chimakier.com
* 
* 說明 : 依照以下方法在事件追加註解後，可以擴增事件的觸發範圍，滑鼠點擊到範圍內也將直接觸發事件
* 
* 在事件中註解欄位加上以下內容
* 
* 事件上方追加1格判定範圍:
* <EPUp:1>   
* 事件下方追加1格判定範圍:
* <EPDown:1>
* 事件左方追加1格判定範圍 
* <EPLeft:1> 
* 事件右追加1格判定範圍:
* <EPRight:1>   
* 事件重疊時，判定優先度為 2 (數字越大越優先) :
* <EPriority:2>    
* 
* 如果不需要追加判定範圍，可以不用設置
*/
//=============================================================================
'use strict'; // es mode

var Imported = Imported || {};
var chimaki_plugin = chimaki_plugin || {};
// menu相關
chimaki_plugin.event = {}; 
chimaki_plugin.event.alias = chimaki_plugin.event.alias || {};


chimaki_plugin.event._lastIndexOf = document.currentScript.src.lastIndexOf( '/' );
chimaki_plugin.event._indexOf            = document.currentScript.src.indexOf( '.js' );
chimaki_plugin.event._getJSName          = document.currentScript.src.substring( chimaki_plugin.event._lastIndexOf + 1, chimaki_plugin.event._indexOf );

(function(){
	chimaki_plugin.event._arsg = PluginManager.parameters( chimaki_plugin.event._getJSName);
//=============================================================================
// 事件判斷
//=============================================================================	    

	let regexEventPluseUp = /<EPUp:[ ]*(.*)>/i;
	let regexEventPluseDown = /<EPDown:[ ]*(.*)>/i;
	let regexEventPluseRight = /<EPRight:[ ]*(.*)>/i; 
	let regexEventPluseLeft = /<EPLeft:[ ]*(.*)>/i
	let regexEventPriority = /<EPriority:[ ]*(.*)>/i;

	chimaki_plugin.event.alias.evet_init  = Game_Event.prototype.initialize;
	Game_Event.prototype.initialize = function (mapId, eventId){
		chimaki_plugin.event.alias.evet_init.call(this, mapId, eventId);
		this.setEventPlus();
	}
	Game_Event.prototype.resetEventPlus = function (){
		this._eventPlusUp = 0;
		this._eventPlusDown = 0;
		this._eventPlusRight = 0;
		this._eventPlusLeft = 0;
		this._eventPriority = 0;
	}
	chimaki_plugin.event.alias.game_event_update = Game_Event.prototype.update;
	Game_Event.prototype.update = function (){
		chimaki_plugin.event.alias.game_event_update.call(this);
		if (this._overheadPageIndex != this._pageIndex){
			this._overheadPageIndex = this._pageIndex;
			this.setEventPlus();
		}
	}
	Game_Event.prototype.setEventPlus = function (){
		this._overheadPageIndex = this._pageIndex;
		if (!this.page()) return;

		this.resetEventPlus()

		if (this.list()){
			for (let action of this.list()){
				if (action.code == "108" || action.code == "408"){
					let a = action.parameters[0];
					let matchUp = regexEventPluseUp.exec(a);
					if (matchUp) {
						this._eventPlusUp = matchUp[1];
						continue;
					}
					let matchDown = regexEventPluseDown.exec(a);
					if (matchDown) {
						this._eventPlusDown = matchDown[1];
						continue;
					}
					let matchRight = regexEventPluseRight.exec(a);
					if (matchRight) {
						this._eventPlusRight = matchRight[1];
						continue;
					}
					let matchLeft = regexEventPluseLeft.exec(a);
					if (matchLeft) {
						this._eventPlusLeft = matchLeft[1];
						continue;
					}
					let matchPriority = regexEventPriority.exec(a);
					if (matchPriority){
						this._eventPriority = matchPriority[1];
						continue;
					}												
				}
			}
		}
		this._eventPluseNeedUpdate = true;
	}
	Game_Event.prototype.getEventRange = function (){
		let range = [];

		let x1 = (this._x - this.getPlusLeft()) * 48;
		let x2 = ((this._x + this.getPlusRight()) * 48) ;
		let y1 = (this._y - this.getPlusUp()) * 48;
		let y2 = (this._y + this.getPlusDown()) * 48;
	}
	Game_Event.prototype.isNeedPlus = function() {
		return (this._eventPlusUp || this._eventPlusDown ||
			this._eventPlusRight || this._eventPlusLeft);
	};		
	Game_Event.prototype.getPlusUp = function() {
		return Number(this._eventPlusUp) || 0;
	};	
	Game_Event.prototype.getPlusDown = function() {
		return Number(this._eventPlusDown) || 0;
	};	
	Game_Event.prototype.getPlusRight = function() {
		return Number(this._eventPlusRight) || 0;
	};	
	Game_Event.prototype.getPlusLeft = function() {
		return Number(this._eventPlusLeft) || 0;
	};				
	Game_Event.prototype.getPriority = function() {
		return Number(this._eventPriority) || 0;
	};					
	Game_Event.prototype.speventsXy = function(x, y, needPlus) {
		let x1 = this._x - this.getPlusLeft();
		let x2 = this._x + this.getPlusRight();
		let y1 = this._y - this.getPlusUp();
		let y2 = this._y + this.getPlusDown();
		
		if (needPlus){ // 事件判定觸發才走這段
			return (x >= x1 && x <= x2 && y >= y1 && y <= y2);
		}
		else {
			return this._x === x && this._y === y;
		}

	};
	Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
	    if (!$gameMap.isEventRunning()) {
	    	/* 影子事件判斷 用sp*/
	    	let id = $gameMap.speventsXy(x, y);
	    	if (id){
	    		let event = $gameMap.event(id);
	    		if (event && event.isTriggerIn(triggers) && event.isNormalPriority() === normal){
	    			event.start();
	    		}
	    	}
	    }
	};
	chimaki_plugin.event.alias.gameMap_setup =  Game_Map.prototype.setup;
	Game_Map.prototype.setup = function (mapId) {
		chimaki_plugin.event.alias.gameMap_setup.call(this, mapId);
		this._allPrievent = [];
	}
	Game_Map.prototype.eventsXy = function(x, y) {
	    return this.events().filter(function(event) {
	        return event.pos(x, y, true);
	    });
	};	



	// 點擊事件判定用
	Game_Map.prototype.speventsXy = function(x, y) {
    	this._allPrievent = this.events().filter(function(event) {
    		/* 影子事件判斷 用sp*/
			if (event.speventsXy(x, y, true)){
				return event;	
			}
    	});	

    	if (this._allPrievent.length > 0){
	    	this._allPrievent.sort(function (a, b){
	    		return b._eventPriority-a._eventPriority;
	    	});    		
	    	if (this._allPrievent[0]){
	    		return this._allPrievent[0]._eventId;
	    	}	    	
    	}
    	else {
    		let events = this.events().filter(function(event) {
		    	if (event.pos(x, y)){
		    		return event._eventId;	
		    	}		        
		    }); 
		    if (events[0]){
		    	return events[0]._eventId;	
		    }		    
    	}
	};			

//=============================================================================
// 點擊判斷相關
//=============================================================================	    
	Game_Event.prototype.isTriggerIn = function(triggers) {
	    return triggers.contains(this._trigger);
	};
	// pixi  touch
	Game_Event.prototype.checkTouchInput = function(x, y) {
		let x1 = this._realX * 48 - this.getPlusLeft() * 48;
		let x2 = this._realX * 48 + this.getPlusRight() * 48 + 48;
		let y1 = this._realY * 48 - this.getPlusUp() * 48;
		let y2 = this._realY * 48 + this.getPlusDown() * 48 + 48;


		return  (x > x1  && x < x2 && y > y1 && y < y2);
	};	
	Game_Map.prototype.checkTouchInputEvent = function (x, y){
		let touchEventList = this.events().filter(function (event){
			if (event.checkTouchInput(x, y)){
				return event;
			}
		});
		let list;
    	if (touchEventList.length > 0){
	    	list = touchEventList.sort(function (a, b){
	    		return b._eventPriority-a._eventPriority;
	    	});
    	}		
		if (list && list[0]){
			return list[0]._eventId;	
		}
		return 0;		
	}
	//畫面點擊
	Scene_Map.prototype.processMapTouch = function() {
	    if (TouchInput.isTriggered() || this._touchCount > 0) {
	        if (TouchInput.isPressed()) {
	            if (this._touchCount === 0 || this._touchCount >= 15) {
	                var x = $gameMap.canvasToMapX(TouchInput.x);
	                var y = $gameMap.canvasToMapY(TouchInput.y);
	                let id = $gameMap.checkTouchInputEvent(TouchInput.x, TouchInput.y);	                
	                if (id && id > 0 && !$gameMap.isEventRunning()){
	                	let event = $gameMap.event(id);
	                	event.start();
	                }
	                else {
	                	$gameTemp.setDestination(x, y);
	                }	                
	            }
	            this._touchCount++;
	        } else {
	            this._touchCount = 0;
	        }
	    }
	};	

}());
