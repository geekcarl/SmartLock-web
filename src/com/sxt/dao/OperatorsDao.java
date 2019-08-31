package com.sxt.dao;

import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.classic.Session;
import org.springframework.dao.DataAccessException;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.sxt.po.Department;
import com.sxt.po.Operators;
import com.sxt.po.OperatorsSearch;
import com.sxt.po.User;
import com.sxt.utils.PrivilegeControl;

@Component("operatorsDao")
public class OperatorsDao {
	@Resource
	private HibernateTemplate hibernateTemplate;
	
	//分页
	public List<Operators> findByPager(OperatorsSearch ds){
		StringBuffer sb = new StringBuffer("from Operators o where 0=0 ");
		if (ds.getName() != null && ! ds.getName().equals(""))
		{
			sb.append(" and o.name like '%" + ds.getName() + "%'");
		}
		if (ds.getOp_no() != null && ! ds.getOp_no().equals(""))
		{
			sb.append(" and o.op_no like '%" + ds.getOp_no() + "%'");
		}
		if (ds.getPhone_no() != null && ! ds.getPhone_no().equals(""))
		{
			sb.append(" and o.phone_no like '%" + ds.getPhone_no() + "%'");
		}
		if (ds.getEmail() != null && ! ds.getEmail().equals(""))
		{
			sb.append(" and o.email like '%" + ds.getEmail() + "%'");
		}
		if (ds.getAux_phone() != null && ! ds.getAux_phone().equals(""))
		{
			sb.append(" and o.aux_phone like '%" + ds.getAux_phone() + "%'");	
		}
		if (ds.getDepartment() != null && ! ds.getDepartment().equals(""))
		{
			sb.append(" and o.department.name = '" + ds.getDepartment() + "'");
		}
		if (ds.getSex() > 0)
		{
			sb.append(" and o.sex = " + (ds.getSex() - 1));
		}
		if (ds.getAddress() != null && ! ds.getAddress().equals(""))
		{
			sb.append(" and o.address like '%" + ds.getAddress() + "%'");
		}
		if (ds.getSort() != null && ! ds.getSort().equals(""))
		{
			sb.append("order by d." + ds.getSort() + " " + ds.getOrder() + " ");
		}
		List<Operators> operators = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		return operators;
	}
	
	public Operators find(int id)
	{
		return hibernateTemplate.get(Operators.class, id);
	}
	
	//获取所有人员(该用户所属部门以及子部门下的所有人员)
	public List<User> findAll(HttpServletRequest request)
	{
		List<User> users = null;
		String deps = PrivilegeControl.getDepartments(request);
		
		users = hibernateTemplate.find("from User u where u.is_deleted=0 and u.department.id in " + deps + " order by u.department.name");
		return users;
	}
	
	//获取指定部门下所有人员
	public List<User> findAllByDepartmentId(HttpServletRequest request,int id)
	{
		String deps=PrivilegeControl.getDepartments(request);
		
		List<User> users = hibernateTemplate.find("from User u where u.department.id = ? and  u.department.id in " + deps + "  and u.is_deleted=0 order by u.full_name", id);
		return users;
	
	} 
	
	public void add(Operators o)
	{
		hibernateTemplate.save(o);
	}
	
	public void update(Operators o){
		hibernateTemplate.update(o);
	}
	
	public void delete(int[] ids) {
		for (int i = 0; i < ids.length; i ++)
		{
			User o = this.hibernateTemplate.get(User.class, ids[i]);
			this.hibernateTemplate.bulkUpdate("update KeyInfo k set k.operators = NULL where k.operators.id = ?", o.getId());
			this.hibernateTemplate.bulkUpdate("update GrantLog g set g.operators = NULL where g.operators.id = ?", o.getId());
			this.hibernateTemplate.bulkUpdate("update User u set u.is_deleted = 1 where u.id = ?", o.getId());
		}
	}
	
	public int findCounts(OperatorsSearch ds)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory();
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			StringBuffer sb = new StringBuffer("select count(*) from Operators o where 0=0 ");
			if (ds.getName() != null && ! ds.getName().equals(""))
			{
				sb.append(" and o.name like '%" + ds.getName() + "%'");
			}
			if (ds.getOp_no() != null && ! ds.getOp_no().equals(""))
			{
				sb.append(" and o.op_no like '%" + ds.getOp_no() + "%'");
			}
			if (ds.getPhone_no() != null && ! ds.getPhone_no().equals(""))
			{
				sb.append(" and o.phone_no like '%" + ds.getPhone_no() + "%'");
			}
			if (ds.getEmail() != null && ! ds.getEmail().equals(""))
			{
				sb.append(" and o.email like '%" + ds.getEmail() + "%'");
			}
			if (ds.getAux_phone() != null && ! ds.getAux_phone().equals(""))
			{
				sb.append(" and o.aux_phone like '%" + ds.getAux_phone() + "%'");	
			}
			if (ds.getDepartment() != null && ! ds.getDepartment().equals(""))
			{
				sb.append(" and o.department.name = '" + ds.getDepartment() + "'");
			}
			if (ds.getSex() > 0)
			{
				sb.append(" and o.sex = " + (ds.getSex() - 1));
			}
			if (ds.getAddress() != null && ! ds.getAddress().equals(""))
			{
				sb.append(" and o.address like '%" + ds.getAddress() + "%'");
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
	
	public List getListForPage(final String hql, final int offset,
			final int length) {
		List list = hibernateTemplate.executeFind(new HibernateCallback() {
			@Override
			public Object doInHibernate(org.hibernate.Session session)
					throws HibernateException, SQLException {
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
