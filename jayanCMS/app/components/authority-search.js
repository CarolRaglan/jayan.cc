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

  actions: {
    screen(){
      let keyword = this.$("#search").val();
      let created_at__gte = $("#created_at__gte").val();
      let created_at__lte = $("#created_at__lte").val();
      this.get("router").transitionTo({
        queryParams: {
          keyword: keyword,
          created_at__gte: created_at__gte,
          created_at__lte: created_at__lte
        }
      });
    },

    reset(){
      this.$('#authority-search').find('input').each(function () {
        $(this).val('').attr('data-value','');
      });
    },

    selectTime(){
      if(this.$('#created_at__gte').val()!='' && this.$('#created_at__lte').val()!=''){
        this.send('screen');
      }
    }

  }
});
