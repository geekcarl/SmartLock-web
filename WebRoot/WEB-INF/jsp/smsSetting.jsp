<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
   		<base href="<%=basePath%>">
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
		<link rel="stylesheet" href="css/zTreeStyle/zTreeStyle.css" type="text/css">

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
		<input type="hidden" value="${smssetting_add }" id="smssetting_add">
		<input type="hidden" value="${smssetting_delete }" id="smssetting_delete">

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
								<a href="#">系统设置</a>
							</li>
							<li class="active">短信告警设置</li>
						</ul>
						<!-- .breadcrumb -->
					</div>
					<div class="page-content">
						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->

								<div class="well well-sm">
									<input id="f_s_user_name" type="text" placeholder="用户名"/>-
									<input id="f_s_type" type="text" placeholder="告警类型"/>-
									<input id="f_s_boxno" type="text" placeholder="光交箱编号"/>-
									<input id="f_s_controllerid" type="text" placeholder="控制器号"/>
									<!-- <input type="text" id="f_s_department_name" readonly placeholder="所属部门"></input>
								  <a class="green" href="javascript:void(0);" onclick="cancelDepartment('f_s_department_name', 'f_s_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	<a class="green" href="javascript:void(0);" onclick="chooseDepartment('f_s_department_name', 'f_s_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="f_s_department_id"/>&nbsp;&nbsp; -->

									<a class="green" href="javascript:void(0);" onclick="fastsearch()" title="快速检索"><i class="icon-search bigger-130"></i></a>
									&nbsp;&nbsp;
									<button onclick="resetsearch()" class="btn btn-xs btn-success">
										重置检索
										<i class="icon-refresh icon-on-right"></i>
									</button>
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
		<div id="dialog-update-grant" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <div style="width:100%; margin-top:20px; margin-bottom:20px;">
			        <div style="width:250px; height:400px; overflow:auto; border:1px solid black; float: left; text-align: center; padding-top:7px;  margin-left:30px;">
			        	选择光交箱(多选)<font style="color:red;">*</font>
						<div id="u_tree_div2" class="widget-main padding-8">
							<div id="u_tree2" class="ztree"></div>
						</div>
					</div>
			        <div style="width:250px; height:400px; overflow:auto; border:1px solid black; float: left; text-align: center; padding-top:7px;  margin-left:30px;">
				                     选择告警类型(多选)<font style="color:red;">*</font>
						<div id="u_tree_div1" class="widget-main padding-8">
							<div id="u_tree1" class="ztree"></div>
						</div>
			        </div>
			        <div style="width:250px; height:400px; overflow:auto; border:1px solid black; float: left; text-align: center; padding-top:7px;  margin-left:30px;">
			        	选择人员(单选)<font style="color:red;">*</font>
						<div id="u_tree_div3" class="widget-main padding-8">
							<div id="u_tree3" class="ztree"></div>
						</div>
			        </div>
		        </div>
		        <div style="position: relative; top:20px; clear: both;">
			        <form>
			        	<table width="100%">
			        		 <tr>
			                    <td>备注:</td>
			                    <td>
			                    	<textarea id="u_grant_remarks" rows="5" cols="90"></textarea>
			                    </td>
			                </tr>
			        	</table>
			        </form>
			    </div>
		     </div>
		</div><!-- #dialog-add-grant -->


		<div id="dialog-department-tree" class="hide">
			 <div style="padding:10px 50px 20px 50px">
				<ul id="department_tree"></ul>
		     </div>
		</div><!-- #dialog-department -->
		
		<div id="dialog-add-grant" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <div style="width:100%; margin-top:20px; margin-bottom:20px;">
			        <div style="width:250px; height:400px; overflow:auto; border:1px solid black;  float: left; text-align: center; padding-top:7px; margin-left:30px;">
			        	选择光交箱(多选)<font style="color:red;">*</font>
						<div id="tree_div2" class="widget-main padding-8">
							<div id="tree2" class="ztree"></div>
						</div>
					</div>
			        <div style="width:250px; height:400px; overflow:auto; border:1px solid black; float: left; text-align: center; padding-top:7px; margin-left:30px;">
				       	 选择告警类型(多选)<font style="color:red;">*</font>
						<div id="tree_div1" class="widget-main padding-8">
							<div id="tree1" class="ztree"></div>
						</div>
			        </div>
			        <div style="width:250px; height:400px; overflow:auto; border:1px solid black;  float: left; text-align: center; padding-top:7px; margin-left:30px;">
			        	选择人员(多选)<font style="color:red;">*</font>
						<div id="tree_div3" class="widget-main padding-8">
							<div id="tree3" class="ztree"></div>
						</div>
			        </div>
		        </div>
		        <div style="position: relative; top:20px; clear: both;">
			        <form>
			        	<table width="100%">
			        		 <tr>
			                    <td>备注:</td>
			                    <td>
			                    	<textarea id="a_remarks" rows="5" cols="90"></textarea>
			                    </td>
			                </tr>
			        	</table>
			        </form>
			    </div>
		     </div>
		</div><!-- #dialog-update-grant -->


	
		
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
		<script type="text/javascript" src="js/jquery.ztree.core-3.5.js"></script>
		<script type="text/javascript" src="js/jquery.ztree.excheck-3.5.js"></script>

		<!-- ace scripts -->

		<script src="assets/js/ace-elements.min.js"></script>
		<script src="assets/js/ace.min.js"></script>
		<script src="js/common/global.js"></script>
		<script src="js/smsSetting.js"></script>


	</body>
</html>

