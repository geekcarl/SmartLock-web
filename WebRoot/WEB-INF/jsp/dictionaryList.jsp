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
								<a href="#">系统设置</a>
							</li>
							<li class="active">数据维护</li>
						</ul>
						<!-- .breadcrumb -->
					</div>
					<div class="page-content">

						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->
								
								<div class="tabbable" id="box_tabs">
									<ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="myTab4" style="height:50px !important;">
										<li class="active">
											<a data-toggle="tab" href="#key">光交箱状态字典</a>
										</li>
		
										<li>
											<a data-toggle="tab" href="#value">光交箱状态项</a>
										</li>
										
										<li>
											<a data-toggle="tab" href="#level">光交箱状态等级</a>
										</li>
										
										<li>
											<a data-toggle="tab" href="#keytype">钥匙类型</a>
										</li>
										
										<li>
											<a data-toggle="tab" href="#locktype">锁类型</a>
										</li>
										
										<li>
											<a data-toggle="tab" href="#backup">数据备份</a>
										</li>
									</ul>
									<div class="tab-content" id="box_tabs_content" style="display: none;">
										<div id="key" class="tab-pane in active" style="width:100%; height:100%; overflow: auto;">
											<div id="add_statekey_mark_div" class="alert alert-danger" style="display:none;">
												<i class="icon-hand-right"></i>
												<label id="add_statekey_mark_label"></label>
												<button class="close" data-dismiss="alert">
													<i class="icon-remove"></i>
												</button>
											</div>
			
											<table width="100%" id="grid-table"></table>
			
											<div id="grid-pager"></div>
										</div>
		
										<div id="value" class="tab-pane" style="width:100%; height:100%; overflow: auto;">
											<div id="add_statevalue_mark_div" class="alert alert-danger" style="display:none;">
												<i class="icon-hand-right"></i>
												<label id="add_statevalue_mark_label"></label>
												<button class="close" data-dismiss="alert">
													<i class="icon-remove"></i>
												</button>
											</div>
											<table width="100%" id="value-grid-table"></table>
			
											<div id="value-grid-pager"></div>
										</div>
										
										<div id="level" class="tab-pane" style="width:100%; height:100%; overflow: auto;">
											<div id="add_statelevel_mark_div" class="alert alert-danger" style="display:none;">
												<i class="icon-hand-right"></i>
												<label id="add_statelevel_mark_label"></label>
												<button class="close" data-dismiss="alert">
													<i class="icon-remove"></i>
												</button>
											</div>
											<table width="100%" id="level-grid-table"></table>
			
											<div id="level-grid-pager"></div>
										</div>
										
										<div id="keytype" class="tab-pane" style="width:100%; height:100%; overflow: auto;">
			
											<div id="add_keytype_mark_div" class="alert alert-danger" style="display:none;">
												<i class="icon-hand-right"></i>
												<label id="add_keytype_mark_label"></label>
												<button class="close" data-dismiss="alert">
													<i class="icon-remove"></i>
												</button>
											</div>
											<table width="100%" id="keytype-grid-table"></table>
			
											<div id="keytype-grid-pager"></div>
										</div>
										
										<div id="locktype" class="tab-pane" style="width:100%; height:100%; overflow: auto;">
			
											<div id="add_locktype_mark_div" class="alert alert-danger" style="display:none;">
												<i class="icon-hand-right"></i>
												<label id="add_locktype_mark_label"></label>
												<button class="close" data-dismiss="alert">
													<i class="icon-remove"></i>
												</button>
											</div>
											<table width="100%" id="locktype-grid-table"></table>
			
											<div id="locktype-grid-pager"></div>
										</div>
										
										<div id="backup" class="tab-pane" style="width:100%; height:100%; overflow: auto;">
			
											<div id="add_backup_mark_div" class="alert alert-danger" style="display:none;">
												<i class="icon-hand-right"></i>
												<label id="add_backup_mark_label"></label>
												<button class="close" data-dismiss="alert">
													<i class="icon-remove"></i>
												</button>
											</div>
											<table width="100%" id="backup-grid-table"></table>
			
											<div id="backup-grid-pager"></div>
										</div>
									</div>
								</div>

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
		<div id="dialog-add-state-key" class="hide">
			<div id="add_statekey_mark_div_error" class="alert alert-danger" style="display:none;">
				<i class="icon-hand-right"></i>
				<label id="add_statekey_mark_label_error"></label>
				<button class="close" data-dismiss="alert">
					<i class="icon-remove"></i>
				</button>
			</div>
			 <div style="padding:10px 20px 10px 20px">
		        <form class="cmxform" id="form-add-state-key" method="post" action="dictionary.do?method=addStateKey">
				  <fieldset>
				    <table width="100%" cellpadding="5">
						<tr>
							<td width="100px">
								<label for="add_statekey_state_key">状态名：</label>
							</td>
							<td width="300px">
				     			 <input id="add_statekey_state_key" name="state_key" type="text" class="input required"/>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>
								<label for="add_statekey_remarks">备注：</label>
							</td>
							<td>
		             			 <textarea id="add_statekey_remarks" name="remarks" rows="4" cols="30"></textarea>
							</td>
							<td>&nbsp;</td>
						</tr>
					</table>
				  </fieldset>
				</form>
		     </div>
		</div><!-- #dialog-message -->
		
		
		<!-- 修改字典窗口-开始 -->
		<div id="dialog-update-state-key" class="hide">
			<div id="update_statekey_mark_div_error" class="alert alert-danger" style="display:none;">
				<i class="icon-hand-right"></i>
				<label id="update_statekey_mark_label_error"></label>
				<button class="close" data-dismiss="alert">
					<i class="icon-remove"></i>
				</button>
			</div>
			 <div style="padding:10px 20px 10px 20px">
		        <form class="cmxform" id="form-update-state-key" method="post">
				  <input type="hidden" id="update_statekey_id"/>
				  <fieldset>
				    <table width="100%" cellpadding="5">
						<tr>
							<td width="100px">
								<label for="update_statekey_state_key">状态名：</label>
							</td>
							<td width="300px">
				     			 <input id="update_statekey_state_key" name="update_statekey_state_key" type="text" class="input required"/>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>
								<label for="update_statekey_remarks">备注：</label>
							</td>
							<td>
		             			 <textarea id="update_statekey_remarks" name="update_statekey_remarks" rows="4" cols="30"></textarea>
							</td>
							<td>&nbsp;</td>
						</tr>
					</table>
				  </fieldset>
				</form>
		     </div>
		</div><!-- #dialog-message -->
		<!-- 修改字典窗口-结束 -->
		
		
		<!-- 查看字典窗口-开始 -->
		<div id="dialog-view-state-key" class="hide">
			 <div style="pupdateing:10px 20px 10px 20px">
				    <table width="100%" cellpadding="5">
						<tr>
							<td width="100px">
								<label for="view_statekey_state_key">状态名：</label>
							</td>
							<td width="300px">
				     			 <input id="view_statekey_state_key" name="view_statekey_state_key" type="text" readonly="readonly"/>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>
								<label for="view_statekey_remarks">备注：</label>
							</td>
							<td>
		             			 <textarea id="view_statekey_remarks" name="view_statekey_remarks" rows="4" cols="30" readonly="readonly"></textarea>
							</td>
							<td>&nbsp;</td>
						</tr>
					</table>
		     </div>
		</div><!-- #dialog-message -->
		<!-- 查看字典窗口-结束 -->
		
		
		<!-- 添加字典项窗口-开始 -->
		<div id="dialog-add-state-value" class="hide">
			<div id="add_statevalue_mark_div_error" class="alert alert-danger" style="display:none;">
				<i class="icon-hand-right"></i>
				<label id="add_statevalue_mark_label_error"></label>
				<button class="close" data-dismiss="alert">
					<i class="icon-remove"></i>
				</button>
			</div>
			 <div style="padding:10px 20px 10px 20px">
		        <form class="cmxform" id="form-add-state-value" method="post" action="dictionary.do?method=addStateValue">
				  <fieldset>
				    <table width="100%" cellpadding="5">
						<tr>
							<td width="100px">
								<label for="add_statevalue_state_key">状态字典：</label>
							</td>
							<td width="300px">
				     			 <select id="add_statevalue_state_key" name="add_statevalue_state_key" class="select required">
				     			 </select>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td width="100px">
								<label for="add_statevalue_state_value">状态值：</label>
							</td>
							<td width="300px">
				     			 <input id="add_statevalue_state_value" name="add_statevalue_state_value" type="text" class="required"/>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td width="100px">
								<label for="add_statevalue_state_level">状态值等级：</label>
							</td>
							<td width="300px">
				     			 <select id="add_statevalue_state_level" name="add_statevalue_state_level" class="select required">
				     			 </select>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>
								<label for="add_statevalue_remarks">备注：</label>
							</td>
							<td>
		             			 <textarea id="add_statevalue_remarks" name="add_statevalue_remarks" rows="4" cols="30"></textarea>
							</td>
							<td>&nbsp;</td>
						</tr>
					</table>
				  </fieldset>
				</form>
		     </div>
		</div><!-- #dialog-message -->
		<!-- 添加字典项窗口-结束 -->
		
		<!-- 修改字典项窗口-开始 -->
		<div id="dialog-update-state-value" class="hide">
			<div id="update_statevalue_mark_div_error" class="alert alert-danger" style="display:none;">
				<i class="icon-hand-right"></i>
				<label id="update_statevalue_mark_label_error"></label>
				<button class="close" data-dismiss="alert">
					<i class="icon-remove"></i>
				</button>
			</div>
			 <div style="padding:10px 20px 10px 20px">
		        <form class="cmxform" id="form-update-state-value" method="post">
				  <input type="hidden" id="update_statevalue_id"/>
				  <fieldset>
				    <table width="100%" cellpadding="5">
						<tr>
							<td width="100px">
								<label for="update_statevalue_state_key">状态字典：</label>
							</td>
							<td width="300px">
				     			 <select id="update_statevalue_state_key" name="update_statevalue_state_key" class="select required">
				     			 </select>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td width="100px">
								<label for="update_statevalue_state_value">状态值：</label>
							</td>
							<td width="300px">
				     			 <input id="update_statevalue_state_value" name="update_statevalue_state_value" type="text" class="required"/>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td width="100px">
								<label for="update_statevalue_state_level">状态值等级：</label>
							</td>
							<td width="300px">
				     			 <select id="update_statevalue_state_level" name="update_statevalue_state_level" class="select required">
				     			 </select>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>
								<label for="update_statevalue_remarks">备注：</label>
							</td>
							<td>
		             			 <textarea id="update_statevalue_remarks" name="update_statevalue_remarks" rows="4" cols="30"></textarea>
							</td>
							<td>&nbsp;</td>
						</tr>
					</table>
				  </fieldset>
				</form>
		     </div>
		</div><!-- #dialog-message -->
		<!-- 修改字典项窗口-结束 -->
		
		
		<!-- 查看字典项窗口-开始 -->
		<div id="dialog-view-state-value" class="hide">
			 <div style="pupdateing:10px 20px 10px 20px">
				    <table width="100%" cellpadding="5">
						<tr>
							<td width="100px">
								<label for="view_statevalue_state_key">状态字典：</label>
							</td>
							<td width="300px">
				     			 <select id="view_statevalue_state_key" name="view_statevalue_state_key" disabled="disabled">
				     			 </select>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td width="100px">
								<label for="view_statevalue_state_value">状态值：</label>
							</td>
							<td width="300px">
				     			 <input id="view_statevalue_state_value" name="view_statevalue_state_value" type="text" readonly="readonly"/>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td width="100px">
								<label for="view_statevalue_state_level">状态值等级：</label>
							</td>
							<td width="300px">
				     			 <select id="view_statevalue_state_level" name="view_statevalue_state_level" disabled="disabled">
				     			 </select>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>
								<label for="view_statevalue_remarks">备注：</label>
							</td>
							<td>
		             			 <textarea id="view_statevalue_remarks" name="view_statevalue_remarks" rows="4" cols="30" readonly="readonly"></textarea>
							</td>
							<td>&nbsp;</td>
						</tr>
					</table>
		     </div>
		</div><!-- #dialog-message -->
		<!-- 查看字典项窗口-结束 -->
		
		
		<!-- 添加字典等级窗口-开始 -->
		<div id="dialog-add-state-level" class="hide">
			<div id="add_statelevel_mark_div_error" class="alert alert-danger" style="display:none;">
				<i class="icon-hand-right"></i>
				<label id="add_statelevel_mark_label_error"></label>
				<button class="close" data-dismiss="alert">
					<i class="icon-remove"></i>
				</button>
			</div>
			 <div style="padding:10px 20px 10px 20px">
		        <form class="cmxform" id="form-add-state-level" method="post" action="dictionary.do?method=addStateLevel">
				  <fieldset>
				    <table width="100%" cellpadding="5">
						<tr>
							<td width="120px">
								<label for="add_statelevel_level">字典等级：</label>
							</td>
							<td width="300px">
				     			 <input id="add_statelevel_level" name="add_statelevel_level" type="text" class="required"/>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td width="120px">
								<label for="add_statelevel_state_image">字典等级图片：</label>
							</td>
							<td width="300px" id="add_statelevel_state_image_td">
				     			 <div style="float:left;"><input id="add_statelevel_state_image" name="add_statelevel_state_image" type="file"/></div>
				     			 <div style="float:right; width:30px;"><font style="color:red;">*</font></div>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>
								<label for="add_statelevel_remarks">备注：</label>
							</td>
							<td>
		             			 <textarea id="add_statelevel_remarks" name="add_statelevel_remarks" rows="4" cols="30"></textarea>
							</td>
							<td>&nbsp;</td>
						</tr>
					</table>
				  </fieldset>
				</form>
		     </div>
		</div><!-- #dialog-message -->
		<!-- 添加字典等级窗口-结束 -->
		
		
		<!-- 修改字典等级窗口-开始 -->
		<div id="dialog-update-state-level" class="hide">
			<div id="update_statelevel_mark_div_error" class="alert alert-danger" style="display:none;">
				<i class="icon-hand-right"></i>
				<label id="update_statelevel_mark_label_error"></label>
				<button class="close" data-dismiss="alert">
					<i class="icon-remove"></i>
				</button>
			</div>
			 <div style="padding:10px 20px 10px 20px">
		        <form class="cmxform" id="form-update-state-level" method="post">
				  <input type="hidden" id="update_statelevel_id"/>
				  <fieldset>
				    <table width="100%" cellpadding="5">
						<tr>
							<td width="120px">
								<label for="update_statelevel_level">字典等级：</label>
							</td>
							<td width="300px">
				     			 <input id="update_statelevel_level" name="update_statelevel_level" type="text" class="required"/>
				     			 <font style="color:red;">*</font>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td width="120px">
								<label for="update_statelevel_state_image">字典等级图片：</label>
							</td>
							<td width="300px" id="update_statelevel_state_image_td">
				     			 <input id="update_statelevel_state_image" name="update_statelevel_state_image" type="file"/><div id="update_statelevel_state_image_view" width="100%"></div>
							</td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>
								<label for="update_statelevel_remarks">备注：</label>
							</td>
							<td>
		             			 <textarea id="update_statelevel_remarks" name="update_statelevel_remarks" rows="4" cols="30"></textarea>
							</td>
							<td>&nbsp;</td>
						</tr>
					</table>
				  </fieldset>
				</form>
		     </div>
		</div><!-- #dialog-message -->
		<!-- 修改字典等级窗口-结束 -->
		
		
		<!-- 查看字典等级窗口-开始 -->
		<div id="dialog-view-state-level" class="hide">
			 <div style="padding:10px 20px 10px 20px">
				    <table width="100%" cellpadding="5">
						<tr>
							<td width="120px">
								<label for="view_statelevel_level">字典等级：</label>
							</td>
							<td>
				     			 <input id="view_statelevel_level" type="text" readonly="readonly"/>
							</td>
						</tr>
						<tr>
							<td width="120px">
								<label for="view_statelevel_state_image">字典等级图片：</label>
							</td>
							<td id="view_statelevel_state_image">
				     			 
							</td>
						</tr>
						<tr>
							<td>
								<label for="view_statelevel_remarks">备注：</label>
							</td>
							<td>
		             			 <textarea id="view_statelevel_remarks" readonly="readonly" rows="4" cols="70"></textarea>
		             			 
							</td>
						</tr>
					</table>
		     </div>
		</div><!-- #dialog-message -->
		<!-- 查看字典等级窗口-结束 -->
		<!-- 添加钥匙类型 -->
		<div id="dialog-add-keytype" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="a_form_keytype" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>钥匙类型:</td>
		                    <td>
		                    	<input id="a_keytype_type" name="a_keytype_type" type="text"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="a_keytype_remarks" rows="5" cols="40" name="remarks"></textarea></td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-add-locktype -->
		
		<!-- 添加锁类型 -->
		<div id="dialog-add-locktype" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="a_form_locktype" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>锁类型:</td>
		                    <td>
		                    	<input id="a_locktype_type" type="text"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="a_locktype_remarks" rows="5" cols="40" name="remarks"></textarea></td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-add-locktype -->
		
		<!-- 添加备份 -->
		<div id="dialog-add-backup" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="a_form_backup" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>标题:</td>
		                    <td>
		                    	<input id="a_backup_title" type="text"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="a_backup_remark" rows="5" cols="40" name="remark"></textarea></td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-add-locktype -->

		<div id="dialog-progressbar" class="hide">
			 <div style="padding:10px 10px 20px 10px">
			 	<div id="progressbar"></div>
		     </div>
		</div><!-- #dialog-bar -->
		
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
		
		<script src="assets/js/date-time/bootstrap-datepicker.min.js"></script>
		<script src="assets/js/jqGrid/jquery.jqGrid.min.js"></script>
		<script src="assets/js/jqGrid/i18n/grid.locale-en.js"></script>
		<script src="js/jquery.validate.js"></script>
		<script src="js/validate-ex.js"></script>

		<!-- ace scripts -->

		<script src="assets/js/ace-elements.min.js"></script>
		<script src="assets/js/ace.min.js"></script>
		<script src="assets/js/bootstrap.min.js"></script>
		<script src="js/common/global.js"></script>
		<script src="js/dictionary.js"></script>
		
		<script src="assets/touchTouch/touchTouch.jquery.js"></script>
		<script src="assets/js/script.js"></script>
		<script src="js/ajaxfileupload.js"></script>

			<script type="text/javascript">
			jQuery(function($) {
	
			

				  document.onkeydown=yxl;
			     document.onmousedown=scrollFunc;
			});
		</script>
	</body>
</html>

