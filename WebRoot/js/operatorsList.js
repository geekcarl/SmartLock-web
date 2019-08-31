var g_obj = {};
g_obj.rightMenuMouseOver = false;
function rightMenuMouseOver() {
}
function rightMenuMouseOut() {
}
$(document).ready(function(){
});

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
function cancelDepartment(id, did)
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

//快速检索
function fastsearch() {
	var op_no = $('#f_s_op_no').val();
	var name = $('#f_s_name').val();
	if (op_no != '' || name != '')
	{
		$("#grid-table").jqGrid('setGridParam',{ 
            postData:null, //发送搜索条件 
        });
		var postData = {};
		if (op_no != '')
		{
			postData.op_no = op_no;
		}
		if (name != '')
		{
			postData.name = name;
		}
		$("#grid-table").jqGrid('setGridParam',{ 
            url:'operators.do?method=listPageByAjax',//你的搜索程序地址 
            postData:postData, //发送搜索条件 
            page:1 
        }).trigger("reloadGrid"); //重新载入
	}
}

function detailsearch()
{
	var dialog = $( "#dialog-search" ).removeClass('hide').dialog({
		modal: true,
		width: 1000,
		height: 500,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>检索人员</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					if ($("#d_search_form").valid())
					{
						var postData = {};
						$("#grid-table").jqGrid('setGridParam',{ 
				            postData:null, //发送搜索条件 
				        });
						if ($('#s_op_no').val() != '')
						{
							postData.op_no = $('#s_op_no').val(); 
						}
						if ($('#s_op_name').val() != '')
						{
							postData.name = $('#s_op_name').val(); 
						}
						postData.sex = Number($(':radio[name="s_op_sex"]:checked').val()) + 1;
						if ($('#s_op_department_name').val() != '')
						{
							postData.department = $('#s_op_department_name').val(); 
						}
						if ($('#s_op_phone_no').val() != '')
						{
							postData.phone_no = $('#s_op_phone_no').val(); 
						}
						if ($('#s_op_aux_phone').val() != '')
						{
							postData.aux_phone = $('#s_op_aux_phone').val(); 
						}
						if ($('#s_op_email').val() != '')
						{
							postData.email = $('#s_op_email').val(); 
						}
						if ($('#s_op_address').val() != '')
						{
							postData.address = $('#s_op_address').val(); 
						}
						$("#grid-table").jqGrid('setGridParam',{
					        url:'operators.do?method=listPageByAjax',//你的搜索程序地址 
					        postData:postData, //发送搜索条件 
					        page:1 
					    }).trigger("reloadGrid"); //重新载入
						$( "#dialog-search" ).dialog( "close" );
					}
				} 
			}
		]
	});
}

function resetsearch()
{
	$('#d_search_form')[0].reset();
	$("#grid-table").jqGrid('setGridParam',{ 
        postData:null, //发送搜索条件 
    });
	var postData = {
			rows : 10,
			page : 1
	};
	$("#grid-table").jqGrid('setGridParam',{ 
        url:'operators.do?method=listPageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入
}

jQuery(function($) {
	var grid_selector = "#grid-table";
	var pager_selector = "#grid-pager";
	
	//验证人员添加
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
			a_op_no: {
				required: true
		 	},
		 	a_op_name: {
		 		required: true
			},
			a_op_department_name: {
				required: true
			},
			a_op_phone_no: {
				isMobile: true
			},
			a_op_aux_phone: {
				isTel: true
			},
			a_op_email: {
				email: true
			}
         }, 
         messages:{ //定义提示信息 
        	a_op_no: {
				required: '员工编号不能为空！'
		 	},
		 	a_op_name: {
		 		required: '员工姓名不能为空！'
			},
			a_op_department_name: {
				required: '员工部门不能为空！'
			}
         } 
    });
	
	//验证人员修改
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
			u_op_no: {
				required: true
		 	},
		 	u_op_name: {
		 		required: true
			},
			u_op_department_name: {
				required: true
			},
			u_op_phone_no: {
				isMobile: true
			},
			u_op_aux_phone: {
				isTel: true
			},
			u_op_email: {
				email: true
			}
         }, 
         messages:{ //定义提示信息 
        	u_op_no: {
				required: '员工编号不能为空！'
		 	},
		 	u_op_name: {
		 		required: '员工姓名不能为空！'
			},
			u_op_department_name: {
				required: '员工部门不能为空！'
			}
         } 
    });
	
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
			s_op_phone_no: {
				isMobile: true
			},
			s_op_aux_phone: {
				isTel: true
			},
			s_op_email: {
				email: true
			}
         }, 
         messages:{ //定义提示信息 
         } 
    });
	
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
		url: 'operators.do?method=listPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','编号','姓名', '性别', '所属部门', '手机号', '邮箱', '电话', '住址', '备注'],
		colModel:[
			{name:'id',index:'id', width:60, hidden: true},
			{name:'op_no',index:'op_no',width:70},
			{name:'name',index:'name', width:90},
			{name:'sex',index:'sex', width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.sex == 1 ? '男' : '女';
				}
			},
			{name:'department',index:'department.name', width:90, formatter:function(cellvalue, options, rowObject){
				var temp = '';
				if (rowObject.department != null)
				{
					temp = rowObject.department.name;
				}
				else
				{
					temp = '─────';
				}
				return temp;
				}
			},
			{name:'phone_no',index:'phone_no', width:120},
			{name:'email',index:'email', width:120},
			{name:'aux_phone',index:'aux_phone', width:120},
			{name:'address',index:'address', width:120},
			{name:'remarks',index:'remarks', sortable:false, width:120}
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : pager_selector,
		altRows: true,
		//toppager: true,
		ondblClickRow: function() {
			var table = this;
			console.log($('#grid-table').jqGrid('getGridParam','selarrrow'));
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
			edit: true,
			editfunc: function(){
				var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#manage_warn').show();
					$('#manage_warn_label').html('请选择一行数据！');
					mySetTimeOut('manage_warn', 4000);
				}
				else if (array.length > 1)
				{
					$('#manage_warn').show();
					$('#manage_warn_label').html('只能选择一行数据！');
					mySetTimeOut('manage_warn', 4000);
				}
				else
				{
					$.ajax( {
						type : "post",
						url : "operators.do?method=findByAjax",
						data : "id=" + array[0],
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$('#u_op_id').val(data.object.id);
								$('#u_op_no').val(data.object.op_no);
								$('#u_op_name').val(data.object.name);
								if (data.object.sex == 0)
								{
									$(":radio[name='u_op_sex'][value='0']").attr("checked","checked");
								}
								else
								{
									$(":radio[name='u_op_sex'][value='1']").attr("checked","checked");
								}
								if (data.object.department != null)
								{
									$('#u_op_department_name').val(data.object.department.name);
									$('#u_op_department_id').val(data.object.department.id);
								}
								$('#u_op_phone_no').val(data.object.phone_no);
								$('#u_op_aux_phone').val(data.object.aux_phone);
								$('#u_op_email').val(data.object.email);
								$('#u_op_address').val(data.object.address);
								$('#u_op_remarks').val(data.object.remarks);
								var dialog = $( "#dialog-message-update" ).removeClass('hide').dialog({
									modal: true,
									width: 1000,
									height: 600,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改人员</h4></div>",
									title_html: true,
									buttons: [ 
										{
											text: "修改",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												if ($('#u_form').valid())
												{
													var de = {};
													de.id = $('#u_op_id').val();
													de.op_no = $('#u_op_no').val();
													de.name = $('#u_op_name').val();
													de.sex = Number($(':radio[name="u_op_sex"]:checked').val());
													if ($('#u_op_department_name').val() != '')
													{
														de.department = {};
														de.department.id = $('#u_op_department_id').val();
													}
													de.phone_no = $('#u_op_phone_no').val();
													de.aux_phone = $('#u_op_aux_phone').val();
													de.email = $('#u_op_email').val();
													de.address = $('#u_op_address').val();
													de.remarks = $('#u_op_remarks').val();
													$.ajax( {
														type : "post",
														url : "operators.do?method=update",
														contentType : "application/json;charset=UTF-8",
														data:JSON.stringify(de),
														dataType: "json", 
														success : function(data) {
															isOvertime(data.resultMark);
															if (data.resultMark == 1)
															{
																$('#manage_warn').show();
																$('#manage_warn_label').html('修改人员成功！');
																mySetTimeOut('manage_warn', 4000);
																$('#grid-table').trigger("reloadGrid");
															}
															else
															{
																$('#manage_warn').show();
																$('#manage_warn_label').html('修改人员失败，请重试！');
																mySetTimeOut('manage_warn', 4000);
															}
															$("#dialog-message-update").dialog("close"); 
														},
														error : function() {
															$('#manage_warn').show();
															$('#manage_warn_label').html('修改人员失败，请重试！');
															mySetTimeOut('manage_warn', 4000);
															$( "#dialog-message-update" ).dialog("close"); 
														}
													});
												}
											} 
										},
										{
											text: "取消",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												$( "#dialog-message-update" ).dialog( "close" ); 
											} 
										}
									]
								});
							}
						}
					});
				}
			},
			editicon : 'icon-pencil blue',
			add: true,
			addfunc: function(){
				var dialog = $( "#dialog-message" ).removeClass('hide').dialog({
					modal: true,
					width: 1000,
					height: 600,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加人员</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#a_form').valid())
								{
									var de = {};
									de.op_no = $('#a_op_no').val();
									de.name = $('#a_op_name').val();
									de.sex = Number($(':radio[name="a_op_sex"]:checked').val());
									if ($('#a_op_department_name').val() != '')
									{
										de.department = {};
										de.department.id = $('#a_op_department_id').val();
									}
									de.phone_no = $('#a_op_phone_no').val();
									de.aux_phone = $('#a_op_aux_phone').val();
									de.email = $('#a_op_email').val();
									de.address = $('#a_op_address').val();
									de.remarks = $('#a_op_remarks').val();
									$.ajax( {
										type : "post",
										url : "operators.do?method=add",
										contentType : "application/json;charset=UTF-8",
										data:JSON.stringify(de),
										dataType: "json", 
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#manage_warn').show();
												$('#manage_warn_label').html('添加人员成功！');
												mySetTimeOut('manage_warn', 4000);
												g_obj.a_form_validator.resetForm();
												$('#grid-table').trigger("reloadGrid");
											}
											else
											{
												$('#manage_warn').show();
												$('#manage_warn_label').html('添加人员失败，请重试！');
												mySetTimeOut('manage_warn', 4000);
											}
											$("#dialog-message").dialog("close"); 
										},
										error : function() {
											$('#manage_warn').show();
											$('#manage_warn_label').html('添加人员失败，请重试！');
											mySetTimeOut('manage_warn', 4000);
											$( "#dialog-message" ).dialog("close"); 
										}
									});
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-message" ).dialog( "close" ); 
							} 
						}
					]
				});
			},
			addicon : 'icon-plus-sign purple',
			del: true,
			delfunc : function () {
				var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#manage_warn').show();
					$('#manage_warn_label').html('请选择至少一行数据！');
					mySetTimeOut('manage_warn', 4000);
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
							url : "operators.do?method=delete",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(ids),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#manage_warn').show();
									$('#manage_warn_label').html('删除人员成功！');
									mySetTimeOut('manage_warn', 4000);
									$('#grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#manage_warn').show();
									$('#manage_warn_label').html('删除人员失败，请重试！');
									mySetTimeOut('manage_warn', 4000);
								}
							},
							error : function() {
								$('#manage_warn').show();
								$('#manage_warn_label').html('删除人员失败，请重试！');
								mySetTimeOut('manage_warn', 4000);
							}
						});
					}
				}
			},
			delicon : 'icon-trash red',
			search: true,
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