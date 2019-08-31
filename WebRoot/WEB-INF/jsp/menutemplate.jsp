<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script type="text/javascript">
			if (self == parent)
			{
				window.location.href = '/gjx';
			}
		</script>
		<link rel="stylesheet" href="assets/css/font-awesome.min.css" />

		<link href="assets/css/bootstrap.min.css" rel="stylesheet" />
		

		<!--[if IE 7]>
		  <link rel="stylesheet" href="assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		

		<!-- fonts -->

		

		<style>
			html, body{
				background-color: #f2f2f2 !important;
			}
		</style>
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
			document.onkeydown=yxl 
		</script> 
	</head>

	<body  onkeydown="onKeyDown()" oncontextmenu="return false">
		<div class="main-container" id="main-container" style="background-color: #f2f2f2 !important; height:480px !important;">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
			</script>

			<div class="main-container-inner" style="background-color: #f2f2f2 !important; height:440px !important;">
				<div width="100%" id="sidebar" style="background-color: #f2f2f2 !important; height:440px !important;">
					<script type="text/javascript">
						try{ace.settings.check('sidebar' , 'fixed')}catch(e){}
					</script>
					<ul class="nav nav-list" style="background-color: #f2f2f2">
						
						<c:if test="${securitycontrol != null && securitycontrol == true}">
							<li id="li_1">
								<a href="#" class="dropdown-toggle" onclick="changeactive(1)">
									<i class="icon-desktop"></i>
									<span class="menu-text">安全管控</span>
	
									<b class="arrow icon-angle-down"></b>
								</a>
	
								<ul class="submenu" id="submenu_1">
									<c:if test="${mapcontrol != null && mapcontrol == true}">
										<li id="li_1_1">
											<a href="javascript:void(0);" onclick="menuclick(1, 1, 'boxinfo.do?method=mapcontrol')">
												<i class="icon-double-angle-right"></i>
												光交箱监控
											</a>
										</li>
									</c:if>
									<c:if test="${keylist != null && keylist == true}">
										<li id="li_1_2">
											<a href="javascript:void(0);" onclick="menuclick(1, 2, 'lockandkey.do?method=list')">
												<i class="icon-double-angle-right"></i>
												智能钥匙管理
											</a>
										</li>
									</c:if>
									<c:if test="${keyauthorize != null && keyauthorize == true}">
										<li id="li_1_3">
											<a href="javascript:void(0);" onclick="menuclick(1, 3, 'lockandkey.do?method=keyAuthorize')">
												<i class="icon-double-angle-right"></i>
												智能钥匙授权
											</a>
										</li>
									</c:if>
									<c:if test="${opendoorAuthorize != null && opendoorAuthorize == true}">
										<li id="li_1_9">
											<a href="javascript:void(0);" onclick="menuclick(1, 9, 'user.do?method=opendoorAuthorize')">
												<i class="icon-double-angle-right"></i>
												用户开门授权
											</a>
										</li>
									</c:if>
									<c:if test="${boxeventList != null && boxeventList == true}">
										<li id="li_1_4">
											<a href="javascript:void(0);" onclick="menuclick(1, 4, 'boxeventandwarn.do?method=boxeventList')">
												<i class="icon-double-angle-right"></i>
												开关门记录
											</a>
										</li>
									</c:if>
									<c:if test="${boxwarnList != null && boxwarnList == true}">
										<li id="li_1_5">
											<a href="javascript:void(0);" onclick="menuclick(1, 5, 'boxeventandwarn.do?method=boxwarnList')">
												<i class="icon-double-angle-right"></i>
												告警记录
											</a>
										</li>
									</c:if>
									<c:if test="${messageList != null && messageList == true}">
										<li id="li_1_6">
											<a href="javascript:void(0);" onclick="menuclick(1, 6, 'user.do?method=messageList')">
												<i class="icon-double-angle-right"></i>
												短信查看
											</a>
										</li>
									</c:if>
									<c:if test="${workcardList != null && workcardList == true}">
										<li id="li_1_7">
											<a href="javascript:void(0);" onclick="menuclick(1, 7, 'user.do?method=workcardList')">
												<i class="icon-double-angle-right"></i>
												工作识别卡管理
											</a>
										</li>
									</c:if>
								</ul>
							</li>
						</c:if>
						
						<c:if test="${resourcemanage != null && resourcemanage == true}">
							<li id="li_2">
								<a href="#" class="dropdown-toggle" onclick="changeactive(2)">
									<i class="icon-list"></i>
									<span class="menu-text">资源管理</span>
	
									<b class="arrow icon-angle-down"></b>
								</a>
	
								<ul class="submenu" id="submenu_2">
									<c:if test="${boxinfoList != null && boxinfoList == true}">
										<li id="li_2_1">
											<a href="javascript:void(0);" onclick="menuclick(2, 1, 'boxinfo.do?method=list')">
												<i class="icon-double-angle-right"></i>
												光交箱管理
											</a>
										</li>
									</c:if>
									
									<c:if test="${opticalcableList != null && opticalcableList == true}">
										<li id="li_2_2">
											<a href="javascript:void(0);" onclick="menuclick(2, 2, 'opticalcable.do?method=list')">
												<i class="icon-double-angle-right"></i>
												光缆管理
											</a>
										</li>
									</c:if>
								</ul>
							</li>
						</c:if>

						<c:if test="${dailymanage != null && dailymanage == true}">
							<li id="li_3">
								<a href="#" class="dropdown-toggle" onclick="changeactive(3)">
									<i class="icon-edit"></i>
									<span class="menu-text">日常维护管理</span>
	
									<b class="arrow icon-angle-down"></b>
								</a>
	
								<ul class="submenu" id="submenu_3">
	
									<c:if test="${workorderList != null && workorderList == true}">
										<li id="li_3_1">
											<a href="javascript:void(0);" onclick="menuclick(3, 1, 'boxinfo.do?method=orderlist')">
												<i class="icon-double-angle-right"></i>
												工单管理
											</a>
										</li>
									</c:if>
								<!-- 	<c:if test="${fixapplyList != null && fixapplyList == true}">
										<li id="li_3_2">
											<a href="javascript:void(0);" onclick="menuclick(3, 2, 'boxeventandwarn.do?method=fixapplyList')">
												<i class="icon-double-angle-right"></i>
												维修申请
											</a>
										</li>
									</c:if> -->
								</ul>
							</li>
						</c:if>
						
						<c:if test="${systemsetting != null && systemsetting == true}">
							<li id="li_4">
								<a href="#" class="dropdown-toggle" onclick="changeactive(4)">
									<i class="icon-wrench"></i>
									<span class="menu-text">系统设置</span>
	
									<b class="arrow icon-angle-down"></b>
								</a>
	
								<ul class="submenu" id="submenu_4">
									<c:if test="${departmentList != null && departmentList == true}">
										<li id="li_4_1">
											<a href="javascript:void(0);" onclick="menuclick(4, 1, 'department.do?method=list')">
												<i class="icon-double-angle-right"></i>
												组织机构管理
											</a>
										</li>
									</c:if>
	
									<c:if test="${userList != null && userList == true}">
										<li id="li_4_2">
											<a href="javascript:void(0);" onclick="menuclick(4, 2, 'user.do?method=list')">
												<i class="icon-double-angle-right"></i>
												用户管理
											</a>
										</li>
									</c:if>
									<c:if test="${roleList != null && roleList == true}">
										<li id="li_4_3">
											<a href="javascript:void(0);" onclick="menuclick(4, 3, 'user.do?method=roleList')">
												<i class="icon-double-angle-right"></i>
												角色权限设置
											</a>
										</li>
									</c:if>
									<c:if test="${boxPrivilegeList != null && boxPrivilegeList == true}">
										<li id="li_4_4">
											<a href="javascript:void(0);" onclick="menuclick(4, 4, 'user.do?method=boxPrivilegeList')">
												<i class="icon-double-angle-right"></i>
												光交箱权限设置
											</a>
										</li>
									</c:if>
									<c:if test="${smsSetting != null && smsSetting == true}">
										<li id="li_4_5">
											<a href="javascript:void(0);" onclick="menuclick(4, 5, 'boxinfo.do?method=smsSetting')">
												<i class="icon-double-angle-right"></i>
												短信告警设置
											</a>
										</li>
									</c:if>
									<c:if test="${dictionary != null && dictionary == true}">
										<li id="li_4_6">
											<a href="javascript:void(0);" onclick="menuclick(4, 6, 'dictionary.do?method=list')">
												<i class="icon-double-angle-right"></i>
												数据维护
											</a>
										</li>
									</c:if>
									<c:if test="${boxglobalsetting != null && boxglobalsetting == true}">
										<li id="li_4_7">
											<a href="javascript:void(0);" onclick="menuclick(4, 7, 'boxinfo.do?method=boxglobalsetting')">
												<i class="icon-double-angle-right"></i>
												参数设置
											</a>
										</li>
									</c:if>
								</ul>
							</li>
						</c:if>
					</ul><!-- /.nav-list -->

					<script type="text/javascript">
						try{ace.settings.check('sidebar' , 'collapsed')}catch(e){}
					</script>
				</div>
				
			</div><!-- /.main-container-inner -->
		</div><!-- /.main-container -->

		<!-- basic scripts -->

		<!--[if !IE]> -->

		
		<script src="assets/js/googleapis-jq-2.0.3.min.js"></script>

		<!-- <![endif]-->

		<!--[if IE]>
		<script src="assets/js/googleapis-jq-1.10.2.min.js"></script>
		<![endif]-->

		<!--[if !IE]> -->

		<script type="text/javascript">
			window.jQuery || document.write("<script src='assets/js/jquery-2.0.3.min.js'>"+"<"+"/script>");
		</script>

		<!-- <![endif]-->

		<!--[if IE]>
		<script type="text/javascript">
		 window.jQuery || document.write("<script src='assets/js/jquery-1.10.2.min.js'>"+"<"+"/script>");
		</script>
		<![endif]-->

		<script type="text/javascript">
			var lastsubmenuid = 0;
			var last_url_y = '';
			var first = 0;
			function initmenu(x, y)
			{
				$('#submenu_' + x).toggle();
				$('#li_' + x + '_' + y).addClass("active");
				lastsubmenuid = x;
				last_url_y = x + '_' + y;
			}
			function changeactive(x, y) {
				if (lastsubmenuid == 0 && first == 0)
				{
					$('#submenu_' + x).toggle();
					lastsubmenuid = x;
				}
				else
				{
					if (x != lastsubmenuid)
					{
						$('#submenu_' + lastsubmenuid).toggle();
						if (y != null && y !== undefined) {
							$('#submenu_' + x).toggle();
							if (last_url_y != (x + '_' + y))
							{
								$('#li_' + last_url_y).removeClass("active");
								$('#li_' + x + '_' + y).addClass("active");
								last_url_y = x + '_' + y;
							}
						}
						lastsubmenuid = x;
					}
					else
					{
						lastsubmenuid = 0; 
					}
				}
				first = 1;
			}
			function menuclick(x, y, url) {
				//changeactive(x, x);
				if (last_url_y != (x + '_' + y))
				{
					$('#li_' + last_url_y).removeClass("active");
					$('#li_' + x + '_' + y).addClass("active");
					last_url_y = x + '_' + y;
				}
				window.parent.document.getElementById('content').src = url;
			}
			if("ontouchend" in document) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="assets/js/bootstrap.min.js"></script>
		<script src="assets/js/typeahead-bs2.min.js"></script>

		<!-- page specific plugin scripts -->

		<!-- ace scripts -->

		<script src="assets/js/ace-elements.min.js"></script>
		<script src="assets/js/ace.min.js"></script>
		<script src="js/common/global.js"></script>

		<!-- inline scripts related to this page -->
</body>
</html>
