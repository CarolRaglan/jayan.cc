export function initialize(application) {

  application.injection('service', 'router', 'router:main');
  application.injection('component', 'router', 'router:main');
  application.injection('adapter', 'router', 'router:main');
  application.injection('controller', 'router', 'router:main');


}

export default {
  name: 'router',
  initialize: initialize
};
