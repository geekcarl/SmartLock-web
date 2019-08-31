package com.sxt.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
import com.sxt.po.Department;
import com.sxt.po.DepartmentSearch;
import com.sxt.po.GrantLog;
import com.sxt.po.GrantLogSearch;
import com.sxt.po.KeyInfo;
import com.sxt.po.KeyInfoSearch;
import com.sxt.po.KeyTypeInfo;
import com.sxt.po.KeyTypeInfoSearch;
import com.sxt.po.ListInfoTemplate;
import com.sxt.po.LockInfo;
import com.sxt.po.LockInfoSearch;
import com.sxt.po.LockTypeInfo;
import com.sxt.po.LockTypeInfoSearch;
import com.sxt.po.Operators;
import com.sxt.po.User;
import com.sxt.service.DepartmentService;
import com.sxt.service.LockAndKeyService;
import com.sxt.service.UserService;
import com.sxt.utils.PrivilegeControl;

@Controller
@RequestMapping("/lockandkey.do")
public class LockAndKeyController  {
	private LockAndKeyService lockandkeyService;
	private DepartmentService departmentService;
	
	@InitBinder  
    public void initBinder(WebDataBinder binder) {  
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
        dateFormat.setLenient(false);  
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));  
    } 
	
	//获取用户开门授权分页(手机、界面、蓝牙)
		@RequestMapping(params="method=listUserOpenGrantLogPageByAjax")
		public @ResponseBody ListInfoTemplate listUserOpenGrantLogPageByAjax(GrantLogSearch ds, HttpServletRequest request){
			if (ds != null && ds.getRows() <= 0) {
				ds.setRows(10);
			}
			ListInfoTemplate lit = new ListInfoTemplate();
			lit.setPage(ds.getPage());
			int counts = this.lockandkeyService.findUserOpenGrantLogCounts(ds, request);
			lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
			lit.setRecords(counts);
			lit.setRows(this.lockandkeyService.findUserOpenGrantLogByPager(ds, request));
			return lit;
		}
		
		//修改用户开门授权
		@RequestMapping(params="method=updateUserOpenGrantLog")
		public void updateUserOpenGrantLog(GrantLog gl, HttpServletRequest request, HttpServletResponse response) throws IOException{
			gl.setGrant_user(request.getSession().getAttribute("user_name").toString());
			this.lockandkeyService.updateUserOpenGrantLog(gl);
			String resultMark = "{\"resultMark\" : 1}";
			response.setContentType("application/json; charset=UTF-8");
			response.getWriter().print(resultMark);
		}
		
		//添加用户开门授权
			@RequestMapping(params="method=addUserOpenGrantLog")
			public void addUserOpenGrantLog(GrantLog gl, HttpServletRequest request, HttpServletResponse response) throws IOException{
				gl.setGrant_user(request.getSession().getAttribute("user_name").toString());
				this.lockandkeyService.addUserOpenGrantLog(gl);
				String resultMark = "{\"resultMark\" : 1}";
				response.setContentType("application/json; charset=UTF-8");
				response.getWriter().print(resultMark);
			}
			
	
	//钥匙列表请求
	@RequestMapping(params="method=list")
	public String list(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "keyinfo", "add"))
		{
			map.put("keyinfo_add", true);
		}
		if (PrivilegeControl.exist(request, "keyinfo", "update"))
		{
			map.put("keyinfo_update", true);
		}
		if (PrivilegeControl.exist(request, "keyinfo", "delete"))
		{
			map.put("keyinfo_delete", true);
		}
		return "keyinfoList";
	}
	
	//钥匙授权页面请求
	@RequestMapping(params="method=keyAuthorize")
	public String keyAuthorize(HttpServletRequest request, ModelMap map){
		if (PrivilegeControl.exist(request, "keyAuthorize", "add"))
		{
			map.put("keyAuthorize_add", true);
		}
		if (PrivilegeControl.exist(request, "keyAuthorize", "view"))
		{
			map.put("keyAuthorize_view", true);
		}
		if (PrivilegeControl.exist(request, "keyAuthorize", "update"))
		{
			map.put("keyAuthorize_update", true);
		}
		if (PrivilegeControl.exist(request, "keyAuthorize", "delete"))
		{
			map.put("keyAuthorize_delete", true);
		}
		return "keyAuthorize";
	}
	
	//获取所有锁类型
	@RequestMapping(params="method=findAllLockTypeByAjax")
	public @ResponseBody ListInfoTemplate findAllLockTypeByAjax(HttpServletResponse response) throws IOException{
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(this.lockandkeyService.findAllLockType());
		lit.setResultMark(1);
		return lit;
	}
	
	
	//获取锁分页
	@RequestMapping(params="method=listLockInfoPageByAjax")
	public @ResponseBody ListInfoTemplate listLockInfoPageByAjax(LockInfoSearch ds,HttpServletRequest request){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = this.lockandkeyService.findLockCounts(ds,request);
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(this.lockandkeyService.findLockInfoByPager(ds,request));
		return lit;
	}
	
	//获取锁类型分页
	@RequestMapping(params="method=listLockTypeInfoPageByAjax")
	public @ResponseBody ListInfoTemplate listLockTypeInfoPageByAjax(LockTypeInfoSearch ds){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = this.lockandkeyService.findLockTypeCounts();
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(this.lockandkeyService.findLockTypeInfoByPager(ds));
		return lit;
	}
	
	
	
	//添加锁
	@RequestMapping(params="method=addLockInfo",consumes="application/json")
	public void add(@RequestBody LockInfo lockInfo, HttpServletResponse response) throws IOException{
		this.lockandkeyService.addLock(lockInfo);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	// 删除锁，AJAX请求
	@RequestMapping(params = "method=deleteLockInfo")
	public @ResponseBody
	AjaxRetObjTemplate deleteLockInfo(@RequestBody int[] sks) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			
			this.lockandkeyService.deleteLockInfo(sks);
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			arot.setResultMark(0);
			arot.setErrMessage("删除失败，请重试！");
		}
		return arot;
	}
	
	//添加锁类型
	@RequestMapping(params="method=addLockTypeInfo",consumes="application/json")
	public void add(@RequestBody LockTypeInfo lockTypeInfo, HttpServletRequest request, HttpServletResponse response) throws IOException{

		this.lockandkeyService.addLockType(lockTypeInfo);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	// 删除锁类型，AJAX请求
	@RequestMapping(params = "method=deleteLockTypeInfo")
	public @ResponseBody
	AjaxRetObjTemplate deleteLockTypeInfo(@RequestBody int[] sks) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {

			this.lockandkeyService.deleteLockTypeInfo(sks);
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			arot.setResultMark(0);
			arot.setErrMessage("删除失败，请重试！");
		}
		return arot;
	}
	
	// 删除钥匙类型，AJAX请求
	@RequestMapping(params = "method=deleteKeyTypeInfo")
	public @ResponseBody
	AjaxRetObjTemplate deleteKeyTypeInfo(@RequestBody int[] sks) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			
			this.lockandkeyService.deleteKeyTypeInfo(sks);
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			arot.setResultMark(0);
			arot.setErrMessage("删除失败，请重试！");
		}
		return arot;
	}
	
	
	//////////////////
	
	//获取所有钥匙类型
	@RequestMapping(params="method=findAllKeyTypeByAjax")
	public @ResponseBody ListInfoTemplate findAllKeyTypeByAjax(HttpServletResponse response) throws IOException{
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(this.lockandkeyService.findAllKeyType());
		lit.setResultMark(1);
		return lit;
	}
	
	//获取所有钥匙
	@RequestMapping(params="method=findAllKeyByAjax")
	public @ResponseBody ListInfoTemplate findAllKeyByAjax(HttpServletResponse response) throws IOException{
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(this.lockandkeyService.findAllKey());
		lit.setResultMark(1);
		return lit;
	}
	
	
	//获取钥匙分页
	@RequestMapping(params="method=listKeyInfoPageByAjax")
	public @ResponseBody ListInfoTemplate listKeyInfoPageByAjax(KeyInfoSearch ds,HttpServletRequest request){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = this.lockandkeyService.findKeyCounts(ds,request);
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(this.lockandkeyService.findKeyInfoByPager(ds,request));
		return lit;
	}
	
	//获取部门钥匙树
	@RequestMapping(params="method=listDepartmentKeyTree")
	public void listDepartmentKeyTree(HttpServletResponse response, HttpServletRequest request) throws IOException{
		String resultMark = "{\"resultMark\" : 1, \"tree\" : " + this.lockandkeyService.findTreeByDepartment(request) + "}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//获取钥匙类型分页
	@RequestMapping(params="method=listKeyTypeInfoPageByAjax")
	public @ResponseBody ListInfoTemplate listKeyTypeInfoPageByAjax(KeyTypeInfoSearch ds){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = this.lockandkeyService.findKeyTypeCounts();
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(this.lockandkeyService.findKeyTypeInfoByPager(ds));
		return lit;
	}
	
	
	
	//添加钥匙
	@RequestMapping(params="method=addKeyInfo",consumes="application/json")
	public void addKeyInfo(@RequestBody KeyInfo keyInfo, HttpServletResponse response) throws IOException{
		//判断钥匙内码和rfid号是否存在
		int existflag = this.lockandkeyService.findExistKey(keyInfo);
		
		//如果rfid号或者内码已存在
		if (existflag == 1){
			String resultMark = "{\"resultMark\" : 0}";
			response.setContentType("application/json; charset=UTF-8");
			response.getWriter().print(resultMark);
			return;
			
		}
		
		this.lockandkeyService.addKey(keyInfo);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//获取钥匙详情
	@RequestMapping(params="method=fineKeyInfo")
	public @ResponseBody AjaxRetObjTemplate findKeyInfo(int id, HttpServletResponse response) throws IOException{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.lockandkeyService.findKey(id));
		arot.setResultMark(1);
		return arot;
	}
	
	//修改钥匙
	@RequestMapping(params="method=updateKeyInfo",consumes="application/json")
	public void updateKeyInfo(@RequestBody KeyInfo keyInfo, HttpServletResponse response) throws IOException{
		//判断钥匙内码和rfid号是否存在
		int existflag = this.lockandkeyService.findupdateExistKey(keyInfo);
		
		//如果rfid号或者内码已存在
		if (existflag == 1){
			String resultMark = "{\"resultMark\" : 0}";
			response.setContentType("application/json; charset=UTF-8");
			response.getWriter().print(resultMark);
			return;
			
		}
	
		this.lockandkeyService.updateKey(keyInfo);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//删除钥匙
	@RequestMapping(params="method=deleteKeyInfo",consumes="application/json")
	public void deleteKeyInfo(@RequestBody int[] ids, HttpServletResponse response) throws IOException{
		this.lockandkeyService.deleteKey(ids);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	
	
	//添加钥匙类型
	@RequestMapping(params="method=addKeyTypeInfo",consumes="application/json")
	public void add(@RequestBody KeyTypeInfo keyTypeInfo, HttpServletResponse response) throws IOException{
		this.lockandkeyService.addKeyType(keyTypeInfo);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	
	//获取钥匙授权分页
	@RequestMapping(params="method=listGrantLogPageByAjax")
	public @ResponseBody ListInfoTemplate listGrantLogPageByAjax(GrantLogSearch ds, HttpServletRequest request){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = this.lockandkeyService.findGrantLogCounts(ds, request);
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(this.lockandkeyService.findGrantLogByPager(ds, request));
		return lit;
	}
	
	//获取钥匙授权详情
	@RequestMapping(params="method=fingGrantLogPageByAjax")
	public @ResponseBody AjaxRetObjTemplate fingGrantLogPageByAjax(int id){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.lockandkeyService.findGrantLogById(id));
		arot.setResultMark(1);
		return arot;
	}
	
	
	
	//添加钥匙授权
	@RequestMapping(params="method=addGrantLog")
	public void addGrantLog(GrantLog gl, HttpServletRequest request, HttpServletResponse response) throws IOException{
		gl.setGrant_user(request.getSession().getAttribute("user_name").toString());
		this.lockandkeyService.addGrantLog(gl);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//修改钥匙授权
	@RequestMapping(params="method=updateGrantLog")
	public void updateGrantLog(GrantLog gl, HttpServletRequest request, HttpServletResponse response) throws IOException{
		gl.setGrant_user(request.getSession().getAttribute("user_name").toString());
		this.lockandkeyService.updateGrantLog(gl);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//删除钥匙授权
	@RequestMapping(params="method=deleteGrantLog")
	public void deleteGrantLog(@RequestBody int[] ids, HttpServletRequest request, HttpServletResponse response) throws IOException{
		this.lockandkeyService.deleteGrantLog(ids);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
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


	

	
}
