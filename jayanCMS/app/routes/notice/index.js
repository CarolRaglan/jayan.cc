import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
import ajax from 'ic-ajax';
export default Ember.Route.extend(RouteMixin,{
  queryParams:{
    id:{
      refreshModel:true
    },
  },
  model(params){
    params.paramMapping = {
      page: "page",
      perPage: 'page_size'
    };
    return this.findPaged('announcement', params);
  },
  setupController(controller, model,params){
    let _this = this;
    this.get('auth').registerTokenToAjaxHeader();
    let url = this.get("config").apiUrl1 + "announcements/"+this.controller.id;
    ajax(url, {
      method: 'Get'
    }).then((res) => {
      _this.controller.set("detail", res.data.attributes);
    }).catch((err)=> {

    });

    this._super(controller, model);
  }
});
