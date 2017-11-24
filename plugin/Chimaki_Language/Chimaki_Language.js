//=============================================================================
// Chimaki_Language.js
// Version: 1.0
//=============================================================================
/*:
 * @plugindesc 多語系插件
 * @author Chimaki
 *
 * @param opctionString
 * @desc opction 顯示名稱調整
 * @default Always Dash;Command Remember;BGM Volume;BGS Volume;ME Volume;SE Volume;Language
 *  
 * @param setlan
 * @desc 設定顯示哪些語言  繁體 / 簡體 / 日文 / 英文 0 = 關閉 , 1 = 開啟(分號隔開, 繁體必須是1)
 * @default 1;0;0;1
 * 
 * @param saveLangVaribales
 * @desc 儲存目前語言參數到變數
 * @default 41 
 * 
 * @help 作者網站 Maker 製造機 http://www.chimakier.com
 *  本插件可以免費使用, 禁止二次發佈 , 如果使用後可以在遊戲中附上 來源網址 Maker 製造機 www.chimakier.com的話 ,粽子會非常感謝你的
 *  多語系使用方式
 *  
 *  @@@ 顯示文字 @@@
 *  插件指令 : Say 文本ID 顯示位置 顯示形式
 *  ex : Say 10001 2 1  => 執行文本編號 10001 文字, 顯示在下方, 半透明框
 *  文本ID : 文本中的編號
 *  顯示位置 : 0 : 上方, 1 : 中間, 2 : 下方
 *  顯示形式 : 0 : 一般, 1 : 半透明黑底, 2 : 透明
 *   
 *  @@@ 顯示臉圖 @@@
 *  插件指令 : Face 圖片名稱 圖片位置
 *  ex : Face Actor1 0 => 對話加入頭圖 Actor1的第一張
 *  圖片名稱 : img/face 底下的圖片名稱
 *  圖片位置 : 最左上角為 0 ,開始往右增加1  ex : 內建素材的最右上角要訂 3
 *  
 *  @@@ 選項設定多語系 @@@
 *  在事件中的顯示選項中, 輸入 \Say[文本ID]即可
 *  
 *  備註: 文本中支援特殊語法 ex \v[1] 也可以使用, 若想換行直接在文本換行即可
 *  @@@ 變數相關 @@@
 *  變數為0 時, 為繁體中文
 *  假設只開啟中文跟英文, 那變數1就是英文,  假設開啟四種語言 , 英文會是變數3 (語言變數直 = 總共開啟的語言數量 - 1 )
 *  
*/

//=============================================================================
// @ 分類
//============================================================================= 
'use strict'; // es mode

var Imported = Imported || {};
var chimaki_lan = Imported.chimaki_lan || {};
chimaki_lan.plugin = {}; 
chimaki_lan.plugin.path = {};


chimaki_lan.plugin.path._lastIndexOf = document.currentScript.src.lastIndexOf( '/' );
chimaki_lan.plugin.path._indexOf            = document.currentScript.src.indexOf( '.js' );
chimaki_lan.plugin.path._getJSName          = document.currentScript.src.substring( chimaki_lan.plugin.path._lastIndexOf + 1, chimaki_lan.plugin.path._indexOf );


chimaki_lan.plugin = PluginManager.parameters( chimaki_lan.plugin.path._getJSName );

var setlan = chimaki_lan.plugin["setlan"].split(";") ;
var lang_arr = new Array();
for (var i = 0; i < setlan.length ; i++){
	if (setlan[i] == 0) continue;
	var str;
	if (i == 0) str = '繁體中文';
	if (i == 1) str = '简体中文';
	if (i == 2) str = '日本語';
	if (i == 3) str = 'English';
	lang_arr.push(str);	
}

ConfigManager.language   = ConfigManager.language || 0;
var save_lan_var = Math.floor( chimaki_lan.plugin['saveLangVaribales']);

function log(str){
	console.log(str);
}

(function (){
	
	chimaki_lan.plugin.languageConfig = lang_arr;
	log(chimaki_lan.plugin.languageConfig);
	let opctionStrings  = chimaki_lan.plugin["opctionString"].split(";");

	// $gameVariables.setValue(save_lan_var, ConfigManager.language || 0);


	chimaki_lan.plugin.pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		chimaki_lan.plugin.pluginCommand.call(this, command, args);
        if (command === 'Say') {
    		if (args[1]) $gameMessage.setPosByCommand(args[1]);
    		if (args[2]) $gameMessage.setBackByCommand(args[2]);        		
    		$gameMessage.addTextByData(TextContentManager.getContentDataById(args[0]));
	        switch (this.nextEventCode()) {
	        case 102:  // Show Choices
	            this._index++;
	            this.setupChoices(this.currentCommand().parameters);
	            break;
	        case 103:  // Input Number
	            this._index++;
	            this.setupNumInput(this.currentCommand().parameters);
	            break;
	        case 104:  // Select Item
	            this._index++;
	            this.setupItemChoice(this.currentCommand().parameters);
	            break;
	        }    		
	        this.setWaitMode('message');    		
        }
        if (command === 'Face') {
    		if (args[0] && args[1]){
    			$gameMessage.setFaceByCommand(args[0], args[1]);

    		}
    		else {
    			$gameMessage.setFaceByCommand('', 0);	
    		}
        }		
	}
	Game_Message.prototype.addTextByData = function ( text ){
		$gameMessage.add(text);
		$gameMap._interpreter.setWaitMode('message');
	}	
	Game_Message.prototype.setFaceByCommand = function ( img , index){
		this.setFaceImage(img , Number(index));
	}	
	Game_Message.prototype.setBackByCommand = function ( args){
		this.setBackground(Number(args));
	}
	Game_Message.prototype.setPosByCommand = function ( args){		
		this.setPositionType(Number(args));
	}	

	chimaki_lan.plugin.config_makedata = ConfigManager.makeData;
	ConfigManager.makeData = function() {
		let config = chimaki_lan.plugin.config_makedata.call(this);
	    config.language = this.language ;
	    return config;
	};
	ConfigManager.readVolume = function(config, name) {
	    var value = config[name];
	    if (name != 'language'){
		    if (value !== undefined) {
		        return Number(value).clamp(0, 100);
		    } else {
		        return 100;
		    }
		}
		else {
		    if (value !== undefined) {
		        return Number(value).clamp(0, 3);
		    } else {
		        return 0;
		    }		
		}
	};
	chimaki_lan.plugin.config_applydata = ConfigManager.applyData;
	ConfigManager.applyData = function(config) {
		chimaki_lan.plugin.config_applydata.call(this, config);
		this.language = this.readVolume(config, 'language');
	}
	Window_Options.prototype.addGeneralOptions = function() {
		this.addCommand(opctionStrings[5] , 'language');		
	    this.addCommand(opctionStrings[0], 'alwaysDash');
	};
	Window_Options.prototype.addVolumeOptions = function() {
	    this.addCommand( opctionStrings[1], 'bgmVolume');
	    this.addCommand( opctionStrings[2], 'bgsVolume');
	    this.addCommand( opctionStrings[3], 'meVolume');
	    this.addCommand( opctionStrings[4], 'seVolume');
	};	

	Window_Options.prototype.statusText = function(index) {
	    var symbol = this.commandSymbol(index);
	    var value = this.getConfigValue(symbol);
	    if (this.isVolumeSymbol(symbol)) {
	        return this.volumeStatusText(value);
	    } else if (this.isLanguageSymbol(symbol)){
	    	return this.langSymbol(value);
	    } else {
	        return this.booleanStatusText(value);
	    }
	};

	Window_Options.prototype.isLanguageSymbol = function(symbol) {
	    return symbol.contains('language');
	};
	Window_Options.prototype.langSymbol = function (value){
		TextContentManager.setContentData(chimaki_lan.plugin.languageConfig[value]);
		return chimaki_lan.plugin.languageConfig[value];
	}
	Window_Options.prototype.processOk = function() {
	    var index = this.index();
	    var symbol = this.commandSymbol(index);
	    var value = this.getConfigValue(symbol);
	    if (this.isVolumeSymbol(symbol)) {
	        value += this.volumeOffset();
	        if (value > 100) {
	            value = 0;
	        }
	        value = value.clamp(0, 100);
	        this.changeValue(symbol, value);
	    }else if (this.isLanguageSymbol(symbol)){
	    	value += this.langOffset();
	    	let config = chimaki_lan.plugin.languageConfig;
	    	if (value > config.length - 1){
	    		value = 0;
	    	}
	    	this.setLanVarValue(value);

	    	this.changeValue(symbol, value);

	    } else {
	        this.changeValue(symbol, !value);
	    }
	};
	Window_Options.prototype.setLanVarValue = function (value){
		$gameVariables.setValue(save_lan_var, value);	
	}
	
	Window_Options.prototype.langOffset = function (){
		return 1;
	}
	Window_Options.prototype.cursorLeft = function(wrap) {
	    var index = this.index();
	    var symbol = this.commandSymbol(index);
	    var value = this.getConfigValue(symbol);
	    if (this.isVolumeSymbol(symbol)) {
	        value -= this.volumeOffset();
	        value = value.clamp(0, 100);
	        this.changeValue(symbol, value);
	    } else if (this.isLanguageSymbol(symbol)){
	    	value--;
	    	let config = chimaki_lan.plugin.languageConfig;
	    	if (value < 0){
	    		value = config.length - 1;
	    	}
	    	this.setLanVarValue(value);
	    	this.changeValue(symbol, value);
	    } else {
	        this.changeValue(symbol, false);
	    }
	};	
	Window_Options.prototype.cursorRight = function(wrap) {
	    var index = this.index();
	    var symbol = this.commandSymbol(index);
	    var value = this.getConfigValue(symbol);
	    if (this.isVolumeSymbol(symbol)) {
	        value += this.volumeOffset();
	        value = value.clamp(0, 100);
	        this.changeValue(symbol, value);
	    } else if (this.isLanguageSymbol(symbol)){
	    	value++;
	    	let config = chimaki_lan.plugin.languageConfig;
	    	if (value > config.length - 1){
	    		value = 0;
	    	}
	    	this.setLanVarValue(value);
	    	this.changeValue(symbol, value);	    		        
	    } else {
	        this.changeValue(symbol, true);
	    }
	};

	// 選項調整
	Game_Interpreter.prototype.checkTextByData = function (text){
		text = text.replace(/\\/g, '\x1b');
	    text = text.replace(/\x1bSay\[(\d+)\]/gi, function() {
	        return TextContentManager.getContentDataById(parseInt(arguments[1]));
	    }.bind(this));
	    
	    return text;
	}
	Game_Interpreter.prototype.setupChoices = function(params) {	   
	    var choices = params[0].clone();
	    for (let i = 0; i < choices.length; i++){
	    	choices[i] = this.checkTextByData(choices[i]);
	    } 
	    var cancelType = params[1];
	    var defaultType = params.length > 2 ? params[2] : 0;
	    var positionType = params.length > 3 ? params[3] : 2;
	    var background = params.length > 4 ? params[4] : 0;
	    if (cancelType >= choices.length) {
	        cancelType = -2;
	    }
	    $gameMessage.setChoices(choices, defaultType, cancelType);
	    $gameMessage.setChoiceBackground(background);
	    $gameMessage.setChoicePositionType(positionType);
	    $gameMessage.setChoiceCallback(function(n) {
	        this._branch[this._indent] = n;
	    }.bind(this));
	};	


})();

function TextContentManager () {
	throw new Error('This is a static class');
}
TextContentManager._allData = {'zh' : {} , 'ja' : {}, 'en' : {} ,'cn' :{}};
TextContentManager._nowlanguage = 'zh'; 
TextContentManager.setContentData = function ( text ){
	switch (text){
		case "繁體中文":
			this._nowlanguage = 'zh';
			break;
		case "日本語":
			this._nowlanguage = 'ja';
			break;
		case "简体中文":
			this._nowlanguage = 'cn';
			break;
		case "English":
			this._nowlanguage = 'en';
			break;
	}
}
TextContentManager.getContentDataByRang = function ( st, ed ){
	var text = '';
	var data = this._allData[this._nowlanguage];
	for (var i in data){
		if (i >= st && i <= ed){			
			text += data[i] + '\n';
		}
	}	
	return text;
}
TextContentManager.getContentDataById = function ( id ){
	return this._allData[this._nowlanguage][id];
}


TextContentManager.setlanguage = function (language){
	this._nowlanguage = language + '';
}
TextContentManager.setAllData = function (data){
	for (var i = 0;i < data.length ; i ++){
		this._allData['zh'][data[i]['編號']] = data[i]['zh'] ;
		this._allData['ja'][data[i]['編號']] = data[i]['ja'] ;
		this._allData['en'][data[i]['編號']] = data[i]['en'] ;
	 	this._allData['cn'][data[i]['編號']] = data[i]['cn'] ;
	}
}

function initDataBase (){
	let dataPath  = 'data/TextContent.csv';
	d3.csv(dataPath , function(data){
		TextContentManager.setAllData(data);

	});			
}	

initDataBase();
