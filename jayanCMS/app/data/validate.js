
export let type = { //type[key]={...}中，key不能是 name , need , input ,inputContext, depends
  required:{
    tips:({name})=>`${name}不能为空`,
    reg:/^.+$/,
    validate:({input,reg,set})=>{
      return input!=='' && input!==null && input!==undefined;
    }
  },
  mobile:{
    tips:({name})=>`${name}格式不正确`,
    reg:/^1[3,5,8,4,7]\d{9}$/
  },
  RMB:{
    tips:({name})=>`${name}只能是数字格式的人民币`,
    reg:/^(([1-9]\d*)|0)(\.\d{0,2})?$/
  },
  cardID:{
    tips:()=>`请输入正确的身份证号.`,
    reg:/(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  },
  numeric:{
    tips:({name,input,set})=>{
      let min,max;
      if(Array.isArray(set)){
        [min,max] = set;
      }else{
        ({min,max} = set);
      }
      return `${name}不能小于${min},不能大于${max}`;
    },
    validate:({input,set})=>{
      let min,max;
      if(Array.isArray(set)){
        [min,max] = set;
      }else{
        ({min,max} = set);
      }
      return input<=max && input>=min;

    }
  }
}
