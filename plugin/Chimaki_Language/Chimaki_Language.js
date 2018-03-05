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
 * 
 * @param language
 * @desc 使用哪幾種語言, 使用分號隔開, 至少要有一種, 不然會爆炸, 這邊的名稱請與表格欄位的名稱相同
 * @default 繁體中文;English
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
var opctionStrings  = chimaki_lan.plugin["opctionString"].split(";");
var languageType  = chimaki_lan.plugin["language"].split(";");


ConfigManager.language   = ConfigManager.language || 0;

(function (){
	
	


	chimaki_lan.plugin.languageConfig = languageType;

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
		this.addCommand(opctionStrings[6] , 'language');		
	    this.addCommand(opctionStrings[0], 'alwaysDash');
	    this.addCommand(opctionStrings[1], 'commandRemember');
	};
	Window_Options.prototype.addVolumeOptions = function() {
	    this.addCommand( opctionStrings[2], 'bgmVolume');
	    this.addCommand( opctionStrings[3], 'bgsVolume');
	    this.addCommand( opctionStrings[4], 'meVolume');
	    this.addCommand( opctionStrings[5], 'seVolume');
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
	    	this.changeValue(symbol, value);

	    } else {
	        this.changeValue(symbol, !value);
	    }
	};
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
	    	
	    	if (value < 0 ){
	    		value = languageType.length - 1;

	    	}
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
	    	if (value > languageType.length - 1){
	    		value = 0;

	    	}

	    	value = value.clamp(0, languageType.length);
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

TextContentManager._allData = [];
for (let i = 0; i < languageType.length; i++){
	TextContentManager._allData[languageType[i]] = {};

}


TextContentManager._nowlanguage = 'zh'; 
TextContentManager._nowlanguageIndex = 0; 
TextContentManager.setContentData = function ( text ){
	for (let i = 0 ; i < languageType.length; i++){
		if (text == languageType[i]) {
			this._nowlanguageIndex = i;
		}
	}


}
TextContentManager.getContentDataByRang = function ( st, ed ){
	var text = '';
	var data = this._allData[this._nowlanguageIndex];
	for (var i in data){
		if (i >= st && i <= ed){			
			text += data[i] + '\n';
		}
	}	
	return text;
}
TextContentManager.getContentDataById = function ( id ){
	console.log('now index ' + this._nowlanguageIndex);
	console.log(this._allData);
	return this._allData[languageType[this._nowlanguageIndex]][id];
}
TextContentManager.setlanguage = function (language){
	this._nowlanguage = language + '';
}
TextContentManager.setAllData = function (data){
	for (var i in data){
		for (let j in languageType){
			let str = languageType[j];
			this._allData[str][ ''+data[i]['編號']+ ''] = data[i][str] ;			
		}
	}
}

function initDataBase (){
	let dataPath  = 'data/TextContent.csv';
	d3.csv(dataPath , function(data){
		TextContentManager.setAllData(data);

	});			
}	

initDataBase();
