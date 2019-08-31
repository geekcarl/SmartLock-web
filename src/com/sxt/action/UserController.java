package com.sxt.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sxt.po.AjaxRetObjTemplate;
import com.sxt.po.BoxInfo;
import com.sxt.po.BoxPrivilege;
import com.sxt.po.BoxPrivilegeOper;
import com.sxt.po.DTO_Message;
import com.sxt.po.Department;
import com.sxt.po.GlobalSearch;
import com.sxt.po.ListInfoTemplate;
import com.sxt.po.Privilege;
import com.sxt.po.PrivilegeListSearch;
import com.sxt.po.RFID;
import com.sxt.po.Role;
import com.sxt.po.RolePrivileges;
import com.sxt.po.SystemInfo;
import com.sxt.po.User;
import com.sxt.po.UserSearch;
import com.sxt.service.BoxInfoService;
import com.sxt.service.DepartmentService;
import com.sxt.service.UserService;
import com.sxt.utils.PrivilegeControl;

@Controller
@RequestMapping("/user.do")
public class UserController  {

	private UserService userService;
	private DepartmentService departmentService;
	private BoxInfoService boxInfoService;
	
	@InitBinder  
    public void initBinder(WebDataBinder binder) {  
		 binder.setAutoGrowCollectionLimit(Integer.MAX_VALUE);  
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
        dateFormat.setLenient(false);  
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));  
    }
	
	 
	@RequestMapping(params="method=findByDepartmentId")
	public @ResponseBody ListInfoTemplate findByDepartmentId(int id) {
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(this.userService.findByDepartmentId(id));
		lit.setResultMark(1);
		return lit;
	}
	
	//用户修改密码
	@RequestMapping(params="method=updatepassword")
	public @ResponseBody AjaxRetObjTemplate updatepassword(String old_password, String new_password, HttpServletRequest request, ModelMap map){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		
		if (request.getSession().getAttribute("user_id") != null && this.userService.updatepassword(Integer.parseInt(request.getSession().getAttribute("user_id").toString()), old_password, new_password) > 0)
		{
			arot.setResultMark(1);
		}
		else
		{
			arot.setResultMark(0);
		}
		return arot;
	}
	
	 //用户开门授权页
	@RequestMapping(params="method=opendoorAuthorize")
	public String opendoorAuthorize(HttpServletRequest request, ModelMap map){
		
		List<Department> departs = departmentService.findAll(request);
		
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		
		if (PrivilegeControl.exist(request, "opendoorAuthorize", "add"))
		{
			map.put("opendoorAuthorize_add", true);
		}
		if (PrivilegeControl.exist(request, "opendoorAuthorize", "view"))
		{
			map.put("opendoorAuthorize_view", true);
		}
		
		if (PrivilegeControl.exist(request, "opendoorAuthorize", "update"))
		{
			map.put("opendoorAuthorize_update", true);
		}
		
		if (PrivilegeControl.exist(request, "opendoorAuthorize", "delete"))
		{
			map.put("opendoorAuthorize_delete", true);
		}
		
		return "userOpenAuthorize";
		
	}
	
	//超级用户修改密码
		@RequestMapping(params="method=adminupdatepassword")
		public @ResponseBody AjaxRetObjTemplate adminupdatepassword(String new_password, Integer userid){
			AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
			
			if (userid != null && this.userService.adminupdatepassword(userid,  new_password) > 0)
			{
				arot.setResultMark(1);
			}
			else
			{
				arot.setResultMark(0);
			}
			return arot;
		}
	
	//光交箱权限列表
	@RequestMapping(params="method=boxPrivilegeList")
	public String boxPrivilegeList(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "boxprivilege", "add"))
		{
			map.put("boxprivilege_add", true);
		}
		if (PrivilegeControl.exist(request, "boxprivilege", "delete"))
		{
			map.put("boxprivilege_delete", true);
		}
		return "boxPrivilege";
	}
	
	//光交箱权限删除
	@RequestMapping(params="method=deleteBoxPrivilege")
	public @ResponseBody AjaxRetObjTemplate deletePrivilege(int[] ids, HttpServletRequest request, ModelMap map){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		this.userService.deleteBoxPrivilege(ids);
		arot.setResultMark(1);
		return arot;
	}
	
	//光交箱权限添加
	@RequestMapping(params="method=addBoxPrivilege")
	public @ResponseBody AjaxRetObjTemplate addPrivilege(BoxPrivilegeOper bpo, HttpServletRequest request, ModelMap map){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		if (bpo.getBps() != null)
		{
			User temp = new User();
			temp.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
			for (int i = 0; i < bpo.getBps().size(); i ++)
			{
				bpo.getBps().get(i).setSetuser(temp);
				bpo.getBps().get(i).setSet_date(new Date());
			}
		}
		this.userService.addBoxPrivilege(bpo);
		arot.setResultMark(1);
		return arot;
	}
	
	//光交箱权限列表
	@RequestMapping(params="method=boxPrivilegeListByPager")
	public @ResponseBody ListInfoTemplate boxPrivilegeListByPager(PrivilegeListSearch us, HttpServletRequest request, ModelMap map){
		ListInfoTemplate lit = new ListInfoTemplate();
		try
		{
			if (us != null && us.getPage() <= 0)
			{
				us.setPage(1);
			}
			if (us != null && us.getRows() <= 0) {
				us.setRows(10);
			}
			lit.setPage(us.getPage());
			int counts = userService.findBoxPrivilegeCounts(us,request);
			lit.setTotal(counts % us.getRows() > 0 ? (counts / us.getRows() + 1) : (counts / us.getRows()));
			lit.setRecords(counts);
			lit.setRows(userService.findBoxPrivilegeByPager(us,request));
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return lit;
	}
	
	
	//短信列表
	@RequestMapping(params="method=messageList")
	public String messageList(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "message", "delete"))
		{
			map.put("message_delete", true);
		}
		return "messageList";
	}
	
	//短信删除
	@RequestMapping(params="method=deleteMessage")
	public @ResponseBody AjaxRetObjTemplate deleteMessage(int[] ids, HttpServletRequest request, ModelMap map){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		this.userService.deleteMessage(ids);
		arot.setResultMark(1);
		return arot;
	}
	
	//短信列表
	@RequestMapping(params="method=messageListByPager")
	public @ResponseBody ListInfoTemplate messageListByPager(GlobalSearch us, DTO_Message msg, HttpServletRequest request, ModelMap map){
		System.out.println("UserController messageListByPager()");
		ListInfoTemplate lit = new ListInfoTemplate();
		try
		{
			if (us != null && us.getPage() <= 0)
			{
				us.setPage(1);
			}
			if (us != null && us.getRows() <= 0) {
				us.setRows(10);
			}
			lit.setPage(us.getPage());
			int counts = userService.findMessageCounts(us, msg,request);
			lit.setTotal(counts % us.getRows() > 0 ? (counts / us.getRows() + 1) : (counts / us.getRows()));
			lit.setRecords(counts);
			lit.setRows(userService.findMessageByPager(us, msg ,request));
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return lit;
	}
	
	
	//角色列表页
	@RequestMapping(params="method=roleList")
	public String roleList(HttpServletRequest request, ModelMap map){

		if (PrivilegeControl.exist(request, "role", "add"))
		{
			map.put("role_add", true);
		}
		if (PrivilegeControl.exist(request, "role", "update"))
		{
			map.put("role_update", true);
		}
		if (PrivilegeControl.exist(request, "role", "delete"))
		{
			map.put("role_delete", true);
		}
		return "roleList";
	}
	
	//角色列表
	@RequestMapping(params="method=roleListByPager")
	public @ResponseBody ListInfoTemplate roleListByPager(GlobalSearch us, HttpServletRequest request, ModelMap map){
		ListInfoTemplate lit = new ListInfoTemplate();
		try
		{
			if (us != null && us.getPage() <= 0)
			{
				us.setPage(1);
			}
			if (us != null && us.getRows() <= 0) {
				us.setRows(10);
			}
			lit.setPage(us.getPage());
			int counts = userService.findRoleCounts(us);
			lit.setTotal(counts % us.getRows() > 0 ? (counts / us.getRows() + 1) : (counts / us.getRows()));
			lit.setRecords(counts);
			lit.setRows(userService.findRoleByPager(us));
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return lit;
	}
	
	//获取所有权限
	@RequestMapping(params="method=findAllPrivileges")
	public void findAllPrivileges(HttpServletResponse response, ModelMap map) throws IOException{
		String resultMark = "{\"resultMark\" : 1, \"tree\" : " + this.userService.findAllPrivilegeTree() + "}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//获取所有角色
	@RequestMapping(params="method=findAllRole")
	public @ResponseBody ListInfoTemplate findAllRole(HttpServletRequest request, ModelMap map){
		
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(userService.findAllRole());
		lit.setResultMark(1);
		return lit;
	}
	
	//获取角色
	@RequestMapping(params="method=findRole")
	public @ResponseBody AjaxRetObjTemplate findRole(int id, HttpServletRequest request, ModelMap map){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setResultMark(1);
		arot.setObject(this.userService.findRole(id));
		return arot;
	}
	
	//添加角色
	@RequestMapping(params="method=addRole")
	public void addRole(Role role,HttpServletRequest request, HttpServletResponse response) throws IOException{
		this.userService.addRole(role);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//修改角色
	@RequestMapping(params="method=updateRole")
	public void updateRole(Role role, HttpServletRequest request, HttpServletResponse response) throws IOException{
		this.userService.updateRole(role);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//删除角色
	@RequestMapping(params="method=deleteRole")
	public void deleteRole(int[] ids, HttpServletRequest request, HttpServletResponse response) throws IOException{
		this.userService.deleteRole(ids);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//添加工作卡
	@RequestMapping(params="method=addRFID")
	public void addRFID(RFID rfid,HttpServletRequest request, HttpServletResponse response) throws IOException{
		this.userService.addRFID(rfid);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//修改工作卡
	@RequestMapping(params="method=findRFID")
	public @ResponseBody AjaxRetObjTemplate findRFID(int id, HttpServletRequest request, HttpServletResponse response) throws IOException{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.userService.findRFID(id));
		arot.setResultMark(1);
		return arot;
	}
	
	//修改工作卡
	@RequestMapping(params="method=updateRFID")
	public void updateRFID(RFID rfid,HttpServletRequest request, HttpServletResponse response) throws IOException{
		this.userService.updateRFID(rfid);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//删除工作卡
	@RequestMapping(params="method=deleteRFID")
	public void deleteRFID(int[] rfids, HttpServletRequest request, HttpServletResponse response) throws IOException{
		this.userService.deleteRFID(rfids);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//工作卡列表页
	@RequestMapping(params="method=workcardList")
	public String workcardList(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "workcard", "add"))
		{
			map.put("workcard_add", true);
		}
		if (PrivilegeControl.exist(request, "workcard", "update"))
		{
			map.put("workcard_update", true);
		}
		if (PrivilegeControl.exist(request, "workcard", "delete"))
		{
			map.put("workcard_delete", true);
		}
		return "workcardList";
	}
	
	
	//工作卡列表
	@RequestMapping(params="method=workcardListByPager")
	public @ResponseBody ListInfoTemplate workcardListByPager(GlobalSearch us, RFID rfid, HttpServletRequest request, ModelMap map){
		if (us != null && us.getPage() <= 0)
		{
			us.setPage(1);
		}
		if (us != null && us.getRows() <= 0) {
			us.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(us.getPage());
		int counts = userService.findRFIDCounts(us, rfid, request);
		lit.setTotal(counts % us.getRows() > 0 ? (counts / us.getRows() + 1) : (counts / us.getRows()));
		lit.setRecords(counts);
		lit.setRows(userService.findRFIDByPager(us, rfid, request));
		return lit;
	}
	
	
	//用户列表页面请求
	@RequestMapping(params="method=list")
	public String list(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "userinfo", "add"))
		{
			map.put("userinfo_add", true);
		}
		if (PrivilegeControl.exist(request, "userinfo", "update"))
		{
			map.put("userinfo_update", true);
		}
		if (PrivilegeControl.exist(request, "userinfo", "delete"))
		{
			map.put("userinfo_delete", true);
		}
		if (PrivilegeControl.exist(request, "userinfo", "updatepwd"))
		{
			map.put("userinfo_updatepwd", true);
		}
		return "userList";
	}
	
	//获取用户分页数据，AJAX方式
	@RequestMapping(params="method=listPageByAjax")
	public @ResponseBody ListInfoTemplate listPageByAjax(UserSearch us, HttpServletRequest request){
		if (us != null && us.getPage() <= 0)
		{
			us.setPage(1);
		}
		if (us != null && us.getRows() <= 0) {
			us.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(us.getPage());
		int counts = userService.findCounts(us, request);
		lit.setTotal(counts % us.getRows() > 0 ? (counts / us.getRows() + 1) : (counts / us.getRows()));
		lit.setRecords(counts);
		lit.setRows(userService.findByPager(us, request));
		return lit;
	}
	
	//用户登录，AJAX返回
	@RequestMapping(params="method=login")
	public @ResponseBody AjaxRetObjTemplate login(User u, String randomCode, HttpServletRequest request, ModelMap map){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try
		{
			
			if (request.getSession().getAttribute("rand") == null || ! randomCode.toLowerCase().equals(request.getSession().getAttribute("rand").toString().toLowerCase()))
			{
				arot.setResultMark(0);
				arot.setErrMessage("验证码错误");
				return arot;
			}
			
			User user = userService.Login(u, request.getRemoteAddr());
			if (user != null)
			{
				
				//系统名称和版本号放进session
				SystemInfo sysinfo   = new SystemInfo(); 
				sysinfo = userService.findsysinfo();
				
				request.getSession().setAttribute("sysinfo", sysinfo);
				
				arot.setResultMark(1);
				request.getSession().setAttribute("user_id", user.getId());
				request.getSession().setAttribute("user_name", user.getUser_name());
				if (user.getDepartment() != null) //设置该用户属于哪个部门
				{
					request.getSession().setAttribute("department_id", user.getDepartment().getId());
				}
				if (user.getUser_name().equals("admin")) //如果是超级管理员
				{
					//赋予所有操作权限
					List<Privilege> ps = this.userService.findAllPrivilege();
					Role role = new Role();
					List<RolePrivileges> rps = new ArrayList<RolePrivileges>();
					for (int i = 0; i < ps.size(); i ++)
					{
						RolePrivileges temp = new RolePrivileges();
						temp.setPrivilege(ps.get(i));
						rps.add(temp);
					}
					role.setRps(rps);
					request.getSession().setAttribute("role", role);
					//赋予所有光交箱权限
					List<Map<String, Object>> bis = this.boxInfoService.findAllBoxInfo();
					List<BoxPrivilege> bps = new ArrayList<BoxPrivilege>();
					for (int i = 0; i < bis.size(); i ++)
					{
						BoxPrivilege temp = new BoxPrivilege();
						BoxInfo bi = new BoxInfo();
						bi.setId(Integer.parseInt(bis.get(i).get("id").toString()));
						temp.setBoxinfo(bi);
						bps.add(temp);
					}
					request.getSession().setAttribute("boxprivilege", bps);
					//赋予所有部门权限
					request.getSession().setAttribute("department_query", this.departmentService.findAllQuery(request));
				}
				else
				{
					//获取该用户的所有操作权限
					request.getSession().setAttribute("role", user.getRole());
					//获取该用户的所有光交箱权限
					request.getSession().setAttribute("boxprivilege", this.userService.findBoxPrivilegeByUserId(user.getId()));
					if (user.getDepartment() != null) //获取该用户的所属部门以及子部门
					{
						request.getSession().setAttribute("department_query", this.departmentService.findChildrenQuery(user.getDepartment().getId(), request));
					}
				}
			}
			else
			{
				arot.setResultMark(0);
				arot.setErrMessage("用户名或者密码错误");
			}
		}
		catch (Exception e)
		{
			arot.setResultMark(0);
			arot.setErrMessage("服务器异常，请重试");
			e.printStackTrace();
		}
		return arot;
	}
	
	//用户退出，AJAX返回
	@RequestMapping(params="method=loginout")
	public String loginout(HttpServletRequest request, ModelMap map){
		request.getSession().removeAttribute("user_id");
		request.getSession().removeAttribute("user_name");
		request.getSession().removeAttribute("role");
		request.getSession().removeAttribute("boxprivilege");
		request.getSession().invalidate();
		
		//系统名称和版本号
		SystemInfo sysinfo   = new SystemInfo(); 
		sysinfo = userService.findsysinfo();
		map.put("systeminfo", sysinfo);
		
		return "login";
	}
	
	//根据用户id获取用户信息，AJAX
	@RequestMapping(params="method=findByAjax")
	public @ResponseBody AjaxRetObjTemplate findByAjax(int id){
		User u = userService.findById(id);
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setResultMark(1);
		arot.setObject(u);
		return arot;
	}
	
	//更改用户信息，AJAX
	@RequestMapping(params="method=update")
	public void update(@RequestBody User u, HttpServletRequest request, HttpServletResponse response) throws IOException{
		String resultMark = "";
		
		
		//判断用户名是否存在
				int existflag = this.userService.findExistU(u);
				
				//如果用户名已存在
				if (existflag == 1){
					 resultMark = "{\"resultMark\" : 0}";
					response.setContentType("application/json; charset=UTF-8");
					response.getWriter().print(resultMark);
					return;
					
				}
		
		try
		{
			userService.update(u);
			resultMark = "{\"resultMark\" : 1}";
		}
		catch (Exception e)
		{
			resultMark = "{\"resultMark\" : 0}";
			e.printStackTrace();
		}
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//添加用户信息，AJAX
	@RequestMapping(params="method=add")
	public void add(@RequestBody User u, HttpServletRequest request, HttpServletResponse response) throws IOException{
		String resultMark = "";
		try
		{
			if (userService.add(u) == 1)
			{
				resultMark = "{\"resultMark\" : 1}";
			}
			else
			{
				resultMark = "{\"resultMark\" : 0}";
			}
		}
		catch (Exception e)
		{
			resultMark = "{\"resultMark\" : 0}";
			e.printStackTrace();
		}
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}

	public UserService getUserService() {
		return userService;
	}

	@Resource
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public DepartmentService getDepartmentService() {
		return departmentService;
	}

	@Resource
	public void setDepartmentService(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}

	public BoxInfoService getBoxInfoService() {
		return boxInfoService;
	}

	@Resource
	public void setBoxInfoService(BoxInfoService boxInfoService) {
		this.boxInfoService = boxInfoService;
	}

	
}
