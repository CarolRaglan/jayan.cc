import Ember from 'ember';
import ajax from 'ic-ajax';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin,{
  flag:true,
  queryParams:{
    //参数
    city:{
      refreshModel: true
    },
    keyword:{
      refreshModel: true
    },
    district:{
      refreshModel: true
    },
    block:{
      refreshModel: true
    },
    area:{
      refreshModel: true
    },
    house_id:{
      refreshModel: true
    },
    filter1:{
      refreshModel: true
    },
    filter2:{
      refreshModel: true
    },
    sort:{
      refreshModel: true
    },
    page:{
      refreshModel: true,
    }

  },
  //model加载前
  beforeModel: function (queryParams) {

    if(this.get("flag")){
      // Ember.run.later(function(){
      //   this.get("router").transitionTo({queryParams: {
      //     page:1,
      //   }});
      // }.bind(this),3000);

      this.get("router").transitionTo({queryParams: {
        keyword: "",
        city:"",
        district:"",
        block:"",
        area:"",
        house_id:"",
        filter1:"",
        filter2:"",
        sort:"",
        page:1,
        page_size:5,
      }});

      this.set("flag",false);
    }
  },

  resetController(controller, isExiting, transition) {

    if (isExiting) {
      controller.set('city', "");
      controller.set('keyword', "");
      controller.set('district', "");
      controller.set('block', "");
      controller.set('area', "");
      controller.set('house_id', "");
      controller.set('filter1', "");
      controller.set('filter2', "");
      controller.set('sort', "");
    }


  },

  model(params){

    params.paramMapping = {
      page: "page",
      perPage: 'page_size',
      sort:"ro_pay"
    };

    return this.findPaged('freshdistributehouse',params);
  },

  setupController(controller, model){
    // this.get('auth').registerTokenToAjaxHeader();
    // let url = this.get('config').apiUrl + "utilities_fees";
    // ajax(url).then((res) => {
    //   let pub = res.data.attributes;
    //   let fees = Object.keys(res.data.attributes).map( (key)=>{
    //     let it = pub[key];
    //     it.code = key;
    //     it.id = key.slice(0,-5);
    //     return it;
    //   }).sort((a,b)=>a.update_time - b.update_time);
    //   controller.set('fees',fees);
    // }).catch((err)=>{
    //   $.toastr.error( `获取杂费失败！`);
    // });
    this._super(controller, model);

  },
  actions: {

    reloadModel: function(){

      this.refresh()

    }


  }
});
