import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement:function () {
    $("#nav").on("click","li",function () {
      $("#nav .active").removeClass("active");
      $(this).addClass("active");
    })
  },
  actions:{

    storeOrigin (link,domain) {

      $.cookie('origin', "centre",{ expires: 30,path:'/',domain:domain});
      window.location.href=link;
    }
  }
});
