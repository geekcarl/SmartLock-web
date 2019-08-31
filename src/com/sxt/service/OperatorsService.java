package com.sxt.service;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sxt.dao.DepartmentDao;
import com.sxt.dao.OperatorsDao;
import com.sxt.dao.UserDao;
import com.sxt.po.BoxInfo;
import com.sxt.po.Department;
import com.sxt.po.Operators;
import com.sxt.po.OperatorsSearch;
import com.sxt.po.User;

@Component("operatorsService")
public class OperatorsService {
	private OperatorsDao operatorsDao;
	private DepartmentDao departmentDao;

	public OperatorsDao getOperatorsDao() {
		return operatorsDao;
	}

	@Resource
	public void setOperatorsDao(OperatorsDao operatorsDao) {
		this.operatorsDao = operatorsDao;
	}
	
	public DepartmentDao getDepartmentDao() {
		return departmentDao;
	}

	@Resource
	public void setDepartmentDao(DepartmentDao departmentDao) {
		this.departmentDao = departmentDao;
	}

	public List<Operators> findByPager(OperatorsSearch ds){
		return operatorsDao.findByPager(ds);
	}
	
	public List<User> findAll(HttpServletRequest request)
	{
		return operatorsDao.findAll(request);
	}
	
	//获取部门下的所有人员树
	public String findTreeByDepartment(HttpServletRequest request) {
		StringBuffer sb = new StringBuffer("");
		sb.append("[");
		List<Department> ds = this.departmentDao.findAllDepartment(request);
		for (int i = 0; i < ds.size(); i ++)
		{
			List <User> bs = this.operatorsDao.findAllByDepartmentId(request,ds.get(i).getId());
			if (bs.size() > 0)
			{
				sb.append("{\"id\" : \"de_" + ds.get(i).getId() + "\", \"pId\" : 0, \"type\" : 1, \"name\" : \"" + ds.get(i).getName() + "\", \"open\" : true},");
				for (int j = 0; j < bs.size(); j ++)
				{
					int phoneflag = 0;
					if (bs.get(j).getPhone_no() !=null && !bs.get(j).getPhone_no().equals("") ){
						phoneflag = 1;
					}
					
					sb.append("{\"id\" : " + bs.get(j).getId() + ", \"pId\" : \"de_" + ds.get(i).getId() + "\", \"type\" : 2,\"havephone\" : " + phoneflag + ", \"name\" : \"" + bs.get(j).getFull_name() + "\"},");
				}
			}
		}
		return sb.substring(0, sb.length() - 1) + "]";
	}
	
	public Operators find(int id)
	{
		return operatorsDao.find(id);
	}
	
	@Transactional
	public void add(Operators o)
	{
		operatorsDao.add(o);
	}
	
	@Transactional
	public void update(Operators o)
	{
		operatorsDao.update(o);
	}
	
	@Transactional
	public void delete(int[] ids) {
		operatorsDao.delete(ids);
	}
	
	public int findCounts(OperatorsSearch os)
	{
		return operatorsDao.findCounts(os);
	}
	
}
