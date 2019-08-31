package com.sxt.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sxt.dao.DepartmentDao;
import com.sxt.dao.UserDao;
import com.sxt.po.Department;
import com.sxt.po.DepartmentSearch;
import com.sxt.po.Operators;
import com.sxt.po.User;

@Service("departmentService")
public class DepartmentService {
	@Resource
	private DepartmentDao departmentDao;

	//获取某人的部门及子部门权限
	public List<Department> findChildrenQuery(Integer id, HttpServletRequest request) {
		List<Department> all = this.departmentDao.findAllDepartment(request);
		List<Department> result = new ArrayList<Department>();
		for (int i = 0; i < all.size(); i ++)
		{
			if (this.isChildren(id, all.get(i)))
			{
				result.add(all.get(i));
			}
		}
		return result.size() > 0 ? result : null;
	}
	
	//获取超级管理员的所有部门权限
	public List<Department> findAllQuery(HttpServletRequest request) {
		List<Department> all = this.departmentDao.findAllDepartment(request);
		return all;
	}
	
	public Boolean isChildren(Integer id, Department d) {
		Boolean result = false;
		if (d.getId() == id) result = true;
		else if (d.getParent() != null) result = this.isChildren(id, d.getParent());
		return result;
	}
	
	public List<Department> findByName(String name)
	{
		return this.departmentDao.findByName(name);
	}
		
	public void add(Department d){
		departmentDao.add(d);
	}
	
	public List<Department> findByPager(DepartmentSearch ds, HttpServletRequest request){
		return departmentDao.findByPager(ds, request);
	}
	
	public List<Department> findAll(HttpServletRequest request){
		return departmentDao.findAll(request);
	}
	
	public Department find(int id)
	{
		return departmentDao.find(id);
	}
	
	public void update(Department o)
	{
		departmentDao.update(o);
	}
	
	public void delete(int[] ids) {
		departmentDao.delete(ids);
	}
	
	public int findCounts(DepartmentSearch ds, HttpServletRequest request)
	{
		return departmentDao.findCounts(ds, request);
	}

	public DepartmentDao getDepartmentDao() {
		return departmentDao;
	}

	public void setDepartmentDao(DepartmentDao departmentDao) {
		this.departmentDao = departmentDao;
	}

	
}
