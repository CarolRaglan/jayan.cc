import Ember from 'ember';

export default Ember.Controller.extend({

  actions:{

    download(){

      $("#clickDownload input:checked").each(function () {
        let target=$(this).next().attr("data-href");
        console.log(target);
        window.open(target);
      })


    },

    noBuy(){
      $('#publicModal #noBuyTrigger').trigger('click');
    }

  }

});
