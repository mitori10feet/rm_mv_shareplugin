//=============================================================================
// Chimaki_WaitMessage.js
// Version: 1.0
//=============================================================================
/*:
* @plugindesc map資訊
* @author Chimaki 
* 
* 
* @param boss_window
* @desc boss資訊框x;y;w;h;字體對齊位置;要不要底框(1 或 0)  用分號隔開
* @default 0;0;300;200;left;0
*
* @param fontSize
* @desc 字體大小
* @default 32
*
* @param fadeSpeed
* @desc 淡出淡入時間;等待時間   用分號隔開
* @default 10;30
*
* @param timer_window
* @desc timer資訊框x;y;w;h;字體對齊位置;要不要底框(1 或 0)   用分號隔開
* @default 0;200;300;100;left;1
*
* @param timerFontSize
* @desc 字體大小
* @default 32
*
* @param timerFadeSpeed
* @desc 淡出淡入時間;等待時間   用分號隔開
* @default 10;30
*
* ============================================================================
* @help
* 此插件由 Maker 製造機粽子 撰寫，禁止二次發佈
* 使用此插件在遊戲中時，希望可以附上來源網址
* 來源網址 : http://www.chimakier.com
* 
* 視窗寬度建議開大一點，字太多時才不會被切
* 字體對齊 : left / center / right
* 
* 插件命令: Boss 你要顯示的文字
* EX: Boss Yooooo => 就會顯示Yooooo
*     Boss 老闆出現在2樓 => 就會顯示老闆出現在2樓
* # 支援 \c[N] 改變顏色，只支援 1~9
*/
//=============================================================================
'use strict'; // es mode

var Imported = Imported || {};
var chimaki_plugin = chimaki_plugin || {};
chimaki_plugin.alias = {};

var parameters = PluginManager.parameters('Chimaki_WaitMessage');

var boss_window = parameters['boss_window'].split(";");
var fontSize = Math.floor(parameters['fontSize'] || 32);
var fadeArgs = parameters['fadeSpeed'].split(";");


var timer_window = parameters['timer_window'].split(";");
var timerFontSize = Math.floor(parameters['timerFontSize'] || 32);
var timerFadeArgs = parameters['timerFadeSpeed'].split(";");

function Game_BossInfo() {
    this.initialize.apply(this, arguments);
}

Game_BossInfo.prototype.initialize = function() {
	this.initMamber();	
};

Game_BossInfo.prototype.initMamber = function (){
	this._text = [];
	this._timerText = [];
}

Game_BossInfo.prototype.addMsg = function ( msg){
	this._text.push(msg);
}
Game_BossInfo.prototype.hasBossInfo = function (){
	return this._text.length > 0;
}

Game_BossInfo.prototype.getBossInfo = function (){
	return this._text.shift();
}

Game_BossInfo.prototype.addTimerMsg = function ( msg){
	this._timerText.push(msg);
}
Game_BossInfo.prototype.hasTimerText = function (){
	return this._timerText.length > 0;
}

Game_BossInfo.prototype.getTimerText = function (){
	return this._timerText.shift();
}

var $game_boss_info = new Game_BossInfo();

(function(){


    chimaki_plugin.alias._plugin_command = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        chimaki_plugin.alias._plugin_command.call(this, command, args);
        switch (command){
        	case "Boss":
        		if (args[0]){
        			$game_boss_info.addMsg(args[0]);
        		}
        		break;
        	case "Timer":
        		if (args[0]){
        			$game_boss_info.addTimerMsg(args[0]);
        		}
        		break;        		
        }
    }





	chimaki_plugin.alias._map_create_window = Scene_Map.prototype.createAllWindows;
	Scene_Map.prototype.createAllWindows = function() {
		chimaki_plugin.alias._map_create_window.call(this);
		this.createBossInfoWindow();
		this.createTimerInfoWindow();

	};
	Scene_Map.prototype.createTimerInfoWindow = function (){
		this._timerInfo = new Window_TimerInfo(timer_window[0] ,timer_window[1], timer_window[2], timer_window[3])
		this.addChild(this._timerInfo);		
	}
	Scene_Map.prototype.createBossInfoWindow = function (){
		this._bossInfo = new Window_BossInfo(boss_window[0] ,boss_window[1], boss_window[2], boss_window[3])
		this.addChild(this._bossInfo);
	}
	class Window_BossInfo extends Window_Base {
		constructor (x, y, width, height){
			super(x, y, width, height);
		}
		initialize (x, y, width, height){
			Window_Base.prototype.initialize.call(this, x, y, width, height);
			this._info_align = boss_window[4];
			this._fade_args = Number(fadeArgs[0]);
			this._need_back = Number(boss_window[5]);
			this.openness = 0;	
			
			this._msg_fade = true;
			
			this._msg_filed = new Sprite();
			this._msg_sp = new Sprite(new Bitmap(this.width, this.height))
			this._msg_sp.visible = false
			this._msg_sp.opacity = 0;
			this._msg_filed.addChild(this._msg_sp);
			this.addChild(this._msg_filed);
			this.addChild(this._msg_sp);

		}
		isMsgWait (){
			return this._msg_fade_wait > 0;
		}
		msgWait (num){
			this._msg_fade_wait = num;
		}

		update (){
			Window_Base.prototype.update.call(this);
			if ($game_boss_info.hasBossInfo() && !this._msg_sp.visible){
				this.msgWait(fadeArgs[1]);
				this._msg_sp.visible = true;
				this.createBossInfo($game_boss_info.getBossInfo());
			}
			if (this._msg_sp.visible){
				this.updateBossMsg();	
			}
			
		}
		updateMsgWait (){
			if (this._msg_fade_wait > 0){
				this._msg_fade_wait--;
			}
		}
		updateBossMsg (){
			if (this._msg_fade){
				if (this._msg_sp.opacity < 255){
					this._msg_sp.opacity += this._fade_args;
					if (this._need_back == 1) this.openness += this._fade_args * 4;
				}
				else {
					this._msg_fade = false;
				}
			}
			else if (!this._msg_fade) {
				if (this.isMsgWait()){
					this.updateMsgWait();
					return;
				}

				if (this._msg_sp.opacity > 0){
					this._msg_sp.opacity -= this._fade_args;
					if (this._need_back == 1) this.openness -= this._fade_args * 2;
				}
				else {
					this._msg_fade = true;
					this._msg_sp.visible = false;
				}
			} 
			
		}

		obtainEscapeCode (textState) {
		    textState.index++;
		    var regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;
		    var arr = regExp.exec(textState.text.slice(textState.index));
		    if (arr) {
		        textState.index += arr[0].length;
		        return arr[0].toUpperCase();
		    } else {
		        return '';
		    }
		};
		processEscapeCharacter (code, textState) {

		    switch (code) {
		    case 'c':
		        this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
		        break;
		    case 'I':
		        this.processDrawIcon(this.obtainEscapeParam(textState), textState);
		        break;
		    case '{':
		        this.makeFontBigger();
		        break;
		    case '}':
		        this.makeFontSmaller();
		        break;
		    }
		};
		obtainEscapeParam (textState) {
		    var arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
		    if (arr) {
		        textState.index += arr[0].length;
		        return parseInt(arr[0].slice(1));
		    } else {
		        return '';
		    }
		};

		processCharacter (textState) {
		    switch (textState.text[textState.index]) {
		    case '\n':
		        this.processNewLine(textState);
		        break;
		    case '\f':
		        this.processNewPage(textState);
		        break;
		    case '\x1b':
		        this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
		        break;
		    default:
		        this.processNormalCharacter(textState);
		        break;
		    }
		};
		isEndOfText (textState) {
		    return textState.index >= textState.text.length;
		};
		createBossInfo (msg) {
			this._msg_sp.bitmap.clear()
			let newmsg = { index : 0 , text : [] , x : 0 , y : 0};
			
			msg = this.convertEscapeCharacters(msg);
			newmsg.text = msg;
			let count = 0;
			while (!this.isEndOfText(newmsg)){
				let flag = false;
				var arr = /\x1bC\[\d+\]/gi.exec( newmsg.text.slice(newmsg.index, newmsg.index + 5));
				if (arr){
					let t1 = arr[0];
					newmsg.index += t1.length;

					let color = t1.replace(/\x1bC|[^\d+]/gi, '');
					this._msg_sp.bitmap.textColor = this.textColor(color);					
					flag = true;

				}

				if (newmsg.text[newmsg.index].match(/\d/)){
					newmsg.x += this.standardFontSize() / 2;
				}

				else if (newmsg.text[newmsg.index].match(/[a-z]/ig)){
					newmsg.x += this.charWidth() / 2 ;	
				}
				else {
					if (newmsg.index > 0 && newmsg.text[newmsg.index - 1 ].match(/[a-z]/ig)){
						newmsg.x += this.charWidth() / 2 ;			
					}
					else if (newmsg.index > 0 && newmsg.text[newmsg.index - 1 ].match(/\x1b/ig)){
						newmsg.x += this.charWidth() / 2;	
					}
					else {
						newmsg.x += this.charWidth();	
					}
					
				}
				let officeX = 0;
				if (newmsg.text[newmsg.index].match(/\d/)){
					officeX = this.charWidth() / 2;
				}				
				this._msg_sp.bitmap.drawText(newmsg.text[newmsg.index] + "",  newmsg.x + officeX, 0 , this.width, 100, this._info_align);				
				newmsg.index++;				
				count++;
			}
			
		}
		standardFontSize (){
			return fontSize;
		}
		charWidth (){
		    var text = $gameSystem.isJapanese() ? '\uff21' : '殺';
		    return this.textWidth(text);					
		}

	}


	class Window_TimerInfo extends Window_BossInfo {
		constructor (x, y, width, height){
			super(x, y, width, height);
		}
		initialize (x, y, width, height){
			Window_BossInfo.prototype.initialize.call(this, x, y, width, height);
			this._info_align = timer_window[4];
			this._need_back = Number(timer_window[5]);
		}
		update (){
			Window_Base.prototype.update.call(this);
			if ($game_boss_info.hasTimerText() && !this._msg_sp.visible){
				this.msgWait(timerFadeArgs[1]);
				this._msg_sp.visible = true;
				this.createBossInfo($game_boss_info.getTimerText());
			}
			if (this._msg_sp.visible){
				this.updateBossMsg();	
			}
			
		}	
		standardFontSize (){
			return timerFontSize;
		}					
	}


}());


function log (str){
	console.log(str);
}