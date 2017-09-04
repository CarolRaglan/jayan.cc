export function initialize( application ) {

  application.injection('controller', 'config', 'service:config');
  application.injection('route', 'config', 'service:config');
  application.injection('component', 'config', 'service:config');

}

export default {
  name: 'config',
  initialize: initialize

};

