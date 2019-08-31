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

//快速检索
function fastsearch() {
	var log_name = $('#f_s_log_name').val();
	var grant_user = $('#f_s_grant_user').val();
	var key_rfid = $('#f_s_key_rfid').val();
	var key_code = $('#f_s_key_code').val();
	var operator_name = $('#f_s_operator_name').val();
	if (log_name != '' || grant_user != '' || key_rfid != '' || key_code != '' || operator_name != '')
	{
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
          postData:null, //发送搜索条件 
      });
		var postData = {};
		postData.log_name = log_name;
		postData.grant_user = grant_user;
		postData.rfid = key_rfid;
		postData.key_code = key_code;
		postData.operator_name = operator_name;
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
          url:'lockandkey.do?method=listGrantLogPageByAjax',//你的搜索程序地址 
          postData:postData, //发送搜索条件 
          page:1 
      }).trigger("reloadGrid"); //重新载入
	}
}

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
      url:'lockandkey.do?method=listGrantLogPageByAjax',//你的搜索程序地址 
      postData:postData, //发送搜索条件 
      page:1 
  }).trigger("reloadGrid"); //重新载入
}

function showDetail(id) {
	$('#rightclick_contextmenu').hide();
	if (id == null || id === undefined)
	{
		id = g_obj.rightClickNode.id;
	}
	$.ajax( {
		type : "post",
		url : "lockandkey.do?method=fingGrantLogPageByAjax",
		data: "id=" + id,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				$('#view_title').html(data.object.log_name);
				$('#view_grant_user').html(data.object.grant_user);
				$('#view_grant_time').html(new Date(data.object.grant_time).Format("yyyy-MM-dd hh:mm:ss"));
				$('#view_key_no').html(data.object.key_rfid);
			//	$('#view_code').html(data.object.key.key_code);
				$('#view_remarks').html(data.object.remarks);
				if (data.object.gds.length > 0 && data.object.gds[0].begin_time !=null) 
					$('#view_date').html(new Date(data.object.gds[0].begin_time).Format('yyyy-MM-dd') + '至' + new Date(data.object.gds[0].end_time).Format('yyyy-MM-dd'));
				else
					$('#view_date').html('永久');
				$('#view_full_name').html(data.object.operators.full_name);
				var html = '';
				for (var i = 0; i < data.object.gds.length; i ++)
				{
					html += data.object.gds[i].boxInfo.box_no + '<br/>';
				}
				$('#view_boxes').html(html);
				var dialog = $( "#dialog-view" ).removeClass('hide').dialog({
					modal: true,
					width: 900,
					height: 600,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>智能钥匙授权(" + data.object.log_name + ")</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "确定",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-view" ).dialog("close");
							} 
						}
					]
				});
			}
			else
			{
				$('#manage_grant_warn').show();
				$('#manage_grant_warnlabel').html('查看授权失败，请重试！');
				mySetTimeOut('manage_grant_warn', 4000);
			}
		},
		error : function() {
			$('#manage_grant_warn').show();
			$('#manage_grant_warnlabel').html('查看授权失败， 请重试！');
			mySetTimeOut('manage_grant_warn', 4000);
		}
	});
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
	
	//验证钥匙授权添加
	g_obj.form_add_grant = $("#form-add-grant").validate({
		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
         rules:{ //定义验证规则 
			a_grant_log_name: {
		 		required: true
		 	}
         },
         messages:{ //定义提示信息 
        	 a_grant_log_name: {
        	 	required:"授权任务名称不能为空！"
         	 }
         } 
    });
	
	//验证钥匙授权修改
	$("#form-update-grant").validate({
		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
         rules:{ //定义验证规则 
			u_grant_log_name: {
		 		required: true
		 	}
         },
         messages:{ //定义提示信息 
        	 u_grant_log_name: {
        	 	required:"授权任务名称不能为空！"
         	 }
         } 
    });

	
	//绑定钥匙授权列表
	jQuery(manage_grant_grid_selector).jqGrid({
		// direction: "rtl",
		url: 'lockandkey.do?method=listGrantLogPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','授权任务名称', '授权人', '授权时间', '钥匙编号',  '使用人姓名', '授权光交箱信息', '权限开始时间', '权限结束时间'],
		colModel:[
			{name:'id',index:'id', width:60, sorttype:"int", hidden: true},
			{name:'log_name',index:'log_name'},
			{name:'grant_user',index:'grant_user'},
			{name:'grant_time',index:'grant_time', width:200, formatter:function(cellvalue, options, rowObject){
					return rowObject.grant_time == null ? "" : new Date(rowObject.grant_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
	     	{name:'key_rfid',index:'key_rfid'},
			
			{name:'operators',index:'operators.name', formatter:function(cellvalue, options, rowObject){
					return rowObject.operators == null ? "" : rowObject.operators.full_name;
				}
			},
			{name:'gds',index:'boxes', sortable:false, width:200, formatter:function(cellvalue, options, rowObject){
					var temp = '';
					if (rowObject.gds != null && rowObject.gds.length > 0)
					{
						for (var i = 0; i < rowObject.gds.length; i ++)
						{
							temp += rowObject.gds[i].boxInfo.box_no + '<br/>';
							if (i == 3 && rowObject.gds.length > 4)
							{
								temp += '等等，共' + rowObject.gds.length + '个光交箱';
								break;
							}
						}
					}
					else
					{
						temp = ''; 
					}
					return temp;
				}
			},
			{name:'gds',index:'begin_time', sortable:false, formatter:function(cellvalue, options, rowObject){
					var temp = '';
					if (rowObject.gds != null && rowObject.gds.length > 0)
					{
						if (rowObject.gds[0].begin_time == null || rowObject.gds[0].begin_time == '')
						{
							temp = '永久';
						}
						else
						{
							temp = new Date(rowObject.gds[0].begin_time).Format("yyyy-MM-dd");
						}
					}
					else
					{
						temp = ''; 
					}
					return temp;
				}
			},
			{name:'gds',index:'end_time', sortable:false, formatter:function(cellvalue, options, rowObject){
				
					var temp = '';
					if (rowObject.gds != null && rowObject.gds.length > 0)
					{
						if (rowObject.gds[0].end_time == null || rowObject.gds[0].end_time == '')
						{
							temp = '永久';
						}
						else
						{
							temp = new Date(rowObject.gds[0].end_time).Format("yyyy-MM-dd");
						}
					}
					else
					{
						temp = ''; 
					}
					return temp;
				}
			}
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
			g_obj.rightClickPos = {
					pageX : e.pageX,
					pageY : e.pageY
			};
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
			g_obj.rightClickNode = $('#manage-grant-grid-table').jqGrid('getRowData',rowid);
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
			edit: $('#keyAuthorize_update').val() == 'true' ? true : false,
			editfunc: function(){
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
					$.ajax( {
						type : "post",
						url : "lockandkey.do?method=fingGrantLogPageByAjax",
						data : "id=" + array[0],
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								g_obj.keys_sels = [];
								g_obj.boxes_sels = [];
								g_obj.operators_sels = [];
								
								var _data = data;
								$('#u_grant_log_name').val(_data.object.log_name);
								$('#u_grant_id').val(_data.object.id);
								$('#u_grant_remarks').val(_data.object.remarks);
								$('#u_grant_begin_time').val(_data.object.gds.length > 0 && _data.object.gds[0].begin_time != null ? new Date(_data.object.gds[0].begin_time).Format("yyyy-MM-dd") : '');
								$('#u_grant_end_time').val(_data.object.gds.length > 0 && _data.object.gds[0].begin_time != null ? new Date(_data.object.gds[0].end_time).Format("yyyy-MM-dd") : '');
								
								if (g_obj.u_tree1 == null)
								{
									$.ajax( {
										type : "post",
										url : "lockandkey.do?method=listDepartmentKeyTree",
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												g_obj.keys = data.tree;
												$('#u_tree_div1').html('<div id="u_tree1" class="ztree"></div>');
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
														beforeCheck: function (treeId, treeNode) {
															var zTree = $.fn.zTree.getZTreeObj("u_tree1");
															g_obj.keys_sels = zTree.getCheckedNodes(true);
															if (treeNode.type == 1)
															{
																return false;
															}
															else
															{
																if (g_obj.keys_sels.length > 0)
																{
																	if (g_obj.keys_sels[1].id != treeNode.id)
																	{
																		g_obj.u_tree1.checkAllNodes(false);
																	}
																}
															}
															return true;
														},
														onCheck: function (e, treeId, treeNode) {
															var zTree = $.fn.zTree.getZTreeObj("u_tree1");
															g_obj.keys_sels = zTree.getCheckedNodes(true);
														}
													}
												};
												g_obj.u_tree1 = $.fn.zTree.init($("#u_tree1"), setting, data.tree);
												g_obj.u_tree1.checkAllNodes(false);
												if (_data.object.key != null)
												{
													var node = g_obj.u_tree1.getNodeByParam('id', _data.object.key.id);
													g_obj.u_tree1.checkNode(node, true, true, true);
												}
											}
										}
									});
								}
								else
								{
									g_obj.u_tree1.checkAllNodes(false);
									if (_data.object.key != null)
									{
										var node = g_obj.u_tree1.getNodeByParam('id', _data.object.key.id);
										g_obj.u_tree1.checkNode(node, true, true, true);
									}
								}
								if (g_obj.u_tree2 == null)
								{
									$.ajax( {
										type : "post",
										url : "boxinfo.do?method=listDepartmentBoxTree",
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#u_tree_div2').html('<div id="u_tree2" class="ztree"></div>');
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
															var zTree = $.fn.zTree.getZTreeObj("u_tree2");
															g_obj.boxes_sels = zTree.getCheckedNodes(true);
														}
													}
												};
												g_obj.u_tree2 = $.fn.zTree.init($("#u_tree2"), setting, data.tree);
												g_obj.u_tree2.checkAllNodes(false);
												for (var i = 0; i < _data.object.gds.length; i ++){
													if (_data.object.gds[i].boxInfo != null)
													{
														var node = g_obj.u_tree2.getNodeByParam('id', _data.object.gds[i].boxInfo.id);
														g_obj.u_tree2.checkNode(node, true, true, true);
													}
												}
											}
										},
										error : function () {
											console.log('get listDepartmentBoxTree error');
										}
									});
								}
								else
								{
									g_obj.u_tree2.checkAllNodes(false);
									for (var i = 0; i < _data.object.gds.length; i ++){
										if (_data.object.gds[i].boxInfo != null)
										{
											var node = g_obj.u_tree2.getNodeByParam('id', _data.object.gds[i].boxInfo.id);
											g_obj.u_tree2.checkNode(node, true, true, true);
										}
									}
								}
								if (g_obj.u_tree3 == null)
								{
									$.ajax( {
										type : "post",
										url : "operators.do?method=listDepartmentOperTree",
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												g_obj.operators = data.tree;
												$('#u_tree_div3').html('<div id="u_tree3" class="ztree"></div>');
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
															var zTree = $.fn.zTree.getZTreeObj("u_tree3");
															g_obj.operators_sels = zTree.getCheckedNodes(true);
															if (treeNode.type == 1)
															{
																return false;
															}
															else
															{
																if (g_obj.operators_sels.length > 0)
																{
																	if (g_obj.operators_sels[1].id != treeNode.id)
																	{
																		g_obj.u_tree3.checkAllNodes(false);
																	}
																}
															}
															return true;
														},
														onCheck: function (e, treeId, treeNode) {
															var zTree = $.fn.zTree.getZTreeObj("u_tree3");
															g_obj.operators_sels = zTree.getCheckedNodes(true);
														}
													}
												};
												g_obj.u_tree3 = $.fn.zTree.init($("#u_tree3"), setting, data.tree);
												g_obj.u_tree3.checkAllNodes(false);
												if (_data.object.operators != null)
												{
													var node = g_obj.u_tree3.getNodeByParam('id', _data.object.operators.id);
													g_obj.u_tree3.checkNode(node, true, true, true);
												}
											}
										}
									});
								}
								else
								{
									g_obj.u_tree3.checkAllNodes(false);
									if (_data.object.operators != null)
									{
										var node = g_obj.u_tree3.getNodeByParam('id', _data.object.operators.id);
										g_obj.u_tree3.checkNode(node, true, true, true);
									}
								}
								var dialog = $("#dialog-update-grant").removeClass('hide').dialog({
									modal: true,
									width: 1000,
									height: 800,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改钥匙授权</h4></div>",
									title_html: true,
									buttons: [ 
										{
											text: "确定",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												if ($('#form-update-grant').valid() && g_obj.keys_sels.length > 0 && g_obj.operators_sels.length > 0 && g_obj.operators_sels.length > 0)
												{
													var grant = '';
													grant += 'id=' + $('#u_grant_id').val();
													grant += '&log_name=' + $('#u_grant_log_name').val();
													grant += '&key.id=' + g_obj.keys_sels[1].id;
													grant += '&operators.id=' + g_obj.operators_sels[1].id;
													grant += '&remarks=' + $('#u_grant_remarks').val();
													var temp = 0;
													for (var i = 0; i < g_obj.boxes_sels.length; i ++)
													{
														if (g_obj.boxes_sels[i].type == 2)
														{
															grant += '&gds[' + temp + '].boxInfo.id=' + g_obj.boxes_sels[i].id;
															if ($('#u_grant_begin_time').val() != '' && $('#u_grant_end_time').val() != '') {
																grant += '&gds[' + temp + '].begin_time=' + $('#u_grant_begin_time').val() + ' 12:00:00';
																grant += '&gds[' + temp + '].end_time=' + $('#u_grant_end_time').val() + ' 12:00:00';
															}
															temp ++;
														}
													}
													$.ajax( {
														type : "post",
														url : "lockandkey.do?method=updateGrantLog",
														data: grant,
														success : function(data) {
															isOvertime(data.resultMark);
															if (data.resultMark == 1)
															{
																$('#manage_grant_warn').show();
																$('#manage_grant_warn_label').html('修改钥匙授权成功！');
																mySetTimeOut('manage_grant_warn', 4000);
																$('#manage-grant-grid-table').trigger("reloadGrid");
															}
															else
															{
																$('#manage_grant_warn').show();
																$('#manage_grant_warn_label').html('修改钥匙授权失败，请重试！');
																mySetTimeOut('manage_grant_warn', 4000);
															}
															$("#dialog-update-grant").dialog( "close" ); 
														},
														error : function() {
															$('#manage_grant_warn').show();
															$('#manage_grant_warn_label').html('修改钥匙授权失败，请重试！');
															mySetTimeOut('manage_grant_warn', 4000);
															$( "#dialog-update-grant" ).dialog( "close" ); 
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
												$( "#dialog-update-grant" ).dialog( "close" ); 
											} 
										}
									]
								});
							}
						},
						error : function() {
							$('#manage_grant_warn').show();
							$('#manage_grant_warn_label').html('获取钥匙权限出错，请重试！');
							mySetTimeOut('manage_grant_warn', 4000);
						}
					});
				}
			},
			editicon : 'icon-pencil blue',
			add: $('#keyAuthorize_add').val() == 'true' ? true : false,
			addfunc: function(){
				g_obj.keys_sels = [];
				g_obj.boxes_sels = [];
				g_obj.operators_sels = [];
				$.ajax( {
					type : "post",
					url : "lockandkey.do?method=listDepartmentKeyTree",
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
									beforeCheck: function (treeId, treeNode) {
										var zTree = $.fn.zTree.getZTreeObj("tree1");
										g_obj.keys_sels = zTree.getCheckedNodes(true);
										if (treeNode.type == 1)
										{
											return false;
										}
										else
										{
											if (g_obj.keys_sels.length > 0)
											{
												if (g_obj.keys_sels[1].id != treeNode.id)
												{
													$.fn.zTree.getZTreeObj("tree1").checkAllNodes(false);
												}
											}
										}
										return true;
									},
									onCheck: function (e, treeId, treeNode) {
										var zTree = $.fn.zTree.getZTreeObj("tree1");
										g_obj.keys_sels = zTree.getCheckedNodes(true);
										if (treeNode.checked)
										{
											if (treeNode.operId > 0)
											{
												if (confirm('是否使用该钥匙使用人 "' + treeNode.operName + '" 作为选择人员?'))
												{
													var tree = $.fn.zTree.getZTreeObj("tree3"); 
													tree.checkAllNodes(false);
													var node = tree.getNodeByParam('id', treeNode.operId);
													tree.checkNode(node, true, true, true);
												}
											}
										}
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
											if (g_obj.operators_sels.length > 0)
											{
												if (g_obj.operators_sels[1].id != treeNode.id)
												{
													$.fn.zTree.getZTreeObj("tree3").checkAllNodes(false);
												}
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
					height: 800,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加钥匙授权</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#form-add-grant').valid() && g_obj.keys_sels.length > 0 && g_obj.operators_sels.length > 0 && g_obj.operators_sels.length > 0)
								{
									var grant = '';
									grant += 'log_name=' + $('#a_grant_log_name').val();
									grant += '&key_id=' + g_obj.keys_sels[1].id;
									grant += '&operators.id=' + g_obj.operators_sels[1].id;
									grant += '&remarks=' + $('#a_grant_remarks').val();
									var temp = 0;
									for (var i = 0; i < g_obj.boxes_sels.length; i ++)
									{
										if (g_obj.boxes_sels[i].type == 2)
										{
											grant += '&gds[' + temp + '].boxInfo.id=' + g_obj.boxes_sels[i].id;
											if ($('#a_grant_begin_time').val() != '' && $('#a_grant_end_time').val() != '') {
												grant += '&gds[' + temp + '].begin_time=' + $('#a_grant_begin_time').val() + ' 12:00:00';
												grant += '&gds[' + temp + '].end_time=' + $('#a_grant_end_time').val() + ' 12:00:00';
											}
											temp ++;
										}
									}
									$.ajax( {
										type : "post",
										url : "lockandkey.do?method=addGrantLog",
										data: grant,
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#manage_grant_warn').show();
												$('#manage_grant_warn_label').html('添加钥匙授权成功！');
												mySetTimeOut('manage_grant_warn', 4000);
												g_obj.form_add_grant.resetForm();
												$('#manage-grant-grid-table').trigger("reloadGrid");
											}
											else
											{
												$('#manage_grant_warn').show();
												$('#manage_grant_warn_label').html('添加钥匙授权失败，请重试！');
												mySetTimeOut('manage_grant_warn', 4000);
											}
											$("#dialog-add-grant").dialog("close"); 
										},
										error : function() {
											$('#manage_grant_warn').show();
											$('#manage_grant_warn_label').html('添加钥匙授权失败，请重试！');
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
			del: $('#keyAuthorize_delete').val() == 'true' ? true : false,
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
							url : "lockandkey.do?method=deleteGrantLog",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(ids),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#manage_grant_warn').show();
									$('#manage_grant_warn_label').html('删除钥匙授权成功！');
									mySetTimeOut('manage_grant_warn', 4000);
									$('#manage-grant-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#manage_grant_warn').show();
									$('#manage_grant_warn_label').html('删除钥匙授权失败，请重试！');
									mySetTimeOut('manage_grant_warn', 4000);
								}
							},
							error : function() {
								$('#manage_grant_warn').show();
								$('#manage_grant_warn_label').html('删除钥匙授权失败，请重试！');
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
			view: $('#keyAuthorize_view').val() == 'true' ? true : false,
			viewfunc: function () {
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
					showDetail(array[0]);
				}
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