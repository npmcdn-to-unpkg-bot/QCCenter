$("#HideTips").on('click', function() {
  $(this).parent().hide();
});

$("#SaveSettings").on('click',
  function() {
    SaveSettings();
  });

function SaveSettings() {
  //获取各控制值
  var RefreshTime = $("#RefreshTime").val(); //轮询时间
  var AutoRefresh = ($("#AutoRefresh").bootstrapSwitch('state') === true) ? 1 : 0;
  var FixTblHead = ($("#FixTblHead").bootstrapSwitch('state') === true) ? 1 : 0;
  var FixTblCol = ($("#FixTblCol").bootstrapSwitch('state') === true) ? 1 : 0;
  var FootSearch = ($("#FootSearch").bootstrapSwitch('state') === true) ? 1 : 0;
  var InputToggle = ($("#InputToggle").bootstrapSwitch('state') === true) ? 1 : 0;
  var InputInner = ($("#InputInner").bootstrapSwitch('state') === true) ? 1 : 0;
  var strUrl = getRootUrl('QualityTable') + "/SaveSettings";
  //infoTips(RefreshTime +AutoRefresh,0); 
  //获取各控制值完毕
  //向服务器请求数据
  $.post(strUrl, {
      RefreshTime: RefreshTime,
      AutoRefresh: AutoRefresh,
      FixTblHead: FixTblHead,
      FixTblCol: FixTblCol,
      FootSearch: FootSearch,
      InputToggle: InputToggle,
      InputInner: InputInner,
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
}

function ReadSettings() {
  var strUrl = getRootPath() + "/QualityTable/ReadSettings";
  $.ajax({
    type: 'POST',
    async: false, //同步
    //async: true,
    url: strUrl,
    success: function(data) {
      var strJSON = jQuery.parseJSON(data);
      var obj = strJSON.data[0];
      //设置控件初始值
      $("#RefreshTime").val(obj.RefreshTime); //轮询时间
      if (obj.AutoRefresh === 0) $("#AutoRefresh").bootstrapSwitch('toggleState');
      if (obj.FixTblHead === 0) $("#FixTblHead").bootstrapSwitch('toggleState');
      if (obj.FixTblCol === 0) $("#FixTblCol").bootstrapSwitch('toggleState');
      if (obj.FootSearch === 0) $("#FootSearch").bootstrapSwitch('toggleState');
      if (obj.InputToggle === 0) $("#InputToggle").bootstrapSwitch('toggleState');
      if (obj.InputInner === 0) $("#InputInner").bootstrapSwitch('toggleState');
    }
  });
}

 //初始化接口列表
  var initApiList = function() {
    var strUrl = getRootPath(1) + '/DataInterface/Api?Token=79d84495ca776ccb523114a2120e273ca80b315b&ID=0&M=3&t=' + Math.random();
    var Data = ReadData(strUrl);
    var str = CreateTableBody(Data, true);
    $('#apiList tbody').html(str);

    $('#apiList_TableTitle').text(Data.title);
    $('#apiList_datasource').text('(' + Data.source + ')');

    var fixedHeaderOffset = 0;
    if (App.getViewPort().width < App.getResponsiveBreakpoint('md')) {
      if ($('.page-header').hasClass('page-header-fixed-mobile')) {
        fixedHeaderOffset = $('.page-header').outerHeight(true);
      }
    } else if ($('.page-header').hasClass('navbar-fixed-top')) {
      fixedHeaderOffset = $('.page-header').outerHeight(true);
    }
    var initData = {
      "bRetrieve": true,
      "language": {
        "url": getRootPath() + "/assets/pages/controller/DataTableLanguage.min.json"
      },
      "order": [
        [1, 'asc']
      ],
      "lengthMenu": [
        [5, 10, 15, 20, 50, 100, -1],
        [5, 10, 15, 20, 50, 100, "All"] // change per page values here
      ],
      // set the initial value
      "pageLength": 15,
      //"dom": "<'clear'>R<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
      "dom": "<'row tbTools' <'col-md-6 col-sm-12 pull-right'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
      //dom: "flBrtip",
      buttons: [{
        extend: 'copyHtml5',
        exportOptions: {
          columns: ':visible'
        },
        text: '复制',
      }, {
        extend: 'excelHtml5',
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'csvHtml5',
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'pdfHtml5',
        orientation: Data.cols > 10 ? 'landscape' : 'portrit',
        pageSize: Data.cols > 10 ? 'A3' : 'A4', //LEGEAL
        message: Data.source + '\n?成都印钞有限公司 技术质量部',
        //download: 'open',
        title: Data.title,
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'print',
        autoPrint: false,
        text: '打印',
        message: Data.source + '<br>?成都印钞有限公司 技术质量部',
        title: Data.title,
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'colvis',
        text: '隐藏数据列<i class="fa fa-angle-down"></i>',
        className: 'btn-fit-height green-haze dropdown-toggle'
      }],
      "bDeferRender": true,
      "bProcessing": true,
      "bStateSave": true,
      "bserverSide": false,
      "bInfo": true,
      "bAutoWidth": true,
      "bSortClasses": false,
      //任意字段
      "bScrollInfinite": true,
      //"borderMulti": true,
      searchHighlight: true, //高亮
      fixedHeader: {
        header: true,
        footer: true,
        headerOffset: fixedHeaderOffset
      },
      scroolY: '70v',
      scrollCollapse: true,
      "initComplete": function() {
        $("#apiList_tools").append($('#apiList').parent().find('.tabletools-btn-group').clone(true));
        $('#apiList').parent().find('.tabletools-btn-group').remove();
      }
    };
    var table = $('#apiList');
    var oTable = table.dataTable(initData);
    var nEditing = null;
    var ID;

    function restoreRow(oTable, nRow) {
      var aData = oTable.fnGetData(nRow);
      var jqTds = $('>td', nRow);

      for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
        oTable.fnUpdate(aData[i], nRow, i, false);
      }

      oTable.fnDraw();
    }

    function editRow(oTable, nRow) {
      var aData = oTable.fnGetData(nRow);
      var jqTds = $('>td', nRow);
      jqTds[3].innerHTML = '<input type="text" class="form-control" value="' + aData[3] + '">';
      jqTds[4].innerHTML = '<input type="text" class="form-control input-large" value="' + aData[4] + '">';
      jqTds[5].innerHTML = '<input type="text" class="form-control" value="' + aData[5] + '">';
      jqTds[6].innerHTML = '<a class="edit" href="javascript:;" data-sn="'+ ID +'">保存</a>';
      jqTds[7].innerHTML = '<a class="cancel" href="javascript:;" data-sn="'+ ID +'">取消</a>';
    }

    function saveRow(oTable, nRow) {
      var jqInputs = $('input', nRow);
      var data = {
        "ApiName": jqInputs[0].value,
        "strSQL": jqInputs[1].value,
        "Params": jqInputs[2].value,
        "utf2gbk": ["ApiName","strSQL","Params"],
        "id": ID,
        "tbl":30
      };
      if ('' !== data.ApiName && '' !== data.strSQL && '' !== data.Params) {
        oTable.fnUpdate(jqInputs[0].value, nRow, 3, false);
        oTable.fnUpdate(jqInputs[1].value, nRow, 4, false);
        oTable.fnUpdate(jqInputs[2].value, nRow, 5, false);
        oTable.fnUpdate('<a class="edit" href="javascript:;" data-sn="'+ ID +'">编辑</a>', nRow, 6, false);
        oTable.fnUpdate('<a class="delete"href="javascript:;" data-sn="'+ ID +'">删除</a>', nRow, 7, false);
        oTable.fnDraw();

        var url = getRootPath() + '/DataInterface/update';
        $.post(url,data,function(data){
            var obj = $.parseJSON(data);
            infoTips(obj.message, obj.type);
        });

      } else {
        infoTips('相应单元格内容不能为空');
      }
      //相应保存代码
    }
      
    function newRow(data){
      var aiNew = oTable.fnAddData([data.ApiID, data.AuthorName, data.DBName, data.ApiName, data.strSQL, data.params, '<a class="edit" href="javascript:;" data-sn="'+ data.newID +'">编辑</a>', '<a class="delete" href="javascript:;" data-sn="'+ data.newID +'">删除</a>']);
      oTable.fnGetNodes(aiNew[0]);
    }

    return {
    //main function to initiate the module
    init: function() {
      table.on('click', '.edit', function(e) {
        ID = $(this).attr('data-sn');
        e.preventDefault();
        /* Get the row as a parent of the link that was clicked on */
        var nRow = $(this).parents('tr')[0];

        if (nEditing !== null && nEditing != nRow) {
          /* Currently editing - but not this row - restore the old before continuing to edit mode */
          restoreRow(oTable, nEditing);
          editRow(oTable, nRow);
          nEditing = nRow;
        } else if (nEditing == nRow && this.innerHTML == "保存") {
          /* Editing this row and want to save it */
          saveRow(oTable, nEditing);
          nEditing = null;
        } else {
          /* No edit in progress - let's start one */
          editRow(oTable, nRow);
          nEditing = nRow;
          //保存-取消
          $(this).text('保存');
          $(this).parent().parent().find('a:eq(1)').text('取消');
          $(this).parent().parent().find('a:eq(1)').removeClass('delete');
          $(this).parent().parent().find('a:eq(1)').addClass('cancel');
        }
      });

      table.on('click', '.delete', function (e) {
          e.preventDefault();
          var obj = $(this);
          bootbox.dialog({
              message: "确定删除这条信息?",
              title: "删除信息",
              buttons: {
                success: {
                  label: "删除",
                  className: "green",
                  callback: function() {
                    var url = getRootPath() + '/DataInterface/delete';
                    $.post(url,{id:obj.attr('data-sn'),tbl:30},function(data){
                        var nRow = obj.parents('tr')[0];
                        oTable.fnDeleteRow(nRow);
                        infoTips("数据成功删除",1);

                        //更新数据添加接口状态信息
                        var nID = ReadData('http://localhost/DataInterface/Api?Token=79d84495ca776ccb523114a2120e273ca80b315b&ID=29&M=3&author=develop');
                        $('#ApiID').text(nID.data[0]);
                    });
                  }
                },
                main: {
                  label: "取消",
                  className: "red",
                  callback: function() {
                    return;
                  }
                }
              }
          });
          
      });

      table.on('click', '.cancel', function (e) {
          e.preventDefault();
          restoreRow(oTable, nEditing);
          nEditing = null;
      });
    },
    newRow: function(data){
      newRow(data);
    }
  };
}();


var dataTable = function() {
  var oTable;

  function initSettings(Data) {
    var initData;
    initData = {
      //"bDestroy":true,
      "bRetrieve": true,
      "language": {
        "url": getRootPath() + "/assets/pages/controller/DataTableLanguage.min.json"
      },
      "order": [
        [1, 'asc']
      ],
      "lengthMenu": [
        [5, 10, 15, 20, 50, 100, -1],
        [5, 10, 15, 20, 50, 100, "All"] // change per page values here
      ],
      // set the initial value
      "pageLength": 15,
      //"dom": "<'clear'>R<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
      "dom": "<'row tbTools' <'col-md-6 col-sm-12 pull-right'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
      //dom: "flBrtip",
      buttons: [{
        extend: 'copyHtml5',
        exportOptions: {
          columns: ':visible'
        },
        text: '复制',
      }, {
        extend: 'excelHtml5',
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'csvHtml5',
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'pdfHtml5',
        orientation: Data.cols > 10 ? 'landscape' : 'portrit',
        pageSize: Data.cols > 10 ? 'A3' : 'A4', //LEGEAL
        message: Data.source + '\n?成都印钞有限公司 技术质量部',
        //download: 'open',
        title: Data.title,
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'print',
        autoPrint: false,
        text: '打印',
        message: Data.source + '<br>?成都印钞有限公司 技术质量部',
        title: Data.title,
        exportOptions: {
          columns: ':visible'
        }
      }, {
        extend: 'colvis',
        text: '隐藏数据列<i class="fa fa-angle-down"></i>',
        className: 'btn-fit-height green-haze dropdown-toggle'
      }],
      "bDeferRender": true,
      "bProcessing": true,
      "bStateSave": true,
      "bserverSide": false,
      "bInfo": true,
      "bAutoWidth": true,
      "bSortClasses": false,
      "aoColumns": Data.header,
      "data": Data.data,
      //任意字段
      "bScrollInfinite": true,
      //"borderMulti": true,
      searchHighlight: true, //高亮
      colReorder: {
        realtime: true,
      },
      fixedHeader: {
        header: true,
        footer: true,
        headerOffset: Data.fixedHeaderOffset,
      },
      //scrollY:        '70vh',
      scroolY: '70v',
      scrollCollapse: true,
      "initComplete": function() {
        var api = this.api();
        api.$('td').on('click', function() {
          api.search(this.innerText).draw();
        });

        $(Data.tblID + "_tools").append($(Data.tblID).parent().find('.tabletools-btn-group').clone(true));
        $(Data.tblID).parent().find('.tabletools-btn-group').remove();
        //infoTips(JSON.stringify(Data), 2);
      }
    };
    return initData;
  }

  /*
DataType:Array/Json.
其中Json直接将URL传入值即可，但Model中查询代码不能为中文,视图中需要定义表头
*/

  function CreateTable(tableID, Data) {
    var table = $(tableID);
    var fixedHeaderOffset = 0;
    if (App.getViewPort().width < App.getResponsiveBreakpoint('md')) {
      if ($('.page-header').hasClass('page-header-fixed-mobile')) {
        fixedHeaderOffset = $('.page-header').outerHeight(true);
      }
    } else if ($('.page-header').hasClass('navbar-fixed-top')) {
      fixedHeaderOffset = $('.page-header').outerHeight(true);
    }
    Data.fixedHeaderOffset = fixedHeaderOffset;
    Data.tblID = tableID;
    var initData = initSettings(Data);
    //初始化表格
    oTable = table.dataTable(initData);
  }
  /*
   *刷新数据，Array,Json两种方式，取决于表格初始化方式
   */

  function RefreshTable(tableID, strUrl) {
    var table = $(tableID);
    //重新读取数据
    Data = ReadData(strUrl);
    //更新表格相关信息
    $(tableID + '_TableTitle').text(Data.title);
    $(tableID + '_datasource').text('(' + Data.source + ')');
    if (Data.cols < 2) {
      infoTips("请确保数据列在2列以上，当前为：" + Data.cols);
      return;
    }
    if (Data.rows > 0) {
      if (!$('#sample tbody').length) {
        CreateTable(tableID, Data);
        return;
      }
    } else {
      infoTips("该时间范围内无质量数据，请重新选择查询时间!", 1);
      return;
    }
    oTable = table.dataTable();
    oTable.fnClearTable(this);
    var oSettings = oTable.fnSettings();
    //刷新列，列顺序可能被拖动
    for (var i = 0; i < Data.rows; i++) {
      oTable.oApi._fnAddData(oSettings, Data.data[i]);
    }
    oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
    oTable.fnDraw();
    //infoTips(JSON.stringify(Data), 2);
  }
return {
  //main function to initiate the module
  init: function() {
    $("#Preview").on('click',
      function() {
        var strUrl = $('#PreviewUrl').val();
        //重新读取数据
        //Data = ReadData(strUrl);
        RefreshTable('#sample', strUrl);
      });
    initApiList.init();
  },
  RefreshTable: function(tableID, strUrl) {
    RefreshTable(tableID, strUrl);
  },
  newRow: function(data) {
    initApiList.newRow(data);
  }
};

}();

var FormEditable = function() {

  $.mockjaxSettings.responseTime = 100;

  var initAjaxMock = function() {
    //ajax mocks

    $.mockjax({
      url: '/post'
    });

    $.mockjax({
      url: '/DBGroups',
      response: function(settings) {
        this.responseText = [{
          value: 0,
          text: '质量综合管理系统'
        }, {
          value: 1,
          text: '小张核查'
        }, {
          value: 2,
          text: '码后核查'
        }, {
          value: 3,
          text: '机台作业'
        }, {
          value: 4,
          text: '库管系统'
        }];
      }
    });
  };

  var initEditables = function() {

    var InputToggle = ($("#InputToggle").bootstrapSwitch('state') === true) ? 1 : 0;
    var InputInner = ($("#InputInner").bootstrapSwitch('state') === true) ? 1 : 0;

    //set editable mode based on URL parameter
    if (InputInner) {
      $.fn.editable.defaults.mode = 'inline';
    }

    //global settings 
    $.fn.editable.defaults.inputclass = 'form-control';
    $.fn.editable.defaults.url = '/post';

    //editables element samples 
    $('#ApiName').editable({
      validate: function(value) {
        if ($.trim(value) === '') return '该字段不能为空';
      },
      url: '/post',
      type: 'text',
      pk: 1,
      name: 'ApiName',
      title: '请输入接口名称'
    });

    $('#Token').editable({
      validate: function(value) {
        if ($.trim(value) === '') return '该字段不能为空';
      }
    });

    $('#DataBaseID').editable({
      //prepend: "not selected",
      name: 'DBID',
      inputclass: 'form-control',
      source: [{
        value: 0,
        text: '质量综合管理系统'
      }, {
        value: 1,
        text: '小张核查'
      }, {
        value: 2,
        text: '码后核查'
      }, {
        value: 3,
        text: '机台作业'
      }, {
        value: 4,
        text: '库管系统'
      }, {
        value: 5,
        text: '质量控制中心'
      }]
    });

    /*$('#DataBaseID').editable({
showbuttons: false
});*/

    $('#CreateDate').editable({
      format: 'yyyy-mm-dd hh:ii',
      viewformat: 'yyyy-mm-dd hh:ii',
      datetimepicker: {
        rtl: App.isRTL(),
        todayBtn: 'linked',
        weekStart: 1
      }
    });


    $('#SQL').editable({
      name: 'strSQL',
      showbuttons: 'bottom',
      rows: 8,
      inputclass: "form-control",
      tpl: '<textarea style="min-width:430px;"></textarea>',
      validate: function(value) {
        if ($.trim(value) === '') return '该字段不能为空';
      },
      /*display: function(value) {
//render response into element
$(this).html('<pre>' + value + '</pre>');
}*/
    });

    $('#note').editable({
      showbuttons: (App.isRTL() ? 'left' : 'right'),
      name: 'ApiDesc'
    });

    $('#pencil').on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $('#note').editable('toggle');
    });

    $('#url').editable({
      name: 'URL',
      disabled: true,
    });

    $('#ApiID').editable({
      disabled: true,
    });

  };
  return {
    //main function to initiate the module
    init: function() {

      // inii ajax simulation
      initAjaxMock();

      // init editable elements
      initEditables();

      // init editable toggler
      $('#edit').on('click', function() {
        $('#user .editable').editable('toggleDisabled');
        $('#url').editable('disable');
        $('#ApiID').editable('disable');
      });
      // init 
      $('#InputInner').on('switchChange.bootstrapSwitch', function(e) {
        SaveSettings();
        window.location.reload();
      });
      // handle editable elements on hidden event fired
      $('#user .editable').on('hidden', function(e, reason) {
        if (reason === 'save' || reason === 'nochange') {
          var $next = $(this).closest('tr').next().find('.editable');
          if (InputToggle) {
            setTimeout(function() {
              $next.editable('show');
            }, 300);
          } else {
            $next.focus();
          }
        }
      });

      $("#SaveAPI,#saves").on('click', function() {
        var strUrl = getRootUrl('DataInterface') + "SaveAPI";
        var APIData = $('#user .editable').editable('getValue');
        if (APIData.ApiName === '' || APIData.SQL === '' || APIData.params === '') {
          infoTips("接口名、查询语句以及接口参数不允许为空,请检查后重新提交", 1);
          return;
        }
        APIData.params = $('#params').val().split(",");
        var DBName = $('#DataBaseID').text().trim();
        $.post(strUrl, APIData,
          function(data) {
            var obj = jQuery.parseJSON(data);
            infoTips(obj.message, 1);
            if (obj.status) {
              //添加成功后重置
              $('#Reset').click();
              $('#ApiID').editable('setValue', obj.NewID); //ID自增
              var strOld = '&ID=' + APIData.ApiID;
              var strTemp = parseInt(APIData.ApiID, 10) + 1;
              var strNew = '&ID=' + strTemp;
              var strNewUrl = APIData.URL.replace(strOld, strNew);
              $('#url').editable('setValue', strNewUrl); //ID自增
              $('#DemoUrl').text(strNewUrl);
              $('#DemoUrl').attr('href', strNewUrl);

              //API列表数据更新
              APIData.newID = obj.ID;
              APIData.AuthorName = $('#AuthorName').text().trim();
              APIData.DBName = DBName;
              dataTable.newRow(APIData);
            }
          }
        );
      });
      $('#Reset').on('click', function() {
        $('#ApiName').editable('setValue', null) //clear values
        .editable('option', 'pk', null) //clear pk
        .removeClass('editable-unsaved'); //remove bold css     

        $('#DataBaseID').editable('setValue', null) //clear values
        .editable('option', 'pk', null) //clear pk
        .removeClass('editable-unsaved'); //remove bold css    

        $('#SQL').editable('setValue', null) //clear values
        .editable('option', 'pk', null) //clear pk
        .removeClass('editable-unsaved'); //remove bold css    
        var strNote = '[功能说明]' + '<p style="text-indent:2em;">本接口主要用于 <i>XX</i> 信息的查询.</p>' + '[主要参数]';
        strNote += '<ul><li>TimeStart:开始时间；</li><li> TimeEnd:开始时间；</li><li> Cols:1/0,默认为空，设为1时返回查询语句的列用于表格初始化等操作；</li></ul>';
        $('#note').editable('setValue', strNote) //clear values
        .editable('option', 'pk', null) //clear pk
        .removeClass('editable-unsaved'); //remove bold css    
      });

      $('a[href="#portlet_tab1"]').on('click', function() { //查看接口列表 
        $('.portlet[name="api_View"]').hide();
        window.onscroll = function() {
          $('table[aria-describedby="apiList_info"] thead tr[role="row"]:nth(1)').show();
          $('table[aria-describedby="sample_info"] thead tr[role="row"]:nth(1)').hide();
        };
      });

      $('a[href="#portlet_tab2"]').on('click', function() { //添加接口
        $('.portlet[name="api_View"]').show();
        window.onscroll = function() {
          $('table[aria-describedby="apiList_info"] thead tr[role="row"]:nth(1)').hide();
          $('table[aria-describedby="sample_info"] thead tr[role="row"]:nth(1)').show();
        };
      });
      $(document).on('blur', '.bootstrap-tagsinput', function() {
        $(this).css({
          'background-color': $('.bootstrap-tagsinput').parent().css('background-color'),
          'border': 'none',
          'box-shadow': 'none'
        });
      });

      $(document).on('focus', '.bootstrap-tagsinput', function() {
        $('.bootstrap-tagsinput').removeAttr('style');
      });

    }

  };

}();

jQuery(document).ready(function() {
  RoundedTheme(0);
  UIIdleTimeout.init();
  initDashboardDaterange('YYYYMMDD');
  $("#CreateDate").text(today(3));
  initDom();
  ReadSettings();
  dataTable.init();
  //initColStat('#sample');       
  FormEditable.init();
});
jQuery(window).resize(function() {
  HeadFix();
});