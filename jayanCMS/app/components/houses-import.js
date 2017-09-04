import Ember from 'ember';

export default Ember.Component.extend({
  flag:"step1",
  btnFlag:false,
  verify:false,
  importData:"",
  ImportSuccess:false,
  Tooltip:"",
  didInsertElement:function () {

    // $("#housesImport").on("click",".xsd-modal-close",function () {
    //   $("#housesImport_step1").show();
    //   $("#housesImport_step2").hide();
    //   $("#housesImport_step3").hide();
    // });

    let url= this.get("config").apiUrl1 + "contract/import";
    let token={"token":this.get("auth").authToken.access_token};
    let _this=this;
    $('#house_excel').uploadifive({
      buttonText      : '上传附件并验证',
      auto             : true,
      buttonCursor    : 'hand',
      fileSizeLimit   : '4MB',
      method           : "Post",
      multi            : false,
      width            : 100,
      height           : 30,
      uploadScript    : url,
      fileType         : false,
      fileObjName     : "contract_file",
      formData         : token,

      onSelect : function(queue) {
        if(file.name.indexOf(".xls")==-1){

          _this.set("Tooltip","* 请上传excel格式附件!");
          return false;
        }

        $("#fileName").text(file.name);
        $("#housesImport_step1").hide();
        $("#housesImport_step3").hide();
        $("#housesImport_step2").show();

      },

      onUpload: function(file, e){

        if(file==0||$("#fileName").text()==""){
          // _this.set("Tooltip","* 请先上传附件!");
          return false;
        }

      },

      onError : function(errorType) {
        _this.set("Tooltip",'* 上传错误: ' + errorType);
        // $.toastr.error('上传错误: ' + errorType);
        $("#housesImport_step1").hide();
        $("#housesImport_step3").show();
        $("#housesImport_step2").hide();

      },

      onUploadComplete : function(file, data1) {
        $("#housesImport_step2").hide();
        $("#btnFlag").show();
        let data=JSON.parse(data1);
        if(data.download_url!=""){

          data.download_url=_this.get("config").apiUrl1+data.download_url;

        }

        _this.set("importData",data);

        if(data.status==true){
          $("#housesImport_step5").show();

          setTimeout(switchStep,500);
          function switchStep () {
            $("#housesImport_step5").hide();
            $("#housesImport_step1").hide();
            if(data.error_count!=0){

              $("#housesImport_step4").show();

            }else{

              $("#housesImport_step3").hide();
              _this.set("ImportSuccess",true);
              _this.set("verify",true);

            }


          }

          _this.sendAction("houseReload");
          _this.set("Tooltip","");
          // $("#housesImport .xsd-modal-header .xsd-modal-close").trigger("click");
        }else{
          // $.toastr.error(data.msg);
          _this.set("Tooltip","* "+data.msg);
          $("#btnFlag").hide();
          $("#housesImport_step3").show();
          $("#housesImport_step1").hide();
          $("#housesImport_step2").hide();
        }

      }
    });

  },

  actions:{

    importHouses(){

      $('#house_excel').uploadifive('upload');
      $("#housesImport_step3").show();
      $("#housesImport_step1").hide();


    },
    reHouses(){

      this.set("Tooltip","");
      this.set("ImportSuccess",false);
      $("#btnFlag").hide();
      $("#housesImport_step1").show();
      $("#housesImport_step2").hide();
      $("#housesImport_step3").hide();
      $("#housesImport_step4").hide();
      $("#fileName").text("");
      this.set("importData.error_count","");

    }
  }
});
