$(document).ready(function(){
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=getBoxGlobals",
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1 && data.object != null)
			{
				$('#id').val(data.object.id);
				$('#hb_interval').val(data.object.hb_interval);
				$('#volt_threshold').val(data.object.volt_threshold);
				$('#high_t_threshold').val(data.object.high_t_threshold);
				$('#low_t_threshold').val(data.object.low_t_threshold);
				$('#shake_threshold').val(data.object.shake_threshold);
				$('#shake_rate').val(data.object.shake_rate);
				$('#angle_threshold').val(data.object.angle_threshold);
				$('#center_ip').val(data.object.center_ip);
				$('#center_upd_port').val(data.object.center_upd_port);
				$('#open_lock_timeout').val(data.object.open_lock_timeout);
				//$('#sms_per_month').val(data.object.sms_per_month);
				$('#remarks').val(data.object.remarks);
			}
		},
		error : function() {
		}
	});
});


function settingsubmit()
{
	data = '';
	if ($('#id').val() != '')
	{
		data += 'id=' + $('#id').val() + '&';
	}
	if ($('#hb_interval').val() != '')
	{
		data += 'hb_interval=' + $('#hb_interval').val() + '&';
	}
	if ($('#volt_threshold').val() != '')
	{
		data += 'volt_threshold=' + $('#volt_threshold').val() + '&';
	}
	if ($('#high_t_threshold').val() != '')
	{
		data += 'high_t_threshold=' + $('#high_t_threshold').val() + '&';
	}
	if ($('#low_t_threshold').val() != '')
	{
		data += 'low_t_threshold=' + $('#low_t_threshold').val() + '&';
	}
	if ($('#shake_threshold').val() != '')
	{
		data += 'shake_threshold=' + $('#shake_threshold').val() + '&';
	}
	if ($('#shake_rate').val() != '')
	{
		data += 'shake_rate=' + $('#shake_rate').val() + '&';
	}
	if ($('#angle_threshold').val() != '')
	{
		data += 'angle_threshold=' + $('#angle_threshold').val() + '&';
	}
	if ($('#center_ip').val() != '')
	{
		data += 'center_ip=' + $('#center_ip').val() + '&';
	}
	if ($('#center_upd_port').val() != '')
	{
		data += 'center_upd_port=' + $('#center_upd_port').val() + '&';
	}
	if ($('#open_lock_timeout').val() != '')
	{
		data += 'open_lock_timeout=' + $('#open_lock_timeout').val() + '&';
	}
	/*if ($('#sms_per_month').val() != '')
	{
		data += 'sms_per_month=' + $('#sms_per_month').val() + '&';
	}*/
	if ($('#remarks').val() != '')
	{
		data += 'remarks=' + $('#remarks').val() + '&';
	}
	data = data.substring(0, data.length - 1);
	if ($('#a_form').valid()){
	
	$.ajax( {
		type : "post",
		url : "boxinfo.do?method=updateBoxGlobals",
		data: data,
		success : function(data) {
			isOvertime(data.resultMark);
			if (data.resultMark == 1)
			{
				alert('设置成功！');
			}
		},
		error : function() {
			alert('数据错误,请重试！');
		}
	});
  
   }
	return false;
}

var g_obj = {};

function rightMenuMouseOver() {
}

function rightMenuMouseOut() {
}




//操作表格
function getDel(k){
 $(k).parent().remove();
}

//操作表格结束
var manage_grant_grid_selector = "#manage-grant-grid-table";
var manage_grant_pager_selector = "#manage-grant-grid-pager";
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




//快速检索
function fastsearch() {
	var controller_id = $('#f_s_controller_id').val();
	var alarm_type = $('#f_s_alarm_type').val();
	var filter  = /^[0-9]*$/;
	if (controller_id != '' || alarm_type != '')
	{
		if (! filter.test(controller_id))
		{
			alert('控制器ID为整数');
			return false;
		}
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
            postData:null, //发送搜索条件 
        });
		var postData = {};
		if (controller_id != '')
		{
			postData.controller_id = controller_id;
		}
		if (alarm_type != '')
		{
			postData.alarm_type = alarm_type;
		}
		$("#manage-grant-grid-table").jqGrid('setGridParam',{ 
            url:'boxeventandwarn.do?method=listAlarmEventPageByAjax',//你的搜索程序地址 
            postData:postData, //发送搜索条件 
            page:1 
        }).trigger("reloadGrid"); //重新载入
	}
}



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
			open_lock_timeout: {
				digits: true
		 	}
         }, 
         messages:{ //定义提示信息 
 			open_lock_timeout: {
				digits: "开门申请有效时间请填入整数"
		 	}
         } 
    });
	


	
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
		form.find('.add-rule').addClass('btn btn-xs btn-primary');
		form.find('.add-group').addClass('btn btn-xs btn-success');
		form.find('.delete-group').addClass('btn btn-xs btn-danger');
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