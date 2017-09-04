import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({

  type: "authority",
  queryParams: ['keyword','created_at__gte','created_at__lte','account_type','role_name',"page","perPage"],
  detail:null,
  power:"",
  editPower:"",
  employer:"",
  refreshEmployer:true,
  page: 1,
  perPage: 500,
  deleteEmployer:"",
  list:"",
  arrayList:[],
  roleList:[],
  role:null,
  init() {
    let _this = this;
    this.get('auth').registerTokenToAjaxHeader();
    let url = this.get("config").apiUrl + "roles";
    ajax(url, {
      method: 'Get'
    }).then((res) => {
      _this.set("roleList", res.data);
    }).catch((err)=> {

    });
  },
  actions: {
    submit() {
      $('#screen').click();
      setTimeout(function(){
        $('#screen').click();
      }, 500);
    },

    search() {
      this.get("router").transitionTo({queryParams: {
        keyword: $('#search').val(),
      }});
    },

    screen() {
      this.get("router").transitionTo({queryParams: {
        account_type: $("#s_account_type").val()!== '不限' ? $("#s_account_type").val() : '',
        role_name: $("#s_role_name").val() !== '不限' ? $("#s_role_name").val() : '',
        created_at__gte: $("#trade_at__gte").val(),
        created_at__lte:$("#trade_at__lte").val()
      }});
    },

    reset() {
      $('#account-search input').val('');
      this.get("router").transitionTo({queryParams: {
        keyword: "",
        created_at__gte:"",
        created_at__lte:""
      }});
    },

    getEmployer(employer){

      this.set("deleteEmployer",employer);
    },

    getRoles(){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "roles";
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        _this.set("roleList", res.data);
      }).catch((err)=> {

      });

    },

    deleteEmployer(e){

      let obj=this.get("deleteEmployer");
      let _this=this;
        obj.destroyRecord().then(()=> {

          $.toastr.success("删除成功!");
          $("#delEmployer .xsd-modal-header .xsd-modal-close").trigger("click");
          $('#employerDetail .xsd-modal-close').trigger("click");
          _this.send("staffReload");

        }).catch((err)=>{

           $.toaster.error("删除失败!")
        });

      e.stopPropagation();
    },

    detail(employer){
      this.set("deleteEmployer",employer);
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "employers/" + employer.id;
      ajax(url, {
        method: 'Get'
      }).then((res) => {
        _this.set("detail", res.data);
      }).catch((err)=> {

      });

    },

    getPower(id,e){
      $("#distributePower_btn").trigger("click");
      this.send("getRoles");
      let _this=this;
      this.get('auth').registerTokenToAjaxHeader();
      let url=this.get("config").apiUrl +"employerpmss/"+id;
      ajax(url,{
        method:"GET"
      }).then((data)=>{
         _this.set("power",data.data.attributes)
      }).catch((err)=>{
        $.toastr.error("获取员工权限失败！")
      });
      e.stopPropagation();
    },

    getList(page,type,search,employer){

      let _this=this;
       this.store.unloadAll("house");
       this.store.query('area',{
        page_size:12,
        page:page,
        undistributed:type,
        search:search,
        employer:employer,
         locate:"employer"
      }).then((res)=>{
         let arr=[];
         for(var i=1;i<=res.meta.pagination.pages;i++){
           arr.push(i);
         }
        _this.set("arrayList",arr);
        _this.set("list",res);

      });
    },

    getHouses(employer,e){

      $("#distributeHouse_btn").trigger("click");
      this.set("employer",employer);
      let _this=this;

      this.set("refreshEmployer", false);

      Ember.run.next(function () {

        _this.set("refreshEmployer", true);
      });
      this.send("getList",1,0,"");
      e.stopPropagation();

    },

    staffReload(){

      this.send('reloadModel');
    }
  }
});
