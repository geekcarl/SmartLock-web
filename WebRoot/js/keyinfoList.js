$(document).ready(function(){

});
var g_obj = {};
g_obj.rightMenuMouseOver = false;
g_obj.rightClickNode = null;
g_obj.rightClickPos = null;
g_obj.addBoxModuleRows = 0;
g_obj.addBoxStates = [];
g_obj.jump_last_click = [];
g_obj.core_to_terminal_click = null;
g_obj.department_dialog = null;
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


// 操作表格
function getDel(k){
    $(k).parent().remove();
}


function addKeyType() {
	var dialog = $( "#dialog-add-keytype" ).removeClass('hide').dialog({
		modal: true,
		width: 700,
		height: 400,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加智能钥匙类型</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "添加",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					if ($("#a_form_keytype").valid())
					{
						var keytype = {};
						keytype.type = $('#a_keytype_type').val();
						keytype.remarks = $('#a_keytype_remarks').val();
						$.ajax( {
							type : "post",
							url : "lockandkey.do?method=addKeyTypeInfo",
							contentType : "application/json;charset=UTF-8",
							data:JSON.stringify(keytype),
							dataType: "json", 
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$.ajax( {
										type : "post",
										url : "lockandkey.do?method=findAllKeyTypeByAjax",
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												document.getElementById('a_key_type_id').options.length = 0;
												for (var j = 0; j < data.rows.length; j ++)
												{
													$("<option value='" + data.rows[j].id + "'>" + data.rows[j].type + "</option>").appendTo($("#a_key_type_id"));
												}
											}
										}
									});
									$( "#dialog-add-keytype" ).dialog( "close" );
									g_obj.a_form_keytype_validator.resetForm();
								}
								else
								{
									alert('添加钥匙类型失败');
								}
							},
							error : function() {
								alert('添加钥匙类型失败'); 
							}
						});
					}
				} 
			},
			{
				text: "取消",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-add-keytype" ).dialog( "close" ); 
				} 
			}
		]
	});
}

//快速检索
function fastsearch() {
	var rfid = $('#f_s_key_rfid').val();
	if (rfid != '')
	{
		$("#manage-key-grid-table").jqGrid('setGridParam',{ 
            postData:null, //发送搜索条件 
        });
		var postData = {};
		postData.rfid = rfid;
		$("#manage-key-grid-table").jqGrid('setGridParam',{ 
            url:'lockandkey.do?method=listKeyInfoPageByAjax',//你的搜索程序地址 
            postData:postData, //发送搜索条件 
            page:1 
        }).trigger("reloadGrid"); //重新载入
	}
}

function detailsearch()
{
	$("#manage-key-grid-table").jqGrid('setGridParam',{ 
        postData:null, //发送搜索条件 
    });
	$.ajax( {
		type : "post",
		url : "lockandkey.do?method=findAllKeyTypeByAjax",
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				document.getElementById('s_key_type_id').options.length = 0;
				$("<option value='0'></option>").appendTo($("#s_key_type_id"));
				for (var j = 0; j < data.rows.length; j ++)
				{
					$("<option value='" + data.rows[j].id + "'>" + data.rows[j].type + "</option>").appendTo($("#s_key_type_id"));
				}
			}
		}
	});
	var dialog = $( "#dialog-search-key" ).removeClass('hide').dialog({
		modal: true,
		width: 1000,
		height: 400,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>检索钥匙</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					var postData = {};
					/*if ($('#s_key_no').val() != '')
					{
						postData.key_no = $('#s_key_no').val(); 
					}*/
					if ($('#s_rfid').val() != '')
					{
						postData.rfid = $('#s_rfid').val(); 
					}
					if ($('#s_key_code').val() != '')
					{
						postData.key_code = $('#s_key_code').val(); 
					}
					if ($('#s_department_name').val() != '')
					{
						postData.department_name = $('#s_department_name').val();
					}
					if ($('#s_key_type_id').val() != 0)
					{
						postData.key_type = $("#s_key_type_id").find("option:selected").text();
					}
					/*if ($('#s_op_no').val() != '') 
					{
						postData.op_no = $('#s_op_no').val(); 
						
					}*/
					if ($('#s_operator_name').val() != '')
					{
						postData.op_name = $('#s_operator_name').val(); 
					}
					if ($('#s_auth_boxes_count').val() != '')
					{
						postData.auth_boxes_count = $('#s_auth_boxes_count').val(); 
					}
					$("#manage-key-grid-table").jqGrid('setGridParam',{
				        url:'lockandkey.do?method=listKeyInfoPageByAjax',//你的搜索程序地址 
				        postData:postData, //发送搜索条件 
				        page:1 
				    }).trigger("reloadGrid"); //重新载入
					$( "#dialog-search-key" ).dialog( "close" );
				} 
			}
		]
	});
}

function resetsearch()
{
	$('#d_search_form')[0].reset();
	$("#manage-key-grid-table").jqGrid('setGridParam',{ 
        postData:null, //发送搜索条件 
    });
	var postData = {
			rows : 10,
			page : 1
	};
	$("#manage-key-grid-table").jqGrid('setGridParam',{ 
        url:'lockandkey.do?method=listKeyInfoPageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入
}


// 操作表格结束

jQuery(function($) {
	$( "#progressbar" ).progressbar({
		value: 100,
		create: function( event, ui ) {
			$(this).addClass('progress progress-striped active')
				   .children(0).addClass('progress-bar progress-bar-success');
		}
	});
	
	
	var manage_key_grid_selector = "#manage-key-grid-table";
	var manage_key_pager_selector = "#manage-key-grid-pager";
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
	
	//验证智能锁添加
	g_obj.a_form_add_key_validator = $("#a_form_add_key").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
        rules:{ //定义验证规则 
			/*a_key_key_no: {
		 		required: true
		 	},*/
		 	a_key_rfid: {
			 	required: true
			},
			a_key_key_code: {
			 	required: true,
			 	ip: true
			},
			a_key_department_name: {
				required: true
			},
			a_key_type_id: {
			 	required: true,
		 		isSelected: true
			},
         }, 
         messages:{ //定义提示信息 
        	/* a_key_key_no: {
        	 	required:"钥匙编号不能为空！"
         	 },*/
         	 a_key_rfid: {
	        	 required:"RFID卡号不能为空！"
		     },
		     a_key_key_code: {
	        	 required:"钥匙编码不能为空！",
	        	 ip:"钥匙编码应为ip形式,例192.168.1.1"
		     },
		     a_key_department_name: {
	        	 required:"请选择所属部门！"
		     },
		     a_key_type_id: {
	        	 required:"请选择钥匙类型！",
	 		 	 isSelected: true
		     }
         } 
    });
	
	//验证智能锁修改
	$("#u_form_update_key").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
        rules:{ //定义验证规则 
			/*u_key_key_no: {
		 		required: true
		 	},*/
		 	u_key_rfid: {
			 	required: true
			},
			u_key_key_code: {
			 	required: true,
			 	ip: true
			},
			u_key_department_name: {
				required: true
			},
			u_key_type_id: {
			 	required: true,
		 		isSelected: true
			},
         }, 
         messages:{ //定义提示信息 
        	/* u_key_key_no: {
        	 	required:"钥匙编号不能为空！"
         	 },*/
         	 u_key_rfid: {
	        	 required:"RFID卡号不能为空！"
		     },
		     u_key_key_code: {
	        	 required:"钥匙编码不能为空！",
	        	 ip:"钥匙编码应为ip形式,例192.168.1.1"
		     },
		     u_key_department_name: {
	        	 required:"请选择所属部门！"
		     },
		     u_key_type_id: {
	        	 required:"请选择钥匙类型！",
	 		 	 isSelected: true
		     }
         } 
    });
	
	//验证智能锁类型添加
	g_obj.a_form_keytype_validator = $("#a_form_keytype").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
        rules:{ //定义验证规则 
			a_keytype_type: {
		 		required: true
		 	}
         }, 
         messages:{ //定义提示信息 
        	 a_keytype_type: {
        	 	required:"钥匙类型不能为空！"
         	 }
         } 
    });

	
	//绑定锁列表
	jQuery(manage_key_grid_selector).jqGrid({
		// direction: "rtl",
		url: 'lockandkey.do?method=listKeyInfoPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','钥匙编号', '内码', '所属部门', '型号', '使用人姓名', '使用人手机号', '授权光交箱数量', '备注'],
		colModel:[
			{name:'id',index:'id', width:60, sorttype:"int", hidden: true},
			{name:'rfid',index:'rfid'},
			/*{name:'rfid',index:'rfid'},*/
			{name:'key_code',index:'key_code'},
			{name:'department',index:'department.name', width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.department == null ? "" : rowObject.department;
				}
			},
			{name:'keyTypeInfo',index:'keyTypeInfo.type', width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.keyTypeInfo == null ? "" : rowObject.keyTypeInfo;
				}
			},
			{name:'full_name',index:'operators.full_name', width:90},
			{name:'phone_no',index:'operators.phone_no', width:100},
			{name:'auth_boxes_count',index:'auth_boxes_count'},
			{name:'remarks',index:'remarks'}
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : manage_key_pager_selector,
		altRows: true,
		// toppager: true,
		ondblClickRow: function() {
			var table = this;
			console.log($('#manage-key-grid-table').jqGrid('getGridParam','selarrrow'));
		},
		onRightClickRow: function(rowid,irow,icol,e) {
		},
		loadComplete: function(xhr) {
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
	jQuery(manage_key_grid_selector).jqGrid('navGrid', manage_key_pager_selector,
		{ 	// navbar options
			edit: $('#keyinfo_update').val() == 'true' ? true : false,
			editfunc : function () {
				var array = $('#manage-key-grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#manage_key_warn').show();
					$('#manage_key_warn_label').html('请选择一行数据！');
					mySetTimeOut('manage_key_warn', 4000);
				}
				else if (array.length > 1)
				{
					$('#manage_key_warn').show();
					$('#manage_key_warn_label').html('只能编辑一行数据！');
					mySetTimeOut('manage_key_warn', 4000);
				}
				else
				{

					var rowdata = $('#manage-key-grid-table').jqGrid('getRowData', array[0]);
					$.ajax( {
						type : "post",
						url : "lockandkey.do?method=fineKeyInfo",
						data : "id=" + rowdata.id,
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								var _data = data;
								$.ajax( {
									type : "post",
									url : "lockandkey.do?method=findAllKeyTypeByAjax",
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											document.getElementById('u_key_type_id').options.length = 0;
											for (var j = 0; j < data.rows.length; j ++)
											{
												$("<option value='" + data.rows[j].id + "'>" + data.rows[j].type + "</option>").appendTo($("#u_key_type_id"));
											}
											$('#u_key_type_id').val(_data.object.keyTypeInfo.id);
										}
									}
								});
						
								$.ajax( {
									type : "post",
									url : "operators.do?method=listByAjax",
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											document.getElementById('u_key_operators_id').options.length = 0;
											$("<option value='0'></option>").appendTo($("#u_key_operators_id"));
											for (var j = 0; j < data.rows.length; j ++)
											{
												$("<option value='" + data.rows[j].id + "'>" + data.rows[j].full_name +  "</option>").appendTo($("#u_key_operators_id"));
											}
											if (_data.object.operators != null)
											{
												$('#u_key_operators_id').val(_data.object.operators.id);
											}
										}
									}
								});
								$('#u_key_id').val(_data.object.id);
								$('#u_key_key_no').val(_data.object.key_no);
								$('#u_key_rfid').val(_data.object.rfid);
								$('#u_key_key_code').val(_data.object.key_code);
								$('#u_key_remarks').val(_data.object.remarks);
								if (_data.object.department != null)
								{
									$('#u_key_department_id').val(_data.object.department.id);
									$('#u_key_department_name').val(_data.object.department.name);
								}
								var dialog = $( "#dialog-update-key" ).removeClass('hide').dialog({
									modal: true,
									width: 700,
									height: 600,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改智能钥匙</h4></div>",
									title_html: true,
									buttons: [ 
										{
											text: "确定",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												if ($("#u_form_update_key").valid())
												{
													var key = {};
													key.id = $('#u_key_id').val();
													key.key_no = $('#u_key_key_no').val();
													key.rfid = $('#u_key_rfid').val();
													key.key_code = $('#u_key_key_code').val();
													key.auth_locks_count = _data.object.auth_locks_count;
													key.auth_locks_count = _data.object.auth_boxes_count;
													key.department = {};
													key.department.id = $('#u_key_department_id').val();
													key.keyTypeInfo = {};
													key.keyTypeInfo.id = $('#u_key_type_id').val();
													if ($('#u_key_operators_id').val() != 0)
													{
														key.operators = {};
														key.operators.id = $('#u_key_operators_id').val();
													}
													key.remarks = $('#u_key_remarks').val();
													$.ajax( {
														type : "post",
														url : "lockandkey.do?method=updateKeyInfo",
														contentType : "application/json;charset=UTF-8",
														data:JSON.stringify(key),
														dataType: "json", 
														success : function(data) {
															isOvertime(data.resultMark);
															if (data.resultMark == 1)
															{
																$('#manage_key_warn').show();
																$('#manage_key_warn_label').html('修改智能钥匙成功！');
																mySetTimeOut('manage_key_warn', 4000);
																$('#manage-key-grid-table').trigger("reloadGrid");
															}
															else
															{
																$('#manage_key_warn').show();
																$('#manage_key_warn_label').html('修改智能钥匙失败，钥匙编码或者内码已存在！');
																mySetTimeOut('manage_key_warn', 4000);
															}
															$( "#dialog-update-key" ).dialog( "close" ); 
														},
														error : function() {
															$('#manage_key_warn').show();
															$('#manage_key_warn_label').html('修改智能钥匙失败，请重试！');
															mySetTimeOut('manage_key_warn', 4000);
															$( "#dialog-update-key" ).dialog( "close" );    
														}
													});
												}
											} 
										},
										{
											text: "取消",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												$( "#dialog-update-key" ).dialog( "close" ); 
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
			add: $('#keyinfo_add').val() == 'true' ? true : false,
			addfunc: function(){
				$.ajax( {
					type : "post",
					url : "lockandkey.do?method=findAllKeyTypeByAjax",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{
							document.getElementById('a_key_type_id').options.length = 0;
							for (var j = 0; j < data.rows.length; j ++)
							{
								$("<option value='" + data.rows[j].id + "'>" + data.rows[j].type + "</option>").appendTo($("#a_key_type_id"));
							}
						}
					}
				});

				$.ajax( {
					type : "post",
					url : "operators.do?method=listByAjax",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{
							document.getElementById('a_key_operators_id').options.length = 0;
							$("<option value='0'></option>").appendTo($("#a_key_operators_id"));
							for (var j = 0; j < data.rows.length; j ++)
							{
								$("<option value='" + data.rows[j].id + "'>" + data.rows[j].full_name +  "</option>").appendTo($("#a_key_operators_id"));
							}
						}
					}
				});
				var dialog = $( "#dialog-add-key" ).removeClass('hide').dialog({
					modal: true,
					width: 700,
					height: 500,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加智能钥匙</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($("#a_form_add_key").valid())
								{
									var key = {};
									//key.key_no = $('#a_key_key_no').val();
									key.rfid = $('#a_key_rfid').val();
									key.key_code = $('#a_key_key_code').val();
									key.auth_locks_count = 0;
									key.auth_locks_count = 0;
									if ($('#a_key_department_id').val() != '')
									{										
										key.department = {};
										key.department.id = $('#a_key_department_id').val();
									}
									key.keyTypeInfo = {};
									key.keyTypeInfo.id = $('#a_key_type_id').val();
									if ($('#a_key_operators_id').val() != 0)
									{
										key.operators = {};
										key.operators.id = $('#a_key_operators_id').val();
									}
									key.remarks = $('#a_key_remarks').val();
									$.ajax( {
										type : "post",
										url : "lockandkey.do?method=addKeyInfo",
										contentType : "application/json;charset=UTF-8",
										data:JSON.stringify(key),
										dataType: "json", 
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#manage_key_warn').show();
												$('#manage_key_warn_label').html('添加智能钥匙成功！');
												mySetTimeOut('manage_key_warn', 4000);
												g_obj.a_form_add_key_validator.resetForm();
												$('#manage-key-grid-table').trigger("reloadGrid");
											}
											else
											{
												$('#manage_key_warn').show();
												$('#manage_key_warn_label').html('添加智能钥匙失败，钥匙编码或者内码已存在！');
												mySetTimeOut('manage_key_warn', 4000);
											}
											$( "#dialog-add-key" ).dialog( "close" ); 
										},
										error : function() {
											$('#manage_key_warn').show();
											$('#manage_key_warn_label').html('添加智能钥匙失败，请重试！');
											mySetTimeOut('manage_key_warn', 4000);
											$( "#dialog-add-key" ).dialog( "close" ); 
										}
									});
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-add-key" ).dialog( "close" ); 
							} 
						}
					]
				});
			},
			addicon : 'icon-plus-sign purple',
			del: $('#keyinfo_delete').val() == 'true' ? true : false,
			delfunc : function () {
				var array = $('#manage-key-grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#manage_key_warn').show();
					$('#manage_key_warn_label').html('请选择至少一行数据！');
					mySetTimeOut('manage_key_warn', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，并且钥匙的授权也会一并删除,你确认要删除吗？"))
					{
						var ids = [];
						for (var i = 0; i < array.length; i ++)
						{
							ids.push(array[i]);
						}
						$.ajax( {
							type : "post",
							url : "lockandkey.do?method=deleteKeyInfo",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(ids),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#manage_key_warn').show();
									$('#manage_key_warn_label').html('删除钥匙成功！');
									mySetTimeOut('manage_key_warn', 4000);
									$('#manage-key-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#manage_key_warn').show();
									$('#manage_key_warn_label').html('删除钥匙失败，请重试！');
									mySetTimeOut('manage_key_warn', 4000);
								}
							},
							error : function() {
								$('#manage_key_warn').show();
								$('#manage_key_warn_label').html('删除钥匙失败，请重试！');
								mySetTimeOut('manage_key_warn', 4000);
							}
						});
					}
				}
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