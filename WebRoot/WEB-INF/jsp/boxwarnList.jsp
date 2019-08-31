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
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="assets/css/font-awesome.min.css" />
		<link href="assets/css/bootstrap.min.css" rel="stylesheet" />
		

		<!--[if IE 7]>
		  <link rel="stylesheet" href="assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		

		<!-- fonts -->

		<link rel="stylesheet" href="assets/css/jquery-ui-1.10.3.full.min.css" />
		<link rel="stylesheet" href="assets/css/ui.jqgrid.css" />
		

		<!-- ace styles -->

		<link rel="stylesheet" href="assets/css/ace.min.css" />
		<link rel="stylesheet" href="assets/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="assets/css/ace-skins.min.css" />

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
						if (e.pageX < g_obj.rightClickPos.pageX || e.pageX > (g_obj.rightClickPos.pageX + 160) || e.pageY < g_obj.rightClickPos.pageY || e.pageY > (g_obj.rightClickPos.pageY + 150))
						{
							$('#rightclick_contextmenu').hide();
						}
					}
				}
			}
			document.onkeydown=yxl;
			document.onMouseDown=scrollFunc;
		</script> 
	</head>

	<body   oncontextmenu="return false">
		<input type="hidden" value="${sessionScope.user_id }" id="user_id">
		<input type="hidden" value="${boxwarn_delete }" id="boxwarn_delete">
		<input type="hidden" value="${boxwarn_affirm }" id="boxwarn_affirm">
		<input type="hidden" value="${boxwarn_export }" id="boxwarn_export">
		<div class="col-sm-6" id="rightclick_contextmenu" onmouseover="rightMenuMouseOver()" onmouseout="rightMenuMouseOut()" style="display:none; z-index:9999; position: absolute;">
			<ul id="menu">
				<li>
					<a href="javascript:void(0);" onclick="showModules()">光交接箱面板图</a>
				</li>
				<li>
					<a href="javascript:void(0);" onclick="managelock()">智能锁管理</a>
				</li>
				<li>
					<a href="javascript:void(0);">光交接箱端子管理</a>
				</li>

				<li>
					<a href="javascript:void(0);" onclick="jumpTerminal()">跳纤管理</a>
				</li>

				<li>
					<a href="javascript:void(0);" onclick="coreToTerminal()">纤芯关联</a>
				</li>

				<li>
					<a href="javascript:void(0);">端子直熔</a>
				</li>
				
			</ul>
		</div><!-- ./span -->

		<div class="main-container" id="main-container" style="background-color: white">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
				
			</script>

			<div class="main-container-inner" style="background-color: #f2f2f2">
				
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
							<li class="active">告警记录</li>
						</ul>
						<!-- .breadcrumb -->
					</div>
					<div class="page-content">

						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->

								<div class="well well-sm">
									控制器ID：<input id="f_s_controller_id" type="text" placeholder="控制器ID"/> 
									告警类型：<input id="f_s_alarm_type" type="text" placeholder="告警类型"/>
									<a class="green" href="javascript:void(0);" onclick="fastsearch()" title="快速检索"><i class="icon-search bigger-130"></i></a>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<button onclick="detailsearch()" class="btn btn-xs btn-success">
										高级检索
										<i class="icon-zoom-in icon-on-right"></i>
									</button>
									<button onclick="resetsearch()" class="btn btn-xs btn-success">
										重置检索
										<i class="icon-refresh icon-on-right"></i>
									</button>
									&nbsp;&nbsp;自动刷新&nbsp;<input type="checkbox" onchange="autorefresh()" id="autorefresh" name="autorefresh" />
								</div>
							 	<div id="manage_grant_warn" class="alert alert-danger" style="display:none;">
									<i class="icon-hand-right"></i>
									<label id="manage_grant_warn_label"></label>
									<button class="close" data-dismiss="alert">
										<i class="icon-remove"></i>
									</button>
								</div>
								<table id="manage-grant-grid-table"></table>
				
								<div id="manage-grant-grid-pager"></div>
								 	
								<script type="text/javascript">
									var $path_base = "/";//this will be used in gritter alerts containing images
								</script>

								<!-- PAGE CONTENT ENDS -->
							</div><!-- /.col -->
						</div><!-- /.row -->
						
					</div><!-- /.page-content -->
			</div>
		</div>
		<!-- /.main-content -->
		<!-- /.main-container-inner -->
		<a href="#" id="btn-scroll-up"
			class="btn-scroll-up btn btn-sm btn-inverse"> <i
			class="icon-double-angle-up icon-only bigger-110"></i> </a>
		<!-- /.main-container -->
		<div id="dialog-department-tree" class="hide">
			 <div style="padding:10px 50px 20px 50px">
						<ul id="department_tree"></ul>
		     </div>
		</div><!-- #dialog-department -->
		<div id="dialog-view-alarm" class="hide">
			<div style="padding:10px 50px 20px 50px">
				<form>
					<table width="100%" height="auto">
						<tr>
							<td>控制器ID：</td>
							<td><input type="text" readonly="readonly" id="controller_id" value=""/></td>
						</tr>
						<tr>
							<td>光交箱地址：</td>
							<td><input type="text" readonly="readonly" id="address" value=""/></td>
						</tr>
						<tr>
							<td>所属部门：</td>
							<td><input type="text" readonly="readonly" id="department" value=""/></td>
						</tr>
						<tr>
							<td>告警类型：</td>
							<td><input type="text" readonly="readonly" id="alarm_type" value=""/></td>
						</tr>
						<tr>
							<td>告警时间：</td>
							<td><input type="text" readonly="readonly" id="alarm_time" value=""/></td>
						</tr>
						<tr>
							<td>告警钥匙：</td>
							<td><input type="text" readonly="readonly" id="alarm_keys" value=""/></td>
						</tr>
						<tr>
							<td>告警人员：</td>
							<td><input type="text" readonly="readonly" id="alarm_operators" value=""/></td>
						</tr>
						<tr>
							<td>告警RFID：</td>
							<td><input type="text" readonly="readonly" id="alarm_rfids" value=""/></td>
						</tr>
						<tr>
							<td>是否已确认：</td>
							<td><input type="text" readonly="readonly" id="is_affirmed" value=""/></td>
						</tr>
						<tr>
							<td>确认时间：</td>
							<td><input type="text" readonly="readonly" id="affirm_time" value=""/></td>
						</tr>
						<tr>
							<td>确认人：</td>
							<td><input type="text" readonly="readonly" id="affirm_user" value=""/></td>
						</tr>
						<tr>
							<td>备注：</td>
							<td><textarea rows="5" cols="40" disabled="disabled" id="remarks"></textarea></td>
						</tr>
					</table>
				</form>
			</div>
		</div><!-- #dialog-view-alarm -->
		
		<div id="dialog-search-alarm" class="hide">
			<div style="padding:10px 50px 20px 50px">
				<form id="d_search_form">
					<table width="100%" cellpadding="5" height="auto">
						<tr>
							<td>控制器ID：</td>
							<td><input type="text" id="s_controller_id" name="s_controller_id" value=""/></td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>光交箱编号：</td>
							<td><input type="text" id="s_box_no" value=""/></td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>所属部门：</td>
							<td>
								<input type="text" id="s_department" value="" readonly="readonly"/>
								&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="clearDepartment('s_department', 's_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('s_department', 's_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
								<input type="hidden" id="s_department_id"/>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>告警类型：</td>
							<td><input type="text" id="s_alarm_type" value=""/></td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>告警时间：</td>
							<td><input type="text" id="s_alarm_time" name="s_alarm_time"  value="" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"></td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>告警钥匙：</td>
							<td><input type="text" id="s_alarm_keys" value=""/></td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>告警人员：</td>
							<td><input type="text" id="s_alarm_operators" value=""/></td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>告警RFID：</td>
							<td><input type="text" id="s_alarm_rfids" value=""/></td>
							<td>&nbsp;</td>
						</tr>
						<%--<tr>
							<td>是否已确认：</td>
							<td>
								<input type="radio" checked="checked" id="s_is_affirmed_yes" name="s_is_affirmed" value="1"/>已确认
								<input type="radio" id="s_is_affirmed_no" name="s_is_affirmed" value="0"/>未确认
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>确认时间：</td>
							<td><input type="text" id="s_affirm_time" name="s_affirm_time"  value="" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"></td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>确认人：</td>
							<td><input type="text" id="s_affirm_user" value=""/></td>
							<td>&nbsp;</td>
						</tr>--%>
					</table>
				</form>
			</div>
		</div><!-- #dialog-search-alarm -->
		
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
		<script src="assets/js/bootstrap.min.js"></script>
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
		<script src="My97DatePicker/WdatePicker.js"></script>
		<script src="assets/js/jquery.bootstrap.min.js"></script>
		<script src="js/jquery.validate.js"></script>
		<script src="js/validate-ex.js"></script>

		<!-- ace scripts -->

		<script src="assets/js/ace-elements.min.js"></script>
		<script src="assets/js/ace.min.js"></script>
		<script src="js/common/global.js"></script>
		<script src="js/boxwarn.js"></script>
		<script type="text/javascript">
		jQuery(function($) {
			// 绑定部门树
			$('#department_tree').tree({
		          data:  eval('(${requestScope.departments})'),
		          onClick:  function(node, $link) {
		            $('#' + g_obj.chooseDepartment.id).val(node.id);
		            $('#' + g_obj.chooseDepartment.name).val(node.text);
		          	$( "#dialog-department-tree" ).dialog( "close" ); 
		          }
		    });
		});
		// 绑定部门树结束
		</script>
		
	</body>
</html>

