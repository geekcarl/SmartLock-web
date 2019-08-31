
var boxMarkers = []; // 光交箱标注对象列表，类型为BMap.Marker
var pointCollectionly = []; // 光交箱标注对象列表，类型为BMap.pointCollection
var boxInfos = []; // 光交箱信息列表，包含提示窗要显示的信息，与boxMarkers一一对应
// var boxStates=['正常关门','正常开门','非法关门','非法开门','离线','低电量','振动告警','柜门未关'];
// //光交箱的各种实时状态
var icons = [ 'images/normal.png', 'images/exception.png', 'images/offline.png' ]; // 光交箱状态对应显示的图片
var infoWindow = new BMap.InfoWindow(''); // 创建信息窗口对象
var queryBoxNO;
var g_mapobj = {};
var signals = ['images/signal_1.png', 'images/signal_2.png', 'images/signal_3.png', 'images/signal_4.png', 'images/signal_5.png']; //定义光交箱信息对象
// function BoxInfo(lattitude,longtitude,
// boxNO,boxAddr,openTime,closeTime,alertTime,boxState)
// {
// this.latitude=lattitude;
// this.longtitude=longtitude;
// this.boxNO=boxNO;
// this.boxAddr=boxAddr;
// this.openTime=openTime;
// this.closeTime=closeTime;
// this.alertTime=alertTime;
// this.boxState=boxState;
// }

// function mouseover(obj)
// {
// obj.style.backgroundColor = 'gray';
// obj.style.color = 'white';
// }
// function mouseout(obj)
// {
// obj.style.backgroundColor = '';
// obj.style.color = 'black';
// }

function stringToJson(stringValue) {
	eval("var theJsonValue = " + stringValue);
	return theJsonValue;
}

function onload() {
	mp.enableKeyboard();
	mp.enableScrollWheelZoom();// 启用地图滚轮放大缩小
	mp.enableKeyboard();// 启用键盘上下左右键移动地图
	// 向地图中添加缩放控件
	var ctrl_nav = new BMap.NavigationControl( {
		anchor : BMAP_ANCHOR_TOP_LEFT,
		type : BMAP_NAVIGATION_CONTROL_LARGE
	});
	mp.addControl(ctrl_nav);
	// 向地图中添加缩略图控件
	var ctrl_ove = new BMap.OverviewMapControl( {
		anchor : BMAP_ANCHOR_BOTTOM_RIGHT,
		isOpen : 1
	});
	mp.addControl(ctrl_ove);
	// 向地图中添加比例尺控件
	var ctrl_sca = new BMap.ScaleControl( {
		anchor : BMAP_ANCHOR_BOTTOM_LEFT
	});
	mp.addControl(ctrl_sca);
}

// 添加标记<!= start>
function addMarker(markerArr, showLabel) {
	// 遍历boxMarkers数组，若已存在光交箱，则不处理，否则添加一个光交箱标注
	var isRelocate = 0;
	for ( var i = 0; i < markerArr.markers.length; i++) {
		var boxInfo = markerArr.markers[i];
		if (isRelocate == 0 && boxInfo.longitude != null && boxInfo.latitude != null)
		{
			var point = new BMap.Point(boxInfo.longitude, boxInfo.latitude); // 中心点
			var zoom = mp.getZoom();
			mp.centerAndZoom(point, zoom);
			isRelocate = 1;
		}
		var isExist = false;
		for ( var j = 0; j < boxInfos.length; j++) {
			// 地图上已经存在此光交箱
			if (boxInfos[j].boxSN == boxInfo.boxSN) {
				isExist = true;
				break;
			}
		}
		if (isExist) {

			// 已存在，则忽略
			continue;
		} else {
			// 不存在，则新增一个地图标注
			// 即定位点距离图片左上角的偏移量。如果不给anchor的话，API会自动获取图片中心点作为anchor位置
			
			var url = boxInfo.image == 'images/box_default.png' ? 'images/box_default.png' : ('../' + boxInfo.image);
			var myIcon = new BMap.Icon(url, new BMap.Size(50, 50),
					{
						anchor : new BMap.Size(25, 25)
					});
			// 创建标注对象并添加到地图
			var marker = new BMap.Marker(new BMap.Point(boxInfo.longitude,
					boxInfo.latitude), {
				icon : myIcon
			});
			marker.setTitle(boxInfo.boxNO);
			marker.addEventListener(
							"click",
							function() {// 左击事件
								var sContent = '';
								for ( var i = 0; i < boxInfos.length; i++) {
									if (this.getTitle() == boxInfos[i].boxNO) {
										queryBoxNO = boxInfos[i].boxNO;
										var url = boxInfos[i].image == 'images/box_default.png' ? 'images/box_default.png' : ('../' + boxInfos[i].image);
										sContent = "<div class='mytable'><table style='background-color:#efefef; width:360px; font-size:12px;'><tr><td rowspan=100 style='text-align:center; width:40px'><img width='50' src='"
												+ url
												+ "'/></td><td>光交箱编号</td><td>"
												+ boxInfos[i].boxNO
												+ "</td></tr><tr><td>控制器号</td><td>"
												+ boxInfos[i].controller_id
												+ "</td></tr><tr><td>光交箱位置</td><td>"
												+ boxInfos[i].boxAddr
												+ "</td></tr><tr><td>所属单位</td><td>"
												+ boxInfos[i].depart
												+ "</td></tr><tr><td>最后通信时间</td><td>"
												+ boxInfos[i].last_heard
												+ "</td></tr>";
										for (var j = 0; j < boxInfos[i].boxStates.length; j ++)
										{
												sContent += "<tr><td>" + boxInfos[i].boxStates[j].key + "</td><td>"+ boxInfos[i].boxStates[j].value+ "</td></tr>";
										}
										if (boxInfos[i].dbm == 0)
										{
											sContent += "<tr><td>信号</td><td>未检测到信号</td></tr>";
										}
										else
										{
											var level = 0;
											if (boxInfos[i].dbm >= -113 && boxInfos[i].dbm < -101)
											{
												level = 0;
											}
											else if (boxInfos[i].dbm >= -101 && boxInfos[i].dbm < -89)
											{
												level = 1;
											}
											else if (boxInfos[i].dbm >= -89 && boxInfos[i].dbm < -77)
											{
												level = 2;
											}
											else if (boxInfos[i].dbm >= -77 && boxInfos[i].dbm < -65)
											{
												level = 3;
											}
											else if (boxInfos[i].dbm >= -65 && boxInfos[i].dbm <= -51)
											{
												level = 4;
											}
											sContent += "<tr><td>信号</td><td><img width=30 src='" + signals[level] + "'/></td></tr>";
										}
										sContent += "</table></div>"
												+ "<br /><div align='right' class='query'>"
												+ ($('#boxevent_list').val() == 'true' ? "<a href='javascript:void(0);' onclick='viewOpenRecord(\"" + boxInfos[i].boxSN + "\")'>查看开关记录</a> " : "")
												+ ($('#boxwarn_list').val() == 'true' ? "<a href='javascript:void(0);' onclick='viewAlertRecord(\"" + boxInfos[i].boxSN + "\")'>查看告警记录 </a>" : "")
												+ "</div>";
										break;
									}
								}
								infoWindow.setContent(sContent);
								this.openInfoWindow(infoWindow);
							});
			if (showLabel != null && showLabel == 1)
			{
				marker.setLabel(new BMap.Label(boxInfo.boxNO, {
					offset : new BMap.Size(0, -19)
				}));
			}
			mp.addOverlay(marker);
			boxMarkers.push(marker);
			boxInfos.push(boxInfo);
		}
	}
}




// 海量标记添加标记<!= start>
function addMarkerNew(markerArr, showLabel) {
	// 遍历boxMarkers数组，若已存在光交箱，则不处理，否则添加一个光交箱标注
	var isRelocate = 0;
	var pointsly = []; // 添加海量点数据
	
	for ( var i = 0; i < markerArr.markers.length; i++) {
		var boxInfo = markerArr.markers[i];
		if (isRelocate == 0 && boxInfo.longitude != null && boxInfo.latitude != null)
		{
			var point = new BMap.Point(boxInfo.longitude, boxInfo.latitude); // 中心点
			var zoom = mp.getZoom();
			mp.centerAndZoom(point, zoom);
			isRelocate = 1;
		}

		var isExist = false;
		for ( var j = 0; j < boxInfos.length; j++) {
			// 地图上已经存在此光交箱
			if (boxInfos[j].boxSN == boxInfo.boxSN) {
				isExist = true;
				break;
			}
		}
		if (isExist) {
			// 已存在，则忽略
			continue;
		} else {
			console.log("boxInfo.boxno" + boxInfo.boxNO );
         
          pointsly.push(new BMap.Point(boxInfo.longitude, boxInfo.latitude));

	      boxInfos.push(boxInfo);
		}
	}

	 var options = {
            size:  BMAP_POINT_SIZE_BIG,   //BMAP_POINT_SIZE_BIGGER   BMAP_POINT_SIZE_NORMAL   BMAP_POINT_SIZE_HUGE   
            shape: BMAP_POINT_SHAPE_WATERDROP,         //BMAP_POINT_SHAPE_CIRCLE     BMAP_POINT_SHAPE_STAR  BMAP_POINT_SHAPE_SQUARE
            color: '#d340c3'
        }

   var pointCollection = new BMap.PointCollection(pointsly, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', function (e) {
          alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
        });
    
        pointCollectionly.push(pointCollection);  
       
        mp.addOverlay(pointCollection);  // 添加Overlay
        
}



function selectValue(value) {
	hideMarker();
	//hideMarkerNew();

	var width = (document.body.clientWidth - 160) / 3;
	var th_html = '<div id="div_1" style="width:' + width + 'px; height:auto; margin-left:30px; margin-top:30px; float:left;"></div>';
	th_html += '<div id="div_2" style="width:' + width + 'px; height:auto; margin-left:30px; margin-top:30px; float:left;"></div>';
	th_html += '<div id="div_3" style="width:' + width + 'px; height:auto; margin-left:30px; margin-top:30px; float:left;"></div>';
	$('#th').html(th_html);
	var count = 0;
	console.log("boxInfos.length= "+boxInfos.length);


		var pointsly = []; // 添加海量点数据

	for (var i = 0; i < boxInfos.length; i ++)
	{
		var box = boxInfos[i];
		if (boxInfos[i].boxStates != null && boxInfos[i].boxStates.length > 0)
		{
			for (var j = 0; j < boxInfos[i].boxStates.length; j ++)
			{
				if (boxInfos[i].boxStates[j].value == value) {
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
					for (var k = 0; k < box.boxStates.length; k ++)
					{
							sContent += "<tr><td>" + box.boxStates[k].key + "</td><td>"+ box.boxStates[k].value+ "</td></tr>";
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
					mp.addOverlay(boxMarkers[i]);
				    //pointsly.push(new BMap.Point(box.longitude, box.latitude));
				    	console.log("===22222boxInfo.boxno" + box.longitude );
					count ++;
					if (count == 1) {
						var point = new BMap.Point(box.longitude, box.latitude); // 中心点
						var zoom = mp.getZoom();
						mp.centerAndZoom(point, zoom);
					}
					break;
				}
			}

			
		}
	}

	/*  var options = {
            size:  BMAP_POINT_SIZE_BIG,   //BMAP_POINT_SIZE_BIGGER   BMAP_POINT_SIZE_NORMAL   BMAP_POINT_SIZE_HUGE   
            shape: BMAP_POINT_SHAPE_WATERDROP,         //BMAP_POINT_SHAPE_CIRCLE     BMAP_POINT_SHAPE_STAR  BMAP_POINT_SHAPE_SQUARE
            color: '#d340c3'
        }

   var pointCollection = new BMap.PointCollection(pointsly, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', function (e) {
          alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
        });
    

        mp.addOverlay(pointCollection);  // 添加Overlay */
}

function search () {
	var box_no = $('#box_no').val();
	var controller_id = $('#controller_id').val();
	var reg = new RegExp("^[0-9]*$");
	if (controller_id != '' && ! reg.test(controller_id))
	{
		alert('控制器ID为整数');
		return false;
	}
	if (box_no != '' || controller_id != '')
	{
		var data = '0=0';
		if (box_no != '') data += '&box_no=' + box_no;
		if (controller_id != '') data += '&controller_id=' + controller_id;
		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=listByDepartmentId",
			data: data,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null)
				{
					searchResult(data);
				}
				else
				{
					alert("加载光交箱失败,请重试");
				}
			},
			error : function() {
				alert('加载光交箱失败,请重试');
			}
		});
	}
}

function searchResult(data) {
	var boxs = [];
	var th_html = '';
	var width = (document.body.clientWidth - 160) / 3;
	var th_html = '<div id="div_1" style="width:' + width + 'px; height:auto; margin-left:30px; margin-top:30px; float:left;"></div>';
	th_html += '<div id="div_2" style="width:' + width + 'px; height:auto; margin-left:30px; margin-top:30px; float:left;"></div>';
	th_html += '<div id="div_3" style="width:' + width + 'px; height:auto; margin-left:30px; margin-top:30px; float:left;"></div>';
	$('#th').html(th_html);
	if (data.bis.length > 0)
	{
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
				}
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
					+ ($('#boxwarn_list').val() == 'true' ? "<a href='javascript:void(0);' onclick='viewAlertRecord(\"" + box.boxSN + "\")'>查看告警记录 </a>" : "")
					+ "</div></div>";
			
			if (i % 3 == 0) $('#div_1').append(sContent);
			else if (i % 3 == 1) $('#div_2').append(sContent);
			else if (i % 3 == 2) $('#div_3').append(sContent);
			
			
			boxs.push(box);
		}
		var boxsObj = {};
		boxsObj.markers = boxs;
		clearMarker();
		
		var checked = document.getElementById("showLabel").checked == true ? 1 : 0;
		addMarker(boxsObj, checked);
		var box_value_all = [];
		var box_value_ids = [];
		var box_count = [];
		for (var i = 0; i < data.bss.length; i ++)
		{
			var counter = 0;
			for (var j = 0; j < box_value_all.length; j ++)
			{
				counter ++;
				if (data.bss[i].value == box_value_all[j])
				{
					box_count[j] ++;
					j += 2;			
					break;
				}
			}
			if (j <= counter)
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
		alert('没有检索到光交箱');
	}

}

function showByDepartment(node) {
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=listByDepartmentId",
		data: "id=" + node.id,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null)
			{
				if (data.bis.length > 0)
				{
					$('#department_name').html(node.text);
					searchResult(data);
				}
				else
				{
					alert('没有检索到光交箱');
				}
			}
			else
			{
				alert("加载光交箱失败,请重试");
			}
		},
		error : function() {
			alert('加载光交箱失败,请重试');
		}
	});
}

function labelchanged() {
	var checked = document.getElementById("showLabel").checked;
	if (checked == true)
	{
		showLabel();
	}
	else
	{
		hideLabel();
	}
}

function showLabel()
{
	var temp = [];
	for (var i = 0; i < boxInfos.length; i ++) temp.push(boxInfos[i]);
	clearMarker();
	addMarker({markers : temp}, 1);
}

function hideLabel()
{
	var temp = [];
	for (var i = 0; i < boxInfos.length; i ++) temp.push(boxInfos[i]);
	clearMarker();
	addMarker({markers : temp}, 0);
}

var fireEvent = function(element,event){
    if (document.createEventObject){
        // IE浏览器支持fireEvent方法
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
    }
         else{
        // 其他标准浏览器使用dispatchEvent方法
        var evt = document.createEvent( 'HTMLEvents' );
        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent(event, true, true); 
        return !element.dispatchEvent(evt);
    }
};

function locateBox(id, longt, lati) {
	console.log(longt + '/' + lati);
	$('#box_tabs a:first').tab('show');
	var point = new BMap.Point(longt, lati); // 中心点
	var zoom = mp.getZoom();
	mp.centerAndZoom(point, zoom);
	for (i = 0; i < boxInfos.length; i ++) {
		if (id == boxInfos[i].boxSN) {
			g_mapobj.locateBox = {};
			g_mapobj.locateBox.marker = boxMarkers[i];
			g_mapobj.locateBox.i = i;
		}
	}
}

function removeMarker(markerArr) {
	for ( var j = 0; j < markerArr.markers.length; j++) {
		var boxInfo = markerArr.markers[j];
		var removetitle = boxInfo.boxSN;
		// 注释stitle2.replace(/个/,"");
		var i = 0;
		for (i = 0; i < boxInfos.length; i++) {
			if (removetitle == boxInfos[i].boxSN) {
				mp.removeOverlay(boxMarkers[i]);
				// 删除boxMarkers对应的元素
				boxMarkers.splice(i, 1);
				// 删除boxInfos对应的信息元素
				boxInfos.splice(i, 1);
				break;
			}
		}
	}
}

function updateMarker(markerArr) {
	for ( var j = 0; j < markerArr.markers.length; j++) {
		var boxInfo = markerArr.markers[j];
		var updatetitle = boxInfo.boxSN;
		// 注释stitle2.replace(/个/,"");
		var i = 0;
		for (i = 0; i < boxInfos.length; i++) {
			if (updatetitle == boxInfos[i].boxSN) {
				// 更新光交箱对象信息
				boxInfos[i] = boxInfo;
				// 更新光交箱对应的marker
				boxMarkers[i].setTitle(boxInfo.boxNO);
				boxMarkers[i].getLabel().setContent(boxInfo.boxNO);
				boxMarkers[i].setIcon(new BMap.Icon('../' + boxInfo.image,
						new BMap.Size(50, 50), {
							anchor : new BMap.Size(25, 25)
						}));
				boxMarkers[i].setPosition(new BMap.Point(boxInfo.longitude,
						boxInfo.latitude));
				break;
			}
		}
	}
}

function hideMarker() {
	var i = 0;
	for (i = 0; i < boxMarkers.length; i++) {
		// 清除地图上的光交箱标注
		mp.removeOverlay(boxMarkers[i]);
	}
}

function hideMarkerNew() {
	var i = 0;
	for (i = 0; i < pointCollectionly.length; i++) {
		// 清除地图上的光交箱标注
		mp.removeOverlay(pointCollectionly[i]);
	}
}

function clearMarker() {
	var i = 0;
	for (i = 0; i < boxMarkers.length; i++) {
		// 清除地图上的光交箱标注
		mp.removeOverlay(boxMarkers[i]);
	}
	// 清空光交箱标注数组和光交箱信息数组
	var boxCount = boxInfos.length;
	boxMarkers.splice(0, boxCount);
	boxInfos.splice(0, boxCount);
}

// 添加接口，参数为光交箱对象数组：[{boxSN:0,longitude:0,latitude:0,boxNO:'',boxCode:'',boxAddr:'',depart:'',doorState:'',voltState:'',poseState:'',waterState:'',tempState:'',temperature:'',humidity:'',connState:''},{},{}...{}]
function add(llyy) {
	// 标注点数组
	var markerArr = llyy.replace("\"", "").replace("\"", "");
	markerArr = "{markers :" + markerArr + "}";
	var boxInfo = stringToJson(markerArr);
	addMarker(boxInfo);
}

// function testAdd()
// {
// var
// box="[{boxSN:1,longitude:114.393907785416,latitude:30.50844185611,boxNO:'1234',boxAddr:'武汉市洪山区珞瑜路718号',openTime:'2013-4-9
// 9:19:47',closeTime:'2013-4-9 9:19:47',alertTime:'2013-4-9
// 9:19:47',boxState:0}]";
// add(box);
// }

// 删除接口，参数为光交箱序号数组：[{boxSN:0},{},{},{}...{}]
function remove(llyy) {
	var markerArr = llyy.replace("\"", "").replace("\"", "");
	markerArr = "{markers :" + markerArr + "}";
	var boxInfo = stringToJson(markerArr);
	removeMarker(boxInfo);
}

// 修改接口，参数为光交箱对象数组：[{boxSN:0,longitude:0,latitude:0,boxNO:'',boxCode:'',boxAddr:'',depart:'',doorState:'',voltState:'',poseState:'',waterState:'',tempState:'',temperature:'',humidity:'',connState:''},{},{}...{}]
function update(llyy) {
	var markerArr = llyy.replace("\"", "").replace("\"", "");
	markerArr = "{markers :" + markerArr + "}";
	var boxInfo = stringToJson(markerArr);
	updateMarker(boxInfo);
}

// 清除所有光交箱标注
function clear() {
	clearMarker();
}

// 定位到某个位置，参数为经纬度：{longitude:0,latitude:0}
function goToLocation(llyy) {
	var where = llyy.replace("\"", "").replace("\"", "");
	where = "{where :" + where + "}";
	var addr = stringToJson(where);
	var point = new BMap.Point(addr.where.longitude, addr.where.latitude); // 中心点
	var zoom = mp.getZoom();
	mp.centerAndZoom(point, zoom);
}

function viewOpenRecord(boxNO) {
	window.external.ViewOpenRecord(boxNO);
}

function viewAlertRecord(boxNO) {
	window.external.ViewAlertRecord(boxNO);
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}