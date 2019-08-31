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

function rightMenuMouseOver() {
}

function rightMenuMouseOut() {
}


//add by ly  针对一对多的跳纤情况，返回端子名称
function findTerminalName(front_terminal_id) {
	       var terminalname;

		  $.ajax( {
	  				type : "post",
	  				async: false, 
	  				url : "boxinfo.do?method=getTerminalName",
	  				data : "terminalid=" + front_terminal_id,
	  				success : function(data) {
	  			  		
	  					if (data != null && data.resultMark == 1) 
	  					{
	  						if (data.object != null)
	  							terminalname = data.object ;

	  					}
	  					else 
	  					{
	  						terminalname =  "";
	  					}
	  				},
	  				error: function() {
	  					
	  				}
	  		  });

         return terminalname;

      }


      //add by ly  针对一对多的跳纤情况，返回端子名称
function findCoreName(coreid) {
	       var corename;

		  $.ajax( {
	  				type : "post",
	  				async: false, 
	  				url : "boxinfo.do?method=getCoreName",
	  				data : "coreid=" + coreid,
	  				success : function(data) {
	  			  		
	  					if (data != null && data.resultMark == 1) 
	  					{
	  						if (data.object != null)
	  							corename = data.object ;

	  					}
	  					else 
	  					{
	  						corename =  "";
	  					}
	  				},
	  				error: function() {
	  					
	  				}
	  		  });

         return corename;

      }

// 显示选择部门窗口
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

// 取消选择部门
function cancelDepartment(name, id) {
    $('#' + id).val('');
    $('#' + name).val('');
}

// 显示选择光交箱窗口
function chooseBox(name, id) {
	g_obj.chooseBox = {name : name, id : id};

	if (g_obj.box_dialog == null)
	{
		$('#rightclick_contextmenu').hide();
	var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
		modal: true,
		width: 200,
		height: 100,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
		title_html: true,
	});


		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=listDepartmentBoxTree",
			success : function(data) {
				$( "#dialog-progressbar").dialog("close");
				isOvertime(data.resultMark);
				if (data.resultMark == 1)
				{
					g_obj.boxes = data.tree;
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
								var zTree = $.fn.zTree.getZTreeObj("box_tree");
								g_obj.boxes_sels = zTree.getCheckedNodes(true);
								if (treeNode.type == 1)
								{
									return false;
								}
								else
								{
									if (g_obj.boxes_sels.length > 0)
									{
										if (g_obj.boxes_sels[1].id != treeNode.id)
										{
											g_obj.u_tree2.checkAllNodes(false);
										}
									}
								}
								return true;
							},
							onCheck: function (e, treeId, treeNode) {
								var zTree = $.fn.zTree.getZTreeObj("box_tree");
								g_obj.boxes_sels = zTree.getCheckedNodes(true);
							}
						}
					};
					g_obj.u_tree2 = $.fn.zTree.init($("#box_tree"), setting, data.tree);
					g_obj.box_dialog = $( "#dialog-box-tree" ).removeClass('hide').dialog({
						width: 500,
						height: 400,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>选择光交箱</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "确认",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									if (g_obj.boxes_sels.length > 0)
									{
										if (g_obj.chooseBox.name != null && g_obj.chooseBox.name != '')
										{
											$('#' + g_obj.chooseBox.name).val(g_obj.boxes_sels[1].name);
										}
										if (g_obj.chooseBox.id != null && g_obj.chooseBox.id != '')
										{
											$('#' + g_obj.chooseBox.id).val(g_obj.boxes_sels[1].id);
										}
									}
									g_obj.box_dialog.dialog("close"); 
								} 
							},
							{
								text: "取消",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									g_obj.box_dialog.dialog("close"); 
								} 
							}
						]
					});
				}
			},
			error : function () {
				console.log('get listDepartmentBoxTree error');
				 $( "#dialog-progressbar").dialog("close");
			}
		});
	}
	else
	{
		g_obj.boxes_sels = [];
		g_obj.u_tree2.checkAllNodes(false);
		g_obj.box_dialog.dialog('open');
	}
}

// 取消光交箱的选择
function clearBox(id, did)
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
function chooseUser(name, id, department) {
	if ($('#' + department).val() == null || $('#' + department).val() == '')
	{
		alert('请先选择部门');
		return false;
	}
	g_obj.chooseUser = {name : name, id : id};
	$.ajax( {
		type : "post",
		url : "user.do?method=findByDepartmentId",
		data : 'id=' + $('#' + department).val(),
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				$('#user_tree_div').html('<div id="user_tree_ul" class="ztree"></div>');
				var data_t = [];
				for (var i = 0; i < data.rows.length; i ++)
				{
					var temp = {};
					temp.id = data.rows[i].id;
					temp.type = 2;
					temp.name = data.rows[i].full_name;
					data_t.push(temp);
				}
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
				g_obj.user_tree = $.fn.zTree.init($("#user_tree_ul"), setting, data_t);
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


// 快速检索
function fastsearch() {
	var order_no = $('#f_s_order_no').val();
	if (order_no != '')
	{
		$("#grid-table").jqGrid('setGridParam',{ 
            postData:null, // 发送搜索条件
        });
		var postData = {};
		postData.order_no = order_no;
		$("#grid-table").jqGrid('setGridParam',{ 
            url:'boxinfo.do?method=listWorkOrderByAjax',// 你的搜索程序地址
            postData:postData, // 发送搜索条件
            page:1 
        }).trigger("reloadGrid"); // 重新载入
	}
}

function detailsearch()
{
	$("#grid-table").jqGrid('setGridParam',{ 
        postData:null, // 发送搜索条件
    });
	var dialog = $( "#dialog-search-boxinfo" ).removeClass('hide').dialog({
		modal: true,
		width: 1000,
		height: 500,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>检索工单</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					var postData = {};
					if ($('#s_order_order_no').val() != '')
					{
						postData.order_no = $('#s_order_order_no').val(); 
					}
					if ($('#s_order_create_user_name').val() != '')
					{
						postData.create_user_id = $('#s_order_create_user_id').val(); 
					}
					if ($('#s_department_name').val() != '')
					{
						postData.department_id = $('#s_department_id').val();
					}
					if ($('#s_order_receive_user_name').val() != '')
					{
						postData.receive_user_id = $("#s_order_receive_user_id").val();
					}
					if ($('input[name="s_order_create_type"]:checked').val() !== undefined)
					{
						postData.create_type = $('input[name="s_order_create_type"]:checked').val();
					}
					if ($('input[name="s_order_type"]:checked').val() !== undefined)
					{
						postData.type = $('input[name="s_order_type"]:checked').val();
					}
					if ($('input[name="s_order_done_type"]:checked').val() !== undefined)
					{
						postData.done_type = $('input[name="s_order_done_type"]:checked').val();
					}
					$("#grid-table").jqGrid('setGridParam',{
				        url:'boxinfo.do?method=listWorkOrderByAjax',// 你的搜索程序地址
				        postData:postData, // 发送搜索条件
				        page:1 
				    }).trigger("reloadGrid"); // 重新载入
					$( "#dialog-search-boxinfo" ).dialog( "close" );
				} 
			}
		]
	});
}

function resetsearch()
{
	$('#d_search_form')[0].reset();
	$("#grid-table").jqGrid('setGridParam',{ 
        postData:null, // 发送搜索条件
    });
	var postData = {
			rows : 10,
			page : 1
	};
	$("#grid-table").jqGrid('setGridParam',{ 
        url:'boxinfo.do?method=listWorkOrderByAjax',// 你的搜索程序地址
        postData:postData, // 发送搜索条件
        page:1 
    }).trigger("reloadGrid"); // 重新载入
}


function startchoose()
{
	var type = $('#a_type').val();
	var boxid = $('#a_box_id').val();
	var style = $('#a_style').val();
	if (type == 0 || boxid == '' || style == 0)
	{
		alert('请选择工单类型,光交箱以及方式!');
	}
	else
	{
		if (type == 1)
		{
			jumpTerminal();
		}
		else if (type == 2)
		{
			coreToTerminal();
		}
		else if (type == 3)
		{
			coreToCore();
		}
	}
	return false;
}

//
function startchooseforupdate()
{
	var type = $('#a_type_update').val();
	var boxid = $('#b_box_id').val();
	var style = $('#a_style_update').val();
	if (type == 0 || boxid == '' || style == 0)
	{
		alert('请选择工单类型,光交箱以及方式!');
	}
	else 
	{
		if (type == 1)
		{
			jumpTerminalforupdate();
		}
		else if (type == 2)
		{
			coreToTerminal();
		}
		else if (type == 3)
		{
			coreToCore();
		}
	}
	return false;
}

// 操作表格
function getDel(k){
    $(k).parent().remove();
}


// 删除跳纤选择，严格或者批量，跳纤还是解除
function relievejumpterminal(id, style, outer)
{
	if (outer == 1)
	{
		
		for (var i = 0; i < g_obj.a_task_jumpterminal.rows.length; i ++)
		{
			if (g_obj.a_task_jumpterminal.rows[i].id == id)
			{
				if (g_obj.a_task_jumpterminal.rows[i].isAdd == 0)
				{
					for (var j = 0; j < g_obj.a_task_jumpterminal.rows.length; j ++)
					{
						if (g_obj.a_task_jumpterminal.rows[j].isAdd == 1)
						{
							if (g_obj.a_task_jumpterminal.rows[j].style == 1) // 严格成对
							{
								if (g_obj.a_task_jumpterminal.rows[i].one.id == g_obj.a_task_jumpterminal.rows[j].one.id 
										|| g_obj.a_task_jumpterminal.rows[i].one.id == g_obj.a_task_jumpterminal.rows[j].another.id
										|| g_obj.a_task_jumpterminal.rows[i].another.id == g_obj.a_task_jumpterminal.rows[j].one.id
										|| g_obj.a_task_jumpterminal.rows[i].another.id == g_obj.a_task_jumpterminal.rows[j].another.id)
								{
									alert('您有其他跳纤任务的端子绑定了这个解除跳纤任务的端子，请先删除跳纤任务！');
									return false;
								}
							}
						/*	else // 批量成对
							{
								for (var k = 0; k < g_obj.a_task_jumpterminal.rows[j].one.length; k ++)
								{
									if (g_obj.a_task_jumpterminal.rows[i].one.id == g_obj.a_task_jumpterminal.rows[j].one[k].id 
											|| g_obj.a_task_jumpterminal.rows[i].another.id == g_obj.a_task_jumpterminal.rows[j].one[k].id)
									{
										alert('您有其他跳纤任务的端子绑定了这个解除跳纤任务的端子，请先删除跳纤任务！');
										return false;
									}
								}
								for (var k = 0; k < g_obj.a_task_jumpterminal.rows[j].another.length; k ++)
								{
									if (g_obj.a_task_jumpterminal.rows[i].one.id == g_obj.a_task_jumpterminal.rows[j].another[k].id 
											|| g_obj.a_task_jumpterminal.rows[i].another.id == g_obj.a_task_jumpterminal.rows[j].another[k].id)
									{
										alert('您有其他跳纤任务的端子绑定了这个解除跳纤任务的端子，请先删除跳纤任务！');
										return false;
									}
								}
							}*/
						}
					}
				}
				$('#' + id).remove();
				g_obj.a_task_jumpterminal.rows.splice(i, 1);
			}
		}
	}
	else
	{
		if (style == 1) // 删除严格成对，包括跳纤和解除跳纤
		{
			for (var i = 0; i < g_obj.a_task_jumpterminal_onetoone.rows.length; i ++)
			{
				if (g_obj.a_task_jumpterminal_onetoone.rows[i].id == id) // 找到目标
				{
					if (g_obj.a_task_jumpterminal_onetoone.rows[i].isAdd == 0)
					{
						for (var j = 0; j < g_obj.a_task_jumpterminal_onetoone.rows.length; j ++)
						{
							if (g_obj.a_task_jumpterminal_onetoone.rows[j].isAdd == 1)
							{
								if (g_obj.a_task_jumpterminal_onetoone.rows[i].one.id == g_obj.a_task_jumpterminal_onetoone.rows[j].one.id 
										|| g_obj.a_task_jumpterminal_onetoone.rows[i].one.id == g_obj.a_task_jumpterminal_onetoone.rows[j].another.id
										|| g_obj.a_task_jumpterminal_onetoone.rows[i].another.id == g_obj.a_task_jumpterminal_onetoone.rows[j].one.id
										|| g_obj.a_task_jumpterminal_onetoone.rows[i].another.id == g_obj.a_task_jumpterminal_onetoone.rows[j].another.id)
								{
									alert('您有其他跳纤任务的端子绑定了这个解除跳纤任务的端子，请先删除跳纤任务！');
									return false;
								}
							}
						}
						if ($('#a_style').val() == 2)
						{
							for (var k = 0; k < g_obj.jump_last_left_click.length; k ++)
							{
								if (g_obj.a_task_jumpterminal_onetoone.rows[i].one.id == g_obj.jump_last_left_click[k].id 
										|| g_obj.a_task_jumpterminal_onetoone.rows[i].rows[i].another.id == g_obj.jump_last_left_click[k].id)
								{
									alert('您有其他跳纤任务的端子绑定了这个解除跳纤任务的端子，请先删除跳纤任务！');
									return false;
								}
							}
							for (var k = 0; k < g_obj.jump_last_right_click.length; k ++)
							{
								if (g_obj.a_task_jumpterminal_onetoone.rows[i].one.id == g_obj.jump_last_right_click[k].id 
										|| g_obj.a_task_jumpterminal_onetoone.rows[i].another.id == g_obj.jump_last_right_click[k].id)
								{
									alert('您有其他跳纤任务的端子绑定了这个解除跳纤任务的端子，请先删除跳纤任务！');
									return false;
								}
							}
						}
					}
					// 恢复颜色
					if (confirm('您确定要删除该解除跳纤任务吗？'))
					{
						if (g_obj.a_task_jumpterminal_onetoone.rows[i].isAdd == 0)
						{
							$('#' + g_obj.a_task_jumpterminal_onetoone.rows[i].one.id).attr('src', 'images/circle_green.png');
							$('#' + g_obj.a_task_jumpterminal_onetoone.rows[i].another.id).attr('src', 'images/circle_green.png');
						}
						else
						{
							$('#' + g_obj.a_task_jumpterminal_onetoone.rows[i].one.id).attr('src', 'images/circle_red.png');
							$('#' + g_obj.a_task_jumpterminal_onetoone.rows[i].another.id).attr('src', 'images/circle_red.png');
						}
						$('#' + g_obj.a_task_jumpterminal_onetoone.rows[i].id).remove();
						g_obj.a_task_jumpterminal_onetoone.rows.splice(i, 1);
					}
					break;
				}
			}
		}
		else if (style == 2) // 删除批量成对
		{
			for (var i = 0; i < g_obj.jump_last_left_click.length; i ++)
			{
				$('#' + g_obj.jump_last_left_click[i].id).attr('src', 'images/circle_red.png');
			}
			g_obj.jump_last_left_click = [];
			$('#a_task_jumpterminal_one').html('');
			for (var i = 0; i < g_obj.jump_last_right_click.length; i ++)
			{
				$('#' + g_obj.jump_last_right_click[i].id).attr('src', 'images/circle_red.png');
			}
			g_obj.jump_last_right_click = [];
			$('#a_task_jumpterminal_another').html('');
		}
	}
	return false;
}


// 删除成端选择，严格或者批量，成端还是解除
// outer == 1 父窗口 style == 1表示删除严格、2表示删除成对
function relievecoretoterminal(id, style, outer, object)
{
	if (outer == 1)  // 删除父窗口
	{
		for (var i = 0; i < g_obj.a_task_jumpterminal.rows.length; i ++)
		{
			if (g_obj.a_task_jumpterminal.rows[i].id == id)
			{
				if (g_obj.a_task_jumpterminal.rows[i].isAdd == 0)
				{
					for (var j = 0; j < g_obj.a_task_jumpterminal.rows.length; j ++)
					{
						if (g_obj.a_task_jumpterminal.rows[j].isAdd == 1)
						{
							if (g_obj.a_task_jumpterminal.rows[j].style == 1) // 严格成对
							{
								if (g_obj.a_task_jumpterminal.rows[i].one.id == g_obj.a_task_jumpterminal.rows[j].one.id
										|| g_obj.a_task_jumpterminal.rows[i].another.id == g_obj.a_task_jumpterminal.rows[j].another.id)
								{
									alert('您有其他成端任务的端子或者纤芯绑定了这个解除成端任务的端子或者纤芯，请先删除成端任务！');
									return false;
								}
							}
							/*else // 批量成对
							{
								for (var k = 0; k < g_obj.a_task_jumpterminal.rows[j].one.length; k ++)
								{
									if (g_obj.a_task_jumpterminal.rows[i].one.id == g_obj.a_task_jumpterminal.rows[j].one[k].id 
											|| g_obj.a_task_jumpterminal.rows[i].another.id == g_obj.a_task_jumpterminal.rows[j].one[k].id)
									{
										alert('您有其他跳纤任务的端子绑定了这个解除跳纤任务的端子，请先删除跳纤任务！');
										return false;
									}
								}
								for (var k = 0; k < g_obj.a_task_jumpterminal.rows[j].another.length; k ++)
								{
									if (g_obj.a_task_jumpterminal.rows[i].one.id == g_obj.a_task_jumpterminal.rows[j].another[k].id 
											|| g_obj.a_task_jumpterminal.rows[i].another.id == g_obj.a_task_jumpterminal.rows[j].another[k].id)
									{
										alert('您有其他跳纤任务的端子绑定了这个解除跳纤任务的端子，请先删除跳纤任务！');
										return false;
									}
								}
							}*/
						}
					}
				}
				$('#' + id).remove();
				g_obj.a_task_jumpterminal.rows.splice(i, 1);
			}
		}
	}
	else // 删除子窗口
	{
		if (style == 1)
		{
			for (var i = 0; i < g_obj.a_task_coretoterminal_onetoone.rows.length; i ++)
			{
				if (g_obj.a_task_coretoterminal_onetoone.rows[i].id == id)
				{
					if (g_obj.a_task_coretoterminal_onetoone.rows[i].type == 2) // 成端
					{
						if (g_obj.a_task_coretoterminal_onetoone.rows[i].isAdd == 1)
						{
							if (confirm('确认要删除该成端任务吗？'))
							{
								var node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretoterminal_onetoone.rows[i].one.id}, true);
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, false);
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkNode(node, false);
								$('#core_to_terminal_' + g_obj.a_task_coretoterminal_onetoone.rows[i].another.id).attr('src', 'images/circle_red.png');
								g_obj.a_task_coretoterminal_onetoone.rows.splice(i, 1);
								$('#' + id).remove();
							}
						}
						else
						{
							var j = 0;
							for (j = 0; j < g_obj.a_task_coretoterminal_onetoone.rows.length; j ++)
							{
								if (g_obj.a_task_coretoterminal_onetoone.rows[j].isAdd == 1)
								{
									if (g_obj.a_task_coretoterminal_onetoone.rows[i].one.id == g_obj.a_task_coretoterminal_onetoone.rows[j].one.id
										|| g_obj.a_task_coretoterminal_onetoone.rows[i].another.id == g_obj.a_task_coretoterminal_onetoone.rows[j].another.id)
									{
										alert('请先删除其他已占用的成端任务！');
										return false;
									}
								}
							}
							var sels = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getCheckedNodes(true);
							for (var k = 0; k < sels.length; k ++)
							{
								if (sels[k].type == 2 && sels[k].id == g_obj.a_task_coretoterminal_onetoone.rows[i].one.id)
								{
									alert('请先删除其他已占用的成端任务！');
									return false;
								}
							}
							for (var k = 0; k < g_obj.core_to_terminal_clicks.length; k ++)
							{
								if (g_obj.core_to_terminal_clicks[k].id == g_obj.a_task_coretoterminal_onetoone.rows[i].another.id)
								{
									alert('请先删除其他已占用的成端任务！');
									return false;
								}
							}
							if (j == g_obj.a_task_coretoterminal_onetoone.rows.length)
							{
								if (confirm('确定要删除该解除成端任务吗？'))
								{
									var node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretoterminal_onetoone.rows[i].one.id}, true);
									$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, true);
									$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkNode(node, false);
									node.name = node.name + '（已占用）';
									$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(node);
									$('#core_to_terminal_' + g_obj.a_task_coretoterminal_onetoone.rows[i].another.id).attr('src', 'images/circle_green.png');
									g_obj.a_task_coretoterminal_onetoone.rows.splice(i, 1);
									$('#' + id).remove();
								}
							}
						}
					}
					else if (g_obj.a_task_coretoterminal_onetoone.rows[i].type == 3) // 直熔，只能是删除解除任务，也就是isAdd一定为0
					{
						var j = 0;
						for (j = 0; j < g_obj.a_task_coretoterminal_onetoone.rows.length; j ++)
						{
							if (g_obj.a_task_coretoterminal_onetoone.rows[j].isAdd == 1)
							{
								if (g_obj.a_task_coretoterminal_onetoone.rows[i].one.id == g_obj.a_task_coretoterminal_onetoone.rows[j].one.id
									|| g_obj.a_task_coretoterminal_onetoone.rows[i].another.id == g_obj.a_task_coretoterminal_onetoone.rows[j].one.id)
								{
									alert('请先删除其他已占用的成端任务！');
									return false;
								}
							}
						}
						var sels = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getCheckedNodes(true);
						for (var k = 0; k < sels.length; k ++)
						{
							if (sels[k].type == 2)
							{
								if (sels[k].id == g_obj.a_task_coretoterminal_onetoone.rows[i].one.id || sels[k].id == g_obj.a_task_coretoterminal_onetoone.rows[i].another.id)
								{
									alert('请先删除其他已占用的成端任务！');
									return false;
								}
							}
						}
						if (j == g_obj.a_task_coretoterminal_onetoone.rows.length)
						{
							if (confirm('确定要删除该解除直熔任务吗？'))
							{
								var node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretoterminal_onetoone.rows[i].one.id}, true);
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, true);
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkNode(node, false);
								node.name = node.name + '（已占用）';
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(node);
								node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretoterminal_onetoone.rows[i].another.id}, true);
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, true);
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkNode(node, false);
								node.name = node.name + '（已占用）';
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(node);
								g_obj.a_task_coretoterminal_onetoone.rows.splice(i, 1);
								$('#' + id).remove();
							}
						}
					}
					else if (g_obj.a_task_coretoterminal_onetoone.rows[i].type == 4) // 其他连接，只能是删除解除任务
					{
						var j = 0;
						for (j = 0; j < g_obj.a_task_coretoterminal_onetoone.rows.length; j ++)
						{
							if (g_obj.a_task_coretoterminal_onetoone.rows[j].isAdd == 1)
							{
								if (g_obj.a_task_coretoterminal_onetoone.rows[i].one.id == g_obj.a_task_coretoterminal_onetoone.rows[j].one.id)
								{
									alert('请先删除其他已占用的成端任务！');
									return false;
								}
							}
						}
						var sels = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getCheckedNodes(true);
						for (var k = 0; k < sels.length; k ++)
						{
							if (sels[k].type == 2)
							{
								if (sels[k].id == g_obj.a_task_coretoterminal_onetoone.rows[i].one.id)
								{
									alert('请先删除其他已占用的成端任务！');
									return false;
								}
							}
						}
						if (j == g_obj.a_task_coretoterminal_onetoone.rows.length)
						{
							if (confirm('确定要删除该解除任务吗？'))
							{
								var node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretoterminal_onetoone.rows[i].one.id}, true);
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, true);
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkNode(node, false);
								node.name = node.name + '（已占用）';
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(node);
								g_obj.a_task_coretoterminal_onetoone.rows.splice(i, 1);
								$('#' + id).remove();
							}
						}
					}
					break;
				}
			}
		}
		/*else if (style == 2) // 删除成对的，随便删~
		{
			for (var i = 0; i < g_obj.core_to_terminal_clicks.length; i ++)
			{
				$('#' + g_obj.core_to_terminal_clicks[i].id).attr('src', 'images/circle_red.png');
			}
			g_obj.core_to_terminal_clicks = [];
			$('#a_task_coretoterminal_core').html('');
			$('#a_task_coretoterminal_terminal').html('');
			$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkAllNodes(false);
		}*/
	}
	return false;
}


function showPics() {
	$('#rightclick_contextmenu').hide();
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=getOrderImages",
		data : "id=" + g_obj.rightClickRowData.id,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				var html = '';
				for (var i = 0; i < data.rows.length; i ++)
				{
					html += '<a href="/../gjx_uploadfile/' + data.rows[i].image_path + '" style="background-image:url(/../gjx_uploadfile/' + data.rows[i].image_path + ')" title="' + data.rows[i].remarks + '"></a>';
				}
				$('#thumbs').html(html);
				$('#thumbs a').touchTouch();
				if (data.rows.length > 0)
				{
					var dialog = $( "#dialog-pics" ).removeClass('hide').dialog({
						width: 1000,
						height: 800,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看工单图片</h4></div>",
						title_html: true,
						buttons: [
						          {
						        	  text: "确定",
						        	  "class" : "btn btn-primary btn-xs",
						        	  click: function() {
						        	  $( "#dialog-pics" ).dialog("close"); 
						          } 
						          }
						          ]
					});
				}
				else
				{
					alert('该工单暂无图片');
				}
			}
		}
	});
}

//查看详情

// 查看面板图
function showModules() {
	g_obj.showModules_front_terminals = [];
	$('#rightclick_contextmenu').hide();
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findBoxModulesAndTerminalsByAjax",
		data:"id=" + g_obj.rightClickNode,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null)
			{
				if (data.bms.length > 0)
				{
					var tablehtml = '';
					tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表任务中&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表选中</div>';
					for (var i = 0; i < data.bms.length; i ++)
					{
						if (i % 2 == 0)
						{
							tablehtml += '<div style="width:100%; height:auto; float:left; clear:both;">';
						}
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '</h1>';
						tablehtml += '<div class="tabbable" id="box_tabs_' + i + '"><ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="myTab4" style="height:50px !important;"><li class="active"><a data-toggle="tab" href="#map_' + i + '">正面</a></li><li><a data-toggle="tab" href="#th_' + i + '">反面</a></li></ul>';
						tablehtml += '<div class="tab-content" id="box_tabs_content_' + i + '">';
						tablehtml += '<div id="map_' + i + '" class="tab-pane in active" style="width:100%; height:100%;"><table width="100%" id="tables_front_' + i + '"><tr>';
						tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="tables_front_mark_div_' + i + '" class="alert alert-info" style="margin-top:12px;"><label id="tables_front_mark_label_' + i + '">查询跳纤：</label></div></div>';

						tablehtml += '<div id="th_' + i + '" class="tab-pane" style="width:100%; height:100%;"><table width="100%" id="tables_back_' + i + '"><tr>';
						tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="tables_back_mark_div_' + i + '" class="alert alert-info" style="margin-top:12px;"><label id="tables_back_mark_label_' + i + '">查询成端：</label></div></div>';
						tablehtml += '</div>';
						tablehtml += '</div>';
						tablehtml += '</div>';
						if (i % 2 == 1)
						{
							tablehtml += '</div>';
						}
					}
					$('#dialog-modules-tables').html(tablehtml);
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=40 style='border-top:8px solid white; text-align:center;'>" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].frontFreezed != 0)
								{
									str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_yellow.png' width='12px'/></td>";
								}
								else
								{
									if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].frontUsed != 0)
									{
										str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img id='box_terminal_showModules_front_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' onclick=\"findJumpTerminal('box_terminal_showModules_front_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "', 'tables_front_mark_div_" + i + "', 'tables_front_mark_label_" + i + "', 1)\" title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_green.png' width='12px'/></td>";
									}
									else
									{
										str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_grey.png' width='12px'/></td>";
									}
								}
							}
					        str +="</tr>";
					        $("#tables_front_" + i).append(str);
						}
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str +="<tr style='' align='center'>";
							str += "<td width=40 style='border-top:8px solid white; text-align:center;'>" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].backFreezed != 0)
								{
									str+="<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img title='" + data.bms[i].sideName + "-反面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_yellow.png' width='12px'/></td>";
								}
								else
								{
									if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].backUsed != 0)
									{
										str+="<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img id='box_terminal_showModules_back_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' onclick=\"findCoreToTerminal('box_terminal_showModules_back_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "', 'tables_back_mark_div_" + i + "', 'tables_back_mark_label_" + i + "', 1)\" title='" + data.bms[i].sideName + "-反面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_green.png' width='12px'/></td>";
									}
									else
									{
										str+="<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img title='" + data.bms[i].sideName + "-反面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_grey.png' width='12px'/></td>";
									}
								}
							}
					        str +="</tr>";
					        $("#tables_back_" + i).append(str);
						}
					}
					var dialog = $( "#dialog-modules" ).removeClass('hide').dialog({
						width: 1000,
						height: document.body.clientHeight,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>光交箱面板图</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "确定",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( "#dialog-modules" ).dialog("close"); 
								} 
							}
						]
					});
				}
			}
		},
		error : function() {
		}
	});
}

// 选择光缆事件
function change_opticalcable() {
	var val = $('#choose_opticalcable').val();
	if (val > 0)
	{
		$.ajax( {
			type : "post",
			url : "opticalcable.do?method=findAllCoreByBoxId",
			data : "boxid=" + g_obj.rightClickNode + "&optiid=" + val,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null && data.resultMark == 1)
				{
					document.getElementById('choose_core').options.length = 0;
					$("<option value='0'></option>").appendTo($("#choose_core"));
					for (var i = 0; i < data.rows.length; i ++)
					{
						$("<option value='" + data.rows[i].core.id + "'>" + data.rows[i].core.name + "</option>").appendTo($("#choose_core"));
					}
					g_obj.cores = data.rows;
				}
			},
			error: function() {
			}
		});
	}
}

// 选择纤芯事件
function change_core() {
	var val = $('#choose_core').val();
	if (val > 0)
	{
		document.getElementById('choose_side').options.length = 0;
		for (var i = 0; i < g_obj.cores.length; i ++)
		{
			if (g_obj.cores[i].id == val)
			{
				if (g_obj.cores[i].a_type == 0)
				{
					$("<option value='0'>A端</option>").appendTo($("#choose_side"));
				}
				if (g_obj.cores[i].z_type == 0)
				{
					$("<option value='1'>Z端</option>").appendTo($("#choose_side"));
				}
				break;
			}
		}
	}
}

// 选择光缆事件
function change_opticalcable1(id1, id2, side) {
	var val = $('#' + id1).val();
	if (val > 0)
	{
		$.ajax( {
			type : "post",
			url : "opticalcable.do?method=findAllCoreByBoxId",
			data : "boxid=" + g_obj.rightClickNode + "&optiid=" + val,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null && data.resultMark == 1)
				{
					document.getElementById(id2).options.length = 0;
					$("<option value='0'></option>").appendTo($("#" + id2));
					for (var i = 0; i < data.rows.length; i ++)
					{
						$("<option value='" + data.rows[i].core.id + "'>" + data.rows[i].core.name + "</option>").appendTo($("#" + id2));
					}
					if (side == 1) 
					{
						g_obj.oneside = data.rows;
					}
					else
					{
						g_obj.anotherside = data.rows;
					}
				}
			},
			error: function() {
			}
		});
	}
}

// 选择纤芯事件
function change_core1(id1, id2, side) {
	var val = $('#' + id1).val();
	if (val > 0)
	{
		document.getElementById(id2).options.length = 0;
		if (side == 1)
		{
			for (var i = 0; i < g_obj.oneside.length; i ++)
			{
				if (g_obj.oneside[i].id == val)
				{
					if (g_obj.oneside[i].a_type == 0)
					{
						$("<option value='0'>A端</option>").appendTo($("#" + id2));
					}
					if (g_obj.oneside[i].z_type == 0)
					{
						$("<option value='1'>Z端</option>").appendTo($("#" + id2));
					}
					break;
				}
			}
		}
		else
		{
			for (var i = 0; i < g_obj.anotherside.length; i ++)
			{
				if (g_obj.anotherside[i].id == val)
				{
					if (g_obj.anotherside[i].a_type == 0)
					{
						$("<option value='0'>A端</option>").appendTo($("#" + id2));
					}
					if (g_obj.anotherside[i].z_type == 0)
					{
						$("<option value='1'>Z端</option>").appendTo($("#" + id2));
					}
					break;
				}
			}
		}
	}
}



// 纤芯成端
function coreToTerminal() {

	g_obj.a_task_coretoterminal_onetoone = {};
	g_obj.a_task_coretoterminal_onetoone.rows = [];
	g_obj.a_task_coretoterminal_onetoone.count = 0;
	g_obj.core_to_terminal_click = null;
	g_obj.core_to_terminal_clicks = [];
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findBoxModulesAndTerminalsByAjax",
		data:"id=" + $('#a_box_id').val(),
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null)
			{
				if (data.bms.length > 0)
				{
					g_obj.core_to_terminal_click = null;
					var tablehtml = '';
					/*tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表任务中&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询成端&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子&nbsp;&nbsp;&nbsp;<br/><br/></div>';
					tablehtml += '<div style="margin-top:20px;" id="a_task_coretoterminal_table1"><table class="mytable" width="100%"><tr align="center"><td>类型</td><td>纤芯</td><td>端子/纤芯/其他</td><td>&nbsp;</td></tr><tbody id="a_task_coretoterminal_onetoone"></tbody></table></div>';
					tablehtml += '<div style="margin-top:20px; display:none;" id="a_task_coretoterminal_table2"><table class="mytable" width="100%"><tr align="center"><td>纤芯</td><td>端子</td><td>&nbsp;</td></tr><tbody><tr><td id="a_task_coretoterminal_core" align="center"></td><td id="a_task_coretoterminal_terminal" align="center"></td><td align="center"><button onclick="return relievecoretoterminal(0, 2, 0)" class="btn btn-xs btn-success">删除<i class="icon-remove icon-on-right"></i></button></td></tr></tbody></table></div>';
					tablehtml += '<div style="width:850px; height:400px; margin-top:12px; overflow:auto; border:1px solid black; text-align: center; padding-top:7px;  margin-left:30px;">选择纤芯<font style="color:red;">*</font><div id="a_tree_coretoterminal" class="widget-main padding-8"><div id="a_tree_coretoterminal_1" class="ztree"></div></div></div>';
					for (var i = 0; i < data.bms.length; i ++)
					{
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '</h1>';
						tablehtml += '<div style="width:100%; height:100%;"><table width="100%" id="tables_core_to_terminal_' + i + '"><tr>';
						tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="core_to_terminal_mark_div_' + i + '" class="alert alert-info" style="margin-top:12px;"><label id="core_to_terminal_mark_label_' + i + '">查询成端：</label></div></div>';
						tablehtml += '</div>';
					}
					$('#dialog-core-to-terminal-tables').html(tablehtml);
					if ($('#a_style').val() == 2)
					{
						$('#a_task_coretoterminal_table2').show();
					}*/
					tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表损坏&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表预占&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_blue.png" width="12px">&nbsp;代表当前选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询成端&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子/解除成端&nbsp;&nbsp;&nbsp;</div>';
					tablehtml += '<div style="margin-top:20px;" id="a_task_coretoterminal_table1"><table class="mytable" width="100%"><tr align="center"><td>类型</td><td>纤芯</td><td>端子/纤芯/其他</td><td>&nbsp;</td></tr><tbody id="a_task_coretoterminal_onetoone"></tbody></table></div>';
					tablehtml += '<div style="margin-top:20px; display:none;" id="a_task_coretoterminal_table2"><table class="mytable" width="100%"><tr align="center"><td>纤芯</td><td>端子</td><td>&nbsp;</td></tr><tbody><tr><td id="a_task_coretoterminal_core" align="center"></td><td id="a_task_coretoterminal_terminal" align="center"></td><td align="center"><button onclick="return relievecoretoterminal(0, 2, 0)" class="btn btn-xs btn-success">删除<i class="icon-remove icon-on-right"></i></button></td></tr></tbody></table></div>';
					tablehtml += '<div style="width:850px; height:400px; margin-top:12px; overflow:auto; border:1px solid black; text-align: center; padding-top:7px;  margin-left:30px;">选择纤芯<font style="color:red;">*</font><div id="a_tree_coretoterminal" class="widget-main padding-8"><div id="a_tree_coretoterminal_1" class="ztree"></div></div></div>';
					
					//挖大坑
				    for (var i = 0; i < data.bms.length; i ++)
					{
						if (i % 2 == 0)
						{
							tablehtml += '<div style="width:100%; height:auto; float:left; clear:both;">';
						}
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '面</h1>';
						tablehtml += '<div class="tabbable" id="box_tabs_' + i + '"><ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="myTab4" style="height:50px !important;"><li class="active"><a data-toggle="tab" href="#map_' + i + '">反面</a></li></ul>';
						tablehtml += '<div class="tab-content" id="box_tabs_content_' + i + '">';
						tablehtml += '<div id="map_' + i + '" class="tab-pane in active" style="width:100%; height:100%;"><table width="100%" id="tables_front_' + i + '"><tr>';
						tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						//表头
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="tables_back_mark_div_' + data.bms[i].id + '" class="alert alert-info" style="margin-top:12px;"><label id="tables_back_mark_label_' + data.bms[i].id + '">查询跳纤：</label></div></div>';

						tablehtml += '</div>';
						tablehtml += '</div>';
						tablehtml += '</div>';
						if (i % 2 == 1)
						{
							tablehtml += '</div>';
						}
					}
					$('#dialog-core-to-terminal-tables').html(tablehtml);
					//挖小坑
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=60 style='border-top:8px solid white; text-align:left;'>&nbsp;" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								str += "<td width=60 id='showModule_back_terminal_" + data.bms[i].id + "_" + (j + 1) + "_" + (k + 1) + "_outer' style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'></td>";
							}
					        str +="</tr>";
					        $("#tables_front_" + i).append(str);
						}
					}
					for (var i = 0; i < data.bts.length; i ++)
					{
						if (data.bts[i].backFreezed != 0)
						{
							$('#showModule_back_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-反面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_yellow.png' width='12px'/>");
						}
						else
						{
							if (data.bts[i].backUsed != 0)
							{
								$('#showModule_back_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img ondblclick='coretoterminalclick(\"core_to_terminal_" + data.bts[i].boxTerminal.id + "\")' onclick='findCoreToTerminal(\"core_to_terminal_" + data.bts[i].boxTerminal.id + "\", \"tables_back_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "\", \"tables_back_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "\", 0)' id='core_to_terminal_" + data.bts[i].boxTerminal.id + "' title='" + data.bts[i].boxTerminal.sideName + "-反面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_green.png' width='12px'/>");
							}
							else
							{
								$('#showModule_back_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='core_to_terminal_" + data.bts[i].boxTerminal.id + "' ondblclick='coretoterminalclick(\"core_to_terminal_" + data.bts[i].boxTerminal.id + "\")' title='" + data.bts[i].boxTerminal.sideName + "-反面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_red.png' width='12px'/>");
							}
						}
					}
					$.ajax( {
						type : "post",
						url : "opticalcable.do?method=findAllTreeByBoxId",
						data:"id=" + $('#a_box_id').val(),
						success : function(data) {
							isOvertime(data.resultMark);
							if (data != null && data.resultMark == 1)
							{
								g_obj.opticoretree = data.rows;
								var treedata = [];
								for (var i = 0; i < data.rows.length; i ++)
								{
									var temp = {
										id : 'a_opti_' + data.rows[i].id,
										pId : 0,
										type : 1,
										name : data.rows[i].name,
										used : 0,
										open : true
									};
									treedata.push(temp);
									for (var j = 0; j < data.rows[i].cores.length; j ++)
									{
										var name = data.rows[i].cores[j].core.name;
										var used = 0, freezed = 0, disable = false;
										if (data.rows[i].start_box != null && data.rows[i].start_box.id == $('#a_box_id').val())
										{
											if (data.rows[i].cores[j].a_freezed == 1)
											{
												name += '（任务中）';
												freezed = 1;
												disable = true;
											}
											else
											{
												if (data.rows[i].cores[j].a_type != 0)
												{
													name += '（已占用）';
													used = data.rows[i].cores[j].a_type;
													disable = true;
												}
											}
										}
										else if (data.rows[i].end_box != null && data.rows[i].end_box.id == $('#a_box_id').val())
										{
											if (data.rows[i].cores[j].z_freezed == 1)
											{
												name += '（任务中）';
												freezed = 1;
												disable = true;
											}
											else
											{
												if (data.rows[i].cores[j].z_type != 0)
												{
													name += '（已占用）';
													used = data.rows[i].cores[j].z_type;
													disable = true;
												}
											}
										}
										var tempin = {
											id : data.rows[i].cores[j].core.id,
											pId : 'a_opti_' + data.rows[i].id,
											type : 2,
											chkDisabled : disable,
											name : name,
											used : used,
											freezed : freezed
										};
										treedata.push(tempin);
									}
								}
								$('#a_tree_coretoterminal').html('<div id="a_tree_coretoterminal_1" class="ztree"></div>');
								var setting = {
									view: {
										selectedMulti: $('#a_style').val() == 1 ? false : true
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
											var zTree = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1");
											g_obj.opticoretree_sels = zTree.getCheckedNodes(true);
											console.log(g_obj.opticoretree_sels);
											if ($('#a_style').val() == 1) // 严格成对
											{
												if (treeNode.type == 1)
												{
													return false;
												}
												else
												{
													if (g_obj.opticoretree_sels.length > 0)
													{
														if (g_obj.opticoretree_sels[1].id != treeNode.id)
														{
															zTree.checkAllNodes(false);
														}
													}
												}
											}
											return true;
										},
										onCheck: function (e, treeId, treeNode) {
											var zTree = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1");
											g_obj.opticoretree_sels = zTree.getCheckedNodes(true);
											if ($('#a_style').val() == 1) // 严格成对
											{
												if (g_obj.core_to_terminal_click != null)
												{
													one = {
														id : treeNode.id,
														name : treeNode.name
													};
													var tempid = g_obj.core_to_terminal_click.id.substring(g_obj.core_to_terminal_click.id.lastIndexOf('_') + 1, g_obj.core_to_terminal_click.id.length);
													another = {
														id : tempid,
														name : $('#' + g_obj.core_to_terminal_click.id).attr('title'),
														src : $('#' + g_obj.core_to_terminal_click.id).attr('src')
													};
													type = 2;
													$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(treeNode, true, false, false);
													$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkAllNodes(false);
													$('#' + g_obj.core_to_terminal_click.id).attr('src', 'images/circle_blue.png');
													var str='';
													g_obj.a_task_coretoterminal_onetoone.count ++;
													str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
												    str+="<td align='center'>成端</td>";
												    str+="<td align='center'>" + one.name + "</td>";
												    str+="<td align='center'>" + another.name + "</td>";
												    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
												    str+="</tr>";
												    $("#a_task_coretoterminal_onetoone").append(str);
												    var temp = {
												    	id : 'a_task_coretoterminal_onetoone_row_' + g_obj.a_task_coretoterminal_onetoone.count,
												    	type : 2,
												    	style : 1,
												    	isAdd : 1,
												    	one : one,
												    	another : another
												    };
												    g_obj.a_task_coretoterminal_onetoone.rows.push(temp);
												    g_obj.core_to_terminal_click = null;
												}
											}
											/*else if ($('#a_style').val() == 2) // 批量成对
											{
												var string = '';
												for (var i = 0; i < g_obj.opticoretree_sels.length; i ++)
												{
													if (g_obj.opticoretree_sels[i].type == 2)
													{
														string += g_obj.opticoretree_sels[i].name + '<br/>';
													}
												}
												$('#a_task_coretoterminal_core').html(string);
											}*/
										},
										onClick: function (event, treeId, treeNode, clickFlag) {
											if (treeNode.freezed == 0) // 在任务中的不能使用
											{
												if (treeNode.chkDisabled == true)  // 如果被禁用，说明非空闲
												{
													if (treeNode.checked == true) // 说明本来是非空闲，后来添加了解除成端任务，又被添加成端任务中
													{
														for (var i = 0; i < g_obj.a_task_coretoterminal_onetoone.rows.length; i ++)
														{
															if (g_obj.a_task_coretoterminal_onetoone.rows[i].type == 2 && g_obj.a_task_coretoterminal_onetoone.rows[i].isAdd == 1 && g_obj.a_task_coretoterminal_onetoone.rows[i].one.id == treeNode.id)
															{
																if (confirm('确定要删除该成端任务吗？'))
																{
																	var node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretoterminal_onetoone.rows[i].one.id}, true);
																	$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, false);
																	$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkNode(node, false);
																	$('#core_to_terminal_' + g_obj.a_task_coretoterminal_onetoone.rows[i].another.id).attr('src', 'images/circle_red.png');
																	$('#' + g_obj.a_task_coretoterminal_onetoone.rows[i].id).remove();
																	g_obj.a_task_coretoterminal_onetoone.rows.splice(i, 1);
																}
																break;
															}
														}
													}
													else // 说明本来就是非空闲，现在仍然是非空闲
													{
														if (confirm("确认要添加到解除成端任务中吗？"))
														{
															var type = 0, one , another;
															g_obj.a_task_coretoterminal_onetoone.count ++;
															for (var i = 0; i < g_obj.opticoretree.length; i ++)
															{
																for (var j = 0; j < g_obj.opticoretree[i].cores.length; j ++)
																{
																	if (treeNode.id == g_obj.opticoretree[i].cores[j].id)
																	{
																		 if (g_obj.opticoretree[i].start_box != null && g_obj.opticoretree[i].start_box.id == $('#a_box_id').val())
																		 {
																				if (treeNode.used == 1)   // 与其他相连
																				{
																					one = {
																						id : treeNode.id,
																						name : g_obj.opticoretree[i].cores[j].core.name
																					};
																					another = g_obj.opticoretree[i].cores[j].a_string;
																					type = 4;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(treeNode, false, false, false);
																					treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(treeNode, false);
																					var str='';
																					str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
																				    str+="<td align='center'>解除其他绑定</td>";
																				    str+="<td align='center'>" + one.name + "</td>";
																				    str+="<td align='center'>" + another + "</td>";
																				    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
																				    str+="</tr>";
																				    $("#a_task_coretoterminal_onetoone").append(str);
																				}
																				else if (treeNode.used == 2) // 与端子相连core_to_terminal_
																				{
																					one = {
																						id : treeNode.id,
																						name : g_obj.opticoretree[i].cores[j].core.name
																					};
																					another = {
																						id : g_obj.opticoretree[i].cores[j].a_terminal.id,
																						name : g_obj.opticoretree[i].cores[j].a_terminal.name,
																						src : $('#core_to_terminal_' + g_obj.opticoretree[i].cores[j].a_terminal.id).attr('src')
																					};
																					type = 2;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(treeNode, false, false, false);
																					treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(treeNode, false);
																					$('#core_to_terminal_' + g_obj.opticoretree[i].cores[j].a_terminal.id).attr('src', 'images/circle_red.png');
																					var str='';
																					str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
																				    str+="<td align='center'>解除成端</td>";
																				    str+="<td align='center'>" + one.name + "</td>";
																				    str+="<td align='center'>" + another.name + "</td>";
																				    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
																				    str+="</tr>";
																				    $("#a_task_coretoterminal_onetoone").append(str);
																				}
																				else if (treeNode.used == 3) // 与纤芯相连
																				{
																					one = {
																						id : treeNode.id,
																						name : g_obj.opticoretree[i].cores[j].core.name
																					};
																					for (var k = 0; k < g_obj.opticoretree.length; k ++)
																					{
																						for (var h = 0; h < g_obj.opticoretree[k].cores.length; h ++)
																						{
																							if (g_obj.opticoretree[i].cores[j].a_core.id == g_obj.opticoretree[k].cores[h].core.id)
																							{
																								another = {
																									id : g_obj.opticoretree[k].cores[h].id,
																									name : g_obj.opticoretree[k].cores[h].core.name
																								};
																								k = g_obj.opticoretree.lenth;
																								break;
																							}
																						}
																					}
																					type = 3;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(treeNode, false, false, false);
																					treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(treeNode, false);
																					var node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node){return node.id == another.id}, true);
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, false, false, false);
																					node.name = another.name;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(node, false);
																					var str='';
																					str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
																				    str+="<td align='center'>解除直熔</td>";
																				    str+="<td align='center'>" + one.name + "</td>";
																				    str+="<td align='center'>" + another.name + "</td>";
																				    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
																				    str+="</tr>";
																				    $("#a_task_coretoterminal_onetoone").append(str);
																				}
																		 }
																		 else if (g_obj.opticoretree[i].end_box != null && g_obj.opticoretree[i].end_box.id == $('#a_box_id').val())
																		 {
																			 if (treeNode.used == 1)   // 与其他相连
																				{
																					one = {
																						id : treeNode.id,
																						name : g_obj.opticoretree[i].cores[j].core.name
																					};
																					another = g_obj.opticoretree[i].cores[j].z_string;
																					type = 4;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(treeNode, false, false, false);
																					treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(treeNode, false);
																					var str='';
																					str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
																				    str+="<td align='center'>解除其他绑定</td>";
																				    str+="<td align='center'>" + one.name + "</td>";
																				    str+="<td align='center'>" + another + "</td>";
																				    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
																				    str+="</tr>";
																				    $("#a_task_coretoterminal_onetoone").append(str);
																				}
																				else if (treeNode.used == 2) // 与端子相连core_to_terminal_
																				{
																					one = {
																						id : treeNode.id,
																						name : g_obj.opticoretree[i].cores[j].core.name
																					};
																					another = {
																						id : g_obj.opticoretree[i].cores[j].z_terminal.id,
																						name : g_obj.opticoretree[i].cores[j].z_terminal.name,
																						src : $('#core_to_terminal_' + g_obj.opticoretree[i].cores[j].z_terminal.id).attr('src')
																					};
																					type = 2;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(treeNode, false, false, false);
																					treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(treeNode, false);
																					$('#core_to_terminal_' + g_obj.opticoretree[i].cores[j].z_terminal.id).attr('src', 'images/circle_red.png');
																					var str='';
																					str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
																				    str+="<td align='center'>解除成端</td>";
																				    str+="<td align='center'>" + one.name + "</td>";
																				    str+="<td align='center'>" + another.name + "</td>";
																				    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
																				    str+="</tr>";
																				    $("#a_task_coretoterminal_onetoone").append(str);
																				}
																				else if (treeNode.used == 3) // 与纤芯相连
																				{
																					one = {
																						id : treeNode.id,
																						name : g_obj.opticoretree[i].cores[j].core.name
																					};
																					for (var k = 0; k < g_obj.opticoretree.length; k ++)
																					{
																						for (var h = 0; h < g_obj.opticoretree[k].cores.length; h ++)
																						{
																							if (g_obj.opticoretree[i].cores[j].z_core.id == g_obj.opticoretree[k].cores[h].core.id)
																							{
																								another = {
																									id : g_obj.opticoretree[k].cores[h].id,
																									name : g_obj.opticoretree[k].cores[h].core.name
																								};
																								k = g_obj.opticoretree.lenth;
																								break;
																							}
																						}
																					}
																					type = 3;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(treeNode, false, false, false);
																					treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(treeNode, false);
																					var node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node){return node.id == another.id}, true);
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, false, false, false);
																					node.name = another.name;
																					$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(node, false);
																					var str='';
																					str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
																				    str+="<td align='center'>解除直熔</td>";
																				    str+="<td align='center'>" + one.name + "</td>";
																				    str+="<td align='center'>" + another.name + "</td>";
																				    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
																				    str+="</tr>";
																				    $("#a_task_coretoterminal_onetoone").append(str);
																				}
																		 }
																		 i = g_obj.opticoretree.length;
																		 break;
																	}
																}
															}
															var temp = {
																id : 'a_task_coretoterminal_onetoone_row_' + g_obj.a_task_coretoterminal_onetoone.count,
																type : type,
																style : 1,
																isAdd : 0,
																one : one,
																another : another
															};
															g_obj.a_task_coretoterminal_onetoone.rows.push(temp);
														}
													}
												}
											}
										}
									}
								};
								g_obj.a_tree_coretoterminal_1 = $.fn.zTree.init($("#a_tree_coretoterminal_1"), setting, treedata);
							}
						},
						error: function() {
						}
					});
					/*for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=40 style='border-top:8px solid white; text-align:center;'>" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].backFreezed != 0)
								{
									str+="<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img id='core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-反面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_yellow.png' width='12px'/></td>";
								}
								else
								{
									if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].backUsed != 0)
									{
										str+="<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='coretoterminalclick(\"core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' onclick='findCoreToTerminal(\"core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\", \"core_to_terminal_mark_div_" + i + "\", \"core_to_terminal_mark_label_" + i + "\", 0)' id='core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-反面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_green.png' width='12px'/></td>";
									}
									else
									{
										str+="<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='coretoterminalclick(\"core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' id='core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-反面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_grey.png' width='12px'/></td>";
									}
								}
							}
					        str +="</tr>";
					        $("#tables_core_to_terminal_" + i).append(str);
						}
					}*/
					var dialog = $( "#dialog-core-to-terminal" ).removeClass('hide').dialog({
						width: 1000,
						height: document.body.clientHeight,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>纤芯成端</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "确定",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									var type = $('#a_type').val();
									var style = $('#a_style').val();
									var sels = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getCheckedNodes(true);
									var count = 0, one = [], left = '';
									for (var i = 0; i < sels.length; i ++)
									{
										if (sels[i].type == 2)
										{
											count ++;
											one.push({
												id : sels[i].id,
												name : sels[i].name
											});
											left += sels[i].name + '<br/>';
										}
									}
									if (type == 2)
									{
										/*if (style == 2)
										{
											if (! (count == 0 || g_obj.core_to_terminal_clicks.length == 0 || count == g_obj.core_to_terminal_clicks.length))
											{
												alert('两端的数量应该一致！');
												return false;
											}
										}*/
										for (var i = 0; i < g_obj.a_task_coretoterminal_onetoone.rows.length; i ++)
										{
											if (g_obj.a_task_coretoterminal_onetoone.rows[i].type == 2)
											{
												var temp = {
													id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
													type : 2,
													style : 1,
													boxid : $('#a_box_id').val(),
													isAdd : g_obj.a_task_coretoterminal_onetoone.rows[i].isAdd,
													one : g_obj.a_task_coretoterminal_onetoone.rows[i].one,
													another : g_obj.a_task_coretoterminal_onetoone.rows[i].another
												};
												g_obj.a_task_jumpterminal.rows.push(temp);
												g_obj.a_task_jumpterminal.count ++;
												var str='';
												str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
											    str+="<td align='center'>" + (g_obj.a_task_coretoterminal_onetoone.rows[i].isAdd == 1 ? "成端" : "解除成端") + "</td>";
											    str+="<td align='center'>" + $('#a_box').val() + "</td>";
											    str+="<td align='center'>" + g_obj.a_task_coretoterminal_onetoone.rows[i].one.name + "</td>";
											    str+="<td align='center'>" + g_obj.a_task_coretoterminal_onetoone.rows[i].another.name + "</td>";
											    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
											    str+="</tr>";
											    $("#a_info").append(str);
											}
											else if (g_obj.a_task_coretoterminal_onetoone.rows[i].type == 3)
											{
												var temp = {
													id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
													type : 3,
													style : 1,
													boxid : $('#a_box_id').val(),
													isAdd : g_obj.a_task_coretoterminal_onetoone.rows[i].isAdd,
													one : g_obj.a_task_coretoterminal_onetoone.rows[i].one,
													another : g_obj.a_task_coretoterminal_onetoone.rows[i].another
												};
												g_obj.a_task_jumpterminal.rows.push(temp);
												g_obj.a_task_jumpterminal.count ++;
												var str='';
												str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
											    str+="<td align='center'>" + (g_obj.a_task_coretoterminal_onetoone.rows[i].isAdd == 1 ? "直熔" : "解除直熔") + "</td>";
											    str+="<td align='center'>" + $('#a_box').val() + "</td>";
											    str+="<td align='center'>" + g_obj.a_task_coretoterminal_onetoone.rows[i].one.name + "</td>";
											    str+="<td align='center'>" + g_obj.a_task_coretoterminal_onetoone.rows[i].another.name + "</td>";
											    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
											    str+="</tr>";
											    $("#a_info").append(str);
											}
											else if (g_obj.a_task_coretoterminal_onetoone.rows[i].type == 4)
											{
												var temp = {
													id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
													type : 4,
													style : 1,
													boxid : $('#a_box_id').val(),
													isAdd : g_obj.a_task_coretoterminal_onetoone.rows[i].isAdd,
													one : g_obj.a_task_coretoterminal_onetoone.rows[i].one,
													another : g_obj.a_task_coretoterminal_onetoone.rows[i].another
												};
												g_obj.a_task_jumpterminal.rows.push(temp);
												g_obj.a_task_jumpterminal.count ++;
												var str='';
												str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
											    str+="<td align='center'>" + (g_obj.a_task_coretoterminal_onetoone.rows[i].isAdd == 1 ? "其他" : "解除其他") + "</td>";
											    str+="<td align='center'>" + $('#a_box').val() + "</td>";
											    str+="<td align='center'>" + g_obj.a_task_coretoterminal_onetoone.rows[i].one.name + "</td>";
											    str+="<td align='center'>" + g_obj.a_task_coretoterminal_onetoone.rows[i].another + "</td>";
											    str+="<td align='center'><button onclick='return relieveother(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
											    str+="</tr>";
											    $("#a_info").append(str);
											}
										}
										/*if (style == 2)
										{
											var temp = {
												id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
												type : 2,
												style : 2,
												boxid : $('#a_box_id').val(),
												isAdd : 1,
												one : one,
												another : g_obj.core_to_terminal_clicks
											};
											g_obj.a_task_jumpterminal.rows.push(temp);
											g_obj.a_task_jumpterminal.count ++;
											var str='';
											str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
										    str+="<td align='center'>成端组</td>";
										    str+="<td align='center'>" + $('#a_box').val() + "</td>";
										    var tempright = '';
										    for (var i = 0; i < g_obj.core_to_terminal_clicks.length; i ++)
										    {
										    	tempright += g_obj.core_to_terminal_clicks[i].name + '<br/>';
										    }
										    str+="<td align='center'>" + left + "</td>";
										    str+="<td align='center'>" + tempright + "</td>";
										    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 2, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
										    str+="</tr>";
										    $("#a_info").append(str);
										}*/
									}
									$( "#dialog-core-to-terminal" ).dialog("close"); 
								}
							},
							{
								text: "取消",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( "#dialog-core-to-terminal" ).dialog("close"); 
								} 
							}
						]
					});
				}
			}
		},
		error : function() {
		}
	});
}

function startchoosecore(dir)
{
	if (dir == 1)
	{
		$('#startchoosecoreleft').addClass('btn-warning');
		$('#startchoosecoreleft').removeClass('btn-success');
		$('#startchoosecoreright').addClass('btn-success');
		$('#startchoosecoreright').removeClass('btn-warning');
		g_obj.startchoosecore = 1;
	}
	else if (dir == 2)
	{
		$('#startchoosecoreright').addClass('btn-warning');
		$('#startchoosecoreright').removeClass('btn-success');
		$('#startchoosecoreleft').addClass('btn-success');
		$('#startchoosecoreleft').removeClass('btn-warning');
		g_obj.startchoosecore = 2;
	}
	return false;
}




// 端子直熔
function coreToCore() {

	g_obj.a_task_coretocore_onetoone = {};
	g_obj.a_task_coretocore_onetoone.rows = [];
	g_obj.a_task_coretocore_onetoone.count = 0;
	g_obj.core_to_core_left_clicks = [];
	g_obj.core_to_core_right_clicks = [];
	g_obj.startchoosecore = 0;
	var tablehtml = '';
	tablehtml += '<div style="margin-top:20px;" id="a_task_coretocore_table1"><table class="mytable" width="100%"><tr align="center"><td>类型</td><td>纤芯</td><td>端子/纤芯/其他</td><td>&nbsp;</td></tr><tbody id="a_task_coretocore_onetoone"></tbody></table></div>';
	tablehtml += '<div style="margin-top:20px; display:none;" id="a_task_coretocore_table2"><table class="mytable" width="100%"><tr align="center"><td>纤芯</td><td>纤芯</td><td>&nbsp;</td></tr><tbody><tr><td id="a_task_coretocore_one" align="center"></td><td id="a_task_coretocore_another" align="center"></td><td align="center"><button onclick="return relievecoretocore(0, 2, 0)" class="btn btn-xs btn-success">删除<i class="icon-remove icon-on-right"></i></button></td></tr></tbody></table></div>';
	tablehtml += '<div style="width:400px; height:700px; margin-top:12px; overflow:auto; border:1px solid black; text-align: center; padding-top:7px;  margin-left:30px; float:left;">选择一端纤芯<font style="color:red;">*</font><div id="a_tree_coretocore_left" class="widget-main padding-8"><div id="a_tree_coretocore_left_1" class="ztree"></div></div></div>';
	tablehtml += '<div style="width:400px; height:700px; margin-top:12px; overflow:auto; border:1px solid black; text-align: center; padding-top:7px;  margin-left:30px; float:left;">选择另一端纤芯<font style="color:red;">*</font><div id="a_tree_coretocore_right" class="widget-main padding-8"><div id="a_tree_coretocore_right_1" class="ztree"></div></div></div>';
	
	$('#dialog-core-to-core-tables').html(tablehtml);
	if ($('#a_style').val() == 2)
	{
		$('#a_task_coretocore_table2').show();
	}
	$.ajax( {
		type : "post",
		url : "opticalcable.do?method=findAllTreeByBoxId",
		data:"id=" + $('#a_box_id').val(),
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null && data.resultMark == 1)
			{
				g_obj.opticoretree = data.rows;
				var treedata = [];
				for (var i = 0; i < data.rows.length; i ++)
				{
					var temp = {
						id : 'a_opti_' + data.rows[i].id,
						pId : 0,
						type : 1,
						name : data.rows[i].name,
						used : 0,
						open : true
					};
					treedata.push(temp);
					for (var j = 0; j < data.rows[i].cores.length; j ++)
					{
						var name = data.rows[i].cores[j].core.name;
						var used = 0, freezed = 0, disable = false;
						if (data.rows[i].start_box != null && data.rows[i].start_box.id == $('#a_box_id').val())
						{
							if (data.rows[i].cores[j].a_freezed == 1)
							{
								name += '（任务中）';
								freezed = 1;
								disable = true;
							}
							else
							{
								if (data.rows[i].cores[j].a_type != 0)
								{
									name += '（已占用）';
									used = data.rows[i].cores[j].a_type;
									disable = true;
								}
							}
						}
						else if (data.rows[i].end_box != null && data.rows[i].end_box.id == $('#a_box_id').val())
						{
							if (data.rows[i].cores[j].z_freezed == 1)
							{
								name += '（任务中）';
								freezed = 1;
								disable = true;
							}
							else
							{
								if (data.rows[i].cores[j].z_type != 0)
								{
									name += '（已占用）';
									used = data.rows[i].cores[j].z_type;
									disable = true;
								}
							}
						}
						var tempin = {
							id : data.rows[i].cores[j].core.id,
							pId : 'a_opti_' + data.rows[i].id,
							type : 2,
							chkDisabled : disable,
							name : name,
							used : used,
							freezed : freezed
						};
						treedata.push(tempin);
					}
				}
				$('#a_tree_coretocore_left').html('<div id="a_tree_coretocore_left_1" class="ztree"></div>');
				$('#a_tree_coretocore_right').html('<div id="a_tree_coretocore_right_1" class="ztree"></div>');
				var setting_left = {
					view: {
						selectedMulti: $('#a_style').val() == 1 ? false : true
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
							var zTree = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1");
							g_obj.opticoretree_sels = zTree.getCheckedNodes(true);
							if ($('#a_style').val() == 1) // 严格成对
							{
								if (treeNode.type == 1)
								{
									return false;
								}
								if (g_obj.opticoretree_sels.length == 2 && treeNode.id != g_obj.opticoretree_sels[1].id)
								{
									zTree.checkAllNodes(false);
								}
							}
							return true;
						},
						onCheck: function (e, treeId, treeNode) {      // 这里要考虑两边的同步
							var zTree = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1");
							g_obj.opticoretree_sels = zTree.getCheckedNodes(true);
							if ($('#a_style').val() == 1) // 严格成对
							{	
								var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == treeNode.id}, true);
								$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(tempnode, true, false, false);
								var another_sels = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getCheckedNodes(true);
								if (g_obj.opticoretree_sels.length == 2 && another_sels.length == 2)
								{
									one = {
										id : g_obj.opticoretree_sels[1].id,
										name : g_obj.opticoretree_sels[1].name
									};
									another = {
										id : another_sels[1].id,
										name : another_sels[1].name
									};
									type = 3;
									$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(g_obj.opticoretree_sels[1], true, false, false);
									$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(another_sels[1], true, false, false);
									$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").checkAllNodes(false);
									$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").checkAllNodes(false);
									var str='';
									g_obj.a_task_coretocore_onetoone.count ++;
									str+="<tr id='a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "'>";
								    str+="<td align='center'>直熔</td>";
								    str+="<td align='center'>" + one.name + "</td>";
								    str+="<td align='center'>" + another.name + "</td>";
								    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
								    str+="</tr>";
								    $("#a_task_coretocore_onetoone").append(str);
								    var temp = {
								    	id : 'a_task_coretocore_onetoone_row_' + g_obj.a_task_coretocore_onetoone.count,
								    	type : 3,
								    	style : 1,
								    	isAdd : 1,
								    	one : one,
								    	another : another
								    };
								    g_obj.a_task_coretocore_onetoone.rows.push(temp);
								}
							}
							else if ($('#a_style').val() == 2) // 批量成对
							{
								var string = '';
								for (var i = 0; i < g_obj.opticoretree_sels.length; i ++)
								{
									if (g_obj.opticoretree_sels[i].type == 2)
									{
										string += g_obj.opticoretree_sels[i].name + '<br/>';
										var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == g_obj.opticoretree_sels[i].id}, true);
										$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(tempnode, true, false, false);
									}
								}
								$('#a_task_coretocore_one').html(string);
							}
							var temp_sels = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getCheckedNodes(false);
							for (var i = 0; i < temp_sels.length; i ++)
							{
								var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == temp_sels[i].id}, true);
								$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(tempnode, false, false, false);
							}
						},
						onClick: function (event, treeId, treeNode, clickFlag) {
							if (treeNode.freezed == 0) // 在任务中的不能使用
							{
								if (treeNode.chkDisabled == true)  // 如果被禁用，说明非空闲
								{
									if (treeNode.checked == true) // 说明本来是非空闲，后来添加了解除成端任务，又被添加成端任务中
									{
										for (var i = 0; i < g_obj.a_task_coretocore_onetoone.rows.length; i ++)
										{
											if (g_obj.a_task_coretocore_onetoone.rows[i].type == 3 && g_obj.a_task_coretocore_onetoone.rows[i].isAdd == 1 && (g_obj.a_task_coretocore_onetoone.rows[i].one.id == treeNode.id || g_obj.a_task_coretocore_onetoone.rows[i].another.id == treeNode.id))
											{
												if (confirm('确定要删除该直熔任务吗？'))
												{
													var node = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretocore_onetoone.rows[i].one.id}, true);
													$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").checkNode(node, false);
													$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(node, false);
													
													node = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretocore_onetoone.rows[i].another.id}, true);
													$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").checkNode(node, false);
													$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(node, false);
													
													node = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretocore_onetoone.rows[i].one.id}, true);
													$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").checkNode(node, false);
													$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(node, false);
													
													node = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretocore_onetoone.rows[i].another.id}, true);
													$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").checkNode(node, false);
													$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(node, false);
													
													$('#' + g_obj.a_task_coretocore_onetoone.rows[i].id).remove();
													g_obj.a_task_coretocore_onetoone.rows.splice(i, 1);
												}
												break;
											}
										}
									}
									else // 说明本来就是非空闲，现在仍然是非空闲
									{
										if (treeNode.used != 0 && confirm("确认要添加到解除直熔任务中吗？"))
										{
											var type = 0, one , another;
											g_obj.a_task_coretocore_onetoone.count ++;
											for (var i = 0; i < g_obj.opticoretree.length; i ++)
											{
												for (var j = 0; j < g_obj.opticoretree[i].cores.length; j ++)
												{
													if (treeNode.id == g_obj.opticoretree[i].cores[j].id)
													{
														if (treeNode.used == 1)   // 与其他相连
														{
															one = {
																id : treeNode.id,
																name : g_obj.opticoretree[i].cores[j].core.name
															};
															if (g_obj.opticoretree[i].start_box != null && g_obj.opticoretree[i].start_box.id == $('#a_box_id').val())
															{
																another = g_obj.opticoretree[i].cores[j].a_string;
															}
															else if (g_obj.opticoretree[i].end_box != null && g_obj.opticoretree[i].end_box.id == $('#a_box_id').val())
															{
																another = g_obj.opticoretree[i].cores[j].z_string;
															}
															type = 4;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(treeNode, false, false, false);
															treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").updateNode(treeNode, false);
															
															var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == treeNode.id}, true);;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(tempnode, false, false, false);
															tempnode.name = g_obj.opticoretree[i].cores[j].core.name;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").updateNode(tempnode, false);
															var str='';
															str+="<tr id='a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "'>";
														    str+="<td align='center'>解除其他绑定</td>";
														    str+="<td align='center'>" + one.name + "</td>";
														    str+="<td align='center'>" + another + "</td>";
														    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
														    str+="</tr>";
														    $("#a_task_coretocore_onetoone").append(str);
														}
														else if (treeNode.used == 2) // 与端子相连core_to_terminal_
														{
															one = {
																id : treeNode.id,
																name : g_obj.opticoretree[i].cores[j].core.name
															};
															if (g_obj.opticoretree[i].start_box != null && g_obj.opticoretree[i].start_box.id == $('#a_box_id').val())
															{
																another = {
																	id : g_obj.opticoretree[i].cores[j].a_terminal.id,
																	name : g_obj.opticoretree[i].cores[j].a_terminal.name
																};
															}
															else if (g_obj.opticoretree[i].end_box != null && g_obj.opticoretree[i].end_box.id == $('#a_box_id').val())
															{
																another = {
																		id : g_obj.opticoretree[i].cores[j].z_terminal.id,
																		name : g_obj.opticoretree[i].cores[j].z_terminal.name
																	};
															}
															type = 2;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(treeNode, false, false, false);
															treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").updateNode(treeNode, false);

															var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == treeNode.id}, true);;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(tempnode, false, false, false);
															tempnode.name = g_obj.opticoretree[i].cores[j].core.name;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").updateNode(tempnode, false);
															var str='';
															str+="<tr id='a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "'>";
														    str+="<td align='center'>解除成端</td>";
														    str+="<td align='center'>" + one.name + "</td>";
														    str+="<td align='center'>" + another.name + "</td>";
														    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
														    str+="</tr>";
														    $("#a_task_coretocore_onetoone").append(str);
														}
														else if (treeNode.used == 3) // 与纤芯相连
														{
															one = {
																id : treeNode.id,
																name : g_obj.opticoretree[i].cores[j].core.name
															};
															if (g_obj.opticoretree[i].start_box != null && g_obj.opticoretree[i].start_box.id == $('#a_box_id').val())
															{
																for (var k = 0; k < g_obj.opticoretree.length; k ++)
																{
																	for (var h = 0; h < g_obj.opticoretree[k].cores.length; h ++)
																	{
																		if (g_obj.opticoretree[i].cores[j].a_core.id == g_obj.opticoretree[k].cores[h].core.id)
																		{
																			another = {
																				id : g_obj.opticoretree[k].cores[h].id,
																				name : g_obj.opticoretree[k].cores[h].core.name
																			};
																			k = g_obj.opticoretree.lenth;
																			break;
																		}
																	}
																}
															}
															else if (g_obj.opticoretree[i].end_box != null && g_obj.opticoretree[i].end_box.id == $('#a_box_id').val())
															{
																for (var k = 0; k < g_obj.opticoretree.length; k ++)
																{
																	for (var h = 0; h < g_obj.opticoretree[k].cores.length; h ++)
																	{
																		if (g_obj.opticoretree[i].cores[j].z_core.id == g_obj.opticoretree[k].cores[h].core.id)
																		{
																			another = {
																				id : g_obj.opticoretree[k].cores[h].id,
																				name : g_obj.opticoretree[k].cores[h].core.name
																			};
																			k = g_obj.opticoretree.lenth;
																			break;
																		}
																	}
																}
															}
																
															type = 3;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(treeNode, false, false, false);
															treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").updateNode(treeNode, false);
															
															var node = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node){return node.id == another.id}, true);
															$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(node, false, false, false);
															node.name = another.name;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").updateNode(node, false);
															
															var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == treeNode.id}, true);;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(tempnode, false, false, false);
															tempnode.name = g_obj.opticoretree[i].cores[j].core.name;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").updateNode(tempnode, false);

															tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == another.id}, true);;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(tempnode, false, false, false);
															tempnode.name = another.name;
															$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").updateNode(tempnode, false);
															
															var str='';
															str+="<tr id='a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "'>";
														    str+="<td align='center'>解除直熔</td>";
														    str+="<td align='center'>" + one.name + "</td>";
														    str+="<td align='center'>" + another.name + "</td>";
														    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
														    str+="</tr>";
														    $("#a_task_coretocore_onetoone").append(str);
														}
														i = g_obj.opticoretree.length;
														break;
													}
												 }
											}
											var temp = {
												id : 'a_task_coretocore_onetoone_row_' + g_obj.a_task_coretocore_onetoone.count,
												type : type,
												style : 1,
												isAdd : 0,
												one : one,
												another : another
											};
											g_obj.a_task_coretocore_onetoone.rows.push(temp);
										}
									}
								}
							}
						}
					}
				};
				g_obj.a_tree_coretoterminal_left_1 = $.fn.zTree.init($("#a_tree_coretocore_left_1"), setting_left, treedata);
				var setting_right = {
						view: {
							selectedMulti: $('#a_style').val() == 1 ? false : true
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
								var zTree = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1");
								g_obj.opticoretree_sels = zTree.getCheckedNodes(true);
								if ($('#a_style').val() == 1) // 严格成对
								{
									if (treeNode.type == 1)
									{
										return false;
									}
									if (g_obj.opticoretree_sels.length == 2 && treeNode.id != g_obj.opticoretree_sels[1].id)
									{
										zTree.checkAllNodes(false);
									}
								}
								return true;
							},
							onCheck: function (e, treeId, treeNode) {      // 这里要考虑两边的同步
								var zTree = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1");
								g_obj.opticoretree_sels = zTree.getCheckedNodes(true);
								if ($('#a_style').val() == 1) // 严格成对
								{	
									var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == treeNode.id}, true);
									$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(tempnode, true, false, false);
									var another_sels = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getCheckedNodes(true);
									if (g_obj.opticoretree_sels.length == 2 && another_sels.length == 2)
									{
										one = {
											id : g_obj.opticoretree_sels[1].id,
											name : g_obj.opticoretree_sels[1].name
										};
										another = {
											id : another_sels[1].id,
											name : another_sels[1].name
										};
										type = 3;
										$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(g_obj.opticoretree_sels[1], true, false, false);
										$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(another_sels[1], true, false, false);
										$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").checkAllNodes(false);
										$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").checkAllNodes(false);
										var str='';
										g_obj.a_task_coretocore_onetoone.count ++;
										str+="<tr id='a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "'>";
									    str+="<td align='center'>直熔</td>";
									    str+="<td align='center'>" + one.name + "</td>";
									    str+="<td align='center'>" + another.name + "</td>";
									    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
									    str+="</tr>";
									    $("#a_task_coretocore_onetoone").append(str);
									    var temp = {
									    	id : 'a_task_coretocore_onetoone_row_' + g_obj.a_task_coretocore_onetoone.count,
									    	type : 3,
									    	style : 1,
									    	isAdd : 1,
									    	one : one,
									    	another : another
									    };
									    g_obj.a_task_coretocore_onetoone.rows.push(temp);
									}
								}
								else if ($('#a_style').val() == 2) // 批量成对
								{
									var string = '';
									for (var i = 0; i < g_obj.opticoretree_sels.length; i ++)
									{
										if (g_obj.opticoretree_sels[i].type == 2)
										{
											string += g_obj.opticoretree_sels[i].name + '<br/>';
											var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == g_obj.opticoretree_sels[i].id}, true);
											$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(tempnode, true, false, false);
										}
									}
									$('#a_task_coretocore_another').html(string);
								}
								var temp_sels = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getCheckedNodes(false);
								for (var i = 0; i < temp_sels.length; i ++)
								{
									var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == temp_sels[i].id}, true);
									$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(tempnode, false, false, false);
								}
							},
							onClick: function (event, treeId, treeNode, clickFlag) {
								if (treeNode.freezed == 0) // 在任务中的不能使用
								{
									if (treeNode.chkDisabled == true)  // 如果被禁用，说明非空闲
									{
										if (treeNode.checked == true) // 说明本来是非空闲，后来添加了解除成端任务，又被添加成端任务中
										{
											for (var i = 0; i < g_obj.a_task_coretoterminal_onetoone.rows.length; i ++)
											{
												if (g_obj.a_task_coretoterminal_onetoone.rows[i].type == 3 && g_obj.a_task_coretocore_onetoone.rows[i].isAdd == 1 && (g_obj.a_task_coretocore_onetoone.rows[i].one.id == treeNode.id || g_obj.a_task_coretocore_onetoone.rows[i].another.id == treeNode.id))
												{
													if (confirm('确定要删除该直熔任务吗？'))
													{
														var node = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretocore_onetoone.rows[i].one.id}, true);
														$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").checkNode(node, false);
														$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(node, false);
														
														node = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretocore_onetoone.rows[i].another.id}, true);
														$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").checkNode(node, false);
														$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(node, false);
														
														node = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretocore_onetoone.rows[i].one.id}, true);
														$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").checkNode(node, false);
														$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(node, false);
														
														node = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == g_obj.a_task_coretocore_onetoone.rows[i].another.id}, true);
														$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").checkNode(node, false);
														$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(node, false);
														
														$('#' + g_obj.a_task_coretocore_onetoone.rows[i].id).remove();
														g_obj.a_task_coretocore_onetoone.rows.splice(i, 1);
													}
													break;
												}
											}
										}
										else // 说明本来就是非空闲，现在仍然是非空闲
										{
											if (treeNode.used != 0 && confirm("确认要添加到解除直熔任务中吗？"))
											{
												var type = 0, one , another;
												g_obj.a_task_coretocore_onetoone.count ++;
												for (var i = 0; i < g_obj.opticoretree.length; i ++)
												{
													for (var j = 0; j < g_obj.opticoretree[i].cores.length; j ++)
													{
														if (treeNode.id == g_obj.opticoretree[i].cores[j].id)
														{
															if (treeNode.used == 1)   // 与其他相连
															{
																one = {
																	id : treeNode.id,
																	name : g_obj.opticoretree[i].cores[j].core.name
																};
																if (g_obj.opticoretree[i].start_box != null && g_obj.opticoretree[i].start_box.id == $('#a_box_id').val())
																{
																	another = g_obj.opticoretree[i].cores[j].a_string;
																}
																else if (g_obj.opticoretree[i].end_box != null && g_obj.opticoretree[i].end_box.id == $('#a_box_id').val())
																{
																	another = g_obj.opticoretree[i].cores[j].z_string;
																}
																type = 4;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(treeNode, false, false, false);
																treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").updateNode(treeNode, false);
																
																var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == treeNode.id}, true);;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(tempnode, false, false, false);
																tempnode.name = g_obj.opticoretree[i].cores[j].core.name;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").updateNode(tempnode, false);
																var str='';
																str+="<tr id='a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "'>";
															    str+="<td align='center'>解除其他绑定</td>";
															    str+="<td align='center'>" + one.name + "</td>";
															    str+="<td align='center'>" + another + "</td>";
															    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
															    str+="</tr>";
															    $("#a_task_coretocore_onetoone").append(str);
															}
															else if (treeNode.used == 2) // 与端子相连core_to_terminal_
															{
																one = {
																	id : treeNode.id,
																	name : g_obj.opticoretree[i].cores[j].core.name
																};
																if (g_obj.opticoretree[i].start_box != null && g_obj.opticoretree[i].start_box.id == $('#a_box_id').val())
																{
																	another = {
																		id : g_obj.opticoretree[i].cores[j].a_terminal.id,
																		name : g_obj.opticoretree[i].cores[j].a_terminal.name
																	};
																}
																else if (g_obj.opticoretree[i].end_box != null && g_obj.opticoretree[i].end_box.id == $('#a_box_id').val())
																{
																	another = {
																			id : g_obj.opticoretree[i].cores[j].z_terminal.id,
																			name : g_obj.opticoretree[i].cores[j].z_terminal.name
																		};
																}
																type = 2;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(treeNode, false, false, false);
																treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").updateNode(treeNode, false);
	
																var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == treeNode.id}, true);;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(tempnode, false, false, false);
																tempnode.name = g_obj.opticoretree[i].cores[j].core.name;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").updateNode(tempnode, false);
																var str='';
																str+="<tr id='a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "'>";
															    str+="<td align='center'>解除成端</td>";
															    str+="<td align='center'>" + one.name + "</td>";
															    str+="<td align='center'>" + another.name + "</td>";
															    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
															    str+="</tr>";
															    $("#a_task_coretocore_onetoone").append(str);
															}
															else if (treeNode.used == 3) // 与纤芯相连
															{
																one = {
																	id : treeNode.id,
																	name : g_obj.opticoretree[i].cores[j].core.name
																};
																if (g_obj.opticoretree[i].start_box != null && g_obj.opticoretree[i].start_box.id == $('#a_box_id').val())
																{
																	for (var k = 0; k < g_obj.opticoretree.length; k ++)
																	{
																		for (var h = 0; h < g_obj.opticoretree[k].cores.length; h ++)
																		{
																			if (g_obj.opticoretree[i].cores[j].a_core.id == g_obj.opticoretree[k].cores[h].core.id)
																			{
																				another = {
																					id : g_obj.opticoretree[k].cores[h].id,
																					name : g_obj.opticoretree[k].cores[h].core.name
																				};
																				k = g_obj.opticoretree.lenth;
																				break;
																			}
																		}
																	}
																}
																else if (g_obj.opticoretree[i].end_box != null && g_obj.opticoretree[i].end_box.id == $('#a_box_id').val())
																{
																	for (var k = 0; k < g_obj.opticoretree.length; k ++)
																	{
																		for (var h = 0; h < g_obj.opticoretree[k].cores.length; h ++)
																		{
																			if (g_obj.opticoretree[i].cores[j].z_core.id == g_obj.opticoretree[k].cores[h].core.id)
																			{
																				another = {
																					id : g_obj.opticoretree[k].cores[h].id,
																					name : g_obj.opticoretree[k].cores[h].core.name
																				};
																				k = g_obj.opticoretree.lenth;
																				break;
																			}
																		}
																	}
																}
																	
																type = 3;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(treeNode, false, false, false);
																treeNode.name = g_obj.opticoretree[i].cores[j].core.name;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").updateNode(treeNode, false);
																
																var tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == treeNode.id}, true);;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(tempnode, false, false, false);
																tempnode.name = g_obj.opticoretree[i].cores[j].core.name;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").updateNode(tempnode, false);
																
																var node = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getNodesByFilter(function (node){return node.id == another.id}, true);
																$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").setChkDisabled(node, false, false, false);
																node.name = another.name;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").updateNode(node, false);
																
	
																tempnode = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getNodesByFilter(function (node) {return node.id == another.id}, true);;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").setChkDisabled(tempnode, false, false, false);
																tempnode.name = another.name;
																$.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").updateNode(tempnode, false);
																
																var str='';
																str+="<tr id='a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "'>";
															    str+="<td align='center'>解除直熔</td>";
															    str+="<td align='center'>" + one.name + "</td>";
															    str+="<td align='center'>" + another.name + "</td>";
															    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_coretocore_onetoone_row_" + g_obj.a_task_coretocore_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
															    str+="</tr>";
															    $("#a_task_coretocore_onetoone").append(str);
															}
															i = g_obj.opticoretree.length;
															break;
														}
													 }
												}
												var temp = {
													id : 'a_task_coretocore_onetoone_row_' + g_obj.a_task_coretocore_onetoone.count,
													type : type,
													style : 1,
													isAdd : 0,
													one : one,
													another : another
												};
												g_obj.a_task_coretocore_onetoone.rows.push(temp);
											}
										}
									}
								}
							}
						}
					};
				g_obj.a_tree_coretoterminal_right_1 = $.fn.zTree.init($("#a_tree_coretocore_right_1"), setting_right, treedata);
			}
		},
		error: function() {
		}
	});
	var dialog = $( "#dialog-core-to-core" ).removeClass('hide').dialog({
		width: 1000,
		height: 900,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>纤芯直熔</h4></div>",
		title_html: true,
		buttons: [
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					var type = $('#a_type').val();
					var style = $('#a_style').val();
					var sels_left = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1").getCheckedNodes(true);
					var sels_right = $.fn.zTree.getZTreeObj("a_tree_coretocore_right_1").getCheckedNodes(true);
					var count_left = 0, count_right = 0, one = [], another = [], left = '', right = '';
					for (var i = 0; i < sels_left.length; i ++)
					{
						if (sels_left[i].type == 2)
						{
							count_left ++;
							one.push({
								id : sels_left[i].id,
								name : sels_left[i].name
							});
							left += sels_left[i].name + '<br/>';
						}
					}
					for (var i = 0; i < sels_right.length; i ++)
					{
						if (sels_right[i].type == 2)
						{
							count_right ++;
							another.push({
								id : sels_right[i].id,
								name : sels_right[i].name
							});
							right += sels_right[i].name + '<br/>';
						}
					}
					if (type == 3)
					{
						if (style == 2)
						{
							if (! (count_left == 0 || count_right == 0 || count_left == count_right) || (count_left == 0 && count_right == 0))
							{
								alert('两端的数量应该一致,且不能都未空！');
								return false;
							}
						}
						for (var i = 0; i < g_obj.a_task_coretocore_onetoone.rows.length; i ++)
						{
							if (g_obj.a_task_coretocore_onetoone.rows[i].type == 2)
							{
								var temp = {
									id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
									type : 2,
									style : 1,
									boxid : $('#a_box_id').val(),
									isAdd : g_obj.a_task_coretocore_onetoone.rows[i].isAdd,
									one : g_obj.a_task_coretocore_onetoone.rows[i].one,
									another : g_obj.a_task_coretocore_onetoone.rows[i].another
								};
								g_obj.a_task_jumpterminal.rows.push(temp);
								g_obj.a_task_jumpterminal.count ++;
								var str='';
								str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
							    str+="<td align='center'>" + (g_obj.a_task_coretocore_onetoone.rows[i].isAdd == 1 ? "成端" : "解除成端") + "</td>";
							    str+="<td align='center'>" + $('#a_box').val() + "</td>";
							    str+="<td align='center'>" + g_obj.a_task_coretocore_onetoone.rows[i].one.name + "</td>";
							    str+="<td align='center'>" + g_obj.a_task_coretocore_onetoone.rows[i].another.name + "</td>";
							    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
							    str+="</tr>";
							    $("#a_info").append(str);
							}
							else if (g_obj.a_task_coretocore_onetoone.rows[i].type == 3)
							{
								var temp = {
									id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
									type : 3,
									style : 1,
									boxid : $('#a_box_id').val(),
									isAdd : g_obj.a_task_coretocore_onetoone.rows[i].isAdd,
									one : g_obj.a_task_coretocore_onetoone.rows[i].one,
									another : g_obj.a_task_coretocore_onetoone.rows[i].another
								};
								g_obj.a_task_jumpterminal.rows.push(temp);
								g_obj.a_task_jumpterminal.count ++;
								var str='';
								str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
							    str+="<td align='center'>" + (g_obj.a_task_coretocore_onetoone.rows[i].isAdd == 1 ? "直熔" : "解除直熔") + "</td>";
							    str+="<td align='center'>" + $('#a_box').val() + "</td>";
							    str+="<td align='center'>" + g_obj.a_task_coretocore_onetoone.rows[i].one.name + "</td>";
							    str+="<td align='center'>" + g_obj.a_task_coretocore_onetoone.rows[i].another.name + "</td>";
							    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
							    str+="</tr>";
							    $("#a_info").append(str);
							}
							else if (g_obj.a_task_coretocore_onetoone.rows[i].type == 4)
							{
								var temp = {
									id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
									type : 4,
									style : 1,
									boxid : $('#a_box_id').val(),
									isAdd : g_obj.a_task_coretocore_onetoone.rows[i].isAdd,
									one : g_obj.a_task_coretocore_onetoone.rows[i].one,
									another : g_obj.a_task_coretocore_onetoone.rows[i].another
								};
								g_obj.a_task_jumpterminal.rows.push(temp);
								g_obj.a_task_jumpterminal.count ++;
								var str='';
								str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
							    str+="<td align='center'>" + (g_obj.a_task_coretocore_onetoone.rows[i].isAdd == 1 ? "其他" : "解除其他") + "</td>";
							    str+="<td align='center'>" + $('#a_box').val() + "</td>";
							    str+="<td align='center'>" + g_obj.a_task_coretocore_onetoone.rows[i].one.name + "</td>";
							    str+="<td align='center'>" + g_obj.a_task_coretocore_onetoone.rows[i].another + "</td>";
							    str+="<td align='center'><button onclick='return relieveother(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
							    str+="</tr>";
							    $("#a_info").append(str);
							}
						}
						/*if (style == 2)
						{
							var temp = {
								id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
								type : 2,
								style : 2,
								boxid : $('#a_box_id').val(),
								isAdd : 1,
								one : one,
								another : another
							};
							g_obj.a_task_jumpterminal.rows.push(temp);
							g_obj.a_task_jumpterminal.count ++;
							var str='';
							str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
						    str+="<td align='center'>直熔组</td>";
						    str+="<td align='center'>" + $('#a_box').val() + "</td>";
						    str+="<td align='center'>" + left + "</td>";
						    str+="<td align='center'>" + right + "</td>";
						    str+="<td align='center'><button onclick='return relievecoretocore(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 2, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
						    str+="</tr>";
						    $("#a_info").append(str);
						}*/
					}
					$( "#dialog-core-to-core" ).dialog("close"); 
				}
			},
			{
				text: "取消",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-core-to-core" ).dialog("close"); 
				} 
			}
		]
	});
}


// 查询纤芯成端
function findCoreToTerminal(id, div, label, change) {
	if ($('#' + id).attr('src') == 'images/circle_green.png')
	{
		var pre = id.substring(0, id.lastIndexOf('_') + 1);
		var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=findCoreToTerminal",
			data : "id=" + tempid,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data.resultMark == 1 && data.object != null)
				{
					if (change == 1)
					{
						if (g_obj.showModules_back_terminal != null)
						{
							$('#' + g_obj.showModules_back_terminal.id).attr('src', g_obj.showModules_back_terminal.src);
						}
						g_obj.showModules_back_terminal = {
							id : id,
							src : $('#' + id).attr('src')
						};
						$('#' + id).attr('src', 'images/circle_blue.png');
					}
					$('#' + label).html('查询成端：端子：' + $('#' + pre + tempid).attr('title') + '&nbsp;与&nbsp;纤芯：' + data.object.core.name + '&nbsp;成端');
				}
				else
				{
					$('#' + label).html('<font style="color:red;">端子：' + $('#' + id).attr('title') + '查询成端失败，请重试！</font>');
				}
			},
			error : function() {
				$('#' + label).html('<font style="color:red;">端子：' + $('#' + id).attr('title') + '查询成端失败，请重试！</font>');
			}
		});
	}
}

// 纤芯成端点击事件
function coretoterminalclick(id) {
	var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
	//alert(tempid);
	if ($('#a_style').val() == 1) // 严格成对
	{
		if ($('#' + id).attr('src') == 'images/circle_blue.png')
		{
			if (g_obj.core_to_terminal_click == null || g_obj.core_to_terminal_click.id != id)
			{
				if (confirm('确定要删除这个成端任务吗？'))
				{
					var i = 0;
					for (i = 0; i < g_obj.a_task_coretoterminal_onetoone.rows.length; i ++)
					{
						if (g_obj.a_task_coretoterminal_onetoone.rows[i].type == 2 && g_obj.a_task_coretoterminal_onetoone.rows[i].isAdd == 1 && g_obj.a_task_coretoterminal_onetoone.rows[i].another.id == tempid)
						{
							break;
						}
					}
					if (i < g_obj.a_task_coretoterminal_onetoone.rows.length)
					{
						alert('您只能在父窗口删除该成端任务！');
					}
				}
			}
			else
			{
				$('#' + id).attr('src', 'images/circle_red.png');
				g_obj.core_to_terminal_click = null;
			}
		}
		else if ($('#' + id).attr('src') == 'images/circle_red.png')
		{
			var zTree = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1");
			if (zTree.getCheckedNodes(true).length <= 0)
			{
				if (g_obj.core_to_terminal_click != null)
				{
					$('#' + g_obj.core_to_terminal_click.id).attr('src', 'images/circle_red.png');
				}
				$('#' + id).attr('src', 'images/circle_blue.png');
				g_obj.core_to_terminal_click = {id : id};
			}
			else
			{
				var treeNode = zTree.getCheckedNodes(true)[1];
				one = {
					id : treeNode.id,
					name : treeNode.name
				};
				another = {
					id : tempid,
					name : $('#' + id).attr('title'),
					src : $('#' + id).attr('src')
				};
				$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(treeNode, true, false, false);
				$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkAllNodes(false);
				$('#' + id).attr('src', 'images/circle_blue.png');
				g_obj.a_task_coretoterminal_onetoone.count ++;
				var str='';
				str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
			    str+="<td align='center'>成端</td>";
			    str+="<td align='center'>" + one.name + "</td>";
			    str+="<td align='center'>" + another.name + "</td>";
			    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
			    str+="</tr>";
			    $("#a_task_coretoterminal_onetoone").append(str);
			    var temp = {
					id : 'a_task_coretoterminal_onetoone_row_' + g_obj.a_task_coretoterminal_onetoone.count,
					type : 2,
					style : 1,
					isAdd : 1,
					one : one,
					another : another
				};
				g_obj.a_task_coretoterminal_onetoone.rows.push(temp);
			}
		}
		else if ($('#' + id).attr('src') == 'images/circle_green.png')
		{
			if (confirm('成端之前要解除已有成端，确定要添加到解除成端任务中吗？'))
			{
				$.ajax( {
					type : "post",
					url : "boxinfo.do?method=findCoreToTerminal",
					data : "id=" + tempid,
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1 && data.object != null)
						{
							$('#' + id).attr('src', 'images/circle_grey.png');
							var node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node) {return node.id == data.object.id}, true);
							$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, false, false, false);
							node.name = data.object.core.name;
							$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(node);
							one = {
								id : node.id,
								name : node.name
							};
							another = {
								id : tempid,
								name : $('#' + id).attr('title'),
								src : $('#' + id).attr('src')
							};
							$('#' + id).attr('src', 'images/circle_blue.png');
							g_obj.a_task_coretoterminal_onetoone.count ++;
							var str='';
							str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
						    str+="<td align='center'>解除成端</td>";
						    str+="<td align='center'>" + one.name + "</td>";
						    str+="<td align='center'>" + another.name + "</td>";
						    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
						    str+="</tr>";
						    $("#a_task_coretoterminal_onetoone").append(str);
						    var temp = {
								id : 'a_task_coretoterminal_onetoone_row_' + g_obj.a_task_coretoterminal_onetoone.count,
								type : 2,
								style : 1,
								isAdd : 0,
								one : one,
								another : another
							};
							g_obj.a_task_coretoterminal_onetoone.rows.push(temp);
							var zTree = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1");
							if (zTree.getCheckedNodes(true).length <= 0)
							{
								if (g_obj.core_to_terminal_click != null)
								{
									$('#' + g_obj.core_to_terminal_click.id).attr('src', 'images/circle_red.png');
								}
								$('#' + id).attr('src', 'images/circle_blue.png');
								g_obj.core_to_terminal_click = {id : id};
							}
							else
							{
								var treeNode = zTree.getCheckedNodes(true)[1];
								one = {
									id : treeNode.id,
									name : treeNode.name
								};
								another = {
									id : tempid,
									name : $('#' + id).attr('title'),
									src : $('#' + id).attr('src')
								};
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(treeNode, true, false, false);
								$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").checkAllNodes(false);
								$('#' + id).attr('src', 'images/circle_blue.png');
								g_obj.a_task_coretoterminal_onetoone.count ++;
								var str='';
								str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
							    str+="<td align='center'>成端</td>";
							    str+="<td align='center'>" + one.name + "</td>";
							    str+="<td align='center'>" + another.name + "</td>";
							    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
							    str+="</tr>";
							    $("#a_task_coretoterminal_onetoone").append(str);
							    var temp = {
									id : 'a_task_coretoterminal_onetoone_row_' + g_obj.a_task_coretoterminal_onetoone.count,
									type : 2,
									style : 1,
									isAdd : 1,
									one : one,
									another : another
								};
								g_obj.a_task_coretoterminal_onetoone.rows.push(temp);
							}
						}
					},
					error : function() {
					}
				});
			}
		}
	}
	else if ($('#a_style').val() == 2) // 批量成对
	{
		if ($('#' + id).attr('src') == 'images/circle_blue.png')
		{
			var i = 0, string = '', jump = 0;
			for (i = 0; i < g_obj.core_to_terminal_clicks.length; i ++)
			{
				if (id == g_obj.core_to_terminal_clicks[i].id)
				{
					jump = 1;
					$('#' + id).attr('src', 'images/circle_red.png');
					g_obj.core_to_terminal_clicks.splice(i, 1);
					if (i < g_obj.core_to_terminal_clicks.length)
					{
						string += g_obj.core_to_terminal_clicks[i].name + '<br/>';
					}
				}
				else
				{
					string += g_obj.core_to_terminal_clicks[i].name + '<br/>';
				}
			}
			$('#a_task_coretoterminal_terminal').html(string);
			if (jump == 0)
			{
				alert('您只能在父窗口删除该成端任务！');
			}
		}
		else if ($('#' + id).attr('src') == 'images/circle_red.png')
		{
			$('#' + id).attr('src', 'images/circle_blue.png');
			g_obj.core_to_terminal_clicks.push({
				id : id,
				name : $('#' + id).attr('title'),
				src : $('#' + id).attr('src')
			});
			var string = '';
			for (var i = 0; i < g_obj.core_to_terminal_clicks.length; i ++)
			{
				string += g_obj.core_to_terminal_clicks[i].name + '<br/>';
			}
			$('#a_task_coretoterminal_terminal').html(string);
		}
		else if ($('#' + id).attr('src') == 'images/circle_green.png')
		{
			if (confirm('成端之前要解除已有成端，确定要添加到解除成端任务中吗？'))
			{
				$.ajax( {
					type : "post",
					url : "boxinfo.do?method=findCoreToTerminal",
					data : "id=" + tempid,
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1 && data.object != null)
						{
							$('#' + id).attr('src', 'images/circle_red.png');
							var node = $.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").getNodesByFilter(function (node) {return node.id == data.object.id}, true);
							$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").setChkDisabled(node, false, false, false);
							node.name = data.object.core.name;
							$.fn.zTree.getZTreeObj("a_tree_coretoterminal_1").updateNode(node);
							one = {
								id : node.id,
								name : node.name
							};
							another = {
								id : tempid,
								name : $('#' + id).attr('title'),
								src : $('#' + id).attr('src')
							};
							$('#' + id).attr('src', 'images/circle_blue.png');
							g_obj.a_task_coretoterminal_onetoone.count ++;
							var str='';
							str+="<tr id='a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "'>";
						    str+="<td align='center'>解除成端</td>";
						    str+="<td align='center'>" + one.name + "</td>";
						    str+="<td align='center'>" + another.name + "</td>";
						    str+="<td align='center'><button onclick='return relievecoretoterminal(\"a_task_coretoterminal_onetoone_row_" + g_obj.a_task_coretoterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
						    str+="</tr>";
						    $("#a_task_coretoterminal_onetoone").append(str);
						    var temp = {
								id : 'a_task_coretoterminal_onetoone_row_' + g_obj.a_task_coretoterminal_onetoone.count,
								type : 2,
								style : 1,
								isAdd : 0,
								one : one,
								another : another
							};
							g_obj.a_task_coretoterminal_onetoone.rows.push(temp);
							g_obj.core_to_terminal_clicks.push({
								id : id,
								name : $('#' + id).attr('title')
							});
							$('#a_task_coretoterminal_terminal').append($('#' + id).attr('title') + '<br/>');
						}
					},
					error : function() {
					}
				});
			}
		}
	}
}

function startchoosejump(dir)
{
	if (dir == 1)
	{
		$('#startchoosejumpleft').addClass('btn-warning');
		$('#startchoosejumpleft').removeClass('btn-success');
		$('#startchoosejumpright').addClass('btn-success');
		$('#startchoosejumpright').removeClass('btn-warning');
		g_obj.startchoosejump = 1;
	}
	else if (dir == 2)
	{
		$('#startchoosejumpright').addClass('btn-warning');
		$('#startchoosejumpright').removeClass('btn-success');
		$('#startchoosejumpleft').addClass('btn-success');
		$('#startchoosejumpleft').removeClass('btn-warning');
		g_obj.startchoosejump = 2;
	}
	return false;
}



// 跳纤
function jumpTerminal() {
	g_obj.a_task_jumpterminal_onetoone = {};
	g_obj.a_task_jumpterminal_onetoone.rows = [];
	g_obj.a_task_jumpterminal_onetoone.count = 0;
	g_obj.a_task_jumpterminal_manytomany = {};
	g_obj.a_task_jumpterminal_manytomany.rows = [];
	g_obj.a_task_jumpterminal_manytomany.count = 0;
	g_obj.jump_last_click = [];
	g_obj.jump_last_left_click = [];
	g_obj.jump_last_right_click = [];
	g_obj.startchoosejump = 0;
	var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
		modal: true,
		width: 200,
		height: 100,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
		title_html: true,
	});
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findBoxModulesAndTerminalsByAjax",
		data:"id=" + $('#a_box_id').val(),
		success : function(data) {
			isOvertime(data.resultMark);
			$( "#dialog-progressbar" ).dialog("close");
			if (data != null)
			{
				if (data.bms.length > 0)
				{
					var tablehtml = '';
					/*tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表任务中&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询跳纤&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子&nbsp;&nbsp;&nbsp;</div>';
					tablehtml += '<div style="margin-top:20px;" id="a_task_jumpterminal_table1"><table class="mytable" width="100%"><tr align="center"><td>类型</td><td>端子</td><td>端子</td><td>&nbsp;</td></tr><tbody id="a_task_jumpterminal_onetoone"></tbody></table></div>';
					tablehtml += '<div style="margin-top:20px; display:none;" id="a_task_jumpterminal_table2"><table class="mytable" width="100%"><tr align="center"><td><button id="startchoosejumpleft" onclick="return startchoosejump(1)" class="btn btn-xs btn-success">开始选择一端<i class="icon-ok icon-on-right"></i></button></td><td><button id="startchoosejumpright" onclick="return startchoosejump(2)" class="btn btn-xs btn-success">开始选择另一端<i class="icon-ok icon-on-right"></i></button></td><td>&nbsp;</td></tr><tbody><tr><td id="a_task_jumpterminal_one" align="center"></td><td id="a_task_jumpterminal_another" align="center"></td><td align="center"><button onclick="return relievejumpterminal(0, 2, 0)" class="btn btn-xs btn-success">删除<i class="icon-remove icon-on-right"></i></button></td></tr></tbody></table></div>';
					for (var i = 0; i < data.bms.length; i ++)
					{
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '</h1>';
						tablehtml += '<div style="width:100%; height:100%;"><table width="100%" id="tables_jump_' + i + '"><tr>';
						tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="jump_back_mark_div_' + i + '" class="alert alert-info" style="margin-top:12px;"><label id="jump_back_mark_label_' + i + '">查询跳纤：</label></div></div>';
						tablehtml += '</div>';
					}
					$('#dialog-jump-tables').html(tablehtml);
					if ($('#a_style').val() == 2)
					{
						$('#a_task_jumpterminal_table2').show();
					}
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=40 style='border-top:8px solid white; text-align:center;'>" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].frontFreezed != 0)
								{
									str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img id='boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_yellow.png' width='12px'/></td>";
								}
								else
								{
									if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].frontUsed != 0)
									{
										str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' onclick='findJumpTerminal(\"boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\", \"jump_back_mark_div_" + i + "\", \"jump_back_mark_label_" + i + "\", 0)' id='boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_green.png' width='12px'/></td>";
									}
									else
									{
										str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' id='boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_grey.png' width='12px'/></td>";
									}
								}
							}
					        str +="</tr>";
					        $("#tables_jump_" + i).append(str);
						}
					}*/
					tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表损坏&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表预占&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_blue.png" width="12px">&nbsp;代表当前选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询跳纤&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子/解除跳纤&nbsp;&nbsp;&nbsp;</div>';
					tablehtml += '<div style="margin-top:20px;" id="a_task_jumpterminal_table1"><table class="mytable" width="100%"><tr align="center"><td>类型</td><td>端子</td><td>端子</td><td>&nbsp;</td></tr><tbody id="a_task_jumpterminal_onetoone"></tbody></table></div>';
					tablehtml += '<div style="margin-top:20px; display:none;" id="a_task_jumpterminal_table2"><table class="mytable" width="100%"><tr align="center"><td><button id="startchoosejumpleft" onclick="return startchoosejump(1)" class="btn btn-xs btn-success">开始选择一端<i class="icon-ok icon-on-right"></i></button></td><td><button id="startchoosejumpright" onclick="return startchoosejump(2)" class="btn btn-xs btn-success">开始选择另一端<i class="icon-ok icon-on-right"></i></button></td><td>&nbsp;</td></tr><tbody><tr><td id="a_task_jumpterminal_one" align="center"></td><td id="a_task_jumpterminal_another" align="center"></td><td align="center"><button onclick="return relievejumpterminal(0, 2, 0)" class="btn btn-xs btn-success">删除<i class="icon-remove icon-on-right"></i></button></td></tr></tbody></table></div>';
					
					//挖大坑
				    for (var i = 0; i < data.bms.length; i ++)
					{
						if (i % 2 == 0)
						{
							tablehtml += '<div style="width:100%; height:auto; float:left; clear:both;">';
						}
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '面</h1>';
						tablehtml += '<div class="tabbable" id="jt_box_tabs_' + i + '"><ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="jt_myTab4" style="height:50px !important;"><li class="active"><a data-toggle="tab" href="#map_' + i + '">正面</a></li></ul>';
						tablehtml += '<div class="tab-content" id="jt_box_tabs_content_' + i + '">';
						tablehtml += '<div id="jt_map_' + i + '" class="tab-pane in active" style="width:100%; height:100%;"><table width="100%" id="jt_tables_front_' + i + '"><tr>';
						tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						//表头
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="jt_tables_front_mark_div_' + data.bms[i].id + '" class="alert alert-info" style="margin-top:12px;"><label id="jt_tables_front_mark_label_' + data.bms[i].id + '">查询跳纤：</label></div></div>';

						tablehtml += '</div>';
						tablehtml += '</div>';
						tablehtml += '</div>';
						if (i % 2 == 1)
						{
							tablehtml += '</div>';
						}
					}
					$('#dialog-jump-tables').html(tablehtml);
					//挖小坑
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=60 style='border-top:8px solid white; text-align:left;'>&nbsp;" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								str += "<td width=60 id='jt_showModule_front_terminal_" + data.bms[i].id + "_" + (j + 1) + "_" + (k + 1) + "_outer' style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'></td>";
							}
					        str +="</tr>";
					        $("#jt_tables_front_" + i).append(str);
						}
					}
					for (var i = 0; i < data.bts.length; i ++)
					{
						if (data.bts[i].boxTerminal.status == 4)
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_yellow.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 2)
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='boxTerminal_jump_" + data.bts[i].boxTerminal.id + "' onclick='findJumpTerminal(\"boxTerminal_jump_" + data.bts[i].boxTerminal.id + "\", \"jt_tables_front_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "\", \"jt_tables_front_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "\", 0)'  ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i].boxTerminal.id + "\")' title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_green.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 3)
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_grey.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 1)
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='boxTerminal_jump_" + data.bts[i].boxTerminal.id + "' ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i].boxTerminal.id + "\")' title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_red.png' width='12px'/>");
						}			
					}
					//还原上次的选择
					for (var i = 0; i < g_obj.a_task_jumpterminal.rows.length; i ++)
					{
						if (g_obj.a_task_jumpterminal.rows[i].type == 1)
						{
							if (g_obj.a_task_jumpterminal.rows[i].style == 1) //严格
							{
								if (g_obj.a_task_jumpterminal.rows[i].isAdd == 1)
								{
									$('#' + g_obj.a_task_jumpterminal.rows[i].one.id).attr('src', 'images/circle_blue.png');
									$('#' + g_obj.a_task_jumpterminal.rows[i].another.id).attr('src', 'images/circle_blue.png');
								}
								else
								{
									$('#' + g_obj.a_task_jumpterminal.rows[i].one.id).attr('src', 'images/circle_red.png');
									$('#' + g_obj.a_task_jumpterminal.rows[i].another.id).attr('src', 'images/circle_red.png');
								}
							}
							else if (g_obj.a_task_jumpterminal.rows[i].style == 2) //批量
							{
								for (var j = 0; j < g_obj.a_task_jumpterminal.rows[i].one.length; j ++)
								{
									$('#' + g_obj.a_task_jumpterminal.rows[i].one[j].id).attr('src', 'images/circle_blue.png');
								}
								for (var j = 0; j < g_obj.a_task_jumpterminal.rows[i].another.length; j ++)
								{
									$('#' + g_obj.a_task_jumpterminal.rows[i].another[j].id).attr('src', 'images/circle_blue.png');
								}
							}
						}
					}
					var dialog = $( "#dialog-jump" ).removeClass('hide').dialog({
						width: 1100,
						height: 800,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>跳纤</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "确定",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									var type = $('#a_type').val();
									var style = $('#a_style').val();
									if (type == 1)
									{
										/*if (style == 2)
										{
											if (! (g_obj.jump_last_left_click.length == 0 || g_obj.jump_last_right_click.length == 0 || g_obj.jump_last_left_click.length == g_obj.jump_last_right_click.length))
											{
												alert('两端的端子数量应该一致！');
												return false;
											}
										}*/
										for (var i = 0; i < g_obj.a_task_jumpterminal_onetoone.rows.length; i ++)
										{
											var temp = {
												id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
												type : type,
												style : 1,
												boxid : $('#a_box_id').val(),
												isAdd : g_obj.a_task_jumpterminal_onetoone.rows[i].isAdd,
												one : g_obj.a_task_jumpterminal_onetoone.rows[i].one,
												another : g_obj.a_task_jumpterminal_onetoone.rows[i].another
											};
											g_obj.a_task_jumpterminal.rows.push(temp);
											g_obj.a_task_jumpterminal.count ++;
											var str='';
											str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
										    str+="<td align='center'>" + (g_obj.a_task_jumpterminal_onetoone.rows[i].isAdd == 1 ? "跳纤" : "解除跳纤") + "</td>";
										    str+="<td align='center'>" + $('#a_box').val() + "</td>";
										    str+="<td align='center'>" + g_obj.a_task_jumpterminal_onetoone.rows[i].one.name + "</td>";
										    str+="<td align='center'>" + g_obj.a_task_jumpterminal_onetoone.rows[i].another.name + "</td>";
										    str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
										    str+="</tr>";
										    $("#a_info").append(str);
										}
										/*if (style == 2)
										{
											var temp = {
												id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
												type : type,
												style : 2,
												boxid : $('#a_box_id').val(),
												isAdd : 1,
												one : g_obj.jump_last_left_click,
												another : g_obj.jump_last_right_click
											};
											g_obj.a_task_jumpterminal.rows.push(temp);
											g_obj.a_task_jumpterminal.count ++;
											var str='';
											str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
										    str+="<td align='center'>跳纤组</td>";
										    str+="<td align='center'>" + $('#a_box').val() + "</td>";
										    var templeft = '', tempright = '';
										    for (var i = 0; i < g_obj.jump_last_left_click.length; i ++)
										    {
										    	templeft += g_obj.jump_last_left_click[i].name + '<br/>';
										    }
										    for (var i = 0; i < g_obj.jump_last_right_click.length; i ++)
										    {
										    	tempright += g_obj.jump_last_right_click[i].name + '<br/>';
										    }
										    str+="<td align='center'>" + templeft + "</td>";
										    str+="<td align='center'>" + tempright + "</td>";
										    str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 2, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
										    str+="</tr>";
										    $("#a_info").append(str);
										}*/
									}
									$( "#dialog-jump" ).dialog("close"); 
								}
							},
							{
								text: "取消",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( "#dialog-jump" ).dialog("close"); 
								} 
							}
						]
					});
				}
			}
		},
		error : function() {
			$( "#dialog-progressbar" ).dialog("close");
		}
	});
}




// 跳纤for update
function jumpTerminalforupdate() {
	g_obj.a_task_jumpterminal_onetoone = {};
	g_obj.a_task_jumpterminal_onetoone.rows = [];
	g_obj.a_task_jumpterminal_onetoone.count = 0;
	g_obj.a_task_jumpterminal_manytomany = {};
	g_obj.a_task_jumpterminal_manytomany.rows = [];
	g_obj.a_task_jumpterminal_manytomany.count = 0;
	g_obj.jump_last_click = [];
	g_obj.jump_last_left_click = [];
	g_obj.jump_last_right_click = [];
	g_obj.startchoosejump = 0;
	var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
		modal: true,
		width: 200,
		height: 100,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
		title_html: true,
	});
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findBoxModulesAndTerminalsByAjax",
		data:"id=" + $('#b_box_id').val(),
		success : function(data) {
			isOvertime(data.resultMark);
			$( "#dialog-progressbar" ).dialog("close");
			if (data != null)
			{
				if (data.bms.length > 0)
				{
					var tablehtml = '';
					/*tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表任务中&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询跳纤&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子&nbsp;&nbsp;&nbsp;</div>';
					tablehtml += '<div style="margin-top:20px;" id="a_task_jumpterminal_table1"><table class="mytable" width="100%"><tr align="center"><td>类型</td><td>端子</td><td>端子</td><td>&nbsp;</td></tr><tbody id="a_task_jumpterminal_onetoone"></tbody></table></div>';
					tablehtml += '<div style="margin-top:20px; display:none;" id="a_task_jumpterminal_table2"><table class="mytable" width="100%"><tr align="center"><td><button id="startchoosejumpleft" onclick="return startchoosejump(1)" class="btn btn-xs btn-success">开始选择一端<i class="icon-ok icon-on-right"></i></button></td><td><button id="startchoosejumpright" onclick="return startchoosejump(2)" class="btn btn-xs btn-success">开始选择另一端<i class="icon-ok icon-on-right"></i></button></td><td>&nbsp;</td></tr><tbody><tr><td id="a_task_jumpterminal_one" align="center"></td><td id="a_task_jumpterminal_another" align="center"></td><td align="center"><button onclick="return relievejumpterminal(0, 2, 0)" class="btn btn-xs btn-success">删除<i class="icon-remove icon-on-right"></i></button></td></tr></tbody></table></div>';
					for (var i = 0; i < data.bms.length; i ++)
					{
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '</h1>';
						tablehtml += '<div style="width:100%; height:100%;"><table width="100%" id="tables_jump_' + i + '"><tr>';
						tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="jump_back_mark_div_' + i + '" class="alert alert-info" style="margin-top:12px;"><label id="jump_back_mark_label_' + i + '">查询跳纤：</label></div></div>';
						tablehtml += '</div>';
					}
					$('#dialog-jump-tables').html(tablehtml);
					if ($('#a_style').val() == 2)
					{
						$('#a_task_jumpterminal_table2').show();
					}
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=40 style='border-top:8px solid white; text-align:center;'>" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].frontFreezed != 0)
								{
									str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img id='boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_yellow.png' width='12px'/></td>";
								}
								else
								{
									if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].frontUsed != 0)
									{
										str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' onclick='findJumpTerminal(\"boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\", \"jump_back_mark_div_" + i + "\", \"jump_back_mark_label_" + i + "\", 0)' id='boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_green.png' width='12px'/></td>";
									}
									else
									{
										str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' id='boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_grey.png' width='12px'/></td>";
									}
								}
							}
					        str +="</tr>";
					        $("#tables_jump_" + i).append(str);
						}
					}*/
					tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表损坏&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表预占&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_blue.png" width="12px">&nbsp;代表当前选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询跳纤&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子/解除跳纤&nbsp;&nbsp;&nbsp;</div>';
					tablehtml += '<div style="margin-top:20px;" id="a_task_jumpterminal_table1"><table class="mytable" width="100%"><tr align="center"><td>类型</td><td>端子</td><td>端子</td><td>&nbsp;</td></tr><tbody id="a_task_jumpterminal_onetoone"></tbody></table></div>';
					tablehtml += '<div style="margin-top:20px; display:none;" id="a_task_jumpterminal_table2"><table class="mytable" width="100%"><tr align="center"><td><button id="startchoosejumpleft" onclick="return startchoosejump(1)" class="btn btn-xs btn-success">开始选择一端<i class="icon-ok icon-on-right"></i></button></td><td><button id="startchoosejumpright" onclick="return startchoosejump(2)" class="btn btn-xs btn-success">开始选择另一端<i class="icon-ok icon-on-right"></i></button></td><td>&nbsp;</td></tr><tbody><tr><td id="a_task_jumpterminal_one" align="center"></td><td id="a_task_jumpterminal_another" align="center"></td><td align="center"><button onclick="return relievejumpterminal(0, 2, 0)" class="btn btn-xs btn-success">删除<i class="icon-remove icon-on-right"></i></button></td></tr></tbody></table></div>';
					
					//挖大坑
				    for (var i = 0; i < data.bms.length; i ++)
					{
						if (i % 2 == 0)
						{
							tablehtml += '<div style="width:100%; height:auto; float:left; clear:both;">';
						}
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '面</h1>';
						tablehtml += '<div class="tabbable" id="jt_box_tabs_' + i + '"><ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="jt_myTab4" style="height:50px !important;"><li class="active"><a data-toggle="tab" href="#map_' + i + '">正面</a></li></ul>';
						tablehtml += '<div class="tab-content" id="jt_box_tabs_content_' + i + '">';
						tablehtml += '<div id="jt_map_' + i + '" class="tab-pane in active" style="width:100%; height:100%;"><table width="100%" id="jt_tables_front_' + i + '"><tr>';
						tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						//表头
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="jt_tables_front_mark_div_' + data.bms[i].id + '" class="alert alert-info" style="margin-top:12px;"><label id="jt_tables_front_mark_label_' + data.bms[i].id + '">查询跳纤：</label></div></div>';

						tablehtml += '</div>';
						tablehtml += '</div>';
						tablehtml += '</div>';
						if (i % 2 == 1)
						{
							tablehtml += '</div>';
						}
					}
					$('#dialog-jump-tables').html(tablehtml);

					//挖小坑
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=60 style='border-top:8px solid white; text-align:left;'>&nbsp;" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								str += "<td width=60 id='jt_showModule_front_terminal_" + data.bms[i].id + "_" + (j + 1) + "_" + (k + 1) + "_outer' style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'></td>";
							}
					        str +="</tr>";
					        $("#jt_tables_front_" + i).append(str);
						}
					}

					for (var i = 0; i < data.bts.length; i ++)
					{
						if (data.bts[i].boxTerminal.status == 4)
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_yellow.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 2)
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='boxTerminal_jump_" + data.bts[i].boxTerminal.id + "' onclick='findJumpTerminal(\"boxTerminal_jump_" + data.bts[i].boxTerminal.id + "\", \"jt_tables_front_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "\", \"jt_tables_front_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "\", 0)'  ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i].boxTerminal.id + "\")' title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_green.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 3)
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_grey.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 1)
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='boxTerminal_jump_" + data.bts[i].boxTerminal.id + "' ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i].boxTerminal.id + "\")' title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_red.png' width='12px'/>");
						}			
					}

					//还原上次的选择
					for (var i = 0; i < g_obj.a_task_jumpterminal.rows.length; i ++)
					{
						if (g_obj.a_task_jumpterminal.rows[i].type == 1)
						{
							if (g_obj.a_task_jumpterminal.rows[i].style == 1) //严格
							{
								if (g_obj.a_task_jumpterminal.rows[i].isAdd == 1)
								{
									$('#' + g_obj.a_task_jumpterminal.rows[i].one.id).attr('src', 'images/circle_blue.png');
									$('#' + g_obj.a_task_jumpterminal.rows[i].another.id).attr('src', 'images/circle_blue.png');
								}
								else
								{
									$('#' + g_obj.a_task_jumpterminal.rows[i].one.id).attr('src', 'images/circle_red.png');
									$('#' + g_obj.a_task_jumpterminal.rows[i].another.id).attr('src', 'images/circle_red.png');
								}
							}
							else if (g_obj.a_task_jumpterminal.rows[i].style == 2) //批量
							{
								for (var j = 0; j < g_obj.a_task_jumpterminal.rows[i].one.length; j ++)
								{
									$('#' + g_obj.a_task_jumpterminal.rows[i].one[j].id).attr('src', 'images/circle_blue.png');
								}
								for (var j = 0; j < g_obj.a_task_jumpterminal.rows[i].another.length; j ++)
								{
									$('#' + g_obj.a_task_jumpterminal.rows[i].another[j].id).attr('src', 'images/circle_blue.png');
								}
							}
						}
					}


					var dialog = $( "#dialog-jump" ).removeClass('hide').dialog({
						width: 1100,
						height: 800,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>跳纤</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "确定",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									var type = $('#a_type_update').val();
									var style = $('#a_style_update').val();
									if (type == 1)
									{
										/*if (style == 2)
										{
											if (! (g_obj.jump_last_left_click.length == 0 || g_obj.jump_last_right_click.length == 0 || g_obj.jump_last_left_click.length == g_obj.jump_last_right_click.length))
											{
												alert('两端的端子数量应该一致！');
												return false;
											}
										}*/
										for (var i = 0; i < g_obj.a_task_jumpterminal_onetoone.rows.length; i ++)
										{
											var temp = {
												id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
												type : type,
												style : 1,
												boxid : $('#b_box_id').val(),
												isAdd : g_obj.a_task_jumpterminal_onetoone.rows[i].isAdd,
												one : g_obj.a_task_jumpterminal_onetoone.rows[i].one,
												another : g_obj.a_task_jumpterminal_onetoone.rows[i].another
											};
											g_obj.a_task_jumpterminal.rows.push(temp);
											g_obj.a_task_jumpterminal.count ++;
											var str='';
											str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
										    str+="<td align='center'>" + (g_obj.a_task_jumpterminal_onetoone.rows[i].isAdd == 1 ? "跳纤" : "解除跳纤") + "</td>";
										    str+="<td align='center'>" + $('#a_box').val() + "</td>";
										    str+="<td align='center'>" + g_obj.a_task_jumpterminal_onetoone.rows[i].one.name + "</td>";
										    str+="<td align='center'>" + g_obj.a_task_jumpterminal_onetoone.rows[i].another.name + "</td>";
										    str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
										    str+="</tr>";
										    $("#a_info_update").append(str);
										}
										/*if (style == 2)
										{
											var temp = {
												id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
												type : type,
												style : 2,
												boxid : $('#a_box_id').val(), 
												isAdd : 1,
												one : g_obj.jump_last_left_click,
												another : g_obj.jump_last_right_click
											};
											g_obj.a_task_jumpterminal.rows.push(temp);
											g_obj.a_task_jumpterminal.count ++;
											var str='';
											str+="<tr id='a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "'>";
										    str+="<td align='center'>跳纤组</td>";
										    str+="<td align='center'>" + $('#a_box').val() + "</td>";
										    var templeft = '', tempright = '';
										    for (var i = 0; i < g_obj.jump_last_left_click.length; i ++)
										    {
										    	templeft += g_obj.jump_last_left_click[i].name + '<br/>';
										    }
										    for (var i = 0; i < g_obj.jump_last_right_click.length; i ++)
										    {
										    	tempright += g_obj.jump_last_right_click[i].name + '<br/>';
										    }
										    str+="<td align='center'>" + templeft + "</td>";
										    str+="<td align='center'>" + tempright + "</td>";
										    str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + g_obj.a_task_jumpterminal.count + "\", 2, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
										    str+="</tr>";
										    $("#a_info").append(str);
										}*/
									}
									$( "#dialog-jump" ).dialog("close"); 
								}
							},
							{
								text: "取消",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( "#dialog-jump" ).dialog("close"); 
								} 
							}
						]
					});
				}
			}
		},
		error : function() {
			$( "#dialog-progressbar" ).dialog("close");
		}
	});
}


//查询跳纤
function findJumpTerminal(id, div, label, change, type) {
	var pre = id.substring(0, id.lastIndexOf('_') + 1);
	var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findJumpTerminal",
		data:"id=" + tempid + "&type=" + (type == 1 ? 1 : 0),
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null && data.resultMark == 1)
			{
				if (data.object != null)
				{
					$('#' + label).html(data.object);
				}
				else
				{
					$('#' + label).html('查询失败，请重试！');
				}
			}
		},
		error : function() {
			
		}
	});
}



// 跳纤点击事件
function jumpclick(id) {
	var style = 1;     //$('#a_style').val();
	if (style == 1) // 严格成对
	{
		if ($('#' + id).attr('src') == 'images/circle_red.png')
		{
			if (g_obj.jump_last_click.length == 0)
			{
				var temp = {
					id : id,
					name : $('#' + id).attr('title'),
					src : $('#' + id).attr('src')
				};
				g_obj.jump_last_click.push(temp);
				$('#' + id).attr('src', 'images/circle_blue.png');
			}
			else if (g_obj.jump_last_click.length == 1)
			{
				var temp = {
					id : 'a_task_jumpterminal_onetoone_row_' + (g_obj.a_task_jumpterminal_onetoone.count + 1),
					type : 1,
					style : 1,
					isAdd : 1,
					one : g_obj.jump_last_click[0],
					another : {
						id : id,
						name : $('#' + id).attr('title'),
						src : $('#' + id).attr('src')
					}
				};
				g_obj.a_task_jumpterminal_onetoone.rows.push(temp);
				g_obj.a_task_jumpterminal_onetoone.count ++;
				var str='';
				str+="<tr id='a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "'>";
			    str+="<td align='center'>跳纤</td>";
			    str+="<td align='center'>" + g_obj.jump_last_click[0].name + "</td>";
			    str+="<td align='center'>" + $('#' + id).attr('title') + "</td>";
			    str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
			    str+="</tr>";
			    $("#a_task_jumpterminal_onetoone").append(str);
				$('#' + id).attr('src', 'images/circle_blue.png');
				g_obj.jump_last_click = [];
			}
		}
		else if ($('#' + id).attr('src') == 'images/circle_blue.png')
		{
			if (g_obj.jump_last_click.length == 1 && g_obj.jump_last_click[0].id == id)
			{
				$("#" + id).attr("src", "images/circle_red.png");
				g_obj.jump_last_click = [];
			}
			else
			{
				var i = 0;
				for (i = 0; i < g_obj.a_task_jumpterminal_onetoone.rows.length; i ++)
				{
					var temp = g_obj.a_task_jumpterminal_onetoone.rows[i];
					if (temp.one.id == id || temp.another.id == id)
					{
						if (confirm('确定要撤销这个跳纤任务吗？'))
						{
							$("#" + temp.one.id).attr("src", "images/circle_red.png");
							$("#" + temp.another.id).attr("src", "images/circle_red.png");
							$('#a_task_jumpterminal_onetoone_row_' + temp.id).remove();
							g_obj.a_task_jumpterminal_onetoone.rows.splice(i, 1);
							break;
						}
					}
				}
				if (i == g_obj.a_task_jumpterminal_onetoone.rows.length)
				{
					alert('您只能在父窗口删除该跳纤任务！');
				}
			}
		}
		else if ($('#' + id).attr('src') == 'images/circle_green.png')
		{
			if (confirm('跳纤之前要添加解除跳纤任务，确定要这么做吗？'))
			{
				var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
				$.ajax( {
					type : "post",
					url : "boxinfo.do?method=findJumpTerminal",
					data:"id=" + tempid,
					success : function(data) {
						isOvertime(data.resultMark);
						if (data != null && data.resultMark == 1)
						{
							var temp = {
								id : 'a_task_jumpterminal_onetoone_row_' + (g_obj.a_task_jumpterminal_onetoone.count + 1),
								type : 1,
								style : 1,
								isAdd : 0,
								one : {
									id : 'boxTerminal_jump_' + data.object.frontTerminal.id,
									name : $('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('title'),
									src : $('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('src')
								},
								another : {
									id : 'boxTerminal_jump_' + data.object.boxTerminal.id,
									name : $('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('title'),
									src : $('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('src')
								}
							};
							g_obj.a_task_jumpterminal_onetoone.rows.push(temp);
							g_obj.a_task_jumpterminal_onetoone.count ++;
							var str='';
							str+="<tr id='a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "'>";
						    str+="<td align='center'>解除跳纤</td>";
						    str+="<td align='center'>" + $('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('title') + "</td>";
						    str+="<td align='center'>" + $('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('title') + "</td>";
						    str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
						    str+="</tr>";
						    $("#a_task_jumpterminal_onetoone").append(str);
							$('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('src', 'images/circle_red.png');
							$('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('src', 'images/circle_red.png');
							if (g_obj.jump_last_click.length == 0)
							{
								var temp = {
									id : id,
									name : $('#' + id).attr('title'),
									src : $('#' + id).attr('src')
								};
								g_obj.jump_last_click.push(temp);
								$('#' + id).attr('src', 'images/circle_blue.png');
							}
							else if (g_obj.jump_last_click.length == 1)
							{
								var temp = {
									id : 'a_task_jumpterminal_onetoone_row_' + (g_obj.a_task_jumpterminal_onetoone.count + 1),
									type : 1,
									style : 1,
									isAdd : 1,
									one : g_obj.jump_last_click[0],
									another : {
										id : id,
										name : $('#' + id).attr('title'),
										src : $('#' + id).attr('src')
									}
								};
								g_obj.a_task_jumpterminal_onetoone.rows.push(temp);
								g_obj.a_task_jumpterminal_onetoone.count ++;
								var str='';
								str+="<tr id='a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "'>";
							    str+="<td align='center'>跳纤</td>";
							    str+="<td align='center'>" + g_obj.jump_last_click[0].name + "</td>";
							    str+="<td align='center'>" + $('#' + id).attr('title') + "</td>";
							    str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
							    str+="</tr>";
							    $("#a_task_jumpterminal_onetoone").append(str);
								$('#' + id).attr('src', 'images/circle_blue.png');
								g_obj.jump_last_click = [];
							}
						}
					},
					error : function() {
						alert('查询跳纤失败，请重试！');
					}
				});
			}
		}
	}
	/*else if (style == 2) // 批量成对
	{
		if (g_obj.startchoosejump == 0)
		{
			alert('请选择要选择端子到哪一端！');
		}
		else if (g_obj.startchoosejump == 1)
		{
			if ($('#' + id).attr('src') == 'images/circle_red.png')
			{
				g_obj.jump_last_left_click.push({
					id : id,
					name : $('#' + id).attr('title'),
					src : $('#' + id).attr('src')
				});
				$('#' + id).attr('src', 'images/circle_blue.png');
				$('#a_task_jumpterminal_one').append($('#' + id).attr('title') + '<br/>');
			}
			else if ($('#' + id).attr('src') == 'images/circle_green.png')
			{
				if (confirm('跳纤之前要添加解除跳纤任务，确定要这么做吗？'))
				{
					var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
					$.ajax( {
						type : "post",
						url : "boxinfo.do?method=findJumpTerminal",
						data:"id=" + tempid,
						success : function(data) {
							if (data != null && data.resultMark == 1)
							{
								var temp = {
									id : 'a_task_jumpterminal_onetoone_row_' + (g_obj.a_task_jumpterminal_onetoone.count + 1),
									type : 1,
									style : 1,
									isAdd : 0,
									one : {
										id : 'boxTerminal_jump_' + data.object.frontTerminal.id,
										name : $('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('title'),
										src : $('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('src')
									},
									another : {
										id : 'boxTerminal_jump_' + data.object.boxTerminal.id,
										name : $('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('title'),
										src : $('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('src')
									}
								};
								g_obj.a_task_jumpterminal_onetoone.rows.push(temp);
								g_obj.a_task_jumpterminal_onetoone.count ++;
								var str='';
								str+="<tr id='a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "'>";
							    str+="<td align='center'>解除跳纤</td>";
							    str+="<td align='center'>" + $('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('title') + "</td>";
							    str+="<td align='center'>" + $('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('title') + "</td>";
							    str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
							    str+="</tr>";
							    $("#a_task_jumpterminal_onetoone").append(str);
								$('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('src', 'images/circle_red.png');
								$('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('src', 'images/circle_red.png');
								g_obj.jump_last_left_click.push({
									id : id,
									name : $('#' + id).attr('title'),
									src : $('#' + id).attr('src')
								});
								$('#' + id).attr('src', 'images/circle_blue.png');
								$('#a_task_jumpterminal_one').append($('#' + id).attr('title') + '<br/>');
							}
						},
						error : function() {
							alert('查询跳纤失败，请重试！');
						}
					});
				}
			}
			else if ($('#' + id).attr('src') == 'images/circle_blue.png')
			{
				var temp = '', i;
				for (i = 0; i < g_obj.jump_last_left_click.length; i ++)
				{
					if (g_obj.jump_last_left_click[i].id == id)
					{
						$('#' + id).attr('src', 'images/circle_red.png');
						g_obj.jump_last_left_click.splice(i, 1);
						if (g_obj.jump_last_left_click.length > i)
						{
							temp += g_obj.jump_last_left_click[i].name + '<br/>';
						}
					}
					else
					{
						temp += g_obj.jump_last_left_click[i].name + '<br/>';
					}
				}
				$('#a_task_jumpterminal_one').html(temp);
				if (i == g_obj.jump_last_left_click.length)
				{
					alert('您只能切换到选择另外一端或在父窗口删除该跳纤任务！');
				}
			}
		}
		else if (g_obj.startchoosejump == 2)
		{
			if ($('#' + id).attr('src') == 'images/circle_red.png')
			{
				g_obj.jump_last_right_click.push({
					id : id,
					name : $('#' + id).attr('title'),
					src : $('#' + id).attr('src')
				});
				$('#' + id).attr('src', 'images/circle_blue.png');
				$('#a_task_jumpterminal_another').append($('#' + id).attr('title') + '<br/>');
			}
			else if ($('#' + id).attr('src') == 'images/circle_green.png')
			{
				if (confirm('跳纤之前要添加解除跳纤任务，确定要这么做吗？'))
				{
					var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
					$.ajax( {
						type : "post",
						url : "boxinfo.do?method=findJumpTerminal",
						data:"id=" + tempid,
						success : function(data) {
							if (data != null && data.resultMark == 1)
							{
								var temp = {
									id : 'a_task_jumpterminal_onetoone_row_' + (g_obj.a_task_jumpterminal_onetoone.count + 1),
									type : 1,
									style : 1,
									isAdd : 0,
									one : {
										id : 'boxTerminal_jump_' + data.object.frontTerminal.id,
										name : $('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('title'),
										src : $('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('src')
									},
									another : {
										id : 'boxTerminal_jump_' + data.object.boxTerminal.id,
										name : $('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('title'),
										src : $('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('src')
									}
								};
								g_obj.a_task_jumpterminal_onetoone.rows.push(temp);
								g_obj.a_task_jumpterminal_onetoone.count ++;
								var str='';
								str+="<tr id='a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "'>";
							    str+="<td align='center'>解除跳纤</td>";
							    str+="<td align='center'>" + $('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('title') + "</td>";
							    str+="<td align='center'>" + $('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('title') + "</td>";
							    str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_onetoone_row_" + g_obj.a_task_jumpterminal_onetoone.count + "\", 1, 0)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
							    str+="</tr>";
							    $("#a_task_jumpterminal_onetoone").append(str);
								$('#boxTerminal_jump_' + data.object.boxTerminal.id).attr('src', 'images/circle_red.png');
								$('#boxTerminal_jump_' + data.object.frontTerminal.id).attr('src', 'images/circle_red.png');
								g_obj.jump_last_right_click.push({
									id : id,
									name : $('#' + id).attr('title'),
									src : $('#' + id).attr('src')
								});
								$('#' + id).attr('src', 'images/circle_blue.png');
								$('#a_task_jumpterminal_another').append($('#' + id).attr('title') + '<br/>');
							}
						},
						error : function() {
							alert('查询跳纤失败，请重试！');
						}
					});
				}
			}
			else if ($('#' + id).attr('src') == 'images/circle_blue.png')
			{
				var temp = '', i;
				for (i = 0; i < g_obj.jump_last_right_click.length; i ++)
				{
					if (g_obj.jump_last_right_click[i].id == id)
					{
						$('#' + id).attr('src', 'images/circle_red.png');
						g_obj.jump_last_right_click.splice(i, 1);
						if (g_obj.jump_last_right_click.length > i)
						{
							temp += g_obj.jump_last_right_click[i].name + '<br/>';
						}
					}
					else
					{
						temp += g_obj.jump_last_right_click[i].name + '<br/>';
					}
				}
				$('#a_task_jumpterminal_another').html(temp);
				if (i == g_obj.jump_last_right_click.length)
				{
					alert('您只能切换到选择另外一端或在父窗口删除该跳纤任务！');
				}
			}
		}
	}*/
}



function changeordertype() {
	if ($('#a_order_type').val() == 3)
	{
		$('#a_is_resourcestask').hide();
	}
	else
	{
		$('#a_is_resourcestask').show();
	}
}

function refresh_order(id) {
	if (confirm('确定要更新该资源配置工单吗？'))
	{
		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=finishWorkorder",
			data: "id=" + id,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data.resultMark == 1)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('更新成功！');
					mySetTimeOut('add_statekey_mark_div', 4000);
					$('#grid-table').trigger("reloadGrid");
				}
				else
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('更新失败，请重试！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
			},
			error : function() {
				$('#add_statekey_mark_div').show();
				$('#add_statekey_mark_label').html('更新失败，请重试！');
				mySetTimeOut('add_statekey_mark_div', 4000);
			}
		});
	}
}

function showDetail(id) {

	$('#rightclick_contextmenu').hide();

	if (id == null || id === undefined)
	{
		id = g_obj.rightClickRowData.id;
	}
	
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findWorkorderNew",
		data: "id=" + id,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				//显示基本信息
				$('#view_order_no').html(data.object.order_no);
				$('#view_title').html(data.object.title);
				var type= '';
				if (data.object.type == 1)
					type ='资源配置';
				else if(data.object.type == 2)
					type ='告警';
				else if(data.object.type == 3)
                     type ='其他';
				$('#view_type').html(type);
				$('#view_create_time').html(new Date(data.object.create_time).Format("yyyy-MM-dd hh:mm:ss"));
				
				if(data.object.receive_time != null)
				   $('#view_receive_time').html(new Date(data.object.receive_time).Format("yyyy-MM-dd hh:mm:ss"));
				if(data.object.create_user != null)
				     $('#view_user').html(data.object.create_user.full_name);

				 var createtype= '';
				if (data.object.create_type == 1)
					createtype ='服务器自动产生';
				else if(data.object.create_type == 2)
					createtype ='手工生成';
				else if (data.object.create_type == 3)
                    createtype ='维修申请';
				$('#view_create_type').html(createtype);

				$('#view_department_id').html(data.object.department.full_name);
				
				if(data.object.receive_operators != null)
			     	$('#view_receive_operators_id').html(data.object.receive_operators.full_name);
				
				

                 var done_type= '';
				if (data.object.done_type == 1)
					done_type ='未接收';
				else if(data.object.done_type == 2)
					done_type ='未完成';
				else if(data.object.done_type == 3)
                    done_type ='已完成';
                else if(data.object.done_type == 4)
                    done_type ='任务超时';
				$('#view_done_type').html(done_type);
			
			/*	var html = '';
				for (var i = 0; i < data.object.gds.length; i ++)
				{
					html += data.object.gds[i].boxInfo.box_no + '<br/>';
				}
				$('#view_boxes').html(html);*/

				   	//显示告警信息详细
                   if (data.object.als !=null){

                     $("#v_info_alert").empty();
                            	
                      for (var i = 0; i < data.object.als.length; i ++)
						{
								
						var str='';
						str+="<tr>";
						str+="<td align='center'>" +  data.object.als[i].alarm_type + "</td>";
						str+="<td align='center' colspan=2>" + data.object.als[i].boxinfo.box_no  + "</td>";
						str+="<td align='center'>" + (new Date(data.object.als[i].create_time).Format("yyyy-MM-dd hh:mm:ss")) + "</td>";
						// str+="<td align='center'>" + data.object.als[i].done_type + "</td>";
						// str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + i + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
						str+="</tr>";
						$("#v_info_alert").append(str);
									
									
						}

                  }

                  	 //显示资源配置信息详细
                   if (data.object.ops !=null){

                     $("#v_info_res").empty();
                            	
                      for (var i = 0; i < data.object.ops.length; i ++)
						{

						 if (data.object.ops[i].order_type == 2)    //跳纤
						  {

									    var str='';
										str+="<tr id='a_task_jumpterminal_row_" + i + "'>";
									    str+="<td align='center'>" +  "跳纤" + "</td>";
									    str+="<td align='center'>" + data.object.ops[i].boxinfo.box_no + "</td>";
									    str+="<td align='center'>" + findTerminalName(data.object.ops[i].a_terminal_id) + "</td>";
									    str+="<td align='center'>" + findTerminalName(data.object.ops[i].z_terminal_id) + "</td>";
									   // str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + i + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
									    str+="</tr>";
									    $("#v_info_res").append(str);
						 }

						 	 if (data.object.ops[i].order_type == 1)    //成端
						  {

									    var str='';
										str+="<tr id='a_task_jumpterminal_row_" + i + "'>";
									    str+="<td align='center'>" +  "成端" + "</td>";
									    str+="<td align='center'>" + data.object.ops[i].boxinfo.box_no + "</td>";
									    str+="<td align='center'>" + findCoreName(data.object.ops[i].core_id) + "</td>";
									    str+="<td align='center'>" + findTerminalName(data.object.ops[i].terminal_id) + "</td>";
									   // str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + i + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
									    str+="</tr>";
									     $("#v_info_res").append(str);
						 }

						  if (data.object.ops[i].order_type == 3)    //直熔
						  {

									    var str='';
										str+="<tr id='a_task_jumpterminal_row_" + i + "'>";
									    str+="<td align='center'>" +  "直熔" + "</td>";
									    str+="<td align='center'>" + data.object.ops[i].boxinfo.box_no + "</td>";
									    str+="<td align='center'>" + findCoreName(data.object.ops[i].a_core_id) + "</td>";
									    str+="<td align='center'>" + findCoreName(data.object.ops[i].z_core_id) + "</td>";
									   // str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + i + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
									    str+="</tr>";
									     $("#v_info_res").append(str);
						 }

									
						}

                  }


				var dialog = $( "#dialog-view" ).removeClass('hide').dialog({
					modal: true,
					width: 900,
					height: 600,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>工单详细信息(" + data.object.title + ")</h4></div>",
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
				$('#manage_grant_warnlabel').html('查看工单失败，请重试！');
				mySetTimeOut('manage_grant_warn', 4000);
			}
		},
		error : function() {
			$('#manage_grant_warn').show();
			$('#manage_grant_warnlabel').html('查看工单失败， 请重试！');
			mySetTimeOut('manage_grant_warn', 4000);
		}
	});
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
	
	var grid_selector = "#grid-table";
	var pager_selector = "#grid-pager";
	var manage_lock_grid_selector = "#manage-lock-grid-table";
	var manage_lock_pager_selector = "#manage-lock-grid-pager";
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

	// 绑定工单列表
	jQuery(grid_selector).jqGrid({
		// direction: "rtl",
		url: 'boxinfo.do?method=listWorkOrderByAjax',
		datatype: 'json',
		mtype: 'post',
		
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID', '', '工单编号','名称', '工单类型', '创建人', '创建时间', '创建类型', '工单状态', '接受部门', '接受人', '接受时间', '预计开始时间', '预计结束时间'],
		colModel:[
			{name:'id',index:'id', width:60, sorttype:"int", hidden: true},
			{name:'is_upload',index:'is_upload', width:90, formatter:function(cellvalue, options, rowObject){
					var value = '';
					if (rowObject.type == 1 && rowObject.is_upload == 0 && rowObject.done_type == 3)   
					{
						value = '<button onclick="refresh_order(\'' + rowObject.id + '\', 1)" class="btn btn-xs btn-success">更新资源</button>';
					}
					return value;
				}
			},
			{name:'order_no',index:'order_no',width:120},
			{name:'title',index:'title', width:90},
			{name:'type',index:'type', width:120, formatter:function(cellvalue, options, rowObject){
					var value = '';
					if (rowObject.type == 1)
					{
						value = '资源配置';
					}
					else if (rowObject.type == 2)
					{
						value = '告警';
					}
					else if (rowObject.type == 3)
					{
						value = '其他';
					}
					return value;
				}
			},
			{name:'create_user',index:'create_user.full_name', sortable:false, width:90, formatter:function(cellvalue, options, rowObject){
					var temp = '';
					if (rowObject.create_type != 1)
					{
						if (rowObject.create_user != null)
						{
							temp = rowObject.create_user;
						}
					}
					return temp;
				}
			},
			{name:'create_time',index:'create_time', width:120, formatter:function(cellvalue, options, rowObject){
					return rowObject.create_time == null ? "─────" : new Date(rowObject.create_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'create_type',index:'create_type', width:120, formatter:function(cellvalue, options, rowObject){
					var value = '';
					if (rowObject.create_type == 1)
					{
						value = '服务器自动产生';
					}
					else if (rowObject.create_type == 2)
					{
						value = '手工生成';
					}
					else if (rowObject.create_type == 3)
					{
						value = '维修申请';
					}
					return value;
				}
			},
			{name:'done_type',index:'done_type', width:120, formatter:function(cellvalue, options, rowObject){
					var temp = '';
					if (rowObject.done_type == 1)
					{
						temp = '未接受';
					}
					else if (rowObject.done_type == 2)
					{
						temp = '已接受';
					}
					else if (rowObject.done_type == 3)
					{
						temp = '已完成';
					}
					else if (rowObject.done_type == 4)
					{
						temp = '任务超时';
					}
					return temp;
				}
			},
			{name:'department',index:'department.name', sortable:false, width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.department == null ? "─────" : rowObject.department;
				}
			},
			{name:'receive_operators',index:'receive_operators.name', sortable:false, width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.receive_operators == null ? "" : rowObject.receive_operators;
				}
			},
			{name:'receive_time',index:'receive_time', width:120, formatter:function(cellvalue, options, rowObject){
					return rowObject.receive_time == null ? "" : new Date(rowObject.receive_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'respect_starttime',index:'respect_starttime', width:120, formatter:function(cellvalue, options, rowObject){
					return rowObject.respect_starttime == null ? "" : new Date(rowObject.respect_starttime).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'respect_endtime',index:'respect_endtime', width:120, formatter:function(cellvalue, options, rowObject){
					return rowObject.respect_endtime == null ? "" : new Date(rowObject.respect_endtime).Format("yyyy-MM-dd hh:mm:ss");
				}
			}
		], 
        rownumbers:true,//添加左侧行号
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : pager_selector,
		altRows: true,
		// toppager: true,
		ondblClickRow: function(rowid,irow,icol,e) {

			//待添加  显示工单详细信息
		},
		onRightClickRow: function(rowid,irow,icol,e) {
			g_obj.rightClickPos = {
					pageX : e.pageX,
					pageY : e.pageY
			};
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
			g_obj.rightClickRowData = $('#grid-table').jqGrid('getRowData',rowid);
			g_obj.rightClickNode = g_obj.rightClickRowData.id;
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

	// 绑定工单列表分页
	jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	// navbar options
			edit: $('#workorder_update').val() == 'true' ? true : false,
			editfunc: function(){
				g_obj.a_task_jumpterminal = {};
				g_obj.a_task_jumpterminal.rows = [];
				g_obj.a_task_jumpterminal.count = 0;
				g_obj.a_task_coretoterminal = {};
				g_obj.a_task_coretoterminal.rows = [];
				g_obj.a_task_coretoterminal.count = 0;
				g_obj.a_task_coretocore = {};
				g_obj.a_task_coretocore.rows = [];
				g_obj.a_task_coretocore.count = 0;

	            $("#a_info_update").empty(); 
				var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('请选择一行数据！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else if (array.length > 1)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('只能选择一行数据！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else
				{
					var griddata = $('#grid-table').jqGrid('getRowData', array[0]);
					if (griddata.done_type == '未接受') {
						$.ajax( {
							type : "post",
							url : "boxinfo.do?method=findWorkorderNew",
							data: "id=" + griddata.id,
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#u_id').val(data.object.id);
									$('#u_order_no').val(data.object.order_no);
									$('#u_title').val(data.object.title);
									$('#u_department_name').val(data.object.department.name);
									$('#u_department_id').val(data.object.department.id);

									if (data.object.w_boxinfo != null)
									{
										$('#b_box_id').val(data.object.w_boxinfo.id);
										$('#b_box').val(data.object.w_boxinfo.box_no);
									}else{

										$('#b_box_id').val('');
										$('#b_box').val('');
									}

									if (data.object.receive_operators != null)
									{
										$('#u_workorder_receive_name').val(data.object.receive_operators.full_name);
										$('#u_workorder_receive_id').val(data.object.receive_operators.id);
									}else{

										$('#u_workorder_receive_name').val('');
										$('#u_workorder_receive_id').val('');
									}

									$('#u_order_type').val(data.object.type);
									if(data.object.respect_starttime != null)
									    $('#u_respect_starttime').val((new Date(data.object.respect_starttime).Format("yyyy-MM-dd hh:mm:ss")));
									else
										 $('#u_respect_starttime').val('');
									if(data.object.respect_endtime != null)
									    $('#u_respect_endtime').val((new Date(data.object.respect_endtime).Format("yyyy-MM-dd hh:mm:ss")));
									else
										 $('#u_respect_endtime').val('');
										
									$('#u_remarks').val(data.object.remarks);
                                  
                             	   //显示资源配置详细
                                if (data.object.ops !=null){
                                	 $("#a_info_update").empty();
                            	for (var i = 0; i < data.object.ops.length; i ++)
								{
									if (data.object.ops[i].order_type == 2)    //跳纤
									{
											/*var temp = {
												id : 'a_task_jumpterminal_row_' + (g_obj.a_task_jumpterminal.count + 1),
												type : 1,
												style : 1,
												boxid : $('#b_box_id').val(),
												isAdd : 1,
												one :{
                                                        id : data.object.ops[i].a_terminal_id,
                                                        name : $('#' + data.object.ops[i].a_terminal_id).attr('title'),
                                                         src : $('#' + data.object.ops[i].a_terminal_id).attr('src')
					                                  },
					 							another :{
						                                id : data.object.ops[i].z_terminal_id,
						                                name : $('#' +  data.object.ops[i].z_terminal_id).attr('title'),
						                                src : $('#' +  data.object.ops[i].z_terminal_id).attr('src')
					                                   }
											};
											g_obj.a_task_jumpterminal.rows.push(temp);
											g_obj.a_task_jumpterminal.count ++;*/
											
									
									
		
									    var str='';
										str+="<tr id='a_task_jumpterminal_row_" + i + "'>";
									    str+="<td align='center'>" +  "跳纤" + "</td>";
									    str+="<td align='center'>" + data.object.ops[i].boxinfo.box_no + "</td>";
									    str+="<td align='center'>" + data.object.ops[i].a_terminal_id + "</td>";
									    str+="<td align='center'>" + data.object.ops[i].z_terminal_id + "</td>";
									   // str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + i + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
									    str+="</tr>";
									    $("#a_info_update").append(str);
									}
									
								}

                                  }



                             	   //显示告警信息详细
                                if (data.object.als !=null){

                                $("#a_info_alert").empty();
                            	
                            	for (var i = 0; i < data.object.als.length; i ++)
								{
								
									    var str='';
										str+="<tr>";
									    str+="<td align='center'>" +  data.object.als[i].alarm_type + "</td>";
									    str+="<td align='center'>" + data.object.als[i].boxinfo.box_no  + "</td>";
									    str+="<td align='center'>" + (new Date(data.object.als[i].create_time).Format("yyyy-MM-dd hh:mm:ss")) + "</td>";
									   // str+="<td align='center'>" + data.object.als[i].done_type + "</td>";
									   // str+="<td align='center'><button onclick='return relievejumpterminal(\"a_task_jumpterminal_row_" + i + "\", 1, 1)' class='btn btn-xs btn-success'>删除<i class='icon-remove icon-on-right'></i></button></td>";
									    str+="</tr>";
									    $("#a_info_alert").append(str);
									
									
								}

                                  }

									var dialog = $( "#dialog-message-update" ).removeClass('hide').dialog({
										modal: true,
										width: 900,
										height: 600,
										title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改工单(" + griddata.title  + ")</h4></div>",
										title_html: true,
										buttons: [ 
											{
												text: "确定",
												"class" : "btn btn-primary btn-xs",
												click: function() {
													if (true)
													{
														var workorder = '';
														workorder += 'id=' + $('#u_id').val();
														workorder += '&order_no=' + $('#u_order_no').val();
														workorder += '&title=' + $('#u_title').val();	
														workorder += '&department.id=' + $('#u_department_id').val();
														if ($('#u_workorder_receive_id').val() != null && $('#u_workorder_receive_id').val() != '')
														{
															workorder += '&receive_operators.id=' + $('#u_workorder_receive_id').val();
														}
														workorder += '&respect_starttime=' + $('#u_respect_starttime').val();
														workorder += '&respect_endtime=' + $('#u_respect_endtime').val();
														workorder += '&remarks=' + $('#u_remarks').val();

                              //更新工单对应资源配置情况
                            /*   if ($('#u_order_type').val() != 3)
								{
									var content = '';
									if (g_obj.a_task_jumpterminal.rows.length > 0)
									{	
										for (var i = 0; i < g_obj.a_task_jumpterminal.rows.length; i ++)
										{
											if (g_obj.a_task_jumpterminal.rows[i].type == 1)//如果是跳纤
											{
												var tempone = g_obj.a_task_jumpterminal.rows[i].one.id.substring(g_obj.a_task_jumpterminal.rows[i].one.id.lastIndexOf('_') + 1, g_obj.a_task_jumpterminal.rows[i].one.id.length);
												var tempanother = g_obj.a_task_jumpterminal.rows[i].another.id.substring(g_obj.a_task_jumpterminal.rows[i].another.id.lastIndexOf('_') + 1, g_obj.a_task_jumpterminal.rows[i].another.id.length);
												workorder += '&ops[' + i + '].order_type=' + 2;
												workorder += '&ops[' + i + '].boxinfo.id=' + g_obj.a_task_jumpterminal.rows[i].boxid;
												workorder += '&ops[' + i + '].a_terminal_id=' + tempone;
												workorder += '&ops[' + i + '].z_terminal_id=' + tempanother;
												workorder += '&ops[' + i + '].operate_type=' + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? 1 : 2);
												workorder += '&ops[' + i + '].sequence=' + (i + 1);
												content +=  (i + 1) + '>端子：' + g_obj.a_task_jumpterminal.rows[i].one.name + '与端子：' + g_obj.a_task_jumpterminal.rows[i].another.name + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? '跳纤' : '解除跳纤') + '；';
												content += '</br>';
											}
											else if (g_obj.a_task_jumpterminal.rows[i].type == 2) //成端
											{
												workorder += '&ops[' + i + '].order_type=' + 1;
												workorder += '&ops[' + i + '].boxinfo.id=' + g_obj.a_task_jumpterminal.rows[i].boxid;
												workorder += '&ops[' + i + '].core_id=' + g_obj.a_task_jumpterminal.rows[i].one.id;
												workorder += '&ops[' + i + '].terminal_id=' + g_obj.a_task_jumpterminal.rows[i].another.id;
												workorder += '&ops[' + i + '].operate_type=' + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? 1 : 2);
												workorder += '&ops[' + i + '].sequence=' + (i + 1);
												content += (i + 1) + '>纤芯：' + g_obj.a_task_jumpterminal.rows[i].one.name + '与端子：' + g_obj.a_task_jumpterminal.rows[i].another.name + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? '成端' : '解除成端') + '；';
												content += '</br>';
											}
											else if (g_obj.a_task_jumpterminal.rows[i].type == 3) //直熔
											{
												workorder += '&ops[' + i + '].order_type=' + 3;
												workorder += '&ops[' + i + '].boxinfo.id=' + g_obj.a_task_jumpterminal.rows[i].boxid;
												workorder += '&ops[' + i + '].a_core_id=' + g_obj.a_task_jumpterminal.rows[i].one.id;
												workorder += '&ops[' + i + '].z_core_id=' + g_obj.a_task_jumpterminal.rows[i].another.id;
												workorder += '&ops[' + i + '].operate_type=' + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? 1 : 2);
												workorder += '&ops[' + i + '].sequence=' + (i + 1);
												content += (i + 1) + '>纤芯：' + g_obj.a_task_jumpterminal.rows[i].one.name + '与纤芯：' + g_obj.a_task_jumpterminal.rows[i].another.name + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? '直熔' : '解除直熔') + '；';
												content += '</br>';
											}
										}
										workorder += '&content=' + content;
									}	
								}*/

														$.ajax( {
															type : "post",
															url : "boxinfo.do?method=updateWorkorder",
															data: workorder,
															success : function(data) {
																isOvertime(data.resultMark);
																if (data.resultMark == 1)
																{
																	$('#add_statekey_mark_div').show();
																	$('#add_statekey_mark_label').html('修改工单成功！');
																	mySetTimeOut('add_statekey_mark_div', 4000);
																	$('#grid-table').trigger("reloadGrid");
																}
																else
																{
																	$('#add_statekey_mark_div').show();
																	$('#add_statekey_mark_label').html('修改工单失败，请重试！');
																	mySetTimeOut('add_statekey_mark_div', 4000);
																}
																$("#dialog-message-update").dialog("close"); 
															},
															error : function() {
																$('#add_statekey_mark_div').show();
																$('#add_statekey_mark_label').html('修改工单失败，请重试！');
																mySetTimeOut('add_statekey_mark_div', 4000);
																$( "#dialog-message-update" ).dialog("close"); 
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
													$( "#dialog-message-update" ).dialog( "close" ); 
												} 
											}
										]
									});
								}
								else
								{
									$('#add_statekey_mark_div').show();
									$('#add_statekey_mark_label').html('获取工单失败，请重试！');
									mySetTimeOut('add_statekey_mark_div', 4000);
								}
							},
							error : function() {
								$('#add_statekey_mark_div').show();
								$('#add_statekey_mark_label').html('获取工单失败，请重试！');
								mySetTimeOut('add_statekey_mark_div', 4000);
							}
						});
					}
					else
					{
						alert('未接受的工单才可以修改');
					}
				}
			},
			editicon : 'icon-pencil blue',
			add: $('#workorder_add').val() == 'true' ? true : false,
			addfunc: function(){
				g_obj.a_task_jumpterminal = {};
				g_obj.a_task_jumpterminal.rows = [];
				g_obj.a_task_jumpterminal.count = 0;
				g_obj.a_task_coretoterminal = {};
				g_obj.a_task_coretoterminal.rows = [];
				g_obj.a_task_coretoterminal.count = 0;
				g_obj.a_task_coretocore = {};
				g_obj.a_task_coretocore.rows = [];
				g_obj.a_task_coretocore.count = 0;
				
				$("#a_info").empty(); 


				var dialog = $( "#dialog-message" ).removeClass('hide').dialog({
					modal: true,
					width: 900,
					height: 700,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加任务工单</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								var workorder = '';
								workorder += 'order_no=' + $('#a_order_no').val();
								workorder += '&title=' + $('#a_title').val();
								workorder += '&department.id=' + $('#a_department_id').val();
								
								if ($('#a_workorder_receive_id').val() != null && $('#a_workorder_receive_id').val() != '')
								{
									workorder += '&receive_operators.id=' + $('#a_workorder_receive_id').val();
								}
								workorder += '&type=' + $('#a_order_type').val(),
								workorder += '&remarks=' + $('#a_remarks').val();
								workorder += '&respect_starttime=' + $('#a_respect_starttime').val();
								workorder += '&respect_endtime=' + $('#a_respect_endtime').val();

								if ($('#a_order_type').val() != 3)
								{
									var content = '';
									if (g_obj.a_task_jumpterminal.rows.length > 0)
									{	
										for (var i = 0; i < g_obj.a_task_jumpterminal.rows.length; i ++)
										{
											if (g_obj.a_task_jumpterminal.rows[i].type == 1)//如果是跳纤
											{
												var tempone = g_obj.a_task_jumpterminal.rows[i].one.id.substring(g_obj.a_task_jumpterminal.rows[i].one.id.lastIndexOf('_') + 1, g_obj.a_task_jumpterminal.rows[i].one.id.length);
												var tempanother = g_obj.a_task_jumpterminal.rows[i].another.id.substring(g_obj.a_task_jumpterminal.rows[i].another.id.lastIndexOf('_') + 1, g_obj.a_task_jumpterminal.rows[i].another.id.length);
												workorder += '&ops[' + i + '].order_type=' + 2;
												workorder += '&ops[' + i + '].boxinfo.id=' + g_obj.a_task_jumpterminal.rows[i].boxid;
												workorder += '&ops[' + i + '].a_terminal_id=' + tempone;
												workorder += '&ops[' + i + '].z_terminal_id=' + tempanother;
												workorder += '&ops[' + i + '].operate_type=' + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? 1 : 2);
												workorder += '&ops[' + i + '].sequence=' + (i + 1);
												content +=  (i + 1) + '>端子：' + g_obj.a_task_jumpterminal.rows[i].one.name + '与端子：' + g_obj.a_task_jumpterminal.rows[i].another.name + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? '跳纤' : '解除跳纤') + '；';
												content += '</br>';
											}
											else if (g_obj.a_task_jumpterminal.rows[i].type == 2) //成端
											{
												workorder += '&ops[' + i + '].order_type=' + 1;
												workorder += '&ops[' + i + '].boxinfo.id=' + g_obj.a_task_jumpterminal.rows[i].boxid;
												workorder += '&ops[' + i + '].core_id=' + g_obj.a_task_jumpterminal.rows[i].one.id;
												workorder += '&ops[' + i + '].terminal_id=' + g_obj.a_task_jumpterminal.rows[i].another.id;
												workorder += '&ops[' + i + '].operate_type=' + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? 1 : 2);
												workorder += '&ops[' + i + '].sequence=' + (i + 1);
												content += (i + 1) + '>纤芯：' + g_obj.a_task_jumpterminal.rows[i].one.name + '与端子：' + g_obj.a_task_jumpterminal.rows[i].another.name + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? '成端' : '解除成端') + '；';
												content += '</br>';
											}
											else if (g_obj.a_task_jumpterminal.rows[i].type == 3) //直熔
											{
												workorder += '&ops[' + i + '].order_type=' + 3;
												workorder += '&ops[' + i + '].boxinfo.id=' + g_obj.a_task_jumpterminal.rows[i].boxid;
												workorder += '&ops[' + i + '].a_core_id=' + g_obj.a_task_jumpterminal.rows[i].one.id;
												workorder += '&ops[' + i + '].z_core_id=' + g_obj.a_task_jumpterminal.rows[i].another.id;
												workorder += '&ops[' + i + '].operate_type=' + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? 1 : 2);
												workorder += '&ops[' + i + '].sequence=' + (i + 1);
												content += (i + 1) + '>纤芯：' + g_obj.a_task_jumpterminal.rows[i].one.name + '与纤芯：' + g_obj.a_task_jumpterminal.rows[i].another.name + (g_obj.a_task_jumpterminal.rows[i].isAdd == 1 ? '直熔' : '解除直熔') + '；';
												content += '</br>';
											}
										}
										workorder += '&content=' + content;
									}	
								}
								$.ajax( {
									type : "post",
									url : "boxinfo.do?method=addWorkorder",
									data: workorder,
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											$('#add_statekey_mark_div').show();
											$('#add_statekey_mark_label').html('添加工单成功！');
											mySetTimeOut('add_statekey_mark_div', 4000);
											$('#grid-table').trigger("reloadGrid");
										}
										else
										{
											$('#add_statekey_mark_div').show();
											$('#add_statekey_mark_label').html('添加工单失败，请重试！');
											mySetTimeOut('add_statekey_mark_div', 4000);
										}
										$( "#dialog-message" ).dialog( "close" ); 
									},
									error : function() {
										$('#add_statekey_mark_div').show();
										$('#add_statekey_mark_label').html('添加工单失败，请重试！');
										mySetTimeOut('add_statekey_mark_div', 4000);
										$( "#dialog-message" ).dialog( "close" ); 
									}
								});
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
			del: $('#workorder_delete').val() == 'true' ? true : false,
			delfunc : function () {
				var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('请选择至少一行数据！');
					mySetTimeOut('add_statekey_mark_div', 4000);
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
							url : "boxinfo.do?method=delete",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(ids),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#add_statekey_mark_div').show();
									$('#add_statekey_mark_label').html('删除光交箱成功！');
									mySetTimeOut('add_statekey_mark_div', 4000);
									$('#grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#add_statekey_mark_div').show();
									$('#add_statekey_mark_label').html('删除光交箱失败，请重试！');
									mySetTimeOut('add_statekey_mark_div', 4000);
								}
							},
							error : function() {
								$('#add_statekey_mark_div').show();
								$('#add_statekey_mark_label').html('删除光交箱失败，请重试！');
								mySetTimeOut('add_statekey_mark_div', 4000);
							}
						});
					}
				}
			},
			delicon : 'icon-trash red',
			view: true,
			viewfunc: function () {
				var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('请选择一行数据！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else if (array.length > 1)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('只能选择一行数据！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else
				{
					showDetail(array[0]);
				}
			},
			viewicon : 'icon-zoom-in grey',
			search: true,
			searchfunc: function() {
				detailsearch();
			},
			searchicon : 'icon-search orange',
			refresh: true,
			refreshicon : 'icon-refresh green',
			
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