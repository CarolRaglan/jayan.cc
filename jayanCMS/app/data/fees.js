export default {
  extra :[
    {name:'水费',code:'water_fees',type:'water',unit:'吨',basic:true},
    {name:'电费',code:'power_fees',type:'power',unit:'度',basic:true},
    {name:'燃气费',code:'gas_fees',type:'gas',unit:'立方',basic:true},
    {name:'物业费',code:'property_fees',type:'property'},
    {name:'服务费',code:'service_fees',type:'service'},
    {name:'保洁费',code:'cleaning_fees',type:'cleaning'},
    {name:'维修费',code:'upkeep_fees',type:'upkeep'},
    {name:'材料费',code:'material_fees',type:'material'},
    {name:'有线电视',code:'catv_fees',type:'catv'},
    {name:'宽带',code:'internet_fees',type:'internet'},
    {name:'卫生',code:'sanitation_fees',type:'sanitation'},
    {name:'优惠',code:'free_fees',type:'free'},
    {name:'其他',code:'other_fees',type:'other'}
  ],
  typeHash:{
    prepayment:'按预付费计费',
    fixed:'固定每月收费',
    by_meter:'按表收费'
  },
  predefine:[
    {name:'租金',type:'rental'},
    {name:'押金',type:'deposit'}
  ]
}
