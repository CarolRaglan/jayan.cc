import Ember from 'ember';
import ajax from 'ic-ajax';

let predefine = [{name:'租金'},{name:'押金'}];
export default Ember.Route.extend({

  renderTemplate() {
    this.render("uc/config/extras", {  //使用模板的位置 (templates/)uc/config/extras(.hbs)
      into: "uc/index",   //"outlet"位于路径为(template/)uc/index(.hbs)的模板文件
      outlet: "uc"   //渲染到名叫 'user' 的outlet组件（即“ {{outlet 'uc'}} ”）中
    });
  },

  setupController(controller,model){
    console.log(model);
    controller.set('model', model);
    controller.set('deletable',false);
    controller.set('predefine',predefine);
  },

  model(){
    this.get('auth').registerTokenToAjaxHeader();
    let url = this.get('config').apiUrl + "utilities_fees";
    return ajax(url).then((res) => {
      let pub = res.data.attributes;
      return Object.keys(pub).map( (key)=>{
        let it = pub[key];
        it.code = key;
        return it;
      }).sort((a,b)=>a.update_time - b.update_time);
    }).catch((err)=>{
      let msg = `获取杂费失败！`;
      if( err && typeof err.errorThrown === 'string' ){
        msg += `<br/>详情：${err.errorThrown}`;
      }
      $.toastr.error(msg);
      // 需要自己捕获错误。否则出错会阻塞js逻辑的执行，让一部分全局逻辑无法如预期。比如无权限跳转到登录页
    });
  }



});
