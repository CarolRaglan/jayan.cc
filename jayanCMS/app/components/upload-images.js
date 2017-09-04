import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  maxSize:3,
  ids:Math.random(),
  pictures:Ember.computed('pic',function () {
    let list = this.get('pic');
    if(!list){
      return [];
    }
    list = list.split(';');
    return list.map(s=>{
      let [id,url] = s.split(',');
      return {id,url};
    });
  }),
  idLog:Ember.computed('pictures',function () {
    let list = this.get('pictures')||[];
    return list.map(it=>it.id).join(',');
  }),

  didInsertElement: function(){
    if(!this.hide) {
      this.$('#' + this.ids).uploadifive({
        buttonText: '<p class="iconfont button" style="color:rgba(78, 90, 102, 0.4);">&#xe6b8;</p><p>点击添加图片</p>',
        fileSizeLimit: '4MB',
        multi: true,
        width: 116,
        height: 30,
        uploadScript: config.apiHost + '/api/picture/image_upload/' + (this.type ? `?dir=${this.type}` : ''),
        fileType: ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'],
        onError: (errorType) => {
          $.toastr.error('上传图片错误: ' + errorType);
        },
        onUploadComplete: (file, data) => {
          data = JSON.parse(data);
          let pictures = this.get('pictures').toArray();
          let limit = this.get('maxSize');
          if (pictures.length >= limit) {
            $.toastr.error(`抱歉！照片不能多于${limit}张`);
            return;
          }
          let picture = {
            id: data.id,
            url: data.url
          };
          pictures.push(picture);
          this.set('pictures', pictures);
          this.sendAction('onSetNum', pictures);

        }
      });
    }
    let pictures = this.get('pictures');
    this.sendAction('onSetNum',this.get('pictures'));
  },

  actions:{
    remove(picture,e){
      let pictures = this.get('pictures').toArray();
      pictures = pictures.filter(it=>it.id!=picture.id);
      this.set('pictures',pictures);
      this.sendAction('onSetNum',pictures);
      e.preventDefault();
      e.stopPropagation();
    }
  }

});
