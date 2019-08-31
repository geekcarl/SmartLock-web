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

function findOrderStatus(id)
{
	$.ajax( {
		type : "post",
		url : "boxeventandwarn.do?method=findOrderStatus",
		data: 'id=' + id,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				var temp = '';
				if (data.object != null)
				{
					if (data.object.done_type == 1)
					{
						temp = '未接受';
					}
					else if (data.object.done_type == 2)
					{
						temp = '已接受';
					}
					else if (data.object.done_type == 3)
					{
						temp = '已完成';
					}
					else if (data.object.done_type == 4)
					{
						temp = '任务超时';
					}
				}
				else
				{
					temp = '未绑定工单';
				}
				$('#span_' + id).html(temp);
			}
			else {
				alert('查询失败，请重试');
			}
		},
		error: function() {
			alert('查询失败，请重试');
		}
	});
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
		$('#controller_id').val(data.controller_id);
		$('#address').val(data.address);
		$('#department').val(data.department);
		$('#alarm_type').val(data.alarm_type);
		$('#alarm_time').val(data.alarm_time);
		$('#alarm_keys').val(data.alarm_keys);
		$('#alarm_operators').val(data.alarm_operators);
		$('#alarm_rfids').val(data.alarm_rfids);
		$('#is_affirmed').val(data.is_affirmed);
		$('#affirm_time').val(data.affirm_time);
		$('#affirm_user').val(data.affirm_user);
		$('#remarks').val(data.remarks);
		var dialog = $( "#dialog-view-alarm" ).removeClass('hide').dialog({
			modal: true,
			width: 700,
			height: 700,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看告警事件</h4></div>",
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
				alarms += 'ae[' + i + '].id=' + data.id + '&';
			}
			alarms = alarms.substring(0, alarms.length - 1);
			$.ajax( {
				type : "post",
				url : "boxeventandwarn.do?method=deleteAlarmEventPageByAjax",
				data: alarms,
				success : function(data) {
					isOvertime(data.resultMark);
					if (data.resultMark == 1)
					{
						$('#manage_grant_warn').show();
						$('#manage_grant_warn_label').html('删除告警记录成功！');
						mySetTimeOut('manage_grant_warn', 4000);
						$('#manage-grant-grid-table').trigger("reloadGrid");
					}
					else
					{
						$('#manage_grant_warn').show();
						$('#manage_grant_warn_label').html('删除告警记录失败，请重试！');
						mySetTimeOut('manage_grant_warn', 4000);
					}
				},
				error : function() {
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('删除告警记录失败，请重试！');
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
						if ($('#s_box_no').val() != '')
						{
							postData.box_no = $('#s_box_no').val(); 
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
						/*postData.is_affirmed = Number($(':radio[name="s_is_affirmed"]:checked').val()) + 1;
						if ($('#s_affirm_time').val() != '')
						{
							postData.affirm_time = $('#s_affirm_time').val() + ' 00:00:00';
						}
						if ($('#s_affirm_user').val() != '')
						{
							postData.affirm_user = $('#s_affirm_user').val(); 
						}*/
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

var g_autorefresh = null;

function autorefresh()
{
	var checked = document.getElementById("autorefresh").checked;
	if (checked == true)
	{
		g_autorefresh = window.setInterval("resetsearch()", 15000);
	}
	else
	{
		window.clearInterval(g_autorefresh);
	}
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


function affirm_warn(id)
{
	if (confirm('确定要确认此告警记录吗？'))
	{
		$.ajax( {
			type : "post",
			url : "boxeventandwarn.do?method=affirmAlarmEventByAjax",
			data: "id=" + id,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data.resultMark == 1)
				{
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('确认告警记录成功！');
					mySetTimeOut('manage_grant_warn', 4000);
					$('#manage-grant-grid-table').trigger("reloadGrid");
				}
				else
				{
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('确认告警记录失败，请重试！');
					mySetTimeOut('manage_grant_warn', 4000);
				}
			},
			error : function() {
				$('#manage_grant_warn').show();
				$('#manage_grant_warn_label').html('确认告警记录失败，请重试！');
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
		url: 'boxeventandwarn.do?method=listAlarmEventPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		//colNames:['ID', '确认操作', '光交箱编号', '控制器ID', '所属部门', '告警类型', '告警时间', '告警钥匙', '告警人员', '告警RFID', '是否已确认', '确认时间', '确认用户名', '备注'],
		colNames:['ID', '工单状态', '光交箱编号', '控制器ID', '所属部门', '告警类型', '告警时间', '告警钥匙', '告警人员', '告警RFID', '备注'],
		colModel:[
		    {name: 'id', index:'id', hidden:true},
		    /*{name:'operate', index:'operate', width: 110, sortable:false, formatter : function(cellvalue, options, rowObject){
		    		var id = rowObject.id, value = '';
		    		if ($('#boxwarn_affirm').val() == 'true') value = (rowObject.is_affirmed != 0 ? '' : ('<button onclick="affirm_warn(\'' + id + '\')" class="btn btn-xs btn-success">确认<i class="icon-ok icon-on-right"></i></button>'));
		    		return value;
				}
			},*/
		    {name:'status',index:'status', sortable:false, formatter:function(cellvalue, options, rowObject){
		    		value = '<button onclick="findOrderStatus(\'' + rowObject.id + '\')" class="btn btn-xs btn-success">查询</button><span style="margin-left:10px;" id="span_' + rowObject.id + '"></span>';
		    		return value;
				}
			},
		    {name:'box_no',index:'boxinfo.box_no', sortable:false},
		    {name:'controller_id',index:'controller_id'},
		    {name:'department',index:'department'},
			{name:'alarm_type',index:'alarm_type'},
			{name:'alarm_time',index:'alarm_time', width:200, formatter:function(cellvalue, options, rowObject){
					return rowObject.alarm_time == null ? "" : new Date(rowObject.alarm_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'alarm_keys',index:'alarm_keys'},
			{name:'alarm_operators',index:'alarm_operators'},
			{name:'alarm_rfids',index:'alarm_rfids'},
			/*{name:'is_affirmed',index:'is_affirmed', formatter:function(cellvalue, options, rowObject){
					return rowObject.is_affirmed == 0 ? "<font style='color:red;'>未确认<font>" : "已确认";
				}
			},
			{name:'affirm_time',index:'affirm_time', formatter:function(cellvalue, options, rowObject){
					return rowObject.affirm_time == null ? "" : new Date(rowObject.affirm_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'affirm_user',index:'affirm_user'},*/
			{name:'remarks',index:'remarks', hidden: true},
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
	g_obj.boxwarngrid = jQuery(manage_grant_grid_selector).jqGrid('navGrid', manage_grant_pager_selector,
		{ 	// navbar options
			edit: false,
			add: false,
			del: $('#boxwarn_delete').val() == 'true' ? true : false,
			delfunc : function () {
				delete_alarm();
			},
			delicon : 'icon-trash red',
			search: true,
			searchfunc : function () {
				detailsearch();
			},
			searchicon : 'icon-search orange',
			refresh: true,
			refreshicon : 'icon-refresh green',
			view: false,
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
	);
	if ($('#boxwarn_export').val() == 'true')
	{
		g_obj.boxwarngrid.navButtonAdd(manage_grant_pager_selector,{
	    	caption: '',
	    	title: '导出',
	        buttonicon:"icon-download",    //按钮icon
	        onClickButton: function(){    //执行操作
	          if (confirm('确定要导出告警记录吗？'))
	    	  {
	        	  window.location.target = "_blank";
	        	  if ($('#f_s_controller_id').val() != '' || $('#f_s_alarm_type').val() != '')
	        	  {
	        		  var temp = '';
	        		  if ($('#f_s_controller_id').val() != '') temp += '&controller_id=' + $('#f_s_controller_id').val();
	        		  if ($('#f_s_alarm_type').val() != '') temp += '&alarm_type=' + $('#f_s_alarm_type').val();
	        		  window.location.href = "boxeventandwarn.do?method=downloadBoxWarn" + temp;
	        	  }
	        	  else
	        	  {	        		  
	        		  window.location.href = "boxeventandwarn.do?method=downloadBoxWarn";
	        	  }
	    	  }
	        },    
	        position:"first"  //按钮位置 
	    });
	}


	
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