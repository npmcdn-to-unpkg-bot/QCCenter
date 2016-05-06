var PaperValidate = function() {
	var gb = {
		initLoad: true,
		updateMode: 0
	};

	var handleDatePickers = function() {
		if (jQuery().datepicker) {
			$('.date-picker').datepicker({
				rtl: App.isRTL(),
				orientation: "left",
				autoclose: true,
				format: 'yyyy-mm-dd'
			});
		}
	};

	function focusInput() {
		$('form input[type="text"]').eq(0).focus();
	}

	function initDOM() {
		var str = getRootPath(1) + "/DataInterface/Api?Token=79d84495ca776ccb523114a2120e273ca80b315b&ID=24&M=3&t=1";
		var Data = ReadData(str);
		InitSelect("prod_id", Data);

		str = getRootPath(1) + "/DataInterface/Api?Token=79d84495ca776ccb523114a2120e273ca80b315b&ID=23&M=3&t=1";
		Data = ReadData(str);
		InitSelect("machine_id", Data);

		str = getRootPath(1) + "/DataInterface/Api?Token=79d84495ca776ccb523114a2120e273ca80b315b&ID=25&M=3&t=2";
		Data = ReadData(str);
		InitSelect("oper_id", Data);

		$('[name=passed]').iCheck('check');

		$("input[name='rec_date']").val(today(6));

		$("input[name='reel_code']").maxlength({
			limitReachedClass: "label label-danger",
			threshold: 3
		});

		initSelect2();
		$('.page-header .dropdown-quick-sidebar-toggler').hide();

		SetiCheckChecked('passed', 1);
		focusInput();
	}

	function vialidate() {
		if ($('select[name="oper_id"]').val() === '' || $('select[name="prod_id"]').val() === '' || $('select[name="machine_id"]').val() === '') {
			return 1;
		}
		return 0;
	}

	function loadHisData() {
		var reel_code = $('select[name="prod_id"]').val() + $('input[name="reel_code"]').val();
		/**
		 * 	SELECT a.id,a.reel_code, a.prod_id, a.oper_id, a.machine_id, CONVERT(VARCHAR(10),a.rec_date,120) as rec_date, a.validate_num, a.number_right, a.package_weight, a.serious_fake, a.normal_fake_h, a.normal_fake_m, a.normal_fake_l, a.reel_end, a.suspect_paper, a.well_paper, a.other, a.record_Time, a.passed, a.cut_weight  FROM dbo.Paper_Validate AS a  WHERE cast(prod_id as varchar)+ reel_code=?
		 *  param: r
		 */
		var strUrl = getRootPath(1) + "/DataInterface/Api?Token=79d84495ca776ccb523114a2120e273ca80b315b&ID=113&M=0&r=" + reel_code;
		var Data = ReadData(strUrl);
		if (Data.rows === "0") {
			return 0;
		}

		//将上次载入的轴号记录
		$('input[name="reel_code"]').data('reelcode', reel_code);
		Data.header.map(function(elem) {
			var keys = elem.title;
			$('form .form-control[name="' + keys + '"]').val(Data.data[0][keys]);
		});
		SetSelect2Val('oper_id', Data.data[0].oper_id);
		SetSelect2Val('prod_id', Data.data[0].prod_id);
		SetSelect2Val('machine_id', Data.data[0].machine_id);
		SetSelect2Val('number_right', Data.data[0].number_right);

		SetiCheckChecked('passed', Data.data[0].passed);

		$('.portlet button[type="submit"]').data('sn', Data.data[0].id).html('更新  <i class="icon-cloud-upload"></i>');

		gb.updateMode = 1;

		bsTips("历史数据载入成功", 1);
		return 1;
	}

	$('input[name="reel_code"]').on('blur', function(event) {
		if ($(this).val().length > 1 && $('select[name="Prod_id"]').val() !== '-1') {
			if (loadHisData()) {
				$('.portlet button[type="submit"]').html('更新  <i class="icon-cloud-upload"></i>');
			}
		} else if (gb.updateMode == 1) {
			if ($(this).data('reelcode') != $(this).val()) {
				$('.portlet button[type="submit"]').html('提交  <i class="icon-cloud-upload"></i>');
			}
		}
	});

	$('input[name="reel_code"]').on('keyup', function() {
		var obj = $(this);
		if (obj.val().length == 1) {
			SetSelect2Val('machine_id', obj.val());
		}
	});

	$('.err-reason').on('keyup', function() {
		$('.err-reason').closest('.form-group').removeClass('has-error');
	});

	$('input[name="cut_weight"]').on('keyup', function() {
		if (GetiCheckChecked('passed') == 1) {
			$('input[name="package_weight"]').val($(this).val());
		}
	});

	/*$(".number").on('keyup', function() {
		if(!isNumber($(this).val())){
			bsTips('数据录入错误，请输入数字',2);
		}
	});*/

	function validateBeforeSubmit() {
		var haveReason = $('[name=reel_end]').val() !== '' || $('[name=suspect_paper]').val() !== '' || $('[name=well_paper]').val() !== '' || $('[name=other]').val() !== '';
		var isPassed = GetiCheckChecked('passed');
		if (haveReason) {
			$('.err-reason').closest('.form-group').removeClass('has-error');
		} else if (!isPassed) {
			$('.err-reason').closest('.form-group').addClass('has-error');
		}
		return haveReason || isPassed;
	}

	var handleValidate = function() {
		var vRules = {
			reel_code: {
				minlength: 4,
				maxlength: 7,
				number: false,
				required: true
			},
			prod_id: {
				required: true
			},
			cut_weight: {
				required: true
			},
			package_weight: {
				required: true
			}
		};

		$('form[name=theForm]').validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block', // default input error message class
			focusInvalid: true, // do not focus the last invalid input
			rules: vRules,
			messages: {
				reel_code: {
					required: "轴号不能为空."
				},
				cut_weight: {
					required: "切纸抄重不能为空."
				},
				package_weight: {
					required: "切纸抄重不能为空."
				}
			},
			highlight: function(element) { // hightlight error inputs
				$(element).closest('.form-group').addClass('has-error'); // set error class to the control group
			},
			success: function(label) {
				label.closest('.form-group').removeClass('has-error');
				label.remove();
			},
			submitHandler: function(form) {
				//form.submit(); // form validation success, call ajax form submit
			}
		});

		function insertData() {
			var strUrl = getRootPath() + "/DataInterface/insert";
			var iData = getFormData('theForm');

			iData.tbl = TBL.PPR_VALIDATE;
			iData.utf2gbk = ['reel_end', 'suspect_paper', 'well_paper', 'other'];
			iData.record_Time = today(1);
			iData.passed = GetiCheckChecked('passed');

			$.ajax({
				url: strUrl,
				type: 'POST',
				data: iData,
				success: function(data) {
					var obj = $.parseJSON(data);
					bsTips(obj.message, obj.type);
					resetInputBox();
					//不合格时
					if (!iData.passed) {
						bsTips('该轴不放行，如需修改数据，请重新输入轴号载入信息');
					} else {
						bsTips('该轴放行，如需修改数据，请重新输入轴号载入信息', 1);
					}
				},
				error: function(data) {
					bsTips("数据添加失败，请稍后重试或联系管理员!", 0);
					infoTips(JSON.stringify(data));
				}
			});
		}

		function updateData() {
			var strUrl = getRootPath() + "/DataInterface/update";
			var iData = getFormData('theForm');

			iData.tbl = TBL.PPR_VALIDATE;
			iData.utf2gbk = ['reel_end', 'suspect_paper', 'well_paper', 'other'];
			iData.record_Time = today(1);
			iData.passed = GetiCheckChecked('passed');
			iData.id = $('.portlet button[type="submit"]').data('sn');

			$.ajax({
				url: strUrl,
				type: 'POST',
				data: iData,
				success: function(data) {
					var obj = $.parseJSON(data);
					bsTips(obj.message, obj.type);
					resetInputBox();
					//不合格时
					if (iData.passed == 0) {
						bsTips('该轴不放行，如需修改数据，请重新输入轴号载入信息');
					} else if (iData.passed == 1) {
						bsTips('该轴放行，如需修改数据，请重新输入轴号载入信息', 1);
					} else if (iData.passed == 2) {
						bsTips('该轴不统计，如需修改数据，请重新输入轴号载入信息', 1);
					} else if (iData.passed == 3) {
						bsTips('该轴待放行，如需修改数据，请重新输入轴号载入信息', 1);
					}
				},
				error: function(data) {
					bsTips("数据更新失败，请稍后重试或联系管理员!", 0);
					infoTips(data);
				}
			});
		}

		$('button[type="submit"]').on('click', function() {
			if ($('form[name=theForm]').validate().form() && validateBeforeSubmit()) {
				if (gb.updateMode === 0) {
					insertData();
				} else {
					updateData();
				}
			} else {
				bsTips('请确保所有必要信息均正确输入');
			}
		});

		$('a[name="reset"]').on('click', function() {
			resetInputBox();
		});

		function resetInputBox() {
			$('.validateData input[type="text"]').val('');
			$('input[name="reel_code"]').val('');
			focusInput();
			SetiCheckChecked('passed', 1);
			$('input[name="package_weight"]').val(0);
		}
	};

	var handleUnPassData = (function() {
		$('table[name="unPassedList"] tbody').on('click', 'a', function() {
			var id = $(this).data('id');
			var cut_weight = $(this).data('weight');
			var obj = $(this);
			var strUrl = getRootPath() + "/DataInterface/update";
			$.ajax({
				type: 'POST',
				async: false,
				url: strUrl,
				data: {
					"id": id,
					"passed": 1,
					"package_weight": cut_weight,
					"tbl": TBL.PPR_VALIDATE
				},
				success: function() {
					bsTips("该轴号成功放行", 2);
					//删除对应的项
					obj.parents('tr').remove();
					if ($('table a').length === 0) {
						$('table[name="unPassedList"] tbody').html('<tr><td class="text-center" colspan="7">近期所有产品均已通过检验</td></tr>');
					}
				},
				error: function(data) {
					infoTips("放行失败，请联系系统管理员!", 0);
					infoTips(JSON.stringify(data));
				}
			});
		});

		return {
			loadUnPassedData: function() {

				//API:SELECT a.ID, c.ProductName, b.Machine_Name, a.reel_code, a.package_weight, a.cut_weight, convert(varchar,a.record_Time,120) as record_Time  FROM dbo.Paper_Validate AS a INNER JOIN dbo.Paper_Machine_Info AS b ON b.Machine_ID = a.machine_id INNER JOIN dbo.Paper_ProductData AS c ON c.ProductID = a.prod_id WHERE a.passed =3 order by 7 

				var strUrl = getRootPath(1) + "/DataInterface/Api?Token=79d84495ca776ccb523114a2120e273ca80b315b&ID=114&M=2";
				var Data = ReadData(strUrl);

				var strTr = "";
				if (Data.rows > 0) {
					Data.data.map(function(elem) {
						strTr += '<tr><td>' + elem.ProductName + '</td><td> ' + elem.Machine_Name + ' </td><td> ' + elem.reel_code + '</td><td> ' + elem.record_Time + '</td><td> ' + elem.cut_weight + '</td><td> ' + elem.package_weight + '</td><td><a href="javascript:;" class="btn sbold uppercase btn-outline blue" data-id=' + elem.ID + ' data-weight=' + elem.cut_weight + '><i class="fa fa-credit-card"></i> 放行 </a></td></tr>';
					});
					$('table[name="unPassedList"] tbody').html(strTr);
				} else {
					$('table[name="unPassedList"] tbody').html('<tr><td class="text-center" colspan="7">近期所有产品均已通过检验</td></tr>');
				}
			}
		};
	})();

	return {
		init: function() {
			handleDatePickers();
			initDOM();
			handleValidate();
			handleUnPassData.loadUnPassedData();
		}
	};

}();

jQuery(document).ready(function() {
	initDom();
	iChechBoxInit();
	PaperValidate.init();
});
jQuery(window).resize(function() {
	HeadFix();
});