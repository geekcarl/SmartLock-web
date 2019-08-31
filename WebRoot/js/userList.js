var g_obj = {};
g_obj.rightMenuMouseOver = false;
function rightMenuMouseOver() {
}
function rightMenuMouseOut() {
}
$(document).ready(function(){
});

function edit(id) {

	$('#rightclick_contextmenu').hide();
	var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
	if (array.length <= 0 && id == null)
	{
		$('#manage_warn').show();
		$('#manage_warn_label').html('请选择一行数据！');
		mySetTimeOut('manage_warn', 4000);
	}
	else if (array.length > 1 && id == null)
	{
		$('#manage_warn').show();
		$('#manage_warn_label').html('只能选择一行数据！');
		mySetTimeOut('manage_warn', 4000);
	}
	else
	{
		$.ajax( {
			type : "post",
			url : "user.do?method=findByAjax",
			data : "id=" + (id != null && id > 0 ? id : array[0]),
			success : function(data) {
				isOvertime(data.resultMark);
				var _data = data;
				if (data.resultMark == 1)
				{
					$.ajax( {
						type : "post",
						url : "user.do?method=findAllRole",
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$('#u_role').empty();
								for (var i = 0; i < data.rows.length; i ++)
								{
									$("#u_role").append("<option value='" + data.rows[i].id + "'>" + data.rows[i].name + "</option>");
								}
								$('#u_role').val(_data.object.role.id);
							}
							else
							{
							}
						},
						error : function() {
						}
					});
					$('#u_id').val(data.object.id);
					$('#u_user_name').val(data.object.user_name);
					$('#u_full_name').val(data.object.full_name);
					if (data.object.sex == 0)
					{
						$(":radio[name='u_sex'][value='0']").attr("checked","checked");
					}
					else
					{
						$(":radio[name='u_sex'][value='1']").attr("checked","checked");
					}
					if (data.object.is_login == 0)
					{
						$(":radio[name='u_is_login'][value='0']").attr("checked","checked");
					}
					else
					{
						$(":radio[name='u_is_login'][value='1']").attr("checked","checked");
					}
					$('#u_user_type').val(data.object.user_type);
					if (data.object.department != null)
					{
						$('#u_department_name').val(data.object.department.name);
						$('#u_department_id').val(data.object.department.id);
					}
					$('#u_phone_no').val(data.object.phone_no);
					$('#u_op_remarks').val(data.object.remarks);
					var dialog = $( "#dialog-message-update" ).removeClass('hide').dialog({
						modal: true,
						width: 1000,
						height: 600,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改用户</h4></div>",
						title_html: true,
						buttons: [ 
							{
								text: "修改",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									if ($('#u_form').valid())
									{
										var de = {};
										de.id = $('#u_id').val();
										de.user_name = $('#u_user_name').val();
										de.full_name = $('#u_full_name').val();
										de.sex = Number($(':radio[name="u_sex"]:checked').val());
										de.is_login = Number($(':radio[name="u_is_login"]:checked').val());
										if ($('#u_department_name').val() != '')
										{
											de.department = {};
											de.department.id = $('#u_department_id').val();
										}
										if ($('#u_role').val() != 0)
										{
											de.role = {};
											de.role.id = $('#u_role').val();
										}
										de.phone_no = $('#u_phone_no').val();
										de.user_type = $('#u_user_type').val();
										de.remarks = $('#u_remarks').val();
										$.ajax( {
											type : "post",
											url : "user.do?method=update",
											contentType : "application/json;charset=UTF-8",
											data:JSON.stringify(de),
											dataType: "json", 
											success : function(data) {
												isOvertime(data.resultMark);
												if (data.resultMark == 1)
												{
													$('#manage_warn').show();
													$('#manage_warn_label').html('修改用户成功！');
													mySetTimeOut('manage_warn', 4000);
													$('#grid-table').trigger("reloadGrid");
												}
												else
												{
													$('#manage_warn').show();
													$('#manage_warn_label').html('修改用户失败，用户名已存在，请更换用户名！');
													mySetTimeOut('manage_warn', 4000);
												}
												$("#dialog-message-update").dialog("close"); 
											},
											error : function() {
												$('#manage_warn').show();
												$('#manage_warn_label').html('修改用户失败，请重试！');
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
	var user_name = $('#f_s_user_name').val();
	var full_name = $('#f_s_full_name').val();
	if (user_name != '' || full_name != '')
	{
		$("#grid-table").jqGrid('setGridParam',{ 
            postData:null, //发送搜索条件 
        });
		var postData = {};
		if (user_name != '')
		{
			postData.user_name = user_name;
		}
		if (full_name != '')
		{
			postData.full_name = full_name;
		}
		$("#grid-table").jqGrid('setGridParam',{ 
            url:'user.do?method=listPageByAjax',//你的搜索程序地址 
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
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>检索用户</h4></div>",
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
						if ($('#s_user_name').val() != '')
						{
							postData.user_name = $('#s_user_name').val(); 
						}
						if ($('#s_full_name').val() != '')
						{
							postData.full_name = $('#s_full_name').val(); 
						}
						postData.sex = Number($(':radio[name="s_sex"]:checked').val()) + 1;
						if ($('#s_department_name').val() != '')
						{
							postData.department_name = $('#s_department_name').val(); 
						}
						if ($('#s_phone_no').val() != '')
						{
							postData.phone_no = $('#s_phone_no').val(); 
						}
						$("#grid-table").jqGrid('setGridParam',{
					        url:'user.do?method=listPageByAjax',//你的搜索程序地址 
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


//验证修改密码
			$("#p_form").validate({
		
				event:"keyup" || "blur",
				errorElement: "em",
				errorPlacement: function(error, element) {
					error.appendTo(element.parent("td").next("td"));
				},
				success: function(label) {
					label.text("ok!").addClass("success");
				},
		        rules:{ //定义验证规则 
					
				 	new_password: {
					 	required: true
					},
					re_new_password: {
					 	required: true,
					 	equalTo: '#new_password'
					}
		         }, 
		         messages:{ //定义提示信息 
		        	
				 	new_password: {
					 	required: '新密码不能为空'
					},
					re_new_password: {
					 	required: '新密码不能为空',
					 	equalTo: '两次密码不一致'
					}
		         } 
		    });


function updatepwd(userid){

				var dialog = $("#dialog-update-password").removeClass('hide').dialog({
					width: 500,
					height: 350,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改密码</h4></div>",
					title_html: true,
					buttons: [
						{
							text: "确定",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#p_form').valid())
								{
									$.ajax( {
										type : "post",
										url : "user.do?method=adminupdatepassword",
										data: "userid=" + userid+"&new_password=" + $('#new_password').val(),
										success : function(data) {
											if (data.resultMark == -1) {
												alert('会话超时，请重新登录');
												$( "#dialog-update-password" ).dialog("close"); 
											
												return false;
											}
											else if (data.resultMark == 1)
											{
												alert('修改密码成功');
												$( "#dialog-update-password" ).dialog("close"); 
												
											}
											else
											{
												alert('修改密码失败，请重试');
											}
										},
										error : function() {
											alert('修改密码失败，请重试');
										}
									});
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-update-password" ).dialog("close"); 
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
        url:'user.do?method=listPageByAjax',//你的搜索程序地址 
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
			a_user_name: {
				isAdmin: true,
				userName: true,
				required: true
		 	},
		 	a_password: {
		 		required: true
		 	},
		 	a_re_password: {
		 		equalTo: '#a_password',
		 		required: true
		 	},
		 	a_full_name: {
		 		required: true
			},
			a_role: {
				required: true
			},
			a_department_name: {
				required: true
			},
			a_phone_no: {
			
				isMobile: true
			}
         }, 
         messages:{ //定义提示信息 
        	a_user_name: {
        		isAdmin: '无效的用户名！',
				required: '用户名不能为空！'
		 	},
		 	a_password: {
		 		required: '密码不能为空！'
		 	},
		 	a_re_password: {
		 		equalTo: '两次密码不一致！',
		 		required: '密码不能为空！'
		 	},
		 	a_full_name: {
		 		required: '姓名不能为空！'
			},
			a_role: {
				required: '角色不能为空！'
			},
			a_department_name: {
				required: '部门不能为空！'
			},
			a_phone_no: {
				
				isMobile: '请正确填写手机号码'
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
			u_user_name: {
				required: true
		 	},
		 	u_full_name: {
		 		required: true
			},
			u_department_name: {
				required: true
			},
			u_role: {
				required: true
			},
			u_phone_no: {
				
				isMobile: true
			}
         }, 
         messages:{ //定义提示信息 
        	u_user_name: {
				required: '用户名不能为空！'
		 	},
		 	u_full_name: {
		 		required: '姓名不能为空！'
			},
			u_department_name: {
				required: '部门不能为空！'
			},
			u_role: {
				required: '角色不能为空！'
			},
			u_phone_no: {
				
				isMobile: '请正确填写手机号码'
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
			s_phone_no: {
				isMobile: true
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
		url: 'user.do?method=listPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','用户名', '姓名','类型', '角色', '所属部门', '手机号', '是否允许登录', '最近登录时间', '最近登录IP', '密码重置'],
		colModel:[
			{name:'id',index:'id', width:60, hidden: true},
			{name:'user_name',index:'user_name',width:70},
			{name:'full_name',index:'full_name',width:70},
			/*{name:'sex',index:'sex', width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.sex == 1 ? '男' : '女';
				}
			},*/
			{name:'user_type',index:'user_type', width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.user_type == 1 ? '管理人员' : (rowObject.user_type == 2 ? '建设人员' : '维护人员');
				}
			},
			{name:'role',index:'role', width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.role == null ? '' : rowObject.role.name;
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
					temp = '';
				}
				return temp;
				}
			},
			{name:'phone_no',index:'phone_no', width:120},
			{name:'is_login',index:'is_login', width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.is_login == 1 ? '允许' : '不允许';
				}
			},
			{name:'last_login_time',index:'last_login_time', width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.last_login_time == null ? '' : new Date(rowObject.last_login_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'last_login_ip',index:'last_login_ip', width:120},
			{ name: 'id2', index: 'id',  width:70, formatter: function (cellvalue, options, rowObject) { 
				
				if ($('#userinfo_updatepwd').val() == 'true')
				    return "<a href='javascript:void(0);'  class='btn btn-danger btn-sm'  onclick='updatepwd(\"" + rowObject.id + "\")'>密码重置</a>"
			    else
			    	return '';
			 } },
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
			edit: $('#userinfo_update').val() == 'true' ? true : false,
			editfunc: function(){
				edit();
			},
			editicon : 'icon-pencil blue',
			add: $('#userinfo_add').val() == 'true' ? true : false,
			addfunc: function(){
				$.ajax( {
					type : "post",
					url : "user.do?method=findAllRole",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{
							$('#a_role').empty();
							for (var i = 0; i < data.rows.length; i ++)
							{
								$("#a_role").append("<option value='" + data.rows[i].id + "'>" + data.rows[i].name + "</option>");
							}
						}
						else
						{
						}
					},
					error : function() {
					}
				});
				var dialog = $( "#dialog-message" ).removeClass('hide').dialog({
					modal: true,
					width: 1000,
					height: 600,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加用户</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#a_form').valid())
								{
									var de = {};
									de.user_name = $('#a_user_name').val();
									de.passwd = $('#a_password').val();
									de.full_name = $('#a_full_name').val();
									de.user_type = $('#a_user_type').val();
									de.sex = Number($(':radio[name="a_sex"]:checked').val());
									de.is_login = Number($(':radio[name="a_is_login"]:checked').val());
									if ($('#a_department_name').val() != '')
									{
										de.department = {};
										de.department.id = $('#a_department_id').val();
									}
									de.role = {};
									de.role.id = $('#a_role').val();
									de.phone_no = $('#a_phone_no').val();
									de.remarks = $('#a_remarks').val();
									$.ajax( {
										type : "post",
										url : "user.do?method=add",
										contentType : "application/json;charset=UTF-8",
										data:JSON.stringify(de),
										dataType: "json", 
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#manage_warn').show();
												$('#manage_warn_label').html('添加用户成功！');
												mySetTimeOut('manage_warn', 4000);
												g_obj.a_form_validator.resetForm();
												$('#grid-table').trigger("reloadGrid");
											}
											else
											{
												$('#manage_warn').show();
												$('#manage_warn_label').html('添加用户失败，请重试！');
												mySetTimeOut('manage_warn', 4000);
											}
											$("#dialog-message").dialog("close"); 
										},
										error : function() {
											$('#manage_warn').show();
											$('#manage_warn_label').html('添加用户失败，请重试！');
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
			del: $('#userinfo_delete').val() == 'true' ? true : false,
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
							var data = $('#grid-table').jqGrid('getRowData', array[i]);
							if (data.user_name != 'admin') ids.push(data.id);
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