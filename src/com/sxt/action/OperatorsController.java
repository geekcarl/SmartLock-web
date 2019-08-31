package com.sxt.action;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.sxt.po.AjaxRetObjTemplate;
import com.sxt.po.Department;
import com.sxt.po.ListInfoTemplate;
import com.sxt.po.Operators;
import com.sxt.po.OperatorsSearch;
import com.sxt.po.User;
import com.sxt.service.DepartmentService;
import com.sxt.service.OperatorsService;
import com.sxt.service.UserService;

@Controller
@RequestMapping("/operators.do")
public class OperatorsController  {

	private OperatorsService operatorsService;
	private DepartmentService departmentService;
	
	//请求员工列表页面
	@RequestMapping(params="method=list")
	public String list(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		return "operatorsList";
	}
	
	//获取所有员工信息，AJAX请求
	@RequestMapping(params="method=listByAjax")
	public @ResponseBody ListInfoTemplate listByAjax(OperatorsSearch os, HttpServletRequest request){
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setTotal(operatorsService.findCounts(os));
		lit.setRows(operatorsService.findAll(request));
		return lit;
	}
	
	//获取部门人员树
	@RequestMapping(params="method=listDepartmentOperTree")
	public void listDepartmentOperTree(HttpServletResponse response, HttpServletRequest request) throws IOException{
		String resultMark = "{\"resultMark\" : 1, \"tree\" : " + this.operatorsService.findTreeByDepartment(request) + "}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//分页获取员工信息，AJAX请求
	@RequestMapping(params="method=listPageByAjax")
	public @ResponseBody ListInfoTemplate listPageByAjax(OperatorsSearch ds){
		if (ds != null && ds.getRows() <= 0) {
			ds.setRows(10);
		}
		
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(ds.getPage());
		int counts = operatorsService.findCounts(ds);
		lit.setTotal(counts % ds.getRows() > 0 ? (counts / ds.getRows() + 1) : (counts / ds.getRows()));
		lit.setRecords(counts);
		lit.setRows(operatorsService.findByPager(ds));
		return lit;
	}
	
	//获取单个员工信息，AJAX请求
	@RequestMapping(params="method=findByAjax")
	public @ResponseBody AjaxRetObjTemplate findByAjax(int id){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.operatorsService.find(id));
		arot.setResultMark(1);
		return arot;
	}
	
	//添加一个员工信息，AJAX请求
	@RequestMapping(params="method=add",consumes="application/json")
	public void add(@RequestBody Operators operators, HttpServletResponse response) throws IOException{
		operatorsService.add(operators);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//修改一个员工信息，AJAX请求
	@RequestMapping(params="method=update",consumes="application/json")
	public void update(@RequestBody Operators operators, HttpServletResponse response) throws IOException{
		operatorsService.update(operators);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//删除员工信息，AJAX请求
	@RequestMapping(params="method=delete")
	public void delete(@RequestBody int[] ids, HttpServletResponse response) throws IOException{
		operatorsService.delete(ids);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	

	public OperatorsService getOperatorsService() {
		return operatorsService;
	}

	@Resource
	public void setOperatorsService(OperatorsService operatorsService) {
		this.operatorsService = operatorsService;
	}

	public DepartmentService getDepartmentService() {
		return departmentService;
	}

	@Resource
	public void setDepartmentService(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}

	
}
