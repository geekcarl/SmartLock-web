<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>${sessionScope.sysinfo.software_name}</title>
		<link rel="icon" href="images/bitbug_favicon.ico" mce_href="images/bitbug_favicon.ico" type="image/x-icon">
		<link rel="shortcut icon" href="images/bitbug_favicon.ico" mce_href="images/bitbug_favicon.ico” type="image/x-icon">
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<script type="text/javascript">
			if (! (self == parent))
			{
				top.location.href = 'index';
			}
		</script>
		<link rel="stylesheet" href="assets/css/font-awesome.min.css" />
		<link href="assets/css/bootstrap.min.css" rel="stylesheet" />
		

		<!--[if IE 7]>
		  <link rel="stylesheet" href="assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		
		<link rel="stylesheet" href="assets/css/styles.css" />
		<link rel="stylesheet" href="assets/touchTouch/touchTouch.css" />

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
				overflow-y: hidden;
			}
			#u_form td {
				padding:5px;
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

	<body  oncontextmenu="return false">
		
		<input type="hidden" value="${sessionScope.user_id }" id="user_id">
		<input type="hidden" value="${getAlarmNotAffirmdCount }" id="getAlarmNotAffirmdCount">
		<input type="hidden" value="${mapcontrol }" id="mapcontrol">
		<input type="hidden" value="${downloadapp }" id="downloadapp">

		<div class="navbar navbar-default" id="navbar">
			<script type="text/javascript">
				try{ace.settings.check('navbar' , 'fixed')}catch(e){}
			</script>

			<div class="navbar-container" id="navbar-container">
				
				<div class="navbar-header pull-left">
					<a href="#" class="navbar-brand"> <small> <img src="images/china_mobile.png" width="30"/> ${sessionScope.sysinfo.software_name} &nbsp;&nbsp;${sessionScope.sysinfo.version}</small> </a>
					<!-- /.brand -->
				</div>
				<!-- /.navbar-header -->

				<div class="navbar-header pull-right" role="navigation">
					<ul class="nav ace-nav">
						<li class="purple">
							<a data-toggle="dropdown" class="dropdown-toggle" href="#">
								<i class="icon-bell-alt icon-animated-bell"></i>
								<span class="badge badge-important" id="msg_count"></span>
							</a>

							<ul class="pull-right dropdown-navbar navbar-pink dropdown-menu dropdown-caret dropdown-close">
								<li class="dropdown-header">
									<i class="icon-warning-sign"></i>
									<span id="msg_title">暂无消息</span>
								</li>

								<li id="msg_li" style="display:none;">
									<a href="javascript:void(0);" onclick="goAlarmList()">
										<div class="clearfix">
											<span class="pull-left">
												<i class="btn btn-xs no-hover btn-pink icon-comment"></i>
												<span id="msg_content"></span>
											</span>
											<span class="pull-right badge badge-info" id="msg_number"></span>
										</div>
									</a>
								</li>
							</ul>
						</li>
						<li class="light-blue">
							<a data-toggle="dropdown" href="#" class="dropdown-toggle"> <img
									class="nav-user-photo" src="assets/avatars/avatar2.png"
									alt="用户头像" /> <span class="user-info"> <small>欢迎光临,</small>
									${sessionScope.user_name} </span> <i class="icon-caret-down"></i>
							</a>
							<ul class="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
 
								<li>
									<a href="javascript:void(0);" onclick="update()"><i
										class="icon-user"></i>修改密码</a>
								</li>
								
								<c:if test="${downloadapp != null && downloadapp == true && appadress != null}">
								<li class="divider"></li>
								<li>
									<a href="../gjx_uploadfile/${appadress}"><i
										class="icon-list"></i>下载手机APK</a>
								</li>
								</c:if>

								<li class="divider"></li>
								<li>
									<a href="user.do?method=loginout"> <i class="icon-off"></i> 退出 </a>
								</li>
							</ul>
						</li>
					</ul>
					<!-- /.ace-nav -->
				</div>
				<!-- /.navbar-header -->
			</div>
			<!-- /.container -->
		</div>

		<div class="main-container" id="main-container" style="background-color: white">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}

				
				function dyniframesize(down) {
					if ($('#mapcontrol').val() == 'true')
					{
						window.frames["menu"].initmenu(1, 1);
					}
					else
					{
						window.frames["menu"].changeactive(1);
					}
				}

			</script>

			<div class="main-container-inner" style="background-color: #f2f2f2">
				<a class="menu-toggler" id="menu-toggler" href="#"> <span
					class="menu-text"></span> </a>
				<div class="sidebar" id="sidebar" style="background-color: #f2f2f2">
					<iframe id="menu" name="menu" width="190px" height="480px" style="background-color: #f2f2f2" frameborder="0" scrolling="no" onload="dyniframesize('menu')" src="menutemplate"></iframe>
					<!-- <iframe src="operators.do?method=list" id="menu" name="menu"  style="background-color: black" width="190px" frameborder="0" marginheight="0" marginwidth="0" frameborder="0" scrolling="auto" onload="dyniframesize('menu')" ></iframe> -->
				</div>

				<div class="main-content">
					<c:if test="${mapcontrol == true}">
						<iframe id="content" width="100%" height="200px"  style="background-color: #f2f2f2; display:none;" frameborder="0" src="boxinfo.do?method=mapcontrol"></iframe>
					</c:if>
					
					<c:if test="${mapcontrol != true}">
						<iframe id="content" width="100%" height="200px"  style="background-color: #f2f2f2; display:none;" frameborder="0" src="welcome.html"></iframe>
					</c:if>
				</div>
				<!-- /.row -->
			</div>
		</div>
		<!-- /.main-container -->
		
		<div id="dialog-update-password" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="u_form" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>旧密码:</td>
		                    <td>
		                    	<input id="old_password" type="password" name="old_password"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>新密码:</td>
		                    <td>
		                    	<input type="password" id="new_password" name="new_password"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>确认密码:</td>
		                    <td>
		                    	<input type="password" id="re_new_password" name="re_new_password"/>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-update-password -->
		
		<div id="dialog-relogin" class="hide">
			 <div style="padding:10px 0px 20px 0px">
		        <form id="f_login" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>用户名:</td>
		                    <td>
		                    	<input id="username" type="text" name="username"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>密码:</td>
		                    <td>
		                    	<input type="password" id="password" name="password"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>验证码:</td>
		                    <td>
		                    	<input type="text" id="randomCode" name="randomCode"/>
		                    	<font style="color:red;">*</font>
		                    	<span id="randomCodeSpan"><img src="randomCode"/></span><a href="javascript:void(0);" onclick="refresh()" style="font-size:12px;">看不清楚？换一张</a>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		            </table>
		        </form>
		        <div id="errorMsg_div" style="width:550px; height:70px; font-size:13px; padding-top:20px; color:yellow; margin:0 auto !important; visibility: hidden;">
					<strong>
						友情提示：
					</strong>
					<font id="errorMsg"></font>
				</div>
		     </div>
		</div><!-- #dialog-relogin -->
		
		
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
		<script src="My97DatePicker/WdatePicker.js"></script>
		<script src="assets/js/jquery.bootstrap.min.js"></script>
		<script src="js/jquery.validate.js"></script>
		<script src="js/validate-ex.js"></script>

		<!-- ace scripts -->

		<script src="assets/js/ace-elements.min.js"></script>
		<script src="assets/js/ace.min.js"></script>
		<script src="assets/js/bootstrap.min.js"></script>
		<script src="js/common/global.js"></script>
		<script type="text/javascript">
			$(document).ready(function(){
				$('#content').attr('height', (document.body.clientHeight - 50) + 'px');
				$('#content').show();
		  	  	document.getElementById('username').onkeydown=keyDownSearch;
		  	  	document.getElementById('password').onkeydown=keyDownSearch;
		  	  	document.getElementById('randomCode').onkeydown=keyDownSearch;
			});
			
			var g_alarm_interval = null;
			if ($('#getAlarmNotAffirmdCount').val() == 'true')
			{
				fetchAlarmNotAffirmd();
				window.setInterval("fetchAlarmNotAffirmd()",60000);
			}
			
			function keyDownSearch(e) {    
		        // 兼容FF和IE和Opera    
		        var theEvent = e || window.event;    
		        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
		        if (code == 13) {    
		            login();//具体处理函数    
		            return false;    
		        }    
		        return true;    
		    } 
			
			
			function fetchAlarmNotAffirmd()
			{
				$.ajax( {
					type : "post",
					url : "boxinfo.do?method=findOrderTypeAlarmCounts",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{
							if (data.object > 0)
							{
								$('#msg_count').html(data.object);
								$('#msg_title').html(data.object + '新消息');
								$('#msg_li').show();
								$('#msg_content').html('未完成告警类型工单');
								$('#msg_number').html(data.object);
							}
							else
							{
								$('#msg_li').hide();
							}
						}
					},
					error : function() {
					}
				});
			}
			
			function goAlarmList() {
				window.frames["menu"].changeactive(3, 1);
				$("#content").attr("src", "boxinfo.do?method=orderlist");
			}

			function reLogin() {
				refresh();
				var dialog = $("#dialog-relogin").removeClass('hide').dialog({
					width: 800,
					height: 550,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>登录</h4></div>",
					title_html: true,
					buttons: [
						{
							text: "确定",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								login();
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-relogin" ).dialog("close"); 
							}
						}
					]
				});
			}
			
			function login() {
				if ($('#f_login').valid())
				{			
                 	showError('errorMsg', 'errorMsg_div', '登录中...', 7000);
					$.ajax( {
						type : "post",
						url : "user.do?method=login",
						data: "user_name=" + $('#username').val() + "&passwd=" + $('#password').val() + "&randomCode=" + $('#randomCode').val(),
						timeout: 7000,
						success : function(data) {
	                 	  	$('#errorMsg_div').css('visibility', 'hidden');
							if (data.resultMark == 1)
							{
								$( "#dialog-relogin" ).dialog("close");
							}
							else
							{
								showError('errorMsg', 'errorMsg_div', data.errMessage, 4000);
							}
						},
						error : function() {
							refresh();
	                 	  	$('#errorMsg_div').css('visibility', 'hidden');
							showError('errorMsg', 'errorMsg_div', '服务器忙，请重试', 4000);
						}
					});
				}
			}

			function showError(errorMsg, errorMsg_div, remark, time)
			{
                 $('#' + errorMsg).html(remark);
                 $('#' + errorMsg_div).css('visibility', 'visible');
                 window.setTimeout("javascript:$('#" + errorMsg_div + "').css('visibility', 'hidden');", time);
			}
			
			function refresh() {
				var time = new Date().getTime();
				$('#randomCodeSpan').html('<img src="randomCode?time=' + time + '"/>');
			}
			
			function update() {
				var dialog = $("#dialog-update-password").removeClass('hide').dialog({
					width: 700,
					height: 550,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改密码</h4></div>",
					title_html: true,
					buttons: [
						{
							text: "确定",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#u_form').valid())
								{
									$.ajax( {
										type : "post",
										url : "user.do?method=updatepassword",
										data: "old_password=" + $('#old_password').val() + "&new_password=" + $('#new_password').val(),
										success : function(data) {
											if (data.resultMark == -1) {
												alert('会话超时，请重新登录');
												$( "#dialog-update-password" ).dialog("close"); 
												reLogin();
												return false;
											}
											else if (data.resultMark == 1)
											{
												alert('修改密码成功，请重新登录');
												$( "#dialog-update-password" ).dialog("close"); 
												reLogin();
											}
											else
											{
												alert('修改密码失败，请重试');
											}
										},
										error : function() {
											alert('修改密码失败，请重试');
										}
									});
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-update-password" ).dialog("close"); 
							} 
						}
					]
				});
			}
			
			//验证修改密码
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
					old_password: {
				 		required: true
				 	},
				 	new_password: {
					 	required: true
					},
					re_new_password: {
					 	required: true,
					 	equalTo: '#new_password'
					}
		         }, 
		         messages:{ //定义提示信息 
		        	old_password: {
				 		required: '密码不能为空'
				 	},
				 	new_password: {
					 	required: '新密码不能为空'
					},
					re_new_password: {
					 	required: '新密码不能为空',
					 	equalTo: '两次密码不一致'
					}
		         } 
		    });

			//验证修改密码
			$("#f_login").validate({
		
				event:"keyup" || "blur",
				errorElement: "em",
				errorPlacement: function(error, element) {
					error.appendTo(element.parent("td").next("td"));
				},
				success: function(label) {
					label.text("ok!").addClass("success");
				},
		        rules:{ //定义验证规则 
					username: {
				 		required: true
				 	},
				 	password: {
					 	required: true
					},
					randomCode: {
					 	required: true
					}
		         }, 
		         messages:{ //定义提示信息 
		        	username: {
				 		required: '用户名不能为空'
				 	},
				 	password: {
					 	required: '密码不能为空'
					},
					randomCode: {
					 	required: '验证码不能为空'
					}
		         } 
		    });
		</script>
	</body>
</html>

