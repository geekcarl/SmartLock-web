var mp = null;
var boxStatesAndStateValues;
function onbeforeunload_handler(){ 
} 

function onunload_handler(){ 
} 
$(document).ready(function(){

	window.onbeforeunload = onbeforeunload_handler; 
	window.onunload = onunload_handler;
	document.getElementById('box_tabs_content').style.height = document.body.clientHeight - 130 + 'px';
	document.getElementById('department_choose').style.width = document.body.clientWidth - 60 + 'px';
	$('#box_tabs_content').show();
	//初始化地图
	mp = new BMap.Map("map");  
	var point = new BMap.Point(113.429953,30.366991); 
	mp.centerAndZoom(point, 15);
	mp.addEventListener("dragend", function(){    
		 var center = mp.getCenter();    
		 console.log("地图中心点变更为：" + center.lng + ", " + center.lat);    
		});
	onload();
	//初始化地图结束
});
var g_obj = {};
g_obj.rightMenuMouseOver = false;
function rightMenuMouseOver() {
}
function rightMenuMouseOut() {
}

function openorclosedepartment () {
	$('#department_div').toggle();
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

var manage_door_grid_selector = "#manage-door-grid-table";
var manage_door_pager_selector = "#manage-door-grid-pager";
var manage_alarm_grid_selector = "#manage-alarm-grid-table";
var manage_alarm_pager_selector = "#manage-alarm-grid-pager";
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


function viewOpenRecord(cid) {
	var postData = {
			box_id : cid
	};
	$("#manage-door-grid-table").jqGrid('setGridParam',{
        url:'boxeventandwarn.do?method=listBoxEventPageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入
	var dialog = $( "#dialog-view-door-event" ).removeClass('hide').dialog({
		modal: true,
		width: 1000,
		height: 600,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看开关门事件</h4></div>",
		title_html: true,
		buttons: [
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-view-door-event" ).dialog( "close" );
				} 
			}
		]
	});
}

function viewAlertRecord(cid) {
	var postData = {
			box_id : cid
	};
	$("#manage-alarm-grid-table").jqGrid('setGridParam',{
        url:'boxeventandwarn.do?method=listAlarmEventPageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入
	var dialog = $( "#dialog-view-alarm-event" ).removeClass('hide').dialog({
		modal: true,
		width: 1000,
		height: 600,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看告警事件</h4></div>",
		title_html: true,
		buttons: [
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-view-alarm-event" ).dialog( "close" );
				} 
			}
		]
	});
}


//删除开关门信息
function delete_door()
{
	var array = $('#manage-door-grid-table').jqGrid('getGridParam','selarrrow');
	if (array.length <= 0)
	{
		$('#manage_door_event').show();
		$('#manage_door_event_label').html('请选择一行数据！');
		mySetTimeOut('manage_door_event', 4000);
	}
	else
	{
		if (confirm('删除了无法恢复，确定要删除该记录吗？'))
		{
			var alarms = '';
			for (var i = 0; i < array.length; i ++)
			{
				var data = $('#manage-door-grid-table').jqGrid('getRowData', array[i]);
				alarms += 'de[' + i + '].id=' + data.id + '&';
			}
			alarms = alarms.substring(0, alarms.length - 1);
			$.ajax( {
				type : "post",
				url : "boxeventandwarn.do?method=deleteDoorEventPageByAjax",
				data: alarms,
				success : function(data) {
					isOvertime(data.resultMark);
					if (data.resultMark == 1)
					{
						$('#manage_door_event').show();
						$('#manage_door_event_label').html('删除开关门记录成功！');
						mySetTimeOut('manage_door_event', 4000);
						$('#manage-door-grid-table').trigger("reloadGrid");
					}
					else
					{
						$('#manage_door_event').show();
						$('#manage_door_event_label').html('删除开关门记录失败，请重试！');
						mySetTimeOut('manage_door_event', 4000);
					}
				},
				error : function() {
					$('#manage_door_event').show();
					$('#manage_door_event_label').html('删除开关门记录失败，请重试！');
					mySetTimeOut('manage_door_event', 4000);
				}
			});
		}
	}
}

//删除告警信息
function delete_alarm()
{
	var array = $('#manage-alarm-grid-table').jqGrid('getGridParam','selarrrow');
	if (array.length <= 0)
	{
		$('#manage_alarm_event').show();
		$('#manage_alarm_event_label').html('请选择一行数据！');
		mySetTimeOut('manage_alarm_event', 4000);
	}
	else
	{
		if (confirm('删除了无法恢复，确定要删除该记录吗？'))
		{
			var alarms = '';
			for (var i = 0; i < array.length; i ++)
			{
				var data = $('#manage-alarm-grid-table').jqGrid('getRowData', array[i]);
				alarms += 'ae[' + i + '].id=' + data.id + '&';
			}
			alarms = alarms.substring(0, alarms.length - 1);
			$.ajax( {
				type : "post",
				url : "boxeventandwarn.do?method=deleteAlarmEventPageByAjax",
				data: alarms,
				success : function(data) {
					isOvertime(data.resultMark);
					if (data.resultMark == 1)
					{
						$('#manage_alarm_event').show();
						$('#manage_alarm_event_label').html('删除告警记录成功！');
						mySetTimeOut('manage_alarm_event', 4000);
						$('#manage-alarm-grid-table').trigger("reloadGrid");
					}
					else
					{
						$('#manage_alarm_event').show();
						$('#manage_alarm_event_label').html('删除告警记录失败，请重试！');
						mySetTimeOut('manage_alarm_event', 4000);
					}
				},
				error : function() {
					$('#manage_alarm_event').show();
					$('#manage_alarm_event_label').html('删除告警记录失败，请重试！');
					mySetTimeOut('manage_alarm_event', 4000);
				}
			});
		}
	}
}

jQuery(function($) {
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=getAllBoxesAndStates",
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null)
			{
				boxStatesAndStateValues = data;
				var boxs = [];
				var width = (document.body.clientWidth - 160) / 3;
				var th_html = '<div id="div_1" style="width:' + width + 'px; height:auto; margin-left:30px; margin-top:30px; float:left;"></div>';
				th_html += '<div id="div_2" style="width:' + width + 'px; height:auto; margin-left:30px; margin-top:30px; float:left;"></div>';
				th_html += '<div id="div_3" style="width:' + width + 'px; height:auto; margin-left:30px; margin-top:30px; float:left;"></div>';
				$('#th').html(th_html);
				for (var i = 0; i < data.bis.length; i ++)
				{
					var box = {};
					box.boxSN = '' + data.bis[i].id;
					box.controller_id = '' + data.bis[i].controller_id;
					box.longitude = '' + data.bis[i].b_longitude;
					box.latitude = '' + data.bis[i].b_latitude;
					box.boxNO = '' + data.bis[i].box_no;
					box.boxCode = '' + data.bis[i].k_code;
					box.boxAddr = '' + data.bis[i].address;
					box.depart = '' + data.bis[i].dep_name;
					box.last_heard = '' + data.bis[i].last_heard;
					box.dbm = '' + data.bis[i].dbm;
					var boxStates = [];
					for (var j = 0; j < data.bss.length; j ++)
					{
						if (data.bis[i].id == data.bss[j].id)
						{
							var boxState = {};
							boxState.key = data.bss[j].key;
							boxState.value = data.bss[j].value;
							boxStates.push(boxState);
						}Date
					}
					box.boxStates = boxStates;
					var key = 'images/box_default.png';
					for (var j = 0; j < data.bss.length; j ++)
					{
						if (data.bis[i].id == data.bss[j].id)
						{
							key = data.bss[j].state_image;
							break;	
						}
					}
					box.image = '' + key;
					
				
					var url = box.image == 'images/box_default.png' ? 'images/box_default.png' : ('../' + box.image);
					var sContent = "<div class='mytable' style='margin-top:30px; width:100%; height:auto;'><table style='background-color:#efefef; width:100%; font-size:12px;'><tr><td rowspan=100 style='text-align:center; width:40px'><img width='50' src='"
							+ url
							+ "'/></td><td>光交箱编号</td><td>"
							+ box.boxNO
							+ "</td></tr><tr><td>控制器号</td><td>"
							+ box.controller_id
							+ "</td></tr><tr><td>光交箱位置</td><td>"
							+ box.boxAddr
							+ "</td></tr><tr><td>所属单位</td><td>"
							+ box.depart
							+ "</td></tr><tr><td>最后通信时间</td><td>"
					        + box.last_heard
							+ "</td></tr>";
					for (var j = 0; j < box.boxStates.length; j ++)
					{
							sContent += "<tr><td>" + box.boxStates[j].key + "</td><td>"+ box.boxStates[j].value+ "</td></tr>";
					}
					if (box.dbm == 0)
					{
						sContent += "<tr><td>信号</td><td>未检测到信号</td></tr>";
					}
					else
					{
						var level = 0;
						if (box.dbm >= -113 && box.dbm < -101)
						{
							level = 0;
						}
						else if (box.dbm >= -101 && box.dbm < -89)
						{
							level = 1;
						}
						else if (box.dbm >= -89 && box.dbm < -77)
						{
							level = 2;
						}
						else if (box.dbm >= -77 && box.dbm < -65)
						{
							level = 3;
						}
						else if (box.dbm >= -65 && box.dbm <= -51)
						{
							level = 4;
						}
						sContent += "<tr><td>信号</td><td><img width=30 src='" + signals[level] + "'/></td></tr>";
					}
					sContent += "</table>"
							+ "<div align='center' class='query'>" 
							+ ($('#boxevent_list').val() == 'true' ? "<a href='javascript:void(0);' onclick='viewOpenRecord(\"" + box.boxSN + "\")'>查看开关记录</a> " : "")
							+ ($('#boxwarn_list').val() == 'true' ?  "<a href='javascript:void(0);' onclick='viewAlertRecord(\"" + box.boxSN + "\")'>查看告警记录 </a>" : "")
							+ "</div></div>";
					
					if (i % 3 == 0) $('#div_1').append(sContent);
					else if (i % 3 == 1) $('#div_2').append(sContent);
					else if (i % 3 == 2) $('#div_3').append(sContent);
					boxs.push(box);
				}
				var boxsObj = {};
				boxsObj.markers = boxs;
				addMarker(boxsObj);
				//addMarkerNew(boxsObj);
				var box_value_all = [];
				var box_count = [];
				for (var i = 0; i < data.bss.length; i ++)
				{
					var j;
					for (j = 0; j < box_value_all.length; j ++)
					{
						if (data.bss[i].value == box_value_all[j])
						{
							box_count[j] ++;
							break;
						}
					}
					if (j >= box_value_all.length)
					{
						box_value_all.push(data.bss[i].value);
						box_count.push(1);
					}
				}
				//var html = "<marquee onMouseOut='this.start()' onMouseOver='this.stop()' scrollamount='5' scrolldelay='100'>";
				var html = "";
				html += '光交箱总数：' + data.bis.length + (data.bis.length > 0 ? ', &nbsp;' : '');
				for (var i = 0; i < box_value_all.length; i ++)
				{
					html += box_value_all[i] + ':<a href="javascript:void(0);" onclick="selectValue(\'' + box_value_all[i] + '\')">' + box_count[i] + '</a>&nbsp;&nbsp;';	
				}
				//html += '</marquee>';
				html += '';
				$('#tab-marquee').html(html);
			}
			else
			{
				alert("加载光交箱失败,请重试");
			}
		},
		error : function() {
			alert("加载光交箱失败,请重试");
		}
	});

	//绑定开关门列表
	jQuery(manage_door_grid_selector).jqGrid({
		// direction: "rtl",
		url: 'boxeventandwarn.do?method=listBoxEventPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID', '开门时间', '开门钥匙', '开门人员', '开门RFID', '关门时间', '关门钥匙', '关门人员', '关门RFID', '备注'],
		colModel:[
			{name:'id',index:'id', hidden:true, width:100},
			{name:'open_time',index:'open_time', width:150, formatter:function(cellvalue, options, rowObject){
					return rowObject.open_time == null ? "─────" : new Date(rowObject.open_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'open_keys',index:'open_keys', width:100},
			{name:'open_operators',index:'open_operators', width:100},
			{name:'open_rfids',index:'open_rfids', width:100},
			{name:'close_time',index:'close_time', width:150, formatter:function(cellvalue, options, rowObject){
					return rowObject.close_time == null ? "─────" : new Date(rowObject.close_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'close_keys',index:'close_keys', width:100},
			{name:'close_operators',index:'close_operators', width:100},
			{name:'close_rfids',index:'close_rfids', width:70},
			{name:'remarks',index:'remarks', hidden: true},
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : manage_door_pager_selector,
		altRows: true,
		// toppager: true,
		ondblClickRow: function(rowid, irow, icol, e) {
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
	
	jQuery(manage_door_grid_selector).jqGrid('setGridWidth', 900, true);

	// 绑定开关门列表分页
	jQuery(manage_door_grid_selector).jqGrid('navGrid', manage_door_pager_selector,
		{ 	// navbar options
			edit: false,
			editicon : 'icon-pencil blue',
			add: false,
			addicon : 'icon-plus-sign purple',
			del: $('#boxevent_delete').val() == 'true' ? true : false,
			delfunc : function () {
				delete_door();
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
	
	//绑定告警列表
	jQuery(manage_alarm_grid_selector).jqGrid({
		// direction: "rtl",
		url: 'boxeventandwarn.do?method=listAlarmEventPageByAjax',
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID', '控制器ID', '光交箱地址', '所属部门', '告警类型', '告警时间', '告警钥匙', '告警人员', '告警RFID', '是否已确认', '确认时间', '确认用户名', '备注'],
		colModel:[
		    {name:'id', index:'id', hidden:true},
			{name:'controller_id',index:'controller_id', width:80},
			{name:'address',index:'address', width:80},
			{name:'department',index:'department', width:80},
			{name:'alarm_type',index:'alarm_type', width:80},
			{name:'alarm_time',index:'alarm_time', width:80, formatter:function(cellvalue, options, rowObject){
					return rowObject.alarm_time == null ? "─────" : new Date(rowObject.alarm_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'alarm_keys',index:'alarm_keys', width:80},
			{name:'alarm_operators',index:'alarm_operators', width:80},
			{name:'alarm_rfids',index:'alarm_rfids', width:80},
			{name:'is_affirmed',index:'is_affirmed', width:80, formatter:function(cellvalue, options, rowObject){
					return rowObject.is_affirmed == 0 ? "未确认" : "已确认";
				}
			},
			{name:'affirm_time',index:'affirm_time', width:80, formatter:function(cellvalue, options, rowObject){
					return rowObject.affirm_time == null ? "─────" : new Date(rowObject.affirm_time).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			{name:'affirm_user',index:'affirm_user', width:80},
			{name:'remarks',index:'remarks', hidden: true},
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : manage_alarm_pager_selector,
		altRows: true,
		// toppager: true,
		ondblClickRow: function(rowid, irow, icol, e) {
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
	

	jQuery(manage_alarm_grid_selector).jqGrid('setGridWidth', 900, true);

	// 绑定告警列表分页
	jQuery(manage_alarm_grid_selector).jqGrid('navGrid', manage_alarm_pager_selector,
		{ 	// navbar options
			edit: false,
			add: false,
			del: $('#boxwarn_delete').val() == 'true' ? true : false,
			delfunc : function () {
				delete_alarm();
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
	
	
});