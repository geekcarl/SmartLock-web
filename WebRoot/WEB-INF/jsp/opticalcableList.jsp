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
						if (e.pageX < g_obj.rightClickPos.pageX || e.pageX > (g_obj.rightClickPos.pageX + 160) || e.pageY < g_obj.rightClickPos.pageY || e.pageY > (g_obj.rightClickPos.pageY + 60))
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
		<input type="hidden" value="${opticalcable_export }" id="opticalcable_export">
		<input type="hidden" value="${opticalcable_add }" id="opticalcable_add">
		<input type="hidden" value="${opticalcable_view }" id="opticalcable_view">
		<input type="hidden" value="${opticalcable_update }" id="opticalcable_update">
		<input type="hidden" value="${opticalcable_delete }" id="opticalcable_delete">
		<div class="col-sm-6" id="rightclick_contextmenu" onmouseover="rightMenuMouseOver()" onmouseout="rightMenuMouseOut()" style="display:none; z-index:9999; position: absolute;">
			<ul id="menu">
				<li>
					<a href="javascript:void(0);" onclick="showDetail()">查看详情</a>
				</li>
				<li>
					<a href="javascript:void(0);" onclick="showCores()">查看纤芯</a>
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
								<a href="#">资源管理</a>
							</li>
							<li class="active">光缆管理</li>
						</ul>
						<!-- .breadcrumb -->
					</div>
					<div class="page-content">

						<div class="row">
							<div class="col-xs-12">
								<!-- PAGE CONTENT BEGINS -->
								<div class="well well-sm">
									起始光交箱：<input id="f_s_start_box" type="text" readonly="readonly" placeholder="起始光交箱"/>
									<a class="green" href="javascript:void(0);" onclick="clearBox('f_s_start_box')"  title="取消"><i class="icon-remove bigger-130"></i></a>
									<a class="green" href="javascript:void(0);" onclick="chooseBox('f_s_start_box')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a> 
									终止光交箱：<input id="f_s_end_box" type="text" readonly="readonly" placeholder="终止光交箱"/>
									<a class="green" href="javascript:void(0);" onclick="clearBox('f_s_end_box')"  title="取消"><i class="icon-remove bigger-130"></i></a>
									<a class="green" href="javascript:void(0);" onclick="chooseBox('f_s_end_box')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a>
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
		<div id="dialog-message" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="a_form" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>起始地址:</td>
		                    <td><input type="text" id="a_startAddress" name="a_startAddress"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>起始光交箱:</td>
		                    <td>
								<input type="text"  id="a_start_box" value="" readonly="readonly"/>
								&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="clearBox('a_start_box', 'a_start_box_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
								&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseBox('a_start_box', 'a_start_box_id')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a>
								<input type="hidden" id="a_start_box_id"/>
							</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>终止地址:</td>
		                    <td><input type="text" id="a_endAddress" name="a_endAddress"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>终止光交箱:</td>
		                    <td>
								<input type="text"  id="a_end_box" value="" readonly="readonly"/>
								&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="clearBox('a_end_box', 'a_end_box_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
								&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseBox('a_end_box', 'a_end_box_id')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a>
								<input type="hidden" id="a_end_box_id"/>
							</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>纤芯数量:</td>
		                    <td>
		                    	<input type="text" id="a_coreCounts" name="a_coreCounts"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>光缆类型:</td>
		                    <td>
		                    	<input type="text" id="a_type" name="a_type"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="a_remarks" rows="5" cols="70" name="a_remarks"></textarea></td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-message -->
		
		<div id="dialog-message-update" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="u_form" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>起始地址:</td>
		                    <td>
		                    	<input type="text" id="u_startAddress" readonly="readonly"  name="u_startAddress"></input>
		                    	<input type="hidden" id="u_id"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>起始光交箱:</td>
		                    <td>
								<input type="text"  id="u_start_box" value="" readonly="readonly"/>
								&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="clearBox('u_start_box', 'u_start_box_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
								&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseBox('u_start_box', 'u_start_box_id')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a>
								<input type="hidden" id="u_start_box_id"/>
							</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>终止地址:</td>
		                    <td><input type="text" id="u_endAddress" readonly="readonly"  name="u_endAddress"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>终止光交箱:</td>
		                    <td>
								<input type="text"  id="u_end_box" value="" readonly="readonly"/>
								&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="clearBox('u_end_box', 'u_end_box_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
								&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseBox('u_end_box', 'u_end_box_id')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a>
								<input type="hidden" id="u_end_box_id"/>
							</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>纤芯数量:</td>
		                    <td>
		                    	<input type="text" id="u_coreCounts" readonly="readonly" name="u_coreCounts"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>光缆类型:</td>
		                    <td>
		                    	<input type="text" id="u_type" name="u_type"></input>
		                    	<font style="color:red;">*</font>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>备注:</td>
		                    <td colspan="2"><textarea id="u_remarks" rows="5" cols="70" name="u_remarks"></textarea></td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-message-update -->
		
		<div id="dialog-message-search" class="hide">
			 <div style="padding:10px 50px 20px 50px">
		        <form id="s_form" method="post">
		        	<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>
		            <table cellpadding="5">
		                <tr>
		                    <td>起始地址:</td>
		                    <td><input type="text" id="s_startAddress" name="s_startAddress"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>起始光交箱:</td>
		                    <td>
								<input type="text"  id="s_start_box" value="" readonly="readonly"/>
								&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="clearBox('s_start_box', 's_start_box_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
								&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseBox('s_start_box', 's_start_box_id')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a>
								<input type="hidden" id="s_start_box_id"/>
							</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>终止地址:</td>
		                    <td><input type="text" id="s_endAddress" name="s_endAddress"></input></td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>终止光交箱:</td>
		                    <td>
								<input type="text"  id="s_end_box" value="" readonly="readonly"/>
								&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="clearBox('s_end_box', 's_end_box_id')"  title="取消"><i class="icon-remove bigger-130"></i></a>
								&nbsp;<a class="green" href="javascript:void(0);" onclick="chooseBox('s_end_box', 's_end_box_id')"  title="选择光交箱"><i class="icon-list bigger-130"></i></a>
								<input type="hidden" id="s_end_box_id"/>
							</td>
		                    <td>&nbsp;</td>
		                </tr>
		                <tr>
		                    <td>光缆类型:</td>
		                    <td>
		                    	<input type="text" id="s_type" name="s_type"></input>
		                    </td>
		                    <td>&nbsp;</td>
		                </tr>
		            </table>
		        </form>
		     </div>
		</div><!-- #dialog-message-search -->
		
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
		
		
		<div id="dialog-core" class="hide">
			 <div style="padding:10px 50px 20px 50px">
					
					<table id="manage-core-grid-table"></table>

					<div id="manage-core-grid-pager"></div>
		     </div>
		</div><!-- #dialog-core -->
		
		<div id="dialog-view" class="hide">
			 <div style="padding:10px 50px 20px 50px">
				<table width="100%" class="table table-striped table-bordered table-hover js-table" >
					<tr>
						<td>光缆段名称：</td>
						<td><span id="view_name"></span></td>
					</tr>
					<tr>
						<td>起始交接点编号：</td>
						<td><span id="view_start"></span></td>
					</tr>
					<tr>
						<td>终点交接点编号：</td>
						<td><span id="view_end"></span></td>
					</tr>
					<tr>
						<td>纤芯数：</td>
						<td><span id="view_coreCounts"></span></td>
					</tr>
					<tr>
						<td>纤芯使用数量：</td>
						<td><span id="view_coreUsed"></span></td>
					</tr>
					<tr>
						<td>纤芯使用率：</td>
						<td><span id="view_rate"></span></td>
					</tr>
					<tr>
						<td>类型：</td>
						<td><span id="view_type"></span></td>
					</tr>
					<tr>
						<td>备注：</td>
						<td><span id="view_remarks"></span></td>
					</tr>
				</table>	
		     </div>
		</div><!-- #dialog-opticalcable -->
		
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
		<script src="js/opticalcable.js"></script>
		<script type="text/javascript">
			jQuery(function($) {

				  document.onkeydown=yxl;
			     document.onmousedown=scrollFunc;
			});
		</script>
	</body>
</html>

