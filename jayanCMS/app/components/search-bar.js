/*
 * 书写人:jo.li
 * 说明:筛选组件代码
 * */
import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({

  areas: "",
  districts: "",
  blocks: "",
  houses: "",
  feeType: true,
  cityList: [],

  didInsertElement: function () {

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

  actions: {

    search(){

      let value = $("#search").val();
      this.get("router").transitionTo({
        queryParams: {
          keyword: value,
          city: "",
          district: "",
          block: "",
          area: "",
          house_id: "",
          filter1: "",
          filter2: "",
          trade_at__gte:"",
          trade_at__lte:"",
          sort: "",
          page: 1,
        }
      })

    },

    searchEmployer(e){

      let value = $("#search").val();
      this.get("router").transitionTo({
        queryParams: {
          keyword: value,
          created_at__gte: "",
          created_at__lte: ""
        }
      })
    },

    selectCity(type, keyword, data){

      let city = $("#citySearch").val("");
      let district = $("#district").val("");
      let block = $("#block").val("");
      let area = $("#area").val("");
      let houseText = $("#house_id").val("");
      this.send("getList", type, keyword, data);
    },

    selectArea(type, keyword, data){

      this.send("getList", type, keyword, data);
    },

    getList(type, keyword, data){

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
        _this.set(data, res.data.attributes.houseinds);

      }).catch((err)=> {

      });

    },

    screen(e){

      let type = $(e.target).attr("type");
      let tips = $(e.target).attr("tips");

      switch (type) {

        case "rent":
        {

          let city = $("#citySearch").attr("data-value");
          let district = $("#district").val() == "所有区域" ? "" : $("#district").val();
          let block = $("#block").val() == "所有板块" ? "" : $("#block").val();
          let area = $("#area").val() == "所有小区" ? "" : $("#area").val();
          let house_id = $("#house_id").attr("data-value");

          if (tips != "spread") {

            let filter1 = $("#filter1").attr("data-value");
            let filter2 = $("#filter2").attr("data-value");
            this.get("router").transitionTo({
              queryParams: {
                keyword: "",
                city: city,
                district: district,
                block: block,
                area: area,
                house_id: house_id,
                filter1: filter1,
                filter2: filter2,
                page: 1,
              }
            });
          } else {

            let is_whole = $("#filter1").attr("data-value");
            this.get("router").transitionTo({
              queryParams: {
                keyword: "",
                city: city,
                district: district,
                block: block,
                area: area,
                house_num: house_id,
                is_whole: is_whole,
                page: 1,
              }
            });

          }
          return;
        }
          ;

        case "authority":
        {

          let created_at__gte = $("#created_at__gte").val();
          let created_at__lte = $("#created_at__lte").val();
          this.get("router").transitionTo({
            queryParams: {
              keyword: "",
              created_at__gte: created_at__gte,
              created_at__lte: created_at__lte
            }
          });

          return;

        };
        case "finance":
        {

          let district = $("#district").val();
          let block = $("#block").val();
          let area = $("#area").val();
          let houseText = $("#house_id").val();
          let house_id = $("#house_id").attr("data-value");
          let trade_at__gte = $("#trade_at__gte").val();
          let trade_at__lte = $("#trade_at__lte").val();
          let fee_type_rough = $("#fee_type_rough").attr("data-value");
          let fee_type = $("#s_fee_type").attr("data-value");
          let flow_type = $("#s_flow_type").attr("data-value");
          if (this.get("preFlag")) {
            this.get("router").transitionTo({
              queryParams: {
                keyword: "",
                trade_at__gte: trade_at__gte,
                trade_at__lte: trade_at__lte,
                page: 1,
              }
            });
          } else {
            this.get("router").transitionTo({
              queryParams: {
                keyword: "",
                district: district,
                block: block,
                area: area,
                house_id: house_id,
                trade_at__gte: trade_at__gte,
                trade_at__lte: trade_at__lte,
                fee_type_rough: fee_type_rough,
                fee_type: fee_type,
                flow_type: flow_type,
                page: 1,
              }
            });
          }
          return;
        }
          ;
        case "message":
        {

          let created_at__gte = $("#x_created_at__gte").val();
          let created_at__lte = $("#x_created_at__lte").val();
          this.get("router").transitionTo({
            queryParams: {
              created_at__gte: created_at__gte,
              created_at__lte: created_at__lte,
              page: 1
            }
          });
          return;
        }

      }

    },

    selectType(flag){

      this.set("feeType", flag);
    },

    switchSideNav(route){
      this.get("router").transitionTo(route)
    }

  }
});
