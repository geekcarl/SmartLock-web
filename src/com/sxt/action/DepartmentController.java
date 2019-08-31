package com.sxt.action;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.sxt.po.BoxInfo;
import com.sxt.po.BoxPrivilege;
import com.sxt.po.Department;
import com.sxt.po.DepartmentSearch;
import com.sxt.po.ListInfoTemplate;
import com.sxt.po.Operators;
import com.sxt.po.Privilege;
import com.sxt.po.Role;
import com.sxt.po.RolePrivileges;
import com.sxt.po.User;
import com.sxt.service.DepartmentService;
import com.sxt.service.UserService;
import com.sxt.utils.PrivilegeControl;

@Controller
@RequestMapping("/department.do")
public class DepartmentController  {

	@Resource
	private DepartmentService departmentService;
	
	//访问列表
	@RequestMapping(params="method=list")
	public String list(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "department", "add"))
		{
			map.put("department_add", true);
		}
		if (PrivilegeControl.exist(request, "department", "update"))
		{
			map.put("department_update", true);
		}
		if (PrivilegeControl.exist(request, "department", "delete"))
		{
			map.put("department_delete", true);
		}
		return "departmentList";
	}
	
	//获取所有部门
	@RequestMapping(params="method=findAllByAjax")
	public void findAllByAjax(HttpServletResponse response, HttpServletRequest request) throws IOException{
		System.out.println("DepartmentController.getAllByAjax()");
		List<Department> departs = departmentService.findAll(request);
		String tree = departs2json(departs, 1);
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(tree);
	}
	
	
	//获取分页
	@RequestMapping(params="method=listPageByAjax")
	public @ResponseBody ListInfoTemplate listPageByAjax(DepartmentSearch ds, HttpServletRequest request){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = departmentService.findCounts(ds, request);
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(departmentService.findByPager(ds, request));
		return lit;
	}
	
	//获取部门详情
	@RequestMapping(params="method=findByAjax")
	public @ResponseBody Department findByAjax(int id){
		return this.departmentService.find(id);
	}
	
	//添加部门
	@RequestMapping(params="method=add",consumes="application/json")
	public void add(@RequestBody Department department, HttpServletRequest request, HttpServletResponse response) throws IOException{
		departmentService.add(department);
		if (request.getSession().getAttribute("user_name").toString().equals("admin")) //如果是超级管理员
		{
			request.getSession().setAttribute("department_query", this.departmentService.findAllQuery(request));
		}
		else
		{
			Object o = request.getSession().getAttribute("department_id");
			if (o != null) //获取该用户的所属部门以及子部门
			{
				request.getSession().setAttribute("department_query", this.departmentService.findChildrenQuery(Integer.parseInt(o.toString()), request));
			}
		}
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//修改部门
	@RequestMapping(params="method=update",consumes="application/json")
	public void update(@RequestBody Department department, HttpServletResponse response) throws IOException{
		departmentService.update(department);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//删除部门
	@RequestMapping(params="method=delete")
	public void delete(@RequestBody int[] ids, HttpServletResponse response) throws IOException{
		departmentService.delete(ids);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}

	public static String departs2json(List<Department> departs, int zindex)
	{
		StringBuffer sb = new StringBuffer();
		for (Department d : departs)
		{
			sb.append("{");
			sb.append("\"id\":" + d.getId() + ",");
			sb.append("\"text\":\"" + d.getName() + "\"");
			if (d.getChildren().size() > 0)
			{
				sb.append(",\"children\":" + departs2json(d.getChildren(), zindex ++));
			}
			sb.append("},");
		}
		return "[" + sb.substring(0, sb.length() - 1) + "]";
	}
	

	@RequestMapping(params="method=reg3")
	public String reg3(@RequestParam("uname") String name,HttpServletRequest req,ModelMap map){
		System.out.println("UserController.reg()");
		System.out.println(name);
		req.getSession().setAttribute("c", "ccc");
		map.put("a", "aaa");
		
		return "index";
	}
	
	@RequestMapping(params="method=reg4")
	public String reg4(@ModelAttribute("a") String a,HttpServletRequest req,ModelMap map){
		System.out.println("UserController.reg4()");
		System.out.println(a);
		return "redirect:http://www.baidu.com";
	}
	
	@RequestMapping(params="method=reg5")
	public ModelAndView reg5(String uname){
		System.out.println("UserController.reg5()");
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("index");
		
		
		
		return mav;
	}

	public DepartmentService getDepartmentService() {
		return departmentService;
	}

	public void setDepartmentService(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}

	

	
}
