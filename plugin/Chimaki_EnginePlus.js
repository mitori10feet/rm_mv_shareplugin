//=============================================================================
// Chimaki_EngineAmorPlus.js
// Version: 1.0
//=============================================================================
/*:
* @plugindesc 引擎獎勵
* @author Maker製造機 Chimaki 
* 
*
* @help
* 作者网站：Maker制造机 www.chiamkier.com for 重装机兵
* 功能
* 角色备注栏位 加上 <XX奖励 : 数值> , 在触发奖励时可以增加Max HP;
*
* 单子奖励 : 只装备1个Engine 时生效
* 双子奖励 : 装备2个Engine 时生效
*
* XX奖励 :
* 装备此engine 的 角色 备注栏中 加上<tankType: XX> 即可生效 EX: 角色A 备注栏 <tankType:履带> , engine 备注栏 <履带奖励:500>, 则触发 maxhp+500
* tank多個特性 <tankType1: ....> <tankType2:....>
*
* 辅助奖励 : 装备2个 engine + 只有一个engine 是 辅助奖励 时生效
*
* 推动奖励 : 装备2个 engine + 如果有兩個推動獎勵的話, 此engine 在 副engine 时生效,
*
* 无双奖励 : 此engine 装备在第一个engine栏位即生效
* 
* Engine 道具說明中有 \J 的時, 如果此道具被激活, \J後面的文字會轉變\C[3] 的顏色
*/


"use strict"; // es mode

var Imported = Imported || {};
var chimaki_plugin = chimaki_plugin || {};
chimaki_plugin.engie = {};
chimaki_plugin.alias = {};


var $aid = 0;
chimaki_plugin.engie._lastIndexOf = document.currentScript.src.lastIndexOf( '/' );
chimaki_plugin.engie._indexOf            = document.currentScript.src.indexOf( '.js' );
chimaki_plugin.engie._getJSName          = document.currentScript.src.substring( chimaki_plugin.engie._lastIndexOf + 1, chimaki_plugin.engie._indexOf );

chimaki_plugin.engie.args = PluginManager.parameters( chimaki_plugin.engie._getJSName);

// override
Window_ItemHelp.prototype.setItem = function(item,force){
    this.contents.clear();
    if (item && item.description && item.atypeId == Fux2.E31_Core.engineArmorTypeId){
        let i = $dataArmors[item.baseItemId];
        item.description = i.description;
        let desc = item.description;
        if (desc.match(/[\J]/)){
            if (EngieManager.isActiveByItem(item)){
                item.description = i.description.replace(/[\J]/, 'C[3]');
            }
        }        
    }

    this._item = item ;
    this.refreshFields();
}

// override
chimaki_plugin.alias._windowbase_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = chimaki_plugin.alias._windowbase_convertEscapeCharacters.call(this, text);
    return text;
};    


chimaki_plugin.alias.param = Game_BattlerBase.prototype.param;
Game_BattlerBase.prototype.param = function(paramId) {
    let value = chimaki_plugin.alias.param.call(this, paramId)
    if (paramId == 0 && !(this instanceof Game_Enemy)){
        log(this);
        value += EngieManager.getEnigeData( this.equips(), this); 
        var maxValue = this.paramMax(paramId);
        var minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));            
    }
    return value;
};


Game_Tank.prototype.isDoubleEngine = function() {
    var slots = this.equipSlots().filter(function(slot){
        return slot.etypeId >1 && slot.stypeId == Fux2.E31_Core.engineArmorTypeId;
    });
    return slots.length >= 2;
};

//doing
class EngieManager {
    static constructor (){
        this._equips = [];
        this._actor;

        this._active_list = [];
        

    };
    static isActiveByItem (item){
        log(item.desc)
        let id = item.id;
        let active = false;
        for (let i in this._active_list ){
            let actor = this._active_list[i];
            if ((actor.main.item_id == id && actor.main.active) || 
                (actor.sub.item_id == id && actor.sub.active) )
            {
                active = true;
            }
        }

        return active;
    }
    static isActive (item, actor){

        if (!item.meta ) return false;            

        let equips = actor.equips();

        let id = actor._actorId;
        let actorObj;
        for (let i in this._active_list){
            let a = this._active_list[i];
            if (id == a.id){
                actorObj = a;
            }
        }
        let flag = 0;


        if ( (actorObj.main.item_id == item.id && actorObj.main.active ) ||
              (actorObj.sub.item_id == item.id && actorObj.sub.active ) )
        {
            log("111111")
            flag = 1;
        }           
        return flag;
    }
    static getEnigeData ( equips, actor ){
        if (!actor  ) return;
        this._equips = [];
        this._active = [];
        this._actorActive = { id : null , main : { active : false , item_id : 0, value : 0} , sub : { active : false , item_id : 0 , value : 0} };
        this._active_list = this._active_list || [];
        this._actorActive.id = actor._actorId;



        $aid = actor._actorId;
        this._actor = actor ?  $dataActors[actor._actorId]: {};

        // 全部格子
        let slots = actor.equipSlots();

        // 現在裝備道具狀況
        let eq2 = actor._equips;

        //  原生物件, 玩家所裝備的道具 data item 的資料
        for (let i = 0 ; i < slots.length ; i ++){
            let slot = slots[i];
            // 格子符合
            if (slot.etypeId > 1 && slot.stypeId == Fux2.E31_Core.engineArmorTypeId){
                let item = equips[i];
                this._equips.push(item ? item : null);
            }
        }

        

        for (let i = 0 ; i < this._equips.length; i ++){
            if (!this._equips[i]){
                this._equips[i] = { meta : "NODATA" };
            }
        }
        return Number( this.checkEngiePlus(this._equips) ) || 0;
    }
    static setValue (v , value){
        if (v != false){
            value += Number(v);
        }
        return Number(value);
    }
    static checkEngiePlus( equips ){
        let value = 0;



        for (let i = 0 ; i < equips.length; i++){
            let item = equips[i];
            let v = false;
            if (item.meta == "NODATA"){
                v = false;
            }
            else if (item.meta['单子奖励']){
                v = this.checkSinglePlus(equips, item.meta['单子奖励'], item);
                value = this.setValue(v, value);       
            }
            else if (item.meta['双子奖励']){
                v = this.checkDoublePlus(equips);
                value = this.setValue(v, value);                    
            }     
            else if (item.meta['辅助奖励']){
                v = this.checkSupPlus(item.meta['辅助奖励'], equips);
                value = this.setValue(v, value);                    
     
            } 
            else if (item.meta['推动奖励']){
                v = this.checkBoostPlus(i ,item.meta['推动奖励'], equips);
                value = this.setValue(v, value);                         
            }
            else if (item.meta['无双奖励']){
                v = this.checkMusoPlus(i ,item.meta['无双奖励'] ,equips.length );
                value = this.setValue(v, value);                                                                 
            }
            else {
                v = this.checkTypePlus(equips ,item, this._actor)
                value = this.setValue(v, value);
            }   
            let hash = ( i == 0) ? 'main' : 'sub';


            this._actorActive[hash].active = (v === false) ? false : true;
            this._actorActive[hash].item_id = item.id;
            this._actorActive[hash].value = (v === false) ? 0 : value;
        }

        let actorFlag = 0;
        let actorIndex = 0;
        for (let i = 0 ; i < this._active_list.length; i ++){
            let actorData = this._active_list[i]
            if (actorData.id == this._actorActive.id){
                actorFlag = 1;
                actorIndex = i;
                break;
            }
        }
        if (!actorFlag){
            this._active_list.push(this._actorActive);
        }
        else {
            this._active_list[actorIndex] = this._actorActive;
        }

        log('最後加乘數值 :: ' + value);
        return value;
    };  
    // index = 0 main engine index = 1 sub engine 
    static checkMusoPlus (index , value , equips, len){
        if (index == 1) return false;
        log('觸發無雙');
        return value;

    }
    // doing
    static checkBoostPlus (index, value, equips){
        // 只裝備一個絕對不會生效

        let bootCount = 0; 
        let engineCount = 0;
        let baseItem;

        // 推動獎勵
        for (let i = 0 ; i < equips.length; i++){
            let item = equips[i];
            let meta = item.meta;
            if (item && item.id){
                engineCount++
            }
            for (let j in meta){
                if (j == '推动奖励'){
                    bootCount++;
                }
            }                
        }


        // 取得另外一個裝備資料
        for (let i = 0 ; i < equips.length; i++){
            if (i != index ){
                baseItem = equips[i];
                break;
            }
        }

        if (!baseItem) return false;

        if (value.match(/[%]/) && baseItem && baseItem.id){
            value = Number(this.getRateValue(value.replace('%',''), baseItem) );
            log('rateValue ::' + value);
        }

        // 雙推動, 如果在main 則無效
        if (bootCount >= 2 && index == 0) return false;
        // 根據不同情況決定要用哪個數值

        // 雙推動時, 只有 sub engine 有效果, 如果是% 的話, 倍率算成%的
        return value;
    }

    static getRateValue(value , baseItem){
        let id = baseItem.baseItemId;
        let base_value = Number($dataArmors[id].params[0] );
        let last_value = Math.floor( (base_value * (Number(value) / 100)));
        
        // log('getRateValue base value :' + base_value + ', last_value :' + last_value + ', rate :' + value)
        return Number(last_value );
    }

    /* 兩個輔助則失效, 一個輔助 + 主引擎 則生效*/
    static checkSupPlus (value, equips){
        let count = 0;
        let engineCount = 0;
        for (let i = 0; i < equips.length; i ++){
            let item = equips[i];
            let meta = item.meta;
            if (item &&item.id){
                engineCount++;
                for (let i in meta){
                    if (i.match('辅助奖励')){
                        count++;
                    }
                }                                
            }
        }

        if (count >= 2 || engineCount < 2) return false;


        if (value > 0){
            log('觸發輔助');
        }            
        return value;
    }

    // doing
    static checkTypePlus (equips, item, actor){

        let meta = item.meta;
        let value = 0;
        let count = 0;
        for (let i in meta){
            let str = { meta : i};
            let type_text = str.meta.replace('奖励','');
            let v = this.matchActorType(actor, type_text);
            if (v != false ){
                count++
                log('觸發 :' + count + ' 次');
                value += Number( eval (item.meta[i] ));

            }

        }
        if (value > 0){
            log('觸發ＸＸ類型');
        }            
        return value;

    }         
    static matchActorType ( actor , type){
        let meta = actor.meta;
        let flag = false;
        for (let i in meta){
            if (type == meta[i] && i.match(/[tankType]/) ){
                flag = true;
                break;
            }
        }

        return flag;
    }




    static checkSinglePlus (equips, plus, item){
        let count = 0;
        for (let i in equips){
            let item = equips[i];
            if (item && item.id ){
                count++;  
            } 
        }

        return count == 1 ?  plus : false;
    }     
    static checkDoublePlus (equips){
        if (equips.length < 2) return false;

        let count = 0;
        let plus = 0;
        for (let i in equips){
            let item = equips[i];
            if (item && item.meta['双子奖励']){
                plus = Number( item.meta['双子奖励'] );
                count++;
            }
        }
        if (count >= 2 ){
            log('觸發雙子')
        }
        return count >= 2 ? plus : false;
    }    

    static getEnigePlusById ( id ){
        let obj;
        let total = 0;
        for (let i in this._active_list){
            let actor = this._active_list[i];
            if (actor.id == id ){
                obj = actor;
                break;
            }
        }

        if (obj){
            total += obj.main.active ? obj.main.value : 0;
            total += obj.sub.active ? obj.sub.value : 0;
// this._actorActive = { id : null , main : { active : false , item_id : 0, value : 0} , sub : { active : false , item_id : 0 , value : 0} };

        }

        return total;
        

    }
}



function log (str, obj){
    return;
    if ($aid != 30) return;
    if (obj){
        console.log(str, obj);    
    }
    else {
        console.log(str);
    }
    
}