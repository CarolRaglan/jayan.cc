import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  queryParams: ['page', 'title', 'server', 'perPage', 'status', 'source', 'urgency', 'start_date', 'end_date','search'],
  keyword: "",
  perPage: 12,
  page: 1,
  status:'',
  source:'',
  urgency:'',
  start_date:'',
  end_date:'',
  search:'',
  workId:'',
  flag:false,
  tipsObserver: Ember.observer('status', 'source', 'urgency', 'start_date', 'end_date','search', function () {
    this.get("router").transitionTo({
      queryParams: {
        status: this.get('status'),
        source: this.get('source'),
        urgency: this.get('urgency'),
        start_date: this.get('start_date'),
        end_date: this.get('end_date'),
        search: this.get('search'),
        page: 1,
      }
    })
  }),


  actions: {
    pageChanged(page){

      this.set('page',page);

    },
    tips(type, value, e){
      if (value == 'time') {
        this.set(type, $(e.target).val());
      } else {
        this.set(type, value);
      }

    },

    selectTime(time,e){
      debugger
    },

    tabs(type){

      this.get("router").transitionTo({
        queryParams: {
          title: type,
          start_date:"",
          end_date:"",
          status:"",
          source:"",
          urgency:"",
          search:"",
          server:0,
          page: 1,
        }
      });
      $("#com-search").val("");
      $("#fol-search").val("");
      $("#fullSource").val("");
      $("#start-time").val("");
      $("#stop-time").val("");
      $("#fol-fullStatus").val("");
      $("#fol-jinDu").val("");
      $("#start-time1").val("");
      $("#stop-time1").val("");
      $("#fol-fullSource").val("");
      $("#com-fullSource").val("");
      $("#com-fullStatus").val("");
      $("#start-time2").val("");
      $("#stop-time2").val("");
      $("#fullStatus").val("");


    },

    resetDetail(){
      let obj = {
        attributes: {
          house_type: "合住主卧",
          customer_type: "public",
          operator_id: this.get("auth").user.user,
          operator_name: "自己"
        }
      }
      this.set("detail", obj);
    },

    detail(id){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "customers/" + id+'?server=0';
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        _this.set("detail", res.data);
      }).catch((err)=> {

      });

    },

    getId(id,e){

      this.set("workId" ,id);
      this.set("flag" ,true);
      $("#allocated_a").trigger("click");
      e.stopPropagation();
    },

    allocatedPeople(id){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "customers/" + id;
      let data = {
        "new_operator": $("#people-name").attr("data-value"), /*跟进人id*/
      }
      ajax(url, {
        method: 'patch',
        data: data
      }).then((res) => {
        $.toastr.success("分配成功!");
        $("#allocated-people .xsd-modal-header .xsd-modal-close").trigger("click");
        if(this.get("flag")){
          this.send("refreshModel");
        }else{
          this.send("detail",id);
        }
        this.set("flag",false);
      }).catch((err)=> {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail);
      });

    },

    refreshModel(){

      this.send("reloadModel")
    },

  }


});
