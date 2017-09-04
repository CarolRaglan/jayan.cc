import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  actions:{

    sendOrder(id){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get('config').apiUrl;
      ajax(url + '	sendroomorders/' + id, {
        method: 'patch'
      }).then((res) => {
        $.toastr.success("信息发送成功!");
        $("#sendOrder .xsd-modal-close").trigger("click");
      }).catch((xhr, err) => {
        $.toastr.error('信息发送失败');
      });
    }
  }
});
