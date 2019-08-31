<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>光交箱智能化运维管理支撑系统</title>
		<link rel="icon" href="images/bitbug_favicon.ico" mce_href="images/bitbug_favicon.ico" type="image/x-icon">
		<link rel="shortcut icon" href="images/bitbug_favicon.ico" mce_href="images/bitbug_favicon.ico” type="image/x-icon">
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<script type="text/javascript">
			if (! (self == parent))
			{
				top.location.href = '';
			}
		</script>
		<link rel="stylesheet" href="assets/css/font-awesome.min.css" />

		<link href="assets/css/bootstrap.min.css" rel="stylesheet" />
		

		<!--[if IE 7]>
		  <link rel="stylesheet" href="assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		

		<!-- fonts -->
		
		<style>
			html,body{
				width:100%;
				height:100%;
			}
			.mydiv {
				  
			}
			.myinput {
				margin-left:15px;
				background-color:white;/* 
				filter:alpha(opacity=50);  
		        -moz-opacity:0.5;  
		        -khtml-opacity: 0.5;  
		        opacity: 0.5; 
				border: 2px solid #efefef !important;
			    -moz-border-radius: 15px !important;
			    -webkit-border-radius: 15px !important;
			    border-radius:15px !important; */     
			}
		</style>


		<!-- ace styles -->

		<link rel="stylesheet" href="assets/css/ace.min.css" />
		<link rel="stylesheet" href="assets/css/ace-rtl.min.css" />

		<!--[if lte IE 8]>
		  <link rel="stylesheet" href="assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- inline styles related to this page -->

		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->

		<!--[if lt IE 9]>
		<script src="assets/js/html5shiv.js"></script>
		<script src="assets/js/respond.min.js"></script>
		<![endif]-->	
	</head>

	<body class="login-layout" style="background-color: #84ccc9;">
		<div class="mydiv" id="main-container" style="height:250px; display:none; width:100%; position:absolute; text-align:center; padding-top:30px; font-size:24px; color:#efefef; background-color: #A494FF;">
			<img src="images/cabinet_green.png" style="position: absolute; top:-35px; left:100px;"/>
			<h2 style="margin-bottom:50px;"><img src="images/china_mobile.png" width="90px"/>光交箱智能化运维管理支撑系统</h2>
			
			<i class="icon-user"></i>
			<input type="text" class="myinput" id="username" placeholder="用户名"/>&nbsp;&nbsp;&nbsp;
			<i class="icon-comment"></i>
			<input class="myinput" type="password" id="password" placeholder="密码"/>&nbsp;&nbsp;&nbsp;
			<input class="myinput" type="text" id="randomCode" placeholder="验证码"/>&nbsp;&nbsp;&nbsp;
			<span id="randomCodeSpan"><img src="randomCode"/></span><a href="javascript:void(0);" onclick="refresh()" style="font-size:12px;">看不清楚？换一张</a>
			<button class="btn btn-sm btn-success" onclick="onSubmit()" style="height:30px !important;">
				<i class="icon-ok"></i>
				登录
			</button>
			<div id="errorMsg_div" style="width:550px; height:70px; font-size:13px; padding-top:20px; color:yellow; margin:0 auto !important; visibility: hidden;">
				<strong>
					<font id="errorMsg"></font>
				</strong>
			</div>

		</div>
		

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
			if("ontouchend" in document) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>

		<!-- inline scripts related to this page -->
		<script type="text/javascript">
	        $(document).ready(function(){
		  	    //$("#main-container").animate({top:(document.body.clientHeight - 200) / 2 + 'px'}, 1000);
		  	    
		  	    $("#main-container").css('top', (document.body.clientHeight - 250) / 2 + 'px');
		  	    $("#main-container").fadeIn(2500);
		  	  	document.getElementById('username').focus();
		  	  	document.getElementById('username').onkeydown=keyDownSearch;
		  	  	document.getElementById('password').onkeydown=keyDownSearch;
		  	  	document.getElementById('randomCode').onkeydown=keyDownSearch;
			});
			
			function keyDownSearch(e) {    
		        // 兼容FF和IE和Opera    
		        var theEvent = e || window.event;    
		        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
		        if (code == 13) {    
		            onSubmit();//具体处理函数    
		            return false;    
		        }    
		        return true;    
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
			
	        function onSubmit(){
                 if ($("#username").val() == '')
                 {
                 	showError('errorMsg', 'errorMsg_div', '用户名不能为空!', 4000);
                 	return false;
                 }
                 if ($("#password").val() == '')
                 {
                 	showError('errorMsg', 'errorMsg_div', '密码不能为空!', 4000);
                 	return false;
                 }
                 if ($('#randomCode').val() == '')
                 {
                 	showError('errorMsg', 'errorMsg_div', '验证码不能为空!', 4000);
                 	return false;
                 }
                 showError('errorMsg', 'errorMsg_div', '登录中...', 7000);
	             $.ajax({ 
	                type: "post", 
	                url: "user.do?method=login",
	                data: {
	                		user_name : $("#username").val(),
	                		passwd : $("#password").val(),
	                		randomCode : $('#randomCode').val()
	                	  },
	                timeout: 10000,
	                success: function (data) {
	                 	  $('#errorMsg_div').css('visibility', 'hidden');
	                      if(data.resultMark==1)
	                      {
	                      	window.location="index";
	                      }
	                      else
	                      {
	                      		refresh();
	                			showError('errorMsg', 'errorMsg_div', data.errMessage, 4000);
	                      }
	                }, 
	                error: function (XMLHttpRequest, textStatus, errorThrown) {
	                    refresh();
	                 	$('#errorMsg_div').css('visibility', 'hidden');
                 		showError('errorMsg', 'errorMsg_div', '登录超时，请重试', 4000);
	                } 
	             });   
	             return false;    
	        }
		</script>	
		<script type="text/javascript">
			function show_box(id) {
			 jQuery('.widget-box.visible').removeClass('visible');
			 jQuery('#'+id).addClass('visible');
			}
		</script>
</body>
</html>
