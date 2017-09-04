import DS from 'ember-data';

import config from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  host: config.apiHost,
  namespace: 'api',
  coalesceFindRequests: true,

  urlForQuery(query,moduleName){
    if(moduleName==='premoneyflow'){ //收支预算
      console.log('pre money flow');
      if(query.type==1){
        moduleName = 'premoneyflows_out';
      }else{
        moduleName = 'premoneyflows_in';
      }
    }
    return this.buildURL(moduleName);
  },

  pathForType: function (moduleName) {
    let mapper = {
      showroom:'openchannels/showroom',
      h2ometrade:'landlord',
      fee:'utilities_fee'
    };
    moduleName = mapper[moduleName] || moduleName;
    switch(moduleName){
      case 'moneyflow':
      case 'housereport':
      case 'bill':
      case 'rundetail':
      case 'report':
      case 'financeloan':
      case 'announcement':
      case 'payment':
      case 'openchannels/showroom':
      case 'landlord':
        return Ember.String.underscore(`v2/${moduleName}s`);
      case 'premoneyflows_out':
      case 'premoneyflows_in':
        return Ember.String.underscore(`v2/${moduleName}`);
      default:
        return Ember.String.underscore(`v1/${moduleName}s`);
    }
  },

  //Adapter 中的 ajax 请求会使用这个参数, 但同时注意将 auth manager 给 inject 到 adapter 中
  headers: function () {
    return {
      "Authorization":  `${this.get('auth.token_type')} ${this.get('auth.token')}`
    };
  }.property('auth.token'),

  handleResponse: function (status, headers, payload) {

    let _this = this;
    //请求错误捕获
    if (status === 401) {
      _this.router.transitionTo('user.sign');
    } else if (status === 404) {
      _this.router.transitionTo('/404');
    } else if (status == 500) {
      _this.router.transitionTo('/500');
    }
    let errors = payload.errors;

    let newErrors = [];

    if (status === 400 && errors) {
      for (var key in errors) {
        if (errors.hasOwnProperty(key)) {
          for (var i = 0; i < errors[key].length; i++) {
            let newError = {};
            newError['source'] = {};
            newError['source']['pointer'] = 'data/attributes/' + key;
            newError['detail'] = errors[key][i];
            newErrors.push(newError);
          }
        }
      }
      return new DS.InvalidError(newErrors);
    }
    return this._super(...arguments);
  },
  //
  shouldReloadRecord: function (store, snapshot) {

    return false;
  },

  shouldReloadAll: function (store, snapshot) {

    return false;
  },

  shouldBackgroundReloadRecord() {
    // 来自 ember-data 的注释. (1.3.x 默认返回 false)
    //Ember.deprecate('The default behavior of `shouldBackgroundReloadRecord` will change in Ember Data 2.0 to always return true. If you would like to preserve the current behavior please override `shouldBackgroundReloadRecord` in your adapter:application and return false.', false, { id: 'ds.adapter.should-background-reload-record-default-behavior', until: '2.0.0' });
    return true;
  },

  shouldBackgroundReloadAll() {
    return true;
  }
});
