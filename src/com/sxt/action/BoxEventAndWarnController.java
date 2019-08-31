package com.sxt.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.sxt.po.AjaxRetObjTemplate;
import com.sxt.po.AlarmEvent;
import com.sxt.po.AlarmEventSearch;
import com.sxt.po.DeleteAlarmForm;
import com.sxt.po.DeleteDoorForm;
import com.sxt.po.Department;
import com.sxt.po.DepartmentSearch;
import com.sxt.po.DoorEvent;
import com.sxt.po.DoorEventSearch;
import com.sxt.po.GlobalSearch;
import com.sxt.po.GrantLog;
import com.sxt.po.GrantLogSearch;
import com.sxt.po.KeyInfo;
import com.sxt.po.KeyInfoSearch;
import com.sxt.po.KeyTypeInfo;
import com.sxt.po.KeyTypeInfoSearch;
import com.sxt.po.ListAlarmEventTemplate;
import com.sxt.po.ListDoorEventTemplate;
import com.sxt.po.ListInfoTemplate;
import com.sxt.po.LockInfo;
import com.sxt.po.LockInfoSearch;
import com.sxt.po.LockTypeInfo;
import com.sxt.po.LockTypeInfoSearch;
import com.sxt.po.Operators;
import com.sxt.po.RepairRecord;
import com.sxt.po.SysConfig;
import com.sxt.po.User;
import com.sxt.service.BoxEventAndWarnService;
import com.sxt.service.DepartmentService;
import com.sxt.service.ExportExcelService;
import com.sxt.service.LockAndKeyService;
import com.sxt.service.UserService;
import com.sxt.utils.DateUtil;
import com.sxt.utils.PrivilegeControl;

@Controller
@RequestMapping("/boxeventandwarn.do")
public class BoxEventAndWarnController  {
	private LockAndKeyService lockandkeyService;
	private DepartmentService departmentService;
	private BoxEventAndWarnService boxEventAndWarnService;
	private ExportExcelService exportExcelService;
	
	@InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
        dateFormat.setLenient(false);  
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));  
    }
	
	//检查工单状态
	@RequestMapping(params="method=findOrderStatus")
	public @ResponseBody AjaxRetObjTemplate findOrderStatus(Integer id) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxEventAndWarnService.findOrderStatus(id));
		arot.setResultMark(1);
		return arot;
	}
	
	
	//维修申请列表请求
	@RequestMapping(params="method=fixapplyList")
	public String fixapplyList(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		SysConfig sc = this.boxEventAndWarnService.findSysConfig();
		map.put("sysConfig", sc);
		if (PrivilegeControl.exist(request, "fixapply", "affirm"))
		{
			map.put("fixapply_affirm", true);
		}
		if (PrivilegeControl.exist(request, "fixapply", "delete"))
		{
			map.put("fixapply_delete", true);
		}
		return "fixapplyList";
	}
	
	//维修审批
	@RequestMapping(params="method=affirmFixapply")
	public @ResponseBody AjaxRetObjTemplate affirmFixapply(RepairRecord rr, HttpServletRequest request, ModelMap map){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		User user = new User();
		user.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
		rr.setApp_user(user);
		this.boxEventAndWarnService.affirmFixapply(rr);
		arot.setResultMark(1);
		return arot;
	}
	
	//维修查找
	@RequestMapping(params="method=findFixapply")
	public @ResponseBody AjaxRetObjTemplate findFixapply(int id, HttpServletRequest request, ModelMap map){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxEventAndWarnService.findFixApply(id));
		arot.setResultMark(1);
		return arot;
	}
	
	//维修删除
	@RequestMapping(params="method=deleteFixapply")
	public @ResponseBody AjaxRetObjTemplate deleteFixapply(int[] ids, HttpServletRequest request, ModelMap map){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		this.boxEventAndWarnService.deleteFixApply(ids);
		arot.setResultMark(1);
		return arot;
	}
	
	//获取维修申请分页
	@RequestMapping(params="method=listFixApplyPageByAjax")
	public @ResponseBody ListInfoTemplate listFixApplyPageByAjax(HttpServletRequest request, GlobalSearch ds){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = this.boxEventAndWarnService.findFixApplyCount(request);
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(this.boxEventAndWarnService.findFixApplyByPager(request, ds));
		return lit;
	}
	
	
	//开关门列表请求
	@RequestMapping(params="method=boxeventList")
	public String boxEventList(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "boxevent", "delete"))
		{
			map.put("boxevent_delete", true);
		}
		if (PrivilegeControl.exist(request, "boxevent", "export"))
		{
			map.put("boxevent_export", true);
		}
		return "boxeventList";
	}
	
	//警告列表请求
	@RequestMapping(params="method=boxwarnList")
	public String boxWarnList(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "boxwarn", "delete"))
		{
			map.put("boxwarn_delete", true);
		}
		if (PrivilegeControl.exist(request, "boxwarn", "export"))
		{
			map.put("boxwarn_export", true);
		}
		if (PrivilegeControl.exist(request, "boxwarn", "affirm"))
		{
			map.put("boxwarn_affirm", true);
		}
		return "boxwarnList";
	}
	
	
	
	//获取开关门分页
	@RequestMapping(params="method=listBoxEventPageByAjax")
	public @ResponseBody ListInfoTemplate listBoxEventPageByAjax(HttpServletRequest request, DoorEventSearch ds){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = this.boxEventAndWarnService.findDoorEventCounts(request, ds);
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(this.boxEventAndWarnService.findDoorEventByPager(request, ds));
		return lit;
	}
	
	//获取告警分页
	@RequestMapping(params="method=listAlarmEventPageByAjax")
	public @ResponseBody ListInfoTemplate listAlarmEventPageByAjax(HttpServletRequest request, AlarmEventSearch ds){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = this.boxEventAndWarnService.findAlarmEventCounts(request, ds);
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(this.boxEventAndWarnService.findAlarmEventByPager(request, ds));
		return lit;
	}
	

	//下载开关门记录
	@RequestMapping(params="method=downloadBoxEvent")
	public String downloadBoxEvent(HttpServletRequest request, HttpServletResponse response, DoorEventSearch ds){
		response.setContentType("application/binary;charset=ISO8859_1");
		try
		{
			String fileName = new String(("开关门记录").getBytes(), "ISO8859_1") + DateUtil.dateToString(new Date());
			response.setHeader("Content-disposition", "attachment; filename=" + fileName + ".xlsx");// 组装附件名称和格式
			String hql = "";
			String[] titles = { "光交箱编号", "控制器ID", "开门时间", "开门钥匙", "开门人员", "开门RFID", "关门时间", "关门钥匙", "关门人员", "关门RFID", "备注" };
			exportExcelService.getBoxEvent(request, ds, titles, response.getOutputStream());
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		return null;
	}
	
	//下载告警分页
	@RequestMapping(params="method=downloadBoxWarn")
	public String downloadBoxWarn(HttpServletRequest request, HttpServletResponse response, AlarmEventSearch ds){
		response.setContentType("application/binary;charset=ISO8859_1");
		try
		{
			String fileName = new String(("告警记录").getBytes(), "ISO8859_1") + DateUtil.dateToString(new Date());
			response.setHeader("Content-disposition", "attachment; filename=" + fileName + ".xlsx");// 组装附件名称和格式
			String hql = "";
			String[] titles = { "光交箱编号", "控制器ID", "告警类型", "告警时间", "告警钥匙", "告警人员", "告警RFID", "备注" };
			exportExcelService.getBoxWarn(request, ds, titles, response.getOutputStream());
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		return null;
	}
	
	//获取告警未确认的记录数
	@RequestMapping(params="method=getAlarmNotAffirmdCount")
	public @ResponseBody AjaxRetObjTemplate getAlarmNotAffirmdCount(HttpServletRequest request){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		AlarmEventSearch ds = new AlarmEventSearch();
		ds.setIs_affirmed(1);
		int counts = this.boxEventAndWarnService.findAlarmEventCounts(request, ds);
		arot.setResultMark(1);
		arot.setObject(counts);
		return arot;
	}
	
	//删除告警记录
	@RequestMapping(params="method=deleteAlarmEventPageByAjax")
	public @ResponseBody AjaxRetObjTemplate deleteAlarmEventPageByAjax(DeleteAlarmForm daf){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try
		{
			this.boxEventAndWarnService.deleteAlarmEvent(daf);
			arot.setResultMark(1);
		}
		catch(Exception e)
		{
			arot.setResultMark(0);
			e.printStackTrace();
		}
		return arot;
	}
	
	//确认告警记录
	@RequestMapping(params="method=affirmAlarmEventByAjax")
	public @ResponseBody AjaxRetObjTemplate affirmAlarmEventByAjax(AlarmEvent ae, HttpServletRequest request){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try
		{
			ae.setAffirm_user(request.getSession().getAttribute("user_name").toString());
			this.boxEventAndWarnService.affirmAlarmEvent(ae);
			arot.setResultMark(1);
		}
		catch(Exception e)
		{
			arot.setResultMark(0);
			e.printStackTrace();
		}
		return arot;
	}
	
	//删除开关门记录
	@RequestMapping(params="method=deleteDoorEventPageByAjax")
	public @ResponseBody AjaxRetObjTemplate deleteDoorEventPageByAjax(DeleteDoorForm daf){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try
		{
			this.boxEventAndWarnService.deleteDoorEvent(daf);
			arot.setResultMark(1);
		}
		catch(Exception e)
		{
			arot.setResultMark(0);
			e.printStackTrace();
		}
		return arot;
	}
	
	
	

	public LockAndKeyService getLockandkeyService() {
		return lockandkeyService;
	}
	@Resource
	public void setLockandkeyService(LockAndKeyService lockandkeyService) {
		this.lockandkeyService = lockandkeyService;
	}

	public DepartmentService getDepartmentService() {
		return departmentService;
	}

	@Resource
	public void setDepartmentService(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}

	public BoxEventAndWarnService getBoxEventAndWarnService() {
		return boxEventAndWarnService;
	}

	@Resource
	public void setBoxEventAndWarnService(
			BoxEventAndWarnService boxEventAndWarnService) {
		this.boxEventAndWarnService = boxEventAndWarnService;
	}

	public ExportExcelService getExportExcelService() {
		return exportExcelService;
	}
	@Resource
	public void setExportExcelService(ExportExcelService exportExcelService) {
		this.exportExcelService = exportExcelService;
	}


	

	
}
