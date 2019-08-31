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
		
		<link rel="stylesheet" href="assets/css/styles.css" />
		<link rel="stylesheet" href="assets/touchTouch/touchTouch.css" />

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
		
 <script src="assets/js/jquery-1.10.2.min.js" type="text/javascript"></script>
  
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
						if (e.pageX < g_obj.rightClickPos.pageX || e.pageX > (g_obj.rightClickPos.pageX + 160) || e.pageY < g_obj.rightClickPos.pageY || e.pageY > (g_obj.rightClickPos.pageY + 270))
						{
							$('#rightclick_contextmenu').hide();
						}
					}
				}
			}
			
		</script> 
	</head>

	<body oncontextmenu="return false">
		<input type="hidden" value="${sessionScope.user_id }" id="user_id">
		<input type="hidden" value="${boxinfo_import }" id="boxinfo_import">
		<input type="hidden" value="${boxinfo_export }" id="boxinfo_export">
		<input type="hidden" value="${boxinfo_add }" id="boxinfo_add">
		<input type="hidden" value="${boxinfo_opendoor }" id="boxinfo_opendoor">
		<input type="hidden" value="${boxinfo_update }" id="boxinfo_update">
		<input type="hidden" value="${boxinfo_delete }" id="boxinfo_delete">
		<input type="hidden" value="${boxinfo_showpics }" id="boxinfo_showpics">
		<input type="hidden" value="${boxinfo_boxsetting }" id="boxinfo_boxsetting">
		<input type="hidden" value="${boxinfo_modify }" id="boxinfo_modify">
		<input type="hidden" value="${boxinfo_showmodules }" id="boxinfo_showmodules">
		<input type="hidden" value="${boxinfo_showterminals }" id="boxinfo_showterminals">
		<input type="hidden" value="${boxinfo_showlocks }" id="boxinfo_showlocks">
		<input type="hidden" value="${boxinfo_jumpterminal }" id="boxinfo_jumpterminal">
		<input type="hidden" value="${boxinfo_coretoterminal }" id="boxinfo_coretoterminal">
		<input type="hidden" value="${boxinfo_coretocore }" id="boxinfo_coretocore">
		<div class="col-sm-6" id="rightclick_contextmenu" onmouseover="rightMenuMouseOver()" onmouseout="rightMenuMouseOut()" style="display:none; z-index:9999; position: absolute;">
			<ul id="menu">
				<c:if test="${boxinfo_showpics != null && boxinfo_showpics == true }">
					<li>
						<a href="javascript:void(0);" onclick="showPics()">光交箱图片</a>
					</li>
				</c:if>
				<c:if test="${boxinfo_boxsetting != null && boxinfo_boxsetting == true}">
					<li>
						<a href="javascript:void(0);" onclick="showSettings()">光交箱设置值</a>
					</li>
				</c:if>
				<c:if test="${boxinfo_modify != null && boxinfo_modify == true}">
					<li>
						<a href="javascript:void(0);" onclick="showModifi()">光交箱下发设置</a>
					</li>
				</c:if>
				<c:if test="${boxinfo_showmodules != null && boxinfo_showmodules == true}">
					<li>
						<a href="javascript:void(0);" onclick="showModules()">光交箱面板图管理</a>
					</li>
				</c:if>
				<c:if test="${boxinfo_showterminals != null && boxinfo_showterminals == true}">
					<li>
						<a href="javascript:void(0);" onclick="showTerminals()">光交箱端子管理</a>
					</li>
				</c:if>
				<c:if test="${boxinfo_showlocks != null && boxinfo_showlocks == true}">
					<li>
						<a href="javascript:void(0);" onclick="managelock()">智能锁管理</a>
					</li>
				</c:if>
				<c:if test="${boxinfo_jumpterminal != null && boxinfo_jumpterminal == true}">
					<li>
						<a href="javascript:void(0);" onclick="jumpTerminal()">跳纤管理</a>
					</li>
				</c:if>
				<c:if test="${boxinfo_coretoterminal != null && boxinfo_coretoterminal == true}">
					<li>
						<a href="javascript:void(0);" onclick="coreToTerminal()">纤芯关联管理</a>
					</li>
				</c:if>
				<c:if test="${boxinfo_coretocore != null && boxinfo_coretocore == true}">
					<li>
						<a href="javascript:void(0);" onclick="coreToCore()">端子直熔管理</a>
					</li>
				</c:if>
			</ul>
		</div><!-- ./span -->

		<div class="main-container" id="main-container" style="background-color: white">
			
			<div class="main-container-inner" style="background-color: #f2f2f2">
				
					<div class="breadcrumbs" id="breadcrumbs">
						
						<ul class="breadcrumb">
							<li>
								<i class="icon-home home-icon"></i>
								<a href="#">首页</a>
							</li>
							<li>
								<a href="#">资源管理</a>
							</li>
							<li class="active">光交箱管理</li>
						</ul>
						<!-- .breadcrumb -->
					</div>
					<div class="page-content">

						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->

								<div class="well well-sm">
									<input id="f_s_box_no" type="text" placeholder="光交箱编号"/>-
									<input id="f_s_controller_id" type="text" placeholder="控制器ID"/>-
									
									<input id="f_s_box_address" type="text" placeholder="光交箱地址"/>-
									<input id="f_s_box_sim_no" type="text" placeholder="SIM卡号"/>-
								
									<input type="text" id="f_s_department_name" readonly placeholder="所属部门"></input>
								  <a class="green" href="javascript:void(0);" onclick="cancelDepartment('f_s_department_name', 'f_s_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	<a class="green" href="javascript:void(0);" onclick="chooseDepartment('f_s_department_name', 'f_s_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="f_s_department_id"/>
									&nbsp;<a class="green" href="javascript:void(0);" onclick="fastsearch()" title="快速检索"><i class="icon-search bigger-130"></i></a>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<!-- <button onclick="detailsearch()" class="btn btn-xs btn-success">
										高级检索
										<i class="icon-zoom-in icon-on-right"></i>
									</button> -->

									<button onclick="resetsearch()" class="btn btn-xs btn-success">
										重置检索
										<i class="icon-refresh icon-on-right"></i>
									</button> 
								</div>

								<div id="add_statekey_mark_div" class="alert alert-danger" style="display:none;">
									<i class="icon-hand-right"></i>
									<label id="add_statekey_mark_label"></label>
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
				<!-- /.row -->
			</div>
		<!-- /.main-container-inner -->
		<a href="#" id="btn-scroll-up"
			class="btn-scroll-up btn btn-sm btn-inverse"> <i
			class="icon-double-angle-up icon-only bigger-110"></i> </a>
		</div>
		<!-- /.main-container -->
		<div id="dialog-pics" class="hide">
			<div id="thumbs"></div>
		</div>



		<div id="dialog-uploadexcel" class="hide">
			<div id="dialog-uploadexcel-div" style="padding:10px 50px 20px 50px">
				<input type="file" name="uploadexcel" id="uploadexcel">
			</div>
		</div>
		
		<div id="dialog-terminals" class="hide">
			<div id="terminals_tree_div" style="width:200px; border:1px solid #efefef; float:left;">
				<div id="terminals_tree" class="ztree">
					
				</div>
			</div>
			<div style="width:550px; float:left; margin-left:20px;" id="terminals_table">
				
			</div>
		</div>
		
		<div id="dialog-boxsettings" class="hide">
			<div style="padding:10px 50px 20px 50px">
		        <form id="u_boxsettings" method="post">
		            <table width="100%" height="auto" cellpadding="5">
		                <tr>
		                    <td>标志位:</td>
		                    <td>
		                		全局<input id="u_boxsettings_flag_yes" checked="checked" name="u_boxsettings_flag" type="radio" value="1"/>&nbsp;&nbsp;
		                		个体<input id="u_boxsettings_flag_no" name="u_boxsettings_flag" type="radio" value="0"/>
		                		
		                    	<input type="hidden" id="u_boxsettings_id"/>
		                    </td>
		                </tr>
		                <tr>
		                    <td>控制器心跳间隔:</td>
		                    <td><input type="text" id="u_boxsettings_hb_interval"></input></td>
		                </tr>
		                <tr>
		                    <td>电压阈值:</td>
		                    <td><input type="text" id="u_boxsettings_volt_threshold"></input></td>
		                </tr>
		                <tr>
		                    <td>柜体倾斜角度阈值:</td>
		                    <td><input type="text" id="u_boxsettings_angle_threshold"></input></td>
		                </tr>
		                <tr>
		                    <td>高温阈值:</td>
		                    <td><input type="text" id="u_boxsettings_high_t_threshold"></input></td>
		                </tr>
		                <tr>
		                    <td>低温阈值:</td>
		                    <td><input type="text" id="u_boxsettings_low_t_threshold"></input></td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td>
		                    	<textarea id="u_boxsettings_remarks" rows="5" cols="70"></textarea>
		                    </td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div>
		
		<div id="dialog-boxmodifi" class="hide">
			<div style="padding:10px 50px 20px 50px">
		        <form id="u_boxmodifi" method="post">
		            <table width="100%" height="auto" cellpadding="5">
		                <tr>
		                    <td>标志位:</td>
		                    <td>
		                		全局<input id="u_boxmodifi_flag_yes" checked="checked" name="u_boxmodifi_flag" type="radio" value="1"/>&nbsp;&nbsp;
		                		个体<input id="u_boxmodifi_flag_no" name="u_boxmodifi_flag" type="radio" value="0"/>
		                		
		                    	<input type="hidden" id="u_boxmodifi_id"/>
		                    </td>
		                </tr>
		                <tr>
		                    <td>震动阈值:</td>
		                    <td><input type="text" id="u_boxmodifi_shake_threshold"></input></td>
		                </tr>
		                <tr>
		                    <td>震动频率:</td>
		                    <td><input type="text" id="u_boxmodifi_shake_rate"></input></td>
		                </tr>
		                <tr>
		                    <td>数据中心IP地址:</td>
		                    <td><input type="text" id="u_boxmodifi_center_ip"></input></td>
		                </tr>
		                <tr>
		                    <td>数据中心upd端口号:</td>
		                    <td><input type="text" id="u_boxmodifi_center_upd_port"></input></td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td>
		                    	<textarea id="u_boxmodifi_remarks" rows="5" cols="70"></textarea>
		                    </td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div>


		<div id="dialog-message" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="a_form" method="post">
		        	<label><h4>1 基本信息</h4></label>
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table width="100%" height="auto" cellpadding="5">
		                <tr>
		                    <td>编号:</td>
		                    <td>
		                    	<input id="a_box_no" name="a_box_no" type="text"></input><font style="color:red">*</font>
		                    	<input type="hidden" id="a_id" name="a_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>控制器:</td>
		                    <td><input type="text" id="a_controller_id" name="a_controller_id"></input><font style="color:red">*</font></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>K码:</td>
		                    <td><input type="text" id="a_k_code" name="k_code"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>位置:</td>
		                    <td><input type="text" id="a_address" name="a_address"></input><font style="color:red">*</font></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>业务区:</td>
		                    <td><input type="text" id="a_business_area" name="business_area"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>SIM_PHONE_NO:</td>
		                    <td><input type="text" id="a_sim_phone_no" name="sim_phone_no"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>GPS经度:</td>
		                    <td><input type="text" id="a_longitude" name="longitude"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>GPS纬度:</td>
		                    <td><input type="text" id="a_latitude" name="latitude"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>所属部门:</td>
		                    <td>
		                    	<input type="text" id="a_department_name" name="a_department_name" readonly="readonly"></input><font style="color:red">*</font>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('a_department_name', 'a_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('a_department_name', 'a_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="a_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>型号:</td>
		                    <td>
		                    	<input id="a_box_type" type="text" />
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>维护部门:</td>
		                    <td>
		                    	<input type="text" id="a_workorder_department" name="a_workorder_department" readonly="readonly"></input>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('a_workorder_department', 'a_workorder_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('a_workorder_department', 'a_workorder_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="a_workorder_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                	<td>维护人:</td>
		                	<td>
		                		<input type="text" id="a_workorder_receive_name" readonly="readonly"/>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('a_workorder_receive_name', 'a_workorder_receive_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('a_workorder_receive_name', 'a_workorder_receive_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="a_workorder_receive_id"/>
		                	</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                	<td>是否短信通知:</td>
		                	<td colspan="2">
		                		通知<input id="a_message_yes" checked="checked" name="a_message" type="radio" value="1"/>&nbsp;&nbsp;
		                		不通知<input id="a_message_no" name="a_message" type="radio" value="0"/>
		                	</td>
		                </tr>
		                <tr>
		                	<td>原因:</td>
		                	<td colspan="2"><textarea id="a_sms_reason" rows="5" cols="70"></textarea></td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="a_remarks" rows="5" cols="70" name="remarks"></textarea></td>
		                </tr>
		            </table>
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		        	<label><h4>2 光交箱设置值和下发设置值</h4></label>
		        	<table width="100%" cellpadding="5">
		        		<tr>
		        			<td width="200px">光交箱设置值来源:</td>
		        			<td>
		        				全局<input id="a_boxsetting_yes" checked="checked" name="a_boxsetting" type="radio" value="1"/>&nbsp;&nbsp;
		        				个体<input type="radio" id="a_boxsetting_no" name="a_boxsetting" value="0"/>
		        			</td>
		        		</tr>
		        		<tr>		        		
		        			<td>下发设置值来源:</td>
		        			<td>
		        				全局<input id="a_modification_yes" checked="checked" name="a_modification" type="radio" value="1"/>&nbsp;&nbsp;
		        				个体<input id="a_modification_no" name="a_modification" type="radio" value="0"/>
		        			</td>
		        		</tr>
		        	</table>
		        	<!-- <HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		        	<label><h4>3 面板管理</h4><a class="green" href="javascript:void(0);" onclick="addBoxModuleRow()"  title="增加面板"><i class="icon-plus bigger-130"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="deleteBoxModuleRow()"  title="删除面板"><i class="icon-minus bigger-130"></i></a></label>
		        	<table width="100%" cellpadding="5" class="mytable">
		        		<tr align="center">
						   <td>模块</td>
						   <td>行数</td>
						   <td>列数</td>
						 </tr>
						<tbody  id="boxModules">
						</tbody>	
		        	</table> -->
		        </form>
		     </div>
		</div><!-- #dialog-message -->
		
		<div id="dialog-message-update" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="u_form" method="post">
		        	<label><h4>1 基本信息</h4></label>
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table width="100%" height="auto" cellpadding="5">
		                <tr>
		                    <td>编号:</td>
		                    <td>
		                    	<input id="u_box_no" name="u_box_no" type="text"></input><font style="color:red">*</font>
		                    	<input type="hidden" id="u_id" name="u_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>控制器:</td>
		                    <td><input type="text" id="u_controller_id" name="u_controller_id"></input><font style="color:red">*</font></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>K码:</td>
		                    <td><input type="text" id="u_k_code" name="k_code"></input></td>
		                    <td>&nbsp;</td>
		               	</tr>
		               	<tr>
		                    <td>位置:</td>
		                    <td><input type="text" id="u_address" name="u_address"></input><font style="color:red">*</font></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>业务区:</td>
		                    <td><input type="text" id="u_business_area" name="business_area"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>SIM_PHONE_NO:</td>
		                    <td><input type="text" id="u_sim_phone_no" name="sim_phone_no"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>GPS经度:</td>
		                    <td><input type="text" id="u_longitude" name="longitude"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>GPS纬度:</td>
		                    <td><input type="text" id="u_latitude" name="latitude"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>所属部门:</td>
		                    <td>
		                    	<input type="text" id="u_department_name" name="u_department_name" readonly="readonly"></input><font style="color:red">*</font>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('u_department_name', 'u_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('u_department_name', 'u_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="u_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>型号:</td>
		                    <td>
		                    	<input id="u_box_type" type="text" />
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>维护部门:</td>
		                    <td>
		                    	<input type="text" id="u_workorder_department" name="u_workorder_department" readonly="readonly"></input>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('u_workorder_department', 'u_workorder_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('u_workorder_department', 'u_workorder_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="u_workorder_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                	<td>维护人:</td>
		                	<td>
		                		<input type="text" id="u_workorder_receive_name" readonly="readonly"/>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('u_workorder_receive_name', 'u_workorder_receive_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('u_workorder_receive_name', 'u_workorder_receive_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="u_workorder_receive_id"/>
		                	</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                	<td>是否短信通知:</td>
		                	<td colspan="2">
		                		通知<input id="u_message_yes" checked="checked" name="u_message" type="radio" value="1"/>&nbsp;&nbsp;
		                		不通知<input id="u_message_no" name="u_message" type="radio" value="0"/>
		                	</td>
		                </tr>
		                <tr>
		                	<td>原因:</td>
		                	<td colspan="2"><textarea id="u_sms_reason" rows="5" cols="70"></textarea></td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="u_remarks" rows="5" cols="70" name="remarks"></textarea></td>
		                </tr>
		            </table>
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		        	<label><h4>2 光交箱设置值和下发设置值</h4></label>
		        	<table width="100%" cellpadding="5">
		        		<tr>
		        			<td width="200px">光交箱设置值来源:</td>
		        			<td>
		        				全局<input id="u_boxsetting_yes" checked="checked" name="u_boxsetting" type="radio" value="1"/>&nbsp;&nbsp;
		        				个体<input type="radio" id="u_boxsetting_no" name="u_boxsetting" value="0"/>
		        			</td>
		        		</tr>
		        		<tr>		        		
		        			<td>下发设置值来源:</td>
		        			<td>
		        				全局<input id="u_modification_yes" checked="checked" name="u_modification" type="radio" value="1"/>&nbsp;&nbsp;
		        				个体<input id="u_modification_no" name="u_modification" type="radio" value="0"/>
		        			</td>
		        		</tr>
		        	</table>
		        	<!-- <HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		        	<label><h4>3 面板管理</h4></label>
		        	<table width="100%" class="mytable">
		        		<tr align="center">
						   <td>模块</td>
						   <td>行数</td>
						   <td>列数</td>
						 </tr>
						<tbody  id="u_boxModules">
						</tbody>
		        	</table> -->
		        </form>
		     </div>
		</div><!-- #dialog-message-update -->
		
		
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
		
		<div id="dialog-progressbar" class="hide">
			 <div style="padding:10px 10px 20px 10px">
			 	<div id="progressbar"></div>
		     </div>
		</div><!-- #dialog-bar -->
	
		
		<div id="dialog-modules" class="hide">
			 <div id="dialog-modules-tables" style="padding:10px 20px 20px 20px; width:100%; height:auto;">
			 	
		     </div>
		</div><!-- #dialog-modules -->
		
		<div id="dialog-jump" class="hide">
			 <div id="dialog-jump-tables" style="padding:10px 20px 20px 20px; width:100%; height:auto;">
		     </div>
		</div><!-- #dialog-modules -->
		
		<div id="dialog-core-to-terminal" class="hide">
			 <div id="dialog-core-to-terminal-tables" style="padding:10px 20px 20px 20px; width:100%; height:auto;">
		     </div>
		</div><!-- #dialog-modules -->
		
		<div id="dialog-core-to-core" class="hide">
			 <div id="dialog-core-to-core-tables" style="padding:10px 20px 20px 20px; width:100%; height:auto;">
		     </div>
		</div><!-- #dialog-modules -->
		
		<div id="dialog-show-core-to-terminal" class="hide">
			<div style="padding:10px 20px 20px 20px; width:100%; height:auto;">
				<table width="100%" height="auto">
					<tr>
						<td style="text-align: right;" id="core-left-use-tip"></td>
						<td width="330">─────────────────────────</td>
						<td style="text-align: left;" id="core-right-use-tip"></td>
					</tr>
					<tr>
						<td colspan="3" style="text-align: center;" id="core-info"></td>
					</tr>
				</table>
			</div>
		</div><!-- #dialog-modules -->
		
		<div id="dialog-manage-lock" class="hide">
			 <div style="padding:10px 20px 20px 20px; width:100%; height:auto;">
			 	<div id="manage_lock_warn" class="alert alert-danger" style="display:none;">
					<i class="icon-hand-right"></i>
					<label id="manage_lock_warn_label"></label>
					<button class="close" data-dismiss="alert">
						<i class="icon-remove"></i>
					</button>
				</div>
				<table id="manage-lock-grid-table"></table>

				<div id="manage-lock-grid-pager"></div>
			 	
		     </div>
		</div><!-- #dialog-modules -->
		
		<div id="dialog-add-lock" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="a_form_lock" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>锁编号:</td>
		                    <td>
		                    	<input id="a_lock_lock_code" type="text"></input>
		                    </td>
		                </tr>
		                <tr>
		                    <td>所属光交箱名称:</td>
		                    <td>
		                    	<input type="text" id="a_lock_box_no" readonly="readonly"></input>
		                    	<input type="hidden" id="a_lock_box_id"></input>
		                    </td>
		                </tr>
		                <tr>
		                    <td>锁类型:</td>
		                    <td>
		                    	<select id="a_lock_type_id">
		                    	</select>&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="addLockType()"  title="添加锁类型"><i class="icon-plus-sign bigger-130"></i></a>
		                    </td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="3"><textarea id="a_lock_remarks" rows="5" cols="40" name="remarks"></textarea></td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-add-lock -->
		
		<div id="dialog-add-locktype" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="a_form_locktype" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>锁类型:</td>
		                    <td>
		                    	<input id="a_locktype_type" type="text"></input>
		                    </td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="3"><textarea id="a_locktype_remarks" rows="5" cols="40" name="remarks"></textarea></td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-add-locktype -->
		
		<div id="dialog-search-boxinfo" class="hide">
			<div style="padding:10px 50px 20px 50px">
				<form id="d_search_form">
					<table width="100%" height="auto" cellpadding="5">
						<tr>
							<td>控制器ID：</td>
							<td><input type="text" id="s_controller_id" value=""/></td>
						</tr>
						<tr>
							<td>光交箱编号：</td>
							<td><input type="text" id="s_box_no" value=""/></td>
						</tr>
						<tr style="display: none;">
							<td>光交箱名称：</td>
							<td><input type="text" id="s_box_name" value=""/></td>
						</tr>
						<tr>
							<td>所属部门：</td>
							<td>
								<input type="text" id="s_department_name" value=""></input>
								&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('s_department_name', 's_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('s_department_name', 's_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="s_department_id"/>
							</td>
						</tr>
						<tr>
							<td>地址：</td>
							<td><input type="text" id="s_box_address" value=""/></td>
						</tr>
						<tr>
							<td>光交箱类型：</td>
							<td><input type="text" id="s_box_type" value=""/></td>
						</tr>
						<tr>
							<td>SIM卡号：</td>
							<td><input type="text" id="s_box_sim_no" value=""/></td>
						</tr>
						<tr>
							<td>锁数量：</td>
							<td><input type="text" id="s_box_locks_count" value=""/></td>
						</tr>
					</table>
				</form>
			</div>
		</div><!-- #dialog-search-boxinfo -->
		
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
		<script type="text/javascript" src="js/jquery.ztree.core-3.5.js"></script>
		<script type="text/javascript" src="js/jquery.ztree.excheck-3.5.js"></script>

		<!-- ace scripts -->

		<script src="assets/js/ace-elements.min.js"></script>
		<script src="assets/js/ace.min.js"></script>
		<script src="js/common/global.js"></script>
		<script src="js/boxinfoList.js"></script>
		<script src="assets/touchTouch/touchTouch.jquery.js"></script>
		<script src="assets/js/script.js"></script>
		<script src="js/ajaxfileupload.js"></script>
		<script src="assets/js/bootstrap.min.js"></script>



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
		    
			document.onkeydown=yxl;
			document.onmousedown=scrollFunc;
		});
		// 绑定部门树结束
		</script>
		
	</body>
</html>

