import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  tips1:0,
  tips2:0,
  type:true,
  didInsertElement:function(){

    let _this=this;

    $("#distributeHouse").on("click","#searchHouses",function () {

      _this.sendAction("getList",1,_this.get("tips1"),$("#searchHouses_input").val(),_this.get("tips2"));
    })
    $("#distributeHouse").on("click","input[name='hideHouses']",function () {

      let type=$(this).attr("data-type");
      if(type=='all'){
        _this.set("tips1",0);
        _this.set("tips2",0);

      }else if(type=='employer'){
        _this.set("tips1",1);
        _this.set("tips2",$("#hideEmployerHouses").attr("data-value"));
      }else{
        _this.set("tips1",1);
        _this.set("tips2",0);

      }
      _this.sendAction("getList",1,_this.get("tips1"),$("#searchHouses_input").val(),_this.get("tips2"));
      reStart()
    })

    $("#distributeHouse").on("click","#houseList input",function () {

      if($(this).parent().find("input:checked").length==1){

         _this.send("sendHouses",_this.get("employer").id,$(this).attr("data-value"),"add");
      }else {
         _this.send("sendHouses",_this.get("employer").id,$(this).attr("data-value"),"del");


      }
    });

    $("#distributeHouse").on("click",".xsd-modal-close",function () {
      _this.sendAction("staffReload")

    });

    function reStart() {
      $("#house_pages").attr("data-value",1);
      $("#house_pages").val("第1页");
    }


  },

  actions:{

     addAll(){

       let url=this.get("config").apiUrl +"employerhouses/"+this.get("employer").id,action;
       this.get('auth').registerTokenToAjaxHeader();
       if($("#distributeHouse #addAll").find("input:checked").length==1){
         action="add_all";
         if($("#searchHouses_input").val().length>0){
           action="add_filter";
         }
       }else{
         action="del_all";
       }
       ajax(url,{
         method:"Patch",
         data:{
           action:action,
           search:$("#searchHouses_input").val()
         }
       }).then(()=>{

         if(action==="add_all"){
           $.toastr.success("已分配！");
         }else{
           $.toastr.success("已取消");
         }
         this.sendAction("getList",1,this.get("tips1"),$("#searchHouses_input").val(),this.get("tips2"));

       }).catch((err)=>{
         $.toastr.error("操作失败！");
       })

     },
     sendHouses(id,ids,action){

       let url=this.get("config").apiUrl +"employerhouses/"+id;
       this.get('auth').registerTokenToAjaxHeader();
       ajax(url,{
         method:"Patch",
         data:{
           house_ids:ids,
           action:action
         }
       }).then(()=>{
         if(action==="add"){
           $.toastr.success("已分配！");
         }else{
           $.toastr.success("已取消");
         }


       }).catch((err)=>{
         $.toastr.error("操作失败！");
       })
     },

    screenHouse(e){
      this.sendAction("getList",$(e.target).attr("data-value"),this.get("tips1"),$("#searchHouses").next().val(),this.get("tips2"));
    }
  }
});
