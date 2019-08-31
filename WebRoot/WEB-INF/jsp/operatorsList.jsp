<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
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
		<link rel="stylesheet" href="assets/css/datepicker.css" />
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
						$('#rightclick_contextmenu').hide();
					}
				}
			}
			document.onkeydown=yxl;
			document.onMouseDown=scrollFunc;
		</script> 
	</head>

	<body   oncontextmenu="return false">
		<div class="col-sm-6" id="rightclick_contextmenu" onmouseover="rightMenuMouseOver()" onmouseout="rightMenuMouseOut()" style="display:none; z-index:9999; position: absolute;">
			<ul id="menu">
				<li>
					<a href="#">查看详情</a>
				</li>

				<li>
					<a href="#">编辑</a>
				</li>

				<li>
					<a href="#">删除</a>
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
								<a href="#">基本设置</a>
							</li>
							<li class="active">人员管理</li>
						</ul>
						<!-- .breadcrumb -->
					</div>
					<div class="page-content">

						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->
								<div class="well well-sm">
									编号：<input id="f_s_op_no" type="text" placeholder="编号"/> 
									姓名：<input id="f_s_name" type="text" placeholder="姓名"/>
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
								</div>
								<div id="manage_warn" class="alert alert-danger" style="display:none;">
									<i class="icon-hand-right"></i>
									<label id="manage_warn_label"></label>
									<button class="close" data-dismiss="alert">
										<i class="icon-remove"></i>
									</button>
								</div>

								<table id="grid-table"></table>

								<div id="grid-pager"></div>

								<script type="text/javascript">
									var $path_base = "/";//this will be used in gritter alerts containing images
								</script>

								<!-- PAGE CONTENT ENDS -->
							</div><!-- /.col -->
						</div><!-- /.row -->
						
					</div><!-- /.page-content -->
			</div>
		<!-- /.main-container-inner -->
		<a href="#" id="btn-scroll-up"
			class="btn-scroll-up btn btn-sm btn-inverse"> <i
			class="icon-double-angle-up icon-only bigger-110"></i> </a>
		</div>
		<!-- /.main-container -->
		<div id="dialog-department-tree" class="hide">
			 <div style="padding:10px 50px 20px 50px">
						<ul id="department_tree"></ul>
		     </div>
		</div><!-- #dialog-department -->
		
		<div id="dialog-message" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="a_form" method="post">
		            <table cellpadding="5">
		                <tr>
		                    <td>编号:</td>
		                    <td>
		                    	<input id="a_op_no" name="a_op_no" type="text"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>姓名:</td>
		                    <td>
		                    	<input id="a_op_name" name="a_op_name" type="text"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>性别:</td>
		                    <td>
		                    	<input type="radio" checked="checked" id="a_op_sex_yes" name="a_op_sex" value="1"/>男
								<input type="radio" id="a_op_sex_no" name="a_op_sex" value="0"/>女
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>所属部门:</td>
		                    <td>
		                    	<input type="text" id="a_op_department_name" name="a_op_department_name" value="" readonly="readonly"></input>
		                    	<font style="color:red;">*</font>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('a_op_department_name', 'a_op_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	<a class="green" href="javascript:void(0);" onclick="chooseDepartment('a_op_department_name', 'a_op_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="a_op_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>手机号:</td>
		                    <td>
		                    	<input id="a_op_phone_no" name="a_op_phone_no" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>电话:</td>
		                    <td>
		                    	<input id="a_op_aux_phone" name="a_op_aux_phone" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>电子邮箱:</td>
		                    <td>
		                    	<input id="a_op_email" name="a_op_email" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>住址:</td>
		                    <td>
		                    	<input id="a_op_address" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="a_op_remarks" rows="5" cols="40"></textarea></td>
		                </tr>
		                
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-message -->
		
		<div id="dialog-message-update" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="u_form" method="post">
		            <table cellpadding="5">
		                <tr>
		                    <td>编号:</td>
		                    <td>
		                    	<input id="u_op_no" name="u_op_no" type="text"></input>
		                    	<font style="color:red;">*</font>
		                    	<input id="u_op_id" type="hidden">
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>姓名:</td>
		                    <td>
		                    	<input id="u_op_name" name="u_op_name" type="text"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>性别:</td>
		                    <td>
		                    	<input type="radio" checked="checked" id="u_op_sex_yes" name="u_op_sex" value="1"/>男
								<input type="radio" id="u_op_sex_no" name="u_op_sex" value="0"/>女
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>所属部门:</td>
		                    <td>
		                    	<input type="text" id="u_op_department_name" name="u_op_department_name" value="" readonly="readonly"></input>
		                    	<font style="color:red;">*</font>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('u_op_department_name', 'u_op_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	<a class="green" href="javascript:void(0);" onclick="chooseDepartment('u_op_department_name', 'u_op_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="u_op_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>手机号:</td>
		                    <td>
		                    	<input id="u_op_phone_no" name="u_op_phone_no" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>电话:</td>
		                    <td>
		                    	<input id="u_op_aux_phone" name="u_op_aux_phone" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>电子邮箱:</td>
		                    <td>
		                    	<input id="u_op_email" name="u_op_email" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>住址:</td>
		                    <td>
		                    	<input id="u_op_address" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="u_op_remarks" rows="5" cols="40"></textarea></td>
		                </tr>
		                
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-message -->
		
		<div id="dialog-search" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="d_search_form" method="post">
		            <table cellpadding="5">
		                <tr>
		                    <td>编号:</td>
		                    <td>
		                    	<input id="s_op_no" name="s_op_no" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>姓名:</td>
		                    <td>
		                    	<input id="s_op_name" name="s_op_name" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>性别:</td>
		                    <td>
		                    	<input type="radio" checked="checked" id="s_op_sex_yes" name="s_op_sex" value="1"/>男
								<input type="radio" id="s_op_sex_no" name="s_op_sex" value="0"/>女
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>所属部门:</td>
		                    <td>
		                    	<input type="text" id="s_op_department_name" readonly="readonly"></input>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('s_op_department_name', 's_op_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	<a class="green" href="javascript:void(0);" onclick="chooseDepartment('s_op_department_name', 's_op_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="s_op_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>手机号:</td>
		                    <td>
		                    	<input id="s_op_phone_no" name="s_op_phone_no" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>电话:</td>
		                    <td>
		                    	<input id="s_op_aux_phone" name="s_op_aux_phone" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>电子邮箱:</td>
		                    <td>
		                    	<input id="s_op_email" name="s_op_email" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>住址:</td>
		                    <td>
		                    	<input id="s_op_address" type="text"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-message -->
		
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
		<script src="js/operatorsList.js"></script>
		
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

