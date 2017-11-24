//=============================================================================
// Chimaki_AvgMenuBase.js
// Version: 2.0
//=============================================================================
/*:
* @plugindesc AVG基本模式介面
* @author Chimaki 
*
*
* @param ScreenWidth
* @desc 解析度調整寬
* @default 1024
*
* @param ScreenHeight
* @desc 解析度調整高
* @default 624
* 
* @param ---------------
* @desc 
* @default 
* 
* @param MenuSwitch
* @desc This is the switch of all system.
* @default 1
*
* @param SaveButtonSwitch
* @desc save 按鈕開關
* @default 2
*
* @param SaveButtonImg
* @desc 圖片名稱;圖片寬度;圖片高度
* @default save;100;100
* 
* @param SaveButtonPos
* @desc 按鈕座標X;按鈕座標Y
* @default 0;0
*
* @param ---------------
* @desc 
* @default 
*
* @param LoadButtonSwitch
* @desc load 按鈕開關
* @default 3
* 
* @param LoadButtonImg
* @desc 圖片名稱;圖片寬度;圖片高度
* @default load;100;100
* 
* @param LoadButtonPos
* @desc 按鈕座標X;按鈕座標Y
* @default 100;0
*
* @param ---------------
* @desc 
* @default 
*
* @param SystemButtonSwitch
* @desc system 按鈕開關
* @default 4
* 
* @param SystemButtonImg
* @desc 圖片名稱;圖片寬度;圖片高度
* @default system;100;100
* 
* @param SystemButtonPos
* @desc 按鈕座標X;按鈕座標Y
* @default 200;0
* 
* @param ---------------
* @desc 
* @default 
*
* @param ItemButtonSwitch
* @desc system 按鈕開關
* @default 6
* 
* @param ItemButtonImg
* @desc 圖片名稱;圖片寬度;圖片高度
* @default system;100;100
* 
* @param ItemButtonPos
* @desc 按鈕座標X;按鈕座標Y
* @default 300;0
* 
* @param ---------------
* @desc 
* @default 
*
* @param BackButtonSwitch
* @desc system 按鈕開關
* @default 7
* 
* @param BackButtonImg
* @desc 圖片名稱;圖片寬度;圖片高度
* @default system;100;100
* 
* @param BackButtonPos
* @desc 按鈕座標X;按鈕座標Y
* @default 400;0
* 
* @param BackVarId
* @desc 記錄對話內容用的變數
* @default 10
* 
* @param BackSceneImg
* @desc 對話記錄的底圖檔案名稱,放在img/picture 底下
* @default Mountains3
* 
* @param BackFontSize
* @desc 對話記錄的字體大小
* @default 28
* 
* @param BackWindowSize
* @desc 對話記錄長寬與座標 格式  x;y;width;height
* @default 0;0;1024;624
* 
* @param BackSpace
* @desc backlog每次移動的間距
* @default 30
* 

* @param ---------------
* @desc 
* @default 
* 
* @param ForSystemVar
* @desc 系統用變數,這個變數id請留給此插件使用
* @default 8
* 
* @param ForSystemVar2
* @desc 系統用變數,這個變數id請留給此插件使用
* @default 9
* 
* @param ---------------
* @desc 
* @default 
* 
* @param ChoiceWinonwSwitch
* @desc 使用開關決定是否啟用強制置中選項
* @default 5
* ============================================================================
* @help
* 2 / 10 / 17
* 新增對話紀錄功能
* 本插件由Maker製造機 粽子製作，歡迎自由修改使用，可以的話希望可以在遊戲中寫明作者插件來源
* Maker 製造機 : http://www.chimakier.com
* 
* 本插件提供基本avg模式基本功能,可在對話中透過滑鼠呼叫介面不推進劇本
* 讀取檔案時也可以記錄當下狀態,AVG畫面中要呈現哪些功能按鈕則由開關設定
* 參數中的寬度高度,會影響按鈕的點擊範圍
* 當ChoiceWinonwSwitch 開關為ON 則會將選項置中
* 
*/
//=============================================================================
//
var Imported = Imported || {};
Imported.Chimaki_AvgBase = [];



(function(){
   
	var Chimaki_parameters = PluginManager.parameters('Chimaki_AvgMenuBase');
	var Chimaki_AvgBase = Imported.Chimaki_AvgBase;

	Chimaki_AvgBase.img = [];
	Chimaki_AvgBase.pos = [];
	Chimaki_AvgBase.contents = [];
	Chimaki_AvgBase.isCallMenu = false;
	Chimaki_AvgBase.backSwitch = false;

	Chimaki_AvgBase.varID =	Number(Chimaki_parameters['MenuSwitch']|| 1);

	Chimaki_AvgBase._screenWidth = Math.floor(Chimaki_parameters['ScreenWidth']|| 1024);
	Chimaki_AvgBase._screenHeight = Math.floor(Chimaki_parameters['ScreenHeight']|| 624);

	Chimaki_AvgBase.SaveButtonSwitch = Math.floor(Chimaki_parameters['SaveButtonSwitch']|| 2);
	Chimaki_AvgBase.LoadButtonSwitch = Math.floor(Chimaki_parameters['LoadButtonSwitch']|| 3);
	Chimaki_AvgBase.SystemButtonSwitch = Math.floor(Chimaki_parameters['SystemButtonSwitch']|| 4);
	Chimaki_AvgBase.ItemButtonSwitch = Math.floor(Chimaki_parameters['ItemButtonSwitch']|| 6);
	Chimaki_AvgBase.BackButtonSwitch = Math.floor(Chimaki_parameters['BackButtonSwitch']|| 7);
	Chimaki_AvgBase.BackSceneImg = (Chimaki_parameters['BackSceneImg']);
	Chimaki_AvgBase.BackFontSize = (Chimaki_parameters['BackFontSize'] || 28);
	Chimaki_AvgBase.BackWindowSize = Chimaki_parameters['BackWindowSize'].split(";");



	Chimaki_AvgBase.choices =  Math.floor(Chimaki_parameters['ChoiceWinonwSwitch']|| 5);
	
	Chimaki_AvgBase.img[0] = Chimaki_parameters["SaveButtonImg"].split(";");
	Chimaki_AvgBase.img[1] = Chimaki_parameters["LoadButtonImg"].split(";");
	Chimaki_AvgBase.img[2] = Chimaki_parameters["SystemButtonImg"].split(";");
	Chimaki_AvgBase.img[3] = Chimaki_parameters["ItemButtonImg"].split(";");
	Chimaki_AvgBase.img[4] = Chimaki_parameters["BackButtonImg"].split(";");



	Chimaki_AvgBase.pos[0] = Chimaki_parameters["SaveButtonPos"].split(";");
	Chimaki_AvgBase.pos[1] = Chimaki_parameters["LoadButtonPos"].split(";");
	Chimaki_AvgBase.pos[2] = Chimaki_parameters["SystemButtonPos"].split(";");
	Chimaki_AvgBase.pos[3] = Chimaki_parameters["ItemButtonPos"].split(";");
	Chimaki_AvgBase.pos[4] = Chimaki_parameters["BackButtonPos"].split(";");
	

	Chimaki_AvgBase.systemVar = Math.floor(Chimaki_parameters['ForSystemVar']|| 8);
	Chimaki_AvgBase.systemInter = Math.floor(Chimaki_parameters['ForSystemVar2']|| 9);
	Chimaki_AvgBase.BackVarId = Math.floor(Chimaki_parameters['BackVarId']|| 10);
	Chimaki_AvgBase.BackSpace = Math.floor(Chimaki_parameters['BackSpace']|| 30);
//=============================================================================
// Avg Menu file
//=============================================================================			
	ImageManager.loadAvgMenu = function(filename, hue) {
		var path = 'img/AvgMenu/';
 	   	return this.loadBitmap(path, filename, hue, true);
	};	

//=============================================================================
// 整合解析度
//=============================================================================	    


	SceneManager.initGraphics = function() {
	    var type = this.preferableRendererType();
	    Graphics.initialize(Chimaki_AvgBase._screenWidth, Chimaki_AvgBase._screenHeight, type);
	    Graphics.boxWidth = Chimaki_AvgBase._screenWidth;
	    Graphics.boxHeight = Chimaki_AvgBase._screenHeight;
	    
	    var resizeWidth = Graphics.boxWidth - window.innerWidth;
	    var resizeHeight = Graphics.boxHeight - window.innerHeight;
	    window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
	    window.resizeBy(resizeWidth, resizeHeight);;
	    
	    Graphics.setLoadingImage('img/system/Loading.png');
	    if (Utils.isOptionValid('showfps')) {
	        Graphics.showFps();
	    }
	    if (type === 'webgl') {
	        this.checkWebGL();
	    }
	};
 


//=============================================================================
// core set for AVG
//=============================================================================		
	TouchInput._onLeftButtonDown = function(event) {
	    var x = Graphics.pageToCanvasX(event.pageX);
	    var y = Graphics.pageToCanvasY(event.pageY);
	    if (Graphics.isInsideCanvas(x, y)) {
	    	if (!CheckSaveButton(x,y) && !CheckLoadButton(x, y) && !CheckSystemButton(x, y) &&!CheckItemButton()){
	    		this._mousePressed = true;
	    	}

	        this._pressedTime = 0;
	        this._onTrigger(x, y);
	    }
	};

	function CheckSaveButton(x, y){
		if (!$gameSwitches.value(Chimaki_AvgBase.SaveButtonSwitch)){
			return false;
		}
		var saveBtn = new Rectangle(
			Chimaki_AvgBase.pos[0][0],
			Chimaki_AvgBase.pos[0][1],
			Chimaki_AvgBase.img[0][1],
			Chimaki_AvgBase.img[0][2]
			);

		return (x >= saveBtn.x && x <= (saveBtn.x + saveBtn.width) && 
				y >= saveBtn.y && y <= (saveBtn.y + saveBtn.height));
	}
	function CheckLoadButton(x, y){
		if (!$gameSwitches.value(Chimaki_AvgBase.LoadButtonSwitch)){
			return false;
		}
		var loadBtn = new Rectangle(
			Chimaki_AvgBase.pos[1][0],
			Chimaki_AvgBase.pos[1][1],
			Chimaki_AvgBase.img[1][1],
			Chimaki_AvgBase.img[1][2]
			);

		return (x >= loadBtn.x && x <= (loadBtn.x + loadBtn.width) && 
				y >= loadBtn.y && y <= (loadBtn.y + loadBtn.height));
	}
	function CheckSystemButton(x, y){
		if (!$gameSwitches.value(Chimaki_AvgBase.SystemButtonSwitch)){
			return false;
		}
		var systemBtn = new Rectangle(
			Chimaki_AvgBase.pos[2][0],
			Chimaki_AvgBase.pos[2][1],
			Chimaki_AvgBase.img[2][1],
			Chimaki_AvgBase.img[2][2]
			);

		return (x >= systemBtn.x && x <= (systemBtn.x + systemBtn.width) && 
				y >= systemBtn.y && y <= (systemBtn.y + systemBtn.height));
	}
	function CheckItemButton(x, y){
		if (!$gameSwitches.value(Chimaki_AvgBase.ItemButtonSwitch)){
			return false;
		}
		var systemBtn = new Rectangle(
			Chimaki_AvgBase.pos[3][0],
			Chimaki_AvgBase.pos[3][1],
			Chimaki_AvgBase.img[3][1],
			Chimaki_AvgBase.img[3][2]
			);

		return (x >= systemBtn.x && x <= (systemBtn.x + systemBtn.width) && 
				y >= systemBtn.y && y <= (systemBtn.y + systemBtn.height));
	}	

	function CheckBackButton(x, y){
		if (!$gameSwitches.value(Chimaki_AvgBase.BackButtonSwitch)){
			return false;
		}
		var systemBtn = new Rectangle(
			Chimaki_AvgBase.pos[4][0],
			Chimaki_AvgBase.pos[4][1],
			Chimaki_AvgBase.img[4][1],
			Chimaki_AvgBase.img[4][2]
			);

		return (x >= systemBtn.x && x <= (systemBtn.x + systemBtn.width) && 
				y >= systemBtn.y && y <= (systemBtn.y + systemBtn.height));
	}		
//=============================================================================
// Scene_Map
//=============================================================================
	var chimaki_scene_map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function() {
		chimaki_scene_map_createDisplayObjects.call(this);
		// 總開關
		if ($gameSwitches.value(Chimaki_AvgBase.varID)){
			this.createAllMenuButton()
			this._lastAllButtonSwitch = Chimaki_AvgBase.varID;
		};
	};
	Scene_Map.prototype.createAllMenuButton = function (){

		if ($gameSwitches.value(Chimaki_AvgBase.SaveButtonSwitch)){
			this.createSaveButton();
			this._lastSaveButton = true;
		};
		if ($gameSwitches.value(Chimaki_AvgBase.LoadButtonSwitch)){
			this.createLoadButton();	
			this._lastLoadButton = true;
		};
		if ($gameSwitches.value(Chimaki_AvgBase.SystemButtonSwitch)){
			this.createSystemButton();
			this._lastSystemButton = true;
		};
		if ($gameSwitches.value(Chimaki_AvgBase.ItemButtonSwitch)){
			this.createItemButton();
			this._lastItemButton = true;
		};		
		if ($gameSwitches.value(Chimaki_AvgBase.BackButtonSwitch)){
			this.createBackButton();
			this._lastBackButton = true;
		};		
		

	}


	Scene_Map.prototype.createItemButton = function(){
		this._itemButton = new Sprite_Button(new Bitmap(Chimaki_AvgBase.img[3][1],Chimaki_AvgBase.img[3][2]));
		this._itemButton.bitmap = ImageManager.loadAvgMenu(Chimaki_AvgBase.img[3][0]);
		this._itemButton.x = Chimaki_AvgBase.pos[3][0];
		this._itemButton.y = Chimaki_AvgBase.pos[3][1];
		this._itemButton.setClickHandler(this.touchCallItem.bind(this));
		this.addChild(this._itemButton);		
	}

	Scene_Map.prototype.createSaveButton = function(){
		console.log(Chimaki_AvgBase.img);
		this._saveButton = new Sprite_Button(new Bitmap(Chimaki_AvgBase.img[0][1],Chimaki_AvgBase.img[0][2]));
		this._saveButton.bitmap = ImageManager.loadAvgMenu(Chimaki_AvgBase.img[0][0]);
		this._saveButton.x = Chimaki_AvgBase.pos[0][0];
		this._saveButton.y = Chimaki_AvgBase.pos[0][1];
		this._saveButton.setClickHandler(this.touchCallSave.bind(this));
		this.addChild(this._saveButton);

	}

	Scene_Map.prototype.createLoadButton = function(){
		this._loadButton = new Sprite_Button(new Bitmap(Chimaki_AvgBase.img[1][1],Chimaki_AvgBase.img[1][2]));
		this._loadButton.bitmap = ImageManager.loadAvgMenu(Chimaki_AvgBase.img[1][0]);
		this._loadButton.x = Chimaki_AvgBase.pos[1][0];
		this._loadButton.y = Chimaki_AvgBase.pos[1][1];
		this._loadButton.setClickHandler(this.touchCallLoad.bind(this));
		this.addChild(this._loadButton);

	}	
	Scene_Map.prototype.createSystemButton = function(){
		this._systemButton = new Sprite_Button(new Bitmap(Chimaki_AvgBase.img[2][1],Chimaki_AvgBase.img[2][2]));
		this._systemButton.bitmap = ImageManager.loadAvgMenu(Chimaki_AvgBase.img[2][0]);
		this._systemButton.x = Chimaki_AvgBase.pos[2][0];
		this._systemButton.y = Chimaki_AvgBase.pos[2][1];
		this._systemButton.setClickHandler(this.touchCallSystem.bind(this));
		this.addChild(this._systemButton);
	};

	Scene_Map.prototype.createBackButton = function (){
		this._backButton = new Sprite_Button(new Bitmap(Chimaki_AvgBase.img[4][1],Chimaki_AvgBase.img[4][2]));
		this._backButton.bitmap = ImageManager.loadAvgMenu(Chimaki_AvgBase.img[4][0]);
		this._backButton.x = Chimaki_AvgBase.pos[4][0];
		this._backButton.y = Chimaki_AvgBase.pos[4][1];
		this._backButton.setClickHandler(this.touchCallBack.bind(this));
		this.addChild(this._backButton);
	}



	Scene_Map.prototype.touchCallItem = function(){
		$gameVariables.setValue(Chimaki_AvgBase.systemInter, $gameMap);
		SceneManager.push(Scene_Item);
	}
	Scene_Map.prototype.touchCallSave = function(){
		$gameVariables.setValue(Chimaki_AvgBase.systemInter, $gameMap);
		SceneManager.push(Scene_Save);
	}
	Scene_Map.prototype.touchCallLoad = function(){
		$gameVariables.setValue(Chimaki_AvgBase.systemInter, $gameMap);
		SceneManager.push(Scene_Load);
	}
	Scene_Map.prototype.touchCallSystem = function(){
		$gameVariables.setValue(Chimaki_AvgBase.systemInter, $gameMap);
		SceneManager.push(Scene_Options);
	}
	Scene_Map.prototype.touchCallBack = function(){
		$gameVariables.setValue(Chimaki_AvgBase.systemInter, $gameMap);
		SceneManager.push(Scene_BackLog);
	}	

	var chimaki_scene_map_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		chimaki_scene_map_start.call(this);
		if ($gameVariables.value(Chimaki_AvgBase.systemVar) == 1){
			this.loadSPVar();
			Chimaki_AvgBase.isCallMenu = false;
			
		}		
		else if (Chimaki_AvgBase.isCallMenu){
			this.loadInterpreter_call();
			Chimaki_AvgBase.isCallMenu = false;
		}
		
		$gameVariables.setValue(Chimaki_AvgBase.systemVar ,0);

	};

	//override
	Scene_Map.prototype.loadSPVar = function (){
		if ($gameVariables.value(Chimaki_AvgBase.systemInter) != 0)
		{
			$gameMap._interpreter._index = $gameMap._interpreter._list.length;
			this.loadInterpreter();
			this._waitCount = 3;
		}	
	}	

	Scene_Map.prototype.loadInterpreter_call = function (){
		$gameMap = $gameVariables.value(Chimaki_AvgBase.systemInter);

	}
	Scene_Map.prototype.callMenu = function() {
			$gameVariables.setValue(Chimaki_AvgBase.systemInter, $gameMap);
			Chimaki_AvgBase.isCallMenu = true;
			SceneManager.push(Scene_Menu);
			SoundManager.playOk();	 		    	
			$gameTemp.clearDestination();
			this._mapNameWindow.hide();
			this._waitCount = 5;
	};

	var _chimaki_scene_map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function (){	
		_chimaki_scene_map_update.call(this);
		if (this._lastAllButtonSwitch != $gameSwitches.value(Chimaki_AvgBase.varID)){
			if ($gameSwitches.value(Chimaki_AvgBase.varID)){
				this.createAllMenuButton();
			}
			this._lastAllButtonSwitch = $gameSwitches.value(Chimaki_AvgBase.varID);
		}
		this.updateAllButton();

	}
	Scene_Map.prototype.updateAllButton = function(){
		if (this._saveButton)this.updateSaveButton();
		if (this._loadButton)this.updateLoadButton();
		if (this._systemButton)this.updateSystemButton();
		if (this._itemButton)this.updateItemButton();

	}
	Scene_Map.prototype.updateItemButton = function(){
		if (this._lastItemButton != $gameSwitches.value(Chimaki_AvgBase.ItemButtonSwitch)){
			if ($gameSwitches.value(Chimaki_AvgBase.ItemButtonSwitch)){
				this._itemButton.visible = true;
			}
			else{
				this._itemButton.visible = false;
			}
			this._lastItemButton = $gameSwitches.value(Chimaki_AvgBase.ItemButtonSwitch)
		}		
	}
	// 刷新能見度
	Scene_Map.prototype.updateSaveButton = function(){
		if (this._lastSaveButton != $gameSwitches.value(Chimaki_AvgBase.SaveButtonSwitch)){
			if ($gameSwitches.value(Chimaki_AvgBase.SaveButtonSwitch)){
				this._saveButton.visible = true;
			}
			else{
				this._saveButton.visible = false;
			}
			this._lastSaveButton = $gameSwitches.value(Chimaki_AvgBase.SaveButtonSwitch)
		}
	}

	Scene_Map.prototype.updateLoadButton = function(){
		if (this._lastLoadButton != $gameSwitches.value(Chimaki_AvgBase.LoadButtonSwitch)){
			if ($gameSwitches.value(Chimaki_AvgBase.LoadButtonSwitch)){
				this._loadButton.visible = true;
			}
			else{
				this._loadButton.visible = false;
			}
			this._lastLoadButton = $gameSwitches.value(Chimaki_AvgBase.LoadButtonSwitch)
		}
	}

	Scene_Map.prototype.updateSystemButton = function(){
		if (this._systemLoadButton != $gameSwitches.value(Chimaki_AvgBase.SystemButtonSwitch)){
			if ($gameSwitches.value(Chimaki_AvgBase.SystemButtonSwitch)){
				this._systemButton.visible = true;
			}
			else{
				this._systemButton.visible = false;
			}
			this._lastSystemButton = $gameSwitches.value(Chimaki_AvgBase.SystemButtonSwitch)
		}		

	}

	//override
	Scene_Map.prototype.loadSPVar = function (){
		if ($gameVariables.value(Chimaki_AvgBase.systemVar) != 0)
		{
			this.loadInterpreter();
			this._waitCount = 3;
			$gameVariables.setValue(Chimaki_AvgBase.systemVar, 0);
		}	
	}

	Scene_Map.prototype.loadInterpreter = function (){	
		var index = $gameMap._interpreter._index - 1 ;
		if (index < 0 ) { index = 0;}
		if ($gameMap._interpreter != null && $gameMap._interpreter._list != null &&
			$gameMap._interpreter._list[index].code == 102){
			for (var i = 0; i < 5; i++){
				if ($gameMap._interpreter._list[index - i].code == 101){
					$gameMap._interpreter._index = index - i ;
					break;
				}
			}
		}
		
		// child
		if ($gameMap._interpreter._childInterpreter != null){
			index = $gameMap._interpreter._childInterpreter._index - 1;
			if (index < 0) {index = 0;}
			if ($gameMap._interpreter._childInterpreter != null &&$gameMap._interpreter._childInterpreter._list != null &&
				$gameMap._interpreter._childInterpreter._list[index].code == 102){
				for (var i = 0; i < 5; i++){
					if ($gameMap._interpreter._childInterpreter._list[index - i].code == 101){
						$gameMap._interpreter._childInterpreter._index = index - i  ;			
						break;
					}

				}
			}
			else {
				$gameMap._interpreter._childInterpreter._index -= 2;				
			}
		}
	}	


//=============================================================================	
// fixed choice list w /h && align
//=============================================================================	

	Window_ChoiceList.prototype.initialize = function(messageWindow) {
	    this._messageWindow = messageWindow;
	    
	    Window_Command.prototype.initialize.call(this, 0, 0);
	    this.openness = 0;
	    this.deactivate();
	    this._background = 0;
	};
	Window_ChoiceList.prototype.windowY = function (){
		return (SceneManager._screenHeight / 2) - (this.windowHeight /2);
	}


	Window_ChoiceList.prototype.windowWidth = function(){
		if ($gameSwitches.value(Chimaki_AvgBase.choices)){
			return Graphics.boxWidth + 100;			
		}else{
		    var width = this.maxChoiceWidth() + this.padding * 2;
		    return Math.min(width, Graphics.boxWidth);			
		}
		
	}

	Window_ChoiceList.prototype.updatePlacement = function() {		
	    var positionType = $gameMessage.choicePositionType();
	    var messageY = this._messageWindow.y;
	    this.width = this.windowWidth();
	    this.height = this.windowHeight();
	    if ($gameSwitches.value(Chimaki_AvgBase.choices)) positionType = 1;//判斷強制置中是否開啟
	    switch (positionType) {
	    case 0:
	        this.x = 0;
	        break;
	    case 1:
	        this.x = (Graphics.boxWidth - this.width) / 2;
	        break;
	    case 2:
	        this.x = Graphics.boxWidth - this.width;
	        break;
	    }

	    if ($gameSwitches.value(Chimaki_AvgBase.choices)){
		    if (messageY >= Graphics.boxHeight / 2) {
		        this.y = (Graphics.boxHeight / 2 - this.height /2);
		    } else {
		        this.y = (Graphics.boxHeight / 2 - this.height /2);
		    }	    	
	    }
	    else{
		    if (messageY >= Graphics.boxHeight / 2) {
		        this.y = messageY - this.height;
		    } else {
		        this.y = messageY + this._messageWindow.height;
		    }	    	
	    }

   
	};
	Window_ChoiceList.prototype.maxChoiceWidth = function() {
	    var maxWidth = (this.windowWidth());
	    var choices = $gameMessage.choices();
	    for (var i = 0; i < choices.length; i++) {
	        var choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
	        if (maxWidth < choiceWidth) {
	            maxWidth = choiceWidth;	        
	        }
	    }
	    return maxWidth;
	};
	Window_ChoiceList.prototype.processNormalCharacter = function(textState) {
	    var c = textState.text[textState.index++];
	    var w = this.textWidth(c);
	    this.contents.drawText(c,  textState.x  , textState.y, w * 2, textState.height);
	    textState.x += w;
	};	

	Window_ChoiceList.prototype.textWidthEx = function(text) {
	    return this.drawTextEx(text , 0, this.contents.height);
	};

	Window_ChoiceList.prototype.drawItem = function(index) {
		if ($gameSwitches.value(Chimaki_AvgBase.choices)){
		    var rect = this.itemRectForText(index);
		    var w  = this.contents.measureTextWidth(this.commandName(index));
		    this.drawTextEx(this.commandName(index), (rect.width / 2) - (w /2), rect.y , 1000 , 'center');			
		}
		else {
		    var rect = this.itemRectForText(index);
	    	this.drawTextEx(this.commandName(index), rect.x, rect.y);			
		}
	};

	Window_ChoiceList.prototype.maxChoiceWidth = function() {
	    var maxWidth = 96;
	    var choices = $gameMessage.choices();
	    for (var i = 0; i < choices.length; i++) {
	        var choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
	        if (maxWidth < choiceWidth) {
	            maxWidth = choiceWidth;
	        }
	    }
	    return maxWidth;
	};	
	Scene_Load.prototype.onLoadSuccess = function() {
		$gameVariables.setValue(Chimaki_AvgBase.systemVar, 1);
	    SoundManager.playLoad();
	    this.fadeOutAll();
	    this.reloadMapIfUpdated();
	    SceneManager.goto(Scene_Map);

	    this._loadSuccess = true;
	};	



	// 記錄對話
	var chimaki_startMessage =  Window_Message.prototype.startMessage;
	Window_Message.prototype.startMessage = function(){
	    chimaki_startMessage.call(this);
	   	this.saveToBLOG(this._textState);
	    
	};	
	Window_Message.prototype.saveToBLOG = function (textState){
		Chimaki_AvgBase.contents = Chimaki_AvgBase.contents || [];
		if (Chimaki_AvgBase.contents.length > 100){
			Chimaki_AvgBase.contents.shift();
		}		
		Chimaki_AvgBase.contents.push(textState); 

		var len = Chimaki_AvgBase.contents.length - 1;
		if (len - 1 >= 0 ){
			if (Chimaki_AvgBase.contents[len].text && Chimaki_AvgBase.contents[len].text == Chimaki_AvgBase.contents[len - 1].text){
				Chimaki_AvgBase.contents.pop();

			}							
		}

		$gameVariables.setValue(Chimaki_AvgBase.BackVarId, Chimaki_AvgBase.contents);
		if(Chimaki_AvgBase.backSwitch == false) Chimaki_AvgBase.backSwitch = true;	
	}

//=============================================================================	
// Back_Log Scene
//=============================================================================	
	function Scene_BackLog() {
	    this.initialize.apply(this, arguments);
	}	
	Scene_BackLog.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_BackLog.prototype.constructor = Scene_BackLog;

	Scene_BackLog.prototype.initialize = function() {
	    Scene_MenuBase.prototype.initialize.call(this);

	Scene_BackLog.prototype.start = function() {
	    Scene_MenuBase.prototype.start.call(this);
	};
	    
	};
	Scene_BackLog.prototype.create = function() {
	    Scene_MenuBase.prototype.create.call(this);
	   	this.createBackSprite();
	   	this.createBackLogWindow();
	    // this.createCommandWindow();
	    // this.createSpriteButtons();
	    
	};

	Scene_BackLog.prototype.createBackSprite = function() {
		// Scene_Base.prototype.create.call(this);
		this._backSpriteSet = new Sprite(ImageManager.loadPicture(Chimaki_AvgBase.BackSceneImg));
		this.addChild(this._backSpriteSet);
		
	};

	Scene_BackLog.prototype.createBackLogWindow = function() {
		var size = Chimaki_AvgBase.BackWindowSize;
		this._backLogWindow = new Window_BackLog(size[0], size[1], size[2], size[3]);
		this._backLogWindow.setHandler('cancel', this.popScene.bind(this));
		this._backLogWindow.open();

		this.addChild(this._backLogWindow);
	}
	Scene_BackLog.prototype.popScene = function(){
		SceneManager.pop();
	}

	function Window_BackLog (){
		this.initialize.apply(this, arguments);
	}

	Window_BackLog.prototype = Object.create(Window_Base.prototype);
	Window_BackLog.prototype.constructor = Window_BackLog;	

	Window_BackLog.prototype.initialize = function(x, y, width, height){
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this._list = [];				
		this._allListText = '';
		this._allTextHeight;
		this._startIndex = 0;
		this._tempIndex = this._startIndex;

		this._handlers = [];
		this.opacity = 0;

		this._maxLength = 100;
		this._lastRect;

		this.loadText();
		
	}

	Window_BackLog.prototype.loadText = function(){
		this._list = $gameVariables.value(Chimaki_AvgBase.BackVarId);

		for (var i = 0; i < this._list.length ; i++){
			this._allListText += this._list[i].text + "\n";
		}	

	    var textState = { index: 0 };
	    textState.text = this.convertEscapeCharacters(this._allListText);
	    this._allTextHeight = this.calcTextHeight(textState, true);

	    this.createContents();

	    if (this._allTextHeight > this.height){
	    	this.origin.y += this._allTextHeight - this.height;	
	    }
	    this.drawTextEx(this._allListText, this.textPadding(), 0);

		this._startIndex = 0;

	}

	Window_BackLog.prototype.createContents = function (){
	    this.contents = new Bitmap(this.contentsWidth(), this._allTextHeight);
	    this.resetFontSettings();
	}


	Window_BackLog.prototype.spacing = function() {
	    return 28;
	};	


	Window_BackLog.prototype.calcTextHeight = function(textState, all) {
	    var lastFontSize = this.contents.fontSize;
	    var textHeight = 0;
	    var lines = textState.text.slice(textState.index).split('\n');
	    var maxLines = all ? lines.length : 1;

	    for (var i = 0; i < maxLines; i++) {
	        var maxFontSize = this.contents.fontSize;
	        var regExp = /\x1b[\{\}]/g;
	        for (;;) {
	            var array = regExp.exec(lines[i]);
	            if (array) {
	                if (array[0] === '\x1b{') {
	                    this.makeFontBigger();
	                }
	                if (array[0] === '\x1b}') {
	                    this.makeFontSmaller();
	                }
	                if (maxFontSize < this.contents.fontSize) {
	                    maxFontSize = this.contents.fontSize;
	                }
	            } else {
	                break;
	            }
	        }

	        textHeight += maxFontSize + 30;
	    }

	    this.contents.fontSize = lastFontSize;
	    if (textHeight > 0){
	    	return textHeight;	
	    }
	    
	};

	Window_BackLog.prototype.processHandling = function() {

        if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();
        } else if (this.isHandled('pagedown') || Input.isTriggered('pagedown')) {
            this.processPagedown();
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        } else if (Input.isTriggered('down') || Input.isRepeated('down')){
        	if (this._allTextHeight < this.height){
        		this.origin.y = 0;
        	}
        	if (this.origin.y < this._allTextHeight - this.height){
        		this.origin.y += Chimaki_AvgBase.BackSpace;
        	}
        	else{
        		this.origin.y = this._allTextHeight - this.height;		
        	}
        	SoundManager.playCursor();
        } else if (Input.isTriggered('up') || Input.isRepeated('up')){

        	if (this.origin.y -  Chimaki_AvgBase.BackSpace > 0){
        		this.origin.y -=  Chimaki_AvgBase.BackSpace;	
        		
        	}
        	else {
        		this.origin.y = 0;	
        	}
        	SoundManager.playCursor();
        	
		}
	};
	Window_BackLog.prototype.processPagedown = function() {
	    SoundManager.playCursor();
	    this.updateInputData();
	    this.deactivate();
	    this.callHandler('pagedown');

	};

	Window_BackLog.prototype.processCancel = function() {
	    SoundManager.playCancel();
	    this.updateInputData();
	    this.callCancelHandler();
	};	
	Window_BackLog.prototype.updateInputData = function() {
	    Input.update();
	    TouchInput.update();
	};

	Window_BackLog.prototype.isOpenAndActive = function() {
	    return this.isOpen() && this.active;
	};

	Window_BackLog.prototype.isCancelEnabled = function() {
	    return this.isHandled('cancel');
	};

	Window_BackLog.prototype.setHandler = function(symbol, method) {

	    this._handlers[symbol] = method;
	};
	Window_BackLog.prototype.isHandled = function(symbol) {
		
	    return !!this._handlers[symbol];
	};
	Window_BackLog.prototype.callHandler = function(symbol) {
	    if (this.isHandled(symbol)) {
	        this._handlers[symbol]();
	    }
	};

	Window_BackLog.prototype.isCancelTriggered = function() {
	    return Input.isRepeated('cancel');
	};

	Window_BackLog.prototype.popScene = function(){
		SceneManager.pop();
	}

	Window_BackLog.prototype.update = function() {
	    Window_Base.prototype.update.call(this);
	    this.processHandling();
	    this._stayCount++;
	};

	Window_BackLog.prototype.callCancelHandler = function() {
	    this.callHandler('cancel');
	};
	

	Window_BackLog.prototype.isCancelEnabled = function() {
	    return true;
	};

}());


function log (str) {
	console.log( str);
}