$(document).ready(function(){

});

var g_obj = {};

function rightMenuMouseOver() {
}

function rightMenuMouseOut() {
}

//显示选择部门窗口
function chooseDepartment(name, id) {
	g_obj.chooseDepartment = {name : name, id : id};

	if (g_obj.department_dialog == null)
	{
		g_obj.department_dialog = $( "#dialog-department-tree" ).removeClass('hide').dialog({
			width: 500,
			height: 400,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'>选择部门</h4></div>",
			title_html: true,
			buttons: [
				{
					text: "取消",
					"class" : "btn btn-primary btn-xs",
					click: function() {
						$( "#dialog-department-tree" ).dialog("close"); 
					} 
				}
			]
		});
	}
	else
	{
		g_obj.department_dialog.dialog('open');
	}
}

//取消部门的选择
function clearDepartment(id, did)
{
	if (id != null && id != '')
	{
		$('#' + id).val('');
	}
	if (did != null && did != '')
	{

		$('#' + did).val('');
	}
}

//操作表格
function getDel(k){
 $(k).parent().remove();
}

//操作表格结束
var manage_grant_grid_selector = "#manage-grant-grid-table";
var manage_grant_pager_selector = "#manage-grant-grid-pager";
// override dialog's title function to allow for HTML titles
$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
	_title: function(title) {
		var $title = this.options.title || '&nbsp;'
		if( ("title_html" in this.options) && this.options.title_html == true )
			title.html($title);
		else title.text($title);
	}
}));



// enable search/filter toolbar
// jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})

// switch element when editing inline
function aceSwitch( cellvalue, options, cell ) {
	setTimeout(function(){
		$(cell) .find('input[type=checkbox]')
				.wrap('<label class="inline" />')
			.addClass('ace ace-switch ace-switch-5')
			.after('<span class="lbl"></span>');
	}, 0);
}
// enable datepicker
function pickDate( cellvalue, options, cell ) {
	setTimeout(function(){
		$(cell) .find('input[type=text]')
				.datepicker({format:'yyyy-mm-dd' , autoclose:true}); 
	}, 0);
}

function view_alarm() {
	var array = $('#manage-grant-grid-table').jqGrid('getGridParam','selarrrow');
	if (array.length <= 0)
	{
		$('#manage_grant_warn').show();
		$('#manage_grant_warn_label').html('请选择一行数据！');
		mySetTimeOut('manage_grant_warn', 4000);	
	}
	else if (array.length > 1)
	{
		$('#manage_grant_warn').show();
		$('#manage_grant_warn_label').html('不能同时查看多行数据');
		mySetTimeOut('manage_grant_warn', 4000);
	}
	else
	{
		rowid = array[0];
		var data = $('#manage-grant-grid-table').jqGrid('getRowData', rowid);
		$.ajax( {
			type : "post",
			url : "boxeventandwarn.do?method=findFixapply",
			data: "id=" + data.id,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data.resultMark == 1)
				{
					if (data.object.boxinfo != null) $('#box_no').val(data.object.boxinfo.box_no);
					if (data.object.user != null) $('#user_name').val(data.object.user.full_name);
					if (data.object.department != null) $('#department').val(data.object.department.name);
					if (data.object.app_user != null) $('#box_no').val(data.object.app_user.full_name);
					if (data.object.boxinfo != null) $('#appuser').val(data.object.boxinfo.box_no);
					if (data.object.app_result == 0) $('#app_result').val('未审批');
					else if (data.object.app_result == 1) $('#app_result').val('审批通过');
					else if (data.object.app_result == 2) $('#app_result').val('审批不通过');
					if (data.object.is_create == 0) $('#is_create').val('未产生');
					else if (data.object.is_create == 1) $('#is_create').val('已产生');
					if (data.object.app_time != null) $('#app_time').val(new Date(data.object.app_time).Format("yyyy-MM-dd hh:mm:ss"));
					if (data.object.repairtype == 1) $('#type').val('资源配置');
					else $('#type').val('其他');
					if (data.object.receive_department != null) $('#receive_department').val(data.object.receive_department.name);
					if (data.object.receive_user != null) $('#receive_user').val(data.object.receive_user.full_name);
					if (data.object.respect_start_time != null) $('#start_time').val(new Date(data.object.respect_start_time).Format("yyyy-MM-dd hh:mm:ss"));
					if (data.object.respect_end_time != null) $('#end_time').val(new Date(data.object.respect_end_time).Format("yyyy-MM-dd hh:mm:ss"));
					$('#remark').val(data.object.remark);
					var dialog = $( "#dialog-view-alarm" ).removeClass('hide').dialog({
						modal: true,
						width: 700,
						height: 600,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看维修申请</h4></div>",
						title_html: true,
						buttons: [ 
						          {
						        	  text: "确定",
						        	  "class" : "btn btn-primary btn-xs",
						        	  click: function() {
							        	  $( "#dialog-view-alarm" ).dialog( "close" ); 
							          } 
						          }
						]
					});
				}
			}
		});
	}
}

function delete_alarm()
{
	var array = $('#manage-grant-grid-table').jqGrid('getGridParam','selarrrow');
	if (array.length <= 0)
	{
		$('#manage_grant_warn').show();
		$('#manage_grant_warn_label').html('请选择一行数据！');
		mySetTimeOut('manage_grant_warn', 4000);
	}
	else
	{
		if (confirm('删除了无法恢复，确定要删除该记录吗？'))
		{
			var alarms = '';
			for (var i = 0; i < array.length; i ++)
			{
				var data = $('#manage-grant-grid-table').jqGrid('getRowData', array[i]);
				alarms += data.id + ',';
			}
			alarms = alarms.substring(0, alarms.length - 1);
			$.ajax( {
				type : "post",
				url : "boxeventandwarn.do?method=deleteFixapply",
				data: "ids=" + alarms,
				success : function(data) {
					isOvertime(data.resultMark);
					if (data.resultMark == 1)
					{
						$('#manage_grant_warn').show();
						$('#manage_grant_warn_label').html('删除维修申请记录成功！');
						mySetTimeOut('manage_grant_warn', 4000);
						$('#manage-grant-grid-table').trigger("reloadGrid");
					}
					else
					{
						$('#manage_grant_warn').show();
						$('#manage_grant_warn_label').html('删除维修申请记录失败，请重试！');
						mySetTimeOut('manage_grant_warn', 4000);
					}
				},
				error : function() {
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('删除维修申请记录失败，请重试！');
					mySetTimeOut('manage_grant_warn', 4000);
				}
			});
		}
	}
}

//快速检索
function fastsearch() {
	var controller_id = $('#f_s_controller_id').val();
	var alarm_type = $('#f_s_alarm_type').val();
	var filter  = /^[0-9]*$/;
	if (controller_id != '' || alarm_type != '')
	{
		if (! filter.test(controller_id))
		{
			alert('控制器ID为整数');
			return false;
		}
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
            postData:null, //发送搜索条件 
        });
		var postData = {};
		if (controller_id != '')
		{
			postData.controller_id = controller_id;
		}
		if (alarm_type != '')
		{
			postData.alarm_type = alarm_type;
		}
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
            url:'boxeventandwarn.do?method=listAlarmEventPageByAjax',//你的搜索程序地址 
            postData:postData, //发送搜索条件 
            page:1 
        }).trigger("reloadGrid"); //重新载入
	}
}

function detailsearch()
{
	var dialog = $( "#dialog-search-alarm" ).removeClass('hide').dialog({
		modal: true,
		width: 1000,
		height: 500,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>检索告警事件</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					if ($("#d_search_form").valid())
					{
						var postData = {};
						$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
				            postData:null, //发送搜索条件 
				        });
						if ($('#s_controller_id').val() != '')
						{
							postData.controller_id = $('#s_controller_id').val(); 
						}
						if ($('#s_address').val() != '')
						{
							postData.address = $('#s_address').val(); 
						}
						if ($('#s_department').val() != '')
						{
							postData.department = $('#s_department').val(); 
						}
						if ($('#s_alarm_type').val() != '')
						{
							postData.alarm_type = $('#s_alarm_type').val(); 
						}
						if ($('#s_alarm_time').val() != '')
						{
							postData.alarm_time = $('#s_alarm_time').val() + ' 00:00:00';
						}
						if ($('#s_alarm_keys').val() != '')
						{
							postData.alarm_keys = $('#s_alarm_keys').val(); 
						}
						if ($('#s_alarm_operators').val() != '')
						{
							postData.alarm_operators = $('#s_alarm_operators').val(); 
						}
						if ($('#s_alarm_rfids').val() != '')
						{
							postData.alarm_rfids = $('#s_alarm_rfids').val(); 
						}
						if ($('#s_settled_time').val() != '')
						{
							postData.settled_time = $('#s_settled_time').val() + ' 00:00:00';
						}
						if ($('#s_settled_keys').val() != '')
						{
							postData.settled_keys = $('#s_settled_keys').val(); 
						}
						if ($('#s_settled_operators').val() != '')
						{
							postData.settled_operators = $('#s_settled_operators').val(); 
						}
						if ($('#s_settled_rfids').val() != '')
						{
							postData.settled_rfids = $('#s_settled_rfids').val(); 
						}
						postData.is_affirmed = Number($(':radio[name="s_is_affirmed"]:checked').val()) + 1;
						if ($('#s_affirm_time').val() != '')
						{
							postData.affirm_time = $('#s_affirm_time').val() + ' 00:00:00';
						}
						if ($('#s_affirm_user').val() != '')
						{
							postData.affirm_user = $('#s_affirm_user').val(); 
						}
						$("#manage-grant-grid-table").jqGrid('setGridParam',{
					        url:'boxeventandwarn.do?method=listAlarmEventPageByAjax',//你的搜索程序地址 
					        postData:postData, //发送搜索条件 
					        page:1 
					    }).trigger("reloadGrid"); //重新载入
						$( "#dialog-search-alarm" ).dialog( "close" );
					}
				} 
			}
		]
	});
}

function resetsearch()
{
	$('#d_search_form')[0].reset();
	$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
        postData:null, //发送搜索条件 
    });
	var postData = {
			rows : 10,
			page : 1
	};
	
	$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
        url:'boxeventandwarn.do?method=listAlarmEventPageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入
}


function affirm_apply(id, result)
{
	var msg = result == 1 ? "确定要审批通过吗？" : "确定要审批不通过吗？";
	if (confirm(msg))
	{
		$.ajax( {
			type : "post",
			url : "boxeventandwarn.do?method=affirmFixapply",
			data: "id=" + id + "&app_result=" + result,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data.resultMark == 1)
				{
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('审批成功！');
					mySetTimeOut('manage_grant_warn', 4000);
					$('#manage-grant-grid-table').trigger("reloadGrid");
				}
				else
				{
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('审批失败，请重试！');
					mySetTimeOut('manage_grant_warn', 4000);
				}
			},
			error : function() {
				$('#manage_grant_warn').show();
				$('#manage_grant_warn_label').html('审批失败，请重试！');
				mySetTimeOut('manage_grant_warn', 4000);
			}
		});
	}
}

jQuery(function($) {
	//验证搜索条件
	$("#d_search_form").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
        rules:{ //定义验证规则 
			s_controller_id: {
				digits: true
		 	},
		 	s_alarm_time: {
		 		dateISO: true
			},
			s_settled_time: {
				dateISO: true
			},
			s_affirm_time: {
				dateISO: true
			}
         }, 
         messages:{ //定义提示信息 
 			s_controller_id: {
				digits: '控制器ID必须为整数'
		 	},
		 	s_alarm_time: {
		 		dateISO: '必须是日期格式，例如2009-06-23'
			},
			s_settled_time: {
				dateISO: '必须是日期格式，例如2009-06-23'
			},
			s_affirm_time: {
				dateISO: '必须是日期格式，例如2009-06-23'
			}
         } 
    });
	
	//绑定告警列表
	jQuery(manage_grant_grid_selector).jqGrid({
		// direction: "rtl",
		url: 'boxeventandwarn.do?method=listFixApplyPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['id', '审批操作', '光交箱编号', '维修申请人', '申请人部门', '维修审批人', '审批结果', '是否已产生工单', '申请原因', '申请时间', '施工类型', '工单接受部门', '工单接受人'],
		colModel:[
		    {name:'id', index:'id', hidden:true},
		    {name:'operate', index:'operate', sortable:false, formatter : function(cellvalue, options, rowObject){
		    		var value = '';
		    		if ($('#fixapply_affirm').val() == 'true' && $('#order_app').val() == 1)
		    		{
			    		if (rowObject.app_result == 0) value = '<button onclick="affirm_apply(\'' + rowObject.id + '\', 1)" class="btn btn-xs btn-success"><i class="icon-ok icon-on-right"></i></button>&nbsp;<button onclick="affirm_apply(\'' + rowObject.id + '\', 2)" class="btn btn-xs btn-success"><i class="icon-remove icon-on-right"></i></button>';
			    		//else if (rowObject.app_result == 1) value = '<button onclick="affirm_apply(\'' + rowObject.id + '\', 2)" class="btn btn-xs btn-success"><i class="icon-remove icon-on-right"></i></button>';
			    		//else if (rowObject.app_result == 2) value = '<button onclick="affirm_apply(\'' + rowObject.id + '\', 1)" class="btn btn-xs btn-success"><i class="icon-ok icon-on-right"></i></button>';
		    		}
		    		return  value;
				}
			},
			{name:'box_no', index:'box_no', sortable:false},
			{name:'user',index:'user.full_name', formatter : function (cellvalue, options, rowObject) {
					return rowObject.user == null ? '' : rowObject.user;
				}
			},
			{name:'department',index:'department.name', formatter : function (cellvalue, options, rowObject) {
					return rowObject.department == null ? '' : rowObject.department;
				}
			},
			{name:'app_user',index:'app_user.full_name', formatter : function (cellvalue, options, rowObject) {
					return rowObject.app_user == null ? '' : rowObject.app_user;
				}
			},
			{name:'app_result',index:'app_result', formatter : function (cellvalue, options, rowObject) {
					return rowObject.app_result == 0 ? '未审批' : (rowObject.app_result == 1? '通过' : '拒绝');
				}
			},
			{name:'is_create',index:'is_create', formatter : function (cellvalue, options, rowObject) {
					return rowObject.is_create == 1 ? '已产生' : '未产生';
				}
			},
			{name:'remark',index:'remark'},
			{name:'app_time',index:'app_time', width:200, formatter:function(cellvalue, options, rowObject){
					return rowObject.app_time == null ? "" : new Date(rowObject.app_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'repairtype',index:'repairtype', formatter : function (cellvalue, options, rowObject) {
					return rowObject.repairtype == 1 ? '资源配置' : '其他';
				}
			},
			{name:'receive_department',index:'receive_department.name', formatter : function (cellvalue, options, rowObject) {
					return rowObject.receive_department == null ? '' : rowObject.receive_department;
				}
			},
			{name:'receive_user',index:'receive_user.full_name', formatter : function (cellvalue, options, rowObject) {
					return rowObject.receive_user == null ? '' : rowObject.receive_user;
				}
			}
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : manage_grant_pager_selector,
		altRows: true,
		// toppager: true,
		ondblClickRow: function(rowid, irow, icol, e) {
			view_alarm(rowid);
		},
		onRightClickRow: function(rowid, irow, icol, e) {
		},
		loadComplete: function(xhr) {
			//console.log(xhr);
		},
		multiselect: true,

		loadComplete : function(data) {
			isOvertime(data.resultMark);
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);
				
				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		autowidth: true

	});

	// 绑定告警列表分页
	jQuery(manage_grant_grid_selector).jqGrid('navGrid', manage_grant_pager_selector,
		{ 	// navbar options
			edit: false,
			add: false,
			del: $('#fixapply_delete').val() == 'true' ? true : false,
			delfunc : function () {
				delete_alarm();
			},
			delicon : 'icon-trash red',
			search: false,
			searchfunc : function () {
				detailsearch();
			},
			searchicon : 'icon-search orange',
			refresh: true,
			refreshicon : 'icon-refresh green',
			view: true,
			viewfunc : function () {
				view_alarm();
			},
			viewicon : 'icon-zoom-in grey',
		},
		{
			// edit record form
			// closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			}
		},
		{
			// new record form
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			}
		},
		{
			// delete record form
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;
				
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);
				
				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			}
		},
		{
			// search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,
			/**
			 * multipleGroup:true, showQuery: true
			 */
		},
		{
			// view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		}
	)


	
	function style_edit_form(form) {
		// enable datepicker on "sdate" field and switches for "stock" field
		form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
			.end().find('input[name=stock]')
				  .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

		// update buttons classes
		var buttons = form.next().find('.EditButton .fm-button');
		buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();// ui-icon,
																			// s-icon
		buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
		buttons.eq(1).prepend('<i class="icon-remove"></i>')
		
		buttons = form.next().find('.navButton a');
		buttons.find('.ui-icon').remove();
		buttons.eq(0).append('<i class="icon-chevron-left"></i>');
		buttons.eq(1).append('<i class="icon-chevron-right"></i>');		
	}

	function style_delete_form(form) {
		var buttons = form.next().find('.EditButton .fm-button');
		buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();// ui-icon,
																			// s-icon
		buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
		buttons.eq(1).prepend('<i class="icon-remove"></i>')
	}
	
	function style_search_filters(form) {
		form.find('.delete-rule').val('X');
		form.find('.add-rule').addClass('btn btn-xs btn-primary');
		form.find('.add-group').addClass('btn btn-xs btn-success');
		form.find('.delete-group').addClass('btn btn-xs btn-danger');
	}
	function style_search_form(form) {
		var dialog = form.closest('.ui-jqdialog');
		var buttons = dialog.find('.EditTable')
		buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
		buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
		buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
	}
	
	function beforeDeleteCallback(e) {
		var form = $(e[0]);
		if(form.data('styled')) return false;
		
		form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
		style_delete_form(form);
		
		form.data('styled', true);
	}
	
	function beforeEditCallback(e) {
		var form = $(e[0]);
		form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
		style_edit_form(form);
	}



	// it causes some flicker when reloading or navigating grid
	// it may be possible to have some custom formatter to do this as the grid
	// is being created to prevent this
	// or go back to default browser checkbox styles for the grid
	function styleCheckbox(table) {
	/**
	 * $(table).find('input:checkbox').addClass('ace') .wrap('<label />')
	 * .after('<span class="lbl align-top" />')
	 * 
	 * 
	 * $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
	 * .find('input.cbox[type=checkbox]').addClass('ace') .wrap('<label
	 * />').after('<span class="lbl align-top" />');
	 */
	}
	

	// unlike navButtons icons, action icons in rows seem to be hard-coded
	// you can change them like this in here if you want
	function updateActionIcons(table) {
		/**
		 * var replacement = { 'ui-icon-pencil' : 'icon-pencil blue',
		 * 'ui-icon-trash' : 'icon-trash red', 'ui-icon-disk' : 'icon-ok green',
		 * 'ui-icon-cancel' : 'icon-remove red' }; $(table).find('.ui-pg-div
		 * span.ui-icon').each(function(){ var icon = $(this); var $class =
		 * $.trim(icon.attr('class').replace('ui-icon', '')); if($class in
		 * replacement) icon.attr('class', 'ui-icon '+replacement[$class]); })
		 */
	}
	
	// replace icons with FontAwesome icons like above
	function updatePagerIcons(table) {
		var replacement = 
		{
			'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
			'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
			'ui-icon-seek-next' : 'icon-angle-right bigger-140',
			'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
		};
		$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
			var icon = $(this);
			var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
			
			if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
		})
	}

	function enableTooltips(table) {
		$('.navtable .ui-pg-button').tooltip({container:'body'});
		$(table).find('.ui-pg-div').tooltip({container:'body'});
	}

	// var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');

	// Menu
	$("#menu").menu();

});