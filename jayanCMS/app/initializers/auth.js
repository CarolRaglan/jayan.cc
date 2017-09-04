export function initialize(application) {
  // application.inject('route', 'foo', 'service:foo');
  application.injection('route', 'auth', 'service:auth-manager');
  application.injection('controller', 'auth', 'service:auth-manager');
  application.injection('adapter', 'auth', 'service:auth-manager');
  application.injection('component', 'auth', 'service:auth-manager');
}

export default {
  name: 'auth',
  initialize
};
