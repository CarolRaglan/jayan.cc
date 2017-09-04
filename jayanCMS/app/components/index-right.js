import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  notices: "",
  reminders: "",
  detail:"",
  monthSet:'',
  daySet:'',
  didInsertElement: function () {
    this.send("getReminders");
    this.send("getNotices");
    this.send("timeData");
  },
  actions: {
    timeData(){
      let monthArr=["一","二","三","四","五","陆","七","捌","九","十","十一","十二"];
      let monthTime=moment().add('months',-1).format('MM');
      let daySet=moment().add('days',-1).format('DD');
      let monthSet=monthArr[parseInt(monthTime)-1];
      this.set("monthSet",monthSet);
      this.set("daySet",daySet );
    },
    addReminder(){
      if ($('#reminder').validate() !== true) {
        return;
      }
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "reminders";
      let _params = {};
      _params.deadline_time = $('#deadline-time').val();
      _params.content = $('#content').val();
      ajax(url, {
        method: 'Post',
        data: _params,
      }).then((res) => {
        $.toastr.success("添加备忘成功!");
        $("#reminder .xsd-modal-close").trigger("click");
        this.send("getReminders", this.get("args"));
      }).catch((err)=> {
        $.toastr.error(err.jqXHR.responseJSON.errors.detail)
      });

    },

    dealReminder(id){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "reminders/" + id;
      let _params = {};
      if($("#reminder-panel input:checked").length==1){
        _params.is_done = true;
      }else{
        _params.is_done = false;
      }
      _params.content = $("#content-panel").val();
      _params.deadline_time = $("#deadline-time-panel").val();
      ajax(url, {
        method: 'Put',
        data: _params,
      }).then((res) => {
        $.toastr.success("操作成功!");
        _this.$("#reminder .xsd-modal-close").trigger("click");
        this.send("getReminders");

      }).catch((err)=> {
        $.toastr.error("操作失败!")
      });
    },

    getReminders(){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "reminders";
      ajax(url, {
        method: 'Get',
        // data: {'is_done':0}

      }).then((res) => {
        _this.set("reminders", res);
      }).catch((err)=> {
        $.toastr.error("获取备忘数据失败!")
      });

    },

    clickReminder(reminder,e){
      //未传入reminder,默认取数据第一个对象
      if(e==null){
        reminder = this.get('reminders').data[0];
      }
      let detail = {id:reminder.id,content:reminder.attributes.content,date:reminder.attributes.deadline_time}
      if(reminder.attributes.is_done==true){
        detail['checked']='checked';
      }
      this.set('detail',detail);

    },
    getNotices(){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "announcements?page_size=6";
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        // console.log(res);
        _this.set("notices", res);
      }).catch((err)=> {
        $.toastr.error("获取公告数据失败!")
      });

    },

    clickNotice(notice){
      if(notice==null){
        notice = this.get('notices').data[0];
      }
      let detail = {id:notice.id,content:notice.attributes.content,date:notice.attributes.deadline_time}
      if(notice.attributes.is_done==false){
        detail['checked']='checked';
      }
      this.set('detail',detail);

    },
  }
});
