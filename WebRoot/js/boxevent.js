$(document).ready(function(){

});

var g_obj = {};

function rightMenuMouseOver() {
}

function rightMenuMouseOut() {
}


//操作表格
function getDel(k){
 $(k).parent().remove();
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

//查看
function view_door() {
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
		$('#open_time').val(data.open_time);
		$('#open_keys').val(data.open_keys);
		$('#open_operators').val(data.open_operators);
		$('#open_rfids').val(data.open_rfids);
		$('#close_time').val(data.close_time);
		$('#close_keys').val(data.close_keys);
		$('#close_operators').val(data.close_operators);
		$('#close_rfids').val(data.close_rfids);
		$('#remarks').val(data.remarks);
		var dialog = $( "#dialog-view-door" ).removeClass('hide').dialog({
			modal: true,
			width: 700,
			height: 600,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看开关门事件</h4></div>",
			title_html: true,
			buttons: [ 
			          {
			        	  text: "确定",
			        	  "class" : "btn btn-primary btn-xs",
			        	  click: function() {
				        	  $( "#dialog-view-door" ).dialog( "close" ); 
				          } 
			          }
			]
		});
	}
}

function delete_door()
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
				alarms += 'de[' + i + '].id=' + data.id + '&';
			}
			alarms = alarms.substring(0, alarms.length - 1);
			$.ajax( {
				type : "post",
				url : "boxeventandwarn.do?method=deleteDoorEventPageByAjax",
				data: alarms,
				success : function(data) {
					isOvertime(data.resultMark);
					if (data.resultMark == 1)
					{
						$('#manage_grant_warn').show();
						$('#manage_grant_warn_label').html('删除开关门记录成功！');
						mySetTimeOut('manage_grant_warn', 4000);
						$('#manage-grant-grid-table').trigger("reloadGrid");
					}
					else
					{
						$('#manage_grant_warn').show();
						$('#manage_grant_warn_label').html('删除开关门记录失败，请重试！');
						mySetTimeOut('manage_grant_warn', 4000);
					}
				},
				error : function() {
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('删除开关门记录失败，请重试！');
					mySetTimeOut('manage_grant_warn', 4000);
				}
			});
		}
	}
}

//快速检索
function fastsearch() {
	var controller_id = $('#f_s_controller_id').val(); 
	var box_no = $('#f_s_box_no').val(); 
	
	var filter  = /^[0-9]*$/;
	if (controller_id != '' || box_no !='')
	{
		//if (filter.test(controller_id))
		//{
			$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
	            postData:null, //发送搜索条件 
	        });
			//var postData = {};
			//postData.controller_id = controller_id;

			 var data = '0=0';
		     if (box_no != '') data += '&box_no=' + box_no;
		     if (controller_id != '') data += '&controller_id=' + controller_id;

			$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
	            url:'boxeventandwarn.do?method=listBoxEventPageByAjax',//你的搜索程序地址 
	            postData:data, //发送搜索条件 
	            page:1 
	        }).trigger("reloadGrid"); //重新载入
		//}
		//else
		//{
			//alert('控制器ID为整数');
		//}
	}
}

function detailsearch()
{
	var dialog = $( "#dialog-search-door" ).removeClass('hide').dialog({
		modal: true,
		width: 1000,
		height: 600,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>检索开关门事件</h4></div>",
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
						if ($('#s_open_time').val() != '')
						{
							postData.open_time = $('#s_open_time').val() + ' 00:00:00';
						}
						if ($('#s_open_keys').val() != '')
						{
							postData.open_keys = $('#s_open_keys').val(); 
						}
						if ($('#s_open_operators').val() != '')
						{
							postData.open_operators = $('#s_open_operators').val(); 
						}
						if ($('#s_open_rfids').val() != '')
						{
							postData.open_rfids = $('#s_open_rfids').val(); 
						}
						if ($('#s_close_time').val() != '')
						{
							postData.close_time = $('#s_close_time').val() + ' 00:00:00';
						}
						if ($('#s_close_keys').val() != '')
						{
							postData.close_keys = $('#s_close_keys').val(); 
						}
						if ($('#s_close_operators').val() != '')
						{
							postData.close_operators = $('#s_close_operators').val(); 
						}
						if ($('#s_close_rfids').val() != '')
						{
							postData.close_rfids = $('#s_close_rfids').val(); 
						}
						$("#manage-grant-grid-table").jqGrid('setGridParam',{
					        url:'boxeventandwarn.do?method=listBoxEventPageByAjax',//你的搜索程序地址 
					        postData:postData, //发送搜索条件 
					        page:1 
					    }).trigger("reloadGrid"); //重新载入
						$( "#dialog-search-door" ).dialog( "close" );
					}
				} 
			}
		]
	});
}

function resetsearch()
{
	$('#f_s_controller_id').val('');
	$('#f_s_box_no').val('');
	
	$('#d_search_form')[0].reset();
	$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
        postData:null, //发送搜索条件 
    });
	var postData = {
			rows : 10,
			page : 1
	};
	$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
        url:'boxeventandwarn.do?method=listBoxEventPageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入
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
		 	s_open_time: {
		 		dateISO: true
			},
			s_close_time: {
				dateISO: true
			}
         }, 
         messages:{ //定义提示信息 
 			s_controller_id: {
				digits: '控制器ID必须为整数'
		 	},
		 	s_open_time: {
		 		dateISO: '必须是日期格式，例如2009-06-23'
			},
			s_close_time: {
				dateISO: '必须是日期格式，例如2009-06-23'
			}
         } 
    });
	
	
	//绑定开关门列表
	jQuery(manage_grant_grid_selector).jqGrid({
		// direction: "rtl",
		url: 'boxeventandwarn.do?method=listBoxEventPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID', '光交箱编号', '控制器ID', '光交箱地址', '所属部门', '开门时间', '开门钥匙', '开门人员', '开门RFID', '关门时间', '关门钥匙', '关门人员', '关门RFID', '备注'],
		colModel:[
		    {name:'id', index:'id', hidden:true},
		    {name:'boxinfo',index:'boxinfo.box_no', sortable: false, formatter:function(cellvalue, options, rowObject){
					return rowObject.boxinfo == null ? "" : rowObject.boxinfo.box_no;
				}
			},
		    {name:'boxinfo',index:'controller_id', formatter:function(cellvalue, options, rowObject){
					return rowObject.boxinfo == null ? "" : rowObject.boxinfo.controller_id;
				}
			},
		    {name:'boxinfo',index:'address', formatter:function(cellvalue, options, rowObject){
					return rowObject.boxinfo == null ? "" : rowObject.boxinfo.address;
				}
			},
			{name:'boxinfo',index:'department', formatter:function(cellvalue, options, rowObject){
					return rowObject.boxinfo == null ? "" : rowObject.boxinfo.department.name;
				}
			},
			{name:'open_time',index:'open_time', formatter:function(cellvalue, options, rowObject){
					return rowObject.open_time == null ? "" : new Date(rowObject.open_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'open_keys',index:'open_keys'},
			{name:'open_operators',index:'open_operators'},
			{name:'open_rfids',index:'open_rfids'},
			{name:'close_time',index:'close_time', formatter:function(cellvalue, options, rowObject){
					return rowObject.close_time == null ? "" : new Date(rowObject.close_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'close_keys',index:'close_keys'},
			{name:'close_operators',index:'close_operators'},
			{name:'close_rfids',index:'close_rfids'},
			{name:'remarks',index:'remarks', hidden: true},
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : manage_grant_pager_selector,
		altRows: true,
		// toppager: true,
		ondblClickRow: function(rowid, irow, icol, e) {
			view_door(rowid);
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

	// 绑定锁列表分页
	g_obj.boxeventgrid = jQuery(manage_grant_grid_selector).jqGrid('navGrid', manage_grant_pager_selector,
		{ 	// navbar options
			edit: false,
			editicon : 'icon-pencil blue',
			add: false,
			addicon : 'icon-plus-sign purple',
			del: $('#boxevent_delete').val() == 'true' ? true : false,
			delfunc : function () {
				delete_door();
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
				view_door();
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
	if ($('#boxevent_export').val() == 'true')
	{
		g_obj.boxeventgrid.navButtonAdd(manage_grant_pager_selector,{
	    	caption: '',
	    	title: '导出',
	        buttonicon:"icon-download",    //按钮icon
	        onClickButton: function(){    //执行操作
	          if (confirm('确定要导出开关门记录吗？'))
	    	  {
	        	  window.location.target = "_blank";
	        	  if ($('#f_s_controller_id').val() != '')
	        	  {
	        		  window.location.href = "boxeventandwarn.do?method=downloadBoxEvent&controller_id=" + $('#f_s_controller_id').val();
	        	  }
	        	  else
	        	  {
	        		  window.location.href = "boxeventandwarn.do?method=downloadBoxEvent";
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