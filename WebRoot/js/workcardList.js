$(document).ready(function(){

});

var g_obj = {};

function rightMenuMouseOver() {
}

function rightMenuMouseOut() {
}


//快速检索
function fastsearch() {
	var type = $('#f_s_type').val();
	var full_name = $('#f_s_full_name').val();
	if (type != '' || full_name != '')
	{
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
	        postData:null, //发送搜索条件 
	    });
		var postData = {};
		if (type != '') postData.type = type;
		if (full_name != '') postData['user.full_name'] = full_name;
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
          url:'user.do?method=workcardListByPager',//你的搜索程序地址 
          postData:postData, //发送搜索条件 
          page:1 
      }).trigger("reloadGrid"); //重新载入
	}
}


//重置搜索
function resetsearch()
{
	$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
	      postData:null, //发送搜索条件 
	});
	var postData = {
			rows : 10,
			page : 1
	};
	$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
      url:'user.do?method=workcardListByPager',//你的搜索程序地址 
      postData:postData, //发送搜索条件 
      page:1 
  }).trigger("reloadGrid"); //重新载入
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

//显示选择人员窗口
function chooseUser(name, id) {
	g_obj.chooseUser = {name : name, id : id};
	$.ajax( {
		type : "post",
		url : "operators.do?method=listDepartmentOperTree",
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				$('#user_tree_div').html('<div id="user_tree_ul" class="ztree"></div>');
				g_obj.users = data.tree;
				var setting = {
					view: {
						selectedMulti: false
					},
					data: {
						simpleData: {
							enable: true
						}
					},
					callback: {
						onClick: function (e, treeId, treeNode) {
							if (treeNode.type == 2)
							{
								$('#' + g_obj.chooseUser.name).val(treeNode.name);
								$('#' + g_obj.chooseUser.id).val(treeNode.id);
					        	$( "#dialog-user-tree" ).dialog("close"); 
							}
						}
					}
				};
				g_obj.user_tree = $.fn.zTree.init($("#user_tree_ul"), setting, data.tree);
				var dialog = $( "#dialog-user-tree" ).removeClass('hide').dialog({
					width: 500,
					height: 400,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>选择人员</h4></div>",
					title_html: true,
					buttons: [
					          {
					        	  text: "取消",
					        	  "class" : "btn btn-primary btn-xs",
					        	  click: function() {
						        	  $( "#dialog-user-tree" ).dialog("close"); 
						          } 
					          }
					         ]
				});
			}
		}
	});
}

//取消选择人员
function cancelUser(name, id) {
    $('#' + id).val('');
    $('#' + name).val('');
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

function edit_alarm() {
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
		$('#manage_grant_warn_label').html('只能选择一行数据！');
		mySetTimeOut('manage_grant_warn', 4000);
	}
	else
	{
		var data = $('#manage-grant-grid-table').jqGrid('getRowData', array[0]);
		$.ajax( {
			type : "post",
			url : "user.do?method=findRFID",
			data: "id=" + data.id,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data.resultMark == 1)
				{
					$('#u_id').val(data.object.id);
					$('#u_type').val(data.object.type);
					$('#u_remark').val(data.object.remark);
					if (data.object.dep != null)
					{
						$('#u_department_name').val(data.object.dep.name);
						$('#u_department_id').val(data.object.dep.id);
					}
					if (data.object.user != null)
					{
						$('#u_user_name').val(data.object.user.full_name);
						$('#u_user_id').val(data.object.user.id);
					}
					if (data.object.manager != null)
					{
						$('#u_manage_name').val(data.object.manager.full_name);
						$('#u_manage_id').val(data.object.manager.id);
					}
					var dialog = $( "#dialog-u-rfid" ).removeClass('hide').dialog({
						modal: true,
						width: 900,
						height: 400,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改工作卡</h4></div>",
						title_html: true,
						buttons: [ 
							{
								text: "确定",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									if ($('#u_form').valid())
									{
										var rfid = '';
										rfid += 'id=' +  $('#u_id').val();
										rfid += '&type=' +  $('#u_type').val();
										rfid += '&remark=' + $('#u_remark').val();
										if ($('#u_department_name').val() != null && $('#u_department_name').val() != '')
										{
											rfid += '&dep.id=' + $('#u_department_id').val();
										}
										if ($('#u_user_name').val() != null && $('#u_user_name').val() != '')
										{
											rfid += '&user.id=' + $('#u_user_id').val();
										}
										if ($('#u_manage_name').val() != null && $('#u_manage_name').val() != '')
										{
											rfid += '&manager.id=' + $('#u_manage_id').val();
										}
										$.ajax( {
											type : "post",
											url : "user.do?method=updateRFID",
											data: rfid,
											success : function(data) {
												isOvertime(data.resultMark);
												if (data.resultMark == 1)
												{
													$('#manage_grant_warn').show();
													$('#manage_grant_warn_label').html('修改工作卡成功！');
													mySetTimeOut('manage_grant_warn', 4000);
													$('#manage-grant-grid-table').trigger("reloadGrid");
												}
												else
												{
													$('#manage_grant_warn').show();
													$('#manage_grant_warn_label').html('修改工作卡失败，请重试！');
													mySetTimeOut('manage_grant_warn', 4000);
												}
												$( "#dialog-u-rfid" ).dialog( "close" ); 
											},
											error : function() {
												$('#manage_grant_warn').show();
												$('#manage_grant_warn_label').html('修改工作卡失败，请重试！');
												mySetTimeOut('manage_grant_warn', 4000);
												$( "#dialog-u-rfid" ).dialog( "close" ); 
											}
										});
									}
								} 
							},
							{
								text: "取消",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( "#dialog-u-rfid" ).dialog( "close" ); 
								} 
							}
						]
					});
				}
				else
				{
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('获取工作卡记录失败，请重试！');
					mySetTimeOut('manage_grant_warn', 4000);
				}
			},
			error : function() {
				$('#manage_grant_warn').show();
				$('#manage_grant_warn_label').html('获取工作卡记录失败，请重试！');
				mySetTimeOut('manage_grant_warn', 4000);
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
				url : "user.do?method=deleteRFID",
				data: "rfids=" + alarms,
				success : function(data) {
					isOvertime(data.resultMark);
					if (data.resultMark == 1)
					{
						$('#manage_grant_warn').show();
						$('#manage_grant_warn_label').html('删除工作卡记录成功！');
						mySetTimeOut('manage_grant_warn', 4000);
						$('#manage-grant-grid-table').trigger("reloadGrid");
					}
					else
					{
						$('#manage_grant_warn').show();
						$('#manage_grant_warn_label').html('删除工作卡记录失败，请重试！');
						mySetTimeOut('manage_grant_warn', 4000);
					}
				},
				error : function() {
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('删除工作卡记录失败，请重试！');
					mySetTimeOut('manage_grant_warn', 4000);
				}
			});
		}
	}
}

jQuery(function($) {
	//验证搜索条件
	$("#a_form").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
        rules:{ //定义验证规则 
			a_type: {
				required: true
		 	},
		 	a_department_name: {
		 		required: true
			}
         }, 
         messages:{ //定义提示信息 
			a_type: {
				required: '卡号不能为空'
		 	},
		 	a_department_name: {
		 		required: '部门不能为空'
			}
         } 
    });
	


	$("#u_form").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
        rules:{ //定义验证规则 
			u_type: {
				required: true
		 	},
		 	u_department_name: {
		 		required: true
			}
         }, 
         messages:{ //定义提示信息 
			u_type: {
				required: '卡号不能为空'
		 	},
		 	u_department_name: {
		 		required: '部门不能为空'
			}
         } 
    });
	
	//绑定告警列表
	jQuery(manage_grant_grid_selector).jqGrid({
		// direction: "rtl",
		url: 'user.do?method=workcardListByPager',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['id', '卡号', '卡片状态', '所属单位', '使用人', '管理人', '备注'],
		colModel:[
		    {name:'id',index:'id',hidden:true},
			{name:'type',index:'type'},
			{name:'status',index:'status',formatter:function(cellvalue, options, rowObject) {
					return rowObject.status == 0 ? '异常' : '正常';
				}
			},
			{name:'dep',index:'dep.name',formatter:function(cellvalue, options, rowObject) {
					return rowObject.dep == null ? '' : rowObject.dep;
				}
			},
			{name:'user',index:'user.full_name',formatter:function(cellvalue, options, rowObject){
					return rowObject.user == null ? '' : rowObject.user;
				}
			},
			{name:'manager',index:'manager.full_name',formatter:function(cellvalue, options, rowObject){
					return rowObject.manager == null ? '' : rowObject.manager;
				}
			},
			{name:'remark',index:'remark'}
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
			edit: $('#workcard_update').val() == 'true' ? true : false,
			editfunc : function() {
				edit_alarm();
			},
			editicon : 'icon-pencil blue',
			add: $('#workcard_add').val() == 'true' ? true : false,
			addfunc : function () {
				var dialog = $( "#dialog-a-rfid" ).removeClass('hide').dialog({
					modal: true,
					width: 900,
					height: 400,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加工作卡</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#a_form').valid())
								{
									var rfid = '';
									rfid += 'type=' +  $('#a_type').val();
									rfid += '&remark=' + $('#a_remark').val();
									if ($('#a_department_name').val() != null && $('#a_department_name').val() != '')
									{
										rfid += '&dep.id=' + $('#a_department_id').val();
									}
									if ($('#a_user_name').val() != null && $('#a_user_name').val() != '')
									{
										rfid += '&user.id=' + $('#a_user_id').val();
									}
									if ($('#a_manage_name').val() != null && $('#a_manage_name').val() != '')
									{
										rfid += '&manager.id=' + $('#a_manage_id').val();
									}
									$.ajax( {
										type : "post",
										url : "user.do?method=addRFID",
										data: rfid,
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#manage_grant_warn').show();
												$('#manage_grant_warn_label').html('添加工作卡成功！');
												mySetTimeOut('manage_grant_warn', 4000);
												$('#manage-grant-grid-table').trigger("reloadGrid");
											}
											else
											{
												$('#manage_grant_warn').show();
												$('#manage_grant_warn_label').html('添加工作卡失败，请重试！');
												mySetTimeOut('manage_grant_warn', 4000);
											}
											$( "#dialog-a-rfid" ).dialog( "close" ); 
										},
										error : function() {
											$('#manage_grant_warn').show();
											$('#manage_grant_warn_label').html('添加工作卡失败，请重试！');
											mySetTimeOut('manage_grant_warn', 4000);
											$( "#dialog-a-rfid" ).dialog( "close" ); 
										}
									});
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-a-rfid" ).dialog( "close" ); 
							} 
						}
					]
				});
			},
			addicon : 'icon-plus-sign purple',
			del: $('#workcard_delete').val() == 'true' ? true : false,
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