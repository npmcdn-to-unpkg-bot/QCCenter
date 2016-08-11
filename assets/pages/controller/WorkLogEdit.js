var worklogEdit = function() {
  function loadDefaultSettings() {
    //控件初始化
    iCheckBoxInit();
    initSelect2();


    var HelloButton = function(context) {
      // create button
      var button = ui.button({
        contents: '<i class="fa fa-child"/> Hello',
        tooltip: 'hello',
        click: function() {
          // invoke insertText method with 'hello' on editor module.
          context.invoke('editor.insertText', 'hello');
        }
      });
      return button.render(); // return button as jquery object
    }

    $('#ErrDesc').summernote({
      height: 300, // set editor height
      minHeight: null, // set minimum height of editor
      maxHeight: null, // set maximum height of editor
      focus: true, // set focus to editable area after initializing summernote
      lang: 'zh-CN',
      placeholder: '在这里填入机检日志信息',
      dialogsInBody: true,
      codemirror: { // codemirror options
        theme: 'rubyblue',
        //mode: 'text/html',
        mode: "htmlmixed",
        htmlMode: true,
        lineNumbers: true
      },
      dialogsFade: true,
      disableDragAndDrop: false,
      fontNames: ["Microsoft JhengHei", "微软雅黑", "Arial", "黑体", "sans-serif", "Arial Black", "Comic Sans MS", "Courier New", "Helvetica", "Impact", "Tahoma", "Times New Roman", "Verdana"],
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'hr', 'iFrame' /*'Frameo'*/ ]],
        ['insert', ['undo', 'redo']],
        ['view', ['fullscreen', 'codeview', 'help']],
      ],
      fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36', '48', '72'],
      tableClassName: 'table table-striped table-bordered table-hover',
      insertTableMaxSize: {
        col: 20,
        row: 30
      },
      /*help: {
        'insertParagraph': '插入段落',
        'undo': '撤销',
        'redo': '重做',
        'tab': '制表符',
        'untab': '返回制表符',
        'bold': '加粗',
        'italic': '斜体',
        'underline': '下划线',
        'strikethrough': '删除线',
        'removeFormat': '清除样式',
        'justifyLeft': '居左',
        'justifyCenter': '居中',
        'justifyRight': '居右',
        'justifyFull': '填满',
        'insertUnorderedList': '插入无序列表',
        'insertOrderedList': '插入有序列表',
        'outdent': '从左键入',
        'indent': '从右键入',
        'formatPara': '段落(p标签)',
        'formatH1': '一级标题',
        'formatH2': '二级标题',
        'formatH3': '三级标题',
        'formatH4': '四级标题',
        'formatH5': '五级标题',
        'formatH6': '六级标题',
        'insertHorizontalRule': '插入分割符',
        'linkDialog.show': '插入链接'
      }*/
    });

    $(".form_advance_datetime").datetimepicker({
      isRTL: App.isRTL(),
      format: "yyyy-mm-dd hh:ii",
      autoclose: true,
      todayBtn: true,
      startDate: "2016-01-01 00:00",
      pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
      minuteStep: 10,
      language: 'zh-CN'
    });

    initChecked();
    ReadLogSettings();
    RoundedTheme(0);
    HeadFix();
    //各控件设置初始值
    $("#today").text(today(0));
    SetiCheckChecked('proc_id', $('div[name="proc_id"]').data('proc'));
    //SetSingleiCheck('bReport', true);
    //初始化选择框数据
    resetSelectData();
    // resetErrDescSelectData();
    initDashboardDaterange('YYYY-MM-DD');
    $('input[name="process_time"]').val(today(3));
  }

  //载入历史信息时，接口信息的模式为2.用Data.data[0].keys取得对应的值

  function loadHisData(id) {
    var strUrl = getRootPath(1) + "/DataInterface/Api?Token=" + config.TOKEN + "&ID=42&M=0&id=" + id;
    var Data = ReadData(strUrl);

    //基础数据
    SetiCheckChecked('proc_id', Data.data[0].proc_id);
    SetiCheckChecked('class_id', Data.data[0].class_id);
    $('input[name="rec_user_name"]').val(Data.data[0].rec_user_name);
    //SetSingleiCheck('bReport', Data.data[0].bReport);
    SetSelect2Val('prod_id', Data.data[0].prod_id);
    SetSelect2Val('machine_id', Data.data[0].machine_id);

    //机检日志详细数据
    SetSelect2Val('proStatus_id', Data.data[0].proStatus_id);
    $('input[name="process_time"]').val(Data.data[0].process_time);
    $('input[name="prod_info"]').val(Data.data[0].prod_info);
    var oper_name = [];
    Data.data[0].oper_name.split(',').map(function(elem) {
      oper_name.push($("select[name='oper_name']").find('option:contains(' + elem + ')').val());
    });

    $("select[name='oper_name']").select2('val', oper_name);

    //SetSelect2Val('main_err', Data.data[0].main_err);
    //SetSelect2Val('sub_err', Data.data[0].sub_err);
    var usrName = $('input[name="rec_user_name"]').data('user');
    $('#ErrDesc').summernote('code', GBK2UTF(Data.data[0].ErrDesc) + '<p><div class="note note-info"><h4 class="block">' + usrName + '&nbsp;<small>' + today(3) + '&nbsp;:</small></h4><p><span style="font-size: 14px; line-height: 20px;">&nbsp;</span></p></div></p>');

    $('#Save').data('sn', Data.data[0]['id']);
    $('#Save').html($('#Save').html().replace('提交', '更新'));
  }

  function initChecked() {
    var iHours = new Date().getHours();
    if (iHours >= 0 && iHours < 8) { //夜班
      SetiCheckChecked('class_id', 2);
    } else if (iHours >= 8 && iHours < 16) { //白班
      SetiCheckChecked('class_id', 0);
    } else { //中班
      SetiCheckChecked('class_id', 1);
    }
  }

  //重置产品列表、设备列表
  function resetSelectData() {
    var str, str2, Data;
    var type = GetiCheckChecked('proc_id');
    switch (type) {
      case "0": //钞纸
        str = getRootPath(1) + "/DataInterface/Api?Token=" + config.TOKEN + "&ID=24&M=3";
        str2 = getRootPath(1) + "/DataInterface/Api?Token=" + config.TOKEN + "&ID=23&M=3";
        break;
      default:
        str = getRootPath(1) + "/DataInterface/Api?Token=" + config.TOKEN + "&ID=35&M=3";
        str2 = getRootPath(1) + "/DataInterface/Api?Token=" + config.TOKEN + "&ID=36&M=3&p=" + type;
        break;
    }

    Data = ReadData(str);
    InitSelect("prod_id", Data);

    Data = ReadData(str2);
    InitSelect("machine_id", Data);

    str = getRootPath(1) + "/DataInterface/Api?Token=" + config.TOKEN + "&ID=38&M=3&p=" + type;
    Data = ReadData(str);
    InitSelect("oper_name", Data);
  }

  //重置错误描述下拉选择框

  /*function resetErrDescSelectData() {
    var str, Data;
    str = getRootPath(1) + "/DataInterface/Api?Token=" + config.TOKEN + "&ID=39&M=3";
    Data = ReadData(str);
    InitSelect("main_err", Data);
  }

  $('select[name="main_err"]').on('change', function() {
    str = getRootPath(1) + "/DataInterface/Api?Token=" + config.TOKEN + "&ID=40&M=3&p=" + $(this).val();
    Data = ReadData(str);
    InitSelect("sub_err", Data);
  });*/

  //插入工作日志
  $("#Save").on('click', function() {
    var iData = {
      "tbl": TBL.WORK_LOG,
      "rec_time": today(1),
      "utf2gbk": ['oper_name', 'rec_user_name'], //, 'ErrDesc'
      "oper_name": GetSelect2Text('oper_name'),
      "proc_id": GetiCheckChecked('proc_id'),
      "class_id": GetiCheckChecked('class_id'),
      "rec_user_name": $('input[name="rec_user_name"]').val().trim(),
      //"bReport": !GetiCheckChecked('bReport') ? 1 : 0,
      "prod_id": $('select[name="prod_id"]').val(),
      "machine_id": $('select[name="machine_id"]').val(),
      "proStatus_id": $('select[name="proStatus_id"]').val(),
      "process_time": $('input[name="process_time"]').val(),
      "prod_info": $('input[name="prod_info"]').val(),
      //"main_err": $('select[name="main_err"]').val(),
      //"sub_err": $('select[name="sub_err"]').val(),
      "ErrDesc": UTF2GBK($('#ErrDesc').summernote('code'))
    };
    var strUrl = getRootPath() + "/DataInterface/insert";
    //更新数据
    if ((typeof $('#Save').data('sn')) != 'undefined') {
      strUrl = getRootPath() + "/DataInterface/update";
      iData.id = $('#Save').data('sn');
    }

    $.ajax({
      url: strUrl,
      type: 'POST',
      data: iData,
      success: function(data) {
        var obj = $.parseJSON(data);
        bsTips(obj.message, obj.type);
        $('#Reset').click();

        if ((typeof $('#Save').data('sn')) != 'undefined') {
          $('#Save').removeAttr('data-sn');
          $('#Save').html($('#Save').html().replace('更新', '提交'));
        }
      },
      error: function(data) {
        bsTips("日志添加失败，请稍后重试或联系管理员!", 0);
        infoTips(JSON.stringify(data));
      }
    });

  });

  //重置数据
  $(document).on('click', '#Reset', function() {
    ResetSelect2('prod_id');
    ResetSelect2('machine_id');
    //ResetSelect2('ProStatus');
    ResetSelect2('oper_name');
    //SetSelect2Val('main_err', -1);
    //ResetSelect2('sub_err');
    $('#ErrDesc').summernote('code', '');
    $('input[name="prod_info"]').val("");
    $('input[name="process_time"]').val("");
  });

  //保存设置
  $("#SaveSettings").on('click',
    function() {
      //获取各控制值
      var ProcID = $("#proc_id").val(); //关注工序
      var RefreshTime = $("#RefreshTime").val(); //轮询时间
      var AutoRefresh = ($("#AutoRefresh").bootstrapSwitch('state') === true) ? 1 : 0;
      var strUrl = getRootUrl('worklog') + "SaveLogQuerySettings";
      // infoTips(ProcID +"</br>"+NumsID +"</br>"+Status +"</br>"+RefreshTime+"</br>"+AutoRefresh,0);
      //获取各控制值完毕
      //向服务器请求数据
      $.post(strUrl, {
          ProcID: ProcID,
          RefreshTime: RefreshTime,
          AutoRefresh: AutoRefresh
        },
        function(data, status) {
          if (status == "success") {
            var obj = jQuery.parseJSON(data);
            infoTips(obj.message, 1);
          } else {
            infoTips("保存设置失败，请稍后重试或联系管理员!", 0);
          }
        }
      );
    });

  //保存设置
  function ReadLogSettings() {
    var strUrl = getRootUrl('worklog') + "ReadLogQuerySettings";
    $.ajax({
      type: 'POST',
      async: false,
      url: strUrl,
      success: function(data) {
        var strJSON = jQuery.parseJSON(data);
        var obj = strJSON.data[0];
        //设置控件初始值
        $("#proc_id").val(obj.ProcID); //关注工序
        $('div[name="proc_id"]').data('proc', obj.ProcID);
        $("#RefreshTime").val(obj.RefreshTime); //轮询时间
        if (obj.AutoRefresh === 0) $("#AutoRefresh").bootstrapSwitch('toggleState'); //如果需要关
      }
    });
  }

  return {
    init: function() {
      initDom();
      loadDefaultSettings();
      $('input[name="proc_id"]').on('ifChecked', function() {
        $('div[name="proc_id"]').data('proc', GetiCheckChecked('proc_id'));
        resetSelectData();
      });

      if (getUrlParam('ID')) {
        loadHisData(getUrlParam('ID'));
      }
    }
  };

}();


jQuery(document).ready(function() {
  UIIdleTimeout.init();
  worklogEdit.init();
});
jQuery(window).resize(function() {
  HeadFix();
});
//插入工作日志