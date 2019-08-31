package com.sxt.dao;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.classic.Session;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.sxt.po.BoxInfo;
import com.sxt.po.Department;
import com.sxt.po.DepartmentSearch;
import com.sxt.po.KeyInfo;
import com.sxt.po.LockInfo;
import com.sxt.po.Operators;
import com.sxt.po.User;
import com.sxt.utils.PrivilegeControl;

@Component("departmentDao")
public class DepartmentDao {
	
	@Resource
	private HibernateTemplate hibernateTemplate;
	
	
	//根据部门名称检索所有部门
	public List<Department> findByName(String name)
	{
		return this.hibernateTemplate.find("from Department d where d.name = ? and d.is_deleted=0", name);
	}
	
	//添加部门
	public void add(Department d){
		if (d.getParent() != null)
		{
			Department temp = this.hibernateTemplate.get(Department.class, d.getParent().getId());
			d.setFull_name(full_name(temp) + d.getName());
		}
		else
		{
			d.setFull_name(d.getName());
		}
		hibernateTemplate.flush();
		hibernateTemplate.clear();
		hibernateTemplate.save(d);
	}
	
	public String full_name(Department d)
	{
		StringBuffer sb = new StringBuffer();
		if (d.getParent() != null)
		{
			sb.append(full_name(d.getParent()));
		}
		sb.append(d.getName() + "_");
		return sb.toString();
	}
	
	//获取部门分页
	public List<Department> findByPager(DepartmentSearch ds, HttpServletRequest request){
		StringBuffer sb = new StringBuffer();
		String deps=PrivilegeControl.getDepartments(request);
		Object query = request.getSession().getAttribute("department_query");
		if (query != null)
		{
			sb.append("from Department d where d.is_deleted=0 and d.id in " + deps + " ");
		}
		else
		{
			sb.append("from Department d where d.is_deleted=0 ");
		}
		if (ds.getName() != null && ! ds.getName().equals(""))
		{
			sb.append("and d.name like '%" + ds.getName() + "%' ");
		}
		if (ds.getFull_name() != null && ! ds.getFull_name().equals(""))
		{
			sb.append("and d.full_name like '%" + ds.getFull_name() + "%' ");
		}
		if (ds.getContact() != null && ! ds.getContact().equals(""))
		{
			sb.append("and d.contact like '%" + ds.getContact() + "%' ");
		}
		if (ds.getAddress() != null && ! ds.getAddress().equals(""))
		{
			sb.append("and d.address like '%" + ds.getAddress() + "%' ");
		}
		if (ds.getParent_name() != null && ! ds.getParent_name().equals(""))
		{
			sb.append("and d.parent.name like '%" + ds.getParent_name() + "%' ");
		}
		if (ds.getSort() != null && ! ds.getSort().equals(""))
		{
			sb.append("order by d." + ds.getSort() + " " + ds.getOrder() + " ");
		}
		List<Department> d = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		return d;
	}
	
	//获取部门详情
	public Department find(int id)
	{
		return hibernateTemplate.get(Department.class, id);
	}
	
	//获取所有最上级部门，即没有上级部门的部门
	public List<Department> findAll(HttpServletRequest request){
		List<Department> ds = new ArrayList<Department>();
		Object user_name = request.getSession().getAttribute("user_name");
		if (user_name != null && user_name.toString().equals("admin")) //如果是超级管理员
		{
			String deps = PrivilegeControl.getDepartments(request);
			if (! deps.equals("(-1)"))
			{
				ds = hibernateTemplate.find("FROM Department d where d.parent.id IS NULL and d.is_deleted=0 and d.id IN " + deps + " order by d.full_name");
			}
			else
			{
				ds = hibernateTemplate.find("FROM Department d where d.parent.id IS NULL and d.is_deleted=0 order by d.full_name");
			}
		}
		else //如果是普通管理员
		{
			Object o = request.getSession().getAttribute("department_id");
			if (o != null)
			{
				Department temp = this.find(Integer.parseInt(o.toString()));
				ds.add(temp);
			}
		}
		return ds;
	}
	
	//获取所有部门,这里不能加上判断
	public List<Department> findAllDepartment(HttpServletRequest request){
		
		
		List<Department> ds = null;
		//Object query = request.getSession().getAttribute("department_query");
		//if (query != null)
		//{
		//	ds = hibernateTemplate.find("FROM Department d where d.is_deleted=0 and d.id " + query.toString() + " order by d.full_name");
		//}
		//else
		//{
			ds = hibernateTemplate.find("FROM Department d where d.is_deleted=0 order by d.full_name");
		//}
		return ds;
	}
	
	//修改部门信息
	public void update(Department d){
		if (d.getParent() != null)
		{
			Department temp = this.hibernateTemplate.get(Department.class, d.getParent().getId());
			d.setFull_name(full_name(temp) + d.getName());
		}
		else
		{
			d.setFull_name(d.getName());
		}
		hibernateTemplate.flush();
		hibernateTemplate.clear();
		hibernateTemplate.update(d);
	}
	
	
	//批量删除部门
	//删除的时候还需要考虑其他地方有department外键的情况,要置空 NULL
	public void delete(int[] ids) {
		if (ids.length > 0)
		{
			StringBuffer sb = new StringBuffer("(");
			for (int i = 0; i < ids.length; i ++) sb.append("" + ids[i] + ",");
			String sql = sb.toString().substring(0, sb.length() - 1) + ")";
			this.hibernateTemplate.bulkUpdate("update Department d set d.parent = NULL where d.parent.id in " + sql);
			this.hibernateTemplate.bulkUpdate("update Department d set d.is_deleted = 1 where d.id in" + sql);
		}
	}
	
	//获取部门数量
	public int findCounts(DepartmentSearch ds, HttpServletRequest request)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		String deps = PrivilegeControl.getDepartments(request);
		StringBuffer sb = new StringBuffer();
		Long count = new Long(0);
		Session session = sf.getCurrentSession();
		try
		{
			Object query = request.getSession().getAttribute("department_query");
			if (query != null)
			{
				sb.append("select count(*) from Department d where d.is_deleted=0 and d.id in " + deps + " ");
			}
			else
			{
				sb.append("select count(*) from Department d where d.is_deleted=0 ");
			}
			if (ds.getName() != null && ! ds.getName().equals(""))
			{
				sb.append(" and d.name like '%" + ds.getName() + "%' ");
			}
			if (ds.getFull_name() != null && ! ds.getFull_name().equals(""))
			{
				sb.append(" and d.full_name like '%" + ds.getFull_name() + "%' ");
			}
			if (ds.getContact() != null && ! ds.getContact().equals(""))
			{
				sb.append(" and d.contact like '%" + ds.getContact() + "%' ");
			}
			if (ds.getAddress() != null && ! ds.getAddress().equals(""))
			{
				sb.append("and d.address like '%" + ds.getAddress() + "%' ");
			}
			if (ds.getParent_name() != null && ! ds.getParent_name().equals(""))
			{
				sb.append("and d.parent.name like '%" + ds.getParent_name() + "%' ");
			}
			Query q = session.createQuery(sb.toString());
			count = (Long)q.uniqueResult();
		}
		finally
		{
			session.close();
		}
		return count.intValue();
	}
	
	//分页模板
	public List getListForPage(final String hql, final int offset,
			final int length) {
		List list = hibernateTemplate.executeFind(new HibernateCallback() {
			@Override
			public Object doInHibernate(org.hibernate.Session session)
					throws HibernateException, SQLException {
				// TODO Auto-generated method stub
				List list = null;
				try
				{
					Query query = session.createQuery(hql);
					if (offset <= 0) query.setFirstResult(0);
					else query.setFirstResult(offset);
					if (length < 0) query.setMaxResults(10);
					else if (length > 0) query.setMaxResults(length);
					list = query.list();
				}
				finally
				{
					session.close();
				}
				return list;
			}
		});
		return list;
	}

	public HibernateTemplate getHibernateTemplate() {
		return hibernateTemplate;
	}

	public void setHibernateTemplate(HibernateTemplate hibernateTemplate) {
		this.hibernateTemplate = hibernateTemplate;
	}
	
}
