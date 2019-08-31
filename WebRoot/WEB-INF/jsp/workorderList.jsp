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
		
		<style>
			table.ui-jqgrid-btable td {
				white-space: pre-wrap;
				word-wrap: break-word;
			}
		
		</style>
		<script>
			function yxl() { 
				if(window.event.altKey) 
				{
					window.event.returnValue=false;
				}
			}

			function scrollFunc() {
				var e = window.event;
				console.log(e.button);
				if (e.button == 0)
				{
					if ($('#rightclick_contextmenu').css('display') == 'block')
					{
						if (e.pageX < g_obj.rightClickPos.pageX || e.pageX > (g_obj.rightClickPos.pageX + 160) || e.pageY < g_obj.rightClickPos.pageY || e.pageY > (g_obj.rightClickPos.pageY + 30))
						{
							$('#rightclick_contextmenu').hide();
						}
					}
				}
			}
		
		</script> 
	</head>

	<body   oncontextmenu="return false">
		<input type="hidden" value="${sessionScope.user_id }" id="user_id">
		<input type="hidden" value="${workorder_add }" id="workorder_add">
		<input type="hidden" value="${workorder_update }" id="workorder_update">
		<input type="hidden" value="${workorder_delete } }" id="workorder_delete">
		<div class="col-sm-6" id="rightclick_contextmenu" onmouseover="rightMenuMouseOver()" onmouseout="rightMenuMouseOut()" style="display:none; z-index:9999; position: absolute;">
			<ul id="menu">
				 <li>
					<a href="javascript:void(0);" onclick="showDetail()">查看详情</a>
				</li>
				<li>
					<a href="javascript:void(0);" onclick="showPics()">工单图片</a>
				</li>
			</ul>
		</div><!-- ./span -->


		<div class="main-container" id="main-container" style="background-color: white">
			

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
								<a href="#">日常维护管理</a>
							</li>
							<li class="active">工单管理</li>
						</ul>
						<!-- .breadcrumb -->
					</div>
					<div class="page-content">
						
						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->

								<div class="well well-sm">
									工单编号：<input id="f_s_order_no" type="text" placeholder="工单编号"/>
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
		<div id="dialog-message" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="a_form" method="post">
		        	<label><h4>1 基本信息</h4></label>
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>编号:</td>
		                    <td>
		                    	<input id="a_order_no" name="a_order_no" type="text"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>名称:</td>
		                    <td>
		                    	<input type="text" id="a_title" name="a_title"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>

		                  <tr>
		                    <td>光交箱:</td>
		                    <td>
		                    	<input type="text" value="" id="c_box" readonly="readonly"/><input type="hidden" value="" id="c_box_id" readonly="readonly"/>
			        		<a class="green" href="javascript:void(0);" onclick="clearBox('c_box', 'c_box_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
							<a class="green" href="javascript:void(0);" onclick="chooseBox('c_box', 'c_box_id')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a> 
							<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>

		                <tr>
		                    <td>接受部门:</td>
		                    <td>
		                    	<input type="text" id="a_department_name" readonly="readonly"></input>
		                    	<font style="color:red;">*</font>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('a_department_name', 'a_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('a_department_name', 'a_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="a_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                	<td>接收人:</td>
		                	<td>
		                		<input type="text" id="a_workorder_receive_name" readonly="readonly"/>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('a_workorder_receive_name', 'a_workorder_receive_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('a_workorder_receive_name', 'a_workorder_receive_id', 'a_department_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="a_workorder_receive_id"/>
		                	</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                	<td>工单类型:</td>
		                	<td>
		                		<select name="a_order_type" id="a_order_type" onchange="changeordertype()">
		                			<option value="1">资源配置</option>
		                			<option value="3">其他</option>
		                		</select>
		                	</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>预计开始时间:</td>
		                    <td>
		                    	<input type="text" id="a_respect_starttime"  value="" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})">
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>预计结束时间:</td>
		                    <td>
								<input type="text" id="a_respect_endtime"  value="" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})">
		                    	<font style="color:red;">*</font>
							</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="a_remarks" rows="5" cols="70" name="remarks"></textarea></td>
		                </tr>
		            </table>
		   			<div id="a_is_resourcestask" style="width:100%; height:auto;">
			        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
			        	<label>
			        		<h4>2 工单信息</h4>
			        		工单类型:<select id="a_type">
			        			<option value="0"></option>
			        			<option value="1">跳纤</option>
			        			<option value="2">成端</option>
			        			<option value="3">直熔</option>
			        		</select>
			        		光交箱:<input type="text" value="" id="a_box" readonly="readonly"/><input type="hidden" value="" id="a_box_id" readonly="readonly"/>
			        		<a class="green" href="javascript:void(0);" onclick="clearBox('a_box', 'a_box_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
							<a class="green" href="javascript:void(0);" onclick="chooseBox('a_box', 'a_box_id')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a> 
							选择方式:<select id="a_style">
			        			<option value="0"></option>
			        			<option value="1">严格成对</option>
			        			<!-- <option value="2">批量成对</option> -->
			        		</select>
			        		<button onclick="return startchoose()" class="btn btn-xs btn-success">
								开始选择
								<i class="icon-ok icon-on-right"></i>
							</button>
						</label>
			        	<table width="100%" class="mytable" style="margin-top:20px;">
			        		<tr align="center">
							   <td>类型</td>
							   <td>光交箱</td>
							   <td>一端</td>
							   <td>另一端</td>
							   <td></td>
							 </tr>
							<tbody  id="a_info">
							</tbody>	
			        	</table>
			        </div>
		        </form>
		     </div>
		</div><!-- #dialog-message -->
		
		<div id="dialog-message-update" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="u_form" method="post">
		        	<label><h4>1 基本信息</h4></label>
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>编号:</td>
		                    <td>
		                    	<input id="u_id" name="u_id" type="hidden" />
		                    	<input id="u_order_no" name="u_order_no" type="text"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>名称:</td>
		                    <td>
		                    	<input type="text" id="u_title" name="u_title"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>

		               <!--    <tr id="updateboxinfo" class="hide">
		                    <td>光交箱:</td>
		                    <td>
		                    	<input type="text" value="" id="b_box" readonly="readonly"/><input type="hidden" value="" id="b_box_id" readonly="readonly"/>
			        		<a class="green" href="javascript:void(0);" onclick="clearBox('b_box', 'b_box_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
							<a class="green" href="javascript:void(0);" onclick="chooseBox('b_box', 'b_box_id')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a> 
							<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr> -->

		                <tr>
		                    <td>接受部门:</td>
		                    <td>
		                    	<input type="text" id="u_department_name" readonly="readonly"></input>
		                    	<font style="color:red;">*</font>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('u_department_name', 'u_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('u_department_name', 'u_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="u_department_id"/>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                	<td>接收人:</td>
		                	<td>
		                		<input type="text" id="u_workorder_receive_name" readonly="readonly"/>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('u_workorder_receive_name', 'u_workorder_receive_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('u_workorder_receive_name', 'u_workorder_receive_id', 'u_department_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="u_workorder_receive_id"/>
		                	</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                	<td>工单类型:</td>
		                	<td>
		                		<select name="u_order_type" id="u_order_type" disabled="disabled">
		                			<option value="1">资源配置</option>
		                			<option value="2">告警</option>
		                			<!-- <option value="3">其他</option> -->
		                		</select>
		                	</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>预计开始时间:</td>
		                    <td>
		                    	<input type="text" id="u_respect_starttime"  value="" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})">
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>预计结束时间:</td>
		                    <td>
								<input type="text" id="u_respect_endtime"  value="" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})">
		                    	<font style="color:red;">*</font>
							</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="u_remarks" rows="5" cols="70" name="u_remarks"></textarea></td>
		                </tr>
		            </table>

		            <div id="a_is_resourcestask_update" style="width:100%; height:auto;">
			        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
			        	<label>
			        		<h4>2 工单信息</h4>
			        		<!-- 工单类型:<select id="a_type_update">
			        			<option value="0"></option>
			        			<option value="1">跳纤</option>
			        			<option value="2">成端</option>
			        			<option value="3">直熔</option>
			        		</select>

			        		<input type="hidden" value="1" id="a_style_update">
			        		
			        		<button onclick="return startchooseforupdate()" class="btn btn-xs btn-success">
								开始选择
								<i class="icon-ok icon-on-right"></i>
							</button> -->
						</label>
			        	<table width="100%" class="table table-striped table-bordered table-hover js-table" style="margin-top:10px;">
			        		<tr align="center">
							   <td>类型</td>
							   <td>光交箱</td>
							   <td>一端</td>
							   <td>另一端</td>
							  <!--  <td></td> -->
							 </tr>
							<tbody  id="a_info_update">

							</tbody>	
			        	</table>

           

			        </div>

			            <div id="a_is_alert_update" style="width:100%; height:auto;">
			        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
			        	<label>
			        		<h4>3 告警信息</h4>
			        	
						</label>
			        	<table width="100%" class="table table-striped table-bordered table-hover js-table" style="margin-top:10px;">
			        		<tr align="center">
							   <td>告警类型</td>
							   <td>光交箱</td>
							   <td>告警时间</td>
							 </tr>
							 <tbody  id="a_info_alert">
							</tbody>	
			        	</table>
			        </div>
			        
		        </form>
		     </div>
		</div><!-- #dialog-message-update -->


			<div id="dialog-view" class="hide">
			 <div style="padding:10px 50px 20px 50px">
				<table width="100%" class="table table-striped table-bordered table-hover js-table" >
					<tr>
                    <th colspan=4 class="success">
	                 基本信息
                     </th>
					</tr>
					<tr>
						<td>工单编号：</td>
						<td><span id="view_order_no"></span></td>
					
						<td>工单名称:</td>
						<td><span id="view_title"></span></td>
					</tr>
					<tr>
						<td>工单类型：</td>
						<td><span id="view_type"></span></td>
					
						<td>创建人：</td>
						<td><span id="view_user"></span></td>
					</tr>
					<tr>
						<td >创建时间：</td>
						<td colspan=3><span id="view_create_time"></span></td>
					</tr>
					
					<tr>
						<td>创建类型：</td>
						<td><span id="view_create_type"></span></td>
					
						<td>工单状态：</td>
						<td><span id="view_done_type"></span></td>
					</tr>

					<tr>
						<td>接收部门:</td>
						<td><span id="view_department_id"></span></td>
					
						<td>接收人:</td>
						<td><span id="view_receive_operators_id"></span></td>
					</tr>

					<tr >
						<td >接收时间:</td>
						<td ><span id="view_receive_time"></span></td>
						<td >备注:</td>
						<td ><span id="view_remarks"></span></td>
	
					</tr>
				</table>	
              
               <table width="100%" class="table table-striped table-bordered table-hover js-table" >
					<th colspan=4  class="success">
	                 告警信息
                    </th>
                    <tr align="center">
					
					<td>告警类型</td>
					<td colspan=2>光交箱</td>
					<td>告警时间</td>
					
					</tr>
					<tbody  id="v_info_alert">
					</tbody>

				</table>	

				 <table width="100%" class="table table-striped table-bordered table-hover js-table" >
					<th colspan=4  class="success">
	                资源配置信息
                    </th>
                    <tr align="center">
					
					<td>类型</td>
					<td>光交箱</td>
					<td>一端</td>
					<td>另一端</td>
					</tr>
					<tbody  id="v_info_res">
					</tbody>

				</table>	
		     </div>
		</div><!-- #dialog-view -->
		
		<div id="dialog-box-tree" class="hide">
			 <div style="padding:10px 50px 20px 50px">
					<div id="box_tree" class="ztree"></div>
		     </div>
		</div><!-- #dialog-department -->
		
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
		                    	<input type="text" id="a_lock_box_name" readonly="readonly"></input>
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
		                    <td>所属部门:</td>
		                    <td>
		                    	<input type="text" id="a_lock_department_name"></input>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('a_lock_department_name', 'a_lock_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('a_lock_department_name', 'a_lock_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="a_lock_department_id"/>
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
					<table cellpadding="5">
						<tr>
							<td>工单编号：</td>
							<td><input type="text" id="s_order_order_no" value=""/></td>
						</tr>
						<tr>
							<td>创建人：</td>
							<td>
								<input type="text" id="s_order_create_user_name" readonly="readonly"/>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('s_order_create_user_name', 's_order_create_user_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('s_order_create_user_name', 's_order_create_user_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="s_order_create_user_id"/>
							</td>
						</tr>
						<tr>
							<td>工单类型：</td>
							<td>
								资源配置<input type="radio" name="s_order_type" value="1"/>
								告警<input type="radio" name="s_order_type" value="2"/>
								维修<input type="radio" name="s_order_type" value="3"/>
							</td>
						</tr>
						<tr>
							<td>创建类型：</td>
							<td>
								
								服务器自动产生<input type="radio" name="s_order_create_type" value="1"/>
								手工生成<input type="radio" name="s_order_create_type" value="2"/>
								维修申请<input type="radio" name="s_order_create_type" value="3"/>
							</td>
						</tr>
						<tr>
							<td>工单状态：</td>
							<td>
								未接受<input type="radio" name="s_order_done_type" value="1"/>
								已接受<input type="radio" name="s_order_done_type" value="2"/>
								已完成<input type="radio" name="s_order_done_type" value="3"/>
							</td>
						</tr>
						<tr>
							<td>接受部门：</td>
							<td>
								<input type="text" id="s_department_name" readonly="readonly" value=""></input>
								&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelDepartment('s_department_name', 's_department_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseDepartment('s_department_name', 's_department_id')"  title="选择部门"><i class="icon-list bigger-130"></i></a>
		                    	<input type="hidden" id="s_department_id"/>
							</td>
						</tr>
						<tr>
							<td>接受人：</td>
							<td>
								<input type="text" id="s_order_receive_user_name" readonly="readonly"/>
		                    	&nbsp;&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="cancelUser('s_order_receive_user_name', 's_order_receive_user_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
		                    	&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseUser('s_order_receive_user_name', 's_order_receive_user_id')"  title="选择人员"><i class="icon-list bigger-130"></i></a>
		                		<input type="hidden" id="s_order_receive_user_id"/>
							</td>
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
		<script src="assets/js/bootstrap.min.js"></script>
		<script src="assets/js/typeahead-bs2.min.js"></script>

		<!-- page specific plugin scripts -->

		<!--[if lte IE 8]>
		  <script src="assets/js/excanvas.min.js"></script>
		<![endif]-->

		<script src="assets/js/jquery-ui-1.10.3.full.min.js"></script>
		<script src="assets/js/jquery.ui.touch-punch.min.js"></script>
		<script src="assets/js/jquery.slimscroll.min.js"></script>
	
		<script src="assets/js/bootbox.min.js"></script>

		
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
		<script src="js/workorderList.js"></script>
		<script src="assets/touchTouch/touchTouch.jquery.js"></script>
		<script src="assets/js/script.js"></script>
		<script src="js/ajaxfileupload.js"></script>
		<script src="assets/js/bootstrap.min.js"></script>
		 <script src="assets/js/bootstrap-table.js"></script>
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
			document.onMouseDown=scrollFunc;
			
		});
		// 绑定部门树结束
		</script>
		
	</body>
</html>

