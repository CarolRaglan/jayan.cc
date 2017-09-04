import Ember from 'ember';
import {type as validateType} from '../data/validate';
import {isFunction} from '../utils/index';
import $ from 'jquery';

class Validator{

  constructor({type}){
    this.depends = {};
    this.type = type;
  }

  validate({ctx,rules}){
    this.ctx = ctx;
    this.rules = rules;
    this.removeCache();
    // every循环那怕能提前确定返回值，也会遍历完；some循环确定了返回值就会停下遍历
    return Object.keys(rules).map(this.engine,this).every(valid=>valid);
  }

  removeCache(){
    this.depends = {};
  }

  //校验一项
  engine(key){
    let rule = this.rules[key]; //获得当前校验项的规则
    let depends = this.getDepends(rule);  //根据规则（中对依赖部分的描述，补全数据）
    let name = isFunction(rule.name) ? rule.name(depends) : rule.name;
    return !Object.keys(this.type).some(type=>{  //校验点来说，找到一个校验点不通过就停下。(即循环中有一个return true就停下）
      let point = rule[type]; //一个校验点
      let predefine = this.type[type];  //校验点的预置对象
      let option = {};  //可选对象
      let valid = true;
      if(!point){ //没有该项校验
        return false;  //通过（跳过）该校验点
      }
      let need = this.getNeed(rule,depends);  //required校验前的判定
      if(type==='required' && isFunction(rule.need) && !need) {
        return false;  //跳过required校验。
      }
      let customizeTip = this.isCustomizeTip(rule,depends); //是否需要自定义错误tip
      //规则的校验是否依赖于input输入框的值，一般来说，如果depends项中罗列的项中不能找到数据，则需要一个input
      let hasInput = !!rule.input;
      let input = this.getInput(rule);  //获取输入框的值
      if(hasInput){
        option.input = input;
      }
      if(type!=='required'&&!input){
        return false;
      }
      if( isFunction(point) ){  //校验点是函数
        option.reg = predefine.reg;
        if(customizeTip){
          option.tips = predefine.tips({name:name});
          return !point(depends,option);
        }else{
          valid = point(depends,option);
        }
      }else{  //其它情况，使用预置的校验函数（或者校验正则）校验
        if(predefine.validate){
          if(Array.isArray(input)){
            valid = input.every(it=>predefine.validate({input:it,reg:predefine.reg,set:point}));
          }else{
            valid = predefine.validate({input,reg:predefine.reg,set:point});
          }
        }else if(predefine.reg){
          if(Array.isArray(input)){
            valid = input.every(it=>predefine.reg.test(it));
          }else{
            valid = predefine.reg.test(input);
          }
        }else{
          throw new Error(`${JSON.stringify(rule)} should have a validate function or a regExp.`);
        }
      }
      if(valid){
        Ember.set(rule,'value',input);
      }else{
        Ember.set(rule,'tips',predefine.tips({name:name,set:point,input}));
        Ember.set(rule,'on',true);
      }
      return !valid;
    });

  }

  getOneDepend(key){
    if(!this.depends[key]){
      this.depends[key] = this.ctx.get(key);
    }
    return this.depends[key];
  }

  //获取依赖的数据项
  getDepends({depends=[]}){
    let res = {};
    if(Array.isArray(depends)){
      depends.forEach(key=>{
        res[key] = this.getOneDepend(key);
      });
    }else if(typeof depends === 'string'){
      let key = depends;
      res[key] = this.getOneDepend(key);
    }
    return res;
  }

  getNeed({need},depends){
    return isFunction(need) ? need(depends) : need;
  }

  isCustomizeTip({customizeTip},depends){
    return isFunction(customizeTip) ? customizeTip(depends) : customizeTip;
  }

  getInput({input}){
    if(input){
      if(Array.isArray(input)){
        return input.map(it=>{
          return this._getInput(it);;
        });
      }else{
        return this._getInput(input);
      }
    }
  }

  _getInput( input ){
    return this.ctx.$ ? this.ctx.$(`[name="${input}"]`).val() : $(`[name="${input}"]`).val();
  }

};

let validator = new Validator({type:validateType});

export let validate = validator.validate.bind(validator);

