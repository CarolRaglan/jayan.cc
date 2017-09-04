import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  areas:{},
  cityList:{},
  didInsertElement:function(){
    this.send("getAreas");
    this.send("getCitys");
  },
  actions:{
    getCitys(){
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "houseinds";
      ajax(url, {
        method: 'Get',
        data: {
          "para": "all"
        }
      }).then((res) => {
        _this.set("cityList", res.data.attributes.houseinds);

      }).catch((err)=> {

      });
    },
    selectArea(area){
      this.set("areaName",area);
      if(area==='total'){
        area = "";
      }
      this.get("router").transitionTo({
        queryParams: {
          keyword: "",
          city: this.get('areaCity'),
          district: this.get('areaDistrict'),
          block: "",
          area: area,
          house_id: "",
          filter1: "",
          filter2: "",
          page: 1,
        }
      })

    },
    //城市选择改变小区
    selectCity(value){
      let params = {}
      //保存城市,用来记录小区选择时所属城市
      this.set('areaCity',value);
      params = {
        keyword: "",
        city: value,
        district: "",
        block: "",
        area: "",
        house_id: "",
        filter1: "",
        filter2: "",
        page: 1,
      }
      this.send("getDistrictList","city",value);
      this.set("params",params);
      this.send("getAreas");
    },
    //区域选择改变小区
    selectDistrict(value){
      let params = {}
      //保存区域,用来记录小区选择时所属区域
      this.set('areaDistrict',value);
      params = {
        keyword: "",
        city:this.get('areaCity'),
        district: value,
        block: "",
        area: "",
        house_id: "",
        filter1: "",
        filter2: "",
        page: 1,
      }
      this.set("params",params);
      this.send("getAreas");
    },
    //获取小区
    getAreas(){
      let _this = this;
      let params = this.get("params");
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "areas";
      ajax(url, {
        method: 'Get',
        data:params
      }).then((res) => {

        _this.set("areas", res);

      }).catch((err)=> {

      });
    },
    getDistrictList(type, keyword){

      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl + "houseinds";
      ajax(url, {
        method: 'Get',
        data: {
          para: type,
          keyword: keyword
        }
      }).then((res) => {
        _this.set("districts", res.data.attributes.houseinds);

      }).catch((err)=> {

      });

    },
    refresh(){
      this.send("getAreas");
    }
  }
});
