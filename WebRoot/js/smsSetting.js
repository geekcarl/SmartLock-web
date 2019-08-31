$(document).ready(function(){

});

var g_obj = {};
g_obj.u_tree1 = null;
g_obj.u_tree2 = null;
g_obj.u_tree3= null;
g_obj.tree1 = null;
g_obj.tree2 = null;
g_obj.tree3 = null;

function rightMenuMouseOver() {
}

function rightMenuMouseOut() {
}


//操作表格
function getDel(k){
 $(k).parent().remove();
}

//操作表格结束

//取消选择部门
function cancelDepartment(name, id) {
    $('#' + id).val('');
    $('#' + name).val('');
}


//显示选择部门窗口
function chooseDepartment(name, id) {
	g_obj.chooseDepartment = {name : name, id : id};
	var dialog = $( "#dialog-department-tree" ).removeClass('hide').dialog({
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


//快速检索
function fastsearch() {

	var user_name = $('#f_s_user_name').val();
	var type = $('#f_s_type').val();
	var boxno = $('#f_s_boxno').val();
	var controllerid = $('#f_s_controllerid').val();
	//var dep = $('#f_s_department_id').val();

	if (user_name != '' || type != '' || boxno != ''|| controllerid != '')
	{
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
	        postData:null, //发送搜索条件 
	    });
		var postData = {};
		if (user_name != '')  postData.user_name = user_name;
		if (type != '')  postData.type = type;
		if (boxno != '')  postData.boxno = boxno;
		if (controllerid != '')  postData.controllerid = controllerid;
		//if (dep != '')  postData.dep = dep;
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
          url:'boxinfo.do?method=smsSettingList',//你的搜索程序地址 
          postData:postData, //发送搜索条件 
          page:1 
      }).trigger("reloadGrid"); //重新载入
	}
}

function resetsearch()
{

	$('#f_s_user_name').val('');
	$('#f_s_type').val('');
	$('#f_s_boxno').val('');
	$('#f_s_controllerid').val('');
	//$('#f_s_department_id').val('');
   // $('#f_s_department_name').val('');

	$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
	      postData:null, //发送搜索条件 
	});
	var postData = {
			rows : 10,
			page : 1
	};
	$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
      url:'boxinfo.do?method=smsSettingList',//你的搜索程序地址 
      postData:postData, //发送搜索条件 
      page:1 
  }).trigger("reloadGrid"); //重新载入
}



jQuery(function($) {
	
	
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
	


	
	//绑定钥匙授权列表
	jQuery(manage_grant_grid_selector).jqGrid({
	
		url: 'boxinfo.do?method=smsSettingList',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','光交箱编号', '告警类型', '用户名', '姓名','电话', '备注'],
		colModel:[
			{name:'id',index:'id', width:60, sorttype:"int", hidden: true},
			{name:'box',index:'box.box_no', formatter:function(cellvalue, options, rowObject){
					return rowObject.box == null ? "" : rowObject.box;
				}
			},
			{name:'stateValue',index:'stateValue.state_value', formatter:function(cellvalue, options, rowObject){
					return rowObject.stateValue == null ? "" : rowObject.stateValue;
				}
			},
			{name:'user_name',index:'user.user_name', formatter:function(cellvalue, options, rowObject){
					return rowObject.user_name == null ? "" : rowObject.user_name;
				}
			},
			{name:'full_name',index:'user.full_name', formatter:function(cellvalue, options, rowObject){
					return rowObject.full_name == null ? "" : rowObject.full_name;
				}
			},
			{name:'phone_no',index:'user.phone_no', formatter:function(cellvalue, options, rowObject){
					return rowObject.phone_no == null ? "" : rowObject.phone_no;
				}
			},
			{name:'remarks',index:'remarks', sortable: false}
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : manage_grant_pager_selector,
		altRows: true,
		// toppager: true,
		ondblClickRow: function() {
			var table = this;
			console.log($('#manage-grant-grid-table').jqGrid('getGridParam','selarrrow'));
		},
		onRightClickRow: function(rowid,irow,icol,e) {
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


// 绑定钥匙授权列表分页
	jQuery(manage_grant_grid_selector).jqGrid('navGrid', manage_grant_pager_selector,
		{ 	// navbar options
		    edit: false,
			editfunc: function(){
			},
			add: $('#smssetting_add').val() == 'true' ? true : false,
			addfunc: function(){
				g_obj.keys_sels = [];
				g_obj.boxes_sels = [];
				g_obj.operators_sels = [];
				$.ajax( {
					type : "post",
					url : "dictionary.do?method=listStateKeyValueTree",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{
							g_obj.keys = data.tree;
							$('#tree_div1').html('<div id="tree1" class="ztree"></div>');
							var setting = {
								view: {
									selectedMulti: false
								},
								check: {
									enable: true
								},
								data: {
									simpleData: {
										enable: true
									}
								},
								callback: {
									onCheck: function (e, treeId, treeNode) {
										var zTree = $.fn.zTree.getZTreeObj("tree1");
										g_obj.keys_sels = zTree.getCheckedNodes(true);
									}
								}
							};
							$.fn.zTree.init($("#tree1"), setting, data.tree);
						}
					}
				});
				$.ajax( {
					type : "post",
					url : "boxinfo.do?method=listDepartmentBoxTree",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{
							$('#tree_div2').html('<div id="tree2" class="ztree"></div>');
							g_obj.boxes = data.tree;
							var setting = {
								view: {
									selectedMulti: true
								},
								check: {
									enable: true
								},
								data: {
									simpleData: {
										enable: true
									}
								},
								callback: {
									onCheck: function (e, treeId, treeNode) {
										var zTree = $.fn.zTree.getZTreeObj("tree2");
										g_obj.boxes_sels = zTree.getCheckedNodes(true);
									}
								}
							};
							$.fn.zTree.init($("#tree2"), setting, data.tree);
						}
					},
					error : function () {
						console.log('get listDepartmentBoxTree error');
					}
				});
				$.ajax( {
					type : "post",
					url : "operators.do?method=listDepartmentOperTree",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{
							g_obj.operators = data.tree;
							$('#tree_div3').html('<div id="tree3" class="ztree"></div>');
							var setting = {
								view: {
									selectedMulti: false
								},
								check: {
									enable: true,
									
								},
								data: {
									simpleData: {
										enable: true
									}
								},
								callback: {
										beforeCheck: function (treeId, treeNode) {
										var zTree = $.fn.zTree.getZTreeObj("tree3");
										g_obj.operators_sels = zTree.getCheckedNodes(true);
										if (treeNode.type == 1)
										{
											return false;
										}
										else
										{
										if (treeNode.havephone == 0 )
											{
												alert('该人员未填写手机号码，请先在用户信息中补充手机号码');
												return false;
											}
										}
									
										return true;
									},
									onCheck: function (e, treeId, treeNode) {
										var zTree = $.fn.zTree.getZTreeObj("tree3");
										g_obj.operators_sels = zTree.getCheckedNodes(true);

										
									}
								}
							};
							$.fn.zTree.init($("#tree3"), setting, data.tree);
						}
					}
				});
				var dialog = $( "#dialog-add-grant" ).removeClass('hide').dialog({
					modal: true,
					width: 1000,
					height: 700,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加短信告警设置</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if (g_obj.keys_sels.length > 0 && g_obj.operators_sels.length > 0 && g_obj.operators_sels.length > 0)
								{
									var grant = '';
									grant += '&remarks=' + $('#a_remarks').val();
									var temp = 0;
									for (var i = 0; i < g_obj.boxes_sels.length; i ++)
									{
										if (g_obj.boxes_sels[i].type == 2)
										{
											grant += '&bis[' + temp + '].id=' + g_obj.boxes_sels[i].id;
											temp ++;
										}
									}
									temp = 0;
									for (var i = 0; i < g_obj.keys_sels.length; i ++)
									{
										if (g_obj.keys_sels[i].type == 2)
										{
											grant += '&svs[' + temp + '].id=' + g_obj.keys_sels[i].id;
											temp ++;
										}
									}
									temp = 0;
									for (var i = 0; i < g_obj.operators_sels.length; i ++)
									{
										if (g_obj.operators_sels[i].type == 2)
										{
											grant += '&us[' + temp + '].id=' + g_obj.operators_sels[i].id;
											temp ++;
										}
									}
									$.ajax( {
										type : "post",
										url : "boxinfo.do?method=smsset",
										data: grant,
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#manage_grant_warn').show();
												$('#manage_grant_warn_label').html('添加短信告警设置成功！');
												mySetTimeOut('manage_grant_warn', 4000);
												$('#manage-grant-grid-table').trigger("reloadGrid");
											}
											else
											{
												$('#manage_grant_warn').show();
												$('#manage_grant_warn_label').html('添加短信告警设置失败，请重试！');
												mySetTimeOut('manage_grant_warn', 4000);
											}
											$("#dialog-add-grant").dialog("close"); 
										},
										error : function() {
											$('#manage_grant_warn').show();
											$('#manage_grant_warn_label').html('添加短信告警设置失败，请重试！');
											mySetTimeOut('manage_grant_warn', 4000);
											$( "#dialog-add-grant" ).dialog("close"); 
										}
									});
								}
								else
								{
									alert('请检查表单是否填写完整!');
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-add-grant" ).dialog( "close" ); 
							} 
						}
					]
				});
			},
			addicon : 'icon-plus-sign purple',
			del: $('#smssetting_delete').val() == 'true' ? true : false,
			delfunc : function () {
				var array = $('#manage-grant-grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#manage_grant_warn').show();
					$('#manage_grant_warn_label').html('请选择至少一行数据！');
					mySetTimeOut('manage_grant_warn', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，你确认要删除吗？"))
					{
						var ids = [];
						for (var i = 0; i < array.length; i ++)
						{
							ids.push(array[i]);
						}
						$.ajax( {
							type : "post",
							url : "boxinfo.do?method=deleteSmsset",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(ids),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#manage_grant_warn').show();
									$('#manage_grant_warn_label').html('删除短信告警设置成功！');
									mySetTimeOut('manage_grant_warn', 4000);
									$('#manage-grant-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#manage_grant_warn').show();
									$('#manage_grant_warn_label').html('删除短信告警失败，请重试！');
									mySetTimeOut('manage_grant_warn', 4000);
								}
							},
							error : function() {
								$('#manage_grant_warn').show();
								$('#manage_grant_warn_label').html('删除短信告警设置失败，请重试！');
								mySetTimeOut('manage_grant_warn', 4000);
							}
						});
					}
				}
			},
			delicon : 'icon-trash red',
			search: false,
			searchicon : 'icon-search orange',
			refresh: true,
			refreshicon : 'icon-refresh green',
			view: false,
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