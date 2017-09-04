import Ember from 'ember';
import ajax from 'ic-ajax';
import moment from 'moment';
import fees from '../data/fees';  //费用类型的描述
import tenant from '../data/tenant';  //租客的描述
import landlord from '../data/landlord';  //房东的描述
import {clone, getPeriod,getGap} from '../utils/index';
import {validate} from '../utils/validator';

export default Ember.Component.extend({
  dateFormat:'YYYY-MM-DD',
  water_fees: false, //水费是否选中的标志，水费选中时，水费的计量部分会显示出来。
  power_fees: false, //电费是否选中的标志
  gas_fees: false,  //气费是否选中的标志
  property_fees: false,   //物业费
  service_fees: false,  //服务费
  cleaning_fees: false, //保洁费
  upkeep_fees: false, //维修费
  material_fees: false, //材料费
  catv_fees: false, //有线电视
  internet_fees: false, //宽带
  sanitation_fees: false, //卫生
  free_fees: false, //优惠
  other_fees: false,  //其它
  flag: false,  //是否分期
  isIgnore: false,  //是否忽略历史账单
  expandBasic: false, //是否展开基本信息部分
  expandExtras: false, //是否展开杂费部分
  processing:false,   //表单校验


  idAttachmentNum:0,
  contractAttachmentNum:0,

  contractTab: [{  //合同TAB头列表
    name: '普通合同',
    code:'normal',
    active: true
  }, {
    name: '分段合同',
    code:'segmented'
  }],
  protocol:{},

staged: Ember.computed('contractTab', function () { //合同是否是已分段的
    return this.get('contractTab')[1].active
  }),

  segment: [{    //分段合同的信息
    sequence: 1,
    id: 'a',
    rentRange: clone(landlord.range),
    rental: null,
    start: null,
    end: null,
    removable: false,
    complete: false,
    text: null
  }, {
    sequence: 2,
    id: 'b',
    rentRange: clone(landlord.range),
    rental: null,
    start: null,
    end: null,
    removable: false,
    complete: false,
    text: null
  }],

  collect: clone(landlord.collect), //房东收租方式列表（初始化用）
  //当前已选的房东收租方式  eg. 提前3天收租
  activeCollect: Ember.computed('collect','room.contract.rent_pay_way', function () {
    let list = this.get('collect').toArray();
    let code = this.get('room.contract.rent_pay_way');
    return list.find(it => it.active) || list.find(it=>it.code===code) ||list[0];
  }),

  frequency: clone(landlord.frequency),  //房东的收租频率
  specifyFrequency: Ember.computed('frequency', function () { //指定的其它收租频率
    let specify = this.get('frequency').toArray().find(it => it.specify);
    let month = specify.active ? specify.month : null;
    return month;
  }),

  chargeType: clone(landlord.chargeType), //收费方式（初始化用）
  waterChargeType: clone(landlord.waterChargeType), //水费的收费方式
  //当前已选的水费收费方式 eg. 按固定费用
  activeWaterChargeType: Ember.computed('waterChargeType', function () {
    let list = this.get('waterChargeType').toArray();
    return list.find(it => it.active) || list[0];
  }),

  gasChargeType: clone(landlord.gasChargeType), //水费的收费方式
  activeGasChargeType: Ember.computed('gasChargeType', function () {  //当前已选的水费收费方式 eg. 按固定费用
    let list = this.get('gasChargeType').toArray();
    return list.find(it => it.active) || list[0];
  }),

  powerChargeType: Ember.computed('room', function () {
    let smart = this.get('room.smart_device');
    return clone(landlord.powerChargeType).filter(it=> (smart && smart.length>0) ? it.smart:!it.smart);
  }),
  activePowerChargeType: Ember.computed('powerChargeType', function () {
    let type = this.get('room.contract.meter_info.power_charge');
    let list = this.get('powerChargeType').toArray();
    if (type) {
      return list.find(it => it.code == type);
    } else {
      return list.find(it => it.active) || list[0];
    }
  }),


  idType: clone(tenant.idType),  //证件类型列表（初始化用）
  activeIdType:Ember.computed('idType','room.contract.customer_id_type',function () {
    let activeCode = this.get('room.contract.customer_id_type');
    let list =  this.get('idType');
    return list.find(it=>it.active) || list.find(it=>it.code===activeCode) || list[0];
  }),
  extra: clone(fees.extra),  //费用类型列表(初始化用）

  rentRange:{
    list:clone(landlord.range),
    start:null,
    end:null,
    complete:false,
    text:null,
  },
  rental:{   //普通合同 租金
    unit:null,
    amount:null
  },

  hasRoom: Ember.computed('room.room.id', function () { //是否有房间信息
    return !!this.get('room.room.id');
  }),

  renew: Ember.computed('room.contract.customer_name', function () {  //是否有租客
    return !!this.get('room.contract.customer_name');
  }),

  typeObserver: Ember.observer("refresh", function () {
    if(!this.get('refresh')){
      return;
    }
    let room = this.get('room');
    let contract = room.contract ||{};
    let renew = contract.customer_name;
    if(renew && contract.is_loan){
      this.set('flag',true);
      this.set('expandBasic',true);
    }else{
      this.set('expandBasic',false);
    }

    let start = null;
    let format = this.get('dateFormat');
    let range = this.get('rentRange');
    let firstSegment = this.get('segment').toArray()[0];
    if(renew){
      start = moment(contract.end_time,format).add(1,'day').format(format);
    }else{
      start = moment().format(format);
    }
    Ember.set(range,'start',start);
    Ember.set(firstSegment,'start',start);
    let roomRental = this.get('room.contract.month_rental');
    let rental = this.get('rental');
    if(roomRental){
      Ember.set(rental,'unit',roomRental);
    }
    let extra = this.get('extra');
    let meterInfo = contract.meter_info;
    let hasExtras = extra.map(it=>{
      let hasExtra = false;
      if(meterInfo){
        let chargeType = meterInfo[it.type+'_charge'];
        let fee = meterInfo[it.type+'_fees'];
        if(fee>0 || chargeType=='by_meter'){
          hasExtra = true;
          Ember.set(it,'checked',true);
          this.set(it.code,true);
        }
      }
      return hasExtra;
    }).find(hasExtra=>hasExtra);
    this.set('expandExtras',hasExtras);
    this.$('.xsd-modal-body').scrollTop(0);
    let smart = room.smart_device;
    let powerChargeType= clone(landlord.powerChargeType).filter(it=> (smart && smart.length>0) ? it.smart:!it.smart);
    this.set('powerChargeType',powerChargeType);

  }),

  v: { //校验规则集合
    tenantName: {
      required: true,
      input: 'customer_name',
      name: '租客姓名'
    },
    tenantMobile: {
      depends:'flag',
      need:({flag})=>flag,
      required:true,
      mobile: true,
      input: 'customer_phone',
      name: '手机号码'
    },
    tenantCardID:{
      depends:['flag','activeIdType'],
      need:({flag})=>flag,
      required:true,
      cardID:({activeIdType},{reg,input})=>{
        if(activeIdType.code==='id'){
          return reg.test(input);
        }else{
          return true;
        }
      },
      name:'证件号码',
      input:'customer_id_number',
    },
    rentRange:{
      depends:['staged','rentRange','segment'],
      customizeTip:({staged})=>staged,  //有条件的自定义tip
      required( {staged,rentRange,segment},{tips} ){
        if(staged){ //分段合同
          return segment.map(it=>{
            if( it.start && it.end ){
              return true;
            }else{
              Ember.set(it,'rangeError',true);
              Ember.set(it,'rangeTips',tips);
              return false;
            }
          }).every(valid=>valid);
        }else{  //普通合同
          return rentRange.start && rentRange.end;
        }
      },
      // 如果仅靠depends描述的依赖项就可以完成校验，则不必传input
      name:'租赁时间'
    },
    rental:{
      depends:['staged','segment'],
      customizeTip:({staged})=>staged,
      required:({staged,segment},{input,tips})=>{
        if(staged){
          return segment.map(it=>{
            if(!it.rental){
              Ember.set(it,'rentalError',true);
              Ember.set(it,'rentalTips',tips);
            }
            return !!it.rental;
          }).every(valid=>valid);
        }else{
          return input;
        }
      },
      RMB:true,
      input:'month_rental',
      name:'租金'
    },
    deposit:{
      required:true,
      RMB:true,
      input:'deposit',
      name:'押金'
    },
    frequency:{
      depends:['frequency'],
      required:({frequency})=>{
        let active = frequency.find(it=>it.active);
        return active && active.month && active.month>0;
      },
      name:'支付方式'
    },
    collect:{
      depends:'activeCollect',
      required:true,
      numeric:[0,30],
      input:'collect_days',
      name:({activeCollect})=>activeCollect.name
    }

  },



  actions: {

    //切换“是否需要忽略历史账单”筛选框
    toggleIgnore(ignore){
      this.set("isIgnore", !ignore);
    },
    signSwitch(){
      $(".sign-state").toggleClass("sign_bg").children(".active").removeClass("active").siblings().addClass("active");
    },

    onCloseModal(){
      this.set('isIgnore',false);
      this.$('[name=ignoreTime]').val('');
      let v = this.get('v');
      let rentRange = this.get('rentRange');
      let rental = this.get('rental');
      let frequency = this.get('frequency');
      let collect = this.get('collect');
      Object.keys(v).forEach(key=>{
        if(v[key].on){
          Ember.set(v[key],'on',false);
          Ember.set(v[key],'tips',null);
        }
        if(v[key].value){
          Ember.set(v[key],'value',null);
        }
      });
      Ember.set(rentRange,'start',null);
      Ember.set(rentRange,'end',null);
      Ember.set(rentRange,'complete',false);
      Ember.set(rentRange,'text',null);
      Ember.set(rental,'unit',null);
      Ember.set(rental,'amount',null);
      frequency = frequency.map(it=>{
        if(it.active){
          Ember.set(it,'active',false);
        }
        return it;
      });
      this.set('frequency',frequency);
      collect = collect.map(it=>{
        if(it.active){
          Ember.set(it,'active',false);
        }
        return it;
      });
      this.set('collect',collect);
      let extra = this.get('extra');
      extra.forEach(it=>{
        if(it.checked){
          Ember.set(it,'checked',false);
          this.set(it.code,false);
          this.$(`[name=${it.code}]`).val('');
          if(it.code=='water_fees'){
            this.$('[name=water_meter_current]').val('');
            this.$('[name=water_meter_time]').val('');
          }
          if(it.code=='gas_fees'){
            this.$('[name=gas_meter_current]').val('');
            this.$('[name=gas_meter_time]').val('');
          }
          if(it.code=='power_fees'){
            this.$('[name=power_meter_current]').val('');
            this.$('[name=power_meter_time]').val('');
          }
        }
      });
      let waterChargeType = this.get('waterChargeType').toArray();
      let powerChargeType = this.get('powerChargeType').toArray();
      let gasChargeType = this.get('gasChargeType').toArray();
      waterChargeType = waterChargeType.map(it=>{
        if(it.active){
          Ember.set(it,'active',false);
        }
        return it;
      });
      gasChargeType = gasChargeType.map(it=>{
        if(it.active){
          Ember.set(it,'active',false);
        }
        return it;
      });
      powerChargeType = powerChargeType.map(it=>{
        if(it.active){
          Ember.set(it,'active',false);
        }
        return it;
      });
      this.set('waterChargeType',waterChargeType);
      this.set('powerChargeType',powerChargeType);
      this.set('gasChargeType',gasChargeType);

      this.set('expandExtras',false);
      this.set('flag',false);
      this.$('[name=month_rental]').val('');
    },

    //切换伸缩面板的伸缩状态
    toggle(key){
      this.toggleProperty(key);
      if(key==='flag' && this.get(key)){
        this.set('expandBasic',true);
        let range = this.get('rentRange');
        let rental = this.get('rental');
        let start = range.start;
        let format = this.get('dateFormat');
        let end = moment(start,format).add(12,'month').subtract(1,'day').format(format);
        Ember.set(range,'end',end);
        let period = getPeriod(range.start, range.end, format);
        Ember.set(range,'text',period);
        Ember.set(range,'complete',true);
        if(rental.unit){
          let gap = getGap(range.start,range.end,format);
          let amount = 0;
          amount += gap.year*12*rental.unit;
          amount += gap.month*rental.unit;
          amount += gap.day*rental.unit/30;
          Ember.set(rental,'amount',amount.toFixed(2));
        }
      }
    },

    //清除input输入框组上的错误提示
    clearTips(it){
      if( it && it.on ){
        Ember.set(it, 'on', false);
        Ember.set(it, 'text', null);
      }
    },

    //设置租赁时间(普通合同)
    setRentRange(it){
      if(this.get('flag')){
        return; //分期只限定为一年，不能自定义租赁时间
      }
      let range = this.get('rentRange');
      let format = this.get('dateFormat');
      let end = moment(range.start,format).add(it.month,'month').subtract(1,'day').format(format);
      Ember.set(range,'end',end);
    },

    //设置租赁的开始时间或者结束时间 (普通合同)
    setRentPoint(type, e){
      let input = $(e.target).val();
      let range = this.get('rentRange');
      let rental = this.get('rental');
      let format = this.get('dateFormat');
      let flag  = this.get('flag');
      if (!input) {
        return;
      }
      if(flag && type=='start'){
        let end = moment(input,format).add(12,'month').subtract(1,'day').format(format);
        Ember.set(range,'end',end);
      }
      if(range[type]!=input){
        Ember.set(range,type,input);
      }
      if(range.start && range.end ){
        let period = getPeriod(range.start, range.end, format);
        Ember.set(range,'text',period);
        Ember.set(range,'complete',true);
        if(rental.unit){
          let gap = getGap(range.start,range.end,format);
          let amount = 0;
          amount += gap.year*12*rental.unit;
          amount += gap.month*rental.unit;
          amount += gap.day*rental.unit/30;
          Ember.set(rental,'amount',amount.toFixed(2));
        }
      }
      this.send('clearTips',this.get('v.rentRange'));
    },

    setRental(e){
      let input = $(e.target).val();
      let range = this.get('rentRange');
      let rental = this.get('rental');
      let format = this.get('dateFormat');
      if(range.start && range.end && input && rental.unit!=input){
        input = parseFloat(input);
        if(isNaN(input)){
          let v = this.get('v');
          Ember.set(v.rental,'on',true);
          Ember.set(v.rental,'tips','租金格式不正确');
          return;
        }
        Ember.set(rental,'unit',input);
        input = parseInt(input*100);
        let gap = getGap(range.start,range.end,format);
        let amount = 0;
        amount += gap.year*12*input;
        amount += gap.month*input;
        amount += gap.day*input/30;
        amount = amount / 100;
        Ember.set(rental,'amount',amount.toFixed(2));
      }else{
        Ember.set(rental,'amount',null);
      }
    },

    //设置一段租赁的时间范围(分段合同)
    setSegmentRange(id, range){
      let list = this.get('segment').toArray();
      let format = this.get('dateFormat');
      let group = list.find(it => it.id === id);
      let end = moment(group.start,format).add(range.month,'month').subtract(1,'day').format(format);
      Ember.set(group,'end',end);
    },

    //设置一段租赁的开始时间或者结束时间 (分段合同)
    setSegmentPoint(id, type, e) {
      let list = this.get('segment').toArray();
      let format = this.get('dateFormat');
      let group = list.find(it => it.id === id);
      let input = $(e.target).val();
      if (!input) {
        return;
      }
      Ember.set(group,type,input);
      if (group.start && group.end) {
        if( moment(group.start,format).isAfter(moment(group.end,format)) ){
          Ember.set(group, type, '');
          Ember.set(group,'rangeError',true);
          Ember.set(group,'rangeTips','开始日期不能大于结束日期');
          return;
        }
        let period = getPeriod(group.start, group.end, format);
        Ember.set(group, 'text', period);
        Ember.set(group, 'complete', true);
        let rental = group.rental;
        if(rental){
          rental = parseInt(rental*100);
          let gap = getGap(group.start,group.end,format);
          let amount = 0;
          amount += gap.year*12*rental;
          amount += gap.month*rental;
          amount += gap.day*rental/30;
          amount = amount / 100;
          Ember.set(group,'amount',amount.toFixed(2));
        }
      }
      if(group.rangeError){
        Ember.set(group,'rangeError',false);
      }
      let sequence = group.sequence;
      let prevGroup = list.find(it=>it.sequence===sequence-1);
      let nextGroup = list.find(it=>it.sequence===sequence+1);
      if(type==='start' && prevGroup){
        Ember.set(prevGroup,'end',moment(input,format).subtract(1,'day').format(format));
      }
      if(type==='end' && nextGroup){
        Ember.set(nextGroup,'start',moment(input,format).add(1,'day').format(format));
      }
    },

    //设置每个合同分组的租金
    setSegmentRental(id,e){
      let input = $(e.target).val();
      let list = this.get('segment').toArray();
      let group = list.find(it=>it.id===id);
      let format = this.get('dateFormat');
      Ember.set(group,'rental',input);
      if(input){
        input = parseFloat(input);
        if(isNaN(input)){
          Ember.set(group,'rentalError',true);
          Ember.set(group,'rentalTips','租金输入错误');
          return;
        }
        input = parseInt(input*100);
        if(group.start && group.end){
          let gap = getGap(group.start,group.end,format);
          let amount = 0;
          amount += gap.year*12*input;
          amount += gap.month*input;
          amount += gap.day*input/30;
          amount = amount / 100;
          Ember.set(group,'amount',amount.toFixed(2));
        }
      }else{
        Ember.set(group,'amount',null);
      }
      if(group.rentalError){
        Ember.set(group,'rentalError',false);
        Ember.set(group,'rentalTips',null);
      }
    },

    //切换tab头
    toggleTab(cu){
      if (this.get('flag') && cu.code == 'segmented') {
        $.toastr.error("分段合同不支持租客分期!")
        return false;
      }
      let list = this.get('contractTab').toArray();
      list = list.map(it => {
        if (it.name == cu.name) {
          Ember.set(it, 'active', true);
        } else {
          if (it.active) {
            Ember.set(it, 'active', false);
          }
        }
        return it;
      });
      this.set('contractTab', list);
    },

    //切换房租的支付频率
    switchFrequency(cu) {
      let list = this.get('frequency');
      list = list.map(it => {
        if (cu.name == it.name) {
          Ember.set(it, 'active', true);
        } else {
          if (it.active) {
            Ember.set(it, 'active', false);
          }
          if (it.specify) {
            Ember.set(it, 'month', null);
          }
        }
        return it;
      });
      this.set('frequency', list);
      let v = this.get('v.frequency');
      if(v.on){
        this.send('clearTips',v);
      }
    },

    //设置指定的收租频率
    setFrequency(e){
      let frequency = parseInt($(e.target).val());
      if (isNaN(frequency)) {
        frequency = 0;
      }
      let list = this.get('frequency');
      list = list.map(it => {
        if (it.specify) {
          Ember.set(it, 'active', true);
          Ember.set(it, 'month', frequency);
        } else {
          Ember.set(it, 'active', false);
        }
        return it;
      });
      this.set('frequency', list);
    },

    //搜索房间信息
    search(e){
      let keyword = $(e.target).val();
      let _this = this;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiUrl1 + "house/search";
      ajax(url, {
        method: 'Get',
        data: {
          "area": keyword
        }
      }).then((res) => {

        _this.set("lists", res.data);
        _this.$(".area_list").show();

      }).catch((err) => {
        $.toastr.error("获取列表失败！");
      });
    },


    setCardID(info){
      let list = this.get('idType').toArray();
      list = list.map(it=>{
        if(it.code==info.code){
          Ember.set(it,'active',true);
        }else if(it.active){
          Ember.set(it,'active',false);
        }
        return it;
      });
      this.set('idType',list);
    },
    save(renew){
      this.set('processing',true);

      //校验
      if ( !validate({ctx:this,rules: this.get('v')}) ) {
        return;
      }

      let roomId = this.get('room.room.id');

      //租期、租金计算
      let start,end,rental;
      let staged = this.get('staged');
      let segment = this.get('segment').toArray();
      let range = this.get('rentRange');
      let v = this.get('v');
      if(staged){
        start = [];
        end = [];
        rental = [];
        segment.forEach(it=>{
          rental.push(it.rental);
          start.push(it.start);
          end.push(it.end);
        });
        start = start.join(',');
        end = end.join(',');
        rental = rental.join(',')
      }else{
        start = range.start;
        end = range.end;
        rental =  v.rental.value;
      }

      let idType = this.get('activeIdType');
      let collect = this.get('activeCollect');
      let frequencyItem = this.get('frequency').toArray().find(it=>it.active);
      let frequency = frequencyItem ? frequencyItem.month : this.get('specifyFrequency');
      let waterChargeType = this.get('activeWaterChargeType');
      let powerChargeType = this.get('activePowerChargeType');
      let gasChargeType = this.get('activeGasChargeType');
      let signed=$(".sign-state").children(".active").attr("data-value");

      let data={
        rent_pay_way: collect.code, //收租方式，advanced：提前收租， fixed：固定日期
        start_time: start,  //合同开始时间，如有分段使用","分割
        end_time: end,    //合同结束时间，如有分段使用","分割
        month_rental: rental, //月租金，如有分段使用","分割
        pay_days:this.$('[name=collect_days]').val(),
        deposit: v.deposit.value,
        pay_method_f:frequency,  //房租支付方式，月付，季付，年付等，表示月数，取值范围1-12
        signed:signed,
        customer_id_pictures:this.$("#customer_id_pictures").val(), //证件附件
        pictures:this.$("#pictures").val(), //合同附件
        comments:this.$("#comments").val(), //合同备注
      };

      'property,service,cleaning,upkeep,material,catv,internet,sanitation,free,other'.split(',').forEach(type=>{
        let fee = type+'_fees', charge = type+'_charge';
        if(this.get(fee)){
          data[fee] = this.$(`[name=${fee}]`).val();
          data[charge] = 'fixed';
        }else{
          data[fee] = 0;
        }
      });



      let isIgnore = this.get('isIgnore');
      if(isIgnore){
        data.ignore_time = this.$('[name=ignoreTime]').val();
      }


      //水费
      if(this.get('water_fees')){
        data.water_charge = waterChargeType.code;
        switch(waterChargeType.code){
          case 'by_meter':
            data.water_unit_price = this.$('[name=water_fees]').val();
            data.water_meter_current = this.$('[name=water_meter_current]').val();
            data.water_meter_time = this.$('[name=water_meter_time]').val();
            break;
          case 'fixed':
          case 'one-off':
            data.water_fees = this.$('[name=water_fees]').val();
        }
      }else{
        data.water_fees = 0;
      }

      //电费
      if(this.get('power_fees')){
        data.power_charge = powerChargeType.code;
        switch(powerChargeType.code){
          case 'by_meter':
            data.power_unit_price = this.$('[name=power_fees]').val();
            data.power_meter_current = this.$('[name=power_meter_current]').val();
            data.power_meter_time = this.$('[name=power_meter_time]').val();
            break;
          case 'prepayment':
            data.power_unit_price = this.$('[name=power_fees]').val();
            break;
          case 'fixed':
          case 'one-off':
            data.power_fees = this.$('[name=power_fees]').val();
        }
      }else{
        data.power_fees = 0;
      }

      //气费
      if(this.get('gas_fees')){
        data.gas_charge = gasChargeType.code;
        switch(gasChargeType.code){
          case 'by_meter':
            data.gas_unit_price = this.$('[name=gas_fees]').val();
            data.gas_meter_current = this.$('[name=gas_meter_current]').val();
            data.gas_meter_time = this.$('[name=gas_meter_time]').val();
            break;
          case 'fixed':
          case 'one-off':
            data.gas_fees = this.$('[name=water_fees]').val();
        }
      }else{
        data.gas_fees = 0;
      }

      if (renew) {
        data.contract_type = 2;
        data.contract_id = this.get('room.contract.id'), //合同编号
          this.get('auth').registerTokenToAjaxHeader();
        let url = this.get("config").apiUrl + "contractrenews";
        ajax(url, {
          method: 'Post',
          data: data
        }).then((res) => {
          $.toastr.success("续租成功！");
          this.$(".xsd-modal-close").click();
          this.sendAction("updateStatus", roomId, "room");
          this.sendAction('houseReload');
        }).catch((err) => {
          $.toastr.error("续租失败！");
        });

      } else {  //新增合同
        data.room = this.get('room.room.id');
        data.customer_name = v.tenantName.value;  //租客姓名
        data.customer_phone = v.tenantMobile.value; //租客手机号
        data.customer_id_type = idType.code;   //租客证件类型，id：身份证，passport：护照
        data.customer_id_number = this.$('[name=customer_id_number]').val(); //租客证件号
        data.is_installment = this.get('flag') ? 1 : 0 ; //租客是否分期

        this.get('auth').registerTokenToAjaxHeader();
        ajax(this.get("config").apiUrl + "roomcontracts", {
          method: 'Post',
          data: data
        }).then((res) => {
          $.toastr.success("录入成功！");
          this.$(".xsd-modal-close").eq(0).click();
          this.sendAction("updateStatus", roomId, "room");
          this.sendAction('houseReload');
          //防止重复提交
          this.set("processing", false);
        }).catch((err) => {
          $.toastr.error(err.jqXHR.responseJSON.errors.detail);
          //防止重复提交
          this.set("processing", false);
        });

      }
    },

    toggleWaterChargeType(type){  //切换水费收费类型
      let list = this.get('waterChargeType').toArray();
      list = list.map(it => {
        it.active = type.code === it.code;
        return it;
      });
      this.set('waterChargeType', list);
    },

    togglePowerChargeType(type){  //切换电费收费类型
      let list = this.get('powerChargeType').toArray();
      list = list.map(it => {
        it.active = type.code === it.code;
        return it;
      });
      this.set('powerChargeType', list);
    },

    toggleGasChargeType(type){  //切换气费收费类型
      let list = this.get('gasChargeType').toArray();
      list = list.map(it => {
        it.active = type.code === it.code;
        return it;
      });
      this.set('gasChargeType', list);
    },

    toggleFee(fee){
      let checked = !fee.checked;
      Ember.set(fee,'checked',checked);
      this.set(fee.code, checked);
    },

    addSegment(){  //新增分段
      let list = this.get('segment').toArray();
      let item = {
        rentRange: clone(landlord.range),
        rental: null,
        start: null,
        end: null,
        specify: false,
        complete: false,
        text: null
      };
      item.sequence = list.length + 1;
      item.id = Math.random() * 1e16;
      item.removable = item.sequence >= 3;
      item.start = list[list.length-1].start;
      list.push(item);
      this.set('segment', list);
    },

    removeSegment(id){ //删除分段
      let list = this.get('segment').toArray();
      list = list.filter(it => it.id !== id);
      let seq = 0;
      let prevEnd = null;
      list = list.map((it,index) => {
        seq += 1;
        if(index>0){
          Ember.set(it,'start',prevEnd);
        }
        prevEnd = it.end;
        Ember.set(it, 'sequence', seq);
        return it;
      });
      this.set('segment', list);
    },

    //切换收租方式
    toggleCollect(on){
      let list = this.get('collect').toArray();
      list = list.map(it => {
        it.active = on.name === it.name;
        return it;
      });
      this.set('collect', list);
    },

    setImgLength(key,pictures){
      this.set(key,pictures.length);
    },
    preview(id,address){
      let protocol={};
      let customer_name=this.$("input[name='customer_name']").val();
      let rent=this.$("input[name='month_rental']").val()==""?0:this.$("input[name='month_rental']").val();
      let capitalAmount=number_chinese(rent);
      let deposit=this.$("input[name='deposit']").val()==""?0:this.$("input[name='deposit']").val();
      let capitalDeposit=number_chinese(deposit);
      let pay_way=this.$("input[name='rent_pay_way']").val()=='提前日收租'?"advanced":"fixed";
      let pay_day=this.$("input[name='collect_days']").val()==""?0:this.$("input[name='collect_days']").val();
      let created_at=moment().format('YYYY年MM月DD日');
      let range = this.get('rentRange');
      if(range.start){

        let proStart=range.start.split("-");
        protocol.start_year=proStart[0];
        protocol.start_month=proStart[1];
        protocol.start_day=proStart[2];

      }
      if(range.end){

        let proEnd=range.end.split("-");
        protocol.end_year=proEnd[0];
        protocol.end_month=proEnd[1];
        protocol.end_day=proEnd[2];

      }
      protocol.yi_fang_name=customer_name;
      protocol.rental=rent;
      protocol.chinese_rental=capitalAmount;
      protocol.deposit=deposit;
      protocol.chinese_deposit=capitalDeposit;
      protocol.rent_pay_way=pay_way;
      protocol.fixed_pay_date=pay_day;
      protocol.contract_created_at=created_at;
      protocol.address=address;
      this.get('auth').registerTokenToAjaxHeader();
      let url = this.get("config").apiHost + "/internal/api/signed_content?room_id="+id;
      ajax(url, {
        method: 'GET'
      }).then((res) => {
        protocol.jia_fang_name=res.jia_fang_name;
        protocol.space=res.space;
        this.set("protocol",protocol);
      }).catch((err)=> {
        this.set("protocol",protocol);
      });
      // let segmented = this.get('segment');
      // console.log(1)
      // console.log(segmented);
      // console.log(this.get('rentRange'));
      // console.log(this.get('rented'));
      // console.log(this.get('segmented'));
      // let rental = this.$("input[name='month_rental']");
      // console.log(rental.length);
      // let staged = this.get('staged');
      // let segment = this.get('segment').toArray();
      // let range = this.get('rentRange');
      // console.log(staged);
      // console.log(segment);
      // console.log(range);
      // console.log(2)



    }

  }




});

function number_chinese(n) {
  var fraction = ['角', '分'];
  var digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ];
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  var head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  var s = '';
  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');

}
