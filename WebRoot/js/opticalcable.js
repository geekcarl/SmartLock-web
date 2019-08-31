$(document).ready(function(){
});
var g_obj = {};
g_obj.rightMenuMouseOver = false;
g_obj.rightClickNode = null;
g_obj.rightClickPos = null;

function rightMenuMouseOver() {
}

function rightMenuMouseOut() {
}

function showCores() {
	$('#rightclick_contextmenu').hide();
	var dialog = $( "#dialog-core" ).removeClass('hide').dialog({
		modal: true,
		width: 750,
		height: 600,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>纤芯列表(" + g_obj.rightClickNode.name + ")</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-core" ).dialog( "close" );
				}
			}
		]
	});
	var postData = {id : g_obj.rightClickNode.id};
	$("#manage-core-grid-table").jqGrid('setGridParam',{
        url:'opticalcable.do?method=listCorePageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入
}

//快速检索
function fastsearch() {
	var start_box = $('#f_s_start_box').val();
	var end_box = $('#f_s_end_box').val();
	if (start_box != '' || end_box != '')
	{
		$("#grid-table").jqGrid('setGridParam',{ 
            postData:null, //发送搜索条件 
        });
		var postData = {};
		if (start_box != '')
		{
			postData.startBoxName = start_box;
		}
		if (end_box != '')
		{
			postData.endBoxName = end_box;
		}
		$("#grid-table").jqGrid('setGridParam',{ 
            url:'opticalcable.do?method=listPageByAjax',//你的搜索程序地址 
            postData:postData, //发送搜索条件 
            page:1 
        }).trigger("reloadGrid"); //重新载入
	}
}

function detailsearch()
{
	var dialog = $( "#dialog-message-search" ).removeClass('hide').dialog({
		modal: true,
		width: 1000,
		height: 400,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>检索电缆</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					var postData = {};
					$("#grid-table").jqGrid('setGridParam',{ 
			            postData:null, //发送搜索条件 
			        });
					if ($('#s_startAddress').val() != '')
					{
						postData.startAddress = $('#s_startAddress').val(); 
					}
					if ($('#s_start_box').val() != '')
					{
						postData.startBoxName = $('#s_start_box').val(); 
					}
					if ($('#s_endAddress').val() != '')
					{
						postData.endAddress = $('#s_endAddress').val(); 
					}
					if ($('#s_end_box').val() != '')
					{
						postData.endBoxName = $('#s_end_box').val(); 
					}
					if ($('#s_type').val() != '')
					{
						postData.type = $('#s_type').val(); 
					}
					$("#grid-table").jqGrid('setGridParam',{
				        url:'opticalcable.do?method=listPageByAjax',//你的搜索程序地址 
				        postData:postData, //发送搜索条件 
				        page:1 
				    }).trigger("reloadGrid"); //重新载入
					$( "#dialog-message-search" ).dialog( "close" );
				}
			}
		]
	});
}

function resetsearch()
{
	$('#s_form')[0].reset();
	$("#grid-table").jqGrid('setGridParam',{ 
        postData:null, //发送搜索条件 
    });
	var postData = {
			rows : 10,
			page : 1
	};
	$("#grid-table").jqGrid('setGridParam',{ 
        url:'opticalcable.do?method=listPageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入
}


//显示选择光交箱窗口
function chooseBox(name, id) {
	g_obj.chooseBox = {name : name, id : id};

	if (g_obj.box_dialog == null)
	{
		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=listDepartmentBoxTree",
			success : function(data) {
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

//取消光交箱的选择
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

function showDetail(id) {
	$('#rightclick_contextmenu').hide();
	if (id == null || id === undefined)
	{
		id = g_obj.rightClickNode.id;
	}
	$.ajax( {
		type : "post",
		url : "opticalcable.do?method=viewOpticalcable",
		data: "id=" + id,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)	
			{
				$('#view_name').html(data.object.name);
				var value = '';
				if (data.object.start_box != null && data.object.start_box != '') value = data.object.start_box;
				else if (data.object.startAddress != null && data.object.startAddress != '') value = data.object.startAddress;
				$('#view_start').html(value);
				value = '';
				if (data.object.end_box != null && data.object.end_box != '') value = data.object.end_box;
				else if (data.object.endAddress != null && data.object.endAddress != '') value = data.object.endAddress;
				$('#view_end').html(value);
				$('#view_coreCounts').html(data.object.coreCounts);
				$('#view_coreUsed').html(data.object.usedCounts);
				$('#view_rate').html(Math.floor(parseFloat(data.object.usedPercent) * 100) + '%');
				$('#view_type').html(data.object.type);
				$('#view_remarks').html(data.object.remarks);
				var dialog = $( "#dialog-view" ).removeClass('hide').dialog({
					modal: true,
					width: 900,
					height: 350,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>光缆预览(" + data.object.name + ")</h4></div>",
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
				$('#manage_warn').show();
				$('#manage_warn_label').html('查看光缆失败，请重试！');
				mySetTimeOut('manage_warn', 4000);
			}
		},
		error : function() {
			$('#manage_warn').show();
			$('#manage_warn_label').html('查看光缆失败， 请重试！');
			mySetTimeOut('manage_warn', 4000);
		}
	});
}

//操作表格结束

jQuery(function($) {
	
	var grid_selector = "#grid-table";
	var pager_selector = "#grid-pager";
	var core_grid_selector = "#manage-core-grid-table";
	var core_pager_selector = "#manage-core-grid-pager";
	//override dialog's title function to allow for HTML titles
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));

	//验证光缆添加
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
			a_coreCounts: {
				required: true,
				digits: true
		 	},
		 	a_type: {
		 		required: true
		 	}
         }, 
         messages:{ //定义提示信息 
        	a_coreCounts: {
        	 	required: '纤芯数量不能为空！',
        	 	digits: '必须为整数'
		 	},
		 	a_type: {
		 		required: '光缆类型不能为空！'
		 	}
         }
    });
	
	//验证光缆添加
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
		 	a_type: {
		 		required: true
		 	}
         }, 
         messages:{ //定义提示信息 
		 	a_type: {
		 		required: '光缆类型不能为空！'
		 	}
         }
    });
	

	jQuery(grid_selector).jqGrid({
		//direction: "rtl",
		url: 'opticalcable.do?method=listPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID', '光缆段名称', '起始交接点编号', '终点交接点编号', '纤芯数', /*'占用纤芯数', '纤芯占用比例',*/ '类型', '备注'],
		colModel:[
			{name:'id',index:'id', width:60, sorttype:"int", hidden: true},
			{name:'name',index:'name', width:90},
			{name:'start_box',index:'startBoxName', width:120, formatter:function(cellvalue, options, rowObject){
					var value = '';
					if (rowObject.start_box != null && rowObject.start_box != '') value = rowObject.start_box;
					else if (rowObject.startAddress != null && rowObject.startAddress != '') value = rowObject.startAddress;
					return value;
				}
			},
			{name:'end_box',index:'endBoxName', formatter:function(cellvalue, options, rowObject){
					var value = '';
					if (rowObject.end_box != null && rowObject.end_box != '') value = rowObject.end_box;
					else if (rowObject.endAddress != null && rowObject.endAddress != '') value = rowObject.endAddress;
					return value;
				}
			},
			{name:'coreCounts',index:'coreCounts', width:120},
			/*{name:'usedCounts',index:'usedCounts', width:120},
			{name:'usedPercent',index:'usedPercent', width:120, formatter:function(cellvalue, options, rowObject){
					var value = '';
					value = '' + Math.floor(parseFloat(rowObject.usedPercent) * 100);
					return value + '%';
				}
			},*/
			{name:'type', index:'type', width:120},
			{name:'remarks', index:'remarks', width:120}
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : pager_selector,
		altRows: true,
		//toppager: true,
		ondblClickRow: function() {
			var table = this;
		},
		onRightClickRow: function(rowid,irow,icol,e) {
			g_obj.rightClickPos = {
					pageX : e.pageX,
					pageY : e.pageY
			};
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
			g_obj.rightClickNode = $('#grid-table').jqGrid('getRowData',rowid);
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
	g_obj.opticalcablegrid = jQuery(grid_selector).jqGrid('navGrid',pager_selector,
		{ 	//navbar options
			edit: $('#opticalcable_update').val() == 'true' ? true : false,
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
						url : "opticalcable.do?method=findOpticalcableByAjax",
						data : "id=" + array[0],
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$('#u_id').val(data.object.id);
								$('#u_startAddress').val(data.object.startAddress);
								if (data.object.start_box != null)
								{
									$('#u_start_box_id').val(data.object.start_box.id);
									$('#u_start_box').val(data.object.start_box.box_no);
								}
								$('#u_endAddress').val(data.object.endAddress);
								if (data.object.end_box != null)
								{
									$('#u_end_box_id').val(data.object.end_box.id);
									$('#u_end_box').val(data.object.end_box.box_no);
								}
								$('#u_coreCounts').val(data.object.coreCounts);
								$('#u_type').val(data.object.type);
								$('#u_remarks').val(data.object.remarks);
								var dialog = $( "#dialog-message-update" ).removeClass('hide').dialog({
									modal: true,
									width: 900,
									height: 500,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改光缆</h4></div>",
									title_html: true,
									buttons: [ 
										{
											text: "确定",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												var startAddress = $('#u_startAddress').val();
												var endAddress = $('#u_endAddress').val();
												var startBox = $('#u_start_box').val();
												var endBox = $('#u_end_box').val();
												if ($('#u_form').valid() && (startAddress != '' || startBox != '') && (endAddress != '' || endBox != '') && (startAddress == '' || startBox == '') && (endAddress == '' || endBox == '') && ! (startBox != '' && endBox != '' && startBox == endBox))
												{
													var boxInfo = '';
													boxInfo += '&id=' + $('#u_id').val();
													if (startAddress != '')
													{
														boxInfo += '&startAddress=' + $('#u_startAddress').val();										
													}
													else
													{
														boxInfo += '&start_box.id=' + $('#u_start_box_id').val();
														boxInfo += '&start_box.box_no=' + $('#u_start_box').val();
													}
													if (endAddress != '')
													{
														boxInfo += '&endAddress=' + $('#u_endAddress').val();										
													}
													else
													{
														boxInfo += '&end_box.id=' + $('#u_end_box_id').val();
														boxInfo += '&end_box.box_no=' + $('#u_end_box').val();
													}
													boxInfo += '&coreCounts=' + $('#u_coreCounts').val();
													boxInfo += '&type=' + $('#u_type').val();
													boxInfo += '&remarks=' + $('#u_remarks').val();
													$.ajax( {
														type : "post",
														url : "opticalcable.do?method=updateOpticalcableByAjax",
														data: boxInfo,
														success : function(data) {
															isOvertime(data.resultMark);
															if (data.resultMark == 1)
															{
																$('#manage_warn').show();
																$('#manage_warn_label').html('修改光缆成功！');
																mySetTimeOut('manage_warn', 4000);
																$('#grid-table').trigger("reloadGrid");
															}
															else
															{
																$('#manage_warn').show();
																$('#manage_warn_label').html('修改光缆失败！');
																mySetTimeOut('manage_warn', 4000);
															}
															$( "#dialog-message-update" ).dialog( "close" ); 
														},
														error : function() {
															$('#manage_warn').show();
															$('#manage_warn_label').html('修改光缆失败！');
															mySetTimeOut('manage_warn', 4000);
															$( "#dialog-message-update" ).dialog( "close" ); 
														}
													});
												}
												else
												{
													if ((startAddress == '' && startBox == '') || (endAddress == '' && endBox == '') || (startAddress != '' && startBox != '') || (endAddress != '' && endBox != '') || (startBox != '' && endBox != '' && startBox == endBox))
													{
														alert('起始类型和终止类型必须只能二选一,且不能相同！');
													}
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
			add: $('#opticalcable_add').val() == 'true' ? true : false,
			addfunc: function(){
				var dialog = $( "#dialog-message" ).removeClass('hide').dialog({
					modal: true,
					width: 900,
					height: 500,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加光缆</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								var startAddress = $('#a_startAddress').val();
								var endAddress = $('#a_endAddress').val();
								var startBox = $('#a_start_box').val();
								var endBox = $('#a_end_box').val();
								if ($('#a_form').valid() && (startAddress != '' || startBox != '') && (endAddress != '' || endBox != '') && (startAddress == '' || startBox == '') && (endAddress == '' || endBox == '') && ! (startBox != '' && endBox != '' && startBox == endBox))
								{
									var boxInfo = '';
									if (startAddress != '')
									{
										boxInfo += '&startAddress=' + $('#a_startAddress').val();										
									}
									else
									{
										boxInfo += '&start_box.id=' + $('#a_start_box_id').val();
										boxInfo += '&start_box.box_no=' + $('#a_start_box').val();
									}
									if (endAddress != '')
									{
										boxInfo += '&endAddress=' + $('#a_endAddress').val();										
									}
									else
									{
										boxInfo += '&end_box.id=' + $('#a_end_box_id').val();
										boxInfo += '&end_box.box_no=' + $('#a_end_box').val();
									}
									boxInfo += '&coreCounts=' + $('#a_coreCounts').val();
									boxInfo += '&type=' + $('#a_type').val();
									boxInfo += '&remarks=' + $('#a_remarks').val();
									$.ajax( {
										type : "post",
										url : "opticalcable.do?method=add",
										data: boxInfo,
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#manage_warn').show();
												$('#manage_warn_label').html('添加光缆成功！');
												mySetTimeOut('manage_warn', 4000);
												g_obj.a_form_validator.resetForm();
												$('#grid-table').trigger("reloadGrid");
											}
											else
											{
												$('#manage_warn').show();
												$('#manage_warn_label').html('添加光缆失败！');
												mySetTimeOut('manage_warn', 4000);
											}
											$( "#dialog-message" ).dialog( "close" ); 
										},
										error : function() {
											$('#manage_warn').show();
											$('#manage_warn_label').html('添加光缆失败！');
											mySetTimeOut('manage_warn', 4000);
											$( "#dialog-message" ).dialog( "close" ); 
										}
									});
								}
								else
								{
									if ((startAddress == '' && startBox == '') || (endAddress == '' && endBox == '') || (startAddress != '' && startBox != '') || (endAddress != '' && endBox != '') || (startBox != '' && endBox != '' && startBox == endBox))
									{
										alert('起始类型和终止类型必须只能二选一，且不能相同！');
									}
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
			del: $('#opticalcable_delete').val() == 'true' ? true : false,
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
							ids.push(data.id);
						}
						$.ajax( {
							type : "post",
							url : "opticalcable.do?method=delete",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(ids),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#manage_warn').show();
									$('#manage_warn_label').html('删除光缆成功！');
									mySetTimeOut('manage_warn', 4000);
									$('#grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#manage_warn').show();
									$('#manage_warn_label').html('删除光缆失败，请确保要删除光缆的纤芯处于空闲状态！');
									mySetTimeOut('manage_warn', 4000);
								}
							},
							error : function() {
								$('#manage_warn').show();
								$('#manage_warn_label').html('删除光缆失败，请重试！');
								mySetTimeOut('manage_warn', 4000);
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
			view: $('#opticalcable_view').val() == 'true' ? true : false,
			viewfunc : function () {
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
					showDetail(array[0]);
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
	);
	if ($('#opticalcable_export').val() == 'true')
	{
		g_obj.opticalcablegrid.navButtonAdd(pager_selector,{
	    	caption: '',
	    	title: '导出',
	        buttonicon:"icon-download",    //按钮icon
	        onClickButton: function(){    //执行操作
	          if (confirm('确定要导出纤芯分析吗？'))
	    	  {
	        	  window.location.target = "_blank";
	        	  window.location.href = "opticalcable.do?method=exportOpticalcable";
	    	  }
	        },    
	        position:"first"  //按钮位置 
	    });
	}
	
	//绑定铅芯列表
	jQuery(core_grid_selector).jqGrid({
		//direction: "rtl",
		url: 'opticalcable.do?method=listCorePageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['名称', '起始端连接状态', '终止端连接状态'],
		colModel:[
			{name:'name',index:'name', sortable:false, width:200, formatter:function(cellvalue, options, rowObject){
					var temp = '';
					if (rowObject.core != null)
					{
						temp = rowObject.core.name;
					}
					return temp;
				}
			},
			{name:'a_type', sortable:false, width:200, formatter:function(cellvalue, options, rowObject){
					var temp = '';
					if (rowObject.a_freezed == 0)
					{
						if (rowObject.a_type == 1)
						{
							temp = "其他设备：" +　(rowObject.a_string != null ? rowObject.a_string : "");
						}
						else if (rowObject.a_type == 2)
						{
							if (g_obj.rightClickNode != null)
							{
								temp = "端子：" + rowObject.a_terminal.name;
							}
						}
						else if (rowObject.a_type == 3)
						{
							temp = "纤芯：" + rowObject.a_core.name;
						}
						else
						{
							temp = '空闲';
						}
					}
					else
					{
						temp = '冻结(任务中)';
					}
					return temp;
				}
			},
			{name:'z_type', sortable:false, width:200, formatter:function(cellvalue, options, rowObject){
					var temp = '';
					if (rowObject.z_freezed == 0)
					{
						if (rowObject.z_type == 1)
						{
							temp = "其他设备：" + (rowObject.z_string != null ? rowObject.z_string : "");
						}
						else if (rowObject.z_type == 2)
						{
							if (g_obj.rightClickNode != null)
							{
								temp = "端子：" + rowObject.z_terminal.name;
							}
						}
						else if (rowObject.z_type == 3)
						{
							temp = "纤芯：" + rowObject.z_core.name;
						}
						else
						{
							temp = '空闲';
						}
					}
					else
					{
						temp = '冻结(任务中)';
					}
					return temp;
				}
			}
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : core_pager_selector,
		altRows: true,
		//toppager: true,
		ondblClickRow: function() {
		},
		onRightClickRow: function(rowid,irow,icol,e) {
		},
		loadComplete: function(xhr) {
			console.log(xhr);
		},
		multiselect: false,

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

	
	//绑定铅芯分页
	jQuery(core_grid_selector).jqGrid('navGrid', core_pager_selector,
		{ 	//navbar options
			edit: false,
			editicon : 'icon-pencil blue',
			add: false,
			addicon : 'icon-plus-sign purple',
			del: false,
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