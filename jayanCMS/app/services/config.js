import Ember from 'ember';
import config from '../config/environment';

export default Ember.Service.extend({
  apiHost:config.apiHost,
  apiUrl: config.apiUrl,
  apiUrl1: config.apiUrl1,
  apiUrl2: config.apiUrl2,
  apiUrl3: config.apiUrl3,
  domain: config.domain,
  environment:config.environment,
  city: '上海',
  today:moment().format('YYYY-MM-DD HH:mm'),
});
