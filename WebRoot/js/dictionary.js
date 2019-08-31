$(document).ready(function(){
	document.getElementById('box_tabs_content').style.height = document.body.clientHeight - 100 + 'px';
	$('#box_tabs_content').show();
	//初始化ace的file框框
	$('#add_statelevel_state_image').ace_file_input({});
	$('#update_statelevel_state_image').ace_file_input({});


	//验证字典添加
	$("#form-add-state-key").validate({

		 event:"keyup" || "blur",
		 errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
         rules:{ //定义验证规则 
		 	state_key: {
		 		required: true,
		 		remote:{   
				    url:'dictionary.do?method=isStateKeyValid',
				    data:{
		                 state_key : function(){return $('#add_statekey_state_key').val();}
		            },
				    type:"post",
				    dateType:"json",
				   } 
		 	}
         }, 
         messages:{ //定义提示信息 
            state_key: {
        	 	required:"状态项不能为空！",
        	 	remote:"该状态已存在！ "
         	}
         } 
    });

	//验证字典修改
	$("#form-update-state-key").validate({

		 event:"keyup" || "blur",
		 errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
         rules:{ //定义验证规则 
		 	update_statekey_state_key: {
		 		required: true
		 	}
         }, 
         messages:{ //定义提示信息 
            update_statekey_state_key: {
        	 	required:"状态项不能为空！"
         	}
         } 
    });


	 
	//验证状态值添加
	$("#form-add-state-value").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
        rules:{ //定义验证规则 
			add_statevalue_state_value: {
		 		required: true
		 	},
		 	add_statevalue_state_key: {
			 	required: true,
		 		isSelected: true
			},
		 	add_statevalue_state_level: {
			 	required: true,
		 		isSelected: true
			}
         }, 
         
         messages:{ //定义提示信息 
        	 add_statevalue_state_value: {
        	 	required:"状态值不能为空！"
         	 },
         	 add_statevalue_state_key: {
	        	 required:"请选择所属状态项！",
			 	isSelected: '请选择所属状态项！'
		     },
         	 add_statevalue_state_level: {
	        	 required:"请选择状态等级！",
				 isSelected: '请选择状态等级！'
		     }
         } 
    });

	//验证状态值修改
	$("#form-update-state-value").validate({

		 event:"keyup" || "blur",
		 errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
         rules:{ //定义验证规则 
			update_statevalue_state_value: {
		 		required: true
		 	},
		 	update_statevalue_state_key: {
			 	required: true,
		 		isSelected: true
			},
		 	update_statevalue_state_level: {
			 	required: true,
		 		isSelected: true
			}
         }, 
         messages:{ //定义提示信息 
        	 update_statevalue_state_value: {
        	 	required:"状态值不能为空！"
         	 },
         	 update_statevalue_state_key: {
	        	 required:"请选择所属状态项！",
			 	isSelected: '请选择所属状态项！'
		     },
         	 update_statevalue_state_level: {
	        	 required:"请选择状态等级！",
				 isSelected: '请选择状态等级！'
		     }
         } 
    });
	//验证状态等级添加
	$("#form-add-state-level").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
         rules:{ //定义验证规则 
			add_statelevel_level: {
		 		required: true,
		 		digits: true
		 	},
		 	add_statelevel_state_image: {
			 	required: true
			}
         }, 
         messages:{ //定义提示信息 
        	 add_statelevel_level: {
        	 	required:"状态等级不能为空！",
        	 	digits: '必须输入整数！',
         	 },
         	 add_statelevel_state_image: {
	        	 required:"请选择状态等级缩略图！",
		     }
         } 
    });

	//验证状态等级修改
	$("#form-update-state-level").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
         rules:{ //定义验证规则 
			update_statelevel_level: {
		 		required: true
		 	}
         }, 
         messages:{ //定义提示信息 
        	 update_statelevel_level: {
        	 	required:"状态等级不能为空！"
         	 }
         } 
    });
    
    //验证智能锁类型添加
	$("#a_form_keytype").validate({

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
	
	$( "#progressbar" ).progressbar({
		value: 100,
		create: function( event, ui ) {
			$(this).addClass('progress progress-striped active')
				   .children(0).addClass('progress-bar progress-bar-success');
		}
	});
    
});
var g_obj = {};
g_obj.rightMenuMouseOver = false;
function rightMenuMouseOver() {
}
function rightMenuMouseOut() {
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
									$('#add_keytype_mark_div').show();
									$('#add_keytype_mark_label').html('添加钥匙类型成功！');
									mySetTimeOut('add_keytype_mark_div', 4000);
									$('#keytype-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#add_keytype_mark_div').show();
									$('#add_keytype_mark_label').html('添加钥匙类型失败！');
									mySetTimeOut('add_keytype_mark_div', 4000);
								}
								$( "#dialog-add-keytype" ).dialog( "close" );
							},
							error : function() {
								$('#add_keytype_mark_div').show();
								$('#add_keytype_mark_label').html('添加钥匙类型失败！');
								mySetTimeOut('add_keytype_mark_div', 4000);
								$( "#dialog-add-keytype" ).dialog( "close" );
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


function addLockType() {
	var dialog = $( "#dialog-add-locktype" ).removeClass('hide').dialog({
		modal: true,
		width: 700,
		height: 400,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加智能锁类型</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "添加",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					var locktype = {};
					locktype.type = $('#a_locktype_type').val();
					locktype.remarks = $('#a_locktype_remarks').val();
					$.ajax( {
						type : "post",
						url : "lockandkey.do?method=addLockTypeInfo",
						contentType : "application/json;charset=UTF-8",
						data:JSON.stringify(locktype),
						dataType: "json", 
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$('#add_keytype_mark_div').show();
								$('#add_keytype_mark_label').html('添加智能锁类型成功！');
								mySetTimeOut('add_keytype_mark_div', 4000);
								$('#keytype-grid-table').trigger("reloadGrid");
							}
							else
							{
								$('#add_keytype_mark_div').show();
								$('#add_keytype_mark_label').html('添加智能锁类型失败！');
								mySetTimeOut('add_keytype_mark_div', 4000);
							}
							$( "#dialog-add-locktype" ).dialog( "close" ); 
						},
						error : function() {
							$('#add_keytype_mark_div').show();
							$('#add_keytype_mark_label').html('添加智能锁类型失败！');
							mySetTimeOut('add_keytype_mark_div', 4000);
							$( "#dialog-add-locktype" ).dialog( "close" ); 
						}
					});
				} 
			},
			{
				text: "取消",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-add-locktype" ).dialog( "close" ); 
				} 
			}
		]
	});
}

function addBackup() {
	var dialog = $( "#dialog-add-backup" ).removeClass('hide').dialog({
		modal: true,
		width: 700,
		height: 400,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加备份</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "添加",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
						modal: true,
						width: 200,
						height: 100,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
						title_html: true,
					});
					var backup = {};
					backup.title = $('#a_backup_title').val();
					backup.remark = $('#a_backup_remark').val();
					$.ajax( {
						type : "post",
						url : "dictionary.do?method=addBackup",
						contentType : "application/json;charset=UTF-8",
						data:JSON.stringify(backup),
						dataType: "json", 
						success : function(data) {
							isOvertime(data.resultMark);
							$( "#dialog-progressbar" ).dialog("close");
							if (data.resultMark == 1)
							{
								$('#add_backup_mark_div').show();
								$('#add_backup_mark_label').html('添加备份成功！');
								mySetTimeOut('add_backup_mark_div', 4000);
								$('#backup-grid-table').trigger("reloadGrid");
							}
							else
							{
								$('#add_backup_mark_div').show();
								$('#add_backup_mark_label').html('添加备份失败！');
								mySetTimeOut('add_backup_mark_div', 4000);
							}
							$( "#dialog-add-backup" ).dialog( "close" ); 
						},
						error : function() {
							$( "#dialog-progressbar" ).dialog("close");
							$('#add_backup_mark_div').show();
							$('#add_backup_mark_label').html('添加备份失败！');
							mySetTimeOut('add_backup_mark_div', 4000);
							$( "#dialog-add-backup" ).dialog( "close" ); 
						}
					});
				} 
			},
			{
				text: "取消",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-add-backup" ).dialog( "close" ); 
				} 
			}
		]
	});
}

function restore(id) {
	if (confirm('确定要还原该备份吗？'))
	{
		var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
			modal: true,
			width: 200,
			height: 100,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
			title_html: true,
		});
		$.ajax( {
			type : "post",
			url : "dictionary.do?method=restoreBackup",
			data: "id=" + id, 
			success : function(data) {
				isOvertime(data.resultMark);
				$( "#dialog-progressbar" ).dialog("close");
				if (data.resultMark == 1)
				{
					$('#add_backup_mark_div').show();
					$('#add_backup_mark_label').html('还原备份成功！');
					mySetTimeOut('add_backup_mark_div', 4000);
				}
				else
				{
					$('#add_backup_mark_div').show();
					$('#add_backup_mark_label').html('还原备份失败！');
					mySetTimeOut('add_backup_mark_div', 4000);
				}
			},
			error : function() {
				$( "#dialog-progressbar" ).dialog("close");
				$('#add_backup_mark_div').show();
				$('#add_backup_mark_label').html('还原备份失败！');
				mySetTimeOut('add_backup_mark_div', 4000);
			}
		});
	}
}

jQuery(function($) {
	var grid_selector = "#grid-table";
	var pager_selector = "#grid-pager";

	var value_grid_selector = "#value-grid-table";
	var value_pager_selector = "#value-grid-pager";
	
	var level_grid_selector = "#level-grid-table";
	var level_pager_selector = "#level-grid-pager";
	
	
	var keytype_grid_selector = "#keytype-grid-table";
	var keytype_pager_selector = "#keytype-grid-pager";
	
	var locktype_grid_selector = "#locktype-grid-table";
	var locktype_pager_selector = "#locktype-grid-pager";
	

	var backup_grid_selector = "#backup-grid-table";
	var backup_pager_selector = "#backup-grid-pager";
	//override dialog's title function to allow for HTML titles
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));

	//绑定字典项列表
	jQuery(grid_selector).jqGrid({
		//direction: "rtl",
		url: 'dictionary.do?method=listPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		width: document.body.clientWidth,
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','状态名', '备注'],
		colModel:[
			{name:'id',index:'id', width:60, sorttype:"int", hidden: true},
			{name:'state_key',index:'state_key'},
			{name:'remarks',index:'remarks', sortable:false}
		], 
		caption: '光交箱状态字典',
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
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
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

	//绑定字典项列表的分页
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: true,
			editfunc: function() {
				var sels = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('请选择要编辑的行！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else if (sels.length > 1)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('只能编辑一行数据，请重新选择！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else
				{
					$.ajax( {
						type : "post",
						url : "dictionary.do?method=findStateKeyByAjax",  
						data: "id=" + sels[0],
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$('#update_statekey_id').val(data.object.id);
								$('#update_statekey_state_key').val(data.object.state_key);
								$('#update_statekey_remarks').html(data.object.remarks);
								var dialog = $("#dialog-update-state-key").removeClass('hide').dialog({
									modal: true,
									width: 800,
									height: 400,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>编辑光交箱状态字典</h4></div>",
									title_html: true,
									buttons: [ 
									    {
											text: "修改",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												if ($('#form-update-state-key').valid())
												{
													$.ajax( {
														type : "post",
														url : "dictionary.do?method=updateStateKeyByAjax",
														data: "id=" + $('#update_statekey_id').val() + "&state_key=" + $('#update_statekey_state_key').val() + "&remarks=" + $('#update_statekey_remarks').val(),
														success : function(data) {
															isOvertime(data.resultMark);
															if (data.resultMark == 1)
															{
																$('#add_statekey_mark_div').show();
																$('#add_statekey_mark_label').html('修改状态字典成功！');
																mySetTimeOut('add_statekey_mark_div', 4000);
																$('#form-update-state-key')[0].reset();
																$('#dialog-update-state-key').dialog( "close" );
																$('#grid-table').trigger("reloadGrid"); 
															}
															else
															{
																$('#add_statekey_mark_div_error').show();
																$('#add_statekey_mark_label_error').html('编辑状态字典失败，请重试');
																mySetTimeOut('add_statekey_mark_div_error', 4000);
															}
														},
														error : function() {
															$('#add_statekey_mark_div_error').show();
															$('#add_statekey_mark_label_error').html('编辑状态字典失败，请重试');
															mySetTimeOut('add_statekey_mark_div_error', 4000);
														}
													});
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
							else
							{
								$('#add_statevalue_mark_div').show();
								$('#add_statevalue_mark_label').html('编辑状态字典项失败，请重试！');
								mySetTimeOut('add_statevalue_mark_div', 4000);
							}
						},
						error : function() {
							$('#add_statevalue_mark_div').show();
							$('#add_statevalue_mark_label').html('编辑状态字典项失败，请重试！');
							mySetTimeOut('add_statevalue_mark_div', 4000);
						}
					});
				}
			},
			editicon : 'icon-pencil blue',
			add: true,
			addfunc: function(){
				var dialog = $( "#dialog-add-state-key" ).removeClass('hide').dialog({
					modal: true,
					width: 800,
					height: 400,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加光交箱状态字典</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#form-add-state-key').valid())
								{
									$.ajax( {
										type : "post",
										url : "dictionary.do?method=addStatekey",
										data : "state_key=" + $('#add_statekey_state_key').val() + '&remarks=' + $('#add_statekey_remarks').val(),
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#add_statekey_mark_div').show();
												$('#add_statekey_mark_label').html('添加状态字典成功！');
												mySetTimeOut('add_statekey_mark_div', 4000);
												$('#form-add-state-key')[0].reset();
												$('#dialog-add-state-key').dialog( "close" );
												$('#grid-table').trigger("reloadGrid"); 
											}
											else
											{
												$('#add_statekey_mark_div_error').show();
												$('#add_statekey_mark_label_error').html('添加状态字典失败，请重试');
												mySetTimeOut('add_statekey_mark_div_error', 4000);
											}
										},
										error : function() {
											$('#add_statekey_mark_div_error').show();
											$('#add_statekey_mark_label_error').html('添加状态字典失败，请重试');
											mySetTimeOut('add_statekey_mark_div_error', 4000);
										}
									});
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$('#form-add-state-key')[0].reset();
								$( this ).dialog( "close" ); 
							} 
						}
					]
				});
			},
			addicon : 'icon-plus-sign purple',
			delfunc: function() {
				var sels = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('请选择要删除的行！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，你确认要删除吗？"))
					{
						var lls = [];
						for (var i = 0; i < sels.length; i ++)
						{
							lls.push(sels[i]);
						}
						$.ajax( {
							type : "post",
							url : "dictionary.do?method=deleteStateKeyByAjax",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(lls),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#add_statekey_mark_div').show();
									$('#add_statekey_mark_label').html('删除状态字典成功！');
									mySetTimeOut('add_statekey_mark_div', 4000);
									$('#grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#add_statekey_mark_div').show();
									$('#add_statekey_mark_label').html('删除状态字典失败，请重试！');
									mySetTimeOut('add_statekey_mark_div', 4000);
								}
							},
							error : function() {
								$('#add_statekey_mark_div').show();
								$('#add_statekey_mark_label').html('删除状态字典失败，请重试！');
								mySetTimeOut('add_statekey_mark_div', 4000);
							}
						});
					}
				}
			},
			del: true,
			delicon : 'icon-trash red',
			search: false,
			searchicon : 'icon-search orange',
			refresh: true,
			refreshicon : 'icon-refresh green',
			view: true,
			viewfunc: function() {
				var sels = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('请选择要查看的行！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else if (sels.length > 1)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('只能查看一行数据，请重新选择！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else
				{
					$.ajax( {
						type : "post",
						url : "dictionary.do?method=findStateKeyByAjax",  
						data: "id=" + sels[0],
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$('#view_statekey_state_key').val(data.object.state_key);
								$('#view_statekey_remarks').html(data.object.remarks);
								var dialog = $("#dialog-view-state-key").removeClass('hide').dialog({
									modal: true,
									width: 800,
									height: 400,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看光交箱状态字典</h4></div>",
									title_html: true,
									buttons: [ 
										{
											text: "确定",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												$( this ).dialog( "close" ); 
											} 
										}
									]
								});
							}
							else
							{
								$('#add_statevalue_mark_div').show();
								$('#add_statevalue_mark_label').html('查看状态字典项失败，请重试！');
								mySetTimeOut('add_statevalue_mark_div', 4000);
							}
						},
						error : function() {
							$('#add_statevalue_mark_div').show();
							$('#add_statevalue_mark_label').html('查看状态字典项失败，请重试！');
							mySetTimeOut('add_statevalue_mark_div', 4000);
						}
					});
				}
			},
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
	
	
	//绑定字典项列表
	var value_grid = jQuery(value_grid_selector).jqGrid({
		//direction: "rtl",
		url: 'dictionary.do?method=stateValueListPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		width: document.body.clientWidth,
		autowidth: true,
		shrinkToFit: true,
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','状态字典','状态值', '状态值等级', '备注'],
		colModel:[
			{name:'id',index:'id', sorttype:"int", hidden: true},
			{name:'stateKey',index:'stateKey.state_key', sortable:false, formatter:function(cellvalue, options, rowObject){
				var temp = '';
				if (rowObject.stateKey != null)
				{
					temp = rowObject.stateKey.state_key;
				}
				return temp;
				}
			},
			{name:'state_value',index:'state_value'},
			{name:'stateLevel',index:'stateLevel.level', formatter:function(cellvalue, options, rowObject){
					return rowObject.stateLevel == null ? "─────" : rowObject.stateLevel.level;
				}
			},
			{name:'remarks',index:'remarks'}
		], 
		caption: '光交箱状态字典项',
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : value_pager_selector,
		altRows: true,
		//toppager: true,
		ondblClickRow: function() {
			var table = this;
			console.log($('#grid-table').jqGrid('getGridParam','selarrrow'));
		},
		onRightClickRow: function(rowid,irow,icol,e) {
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
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

	value_grid.jqGrid('setGridWidth', document.body.clientWidth - 80, true);

	//绑定字典项列表的分页
	//navButtons
	jQuery(value_grid_selector).jqGrid('navGrid',value_pager_selector,
		{ 	//navbar options
			edit: true,
			editfunc: function() {
				var sels = $('#value-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statevalue_mark_div').show();
					$('#add_statevalue_mark_label').html('请选择要编辑的行！');
					mySetTimeOut('add_statevalue_mark_div', 4000);
				}
				else if (sels.length > 1)
				{
					$('#add_statevalue_mark_div').show();
					$('#add_statevalue_mark_label').html('只能编辑一行数据，请重新选择！');
					mySetTimeOut('add_statevalue_mark_div', 4000);
				}
				else
				{
					$.ajax( {
						type : "post",
						url : "dictionary.do?method=findStateValueByAjax",  
						data: "id=" + sels[0],
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								var outerdata = data;
								$.ajax( {
									type : "post",
									url : "dictionary.do?method=listStateKeyAllByAjax",
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											document.getElementById('update_statevalue_state_key').options.length = 0;
											$("<option value='0'></option>").appendTo($("#update_statevalue_state_key"));
											for (var i = 0; i < data.rows.length; i ++)
											{
												$("<option value='" + data.rows[i].id + "'>" + data.rows[i].state_key + "</option>").appendTo($("#update_statevalue_state_key"));
											}
											$('#update_statevalue_state_key').val(outerdata.object.stateKey.id);
										}
									}
								});
								$.ajax( {
									type : "post",
									url : "dictionary.do?method=listStateLevelAllByAjax",
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											document.getElementById('update_statevalue_state_level').options.length = 0;
											$("<option value='0'></option>").appendTo($("#update_statevalue_state_level"));
											for (var i = 0; i < data.rows.length; i ++)
											{
												$("<option value='" + data.rows[i].id + "'>" + data.rows[i].level + "</option>").appendTo($("#update_statevalue_state_level"));
											}
											$('#update_statevalue_state_level').val(outerdata.object.stateLevel.id);
										}
									}
								});
								$('#update_statevalue_id').val(data.object.id);
								$('#update_statevalue_state_value').val(data.object.state_value);
								$('#update_statevalue_remarks').html(data.object.remarks);
								var dialog = $("#dialog-update-state-value").removeClass('hide').dialog({
									modal: true,
									width: 800,
									height: 400,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>编辑光交箱状态项</h4></div>",
									title_html: true,
									buttons: [ 
									    {
											text: "修改",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												if ($('#form-update-state-value').valid())
												{
													var stateValue = {};
													stateValue.stateKey = {};
													stateValue.id = $('#update_statevalue_id').val();
													stateValue.stateKey.id = $('#update_statevalue_state_key').val();
													stateValue.state_value = $('#update_statevalue_state_value').val();
													stateValue.stateLevel = {};
													stateValue.stateLevel.id = $('#update_statevalue_state_level').val();
													stateValue.remarks = $('#update_statevalue_remarks').val();
													$.ajax( {
														type : "post",
														url : "dictionary.do?method=updateStateValueByAjax",
														contentType : "application/json;charset=UTF-8",
														data:JSON.stringify(stateValue),
														dataType: "json", 
														success : function(data) {
															isOvertime(data.resultMark);
															if (data.resultMark == 1)
															{
																$('#add_statevalue_mark_div').show();
																$('#add_statevalue_mark_label').html('修改状态字典项成功！');
																mySetTimeOut('add_statevalue_mark_div', 4000);
																$('#form-update-state-value')[0].reset();
																$('#dialog-update-state-value').dialog( "close" );
																$('#value-grid-table').trigger("reloadGrid"); 
															}
															else
															{
																$('#add_statevalue_mark_div_error').show();
																$('#add_statevalue_mark_label_error').html('编辑状态字典项失败，请重试');
																mySetTimeOut('add_statevalue_mark_div_error', 4000);
															}
														},
														error : function() {
															$('#add_statevalue_mark_div_error').show();
															$('#add_statevalue_mark_label_error').html('编辑状态字典项失败，请重试');
															mySetTimeOut('add_statevalue_mark_div_error', 4000);
														}
													});
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
							else
							{
								$('#add_statevalue_mark_div').show();
								$('#add_statevalue_mark_label').html('编辑状态字典项失败，请重试！');
								mySetTimeOut('add_statevalue_mark_div', 4000);
							}
						},
						error : function() {
							$('#add_statevalue_mark_div').show();
							$('#add_statevalue_mark_label').html('编辑状态字典项失败，请重试！');
							mySetTimeOut('add_statevalue_mark_div', 4000);
						}
					});
				}
			},
			editicon : 'icon-pencil blue',
			add: true,
			addfunc: function(){
				$.ajax( {
					type : "post",
					url : "dictionary.do?method=listStateKeyAllByAjax",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{
							document.getElementById('add_statevalue_state_key').options.length = 0;
							$("<option value='0'></option>").appendTo($("#add_statevalue_state_key"));
							for (var i = 0; i < data.rows.length; i ++)
							{
								$("<option value='" + data.rows[i].id + "'>" + data.rows[i].state_key + "</option>").appendTo($("#add_statevalue_state_key"));
							}
						}
					}
				});
				$.ajax( {
					type : "post",
					url : "dictionary.do?method=listStateLevelAllByAjax",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{

							document.getElementById('add_statevalue_state_level').options.length = 0;
							$("<option value='0'></option>").appendTo($("#add_statevalue_state_level"));
							for (var i = 0; i < data.rows.length; i ++)
							{
								$("<option value='" + data.rows[i].id + "'>" + data.rows[i].level + "</option>").appendTo($("#add_statevalue_state_level"));
							}
						}
					}
				});
				var dialog = $( "#dialog-add-state-value" ).removeClass('hide').dialog({
					modal: true,
					width: 800,
					height: 400,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加光交箱状态值</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#form-add-state-value').valid())
								{
									var stateValue = {};
									stateValue.stateKey = {};
									stateValue.stateKey.id = $('#add_statevalue_state_key').val();
									stateValue.state_value = $('#add_statevalue_state_value').val();
									stateValue.stateLevel = {};
									stateValue.stateLevel.id = $('#add_statevalue_state_level').val();
									stateValue.remarks = $('#add_statevalue_remarks').val();
									$.ajax( {
										type : "post",
										url : "dictionary.do?method=addStateValue",
										contentType : "application/json;charset=UTF-8",
										data:JSON.stringify(stateValue),
										dataType: "json", 
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#add_statevalue_mark_div').show();
												$('#add_statevalue_mark_label').html('添加状态字典项成功！');
												mySetTimeOut('add_statevalue_mark_div', 4000);
												$('#form-add-state-value')[0].reset();
												$('#dialog-add-state-value').dialog( "close" );
												$('#value-grid-table').trigger("reloadGrid"); 
											}
											else
											{
												$('#add_statevalue_mark_div_error').show();
												$('#add_statevalue_mark_label_error').html('添加状态字典项失败，请重试');
												mySetTimeOut('add_statevalue_mark_div_error', 4000);
											}
										},
										error : function() {
											$('#add_statevalue_mark_div_error').show();
											$('#add_statevalue_mark_label_error').html('添加状态字典项失败，请重试');
											mySetTimeOut('add_statevalue_mark_div_error', 4000);
										}
									});
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$('#form-add-state-value')[0].reset();
								$( this ).dialog( "close" ); 
							} 
						}
					]
				});
			},
			addicon : 'icon-plus-sign purple',
			del: true,
			delfunc: function() {
				var sels = $('#value-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statevalue_mark_div').show();
					$('#add_statevalue_mark_label').html('请选择要删除的行！');
					mySetTimeOut('add_statevalue_mark_div', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，你确认要删除吗？"))
					{
						var lls = [];
						for (var i = 0; i < sels.length; i ++)
						{
							lls.push(sels[i]);
						}
						$.ajax( {
							type : "post",
							url : "dictionary.do?method=delStateValueByAjax",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(lls),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#add_statevalue_mark_div').show();
									$('#add_statevalue_mark_label').html('删除状态字典项成功！');
									mySetTimeOut('add_statevalue_mark_div', 4000);
									$('#value-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#add_statevalue_mark_div').show();
									$('#add_statevalue_mark_label').html('删除状态字典项失败，请重试！');
									mySetTimeOut('add_statevalue_mark_div', 4000);
								}
							},
							error : function() {
								$('#add_statevalue_mark_div').show();
								$('#add_statevalue_mark_label').html('删除状态字典项失败，请重试！');
								mySetTimeOut('add_statevalue_mark_div', 4000);
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
			view: true,
			viewfunc: function() {
				var sels = $('#value-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statevalue_mark_div').show();
					$('#add_statevalue_mark_label').html('请选择要查看的行！');
					mySetTimeOut('add_statevalue_mark_div', 4000);
				}
				else if (sels.length > 1)
				{
					$('#add_statevalue_mark_div').show();
					$('#add_statevalue_mark_label').html('只能查看一行数据，请重新选择！');
					mySetTimeOut('add_statevalue_mark_div', 4000);
				}
				else
				{
					$.ajax( {
						type : "post",
						url : "dictionary.do?method=findStateValueByAjax",  
						data: "id=" + sels[0],
						success : function(data) {
							if (data.resultMark == 1)
							{
								var outerdata = data;
								$.ajax( {
									type : "post",
									url : "dictionary.do?method=listStateKeyAllByAjax",
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											document.getElementById('view_statevalue_state_key').options.length = 0;
											$("<option value='0'></option>").appendTo($("#view_statevalue_state_key"));
											for (var i = 0; i < data.rows.length; i ++)
											{
												$("<option value='" + data.rows[i].id + "'>" + data.rows[i].state_key + "</option>").appendTo($("#view_statevalue_state_key"));
											}
											$('#view_statevalue_state_key').val(outerdata.object.stateKey.id);
										}
									}
								});
								$.ajax( {
									type : "post",
									url : "dictionary.do?method=listStateLevelAllByAjax",
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{

											document.getElementById('view_statevalue_state_level').options.length = 0;
											$("<option value='0'></option>").appendTo($("#view_statevalue_state_level"));
											for (var i = 0; i < data.rows.length; i ++)
											{
												$("<option value='" + data.rows[i].id + "'>" + data.rows[i].level + "</option>").appendTo($("#view_statevalue_state_level"));
											}
											$('#view_statevalue_state_level').val(outerdata.object.stateLevel.id);
										}
									}
								});
								$('#view_statevalue_state_value').val(data.object.state_value);
								$('#view_statevalue_remarks').html(data.object.remarks);
								var dialog = $("#dialog-view-state-value").removeClass('hide').dialog({
									modal: true,
									width: 800,
									height: 400,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看光交箱状态项</h4></div>",
									title_html: true,
									buttons: [ 
										{
											text: "确定",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												$( this ).dialog( "close" ); 
											} 
										}
									]
								});
							}
							else
							{
								$('#add_statevalue_mark_div').show();
								$('#add_statevalue_mark_label').html('查看状态字典项失败，请重试！');
								mySetTimeOut('add_statevalue_mark_div', 4000);
							}
						},
						error : function() {
							$('#add_statevalue_mark_div').show();
							$('#add_statevalue_mark_label').html('查看状态字典项失败，请重试！');
							mySetTimeOut('add_statevalue_mark_div', 4000);
						}
					});
				}
			},
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
	
	
	//绑定字典等级列表
	var level_grid = jQuery(level_grid_selector).jqGrid({
		//direction: "rtl",
		url: 'dictionary.do?method=stateLevelListPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		width: document.body.clientWidth,
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','状态字典等级','等级缩略图', '备注'],
		colModel:[
			{name:'id',index:'id', sorttype:"int", hidden: true},
			{name:'level',index:'level'},
			{name:'state_image',index:'state_image', formatter:function(cellvalue, options, rowObject){
					return (rowObject.state_image == null || rowObject.state_image == '') ? "─────" : '<img  src="../' + rowObject.state_image + '" height="50"/>';
				}
			},
			{name:'remarks',index:'remarks'}
		], 
		caption: '光交箱状态字典等级',
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : level_pager_selector,
		altRows: true,
		//toppager: true,
		ondblClickRow: function() {
			var table = this;
			console.log($('#grid-table').jqGrid('getGridParam','selarrrow'));
		},
		onRightClickRow: function(rowid,irow,icol,e) {
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
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


	level_grid.jqGrid('setGridWidth', document.body.clientWidth - 80, true);

	//绑定字典等级列表的分页
	//navButtons
	jQuery(level_grid_selector).jqGrid('navGrid',level_pager_selector,
		{ 	//navbar options
			edit: true,
			editfunc: function() {
				var sels = $('#level-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statelevel_mark_div').show();
					$('#add_statelevel_mark_label').html('请选择要编辑的行！');
					mySetTimeOut('add_statelevel_mark_div', 4000);
				}
				else if (sels.length > 1)
				{
					$('#add_statelevel_mark_div').show();
					$('#add_statelevel_mark_label').html('只能编辑一行数据，请重新选择！');
					mySetTimeOut('add_statelevel_mark_div', 4000);
				}
				else
				{

					$('#update_statelevel_state_image_td').html('');
					$('#update_statelevel_state_image_td').html('<input id="update_statelevel_state_image" name="update_statelevel_state_image" type="file"/><div id="update_statelevel_state_image_view" width="100%"></div>');
					$('#update_statelevel_state_image').ace_file_input({});
					$.ajax( {
						type : "post",
						url : "dictionary.do?method=findStateLevelByAjax",  
						data: "id=" + sels[0],
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$('#update_statelevel_id').val(data.object.id);
								$('#update_statelevel_level').val(data.object.level);
								$('#update_statelevel_state_image_view').html('<img style="max-width:100px !important" src="../' + data.object.state_image + '" />');
								$('#update_statelevel_remarks').html(data.object.remarks);
								var dialog = $("#dialog-update-state-level").removeClass('hide').dialog({
									modal: true,
									width: 800,
									height: 400,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>编辑光交箱状态等级</h4></div>",
									title_html: true,
									buttons: [ 
									    {
											text: "修改",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												if ($('#form-update-state-level').valid())
												{
													$.ajaxFileUpload({
													    //处理文件上传操作的服务器端地址(可以传参数,已亲测可用)
													    url:'dictionary.do?method=updateStateLevel',
													    data: {id : $('#update_statelevel_id').val(), level : $('#update_statelevel_level').val(), remarks : $('#update_statelevel_remarks').val()},
													    secureuri:false,                       //是否启用安全提交,默认为false
													    fileElementId:'update_statelevel_state_image',           //文件选择框的id属性
													    dataType:'text',                       //服务器返回的格式,可以是json或xml等
													    success:function(data, status){        //服务器响应成功时的处理函数
															var resultMark = data.substr(data.indexOf('</pre>') - 1, 1);
															if (resultMark == 1)
															{
																$('#add_statelevel_mark_div').show();
																$('#add_statelevel_mark_label').html('修改状态字典等级成功！');
																mySetTimeOut('add_statelevel_mark_div', 4000);
																$('#form-update-state-level')[0].reset();
																$('#dialog-update-state-level').dialog( "close" );
																$('#level-grid-table').trigger("reloadGrid"); 
															}
															else
															{
																$('#add_statelevel_mark_div_error').show();
																$('#add_statelevel_mark_label_error').html('修改状态字典等级失败，请重试');
																mySetTimeOut('add_statelevel_mark_div_error', 4000);
															}
													    },
													    error:function(data, status, e){ //服务器响应失败时的处理函数
															$('#add_statelevel_mark_div_error').show();
															$('#add_statelevel_mark_label_error').html('修改状态字典等级失败，请重试');
															mySetTimeOut('add_statelevel_mark_div_error', 4000);
													    }
													});
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
							else
							{
								$('#add_statelevel_mark_div').show();
								$('#add_statelevel_mark_label').html('编辑状态字典等级失败，请重试！');
								mySetTimeOut('add_statelevel_mark_div', 4000);
							}
						},
						error : function() {
							$('#add_statelevel_mark_div').show();
							$('#add_statelevel_mark_label').html('编辑状态字典等级失败，请重试！');
							mySetTimeOut('add_statelevel_mark_div', 4000);
						}
					});
				}
			},
			editicon : 'icon-pencil blue',
			add: true,
			addfunc: function(){
				$('#add_statelevel_state_image_td').html('');
				$('#add_statelevel_state_image_td').html('<input id="add_statelevel_state_image" name="add_statelevel_state_image" type="file" class="required"/>');
				$('#add_statelevel_state_image').ace_file_input({});
				var dialog = $( "#dialog-add-state-level" ).removeClass('hide').dialog({
					modal: true,
					width: 800,
					height: 400,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加光交箱状态等级</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#form-add-state-level').valid())
								{
									$.ajaxFileUpload({
									    //处理文件上传操作的服务器端地址(可以传参数,已亲测可用)
									    url:'dictionary.do?method=addStateLevel',
									    data: {level : $('#add_statelevel_level').val(), remarks : $('#add_statelevel_remarks').val()},
									    secureuri:false,                       //是否启用安全提交,默认为false
									    fileElementId:'add_statelevel_state_image',           //文件选择框的id属性
									    dataType:'text',                       //服务器返回的格式,可以是json或xml等
									    success:function(data, status){        //服务器响应成功时的处理函数
											var resultMark = data.substr(data.indexOf('</pre>') - 1, 1);
											if (resultMark == 1)
											{
												$('#add_statelevel_mark_div').show();
												$('#add_statelevel_mark_label').html('添加状态字典等级成功！');
												mySetTimeOut('add_statelevel_mark_div', 4000);
												$('#form-add-state-level')[0].reset();
												$('#dialog-add-state-level').dialog( "close" );
												$('#level-grid-table').trigger("reloadGrid"); 
											}
											else
											{
												$('#add_statelevel_mark_div_error').show();
												$('#add_statelevel_mark_label_error').html('添加状态字典等级失败，请重试');
												mySetTimeOut('add_statelevel_mark_div_error', 4000);
											}
									    },
									    error:function(data, status, e){ //服务器响应失败时的处理函数
											$('#add_statelevel_mark_div_error').show();
											$('#add_statelevel_mark_label_error').html('添加状态字典等级失败，请重试');
											mySetTimeOut('add_statelevel_mark_div_error', 4000);
									    }
									});
								}
								else
								{
									if ($('#add_statelevel_state_image').val() == '')
									{
										alert('请选择状态等级图片！');
									}
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$('#form-add-state-level')[0].reset();
								$( this ).dialog( "close" ); 
							} 
						}
					]
				});
			},
			addicon : 'icon-plus-sign purple',
			del: true,
			delfunc: function() {
				var sels = $('#level-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statelevel_mark_div').show();
					$('#add_statelevel_mark_label').html('请选择要删除的行！');
					mySetTimeOut('add_statelevel_mark_div', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，你确认要删除吗？"))
					{
						var lls = [];
						for (var i = 0; i < sels.length; i ++)
						{
							lls.push(sels[i]);
						}
						$.ajax( {
							type : "post",
							url : "dictionary.do?method=delStateLevelByAjax",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(lls),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#add_statelevel_mark_div').show();
									$('#add_statelevel_mark_label').html('删除状态字典等级成功！');
									mySetTimeOut('add_statelevel_mark_div', 4000);
									$('#level-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#add_statelevel_mark_div').show();
									$('#add_statelevel_mark_label').html('删除状态字典等级失败，请重试！');
									mySetTimeOut('add_statelevel_mark_div', 4000);
								}
							},
							error : function() {
								$('#add_statelevel_mark_div').show();
								$('#add_statelevel_mark_label').html('删除状态字典等级失败，请重试！');
								mySetTimeOut('add_statelevel_mark_div', 4000);
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
			view: true,
			viewfunc: function() {
				var sels = $('#level-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statelevel_mark_div').show();
					$('#add_statelevel_mark_label').html('请选择要查看的行！');
					mySetTimeOut('add_statelevel_mark_div', 4000);
				}
				else if (sels.length > 1)
				{
					$('#add_statelevel_mark_div').show();
					$('#add_statelevel_mark_label').html('只能查看一行数据，请重新选择！');
					mySetTimeOut('add_statelevel_mark_div', 4000);
				}
				else
				{
					$.ajax( {
						type : "post",
						url : "dictionary.do?method=findStateLevelByAjax",  
						data: "id=" + sels[0],
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$('#view_statelevel_level').val(data.object.level);
								$('#view_statelevel_state_image').html('<img style="max-width:100px !important" src="../' + data.object.state_image + '" />');
								$('#view_statelevel_remarks').html(data.object.remarks);
								var dialog = $("#dialog-view-state-level").removeClass('hide').dialog({
									modal: true,
									width: 800,
									height: 400,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看光交箱状态等级</h4></div>",
									title_html: true,
									buttons: [ 
										{
											text: "确定",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												$( this ).dialog( "close" ); 
											} 
										}
									]
								});
							}
							else
							{
								$('#add_statelevel_mark_div').show();
								$('#add_statelevel_mark_label').html('查看状态字典项失败，请重试！');
								mySetTimeOut('add_statelevel_mark_div', 4000);
							}
						},
						error : function() {
							$('#add_statelevel_mark_div').show();
							$('#add_statelevel_mark_label').html('查看状态字典项失败，请重试！');
							mySetTimeOut('add_statelevel_mark_div', 4000);
						}
					});
				}
			},
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
	
	
	//绑定钥匙类型列表
	var keytype_grid = jQuery(keytype_grid_selector).jqGrid({
		//direction: "rtl",
		url: 'lockandkey.do?method=listKeyTypeInfoPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		width: document.body.clientWidth,
		autowidth: true,
		shrinkToFit: true,
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','钥匙类型', '备注'],
		colModel:[
			{name:'id',index:'id', sorttype:"int", hidden: true},
			{name:'type',index:'type'},
			{name:'remarks',index:'remarks'}
		], 
		caption: '钥匙类型',
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : keytype_pager_selector,
		altRows: true,
		//toppager: true,
		ondblClickRow: function() {
			var table = this;
			console.log($('#grid-table').jqGrid('getGridParam','selarrrow'));
		},
		onRightClickRow: function(rowid,irow,icol,e) {
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
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

	keytype_grid.jqGrid('setGridWidth', document.body.clientWidth - 80, true);

	//绑定字典项列表的分页
	//navButtons
	jQuery(keytype_grid_selector).jqGrid('navGrid',keytype_pager_selector,
		{ 	//navbar options
			edit: false,
			editfunc: function() {
				var sels = $('#keytype-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_keytype_mark_div').show();
					$('#add_keytype_mark_label').html('请选择要编辑的行！');
					mySetTimeOut('add_keytype_mark_div', 4000);
				}
				else if (sels.length > 1)
				{
					$('#add_keytype_mark_div').show();
					$('#add_keytype_mark_label').html('只能编辑一行数据，请重新选择！');
					mySetTimeOut('add_keytype_mark_div', 4000);
				}
				else
				{
					var rowdata = $('#keytype-grid-table').jqGrid('getRowData', sels[0]);
					//修改钥匙
				}
			},
			editicon : 'icon-pencil blue',
			add: true,
			addfunc: function(){
				addKeyType();
			},
			addicon : 'icon-plus-sign purple',
			del: true,
			delfunc: function() {
				var sels = $('#keytype-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_keytype_mark_div').show();
					$('#add_keytype_mark_label').html('请选择要删除的行！');
					mySetTimeOut('add_keytype_mark_div', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，你确认要删除吗？"))
					{
						var lls = [];
						for (var i = 0; i < sels.length; i ++)
						{
							lls.push(sels[i]);
						}
						$.ajax( {
							type : "post",
							url : "lockandkey.do?method=deleteKeyTypeInfo",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(lls),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#add_keytype_mark_div').show();
									$('#add_keytype_mark_label').html('删除钥匙类型成功！');
									mySetTimeOut('add_keytype_mark_div', 4000);
									$('#keytype-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#add_keytype_mark_div').show();
									$('#add_keytype_mark_label').html('删除钥匙类型失败，请重试！');
									mySetTimeOut('add_keytype_mark_div', 4000);
								}
							},
							error : function() {
								$('#add_keytype_mark_div').show();
								$('#add_keytype_mark_label').html('删除钥匙类型失败，请重试！');
								mySetTimeOut('add_keytype_mark_div', 4000);
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
			viewfunc: function() {
			},
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
	
	
	//绑定钥匙类型列表
	var locktype_grid = jQuery(locktype_grid_selector).jqGrid({
		//direction: "rtl",
		url: 'lockandkey.do?method=listLockTypeInfoPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		width: document.body.clientWidth,
		autowidth: true,
		shrinkToFit: true,
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','智能锁类型', '备注'],
		colModel:[
			{name:'id',index:'id', sorttype:"int", hidden: true},
			{name:'type',index:'type'},
			{name:'remarks',index:'remarks'}
		], 
		caption: '智能锁类型',
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : locktype_pager_selector,
		altRows: true,
		//toppager: true,
		ondblClickRow: function() {
			var table = this;
		},
		onRightClickRow: function(rowid,irow,icol,e) {
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
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

	locktype_grid.jqGrid('setGridWidth', document.body.clientWidth - 80, true);

	//绑定字典项列表的分页
	//navButtons
	jQuery(locktype_grid_selector).jqGrid('navGrid',locktype_pager_selector,
		{ 	//navbar options
			edit: false,
			editfunc: function() {
				var sels = $('#keytype-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_statevalue_mark_div').show();
					$('#add_statevalue_mark_label').html('请选择要编辑的行！');
					mySetTimeOut('add_statevalue_mark_div', 4000);
				}
				else if (sels.length > 1)
				{
					$('#add_statevalue_mark_div').show();
					$('#add_statevalue_mark_label').html('只能编辑一行数据，请重新选择！');
					mySetTimeOut('add_statevalue_mark_div', 4000);
				}
				else
				{
					$.ajax( {
						type : "post",
						url : "dictionary.do?method=findStateValueByAjax",  
						data: "id=" + sels[0],
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								var outerdata = data;
								$.ajax( {
									type : "post",
									url : "dictionary.do?method=listStateKeyAllByAjax",
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											document.getElementById('update_statevalue_state_key').options.length = 0;
											$("<option value='0'></option>").appendTo($("#update_statevalue_state_key"));
											for (var i = 0; i < data.rows.length; i ++)
											{
												$("<option value='" + data.rows[i].id + "'>" + data.rows[i].state_key + "</option>").appendTo($("#update_statevalue_state_key"));
											}
											$('#update_statevalue_state_key').val(outerdata.object.stateKey.id);
										}
									}
								});
								$.ajax( {
									type : "post",
									url : "dictionary.do?method=listStateLevelAllByAjax",
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											document.getElementById('update_statevalue_state_level').options.length = 0;
											$("<option value='0'></option>").appendTo($("#update_statevalue_state_level"));
											for (var i = 0; i < data.rows.length; i ++)
											{
												$("<option value='" + data.rows[i].id + "'>" + data.rows[i].level + "</option>").appendTo($("#update_statevalue_state_level"));
											}
											$('#update_statevalue_state_level').val(outerdata.object.stateLevel.id);
										}
									}
								});
								$('#update_statevalue_id').val(data.object.id);
								$('#update_statevalue_state_value').val(data.object.state_value);
								$('#update_statevalue_remarks').html(data.object.remarks);
								var dialog = $("#dialog-update-state-value").removeClass('hide').dialog({
									modal: true,
									width: 800,
									height: 400,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>编辑光交箱状态项</h4></div>",
									title_html: true,
									buttons: [ 
									    {
											text: "修改",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												if ($('#form-update-state-value').valid())
												{
													var stateValue = {};
													stateValue.stateKey = {};
													stateValue.id = $('#update_statevalue_id').val();
													stateValue.stateKey.id = $('#update_statevalue_state_key').val();
													stateValue.state_value = $('#update_statevalue_state_value').val();
													stateValue.stateLevel = {};
													stateValue.stateLevel.id = $('#update_statevalue_state_level').val();
													stateValue.remarks = $('#update_statevalue_remarks').val();
													$.ajax( {
														type : "post",
														url : "dictionary.do?method=updateStateValueByAjax",
														contentType : "application/json;charset=UTF-8",
														data:JSON.stringify(stateValue),
														dataType: "json", 
														success : function(data) {
															isOvertime(data.resultMark);
															if (data.resultMark == 1)
															{
																$('#add_statevalue_mark_div').show();
																$('#add_statevalue_mark_label').html('修改状态字典项成功！');
																mySetTimeOut('add_statevalue_mark_div', 4000);
																$('#form-update-state-value')[0].reset();
																$('#dialog-update-state-value').dialog( "close" );
																$('#value-grid-table').trigger("reloadGrid"); 
															}
															else
															{
																$('#add_statevalue_mark_div_error').show();
																$('#add_statevalue_mark_label_error').html('编辑状态字典项失败，请重试');
																mySetTimeOut('add_statevalue_mark_div_error', 4000);
															}
														},
														error : function() {
															$('#add_statevalue_mark_div_error').show();
															$('#add_statevalue_mark_label_error').html('编辑状态字典项失败，请重试');
															mySetTimeOut('add_statevalue_mark_div_error', 4000);
														}
													});
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
							else
							{
								$('#add_statevalue_mark_div').show();
								$('#add_statevalue_mark_label').html('编辑状态字典项失败，请重试！');
								mySetTimeOut('add_statevalue_mark_div', 4000);
							}
						},
						error : function() {
							$('#add_statevalue_mark_div').show();
							$('#add_statevalue_mark_label').html('编辑状态字典项失败，请重试！');
							mySetTimeOut('add_statevalue_mark_div', 4000);
						}
					});
				}
			},
			editicon : 'icon-pencil blue',
			add: true,
			addfunc: function(){
				addLockType();
			},
			addicon : 'icon-plus-sign purple',
			del: true,
			delfunc: function() {
				var sels = $('#locktype-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_locktype_mark_div').show();
					$('#add_locktype_mark_label').html('请选择要删除的行！');
					mySetTimeOut('add_locktype_mark_div', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，你确认要删除吗？"))
					{
						var lls = [];
						for (var i = 0; i < sels.length; i ++)
						{
							lls.push(sels[i]);
						}
						$.ajax( {
							type : "post",
							url : "lockandkey.do?method=deleteLockTypeInfo",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(lls),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#add_locktype_mark_div').show();
									$('#add_locktype_mark_label').html('删除锁类型成功！');
									mySetTimeOut('add_locktype_mark_div', 4000);
									$('#locktype-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#add_locktype_mark_div').show();
									$('#add_locktype_mark_label').html('删除锁类型失败，请重试！');
									mySetTimeOut('add_locktype_mark_div', 4000);
								}
							},
							error : function() {
								$('#add_locktype_mark_div').show();
								$('#add_locktype_mark_label').html('删除锁类型失败，请重试！');
								mySetTimeOut('add_locktype_mark_div', 4000);
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
			viewfunc: function() {
			},
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
	
	
	//绑定备份列表
	var backup_grid = jQuery(backup_grid_selector).jqGrid({
		//direction: "rtl",
		url: 'dictionary.do?method=listBackupPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		width: document.body.clientWidth * 0.9,
		autowidth: true,
		shrinkToFit: true,
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID', '', '标题', '备份时间', '备份人', '备注'],
		colModel:[
			{name:'id',index:'id', sorttype:"int", hidden: true},
			{name:'restore',index:'restore', width:60, formatter:function(cellvalue, options, rowObject){
					var value = '<button onclick="restore(\'' + rowObject.id + '\')" class="btn btn-xs btn-success">还原</button>';
					return value;
				}
			},
			{name:'title',index:'title'},
			{name:'create_date',index:'create_date', width:200, formatter:function(cellvalue, options, rowObject){
					return rowObject.create_date == null ? "" : new Date(rowObject.create_date).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'create_user',index:'create_user', width:200, formatter:function(cellvalue, options, rowObject){
					return rowObject.create_user == null ? "" : rowObject.create_user.full_name;
				}
			},
			{name:'remark',index:'remark'}
		], 
		caption: '智能锁类型',
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : backup_pager_selector,
		altRows: true,
		//toppager: true,
		ondblClickRow: function() {
			var table = this;
		},
		onRightClickRow: function(rowid,irow,icol,e) {
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
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

	backup_grid.jqGrid('setGridWidth', document.body.clientWidth - 80, true);

	//绑定字典项列表的分页
	//navButtons
	jQuery(backup_grid_selector).jqGrid('navGrid', backup_pager_selector,
		{ 	//navbar options
			edit: false,
			editfunc: function() {
				
			},
			editicon : 'icon-pencil blue',
			add: true,
			addfunc: function(){
				addBackup();
			},
			addicon : 'icon-plus-sign purple',
			del: true,
			delfunc: function() {
				var sels = $('#backup-grid-table').jqGrid('getGridParam','selarrrow');
				if (sels.length <= 0)
				{
					$('#add_backup_mark_div').show();
					$('#add_backup_mark_label').html('请选择要删除的行！');
					mySetTimeOut('add_backup_mark_div', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，你确认要删除吗？"))
					{
						var lls = [];
						for (var i = 0; i < sels.length; i ++)
						{
							lls.push(sels[i]);
						}
						$.ajax( {
							type : "post",
							url : "dictionary.do?method=deleteBackup",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(lls),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#add_backup_mark_div').show();
									$('#add_backup_mark_label').html('删除备份成功！');
									mySetTimeOut('add_backup_mark_div', 4000);
									$('#backup-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#add_backup_mark_div').show();
									$('#add_backup_mark_label').html('删除备份失败，请重试！');
									mySetTimeOut('add_backup_mark_div', 4000);
								}
							},
							error : function() {
								$('#add_backup_mark_div').show();
								$('#add_backup_mark_label').html('删除备份失败，请重试！');
								mySetTimeOut('add_backup_mark_div', 4000);
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
			viewfunc: function() {
			},
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
		form.find('.add-rule').addClass('btn btn-primary btn-xs btn-primary');
		form.find('.add-group').addClass('btn btn-primary btn-xs btn-success');
		form.find('.delete-group').addClass('btn btn-primary btn-xs btn-danger');
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