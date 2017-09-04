import Ember from 'ember';

export default Ember.Controller.extend({

   actions:{

     getHeight(){
        let iframe=$("#ifr")[0];
        iframe.height=$(window).height()-107;
        window.onresize=function () {
          iframe.height=$(window).height()-107;
        }
     }
   }

})
;
