import Ember from 'ember';
import $ from 'jquery';
/**
 * 一个label及一个input[type=text]组 组件，
 * 设计该组件的目的在于添加双向数据绑定，添加错误处理等。
 * 可接受的属性有：
 * @property value {string} || {number} <required>
 *     值对象;
 * 注：modal和value一般只需传一个
 * @property unit {string} <optional>
 * @property name {string}
 * @property value {string}
 * @property title {string}
 * @property placeholder {string}
 * @property readonly {string}
 * @property change {action} <optional>
 *     内部输入框的值改变会触发该action;
 * @property press {action} <optional>
 *     在内部输入框获取焦距的请提下，发生按键事件（包含backspace,delete键）时会触发该action;
 * @property focus {action} <optional>
 *     内部输入框获得焦距时会向外触发该action;
 * @property blur {action} <optional>
 *     内部输入框推动焦距时会向外触发该action;
 */
export default Ember.Component.extend({

  classNames:'table-cell',
  classNameBindings:['error'],

  actions: {

    change(e){
      let input = $(e.target).val();
      if(input!=this.get('value')){
        this.set('value',input);
        this.sendAction('change',input,e);
      }
    },

    dateChange(...args){
      this.sendAction('change',...args);
    },

    dateSelection(...args){
      this.sendAction('onSelection',...args);
    },

    press(e){
      setTimeout(()=>{
        let input = $(e.target).val();
        if(input!=this.get('value')){
          this.sendAction('press',input,e);
        }
      },200);
    },

    focus(e){
      if(this.get('error')){
        this.get('error',false);
      }
      this.sendAction('focus',e);
    },

    blur(e){
      this.sendAction('blur',e);
    }

  }

});
