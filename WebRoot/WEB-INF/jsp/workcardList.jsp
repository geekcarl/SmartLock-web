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
		<input type="hidden" value="${workcard_add }" id="workcard_add">
		<input type="hidden" value="${workcard_update }" id="workcard_update">
		<input type="hidden" value="${workcard_delete }" id="workcard_delete">

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
							<li class="active">工作识别卡管理</li>
						</ul>
						<!-- .breadcrumb -->
					</div>
					<div class="page-content">

						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->
								<div class="well well-sm">
									卡号：<input id="f_s_type" type="text" placeholder="卡号"/>
									&nbsp;&nbsp;
									使用人：<input id="f_s_full_name" type="text" placeholder="使用人"/>
									<a class="green" href="javascript:void(0);" onclick="fastsearch()" title="快速检索"><i class="icon-search bigger-130"></i></a>
									&nbsp;&nbsp;&nbsp;&nbsp;
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
		<div id="dialog-department-tree" class="hide">
			 <div style="padding:10px 50px 20px 50px">
						<ul id="department_tree"></ul>
		     </div>
		</div><!-- #dialog-department -->
		
		<div id="dialog-user-tree" class="hide">
			<div id="user_tree_div" class="widget-main padding-8">
				<div id="user_tree_ul" class="ztree"></div>
			</div>
		</div><!-- #dialog-users -->
		
		<div id="dialog-a-rfid" class="hide">
			<div style="padding:10px 50px 20px 50px">
				<form id="a_form">
					<table width="100%" height="auto">
						<tr>
							<td>卡号：</td>
							<td><input type="text" id="a_type" name="a_type"/><font style="color:red;">*</font></td>
		                    <td>&nbsp;</td>
						</tr>
						<tr>
							<td>所属部门:</td>
		                    <td>
		                    	<input type="text" id="a_department_name" name="a_department_name" value="" readonly="readonly"></input>
		                    	<font style="color:red;">*</font>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('a_department_name', 'a_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	<a class="green" href="javascript:void(0);" onclick="chooseDepartment('a_department_name', 'a_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="a_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
						</tr>
						<tr>
							<td>使用人：</td>
							<td>
		                		<input type="text" id="a_user_name" name="a_user_name" readonly="readonly"/>
		                		&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('a_user_name', 'a_user_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('a_user_name', 'a_user_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="a_user_id"/>
		                	</td>
		                    <td>&nbsp;</td>
						</tr>
						<tr>
							<td>管理人：</td>
							<td>
		                		<input type="text" id="a_manage_name" name="a_manage_name" readonly="readonly"/>
		                		&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('a_manage_name', 'a_manage_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('a_manage_name', 'a_manage_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="a_manage_id"/>
		                	</td>
		                    <td>&nbsp;</td>
						</tr>
						<tr>
							<td>备注：</td>
							<td colspan="2"><textarea rows="5" cols="70" id="a_remark" name="a_remark"></textarea></td>
						</tr>
					</table>
				</form>
			</div>
		</div><!-- #dialog-view-alarm -->
		
		<div id="dialog-u-rfid" class="hide">
			<div style="padding:10px 50px 20px 50px">
				<form id="u_form">
					<table width="100%" height="auto">
						<tr>
							<td>卡号：</td>
							<td>
								<input type="hidden" id="u_id" name="u_id"/>
								<input type="text" id="u_type" name="u_type"/>
								<font style="color:red;">*</font>
							</td>
		                    <td>&nbsp;</td>
						</tr>
						<tr>
							<td>所属部门:</td>
		                    <td>
		                    	<input type="text" id="u_department_name" name="u_department_name" value="" readonly="readonly"></input>
		                    	<font style="color:red;">*</font>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('u_department_name', 'u_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	<a class="green" href="javascript:void(0);" onclick="chooseDepartment('u_department_name', 'u_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="u_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
						</tr>
						<tr>
							<td>使用人：</td>
							<td>
		                		<input type="text" id="u_user_name" name="u_user_name" readonly="readonly"/>
		                		&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('u_user_name', 'u_user_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('u_user_name', 'u_user_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="u_user_id"/>
		                	</td>
		                    <td>&nbsp;</td>
						</tr>
						<tr>
							<td>管理人：</td>
							<td>
		                		<input type="text" id="u_manage_name" name="u_manage_name" readonly="readonly"/>
		                		&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('u_manage_name', 'u_manage_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('u_manage_name', 'u_manage_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="u_manage_id"/>
		                	</td>
		                    <td>&nbsp;</td>
						</tr>
						<tr>
							<td>备注：</td>
							<td colspan="2"><textarea rows="5" cols="70"id="u_remark" name="u_remark"></textarea></td>
						</tr>
					</table>
				</form>
			</div>
		</div><!-- #dialog-view-alarm -->
		
		<div id="dialog-view-alarm" class="hide">
			<div style="padding:10px 50px 20px 50px">
				<form>
					<table width="100%" height="auto">
						
					</table>
				</form>
			</div>
		</div><!-- #dialog-view-alarm -->
		
		<div id="dialog-search-alarm" class="hide">
			<div style="padding:10px 50px 20px 50px">
				<form id="d_search_form">
					<table width="100%" cellpadding="5" height="auto">
						
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
		<script type="text/javascript" src="js/jquery.ztree.core-3.5.js"></script>
		<script type="text/javascript" src="js/jquery.ztree.excheck-3.5.js"></script>

		<!-- ace scripts -->

		<script src="assets/js/ace-elements.min.js"></script>
		<script src="assets/js/ace.min.js"></script>
		<script src="js/common/global.js"></script>
		<script src="js/workcardList.js"></script>
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

