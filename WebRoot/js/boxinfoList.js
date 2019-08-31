$(document).ready(function(){

	$('#uploadexcel').ace_file_input({});
});
var g_obj = {};
g_obj.rightMenuMouseOver = false;
g_obj.rightClickNode = null;
g_obj.rightClickPos = null;
g_obj.addBoxModuleRows = 0;
g_obj.addBoxStates = [];
g_obj.jump_last_click = [];
g_obj.core_to_terminal_click = null;

function rightMenuMouseOver() {
}
function opendoor(boxid){
		
		var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
						modal: true,
						width: 200,
						height: 100,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
						title_html: true,
					});

	         $.ajax( {
					
					type : "post",
					url : "boxinfo.do?method=opendoor",
					data : "boxid=" + boxid,
					success : function(data) {
					  $( "#dialog-progressbar" ).dialog("close");
						isOvertime(data.resultMark);
						if (data.resultMark == 1) 
					  { 
						 alert('已成功发送申请!');
						
					  }
						 else 
						 {
						   alert(data.errMessage);
						 }

					  },
					error: function() {
					$( "#dialog-progressbar" ).dialog("close");

						alert('发送申请失败');				

					}	
					});

} 


//add by ly  针对一对多的跳纤情况，返回端子名称
function findTerminalName(front_terminal_id) {
	       var terminalname;

		  $.ajax( {
	  				type : "post",
	  				async: false, 
	  				url : "boxinfo.do?method=getTerminalName",
	  				data : "terminalid=" + front_terminal_id,
	  				success : function(data) {
	  			  		
	  					if (data != null && data.resultMark == 1) 
	  					{
	  						if (data.object != null)
	  							terminalname = data.object ;

	  					}
	  					else 
	  					{
	  						terminalname =  "";
	  					}
	  				},
	  				error: function() {
	  					
	  				}
	  		  });

         return terminalname;

                   }


function rightMenuMouseOut() {
}
//显示选择部门窗口
function chooseDepartment(name, id) {
	g_obj.chooseDepartment = {name : name, id : id};
	var dialog = $( "#dialog-department-tree" ).removeClass('hide').dialog({
		width: 500,
		height: 400,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>选择部门</h4></div>",
		title_html: true,
		buttons: [
			{
				text: "取消",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-department-tree" ).dialog("close"); 
				} 
			}
		]
	});
}

//取消选择部门
function cancelDepartment(name, id) {
    $('#' + id).val('');
    $('#' + name).val('');
}


function uploadexcel()
{
	$('#dialog-uploadexcel-div').html('');
	$('#dialog-uploadexcel-div').html('<input type="file" name="uploadexcel" id="uploadexcel">');
	$('#uploadexcel').ace_file_input({});
	var dialog = $( "#dialog-uploadexcel" ).removeClass('hide').dialog({
		width: 500,
		height: 200,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>选择文件</h4></div>",
		title_html: true,
		buttons: [
			{
				text: "上传",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
						modal: true,
						width: 200,
						height: 100,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
						title_html: true,
					});
					$.ajaxFileUpload({
					    //处理文件上传操作的服务器端地址(可以传参数,已亲测可用)
					    url:'boxinfo.do?method=importBoxinfo',
					    secureuri:false,                       //是否启用安全提交,默认为false
					    fileElementId:'uploadexcel',           //文件选择框的id属性
					    dataType:'text',                       //服务器返回的格式,可以是json或xml等
					    success:function(data, status){        //服务器响应成功时的处理函数
					    	$( "#dialog-progressbar" ).dialog("close");
					    	var resultMark = data.substring(data.indexOf('pre-wrap;">') + 11, data.indexOf('</pre>'));
					    	
					    	var result = resultMark.split(',');

							if (result.length == 2 && result[1] != '')
							{
								alert(result[1]);
							}
							if (result[0] == 1)
							{
								$('#add_statekey_mark_div').show();
								$('#add_statekey_mark_label').html('导入光交箱成功！');
								mySetTimeOut('add_statekey_mark_div', 4000);
								$('#grid-table').trigger("reloadGrid"); 
							}
							else
							{
								$('#add_statekey_mark_div').show();
								$('#add_statekey_mark_label').html('导入光交箱失败，请重试');
								mySetTimeOut('add_statekey_mark_div', 4000);
							}
					    },
					    error:function(data, status, e){ //服务器响应失败时的处理函数
					    	$( "#dialog-progressbar" ).dialog("close");
							$('#add_statekey_mark_div').show();
							$('#add_statekey_mark_label').html('导入光交箱失败，请重试');
							mySetTimeOut('add_statekey_mark_div', 4000);
					    }
					});
					$( "#dialog-uploadexcel" ).dialog("close"); 
				} 
			},
			{
				text: "取消",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-uploadexcel" ).dialog("close"); 
				} 
			}
		]
	});
}

//显示选择人员窗口
function chooseUser(name, id) {
	g_obj.chooseUser = {name : name, id : id};
	$.ajax( {
		type : "post",
		url : "operators.do?method=listDepartmentOperTree",
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				$('#user_tree_div').html('<div id="user_tree_ul" class="ztree"></div>');
				g_obj.users = data.tree;
				var setting = {
					view: {
						selectedMulti: false
					},
					data: {
						simpleData: {
							enable: true
						}
					},
					callback: {
						onClick: function (e, treeId, treeNode) {
							if (treeNode.type == 2)
							{
								$('#' + g_obj.chooseUser.name).val(treeNode.name);
								$('#' + g_obj.chooseUser.id).val(treeNode.id);
					        	$( "#dialog-user-tree" ).dialog("close"); 
							}
						}
					}
				};
				g_obj.user_tree = $.fn.zTree.init($("#user_tree_ul"), setting, data.tree);
				var dialog = $( "#dialog-user-tree" ).removeClass('hide').dialog({
					width: 500,
					height: 400,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>选择人员</h4></div>",
					title_html: true,
					buttons: [
					          {
					        	  text: "取消",
					        	  "class" : "btn btn-primary btn-xs",
					        	  click: function() {
						        	  $( "#dialog-user-tree" ).dialog("close"); 
						          } 
					          }
					         ]
				});
			}
		}
	});
}

//取消选择人员
function cancelUser(name, id) {
    $('#' + id).val('');
    $('#' + name).val('');
}

//快速检索
function fastsearch() {
	var box_no = $('#f_s_box_no').val();
	var controller_id = $('#f_s_controller_id').val();
	var box_address = $('#f_s_box_address').val();
	var box_simno = $('#f_s_box_sim_no').val();
	var box_dep = $('#f_s_department_name').val();

	if ( box_no != '' || controller_id != ''|| box_simno != ''  || box_address != ''  || box_dep != '')
	{

	   $("#grid-table").jqGrid('setGridParam',{ 
            postData:null, //发送搜索条件 
        });

	 //    var data = '0=0';
		// if (box_no != '') data += '&box_no=' + box_no;
		// if (controller_id != '') data += '&controller_id=' + controller_id;
		// if (box_address != '') data += '&address=' + box_address;
		// if (box_simno != '') data += '&sim_phone_no=' + box_simno;
		// if (box_dep != '') data += '&department_name=' + box_dep;


		var postData = {};
		if (box_no != '')
		{
		   	postData.box_no = box_no;
		}
	
		if (controller_id != '')
		{
			postData.controller_id = controller_id;
		}
		if (box_address != '')
		{
			postData.address = box_address;
		}
		if (box_simno != '')
		{
			postData.sim_phone_no = box_simno;
		}
		if (box_dep != '')
		{
			postData.department_name = box_dep;
		}

		
		$("#grid-table").jqGrid('setGridParam',{ 
            url:'boxinfo.do?method=listPageByAjax',//你的搜索程序地址 
            postData:postData, //发送搜索条件 
            page:1 
        }).trigger("reloadGrid"); //重新载入
	}
}

function detailsearch()
{
	$("#grid-table").jqGrid('setGridParam',{ 
        postData:null, //发送搜索条件 
    });
	var dialog = $( "#dialog-search-boxinfo" ).removeClass('hide').dialog({
		modal: true,
		width: 800,
		height: 400,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>检索光交箱</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					var postData = {};
					if ($('#s_controller_id').val() != '')
					{
						postData.controller_id = $('#s_controller_id').val(); 
					}
					if ($('#s_box_no').val() != '')
					{
						postData.box_no = $('#s_box_no').val(); 
					}
					if ($('#s_department_name').val() != '')
					{
						postData.department_name = $('#s_department_name').val();
					}
					if ($('#s_box_address').val() != 0)
					{
						postData.address = $("#s_box_address").val();
					}
					if ($('#s_box_type').val() != '') 
					{
						postData.box_type = $('#s_box_type').val();
					}
					if ($('#s_box_sim_no').val() != '')
					{
						postData.sim_phone_no = $('#s_box_sim_no').val(); 
					}
					if ($('#s_box_locks_count').val() != '')
					{
						postData.locks_count = $('#s_box_locks_count').val(); 
					}
					$("#grid-table").jqGrid('setGridParam',{
				        url:'boxinfo.do?method=listPageByAjax',//你的搜索程序地址 
				        postData:postData, //发送搜索条件 
				        page:1 
				    }).trigger("reloadGrid"); //重新载入
					$( "#dialog-search-boxinfo" ).dialog( "close" );
				} 
			}
		]
	});
}

function resetsearch()
{
   //$('#d_search_form')[0].reset();	
     $('#f_s_box_no').val('') ;
     $('#f_s_controller_id').val('');
   //$('#f_s_box_address').val('');
     $('#f_s_box_sim_no').val('');
     $('#f_s_department_name').val('') ;
     $('#f_s_department_id').val('') ;

	$("#grid-table").jqGrid('setGridParam',{ 
        postData:null, //发送搜索条件 
    });

	var postData = {
			rows : 10,
			page : 1
	};

	$("#grid-table").jqGrid('setGridParam',{ 
        url:'boxinfo.do?method=listPageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入

}


// 操作表格
function getDel(k){
    $(k).parent().remove();
}
     


         
//显示图片
function showPics()
{
	$('#rightclick_contextmenu').hide();
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=getBoxImages",
		data : "id=" + g_obj.rightClickRowData.id ,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				var html = '';
				for (var i = 0; i < data.rows.length; i ++)
				{
					html += '<input type="checkbox" name="chk" id="imgs +'+ data.rows[i].imid + '"  value="'+data.rows[i].imid+'" />-<a href="/../gjx_uploadfile/' + data.rows[i].image_path + '" style="background-image:url(/../gjx_uploadfile/' + data.rows[i].image_path + ')" title="' + data.rows[i].remarks + '"></a> ';
				}
				$('#thumbs').html(html);
				$('#thumbs a').touchTouch();
				if (data.rows.length > 0)
				{
					var dialog = $( "#dialog-pics" ).removeClass('hide').dialog({
						width: 1000,
						height: 500,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看图片-" + g_obj.rightClickRowData.box_no + "</h4></div>",
						title_html: true,
						buttons: [
						           {
						        	  text: "删除图片",
						        	  "class" : "btn btn-primary btn-xs",
						        	  click: function() {
                                       
                                       if (confirm('确定要删除所选图片吗？'))
 	                                  { 
 		                                var aa = document.getElementsByName("chk");
 		                                var data = "";
                                        var ss = "";
                                        var imgs = "";
                                         for (var i = 0; i < aa.length; i++) {
                                          if (aa[i].checked) {
                                                ss += aa[i].value +',';
                                                imgs[i] = aa[i].value;
                                             }
                                          }

                                          if(ss == ""){
                                                 
                                             alert('请至少选择一张图片!');
                                             return;
                                          }

                                         data = "ids="+ss;
						        	  	
						        	  	  $.ajax( {
								  				type : "post",
								  				url : "boxinfo.do?method=deleteimage",
								  				data : data,
								  				success : function(data) {
								  			  		isOvertime(data.resultMark);
								  					if (data.resultMark == 1) 
								  					{
								  						alert('删除成功');
											        	$( "#dialog-pics" ).dialog("close");
								  					}
								  					else 
								  					{
								  						alert('删除失败，请重试');
								  					}
								  				},
								  				error: function() {
								  					alert('删除失败，请重试');
								  				}
								  		  });
						        	  
						             }
						          } 
						          },
						           {
						        	  text: "确定",
						        	  "class" : "btn btn-primary btn-xs",
						        	  click: function() {
						        	  $( "#dialog-pics" ).dialog("close"); 
						          } 
						          },						          ]
					});
				}
				else
				{
					alert('该光交箱暂无图片');
				}
			}
		}
	});
}


/*function showPics()
{
	$('#rightclick_contextmenu').hide();
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=getBoxImages",
		data : "id=" + g_obj.rightClickRowData.id ,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				var html = '';
				for (var i = 0; i < data.rows.length; i ++)
				{
					html += '<a href="/../gjx_uploadfile/' + data.rows[i].image_path + '" style="background-image:url(/../gjx_uploadfile/' + data.rows[i].image_path + ')" title="' + data.rows[i].remarks + '"></a>';
				}
				$('#thumbs').html(html);
				$('#thumbs a').touchTouch();
				if (data.rows.length > 0)
				{
					var dialog = $( "#dialog-pics" ).removeClass('hide').dialog({
						width: 1000,
						height: 800,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看图片-" + g_obj.rightClickRowData.box_no + "</h4></div>",
						title_html: true,
						buttons: [
						          {
						        	  text: "确定",
						        	  "class" : "btn btn-primary btn-xs",
						        	  click: function() {
						        	  $( "#dialog-pics" ).dialog("close"); 
						          } 
						          }
						          ]
					});
				}
				else
				{
					alert('该光交箱暂无图片');
				}
			}
		}
	});
}*/

function showSettings()
{
	$('#rightclick_contextmenu').hide();
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=getBoxSettings",
		data : "id=" + g_obj.rightClickRowData.id,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				if (data.object != null)
				{
					if (data.object.flag == 0)//0个体，1全局
					{
						$(":radio[name='u_boxsettings_flag'][value='0']").attr("checked", "checked");
						$(":radio[name='u_boxsettings_flag'][value='1']").attr("checked", false);
					}
					else
					{
						$(":radio[name='u_boxsettings_flag'][value='1']").attr("checked", "checked");
						$(":radio[name='u_boxsettings_flag'][value='0']").attr("checked", false);
					}
					$('#u_boxsettings_id').val(data.object.id);
					$('#u_boxsettings_hb_interval').val(data.object.hb_interval);
					$('#u_boxsettings_volt_threshold').val(data.object.volt_threshold);
					$('#u_boxsettings_angle_threshold').val(data.object.angle_threshold);
					$('#u_boxsettings_high_t_threshold').val(data.object.high_t_threshold);
					$('#u_boxsettings_low_t_threshold').val(data.object.low_t_threshold);
					$('#u_boxsettings_remarks').val(data.object.remarks);
					var dialog = $( "#dialog-boxsettings" ).removeClass('hide').dialog({
						width: 900,
						height: 600,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看设置值-" + g_obj.rightClickRowData.box_no + "</h4></div>",
						title_html: true,
						buttons: [
						          {
						        	  text: "保存",
						        	  "class" : "btn btn-primary btn-xs",
						        	  click: function() {
						        		  var data = '';
						        		  data += 'id=' + $('#u_boxsettings_id').val();
						        		  data += '&flag=' + Number($(':radio[name="u_boxsettings_flag"]:checked').val());
						        		  data += '&boxinfo.id=' + g_obj.rightClickRowData.id;
						        		  data += '&hb_interval=' + $('#u_boxsettings_hb_interval').val();
							  			  data += '&volt_threshold=' + $('#u_boxsettings_volt_threshold').val();
							  			  data += '&angle_threshold=' + $('#u_boxsettings_angle_threshold').val();
							  			  data += '&high_t_threshold=' + $('#u_boxsettings_high_t_threshold').val();
							  			  data += '&low_t_threshold=' + $('#u_boxsettings_low_t_threshold').val();
							  			  data += '&remarks=' + $('#u_boxsettings_remarks').val();
								  		  $.ajax( {
								  				type : "post",
								  				url : "boxinfo.do?method=updateBoxSettings",
								  				data : data,
								  				success : function(data) {
								  			  		isOvertime(data.resultMark);
								  					if (data.resultMark == 1) 
								  					{
								  						alert('修改成功');
											        	$( "#dialog-boxsettings" ).dialog("close");
								  					}
								  					else 
								  					{
								  						alert('修改失败，请重试');
								  					}
								  				},
								  				error: function() {
								  					alert('修改失败，请重试');
								  				}
								  		  });
							          } 
						          },{
						        	  text: "取消",
						        	  "class" : "btn btn-primary btn-xs",
						        	  click: function() {
							        	  $( "#dialog-boxsettings" ).dialog("close"); 
							          } 
						          }
						]
					});
				}
				else
				{
					alert('该光交箱没有设置值');
				}
			}
		}
	});
}

function showModifi()
{
	$('#rightclick_contextmenu').hide();
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=getBoxModifi",
		data : "id=" + g_obj.rightClickRowData.id ,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				if (data.object != null)
				{
					if (data.object.flag == 0)
					{
						$(":radio[name='u_boxmodifi_flag'][value='0']").attr("checked","checked");
						$(":radio[name='u_boxmodifi_flag'][value='1']").attr("checked",false);
					}
					else
					{
						$(":radio[name='u_boxmodifi_flag'][value='1']").attr("checked","checked");
						$(":radio[name='u_boxmodifi_flag'][value='0']").attr("checked",false);
					}
					$('#u_boxmodifi_id').val(data.object.id);
					$('#u_boxmodifi_shake_threshold').val(data.object.shake_threshold);
					$('#u_boxmodifi_shake_rate').val(data.object.shake_rate);
					$('#u_boxmodifi_center_ip').val(data.object.center_ip);
					$('#u_boxmodifi_center_upd_port').val(data.object.center_upd_port);
					$('#u_boxmodifi_remarks').val(data.object.remarks);
					var dialog = $( "#dialog-boxmodifi" ).removeClass('hide').dialog({
						width: 900,
						height: 400,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>查看下发给控制器设置值-" + g_obj.rightClickRowData.box_no + "</h4></div>",
						title_html: true,
						buttons: [
						          {
						        	  text: "保存",
						        	  "class" : "btn btn-primary btn-xs",
						        	  click: function() {
						        		  var data = '';
						        		  data += 'id=' + $('#u_boxmodifi_id').val();
						        		  data += '&flag=' + Number($(':radio[name="u_boxmodifi_flag"]:checked').val());
						        		  data += '&boxinfo.id=' + g_obj.rightClickRowData.id;
						        		  data += '&shake_threshold=' + $('#u_boxmodifi_shake_threshold').val();
							  			  data += '&shake_rate=' + $('#u_boxmodifi_shake_rate').val();
							  			  data += '&center_ip=' + $('#u_boxmodifi_center_ip').val();
							  			  data += '&center_upd_port=' + $('#u_boxmodifi_center_upd_port').val();
							  			  data += '&remarks=' + $('#u_boxmodifi_remarks').val();
								  		  $.ajax( {
								  				type : "post",
								  				url : "boxinfo.do?method=updateBoxModifi",
								  				data : data,
								  				success : function(data) {
								  			  		isOvertime(data.resultMark);
								  					if (data.resultMark == 1) 
								  					{
								  						alert('修改成功');
											        	$( "#dialog-boxmodifi" ).dialog("close");
								  					}
								  					else 
								  					{
								  						alert('修改失败，请重试');
								  					}
								  				},
								  				error: function() {
								  					alert('修改失败，请重试');
								  				}
								  		  }); 
							          } 
						          },{
						        	  text: "取消",
						        	  "class" : "btn btn-primary btn-xs",
						        	  click: function() {
							        	  $( "#dialog-boxmodifi" ).dialog("close"); 
							          } 
						          }
						]
					});
				}
				else
				{
					alert('该光交箱没有下发值');
				}
			}
		}
	});
}

//添加光交箱模块表格的一行
function addBoxModuleRow() {
	var str='';
	str+="<tr align='center' id='addBoxModuleRow_" + g_obj.addBoxModuleRows + "'>";
    str+="<td><select id='addBoxModuleRow_sideName_" + g_obj.addBoxModuleRows + 
    		"'><option value='A'>A面</option>" + 
    		"<option value='B'>B面</option>" + 
    		"<option value='C'>C面</option>" + 
    		"<option value='D'>D面</option>" + 
			"<option value='E'>E面</option>" + 
			"<option value='F'>F面</option>" + 
			"<option value='G'>G面</option>" + 
			"<option value='H'>H面</option>" + 
			"<option value='I'>I面</option>" + 
			"<option value='J'>J面</option>" + 
			"<option value='K'>K面</option>" + 
			"<option value='L'>L面</option>" + 
			"<option value='M'>M面</option>" + 
			"<option value='N'>N面</option>" + 
			"<option value='O'>O面</option>" + 
			"<option value='P'>P面</option>" + 
			"<option value='Q'>Q面</option>" + 
			"<option value='R'>R面</option>" +
			"<option value='S'>S面</option>" + 
			"<option value='T'>T面</option>" + 
			"<option value='U'>U面</option>" + 
			"<option value='V'>V面</option>" + 
			"<option value='W'>W面</option>" + 
			"<option value='X'>X面</option>" + 
			"<option value='Y'>Y面</option>" + 
			"<option value='Z'>Z面</option>" + 
    		"</select></td>";
    str+="<td><input id='addBoxModuleRow_rows_" + g_obj.addBoxModuleRows + "' type='text' value=''/></td>";
    str+="<td><input id='addBoxModuleRow_cols_" + g_obj.addBoxModuleRows + "' type='text' value=''/></td>";
    str+="</tr>";
    $("#boxModules").append(str);
    g_obj.addBoxModuleRows ++;
} 
//删除光交箱模块表格的一行
function deleteBoxModuleRow() {
	if (g_obj.addBoxModuleRows > 0)
	{
		$('#addBoxModuleRow_' + (g_obj.addBoxModuleRows - 1)).remove();
		g_obj.addBoxModuleRows --;
	}
}

//显示智能锁列表
function managelock() {
	$('#rightclick_contextmenu').hide();
	var postData = {
			rows : 10,
			page : 1,
			boxInfo_id : g_obj.rightClickRowData.id 
	};
	$("#manage-lock-grid-table").jqGrid('setGridParam',{ 
        url:'lockandkey.do?method=listLockInfoPageByAjax',//你的搜索程序地址 
        postData:postData, //发送搜索条件 
        page:1 
    }).trigger("reloadGrid"); //重新载入
	var dialog = $("#dialog-manage-lock" ).removeClass('hide').dialog({
		width: 700,
		height: 550,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>智能锁列表-" + g_obj.rightClickRowData.box_no + "</h4></div>",
		title_html: true,
		buttons: [
			{
				text: "确定",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-manage-lock" ).dialog("close"); 
				} 
			}
		]
	});
}

//创建新面板
function addModule() {
	if ($('#addBoxModule_rows').val() != '' && $('#addBoxModule_cols').val() != '')
	{
		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=addBoxModule",
			data:"boxInfo.id=" + g_obj.rightClickNode + "&sideName=" + $('#addBoxModule_sideName').val() + '&rows=' + $('#addBoxModule_rows').val() + '&cols=' + $('#addBoxModule_cols').val(),
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null && data.resultMark == 1)
				{
					showModules();
				}
			}
		});
	}
	else
	{
		alert('请填写行数和列数');
	}
}

//删除面板
function deleteModule(id) {
	if (confirm('确定要删除该面板？'))
	{
		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=deleteModule",
			data:"id=" + id,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null && data.resultMark == 1)
				{
					showModules();
				}
				else
				{
					alert('该面板的端子存在跳纤、成端或者预占情况，请先解除端子的连接。');
				}
			}
		});
	}
}

//添加行
function addRow(id, row) {
	if (confirm('确定要添加一行端子么？'))
	{
		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=addRow",
			data:"id=" + id + "&row=" + row,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null && data.resultMark == 1)
				{
					showModules();
				}
				else
				{
					alert('添加端子失败');
				}
			}
		});
	}
}

//删除行
function deleteRow(id, row) {
	if (confirm('确定要删除一行端子么？'))
	{
		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=deleteRow",
			data:"id=" + id + "&row=" + row,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null && data.resultMark == 1)
				{
					showModules();
				}
				else
				{
					alert('删除端子失败');
				}
			}
		});
	}
}

// 查看面板图
function showModules() {
	g_obj.showModules_front_terminals = [];
	$('#rightclick_contextmenu').hide();
	var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
		modal: true,
		width: 200,
		height: 100,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
		title_html: true,
	});
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findBoxModulesAndTerminalsByAjax",
		data:"id=" + g_obj.rightClickNode,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null)
			{
				$( "#dialog-progressbar" ).dialog("close");
					var tablehtml = '';
					tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表损坏&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表预占&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_blue.png" width="12px">&nbsp;代表当前选中</div>';
					tablehtml += "<div style='width:100%; margin-top:5px;'>名称：<select id='addBoxModule_sideName'>" + 
				    		"><option value='A'>A面</option>" + 
				    		"<option value='B'>B面</option>" + 
				    		"<option value='C'>C面</option>" + 
				    		"<option value='D'>D面</option>" + 
							"<option value='E'>E面</option>" + 
							"<option value='F'>F面</option>" + 
							"<option value='G'>G面</option>" + 
							"<option value='H'>H面</option>" + 
							"<option value='I'>I面</option>" + 
							"<option value='J'>J面</option>" + 
							"<option value='K'>K面</option>" + 
							"<option value='L'>L面</option>" + 
							"<option value='M'>M面</option>" + 
							"<option value='N'>N面</option>" + 
							"<option value='O'>O面</option>" + 
							"<option value='P'>P面</option>" + 
							"<option value='Q'>Q面</option>" + 
							"<option value='R'>R面</option>" +
							"<option value='S'>S面</option>" + 
							"<option value='T'>T面</option>" + 
							"<option value='U'>U面</option>" + 
							"<option value='V'>V面</option>" + 
							"<option value='W'>W面</option>" + 
							"<option value='X'>X面</option>" + 
							"<option value='Y'>Y面</option>" + 
							"<option value='Z'>Z面</option>" + 
				    		"</select>";
				    tablehtml += "&nbsp;&nbsp;行数：<input id='addBoxModule_rows' type='text' value=''/>";
				    tablehtml += "&nbsp;&nbsp;列数：<input id='addBoxModule_cols' type='text' value=''/>";
				    tablehtml += "&nbsp;&nbsp;<button onclick='addModule()' class='btn btn-xs btn-success'>添加面板<i class='icon-ok icon-on-right'></i></button></div>";
					//挖大坑
				    for (var i = 0; i < data.bms.length; i ++)
					{
						if (i % 2 == 0)
						{
							tablehtml += '<div style="width:100%; height:auto; float:left; clear:both;">';
						}
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '面<font style="font-size:13px;">&nbsp;&nbsp;&nbsp;<a href="javascript:void(0);" onclick="deleteModule(' + data.bms[i].id + ')">删除面板</a></font></h1>';
						tablehtml += '<div class="tabbable" id="box_tabs_' + i + '"><ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="myTab4" style="height:50px !important;"><li class="active"><a data-toggle="tab" href="#map_' + i + '">正面</a></li><li><a data-toggle="tab" href="#th_' + i + '">反面</a></li></ul>';
						tablehtml += '<div class="tab-content" id="box_tabs_content_' + i + '">';
						tablehtml += '<div id="map_' + i + '" class="tab-pane in active" style="width:100%; height:100%;"><table width="100%" id="tables_front_' + i + '"><tr>';
						tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						//表头
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="tables_front_mark_div_' + data.bms[i].id + '" class="alert alert-info" style="margin-top:12px;"><label id="tables_front_mark_label_' + data.bms[i].id + '">查询跳纤：</label></div></div>';

						tablehtml += '<div id="th_' + i + '" class="tab-pane" style="width:100%; height:100%;"><table width="100%" id="tables_back_' + i + '"><tr>';
						tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						//表头
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="tables_back_mark_div_' + data.bms[i].id + '" class="alert alert-info" style="margin-top:12px;"><label id="tables_back_mark_label_' + data.bms[i].id + '">查询成端：</label></div></div>';
						tablehtml += '</div>';
						tablehtml += '</div>';
						tablehtml += '</div>';
						if (i % 2 == 1)
						{
							tablehtml += '</div>';
						}
					}
					$('#dialog-modules-tables').html(tablehtml);
					//挖小坑
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							var isadd = 1;
							for (var k = 0; k < data.bts.length; k ++)
							{
								if (data.bts[k].boxTerminal.boxModule.id == data.bms[i].id && (j + 1) == data.bts[k].boxTerminal.row)
								{
									isadd = 0;
									break;
								}
							}
							str += "<tr style='' align='center'>";
							if (isadd == 0)
							{
								str += "<td width=80 style='border-top:8px solid white; text-align:left;'><a href='javascript:void(0);' onclick='deleteRow(" + data.bms[i].id + "," + (j + 1) + ")' title='删除端子'><i class='icon-remove'></i></a>&nbsp;" + (j + 1) + "</td>";
							}
							else if (isadd = 1)
							{
								str += "<td width=80 style='border-top:8px solid white; text-align:left;'><a href='javascript:void(0);' onclick='addRow(" + data.bms[i].id + "," + (j + 1) + ")' title='添加端子'><i class='icon-plus'></i></a>&nbsp;" + (j + 1) + "</td>";
							}
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								str += "<td width=80 id='showModule_front_terminal_" + data.bms[i].id + "_" + (j + 1) + "_" + (k + 1) + "_outer' style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'></td>";
							}
					        str +="</tr>";
					        $("#tables_front_" + i).append(str);
						}
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str +="<tr style='' align='center'>";
							str += "<td width=60 style='border-top:8px solid white; text-align:center;'>" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								str += "<td width=60 id='showModule_back_terminal_" + data.bms[i].id + "_" + (j + 1) + "_" + (k + 1) + "_outer' style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'></td>";
							}
					        str +="</tr>";
					        $("#tables_back_" + i).append(str);
						}
					}
					for (var i = 0; i < data.bts.length; i ++)
					{
						if (data.bts[i].boxTerminal.status == 4) //预占
						{
							$('#showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_yellow.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 2) //占用
						{
							$('#showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "' onclick=\"findJumpTerminal('box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "', 'tables_front_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "', 'tables_front_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "', 1)\" title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_green.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 3) //损坏
						{
							$('#showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_grey.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 1) //空闲
						{
							$('#showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_red.png' width='12px'/>");
						}
						if (data.bts[i].backFreezed != 0)
						{
							$('#showModule_back_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-反面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_yellow.png' width='12px'/>");
						}
						else
						{
							if (data.bts[i].backUsed != 0)
							{
								$('#showModule_back_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='box_terminal_showModules_back_" + data.bts[i].boxTerminal.id + "' onclick=\"findCoreToTerminal('box_terminal_showModules_back_" + data.bts[i].boxTerminal.id + "', 'tables_back_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "', 'tables_back_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "', 1)\" title='" + data.bts[i].boxTerminal.sideName + "-反面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_green.png' width='12px'/>");
							}
							else
							{
								$('#showModule_back_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-反面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_red.png' width='12px'/>");
							}
						}				
					}
					var dialog = $( "#dialog-modules" ).removeClass('hide').dialog({
						width: 1100,
						height: 800,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>光交箱面板管理-" + g_obj.rightClickRowData.box_no + "</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "确定",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( "#dialog-modules" ).dialog("close"); 
								} 
							}
						]
					});
			}
		},
		error : function() {
			$( "#dialog-progressbar" ).dialog("close");
		}
	});
}

function fastTerminalSearch() {
	var content = $('#f_s_label_info').val();
	if (content != null && content != '')
	{
		var data = g_obj.terminals_tree_data;
		var table = '业务属性：<input id="f_s_label_info" type="text" placeholder="业务属性"/>&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="fastTerminalSearch()" title="快速检索"><i class="icon-search bigger-130"></i></a>';
		table += '<table class="mytable" width="550px">';
		table += '<tr align="center"><td>位置</td><td>所属模块</td><td>端子业务状态</td><td>端子业务信息</td><td>端子与端子连接</td><td>端子与纤芯连接</td><td>行数</td><td>列数</td></tr>';
		for (var i = 0; i < data.bts.length; i ++)
		{
			if (data.bts[i].boxTerminal.label_info != null && data.bts[i].boxTerminal.label_info.indexOf(content) >= 0)
			{
				var status = '';
				if (data.bts[i].boxTerminal.status == 1) status = '空闲';
				else if (data.bts[i].boxTerminal.status == 2) status = '占用';
				else if (data.bts[i].boxTerminal.status == 3) status = '损坏';
				else if (data.bts[i].boxTerminal.status == 4) status = '预占';
				table += '<tr><td>' + data.bts[i].boxTerminal.name +
				'</td><td align="center">' + data.bts[i].boxTerminal.sideName +
				'</td><td align="center">' + status +
				'</td><td align="center">' + data.bts[i].boxTerminal.label_info + 
				'</td><td align="center">' + (data.bts[i].frontFreezed == 0 ? (data.bts[i].frontUsed == 0 ? '-' : data.bts[i].frontTerminal.name) : '冻结') + 
				'</td><td align="center">' + (data.bts[i].backFreezed == 0 ? (data.bts[i].backUsed == 0 ? '-' : data.bts[i].backCore.name) : '冻结') +
				'</td><td align="center">' + data.bts[i].boxTerminal.row + 
				'</td><td align="center">' + data.bts[i].boxTerminal.col + '</td></tr>';
			}
		}
		table += '</table>';
		$('#terminals_table').html(table);
	}
}

function startupdatelabelinfos(id, value)
{
	$('#box_terminal_label_info_' + id).html('<input type="text" value="' + value + '" id="box_terminal_label_info_input_' + id + '" onblur="endupdatelabelinfo(' + id + ')"/>');
}

function endupdatelabelinfo(id)
{
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=updateLabelInfo",
		data:"id=" + id + "&info=" + $('#box_terminal_label_info_input_' + id).val(),
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null)
			{
				;
			}
		}
	});
	$('#box_terminal_label_info_' + id).html($('#box_terminal_label_info_input_' + id).val());
}

//查看端子
function showTerminals() {
	g_obj.showModules_front_terminals = [];
	$('#rightclick_contextmenu').hide();
	var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
		modal: true,
		width: 200,
		height: 100,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
		title_html: true,
	});
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findBoxModulesAndTerminalsByAjax",
		data:"id=" + g_obj.rightClickNode,
		success : function(data) {
			isOvertime(data.resultMark);
			$( "#dialog-progressbar").dialog("close");
			if (data != null)
			{
				g_obj.terminals_tree_data = data;
				if (data.bms.length > 0)
				{
					var treedata = [];
					for (var i = 0; i < data.bms.length; i ++)
					{
						var temp = {
								id : 'a_module_' + data.bms[i].id,
								pId : 0,
								type : 1,
								name : data.bms[i].name,
								sideName : data.bms[i].sideName,
								open : true
						};
						treedata.push(temp);
						for (var j = 0; j < data.bms[i].rows; j ++)
						{	
							var tempin = {
								id : data.bms[i].id + '_' + (j + 1),
								pId : 'a_module_' + data.bms[i].id,
								type : 2,
								sideName : data.bms[i].sideName,
								row : (j + 1),
								name : '第' + (j + 1) + '行'
							};
							treedata.push(tempin);
						}
					}
					$('#terminals_tree_div').html('<div id="terminals_tree" class="ztree"></div>');
					var setting = {
						view: {
							selectedMulti: false
						},
						data: {
							simpleData: {
								enable: true
							}
						},
						callback: {
							beforeCheck: function (treeId, treeNode) {
								var zTree = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1");
								g_obj.opticoretree_sels = zTree.getCheckedNodes(true);
								if ($('#a_style').val() == 1) // 严格成对
								{
									if (treeNode.type == 1)
									{
										return false;
									}
									if (g_obj.opticoretree_sels.length == 2 && treeNode.id != g_obj.opticoretree_sels[1].id)
									{
										zTree.checkAllNodes(false);
									}
								}
								return true;
							},
							onCheck: function (e, treeId, treeNode) {      // 这里要考虑两边的同步
								var zTree = $.fn.zTree.getZTreeObj("a_tree_coretocore_left_1");
								g_obj.opticoretree_sels = zTree.getCheckedNodes(true);
								
							},
							onClick: function (event, treeId, treeNode, clickFlag) {
								if (treeNode.type == 1)
								{
									var data = g_obj.terminals_tree_data;
									var table = '业务属性：<input id="f_s_label_info" type="text" placeholder="业务属性"/>&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="fastTerminalSearch()" title="快速检索"><i class="icon-search bigger-130"></i></a>';
									table += '<table class="mytable" width="550px">';
									table += '<tr align="center"><td>位置</td><td>所属模块</td><td>端子业务状态</td><td>端子业务信息</td><td>端子与端子连接</td><td>端子与纤芯连接</td><td>行数</td><td>列数</td></tr>';
									for (var i = 0; i < data.bts.length; i ++)
									{
										if (treeNode.sideName == data.bts[i].boxTerminal.sideName)
										{
											var status = '';
											if (data.bts[i].boxTerminal.status == 1) status = '空闲';
											else if (data.bts[i].boxTerminal.status == 2) status = '占用';
											else if (data.bts[i].boxTerminal.status == 3) status = '损坏';
											else if (data.bts[i].boxTerminal.status == 4) status = '预占';
											table += '<tr><td>' + data.bts[i].boxTerminal.name +
											'</td><td align="center">' + data.bts[i].boxTerminal.sideName +
											'</td><td align="center">' + status +
											'</td><td align="center" id="box_terminal_label_info_' + data.bts[i].boxTerminal.id + '" ondblclick="startupdatelabelinfos(' + data.bts[i].boxTerminal.id + ', \'' + (data.bts[i].boxTerminal.label_info == null || data.bts[i].boxTerminal.label_info == 'null' ? '' : data.bts[i].boxTerminal.label_info) + '\')">' + (data.bts[i].boxTerminal.label_info == null || data.bts[i].boxTerminal.label_info == 'null' ? '' : data.bts[i].boxTerminal.label_info) + 
											'</td><td align="center">' + (data.bts[i].frontFreezed == 0 ? (data.bts[i].frontUsed == 0 ? '-' : findTerminalName(data.bts[i].front_terminal_id)) : '冻结') + 
											'</td><td align="center">' + (data.bts[i].backFreezed == 0 ? (data.bts[i].backUsed == 0 ? '-' : data.bts[i].backCore.name) : '冻结') +
											'</td><td align="center">' + data.bts[i].boxTerminal.row + 
											'</td><td align="center">' + data.bts[i].boxTerminal.col + '</td></tr>';
										}
									}
									table += '</table>';
									$('#terminals_table').html(table);
								}
								else if (treeNode.type == 2)
								{
									var data = g_obj.terminals_tree_data;
									var table = '业务属性：<input id="f_s_label_info" type="text" placeholder="业务属性"/>&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="fastTerminalSearch()" title="快速检索"><i class="icon-search bigger-130"></i></a>';
									table += '<table class="mytable" width="550px">';
									table += '<tr align="center"><td>位置</td><td>所属模块</td><td>端子业务状态</td><td>端子业务信息</td><td>端子与端子连接</td><td>端子与纤芯连接</td><td>行数</td><td>列数</td></tr>';
									for (var i = 0; i < data.bts.length; i ++)
									{
										if (treeNode.sideName == data.bts[i].boxTerminal.sideName && treeNode.row == data.bts[i].boxTerminal.row)
										{
											var status = '';
											if (data.bts[i].boxTerminal.status == 1) status = '空闲';
											else if (data.bts[i].boxTerminal.status == 2) status = '占用';
											else if (data.bts[i].boxTerminal.status == 3) status = '损坏';
											else if (data.bts[i].boxTerminal.status == 4) status = '预占';
											table += '<tr><td>' + data.bts[i].boxTerminal.name +
											'</td><td align="center">' + data.bts[i].boxTerminal.sideName +
											'</td><td align="center">' + status +
											'</td><td align="center" id="box_terminal_label_info_' + data.bts[i].boxTerminal.id + '" ondblclick="startupdatelabelinfos(' + data.bts[i].boxTerminal.id + ', \'' + (data.bts[i].boxTerminal.label_info == null || data.bts[i].boxTerminal.label_info == 'null' ? '' : data.bts[i].boxTerminal.label_info) + '\')">' + (data.bts[i].boxTerminal.label_info == null || data.bts[i].boxTerminal.label_info == 'null' ? '' : data.bts[i].boxTerminal.label_info) + 
											'</td><td align="center">' + (data.bts[i].frontFreezed == 0 ? (data.bts[i].frontUsed == 0 ? '-' : findTerminalName(data.bts[i].front_terminal_id)) : '冻结') + 
											'</td><td align="center">' + (data.bts[i].backFreezed == 0 ? (data.bts[i].backUsed == 0 ? '-' : data.bts[i].backCore.name) : '冻结') +
											'</td><td align="center">' + data.bts[i].boxTerminal.row + 
											'</td><td align="center">' + data.bts[i].boxTerminal.col + '</td></tr>';
										}
									}
									table += '</table>';
									$('#terminals_table').html(table);
								}
							}
						}
					};
					g_obj.terminals_tree = $.fn.zTree.init($("#terminals_tree"), setting, treedata);
					var table = '业务属性：<input id="f_s_label_info" type="text" placeholder="业务属性"/>&nbsp;&nbsp;<a class="green" href="javascript:void(0);" onclick="fastTerminalSearch()" title="快速检索"><i class="icon-search bigger-130"></i></a>';
					table += '<table class="mytable" width="550px">';
					table += '<tr align="center"><td>位置</td><td>所属模块</td><td>端子业务状态</td><td>端子业务信息</td><td>端子与端子连接</td><td>端子与纤芯连接</td><td>行数</td><td>列数</td></tr>';
					for (var i = 0; i < data.bts.length; i ++)
					{
						var status = '';
						if (data.bts[i].boxTerminal.status == 1) status = '空闲';
						else if (data.bts[i].boxTerminal.status == 2) status = '占用';
						else if (data.bts[i].boxTerminal.status == 3) status = '损坏';
						else if (data.bts[i].boxTerminal.status == 4) status = '预占';
						table += '<tr><td>' + data.bts[i].boxTerminal.name +
						'</td><td align="center">' + data.bts[i].boxTerminal.sideName +
						'</td><td align="center">' + status +
						'</td><td align="center" id="box_terminal_label_info_' + data.bts[i].boxTerminal.id + '" ondblclick="startupdatelabelinfos(' + data.bts[i].boxTerminal.id + ', \'' + (data.bts[i].boxTerminal.label_info == null || data.bts[i].boxTerminal.label_info == 'null' ? '' : data.bts[i].boxTerminal.label_info) + '\')">' + (data.bts[i].boxTerminal.label_info == null || data.bts[i].boxTerminal.label_info == 'null' ? '' : data.bts[i].boxTerminal.label_info) + 
						'</td><td align="center">' + (data.bts[i].frontFreezed == 0 ? (data.bts[i].frontUsed == 0 ? '-' : findTerminalName(data.bts[i].front_terminal_id)) : '冻结') + 
						'</td><td align="center">' + (data.bts[i].backFreezed == 0 ? (data.bts[i].backUsed == 0 ? '-' : data.bts[i].backCore.name) : '冻结') +
						'</td><td align="center">' + data.bts[i].boxTerminal.row + 
						'</td><td align="center">' + data.bts[i].boxTerminal.col + '</td></tr>';
					}
					table += '</table>';
					$('#terminals_table').html(table);
					var dialog = $( "#dialog-terminals" ).removeClass('hide').dialog({
						width: 850,
						height: 800,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>光交箱端子管理-" + g_obj.rightClickRowData.box_no + "</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "确定",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( "#dialog-terminals" ).dialog("close"); 
								}
							}
						]
					});
				}
				else
				{
					alert('该光交箱还没有端子，请先创建面板和端子');
				}
			}
		},
		error : function() {

			$( "#dialog-progressbar").dialog("close");
		}
	});
}

// 选择光缆事件
function change_opticalcable() {
	var val = $('#choose_opticalcable').val();
	if (val > 0)
	{
		$.ajax( {
			type : "post",
			url : "opticalcable.do?method=findAllCoreByBoxId",
			data : "boxid=" + g_obj.rightClickNode + "&optiid=" + val,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null && data.resultMark == 1)
				{
					document.getElementById('choose_core').options.length = 0;
					$("<option value='0'></option>").appendTo($("#choose_core"));
					for (var i = 0; i < data.rows.length; i ++)
					{
						$("<option value='" + data.rows[i].core.id + "'>" + data.rows[i].core.name + "</option>").appendTo($("#choose_core"));
					}
					g_obj.cores = data.rows;
				}
			},
			error: function() {
			}
		});
	}
}

// 选择纤芯事件
function change_core() {
	var val = $('#choose_core').val();
	if (val > 0)
	{
		document.getElementById('choose_side').options.length = 0;
		for (var i = 0; i < g_obj.cores.length; i ++)
		{
			if (g_obj.cores[i].id == val)
			{
				if (g_obj.cores[i].a_type == 0)
				{
					$("<option value='0'>A端</option>").appendTo($("#choose_side"));
				}
				if (g_obj.cores[i].z_type == 0)
				{
					$("<option value='1'>Z端</option>").appendTo($("#choose_side"));
				}
				break;
			}
		}
	}
}

//选择光缆事件
function change_opticalcable1(id1, id2, side) {
	var val = $('#' + id1).val();
	if (val > 0)
	{
		$.ajax( {
			type : "post",
			url : "opticalcable.do?method=findAllCoreByBoxId",
			data : "boxid=" + g_obj.rightClickNode + "&optiid=" + val,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null && data.resultMark == 1)
				{
					document.getElementById(id2).options.length = 0;
					$("<option value='0'></option>").appendTo($("#" + id2));
					for (var i = 0; i < data.rows.length; i ++)
					{
						$("<option value='" + data.rows[i].core.id + "'>" + data.rows[i].core.name + "</option>").appendTo($("#" + id2));
					}
					if (side == 1) 
					{
						g_obj.oneside = data.rows;
					}
					else
					{
						g_obj.anotherside = data.rows;
					}
				}
			},
			error: function() {
			}
		});
	}
}

// 选择纤芯事件
function change_core1(id1, id2, side) {
	var val = $('#' + id1).val();
	if (val > 0)
	{
		document.getElementById(id2).options.length = 0;
		if (side == 1)
		{
			for (var i = 0; i < g_obj.oneside.length; i ++)
			{
				if (g_obj.oneside[i].id == val)
				{
					if (g_obj.oneside[i].a_type == 0)
					{
						$("<option value='0'>A端</option>").appendTo($("#" + id2));
					}
					if (g_obj.oneside[i].z_type == 0)
					{
						$("<option value='1'>Z端</option>").appendTo($("#" + id2));
					}
					break;
				}
			}
		}
		else
		{
			for (var i = 0; i < g_obj.anotherside.length; i ++)
			{
				if (g_obj.anotherside[i].id == val)
				{
					if (g_obj.anotherside[i].a_type == 0)
					{
						$("<option value='0'>A端</option>").appendTo($("#" + id2));
					}
					if (g_obj.anotherside[i].z_type == 0)
					{
						$("<option value='1'>Z端</option>").appendTo($("#" + id2));
					}
					break;
				}
			}
		}
	}
}

// 纤芯成端
function coreToTerminal() {

	$('#rightclick_contextmenu').hide();
	var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
		modal: true,
		width: 200,
		height: 100,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
		title_html: true,
	});
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findBoxModulesAndTerminalsByAjax",
		data:"id=" + g_obj.rightClickNode,
		success : function(data) {
			isOvertime(data.resultMark);
			$('#dialog-progressbar').dialog('close');
			if (data != null)
			{
				if (data.bms.length > 0)
				{
					g_obj.core_to_terminal_click = null;
					/*var tablehtml = '';
					tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表任务中&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询成端&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子&nbsp;&nbsp;&nbsp;<br/><br/></div>';
					
					tablehtml += '<div>选择光缆：<select id="choose_opticalcable" onchange="change_opticalcable()"></select>选择纤芯：<select id="choose_core"></select></div>';
					for (var i = 0; i < data.bms.length; i ++)
					{
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '</h1>';
						tablehtml += '<div style="width:100%; height:100%;"><table width="100%" id="tables_core_to_terminal_' + i + '"><tr>';
						tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="core_to_terminal_mark_div_' + i + '" class="alert alert-info" style="margin-top:12px;"><label id="core_to_terminal_mark_label_' + i + '">查询成端：</label></div></div>';
						tablehtml += '</div>';
					}
					$('#dialog-core-to-terminal-tables').html(tablehtml);
					document.getElementById('choose_opticalcable').options.length = 0;
					document.getElementById('choose_core').options.length = 0;
					g_obj.core_to_terminal_click = null;
					$.ajax( {
						type : "post",
						url : "opticalcable.do?method=findAllByBoxId",
						data:"id=" + g_obj.rightClickNode,
						success : function(data) {
							if (data != null && data.resultMark == 1)
							{
								$("<option value='0'></option>").appendTo($("#choose_opticalcable"));
								for (var i = 0; i < data.rows.length; i ++)
								{
									$("<option value='" + data.rows[i].id + "'>" + data.rows[i].name + "</option>").appendTo($("#choose_opticalcable"));
								}
							}
						},
						error: function() {
						}
					});
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=40 style='border-top:8px solid white; text-align:center;'>" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].backFreezed != 0)
								{
									str+="<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img id='core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-反面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_yellow.png' width='12px'/></td>";
								}
								else
								{
									if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].backUsed != 0)
									{
										str+="<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='coretoterminalclick(\"core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' onclick='findCoreToTerminal(\"core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\", \"core_to_terminal_mark_div_" + i + "\", \"core_to_terminal_mark_label_" + i + "\", 0)' id='core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-反面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_green.png' width='12px'/></td>";
									}
									else
									{
										str+="<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='coretoterminalclick(\"core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' id='core_to_terminal_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-反面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_grey.png' width='12px'/></td>";
									}
								}
							}
					        str +="</tr>";
					        $("#tables_core_to_terminal_" + i).append(str);
						}
					}*/
					var tablehtml = '';
					tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表损坏&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表预占&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_blue.png" width="12px">&nbsp;代表当前选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询成端&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子/解除成端&nbsp;&nbsp;&nbsp;</div>';
					tablehtml += '<div>选择光缆：<select id="choose_opticalcable" onchange="change_opticalcable()"></select>选择纤芯：<select id="choose_core"></select></div>';
					
					//挖大坑
				    for (var i = 0; i < data.bms.length; i ++)
					{
						if (i % 2 == 0)
						{
							tablehtml += '<div style="width:100%; height:auto; float:left; clear:both;">';
						}
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '面</h1>';
						tablehtml += '<div class="tabbable" id="ct_box_tabs_' + i + '"><ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="ct_myTab4" style="height:50px !important;"><li class="active"><a data-toggle="tab" href="#map_' + i + '">反面</a></li></ul>';
						tablehtml += '<div class="tab-content" id="ct_box_tabs_content_' + i + '">';
						tablehtml += '<div id="ct_map_' + i + '" class="tab-pane in active" style="width:100%; height:100%;"><table width="100%" id="ct_tables_front_' + i + '"><tr>';
						tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						//表头
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="ct_tables_back_mark_div_' + data.bms[i].id + '" class="alert alert-info" style="margin-top:12px;"><label id="ct_tables_back_mark_label_' + data.bms[i].id + '">查询成端：</label></div></div>';

						tablehtml += '</div>';
						tablehtml += '</div>';
						tablehtml += '</div>';
						if (i % 2 == 1)
						{
							tablehtml += '</div>';
						}
					}
					$('#dialog-core-to-terminal-tables').html(tablehtml);
					document.getElementById('choose_opticalcable').options.length = 0;
					document.getElementById('choose_core').options.length = 0;
					g_obj.core_to_terminal_click = null;
					$.ajax( {
						type : "post",
						url : "opticalcable.do?method=findAllByBoxId",
						data:"id=" + g_obj.rightClickNode,
						success : function(data) {
							isOvertime(data.resultMark);
							if (data != null && data.resultMark == 1)
							{
								if (data.rows == null || data.rows.length == 0)
								{
									alert('该光交箱内还没有光缆，请先安装光缆');
								}
								else
								{
									$("<option value='0'></option>").appendTo($("#choose_opticalcable"));
									for (var i = 0; i < data.rows.length; i ++)
									{
										$("<option value='" + data.rows[i].id + "'>" + data.rows[i].name + "</option>").appendTo($("#choose_opticalcable"));
									}
								}
							}
						},
						error: function() {
						}
					});
					//挖小坑
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=60 style='border-top:8px solid white; text-align:left;'>&nbsp;" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								str += "<td width=60 id='ct_showModule_back_terminal_" + data.bms[i].id + "_" + (j + 1) + "_" + (k + 1) + "_outer' style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'></td>";
							}
					        str +="</tr>";
					        $("#ct_tables_front_" + i).append(str);
						}
					}
					for (var i = 0; i < data.bts.length; i ++)
					{
						if (data.bts[i].backFreezed != 0)
						{
							$('#ct_showModule_back_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-反面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_yellow.png' width='12px'/>");
						}
						else
						{
							if (data.bts[i].backUsed != 0)
							{
								$('#ct_showModule_back_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='ct_box_terminal_showModules_back_" + data.bts[i].boxTerminal.id + "' ondblclick='coretoterminalclick(\"ct_box_terminal_showModules_back_" + data.bts[i].boxTerminal.id + "\")' onclick=\"findCoreToTerminal('ct_box_terminal_showModules_back_" + data.bts[i].boxTerminal.id + "', 'ct_tables_back_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "', 'ct_tables_back_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "', 1)\" title='" + data.bts[i].boxTerminal.sideName + "-反面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_green.png' width='12px'/>");
							}
							else
							{
								$('#ct_showModule_back_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='ct_box_terminal_showModules_back_" + data.bts[i].boxTerminal.id + "' ondblclick='coretoterminalclick(\"ct_box_terminal_showModules_back_" + data.bts[i].boxTerminal.id + "\")' onclick=\"findCoreToTerminal('ct_box_terminal_showModules_back_" + data.bts[i].boxTerminal.id + "', 'ct_tables_back_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "', 'ct_tables_back_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "', 1)\" title='" + data.bts[i].boxTerminal.sideName + "-反面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_red.png' width='12px'/>");
							}
						}
					}
					var dialog = $( "#dialog-core-to-terminal" ).removeClass('hide').dialog({
						width: 1100,
						height: 800,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>纤芯成端-" + g_obj.rightClickRowData.box_no + "</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "成端",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									if (g_obj.core_to_terminal_click == null || $('#choose_opticalcable').val() == null || $('#choose_opticalcable').val() == 0 || $('#choose_core').val() == null || $('#choose_core').val() == 0)
									{
										alert('请选择光缆、纤芯和端子!');
									}
									else
									{
										var tempid =  g_obj.core_to_terminal_click.id;
										tempid = tempid.substring(tempid.lastIndexOf('_') + 1, tempid.length);
										$.ajax( {
											type : "post",
											url : "boxinfo.do?method=coreToTerminal",
											data:"tid=" + tempid + "&oid=" + $('#choose_opticalcable').val() + "&cid=" + $('#choose_core').val() + "&bid=" + g_obj.rightClickNode,
											success : function(data) {
												isOvertime(data.resultMark);
												if (data != null && data.resultMark == 1)
												{
													alert('操作成功!');
													$('#' + g_obj.core_to_terminal_click.id).attr('src', 'images/circle_green.png');
													g_obj.core_to_terminal_click = [];
													$('#choose_opticalcable').val(0);
													document.getElementById('choose_core').options.length = 0;
													g_obj.core_to_terminal_click = null;
												}
											},
											error : function() {

												alert('操作失败,请重试');
											}
										});
									}
								}
							},
							{
								text: "取消",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( "#dialog-core-to-terminal" ).dialog("close"); 
								} 
							}
						]
					});
				}
				else
				{
					alert('该光交箱还没有面板和端子，请先添加面板和端子');
				}
			}
		},
		error : function() {
			$('#dialog-progressbar').dialog('close');
		}
	});
}


//端子直熔
function coreToCore() {

	$('#rightclick_contextmenu').hide();
	
	var tablehtml = '';
	tablehtml += '<div>选择一端光缆：<select id="choose_opticalcable_a" onchange="change_opticalcable1(\'choose_opticalcable_a\', \'choose_core_a\', 1)"></select>&nbsp;&nbsp;&nbsp;选择纤芯：<select id="choose_core_a"></select>&nbsp;&nbsp;&nbsp;</div>';
	tablehtml += '<br/><div>选择一端光缆：<select id="choose_opticalcable_z" onchange="change_opticalcable1(\'choose_opticalcable_z\', \'choose_core_z\', 2)"></select>&nbsp;&nbsp;&nbsp;选择纤芯：<select id="choose_core_z"></select>&nbsp;&nbsp;&nbsp;</div>';
	
	$('#dialog-core-to-core-tables').html(tablehtml);
	document.getElementById('choose_opticalcable_a').options.length = 0;
	document.getElementById('choose_core_a').options.length = 0;
	document.getElementById('choose_opticalcable_z').options.length = 0;
	document.getElementById('choose_core_z').options.length = 0;
	$.ajax( {
		type : "post",
		url : "opticalcable.do?method=findAllByBoxId",
		data:"id=" + g_obj.rightClickNode,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null && data.resultMark == 1)
			{
				$("<option value='0'></option>").appendTo($("#choose_opticalcable_a"));
				$("<option value='0'></option>").appendTo($("#choose_opticalcable_z"));
				for (var i = 0; i < data.rows.length; i ++)
				{
					$("<option value='" + data.rows[i].id + "'>" + data.rows[i].name + "</option>").appendTo($("#choose_opticalcable_a"));
					$("<option value='" + data.rows[i].id + "'>" + data.rows[i].name + "</option>").appendTo($("#choose_opticalcable_z"));
				}
			}
		},
		error: function() {
		}
	});
	var dialog = $( "#dialog-core-to-core" ).removeClass('hide').dialog({
		width: 900,
		height: 250,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>端子直熔-" + g_obj.rightClickRowData.box_no + "</h4></div>",
		title_html: true,
		buttons: [
			{
				text: "直熔",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					if ($('#choose_opticalcable_a').val() == null || $('#choose_opticalcable_a').val() == 0 
							|| $('#choose_opticalcable_z').val() == null || $('#choose_opticalcable_z').val() == 0
							|| $('#choose_core_a').val() == null || $('#choose_core_a').val() == 0
							|| $('#choose_core_z').val() == null || $('#choose_core_z').val() == 0)
					{
						alert('请选择光缆、纤芯！');
					}
					else
					{
						if ($('#choose_opticalcable_a').val() == $('#choose_opticalcable_z').val())
						{
							alert('请选择不同的光缆！');
						}
						else
						{
							$.ajax( {
								type : "post",
								url : "boxinfo.do?method=coreToCore",
								data:"bid=" + g_obj.rightClickNode + "&sid=" + $('#choose_core_a').val() + "&eid=" + $('#choose_core_z').val(),
								success : function(data) {
									isOvertime(data.resultMark);
									if (data != null && data.resultMark == 1)
									{
										alert('直熔成功！');
										$("#choose_opticalcable_a").val(0);
										$("#choose_opticalcable_z").val(0);
										document.getElementById('choose_core_a').options.length = 0;
										document.getElementById('choose_core_z').options.length = 0;
									}
								},
								error: function() {
								}
							});
						}
					}
				}
			},
			{
				text: "取消",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-core-to-core" ).dialog("close"); 
				} 
			}
		]
	});
}


// 查询纤芯成端
function findCoreToTerminal(id, div, label, change) {
	/*if (g_obj.core_to_terminal_click)
	{
		$('#' + g_obj.core_to_terminal_click.id).attr('src', 'images/circle_red.png');
		g_obj.core_to_terminal_click = null;
	}*/
	
	var pre = id.substring(0, id.lastIndexOf('_') + 1);
	var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findCoreToTerminal",
		data : "id=" + tempid,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1 && data.object != null)
			{
				/*if (change == 1)
				{
					if (g_obj.showModules_back_terminal != null)
					{
						$('#' + g_obj.showModules_back_terminal.id).attr('src', 'images/circle_green.png');
					}
					g_obj.showModules_back_terminal = {
						id : id,
						src : 'images/circle_green.png'
					};
					$('#' + id).attr('src', 'images/circle_blue.png');
				}*/
				$('#' + label).html('查询成端：端子：' + $('#' + pre + tempid).attr('title') + '&nbsp;与&nbsp;纤芯：' + data.object.core.name + '&nbsp;成端');
			}
			else
			{
				$('#' + label).html('<font style="color:red;">没有查到任何结果</font>');
			}
		},
		error : function() {
			$('#' + label).html('<font style="color:red;">端子：' + $('#' + id).attr('title') + '查询成端失败，请重试！</font>');
		}
	});
}

// 纤芯成端点击事件
function coretoterminalclick(id) {
		if (g_obj.showModules_back_terminal != null)
		{
			$('#' + g_obj.showModules_back_terminal.id).attr('src', 'images/circle_green.png');
			g_obj.showModules_back_terminal = null;
		}
		if ($('#' + id).attr('src') == 'images/circle_blue.png')
		{
			if (g_obj.showModules_back_terminal != null && g_obj.showModules_back_terminal.src == 'images/circle_green.png')
			{
				if (confirm('成端之前要解除已有成端，确定要这么做吗？'))
				{
					var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
					$.ajax( {
						type : "post",
						url : "boxinfo.do?method=relieveCoreToTerminal",
						data:"id=" + tempid,
						success : function(data) {
							isOvertime(data.resultMark);
							if (data != null && data.resultMark == 1)
							{
								alert('操作成功！');
								g_obj.showModules_back_terminal = null;
								if (g_obj.core_to_terminal_click != null)
								{
									$('#' + g_obj.core_to_terminal_click.id).attr('src', 'images/circle_red.png');
								}
								$('#' + id).attr('src', 'images/circle_blue.png');
								g_obj.core_to_terminal_click = {id : id};
							}
						},
						error : function() {
						}
					});
				}
				else
				{
					$('#' + id).attr('src', 'images/circle_green.png');
					g_obj.core_to_terminal_click = null;
				}
			}
			else
			{				
				$('#' + id).attr('src', 'images/circle_red.png');
				g_obj.core_to_terminal_click = null;
			}
		}
		else if ($('#' + id).attr('src') == 'images/circle_red.png')
		{
			if (g_obj.core_to_terminal_click != null)
			{
				$('#' + g_obj.core_to_terminal_click.id).attr('src', 'images/circle_red.png');
			}
			$('#' + id).attr('src', 'images/circle_blue.png');
			g_obj.core_to_terminal_click = {id : id};
		}
		else if ($('#' + id).attr('src') == 'images/circle_green.png')
		{
			if (confirm('成端之前要解除已有成端，确定要这么做吗？'))
			{
				var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
				$.ajax( {
					type : "post",
					url : "boxinfo.do?method=relieveCoreToTerminal",
					data:"id=" + tempid,
					success : function(data) {
						isOvertime(data.resultMark);
						if (data != null && data.resultMark == 1)
						{
							alert('操作成功！');
							if (g_obj.core_to_terminal_click != null)
							{
								$('#' + g_obj.core_to_terminal_click.id).attr('src', 'images/circle_blue.png');
							}
							$('#' + id).attr('src', 'images/circle_blue.png');
							g_obj.core_to_terminal_click = {id : id};
						}
					},
					error : function() {
					}
				});
			}
			else
			{
				$('#' + id).attr('src', 'images/circle_green.png');
			}
		}
}


// 跳纤
function jumpTerminal() {

	$('#rightclick_contextmenu').hide();
	var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
		modal: true,
		width: 200,
		height: 100,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
		title_html: true,
	});
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findBoxModulesAndTerminalsByAjax",
		data:"id=" + g_obj.rightClickNode,
		success : function(data) {
			$( "#dialog-progressbar" ).dialog("close");
			isOvertime(data.resultMark);
			if (data != null)
			{
				if (data.bms.length > 0)
				{
					g_obj.jump_last_click = [];
					g_obj.showModules_front_terminals = [];
					/*var tablehtml = '';
					tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表任务中&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询跳纤&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子/解除跳纤&nbsp;&nbsp;&nbsp;</div>';
					for (var i = 0; i < data.bms.length; i ++)
					{
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '</h1>';
						tablehtml += '<div style="width:100%; height:100%;"><table width="100%" id="tables_jump_' + i + '"><tr>';
						tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=40 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="jump_back_mark_div_' + i + '" class="alert alert-info" style="margin-top:12px;"><label id="jump_back_mark_label_' + i + '">查询跳纤：</label></div></div>';
						tablehtml += '</div>';
					}
					$('#dialog-jump-tables').html(tablehtml);
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=40 style='border-top:8px solid white; text-align:center;'>" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].frontFreezed != 0)
								{
									str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img id='boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_yellow.png' width='12px'/></td>";
								}
								else
								{
									if (data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].frontUsed != 0)
									{
										str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' onclick='findJumpTerminal(\"boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\", \"jump_back_mark_div_" + i + "\", \"jump_back_mark_label_" + i + "\", 0)' id='boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_green.png' width='12px'/></td>";
									}
									else
									{
										str += "<td width=40 style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'><img ondblclick='jumpclick(\"boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "\")' id='boxTerminal_jump_" + data.bts[i * data.bms[i].cols * data.bms[i].rows + j * data.bms[i].cols + k].boxTerminal.id + "' title='" + data.bms[i].sideName + "-正面-" + (j + 1) + "行-" + (k + 1) + "列" + "' src='images/circle_grey.png' width='12px'/></td>";
									}
								}
							}
					        str +="</tr>";
					        $("#tables_jump_" + i).append(str);
						}
					}*/
					var tablehtml = '';
					tablehtml += '<div style=""><img src="images/circle_grey.png" width="12px">&nbsp;代表损坏&nbsp;&nbsp;&nbsp;<img src="images/circle_green.png" width="12px">&nbsp;代表占用&nbsp;&nbsp;&nbsp;<img src="images/circle_yellow.png" width="12px">&nbsp;代表预占&nbsp;&nbsp;&nbsp;<img src="images/circle_red.png" width="12px">&nbsp;代表空闲&nbsp;&nbsp;&nbsp;<img src="images/circle_blue.png" width="12px">&nbsp;代表当前选中</div>';
					tablehtml += '<div style=""><img src="images/click.png" width="12px">&nbsp;单击查询跳纤&nbsp;&nbsp;&nbsp;<img src="images/click.png" width="12px"><img src="images/click.png" width="12px">&nbsp;双击选中端子&nbsp;&nbsp;&nbsp;</div>';
					
					//挖大坑
				    for (var i = 0; i < data.bms.length; i ++)
					{
						if (i % 2 == 0)
						{
							tablehtml += '<div style="width:100%; height:auto; float:left; clear:both;">';
						}
						tablehtml += '<div style="float:left; width:50%; height:auto; padding:20px;"><h1>' + data.bms[i].sideName + '面</h1>';
						tablehtml += '<div class="tabbable" id="jt_box_tabs_' + i + '"><ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="jt_myTab4" style="height:50px !important;"><li class="active"><a data-toggle="tab" href="#map_' + i + '">正面</a></li></ul>';
						tablehtml += '<div class="tab-content" id="jt_box_tabs_content_' + i + '">';
						tablehtml += '<div id="jt_map_' + i + '" class="tab-pane in active" style="width:100%; height:100%;"><table width="100%" id="jt_tables_front_' + i + '"><tr>';
						tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">&nbsp;</th>';
						//表头
						for (var j = 0; j < data.bms[i].cols; j ++)
						{
							tablehtml += '<th width=60 style="border-top:8px solid white; text-align:center;">' + (j + 1) + '</th>';
						}
						tablehtml += '</tr></table><div id="jt_tables_front_mark_div_' + data.bms[i].id + '" class="alert alert-info" style="margin-top:12px;"><label id="jt_tables_front_mark_label_' + data.bms[i].id + '">查询跳纤：</label></div></div>';

						tablehtml += '</div>';
						tablehtml += '</div>';
						tablehtml += '</div>';
						if (i % 2 == 1)
						{
							tablehtml += '</div>';
						}
					}
					$('#dialog-jump-tables').html(tablehtml);
					//挖小坑
					for (var i = 0; i < data.bms.length; i ++)
					{
						for (var j = 0; j < data.bms[i].rows; j ++)
						{
							var str='';
							str += "<tr style='' align='center'>";
							str += "<td width=60 style='border-top:8px solid white; text-align:left;'>&nbsp;" + (j + 1) + "</td>";
							for (var k = 0; k < data.bms[i].cols; k ++)
							{
								str += "<td width=60 id='jt_showModule_front_terminal_" + data.bms[i].id + "_" + (j + 1) + "_" + (k + 1) + "_outer' style='background-color:#4c8fbd; border-top:8px solid white; text-align:center;'></td>";
							}
					        str +="</tr>";
					        $("#jt_tables_front_" + i).append(str);
						}
					}
					for (var i = 0; i < data.bts.length; i ++)
					{
						if (data.bts[i].boxTerminal.status == 4) //预占
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='jt_box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "' onclick=\"findJumpTerminal('jt_box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "', 'jt_tables_front_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "', 'jt_tables_front_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "', 1, 1)\"  ondblclick='jumpclick(\"jt_box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "\")' title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_yellow.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 2) //占用
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='jt_box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "' onclick=\"findJumpTerminal('jt_box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "', 'jt_tables_front_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "', 'jt_tables_front_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "', 1, 1)\"  ondblclick='jumpclick(\"jt_box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "\")' title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_green.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 3) //损坏
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_grey.png' width='12px'/>");
						}
						else if (data.bts[i].boxTerminal.status == 1) //空闲
						{
							$('#jt_showModule_front_terminal_' + data.bts[i].boxTerminal.boxModule.id + '_' + data.bts[i].boxTerminal.row + '_' + data.bts[i].boxTerminal.col + '_outer').html("<img id='jt_box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "' onclick=\"findJumpTerminal('jt_box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "', 'jt_tables_front_mark_div_" + data.bts[i].boxTerminal.boxModule.id + "', 'jt_tables_front_mark_label_" + data.bts[i].boxTerminal.boxModule.id + "', 1, 1)\"  ondblclick='jumpclick(\"jt_box_terminal_showModules_front_" + data.bts[i].boxTerminal.id + "\")' title='" + data.bts[i].boxTerminal.sideName + "-正面-" + data.bts[i].boxTerminal.row + "行-" + data.bts[i].boxTerminal.col + "列" + "' src='images/circle_red.png' width='12px'/>");
						}			
					}
					var dialog = $( "#dialog-jump" ).removeClass('hide').dialog({
						width: 1100,
						height: 800,
						title: "<div class='widget-header widget-header-small'><h4 class='smaller'>跳纤-" + g_obj.rightClickRowData.box_no + "</h4></div>",
						title_html: true,
						buttons: [
							{
								text: "跳纤",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									if (g_obj.jump_last_click.length != 2)
									{
										alert('请选择2个端子');
									}		
									else
									{
										var a = g_obj.jump_last_click[0].id.substring(g_obj.jump_last_click[0].id.lastIndexOf('_') + 1, g_obj.jump_last_click[0].id.length);
										var b = g_obj.jump_last_click[1].id.substring(g_obj.jump_last_click[1].id.lastIndexOf('_') + 1, g_obj.jump_last_click[1].id.length);
										$.ajax( {
											type : "post",
											url : "boxinfo.do?method=jumpTerminal",
											data:"a=" + a + "&b=" + b,
											success : function(data) {
												isOvertime(data.resultMark);
												if (data != null && data.resultMark == 1)
												{
													console.log(g_obj.jump_last_click);
													if (g_obj.jump_last_click[0].image.indexOf('images/circle_red.png') != -1) $('#' + g_obj.jump_last_click[0].id).attr('src', 'images/circle_green.png'); 
													else $('#' + g_obj.jump_last_click[0].id).attr('src', g_obj.jump_last_click[0].image);
													if (g_obj.jump_last_click[1].image.indexOf('images/circle_red.png') != -1) $('#' + g_obj.jump_last_click[1].id).attr('src', 'images/circle_green.png');
													else $('#' + g_obj.jump_last_click[1].id).attr('src', g_obj.jump_last_click[1].image);
													alert('操作成功!');
													g_obj.jump_last_click = [];
												}
											},
											error : function() {
												alert('操作失败，请重试');
											}
										});
									}
								}
							},
							{
								text: "取消",
								"class" : "btn btn-primary btn-xs",
								click: function() {
									$( "#dialog-jump" ).dialog("close"); 
								} 
							}
						]
					});
				}
				else
				{
					alert('该光交箱还没有面板和端子，请先添加面板和端子');
				}
			}
		},
		error : function() {
			$( "#dialog-progressbar" ).dialog("close");
		}
	});
}

// 查询跳纤
function findJumpTerminal(id, div, label, change, type) {
	var pre = id.substring(0, id.lastIndexOf('_') + 1);
	var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=findJumpTerminal",
		data:"id=" + tempid + "&type=" + (type == 1 ? 1 : 0),
		success : function(data) {
			isOvertime(data.resultMark);
			if (data != null && data.resultMark == 1)
			{
				if (data.object != null)
				{
					/*for (var i = 0; i < g_obj.jump_last_click.length; i ++)
					{
						$("#" + g_obj.jump_last_click[i].id).attr("src", "images/circle_red.png");
					}
					g_obj.jump_last_click = [];
					g_obj.findJumpTerminal = [data.object.boxTerminal.id, data.object.frontTerminal.id];
					if (g_obj.findJumpTerminal.length > 0)
					{
						$('#' + div).show();
						if (change == 1)
						{
							if (g_obj.showModules_front_terminals.length > 0)
							{
								$('#' + g_obj.showModules_front_terminals[0].id).attr('src', g_obj.showModules_front_terminals[0].src);
								$('#' + g_obj.showModules_front_terminals[1].id).attr('src', g_obj.showModules_front_terminals[1].src);
							}
							g_obj.showModules_front_terminals = [];
							var a = {
								id : pre + data.object.boxTerminal.id,
								src : $('#' + pre + data.object.boxTerminal.id).attr('src')
							}, b = {
								id : pre + data.object.frontTerminal.id,
								src : $('#' + pre + data.object.frontTerminal.id).attr('src')
							};
							g_obj.showModules_front_terminals.push(a);
							g_obj.showModules_front_terminals.push(b);
							$('#' + pre + data.object.boxTerminal.id).attr('src', 'images/circle_blue.png');
							$('#' + pre + data.object.frontTerminal.id).attr('src', 'images/circle_blue.png');
						}
						$('#' + label).html('查询跳纤：' + $('#' + pre + tempid).attr('title') + '&nbsp;与&nbsp;' + $('#' + pre + (g_obj.findJumpTerminal[0] == tempid ? g_obj.findJumpTerminal[1] : g_obj.findJumpTerminal[0])).attr('title') + '&nbsp;跳纤');
					}*/
					$('#' + label).html(data.object);
				}
				else
				{
					$('#' + label).html('查询失败，请重试！');
				}
			}
		},
		error : function() {
			
		}
	});
}

// 跳纤点击事件
function jumpclick(id) {
	if (g_obj.showModules_front_terminals.length > 0)
	{
		$('#' + g_obj.showModules_front_terminals[0].id).attr('src', g_obj.showModules_front_terminals[0].src);
		$('#' + g_obj.showModules_front_terminals[1].id).attr('src', g_obj.showModules_front_terminals[1].src);
		g_obj.showModules_front_terminals = [];
	}
	if (g_obj.jump_last_click.length <= 1)
	{
		if ($('#' + id).attr('src') != 'images/circle_grey.png')
		{
			var i = 0, isbreak = 0;
			for (i = 0; i < g_obj.jump_last_click.length; i ++)
			{
				if (g_obj.jump_last_click[i].id == id)
				{
					$("#" + id).attr("src", g_obj.jump_last_click[i].image);
					g_obj.jump_last_click.splice(i, 1);
					isbreak = 1;
					break;
				}
			}
			if (isbreak == 0 && i == g_obj.jump_last_click.length)
			{
				g_obj.jump_last_click.push({
						id : id,
						image : $('#' + id)[0].src
				});
				$("#" + id).attr("src", "images/circle_blue.png");
			}
		}
		/*else
		{
			if (confirm('跳纤之前要解除已有跳纤，确定要这么做吗？'))
			{
				var tempid = id.substring(id.lastIndexOf('_') + 1, id.length);
				$.ajax( {
					type : "post",
					url : "boxinfo.do?method=relieveJumpTerminal",
					data:"id=" + tempid,
					success : function(data) {
						isOvertime(data.resultMark);
						if (data != null && data.resultMark == 1)
						{
							if (g_obj.showModules_front_terminals.length > 0)
							{
								$('#' + g_obj.showModules_front_terminals[0].id).attr('src', g_obj.showModules_front_terminals[0].src);
								$('#' + g_obj.showModules_front_terminals[1].id).attr('src', g_obj.showModules_front_terminals[1].src);
								g_obj.showModules_front_terminals = [];
							}
							$('#box_terminal_showModules_front_' + data.object.a.id).attr('src', 'images/circle_red.png');
							$('#box_terminal_showModules_front_' + data.object.b.id).attr('src', 'images/circle_red.png');
							g_obj.jump_last_click.push({
								id : id,
								image : $('#' + id)[0].src
							});
							$("#" + id).attr("src", "images/circle_blue.png");
						}
					},
					error : function() {
					}
				});
			}
		}*/
	}
	else
	{
		var i = 0;
		for (i = 0; i < g_obj.jump_last_click.length; i ++)
		{
			if (g_obj.jump_last_click[i].id == id)
			{
				$("#" + id).attr("src", g_obj.jump_last_click[i].image);
				g_obj.jump_last_click.splice(i, 1);
				break;
			}
		}
		if (i == g_obj.jump_last_click.length)
		{
			$("#" + g_obj.jump_last_click[1].id).attr("src", g_obj.jump_last_click[1].image);
			g_obj.jump_last_click.splice(1, 1);
			g_obj.jump_last_click.push({
					id : id,
					image : $('#' + id)[0].src
			});
			$("#" + id).attr("src", "images/circle_blue.png");
		}
	}
}

function relieveJumpTerminal(id1, id2) {
	if (confirm('确定要解除跳纤么？'))
	{
		$.ajax( {
			type : "post",
			url : "boxinfo.do?method=relieveJumpTerminal",
			data:"id1=" + id1 + "&id2=" + id2,
			success : function(data) {
				isOvertime(data.resultMark);
				if (data != null && data.resultMark == 1)
				{
					if (data.object[0] != null && data.object[0].frontFreezed == 0 && data.object[0].frontUsed == 0)
					{
						$('#jt_box_terminal_showModules_front_' + data.object[0].boxTerminal.id).attr('src', 'images/circle_red.png');
					}
					if (data.object[1] != null && data.object[1].frontFreezed == 0 && data.object[1].frontUsed == 0)
					{
						$('#jt_box_terminal_showModules_front_' + data.object[1].boxTerminal.id).attr('src', 'images/circle_red.png');
					}
					alert('解除成功');
				}
			},
			error : function() {
			}
		});
	}
}

function addLockType() {
	var dialog = $( "#dialog-add-locktype" ).removeClass('hide').dialog({
		modal: true,
		width: 700,
		height: 400,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加智能锁类型</h4></div>",
		title_html: true,
		buttons: [ 
			{
				text: "添加",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					var locktype = {};
					locktype.type = $('#a_locktype_type').val();
					locktype.remarks = $('#a_locktype_remarks').val();
					$.ajax( {
						type : "post",
						url : "lockandkey.do?method=addLockTypeInfo",
						contentType : "application/json;charset=UTF-8",
						data:JSON.stringify(locktype),
						dataType: "json", 
						success : function(data) {
							isOvertime(data.resultMark);
							if (data.resultMark == 1)
							{
								$.ajax( {
									type : "post",
									url : "lockandkey.do?method=findAllLockTypeByAjax",
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											document.getElementById('a_lock_type_id').options.length = 0;
											for (var j = 0; j < data.rows.length; j ++)
											{
												$("<option value='" + data.rows[j].id + "'>" + data.rows[j].type + "</option>").appendTo($("#a_lock_type_id"));
											}
										}
									}
								});
								$( "#dialog-add-locktype" ).dialog( "close" ); 
							}
							else
							{
								alert('添加锁类型失败');
							}
						},
						error : function() {
							alert('添加锁类型失败'); 
						}
					});
				} 
			},
			{
				text: "取消",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					$( "#dialog-add-locktype" ).dialog( "close" ); 
				} 
			}
		]
	});
}


// 操作表格结束

jQuery(function($) {
	//验证搜索条件
	$("#a_form").validate({

		event:"keyup" || "blur",
		errorElement: "em",
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("td").next("td"));
		},
		success: function(label) {
			label.text("ok!").addClass("success");
		},
        rules:{ //定义验证规则 
			a_box_no: {
				required: true,
		 		remote:{   
				    url:'boxinfo.do?method=isBoxNoValid',
				    data:{
		                 box_no : function(){return $('#a_box_no').val();}
		            },
				    type:"post",
				    dateType:"json",
				   }
		 	},
		 	a_controller_id: {
		 		required: true,
		 		remote:{   
				    url:'boxinfo.do?method=isControllerIdValid',
				    data:{
		                 controller_id : function(){return $('#a_controller_id').val();}
		            },
				    type:"post",
				    dateType:"json",
				   }
			},
			a_address: {
				required: true
			},
			a_department_name: {
				required: true
			}
         }, 
         messages:{ //定义提示信息 
 			a_box_no: {
 				required: '光交箱编号不能为空！',
 				remote: '该光交箱编号已存在！'
 		 	},
 		 	a_controller_id: {
 		 		required: '控制器不能为空！',
 				remote: '该控制器编号已存在！'
 			},
 			a_address: {
 				required: '位置不能为空！'
 			},
 			a_department_name: {
 				required: '所属部门不能为空！'
 			}
         } 
    });
	

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
			u_box_no: {
				required: true,
		 		remote:{   
				    url:'boxinfo.do?method=isBoxNoValid',
				    data:{
		                 box_no : function(){return $('#u_box_no').val();},
		                 id : function(){return $('#u_id').val();}
		            },
				    type:"post",
				    dateType:"json",
				   }
		 	},
		 	u_controller_id: {
		 		required: true,
		 		remote:{   
				    url:'boxinfo.do?method=isControllerIdValid',
				    data:{
		                 controller_id : function(){return $('#u_controller_id').val();},
		                 id : function(){return $('#u_id').val();}
		            },
				    type:"post",
				    dateType:"json",
				   }
			},
			u_address: {
				required: true
			},
			u_department_name: {
				required: true
			}
         }, 
         messages:{ //定义提示信息 
 			u_box_no: {
 				required: '光交箱编号不能为空！',
 				remote: '该光交箱编号已存在！'
 		 	},
 		 	u_controller_id: {
 		 		required: '控制器不能为空！',
 				remote: '该控制器编号已存在！'
 			},
 			u_address: {
 				required: '位置不能为空！'
 			},
 			u_department_name: {
 				required: '所属部门不能为空！'
 			}
         } 
    });
	
	$( "#progressbar" ).progressbar({
		value: 100,
		create: function( event, ui ) {
			$(this).addClass('progress progress-striped active')
				   .children(0).addClass('progress-bar progress-bar-success');
		}
	});
	
	var grid_selector = "#grid-table";
	var pager_selector = "#grid-pager";
	var manage_lock_grid_selector = "#manage-lock-grid-table";
	var manage_lock_pager_selector = "#manage-lock-grid-pager";
	// override dialog's title function to allow for HTML titles
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title: function(title) {
			var $title = this.options.title || '&nbsp;'
			if( ("title_html" in this.options) && this.options.title_html == true )
				title.html($title);
			else title.text($title);
		}
	}));

	

	// enable search/filter toolbar
	// jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})

	// switch element when editing inline
	function aceSwitch( cellvalue, options, cell ) {
		setTimeout(function(){
			$(cell) .find('input[type=checkbox]')
					.wrap('<label class="inline" />')
				.addClass('ace ace-switch ace-switch-5')
				.after('<span class="lbl"></span>');
		}, 0);
	}
	// enable datepicker
	function pickDate( cellvalue, options, cell ) {
		setTimeout(function(){
			$(cell) .find('input[type=text]')
					.datepicker({format:'yyyy-mm-dd' , autoclose:true}); 
		}, 0);
	}

	//绑定光交箱列表
	jQuery(grid_selector).jqGrid({
		// direction: "rtl",
		url: 'boxinfo.do?method=listPageByAjax',
		datatype: 'json',
		mtype: 'post',
		rownumbers:true,
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','编号', '状态', '位置', '部门', '型号', '控制器号', '最后通信时间','开门'],
		colModel:[
			{name:'id',index:'id', width:60, sorttype:"int", hidden: true},
			{name:'box_no',index:'box_no',width:70},
			{name:'boxStates',index:'boxStates', sortable:false, width:150, formatter:function(cellvalue, options, rowObject){
					var temp = '';
					var flag  = true ;
					if (rowObject.boxStates != null)
					{
						for (var i = 0; i < rowObject.boxStates.length; i ++)
						{
							//temp += rowObject.boxStates[i].stateKey.state_key + ':' + rowObject.boxStates[i].stateValue.state_value + '<br/>';
							 var stateval=rowObject.boxStates[i].stateValue.state_value;
                             switch (stateval)
                             {
                               case "离线":
                                       temp +='<span class="label label-danger arrowed">离线</span>';
                                       flag = false;
                                       break;
                               case "非法打开":
                                        temp +='<span class="label label-warning arrowed arrowed-right">非法打开</span>';
                                        flag = false;
                                       break;
                               case "电量过低":
                                     temp +='<span class="label label-warning arrowed arrowed-right">电量过低</span>';
                                     flag = false;
                                      break;
                               case "箱体倾斜":
                                    temp +='<span class="label label-warning arrowed arrowed-right">箱体倾斜</span>';
                                    flag = false;
                                        break;
                               case "箱体震动":
                                     temp +='<span class="label label-warning arrowed arrowed-right">箱体震动</span>';
                                     flag = false;
                                    break;
                               case "有浸水":
                                     temp +='<span class="label label-warning arrowed arrowed-right">有浸水</span>';
                                     flag = false;
                                    break;
                               case "温度过低":
                                     temp +='<span class="label label-warning arrowed arrowed-right">温度过低</span>';
                                     flag = false;
                                    break;
                               case "温度过高":
                                     temp +='<span class="label label-warning arrowed arrowed-right">温度过高</span>';
                                     flag = false;
                                    break;
                            }

						}

						 if (flag)
							temp = '<span class="label label-success arrowed-in arrowed-in-right">正常</span>';
					}
					return temp;
				}
			},
			{name:'address',index:'address', width:120},
			{name:'department',index:'department.name', width:90, formatter:function(cellvalue, options, rowObject){
					return rowObject.department == null ? "" : rowObject.department.name;
				}
			},
			{name:'box_type',index:'box_type', width:60},
			{name:'controller_id',index:'controller_id', width:120},
			{name:'boxVarInfo',index:'boxVarInfo', width:120, formatter:function(cellvalue, options, rowObject){
					
					return rowObject.boxVarInfo == null ? "" :  new Date(rowObject.boxVarInfo.last_heard).Format("yyyy-MM-dd hh:mm:ss");
				}
			},
			 { name: 'id2', index: 'id',  width:70, formatter: function (cellvalue, options, rowObject) { 
				
				if ($('#boxinfo_opendoor').val() == 'true')
				    return "<a href='javascript:void(0);'  class='btn btn-danger btn-sm'  onclick='opendoor(\"" + rowObject.id + "\")'>开门</a>"
			    else
			    	return '';
			 } },
		], 

		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : pager_selector,
		altRows: true,
		// toppager: true,
		ondblClickRow: function(rowid,irow,icol,e) {
		},
		onRightClickRow: function(rowid,irow,icol,e) {
			g_obj.rightClickPos = {
					pageX : e.pageX,
					pageY : e.pageY
			};
			$('#rightclick_contextmenu').css("left", e.pageX + "px");
			$('#rightclick_contextmenu').css("top", e.pageY + "px");
			$('#rightclick_contextmenu').show();
			g_obj.rightClickRowData = $('#grid-table').jqGrid('getRowData',rowid);
			g_obj.rightClickNode = g_obj.rightClickRowData.id;
		},
		loadComplete: function(xhr) {
			//console.log(xhr);
		},
		multiselect: true,

		loadComplete : function(data) {
			isOvertime(data.resultMark);
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);
				
				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		autowidth: true

	});

	// 绑定光交箱列表分页
	g_obj.boxinfogrid = jQuery(grid_selector).jqGrid('navGrid',pager_selector, 
		{ 	// navbar options
			edit: $('#boxinfo_update').val() == 'true' ? true : false,
			editfunc: function(){
				var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('请选择一行数据！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else if (array.length > 1)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('只能选择一行数据！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else
				{
					/*$('#u_boxStates').html('');
					$('#u_boxModules').html('');*/
					$.ajax( {
						type : "post",
						url : "boxinfo.do?method=findByAjax",
						data : "id=" + array[0],
						success : function(data) {
							isOvertime(data.resultMark);
							var _data = data;
							if (data.resultMark == 1)
							{
								$("#u_id").val(data.object.id);
								$('#u_box_no').val(data.object.box_no);
								$('#u_controller_id').val(data.object.controller_id);
								$('#u_address').val(data.object.address);
								$('#u_business_area').val(data.object.business_area);
								$('#u_sim_phone_no').val(data.object.sim_phone_no);
								$('#u_longitude').val(data.object.longitude);
								$('#u_latitude').val(data.object.latitude);
								if (data.object.department != null)
								{
									$('#u_department_id').val(data.object.department.id);
									$('#u_department_name').val(data.object.department.name);
								}
								$('#u_box_type').val(data.object.box_type);
								$('#u_k_code').val(data.object.k_code);
								if (data.object.workorder_department != null)
								{
									$('#u_workorder_department_id').val(data.object.workorder_department.id);
									$('#u_workorder_department').val(data.object.workorder_department.name);
								}
								if (data.object.workorder_receive_id != null)
								{
									$('#u_workorder_receive_id').val(data.object.workorder_receive_id.id);
									$('#u_workorder_receive_name').val(data.object.workorder_receive_id.full_name);
								}
								if (data.object.sms_notifiable == 0)
								{
									$(":radio[name='u_message'][value='0']").attr("checked","checked");
								}
								else
								{
									$(":radio[name='u_message'][value='1']").attr("checked","checked");
								}
								if (data.object.box_setting_flag == 0)
								{
									$(":radio[name='u_boxsetting'][value='0']").attr("checked","checked");
								}
								else
								{
									$(":radio[name='u_boxsetting'][value='1']").attr("checked","checked");
								}
								if (data.object.modificationInfo_flag == 0)
								{
									$(":radio[name='u_modification'][value='0']").attr("checked","checked");
								}
								else
								{
									$(":radio[name='u_modification'][value='1']").attr("checked","checked");
								}
								$('#u_sms_reason').val(data.object.sms_reason);
								$('#u_remarks').val(data.object.remarks);
								/*if (data.object.boxModules != null)
								{
									for (var i = 0; i < data.object.boxModules.length; i ++)
									{
										for (var j = i + 1; j < data.object.boxModules.length; j ++)
										{
											if (data.object.boxModules[i].sideName > data.object.boxModules[j].sideName)
											{
												var temp = data.object.boxModules[i];
												data.object.boxModules[i] = data.object.boxModules[j];
												data.object.boxModules[j] = temp;
											}
										}
									}
									for (var i = 0; i < data.object.boxModules.length; i ++)
									{
										var str='';
										str+="<tr align='center'>";
									    str+="<td><input type='text' readonly='readonly' value='" + data.object.boxModules[i].sideName + "面'/></td>";
									    str+="<td><input type='text' readonly='readonly' value='" + data.object.boxModules[i].rows + "'/></td>";
									    str+="<td><input type='text' readonly='readonly' value='" + data.object.boxModules[i].cols + "'/></td>";
									    str+="</tr>";
									    $("#u_boxModules").append(str);
									}
								}*/
								var dialog = $( "#dialog-message-update" ).removeClass('hide').dialog({
									modal: true,
									width: 900,
									height: 700,
									title: "<div class='widget-header widget-header-small'><h4 class='smaller'>修改光交箱-" + data.object.box_no + "</h4></div>",
									title_html: true,
									buttons: [ 
										{
											text: "确定",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												if ($('#u_form').valid())
												{
													var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
														modal: true,
														width: 200,
														height: 100,
														title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
														title_html: true,
													});
													var boxInfo = '';
													boxInfo += 'id=' + $('#u_id').val();
													boxInfo += '&box_no=' +  $('#u_box_no').val();
													boxInfo += '&controller_id=' + ($('#u_controller_id').val() == '' ? 0 : $('#u_controller_id').val());
													boxInfo += '&address=' + $('#u_address').val();
													boxInfo += '&business_area=' + $('#u_business_area').val();
													boxInfo += '&sim_phone_no=' + $('#u_sim_phone_no').val();
													boxInfo += '&longitude=' + $('#u_longitude').val();
													boxInfo += '&latitude=' + $('#u_latitude').val();
													if ($('#u_department_name').val() != null && $('#u_department_name').val() != '')
													{
														boxInfo += '&department.id=' + $('#u_department_id').val();
													}
													boxInfo += '&box_type=' + $('#u_box_type').val();
													boxInfo += '&k_code=' + $('#u_k_code').val();
													if ($('#u_workorder_department').val() != null && $('#u_workorder_department').val() != '')
													{
														boxInfo += '&workorder_department.id=' + $('#u_workorder_department_id').val();
													}
													boxInfo += '&sms_notifiable=' + Number($(':radio[name="u_message"]:checked').val());
													if ($('#u_workorder_receive_name').val() != null && $('#u_workorder_receive_name').val() != '')
													{
														boxInfo += '&workorder_receive_id.id=' + $('#u_workorder_receive_id').val();
													}
													boxInfo += '&sms_reason=' + $('#u_sms_reason').val();
													boxInfo += '&remarks=' + $('#u_remarks').val();
													boxInfo += '&box_setting_flag=' + Number($(':radio[name="u_boxsetting"]:checked').val());
													boxInfo += '&modificationInfo_flag=' + Number($(':radio[name="u_modification"]:checked').val());
													$.ajax( {
														type : "post",
														url : "boxinfo.do?method=update",
														data: boxInfo,
														success : function(data) {
															isOvertime(data.resultMark);
															if (data.resultMark == 1)
															{
																$('#add_statekey_mark_div').show();
																$('#add_statekey_mark_label').html('修改光交箱成功！');
																mySetTimeOut('add_statekey_mark_div', 4000);
																$('#grid-table').trigger("reloadGrid");
															}
															else
															{
																$('#add_statekey_mark_div').show();
																$('#add_statekey_mark_label').html('修改光交箱失败，请重试！');
																mySetTimeOut('add_statekey_mark_div', 4000);
															}
															$( "#dialog-progressbar" ).dialog("close");
															$( "#dialog-message-update" ).dialog( "close" ); 
														},
														error : function() {
															$('#add_statekey_mark_div').show();
															$('#add_statekey_mark_label').html('修改光交箱失败，请重试！');
															mySetTimeOut('add_statekey_mark_div', 4000);
															$( "#dialog-progressbar" ).dialog("close");
															$( "#dialog-message-update" ).dialog( "close" ); 
														}
													});
												}
											} 
										},
										{
											text: "取消",
											"class" : "btn btn-primary btn-xs",
											click: function() {
												$( "#dialog-message-update" ).dialog( "close" ); 
											} 
										}
									]
								});
							}
						}
					}); 
				}
			},
			editicon : 'icon-pencil blue',
			add: $('#boxinfo_add').val() == 'true' ? true : false,
			addfunc: function(){
				$('#boxModules').html('');
				g_obj.addBoxModuleRows = 0; //reset the boxModule rows
				var dialog = $( "#dialog-message" ).removeClass('hide').dialog({
					modal: true,
					width: 900,
					height: 700,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加光交箱</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								if ($('#a_form').valid())
								{
									var dialog = $( "#dialog-progressbar" ).removeClass('hide').dialog({
										modal: true,
										width: 200,
										height: 100,
										title: "<div class='widget-header widget-header-small'><h4 class='smaller'>请稍候...</h4></div>",
										title_html: true,
									});
									var boxInfo = '';
									boxInfo += 'box_no=' +  $('#a_box_no').val();
									boxInfo += '&controller_id=' + ($('#a_controller_id').val() == '' ? 0 : $('#a_controller_id').val());
									boxInfo += '&address=' + $('#a_address').val();
									boxInfo += '&business_area=' + $('#a_business_area').val();
									boxInfo += '&sim_phone_no=' + $('#a_sim_phone_no').val();
									boxInfo += '&longitude=' + $('#a_longitude').val();
									boxInfo += '&latitude=' + $('#a_latitude').val();
									if ($('#a_department_name').val() != null && $('#a_department_name').val() != '')
									{
										boxInfo += '&department.id=' + $('#a_department_id').val();
									}
									boxInfo += '&box_type=' + $('#a_box_type').val();
									boxInfo += '&k_code=' + $('#a_k_code').val();
									if ($('#a_workorder_department').val() != null && $('#a_workorder_department').val() != '')
									{
										boxInfo += '&workorder_department.id=' + $('#a_workorder_department_id').val();
									}
									boxInfo += '&sms_notifiable=' + Number($(':radio[name="a_message"]:checked').val());
									if ($('#a_workorder_receive_name').val() != null && $('#a_workorder_receive_name').val() != '')
									{
										boxInfo += '&workorder_receive_id.id=' + $('#a_workorder_receive_id').val();
									}
									boxInfo += '&sms_reason=' + $('#a_sms_reason').val();
									boxInfo += '&remarks=' + $('#a_remarks').val();
									boxInfo += '&box_setting_flag=' + Number($(':radio[name="a_boxsetting"]:checked').val());
									boxInfo += '&modificationInfo_flag=' + Number($(':radio[name="a_modification"]:checked').val());
									/*for (var i = 0; i < g_obj.addBoxModuleRows; i ++)
									{
										if ($('#addBoxModuleRow_rows_' + i).val() != '' && $('#addBoxModuleRow_cols_' + i).val() != '')
										{
											boxInfo += '&boxModules[' + i + '].sideName=' + $('#addBoxModuleRow_sideName_' + i).val();
											boxInfo += '&boxModules[' + i + '].rows=' + $('#addBoxModuleRow_rows_' + i).val();
											boxInfo += '&boxModules[' + i + '].cols=' + $('#addBoxModuleRow_cols_' + i).val();
										}
									}*/
									$.ajax( {
										type : "post",
										url : "boxinfo.do?method=add",
										data: boxInfo,
										success : function(data) {
											isOvertime(data.resultMark);
											if (data.resultMark == 1)
											{
												$('#add_statekey_mark_div').show();
												$('#add_statekey_mark_label').html('添加光交箱成功！');
												mySetTimeOut('add_statekey_mark_div', 4000);
												$('#grid-table').trigger("reloadGrid");
											}
											else
											{
												$('#add_statekey_mark_div').show();
												$('#add_statekey_mark_label').html('添加光交箱失败，请重试！');
												mySetTimeOut('add_statekey_mark_div', 4000);
											}
											$( "#dialog-progressbar" ).dialog("close");
											$( "#dialog-message" ).dialog( "close" ); 
										},
										error : function() {
											$('#add_statekey_mark_div').show();
											$('#add_statekey_mark_label').html('添加光交箱失败，请重试！');
											mySetTimeOut('add_statekey_mark_div', 4000);
											$( "#dialog-progressbar" ).dialog("close");
											$( "#dialog-message" ).dialog( "close" ); 
										}
									});
								}
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-message" ).dialog( "close" ); 
							} 
						}
					]
				});
			},
			addicon : 'icon-plus-sign purple',
			del: $('#boxinfo_delete').val() == 'true' ? true : false,
			delfunc : function () {
				var array = $('#grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#add_statekey_mark_div').show();
					$('#add_statekey_mark_label').html('请选择至少一行数据！');
					mySetTimeOut('add_statekey_mark_div', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，你确认要删除吗？"))
					{
						var ids = [];
						for (var i = 0; i < array.length; i ++)
						{
							ids.push(array[i]);
						}
						$.ajax( {
							type : "post",
							url : "boxinfo.do?method=delete",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(ids),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#add_statekey_mark_div').show();
									$('#add_statekey_mark_label').html('删除光交箱成功！');
									mySetTimeOut('add_statekey_mark_div', 4000);
									$('#grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#add_statekey_mark_div').show();
									$('#add_statekey_mark_label').html('删除光交箱失败，请重试！');
									mySetTimeOut('add_statekey_mark_div', 4000);
								}
							},
							error : function() {
								$('#add_statekey_mark_div').show();
								$('#add_statekey_mark_label').html('删除光交箱失败，请重试！');
								mySetTimeOut('add_statekey_mark_div', 4000);
							}
						});
					}
				}
			},
			delicon : 'icon-trash red',
			search: true,
			searchfunc: function() {
				detailsearch();
			},
			searchicon : 'icon-search orange',
			refresh: true,
			refreshicon : 'icon-refresh green',
			view: false,
			viewicon : 'icon-zoom-in grey',
		},
		{
			// edit record form
			// closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			}
		},
		{
			// new record form
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			}
		},
		{
			// delete record form
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;
				
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);
				
				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			}
		},
		{
			// search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,
			/**
			 * multipleGroup:true, showQuery: true
			 */
		},
		{
			// view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		}
	);
	if ($('#boxinfo_import').val() == 'true')
	{
		g_obj.boxinfogrid.navButtonAdd(pager_selector,{
			caption: '',
			title: '导入',
	        buttonicon:"icon-upload",    //按钮icon
	        onClickButton: function(){    //执行操作
	        	uploadexcel();
	        },    
	        position:"first"  //按钮位置 
	    });
	}
	if ($('#boxinfo_export').val() == 'true')
	{	

		g_obj.boxinfogrid.navButtonAdd(pager_selector,{
	    	caption: '',
	    	title: '导出',
	        buttonicon:"icon-download",    //按钮icon
	        onClickButton: function(){    //执行操作
	   var box_no = $('#f_s_box_no').val();
	    var controller_id = $('#f_s_controller_id').val();
	 //   var box_address = $('#f_s_box_address').val();
	    var box_simno = $('#f_s_box_sim_no').val();
	    var box_dep = $('#f_s_department_id').val();
        var  para='';
        if (box_no != '')
		{
		   para+= '&box_no=' + box_no;
		}
	
		if (controller_id != '')
		{
			 para+= '&controller_id=' + controller_id;
		}
		/*if (box_address != '')
		{
			 para+= '&address=' + box_address;
		}*/
		if (box_simno != '')
		{
			 para+= '&sim_phone_no=' + box_simno;
		}
		if (box_dep != '')
		{
			 para+= '&department_id=' + box_dep;
		}
	          if (confirm('确定要导出光交箱吗？'))
	    	  {
	        	  window.location.target = "_blank";
	        	  window.location.href = "boxinfo.do?method=exportBoxinfo" + para;
	    	  }
	        },    
	        position:"first"  //按钮位置 
	    });
	}
	
	//绑定锁列表
	jQuery(manage_lock_grid_selector).jqGrid({
		// direction: "rtl",
		url: 'lockandkey.do?method=listLockInfoPageByAjax',  
		datatype: 'json',
		mtype: 'post',
		prmNames: {sort: 'sort', order: 'order'},
		height: 'auto',
		loadtext: '加载中...',
		colNames:['ID','锁编码', '光交箱编号', '锁类型', '备注'],
		colModel:[
			{name:'id',index:'id', width:60, hidden: true},
			{name:'lock_code',index:'lock_code',width:150},
			{name:'boxInfo',index:'boxInfo.box_no', sortable:false, width:150, formatter:function(cellvalue, options, rowObject){
					var temp = '';
					if (rowObject.boxInfo != null)
					{
						temp = rowObject.boxInfo.box_no;
					}
					else
					{
						temp = "";
					}
					return temp;
				}
			},
			{name:'lockTypeInfo',index:'lockTypeInfo.type', width:150, formatter:function(cellvalue, options, rowObject){
					return rowObject.lockTypeInfo == null ? "─────" : rowObject.lockTypeInfo.type;
				}
			},   
			{name:'remarks',index:'remarks',width:150}
		],
		viewrecords : true,
		rowNum:10,
		rowList:[10,20,30,50,80],
		pager : manage_lock_pager_selector,
		altRows: true,
		// toppager: true,
		ondblClickRow: function() {
			var table = this;
			console.log($('#manage-lock-grid-table').jqGrid('getGridParam','selarrrow'));
		},
		onRightClickRow: function(rowid,irow,icol,e) {
		},
		loadComplete: function(xhr) {
			//console.log(xhr);
		},
		multiselect: true,

		loadComplete : function(data) {
			isOvertime(data.resultMark);
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);
				
				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
		},
		autowidth: true

	});

	// 绑定锁列表分页
	jQuery(manage_lock_grid_selector).jqGrid('navGrid', manage_lock_pager_selector,
		{ 	// navbar options
			edit: false,
			editicon : 'icon-pencil blue',
			add: true,
			addfunc: function(){
				$('#a_lock_box_no').val(g_obj.rightClickRowData.box_no);
				$('#a_lock_box_id').val(g_obj.rightClickRowData.id);
				$.ajax( {
					type : "post",
					url : "lockandkey.do?method=findAllLockTypeByAjax",
					success : function(data) {
						isOvertime(data.resultMark);
						if (data.resultMark == 1)
						{
							document.getElementById('a_lock_type_id').options.length = 0;
							for (var j = 0; j < data.rows.length; j ++)
							{
								$("<option value='" + data.rows[j].id + "'>" + data.rows[j].type + "</option>").appendTo($("#a_lock_type_id"));
							}
						}
					}
				});
				var dialog = $( "#dialog-add-lock" ).removeClass('hide').dialog({
					modal: true,
					width: 700,
					height: 600,
					title: "<div class='widget-header widget-header-small'><h4 class='smaller'>添加智能锁</h4></div>",
					title_html: true,
					buttons: [ 
						{
							text: "添加",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								var lock = {};
								lock.lock_code = $('#a_lock_lock_code').val();
								lock.boxInfo = {};
								lock.boxInfo.id = $('#a_lock_box_id').val();
								lock.lockTypeInfo = {};
								lock.lockTypeInfo.id = $('#a_lock_type_id').val();
								lock.remarks = $('#a_lock_remarks').val();
								$.ajax( {
									type : "post",
									url : "lockandkey.do?method=addLockInfo",
									contentType : "application/json;charset=UTF-8",
									data:JSON.stringify(lock),
									dataType: "json", 
									success : function(data) {
										isOvertime(data.resultMark);
										if (data.resultMark == 1)
										{
											$('#manage_lock_warn').show();
											$('#manage_lock_warn_label').html('添加智能锁成功！');
											mySetTimeOut('manage_lock_warn', 4000);
											$('#manage-lock-grid-table').trigger("reloadGrid");
											$('#grid-table').trigger("reloadGrid");
										}
										else
										{
											$('#manage_lock_warn').show();
											$('#manage_lock_warn_label').html('添加智能锁失败，请重试！');
											mySetTimeOut('manage_lock_warn', 4000);
										}
										$( "#dialog-add-lock" ).dialog( "close" ); 
									},
									error : function() {
										$('#manage_lock_warn').show();
										$('#manage_lock_warn_label').html('添加智能锁失败，请重试！');
										mySetTimeOut('manage_lock_warn', 4000);
										$( "#dialog-add-lock" ).dialog( "close" ); 
									}
								});
							} 
						},
						{
							text: "取消",
							"class" : "btn btn-primary btn-xs",
							click: function() {
								$( "#dialog-add-lock" ).dialog( "close" ); 
							} 
						}
					]
				});
			},
			addicon : 'icon-plus-sign purple',
			del: true,
			delicon : 'icon-trash red',
			delfunc: function () {
				var array = $('#manage-lock-grid-table').jqGrid('getGridParam','selarrrow');
				if (array.length <= 0)
				{
					$('#manage_lock_warn').show();
					$('#manage_lock_warn_label').html('请选择至少一行数据！');
					mySetTimeOut('manage_lock_warn', 4000);
				}
				else
				{
					if (confirm("删除是不可恢复的，你确认要删除吗？"))
					{
						var ids = [];
						for (var i = 0; i < array.length; i ++)
						{
							ids.push(array[i]);
						}
						$.ajax( {
							type : "post",
							url : "lockandkey.do?method=deleteLockInfo",
							dataType:"json",      
							contentType:"application/json",   
							data:JSON.stringify(ids),
							success : function(data) {
								isOvertime(data.resultMark);
								if (data.resultMark == 1)
								{
									$('#manage_lock_warn').show();
									$('#manage_lock_warn_label').html('删除智能锁成功！');
									mySetTimeOut('manage_lock_warn', 4000);
									$('#manage-lock-grid-table').trigger("reloadGrid");
								}
								else
								{
									$('#manage_lock_warn').show();
									$('#manage_lock_warn_label').html('删除智能锁失败，请重试！');
									mySetTimeOut('manage_lock_warn', 4000);
								}
							},
							error : function() {
								$('#manage_lock_warn').show();
								$('#manage_lock_warn_label').html('删除智能锁失败，请重试！');
								mySetTimeOut('manage_lock_warn', 4000);
							}
						});
					}
				}
			},
			search: false,
			searchicon : 'icon-search orange',
			refresh: true,
			refreshicon : 'icon-refresh green',
			view: false,
			viewicon : 'icon-zoom-in grey',
		},
		{
			// edit record form
			// closeAfterEdit: true,
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			}
		},
		{
			// new record form
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			}
		},
		{
			// delete record form
			recreateForm: true,
			beforeShowForm : function(e) {
				var form = $(e[0]);
				if(form.data('styled')) return false;
				
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);
				
				form.data('styled', true);
			},
			onClick : function(e) {
				alert(1);
			}
		},
		{
			// search form
			recreateForm: true,
			afterShowSearch: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function(){
				style_search_filters($(this));
			}
			,
			multipleSearch: true,
			/**
			 * multipleGroup:true, showQuery: true
			 */
		},
		{
			// view record form
			recreateForm: true,
			beforeShowForm: function(e){
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		}
	)


	
	function style_edit_form(form) {
		// enable datepicker on "sdate" field and switches for "stock" field
		form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
			.end().find('input[name=stock]')
				  .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

		// update buttons classes
		var buttons = form.next().find('.EditButton .fm-button');
		buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();// ui-icon,
																			// s-icon
		buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
		buttons.eq(1).prepend('<i class="icon-remove"></i>')
		
		buttons = form.next().find('.navButton a');
		buttons.find('.ui-icon').remove();
		buttons.eq(0).append('<i class="icon-chevron-left"></i>');
		buttons.eq(1).append('<i class="icon-chevron-right"></i>');		
	}

	function style_delete_form(form) {
		var buttons = form.next().find('.EditButton .fm-button');
		buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();// ui-icon,
																			// s-icon
		buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
		buttons.eq(1).prepend('<i class="icon-remove"></i>')
	}
	
	function style_search_filters(form) {
		form.find('.delete-rule').val('X');
		form.find('.add-rule').addClass('btn btn-primary btn-xs btn-primary');
		form.find('.add-group').addClass('btn btn-primary btn-xs btn-success');
		form.find('.delete-group').addClass('btn btn-primary btn-xs btn-danger');
	}
	function style_search_form(form) {
		var dialog = form.closest('.ui-jqdialog');
		var buttons = dialog.find('.EditTable')
		buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
		buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
		buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
	}
	
	function beforeDeleteCallback(e) {
		var form = $(e[0]);
		if(form.data('styled')) return false;
		
		form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
		style_delete_form(form);
		
		form.data('styled', true);
	}
	
	function beforeEditCallback(e) {
		var form = $(e[0]);
		form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
		style_edit_form(form);
	}



	// it causes some flicker when reloading or navigating grid
	// it may be possible to have some custom formatter to do this as the grid
	// is being created to prevent this
	// or go back to default browser checkbox styles for the grid
	function styleCheckbox(table) {
	/**
	 * $(table).find('input:checkbox').addClass('ace') .wrap('<label />')
	 * .after('<span class="lbl align-top" />')
	 * 
	 * 
	 * $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
	 * .find('input.cbox[type=checkbox]').addClass('ace') .wrap('<label
	 * />').after('<span class="lbl align-top" />');
	 */
	}
	

	// unlike navButtons icons, action icons in rows seem to be hard-coded
	// you can change them like this in here if you want
	function updateActionIcons(table) {
		/**
		 * var replacement = { 'ui-icon-pencil' : 'icon-pencil blue',
		 * 'ui-icon-trash' : 'icon-trash red', 'ui-icon-disk' : 'icon-ok green',
		 * 'ui-icon-cancel' : 'icon-remove red' }; $(table).find('.ui-pg-div
		 * span.ui-icon').each(function(){ var icon = $(this); var $class =
		 * $.trim(icon.attr('class').replace('ui-icon', '')); if($class in
		 * replacement) icon.attr('class', 'ui-icon '+replacement[$class]); })
		 */
	}
	
	// replace icons with FontAwesome icons like above
	function updatePagerIcons(table) {
		var replacement = 
		{
			'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
			'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
			'ui-icon-seek-next' : 'icon-angle-right bigger-140',
			'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
		};
		$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
			var icon = $(this);
			var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
			
			if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
		})
	}

	function enableTooltips(table) {
		$('.navtable .ui-pg-button').tooltip({container:'body'});
		$(table).find('.ui-pg-div').tooltip({container:'body'});
	}

	// var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');

	// Menu
	$("#menu").menu();

});