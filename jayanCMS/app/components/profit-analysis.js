import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  income:"",
  payout:"",
  didInsertElement(){
    let _this=this;
    $("#profitAnalysis").on("click",".xsd-modal-close",function () {

      _this.sendAction("modelReload");
      // _this.sendAction("houseReload")

    })
  },
  actions:{

    getIncome(){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "housemoneyflows/" + this.get("id")+"/income";
      ajax(url, {
        method: 'Get',
        // async:false,
      }).then((res) => {

        this.set("income", res.data.attributes.houses);

      }).catch((err)=> {
        $.toastr.error('获取已收租金失败');
      });

    },

    getPayout(){

      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "housemoneyflows/"+ this.get("id")+"/payout";
      ajax(url, {
        method: 'Get',
        // async:false,
      }).then((res) => {

        this.set("payout", res.data.attributes.houses);

      }).catch((err)=> {
        $.toastr.error('获取已付租金失败');
      });

    },

    setCost(){

      if($('#setting-cost').validate()!==true){
        return;
      }
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "houses/" + this.get("id");
      ajax(url, {
        method: 'patch',
        data:{
          decorating_fee:$("#decorating_fee").val()
        }
        // async:false,
      }).then((res) => {

        $.toastr.success('成本设置成功!');
        this.sendAction("getProfit",this.get("id"));

      }).catch((err)=> {
        $.toastr.error('成本设置失败!');
      });

    }

  }
});
