import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';


export default Ember.Route.extend(RouteMixin, {

  queryParams: {
    keyword:{
      refreshModel: true
    },
    type:{
      refreshModel: true
    },
    trade_at__gte:{
      refreshModel: true
    },
    trade_at__lte:{
      refreshModel: true
    },
    page:{
      refreshModel: true
    }
  },

  model(params){
    params.paramMapping = {
      page: "page",
      perPage: 'page_size',
    }
    return this.findPaged('premoneyflow', params);
  },

  actions: {
    reloadModel: function() {
      this.refresh();
    }
  }
});
