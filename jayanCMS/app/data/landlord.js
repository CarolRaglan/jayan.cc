export  default { //房东信息
  collect: [{ //房东的收租设置
    name: '提前日收租',
    code: 'advanced',
    unit: '天'
  }, {
    name: '固定交租日',
    code: 'fixed',
    unit: '日'
  }],
  frequency:[{  //房东的收租频率
    name:'月付',
    month:1
  },{
    name:'季付',
    month:3
  },{
    name:'半年付',
    month:6
  },{
    name:'年付',
    month:12
  },{
    name:'其它',
    specify:true,
    month:null
  } ],
  range:[{
    name:'一个月',
    month:1
  },{
    name:'三个月',
    month:3
  },{
    name:'半年',
    month:6
  },{
    name:'一年',
    month:12
  },{
    name:'两年',
    month:24
  }],
  chargeType:[{
    name:'固定每月收费',
    code:'fixed'
  }],
  waterChargeType:[{
    name:'固定每月收费',
    code:'fixed',
    unitTitle:'费用金额',
    unit:'元/月'
  },{
    name:'抄表收费',
    code:'by_meter',
    unitTitle:'单价',
    unit:'元/吨'
  }],
  gasChargeType:[{
    name:'固定每月收费',
    code:'fixed',
    unitTitle:'固定金额',
    unit:'元/月'
  },{
    name:'抄表收费',
    code:'by_meter',
    unitTitle:'单价',
    unit:'元/立方'
  }],
  powerChargeType:[{
    name:'固定每月收费',
    code:'fixed',
    unitTitle:'固定金额',
    unit:'元/月'
  },{
    name:'按表计算',
    code:'by_meter',
    unitTitle:'单价',
    unit:'元/度'
  },{
    name:'按预充值计算',
    code:'prepayment',
    unitTitle:'单价',
    unit:'元/度',
    smart:true
  }]
}
