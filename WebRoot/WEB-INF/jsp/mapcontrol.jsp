<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>${sessionScope.sysinfo.software_name}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"/>
    	<link rel="stylesheet" href="assets/css/font-awesome.min.css" />
		<link href="assets/css/bootstrap.min.css" rel="stylesheet" />
		

		<!--[if IE 7]>
		  <link rel="stylesheet" href="assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		

		<!-- fonts -->

		<link rel="stylesheet" href="assets/css/jquery-ui-1.10.3.full.min.css" />
		<link rel="stylesheet" href="assets/css/datepicker.css" />
		<link rel="stylesheet" href="assets/css/ui.jqgrid.css" />
		

		<!-- ace styles -->

		<link rel="stylesheet" href="assets/css/ace.min.css" />
		<link rel="stylesheet" href="assets/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="assets/css/ace-skins.min.css" />
		
		<style>
			html, body {
				height: 100%;
				width: 100%;
			}
		</style>
		<!--[if lte IE 8]>
		  <link rel="stylesheet" href="assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- inline styles related to this page -->

		<!-- ace settings handler -->

		<script src="assets/js/ace-extra.min.js"></script>

		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->

		<!--[if lt IE 9]>
		<script src="assets/js/html5shiv.js"></script>
		<script src="assets/js/respond.min.js"></script>
		<![endif]-->
		<script>
			function onKeyDown()
			{
				if ((window.event.ctrlKey)||(window.event.shiftKey))
				{
					event.keyCode=0;
					event.returnValue=false;
				}
			}
		</script>
		
		<script>
			function yxl() { 
				if(window.event.altKey) 
				{
					window.event.returnValue=false;
				}
			}
			function scrollFunc() {
				var e = window.event;
				if (e.button == 0)
				{
					if ($('#rightclick_contextmenu').css('display') == 'block')
					{
						$('#rightclick_contextmenu').hide();
					}
				}
			}
			document.onkeydown=yxl;
			document.onMouseDown=scrollFunc;
		</script> 
	</head>

	<body   oncontextmenu="return false">
		<input type="hidden" value="${sessionScope.user_id }" id="user_id">
		<input type="hidden" value="${boxevent_delete }" id="boxevent_delete">
		<input type="hidden" value="${boxwarn_delete}" id="boxwarn_delete">
		<input type="hidden" value="${boxevent_list }" id="boxevent_list">
		<input type="hidden" value="${boxwarn_list}" id="boxwarn_list">
		<div class="main-container" id="main-container" style="background-color: white">
			
					<div class="breadcrumbs" id="breadcrumbs">
						<script type="text/javascript">
							try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
						</script>

						<ul class="breadcrumb">
							<li>
								<i class="icon-home home-icon"></i>
								<a href="#">首页</a>
							</li>
							<li>
								<a href="#">安全管控</a>
							</li>
							<li class="active">光交箱监控</li>
						</ul>
						<!-- .breadcrumb -->
					</div>
					<div class="page-content" style="position: relative;">
						<div class="tabbable" id="box_tabs">
							<div id="department_div" style="position: absolute; width:350px; display:none; height:850px; top:125px; left:20px; background-color:white; border:1px solid #efefef; z-index: 9999;">
								<div style="position:absolute; right:0px;">
									<button onclick="openorclosedepartment()" class="btn btn-xs btn-success">
										<i class="icon-remove icon-on-right"></i>
									</button>
								</div>
								<div style="padding:10px 50px 20px 50px">
									<ul id="department_tree"></ul>
							    </div>
							</div>
							<div id="department_choose" style="position: absolute; padding-left:20px; padding-top:7px; height:35px; top:90px; background:rgba(243,241,236,0.5); border:1px solid #efefef; z-index: 20;">
								<a href="javascript:void(0);" onclick="openorclosedepartment()"><span id="department_name">全部部门</span>&nbsp;&nbsp;<i class="icon-chevron-down icon-on-right"></i></a>
								是否显示光交箱编号：
								<input type="checkbox" id="showLabel" onchange="labelchanged()"/>&nbsp;&nbsp;
								<input type="text" id="box_no" placeholder="光交箱编号"/>
								<input type="text" id="controller_id" placeholder="控制器ID"/>
								<button onclick="search()" class="btn btn-xs btn-success">
									检索
									<i class="icon-search icon-on-right"></i>
								</button>
							</div>
							<ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="myTab4" style="height:50px !important;">
								<li class="active">
									<a data-toggle="tab" href="#map"><i class="icon-globe bigger-130"></i>地图模式</a>
								</li>

								<li>
									<a data-toggle="tab" href="#th"><i class="icon-th bigger-130"></i>网格模式</a>
								</li>
							</ul>

							<div id="tab-marquee" class="tab-pane" style="width:100%; height:30px;">
							</div>
							<div class="tab-content" id="box_tabs_content" style="display: none; border-right:0px; border-left:0px; border-bottom:0px;">
								<div id="map" class="tab-pane in active" style="width:100%; height:100%;">
								</div>

								<div id="th" class="tab-pane" style="width:100%; height:100%;">
								</div>
							</div>
						</div>
						
					</div><!-- /.page-content -->
		<!-- /.main-container-inner -->
		<a href="#" id="btn-scroll-up"
			class="btn-scroll-up btn btn-sm btn-inverse"> <i
			class="icon-double-angle-up icon-only bigger-110"></i> </a>
		</div>
		<!-- /.main-container -->
		
		<div id="dialog-view-door-event" class="hide">
			 <div style="padding:10px 20px 20px 20px; width:100%; height:auto;">
			 	<div id="manage_door_event" class="alert alert-danger" style="display:none;">
					<i class="icon-hand-right"></i>
					<label id="manage_door_event_label"></label>
					<button class="close" data-dismiss="alert">
						<i class="icon-remove"></i>
					</button>
				</div>
				<table id="manage-door-grid-table" width="100%"></table>

				<div id="manage-door-grid-pager"></div>
			 	
		     </div>
		</div><!-- #dialog-view-door-event -->
		
		
		<div id="dialog-view-alarm-event" class="hide">
			 <div style="padding:10px 20px 20px 20px; width:100%; height:auto;">
			 	<div id="manage_alarm_event" class="alert alert-danger" style="display:none;">
					<i class="icon-hand-right"></i>
					<label id="manage_alarm_event_label"></label>
					<button class="close" data-dismiss="alert">
						<i class="icon-remove"></i>
					</button>
				</div>
				<table id="manage-alarm-grid-table" width="100%"></table>

				<div id="manage-alarm-grid-pager"></div>
			 	
		     </div>
		</div><!-- #dialog-view-alarm-event -->
		
		<!-- basic scripts -->

		<!--[if !IE]> -->

		<script src="assets/js/googleapis-jq-2.0.3.min.js"></script>

		<!-- <![endif]-->

		<!--[if IE]>
		<script src="assets/js/googleapis-jq-1.10.2.min.js"></script>
		<![endif]-->

		<!--[if !IE]> -->

		<script type="text/javascript">
			window.jQuery || document.write("<script src='assets/js/jquery-2.0.3.min.js'>"+"<"+"script>");
		</script>

		<!-- <![endif]-->

		<!--[if IE]>
		<script type="text/javascript">
		 window.jQuery || document.write("<script src='assets/js/jquery-1.10.2.min.js'>"+"<"+"script>");
		</script>
		<![endif]-->

		<script type="text/javascript">
			if("ontouchend" in document) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"script>");
		</script>
		<script src="assets/js/typeahead-bs2.min.js"></script>

		<!-- page specific plugin scripts -->

		<!--[if lte IE 8]>
		  <script src="assets/js/excanvas.min.js"></script>
		<![endif]-->

		<script src="assets/js/jquery-ui-1.10.3.full.min.js"></script>
		<script src="assets/js/jquery.ui.touch-punch.min.js"></script>
		<script src="assets/js/jquery.slimscroll.min.js"></script>
		<script src="assets/js/jquery.easy-pie-chart.min.js"></script>
		<script src="assets/js/bootbox.min.js"></script>
		<script src="assets/js/jquery.sparkline.min.js"></script>
		<script src="assets/js/flot/jquery.flot.min.js"></script>
		<script src="assets/js/flot/jquery.flot.pie.min.js"></script>
		<script src="assets/js/flot/jquery.flot.resize.min.js"></script>
		
		<script src="assets/js/jqGrid/jquery.jqGrid.min.js"></script>
		<script src="assets/js/jqGrid/i18n/grid.locale-en.js"></script>
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=B7gwYfCntoxtbWpMmkhxyttK"></script>
		<script type="text/javascript" src="js/myMap.js"></script>
		<script src="My97DatePicker/WdatePicker.js"></script>
		<script src="assets/js/jquery.bootstrap.min.js"></script>
		<script src="js/jquery.validate.js"></script>
		<script src="js/validate-ex.js"></script>

		<!-- ace scripts -->

		<script src="assets/js/ace-elements.min.js"></script>
		<script src="assets/js/ace.min.js"></script>
		<script src="js/common/global.js"></script>
		<script src="js/mapcontrol.js"></script>		
		<script src="assets/js/bootstrap.min.js"></script>
		<script type="text/javascript">
		jQuery(function($) {
			// 绑定部门树
			$('#department_tree').tree({
		          data:  eval('(${requestScope.departments})'),
		          onClick:  function(node, $link) {
		            showByDepartment(node);
					$('#department_div').toggle();
		          }
		    });
		});
		// 绑定部门树结束
		</script>
	</body>
</html>

