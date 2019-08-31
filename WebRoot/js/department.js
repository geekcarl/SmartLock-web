var g_obj = {};
g_obj.rightMenuMouseOver = false;
function rightMenuMouseOver() {
}
function rightMenuMouseOut() {
}
$(document).ready(function(){

});

//显示选择部门窗口
function chooseDepartment(name, id, nameid) {
	$.ajax( {
		type : "post",
		url : "department.do?method=findAllByAjax",
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null && data != '')
			{
				// 绑定部门树
				$('#department_tree').tree({
				      data:  data,
				      onClick:  function(node, $link) {
				      	if (g_obj.chooseDepartment.nameid != null && g_obj.chooseDepartment.nameid != '')
				      	{
					      	if ($('#' + g_obj.chooseDepartment.nameid).val() != node.id)
					      	{
						        $('#' + g_obj.chooseDepartment.id).val(node.id);
						        $('#' + g_obj.chooseDepartment.name).val(node.text);
					      	}
				      	} 
					    $( "#dialog-department-tree" ).dialog( "close" );
				      }
				});
				// 绑定部门树结束
				g_obj.chooseDepartment = {name : name, id : id, nameid : nameid};
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
		}
	});
}

//取消选择部门
function cancelDepartment(name, id) {
    $('#' + id).val('');
    $('#' + name).val('');
}

//快速检索
function fastsearch() {
	var name = $('#f_s_name').val();
var parent_name = $('#f_s_parent_name').val();
var address = $('#f_s_address').val();
var contact = $('#f_s_contact').val();
if (name != '' || parent_name != '' || address != '' || contact != '')
{
	$("#grid-table").jqGrid('setGridParam',{ 
      postData:null, //发送搜索条件 
  });
	var postData = {};
	postData.name = name;
	postData.parent_name = parent_name;
	postData.address = address;
	postData.contact = contact;
	$("#grid-table").jqGrid('setGridParam',{ 
      url:'department.do?method=listPageByAjax',//你的搜索程序地址 
      postData:postData, //发送搜索条件 
      page:1 
  }).trigger("reloadGrid"); //重新载入
	}
}

function resetsearch()
{
	$("#grid-table").jqGrid('setGridParam',{ 
  postData:null, //发送搜索条件 
  });
	var postData = {
			rows : 10,
			page : 1
	};
	$("#grid-table").jqGrid('setGridParam',{ 
  url:'department.do?method=listPageByAjax',//你的搜索程序地址 
  postData:postData, //发送搜索条件 
      page:1 
  }).trigger("reloadGrid"); //重新载入
}


function edit(id)
{
	$('#rightclick_contextmenu').hide();
	var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
	if (array.length <= 0 && id == null)
	{
		$('#manage_department_warn').show();
		$('#manage_department_warn_label').html('请选择一行数据！');
		mySetTimeOut('manage_department_warn', 4000);
	}
	else if (array.length > 1 && id == null)
	{
		$('#manage_department_warn').show();
		$('#manage_department_warn_label').html('只能选择一行数据！');
		mySetTimeOut('manage_department_warn', 4000);
	}
	else
	{
		if (array.length <= 0 && id == null && g_obj.rightClickRowData != null)
		{
			id = g_obj.rightClickRowData.id;
		}
		$.ajax( {
			type : "post",
			url : "department.do?method=findByAjax",
			data : "id=" + (id != null && id > 0 ? id : array[0]),
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null)
				{
					$('#u_de_id').val(data.id);
					$('#u_de_name').val(data.name);
					$('#u_de_address').val(data.address);
					$('#u_de_type').val(data.type);
					$('#u_de_contact').val(data.contact);
					$('#u_de_remarks').val(data.remarks);
					if (data.parent != null)
					{
						$('#u_de_department_name').val(data.parent.name);
						$('#u_de_department_id').val(data.parent.id);
					}
					var dialog = $( "#dialog-update-de" ).removeClass('hide').dialog({
						modal: true,
						width: 900,
						height: 500,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改部门</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "确定",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									if ($("#u_form").valid())
									{
										var de = {};
										de.id = $('#u_de_id').val();
										de.name = $('#u_de_name').val();
										if ($('#u_de_department_name').val() != '')
										{
											de.parent = {};
											de.parent.id = $('#u_de_department_id').val();
										}
										de.type = $('#u_de_type').val();
										de.address = $('#u_de_address').val();
										de.contact = $('#u_de_contact').val();
										de.remarks = $('#u_de_remarks').val();
										$.ajax( {
											type : "post",
											url : "department.do?method=update",
											contentType : "application/json;charset=UTF-8",
											data:JSON.stringify(de),
											dataType: "json", 
											success : function(data) {
												isOvertime(data.resultMark);
												if (data.resultMark == 1)
												{
													$('#manage_department_warn').show();
													$('#manage_department_warn_label').html('修改部门成功！');
													mySetTimeOut('manage_department_warn', 4000);
													$('#grid-table').trigger("reloadGrid");
												}
												else
												{
													$('#manage_department_warn').show();
													$('#manage_department_warn_label').html('修改部门失败，请重试！');
													mySetTimeOut('manage_department_warn', 4000);
												}
												$( "#dialog-update-de" ).dialog( "close" ); 
											},
											error : function() {
												$('#manage_department_warn').show();
												$('#manage_department_warn_label').html('修改部门失败，请重试！');
												mySetTimeOut('manage_department_warn', 4000);
												$( "#dialog-update-de" ).dialog( "close" ); 
											}
										});
										$( this ).dialog( "close" ); 
									}
								} 
							},
							{
								text: "取消",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( this ).dialog( "close" ); 
								} 
							}
						]
					});
				}
			}
		});
	}
	return false;
}


jQuery(function($) {
	
	//验证部门添加
	g_obj.a_form_validator = $("#a_form").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
        rules:{ //定义验证规则 
			a_de_name: {
				required: true
		 	}
         }, 
         messages:{ //定义提示信息 
        	 a_de_name: {
        	 	required: '部门名称不能为空!'
		 	}
         } 
    });
	
	//验证部门修改
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
			u_de_name: {
				required: true
		 	}
         }, 
         messages:{ //定义提示信息 
        	u_de_name: {
        	 	required: '部门名称不能为空!'
		 	}
         } 
    });

var grid_selector = "#grid-table";
var pager_selector = "#grid-pager";
//override dialog's title function to allow for HTML titles
$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
	_title: function(title) {
		var $title = this.options.title || '&nbsp;'
		if( ("title_html" in this.options) && this.options.title_html == true )
			title.html($title);
		else title.text($title);
	}
}));

jQuery(grid_selector).jqGrid({
	//direction: "rtl",
	url: 'department.do?method=listPageByAjax',
	datatype: 'json',
	mtype: 'post',
	prmNames: {sort: 'sort', order: 'order'},
	height: 'auto',
	loadtext: '加载中...',
	colNames:['ID','名称', '全称', '上级部门', '类型', '地址', '联系方式', '备注'],
	colModel:[
		{name:'id',index:'id', width:60, sorttype:"int", hidden: true},
		{name:'name',index:'name',width:70},
		{name:'full_name',index:'full_name', width:90},
		{name:'parent',index:'parent.name', width:90, formatter:function(cellvalue, options, rowObject){
				var temp = '';
				if (rowObject.parent != null)
				{
					temp = rowObject.parent.name;
				}
				return temp;
			}
		},
		{name:'type',index:'type', width:90, formatter:function(cellvalue, options, rowObject){
				return rowObject.type == 1 ? '管理' : '运维';
			}
		},
		{name:'address',index:'address', width:120},
		{name:'contact',index:'contact', width:120},
		{name:'remarks',index:'remarks', width:120}
	], 

	viewrecords : true,
	rowNum:10,
	rowList:[10,20,30,50,80],
	pager : pager_selector,
	altRows: true,
	//toppager: true,
	ondblClickRow: function(rowid,irow,icol,e) {
		var table = this;
		g_obj.rightClickNode = rowid;
		g_obj.rightClickRowData = $('#grid-table').jqGrid('getRowData',rowid);
		edit(g_obj.rightClickRowData.id);
	},
	onRightClickRow: function(rowid,irow,icol,e) {
		g_obj.rightClickPos = {
				pageX : e.pageX,
				pageY : e.pageY
		};
		$('#rightclick_contextmenu').css("left", e.pageX + "px");
		$('#rightclick_contextmenu').css("top", e.pageY + "px");
		$('#rightclick_contextmenu').show();
		g_obj.rightClickNode = rowid;
		g_obj.rightClickRowData = $('#grid-table').jqGrid('getRowData',rowid);
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

//enable search/filter toolbar
//jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})

//switch element when editing inline
function aceSwitch( cellvalue, options, cell ) {
	setTimeout(function(){
		$(cell) .find('input[type=checkbox]')
				.wrap('<label class="inline" />')
			.addClass('ace ace-switch ace-switch-5')
			.after('<span class="lbl"></span>');
	}, 0);
}
//enable datepicker
function pickDate( cellvalue, options, cell ) {
	setTimeout(function(){
		$(cell) .find('input[type=text]')
				.datepicker({format:'yyyy-mm-dd' , autoclose:true}); 
	}, 0);
}


//navButtons
jQuery(grid_selector).jqGrid('navGrid',pager_selector,
	{ 	//navbar options
		edit: $('#department_update').val() == 'true' ? true : false,
		editfunc: function(){
			edit();
		},
		editicon : 'icon-pencil blue',
		add: $('#department_add').val() == 'true' ? true : false,
		addfunc: function(){
			var dialog = $( "#dialog-message" ).removeClass('hide').dialog({
				modal: true,
				width: 900,
				height: 500,
				title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加部门</h4></div>",
				title_html: true,
				buttons: [ 
					{
						text: "添加",
						"class" : "btn btn-primary btn-xs",
						click: function() {
							if ($("#a_form").valid())
							{
								var de = {};
								de.name = $('#a_de_name').val();
								if ($('#a_de_department_name').val() != '')
								{
									de.parent = {};
									de.parent.id = $('#a_de_department_id').val();
								}
								de.type = $('#a_de_type').val();
								de.address = $('#a_de_address').val();
								de.contact = $('#a_de_contact').val();
								de.remarks = $('#a_de_remarks').val();
								$.ajax( {
									type : "post",
									url : "department.do?method=add",
									contentType : "application/json;charset=UTF-8",
									data:JSON.stringify(de),
									dataType: "json", 
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											$('#manage_department_warn').show();
											$('#manage_department_warn_label').html('添加部门成功！');
											mySetTimeOut('manage_department_warn', 4000);
											g_obj.a_form_validator.resetForm();
											$('#grid-table').trigger("reloadGrid");
										}
										else
										{
											$('#manage_department_warn').show();
											$('#manage_department_warn_label').html('添加部门失败，请重试！');
											mySetTimeOut('manage_department_warn', 4000);
										}
										$( "#dialog-message" ).dialog( "close" ); 
									},
									error : function() {
										$('#manage_department_warn').show();
										$('#manage_department_warn_label').html('添加部门失败，请重试！');
										mySetTimeOut('manage_department_warn', 4000);
										$( "#dialog-message" ).dialog( "close" ); 
									}
								});
								$( this ).dialog( "close" ); 
							}
						} 
					},
					{
						text: "取消",
						"class" : "btn btn-primary btn-xs",
						click: function() {
							$( this ).dialog( "close" ); 
						} 
					}
				]
			});
		},
		addicon : 'icon-plus-sign purple',
		del: $('#department_delete').val() == 'true' ? true : false,
		delfunc : function () {
			var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
			if (array.length <= 0)
			{
				$('#manage_department_warn').show();
				$('#manage_department_warn_label').html('请选择至少一行数据！');
				mySetTimeOut('manage_department_warn', 4000);
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
						url : "department.do?method=delete",
						dataType:"json",      
						contentType:"application/json",   
						data:JSON.stringify(ids),
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$('#manage_department_warn').show();
								$('#manage_department_warn_label').html('删除部门成功！');
								mySetTimeOut('manage_department_warn', 4000);
								$('#grid-table').trigger("reloadGrid");
							}
							else
							{
								$('#manage_department_warn').show();
								$('#manage_department_warn_label').html('删除部门失败，请重试！');
								mySetTimeOut('manage_department_warn', 4000);
							}
						},
						error : function() {
							$('#manage_department_warn').show();
							$('#manage_department_warn_label').html('删除部门失败，请重试！');
							mySetTimeOut('manage_department_warn', 4000);
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
		//edit record form
		//closeAfterEdit: true,
		recreateForm: true,
		beforeShowForm : function(e) {
			var form = $(e[0]);
			form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
			style_edit_form(form);
		}
	},
	{
		//new record form
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
		//delete record form
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
		//search form
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
		multipleGroup:true,
		showQuery: true
		*/
	},
	{
		//view record form
		recreateForm: true,
		beforeShowForm: function(e){
			var form = $(e[0]);
			form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
		}
	}
)



function style_edit_form(form) {
	//enable datepicker on "sdate" field and switches for "stock" field
	form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
		.end().find('input[name=stock]')
			  .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

	//update buttons classes
	var buttons = form.next().find('.EditButton .fm-button');
	buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
	buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
	buttons.eq(1).prepend('<i class="icon-remove"></i>')
	
	buttons = form.next().find('.navButton a');
	buttons.find('.ui-icon').remove();
	buttons.eq(0).append('<i class="icon-chevron-left"></i>');
	buttons.eq(1).append('<i class="icon-chevron-right"></i>');		
}

function style_delete_form(form) {
	var buttons = form.next().find('.EditButton .fm-button');
	buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
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



//it causes some flicker when reloading or navigating grid
//it may be possible to have some custom formatter to do this as the grid is being created to prevent this
//or go back to default browser checkbox styles for the grid
function styleCheckbox(table) {
/**
	$(table).find('input:checkbox').addClass('ace')
	.wrap('<label />')
	.after('<span class="lbl align-top" />')


	$('.ui-jqgrid-labels th[id*="_cb"]:first-child')
	.find('input.cbox[type=checkbox]').addClass('ace')
	.wrap('<label />').after('<span class="lbl align-top" />');
*/
}


//unlike navButtons icons, action icons in rows seem to be hard-coded
//you can change them like this in here if you want
function updateActionIcons(table) {
	/**
	var replacement = 
	{
		'ui-icon-pencil' : 'icon-pencil blue',
		'ui-icon-trash' : 'icon-trash red',
		'ui-icon-disk' : 'icon-ok green',
		'ui-icon-cancel' : 'icon-remove red'
	};
	$(table).find('.ui-pg-div span.ui-icon').each(function(){
		var icon = $(this);
		var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
		if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
	})
	*/
}

//replace icons with FontAwesome icons like above
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

//var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');

//Menu
$("#menu").menu();

});