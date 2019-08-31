package com.sxt.dao;

import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
import com.sxt.po.GrantLog;
import com.sxt.po.GrantLogSearch;
import com.sxt.po.KeyInfo;
import com.sxt.po.KeyInfoSearch;
import com.sxt.po.KeyTypeInfo;
import com.sxt.po.KeyTypeInfoSearch;
import com.sxt.po.LockInfo;
import com.sxt.po.LockInfoSearch;
import com.sxt.po.LockTypeInfo;
import com.sxt.po.LockTypeInfoSearch;
import com.sxt.po.Operators;
import com.sxt.po.OrderRespect;
import com.sxt.po.User;
import com.sxt.utils.PrivilegeControl;

@Component("lockandkeyDao")
public class LockAndKeyDao {
	@Resource
	private HibernateTemplate hibernateTemplate;
	
	
	 //获取用户开门授权数量
		public int findUserOpenGrantLogCounts(GrantLogSearch ds, HttpServletRequest request)
		{
			SessionFactory sf = hibernateTemplate.getSessionFactory(); 
			StringBuffer sb = new StringBuffer();
			String deps = PrivilegeControl.getDepartments(request);
			Session session = sf.getCurrentSession();
			Long count = new Long(0);
			try
			{
				sb.append("select count(*) from GrantLog d where 0=0 and d.auth_type = 2 and d.dep_id in " + deps);
				
				if (ds.getLog_name() != null && ! ds.getLog_name().equals(""))
				{
					sb.append(" and d.log_name like '%" + ds.getLog_name() + "%' ");
				}
				if (ds.getGrant_user() != null && ! ds.getGrant_user().equals(""))
				{
					sb.append(" and d.grant_user like '%" + ds.getGrant_user() + "%' ");
				}
				if (ds.getOperator_username() != null && ! ds.getOperator_username().equals(""))
				{
					sb.append(" and d.operators.user_name like '%" + ds.getOperator_username() + "%' ");
				}
				
				if (ds.getOperator_name() != null && ! ds.getOperator_name().equals(""))
				{
					sb.append(" and d.operators.full_name like '%" + ds.getOperator_name() + "%' ");
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
		
		
		//获取用户开门授权列表
		public List<GrantLog> findUserOpenGrantLogByPager(GrantLogSearch ds, HttpServletRequest request){
			StringBuffer sb = new StringBuffer();
			String deps = PrivilegeControl.getDepartments(request);
			sb.append("from GrantLog d where 0=0 and d.auth_type = 2  and d.dep_id in " + deps);
			
			if (ds.getLog_name() != null && ! ds.getLog_name().equals(""))
			{
				sb.append(" and d.log_name like '%" + ds.getLog_name() + "%' ");
			}
			if (ds.getGrant_user() != null && ! ds.getGrant_user().equals(""))
			{
				sb.append(" and d.grant_user like '%" + ds.getGrant_user() + "%' ");
			}
			if (ds.getOperator_username() != null && ! ds.getOperator_username().equals(""))
			{
				sb.append(" and d.operators.user_name like '%" + ds.getOperator_username() + "%' ");
			}
			
			if (ds.getOperator_name() != null && ! ds.getOperator_name().equals(""))
			{
				sb.append(" and d.operators.full_name like '%" + ds.getOperator_name() + "%' ");
			}
			if (ds.getSort() != null && ! ds.getSort().equals(""))
			{
				sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
			}
			else
			{
				sb.append(" order by d.grant_time desc ");
			}
			List<GrantLog> d = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
			return d;
		}
		
		 //修改用户开门授权
	    public void updateUserOpenGrantLog(GrantLog gl){
			
			GrantLog tempgl = this.hibernateTemplate.get(GrantLog.class, gl.getId());
			
			for (int i = 0; i < tempgl.getGds().size(); i ++)
			{
				this.hibernateTemplate.delete(tempgl.getGds().get(i));
			}
			
			hibernateTemplate.flush();
			hibernateTemplate.clear();
			
			GrantLog newli = gl;
			User liuser= this.hibernateTemplate.get(User.class, gl.getOperators().getId());
			newli.setAuth_type(2);
		
			newli.setDep_id(liuser.getDepartment().getId());
			newli.setOperators_name(liuser.getFull_name());
		
			hibernateTemplate.update(newli);
			for (int i = 0; i < gl.getGds().size(); i ++)
			{
				gl.getGds().get(i).setGrantLog(gl);
				this.hibernateTemplate.save(gl.getGds().get(i));
			}

		 }
	    
	    
	    //添加用户开门授权
	    public void addUserOpenGrantLog(GrantLog li){
			
			GrantLog newli = li;
			User liuser= this.hibernateTemplate.get(User.class, li.getOperators().getId());
			newli.setAuth_type(2);
			
			newli.setDep_id(liuser.getDepartment().getId());
			newli.setOperators_name(liuser.getFull_name());
			
			hibernateTemplate.save(newli);
			
			for (int i = 0; i < li.getGds().size(); i ++)
			{
				li.getGds().get(i).setGrantLog(li);
				
				this.hibernateTemplate.save(li.getGds().get(i));
			}
			
		}
	
	
	//删除锁类型
	public void deleteLockTypeInfo(int[] ids)
	{
		for (int i = 0; i < ids.length; i ++)
		{
			this.hibernateTemplate.bulkUpdate("update LockInfo li set li.lockTypeInfo.id = NULL where li.lockTypeInfo.id=?", ids[i]);
			this.hibernateTemplate.bulkUpdate("delete from LockTypeInfo where id=?", ids[i]);
		}
	}
	
	//删除钥匙类型
	public void deleteKeyTypeInfo(int[] ids)
	{
		for (int i = 0; i < ids.length; i ++)
		{
			this.hibernateTemplate.bulkUpdate("update KeyInfo ki set ki.keyTypeInfo.id = NULL where ki.keyTypeInfo.id=?", ids[i]);
			this.hibernateTemplate.bulkUpdate("delete from KeyTypeInfo where id=?", ids[i]);
		}
	}
	
	//添加锁
	public void addLock(LockInfo li){
		hibernateTemplate.save(li);
		BoxInfo bi = this.hibernateTemplate.get(BoxInfo.class, li.getBoxInfo().getId());
		if (bi.getLocks_count() == null) bi.setLocks_count(0);
		this.hibernateTemplate.bulkUpdate("update BoxInfo b set b.locks_count = ? where b.id = ?", bi.getLocks_count() + 1, li.getBoxInfo().getId());
	}
	
	//添加锁
	public void deleteLockInfo(int[] ids){
		for (int i = 0; i < ids.length; i ++)
		{
			LockInfo li = this.hibernateTemplate.get(LockInfo.class, ids[i]);
			this.hibernateTemplate.bulkUpdate("update BoxInfo b set b.locks_count = b.locks_count-1 where b.id=?", li.getBoxInfo().getId());
			this.hibernateTemplate.bulkUpdate("delete from LockInfo where id=?", ids[i]);
		}
	}
	
	public List<Map<String, Object>> findLock(LockInfo li) {
		String sql = "select new map(li.id as id) from LockInfo li where li.lock_code = '" + li.getLock_code() + "'";
		return this.hibernateTemplate.find(sql);
	}
	
	//添加锁类型
	public void addLockType(LockTypeInfo li){
		hibernateTemplate.save(li);
	}
	
	//获取锁列表
	public List<LockInfo> findLockInfoByPager(LockInfoSearch ds,HttpServletRequest request){
		StringBuffer sb = new StringBuffer();
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = 	PrivilegeControl.getBoxes(request);
		if(! boxes.equals("(-1)")){
			sb.append("from LockInfo d where 0=0 and d.boxInfo.id in "+ boxes +" ");
		}
		else
		{
			sb.append("from LockInfo d where 0=0 and d.boxInfo.department.id in "+ deps +" ");
		}
		if (ds.getBoxInfo_id() > 0)
		{
			sb.append(" and d.boxInfo.id = " + ds.getBoxInfo_id());
		}
		if (ds.getSort() != null && ! ds.getSort().equals(""))
		{
			sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
		}
		List<LockInfo> d = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		return d;
	}
	
	//获取锁类型列表
	public List<LockTypeInfo> findLockTypeInfoByPager(LockTypeInfoSearch ds){
		StringBuffer sb = new StringBuffer();
		sb.append("from LockTypeInfo d where 0=0 ");
		if (ds.getSort() != null && ! ds.getSort().equals(""))
		{
			sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
		}
		List<LockTypeInfo> d = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		return d;
	}
	
	//获取所有锁类型
	public List<LockTypeInfo> findAllLockType(){
		List<LockTypeInfo> ds = hibernateTemplate.find("FROM LockTypeInfo d");
		return ds;
	}
	
	
	//获取锁数量
	public int findLockCounts(LockInfoSearch ds,HttpServletRequest request)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		String boxes=PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		StringBuffer sb = new StringBuffer();
		try
		{
			if(! boxes.equals("(-1)")){
				sb.append("select count(*) from LockInfo d where 0=0 and d.boxInfo.id in "+ boxes +" ");
			}
			else
			{
				sb.append("select count(*) from LockInfo d where 0=0 and d.boxInfo.department.id in "+ deps +" ");
			}
			if (ds.getBoxInfo_id() > 0)
			{
				sb.append(" and d.boxInfo.id = " + ds.getBoxInfo_id());
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
	
	//获取锁类型数量
	public int findLockTypeCounts()
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory();
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			Query q = session.createQuery("select count(*) from LockTypeInfo d");
			count = (Long)q.uniqueResult();
		}
		finally
		{
			session.close();
		}
		return count.intValue();
	}
	
	////////////////////////////
	
	//添加钥匙
	public void addKey(KeyInfo li){
		hibernateTemplate.save(li);
	}
	
	//查询钥匙是否存在
	
	public int findExistKey(KeyInfo li){
		List<KeyInfo> ops = this.hibernateTemplate.find("from KeyInfo o where o.rfid = ?  or o.key_code = ?", li.getRfid(),li.getKey_code());
		if(ops !=null && ops.size() > 0)
			return 1;
		return 0;
	}
	
	//findupdateExistKey
	public int findupdateExistKey(KeyInfo li){
		List<KeyInfo> ops = this.hibernateTemplate.find("from KeyInfo o where o.id <>?  and ( o.rfid = ?  or o.key_code = ?)", li.getId(),li.getRfid(),li.getKey_code());
		if(ops !=null && ops.size() > 0)
			return 1;
		return 0;
	}
	
	//获取钥匙详情
	public KeyInfo findKey(int id){
		 return hibernateTemplate.get(KeyInfo.class, id);
	}
	
	//修改钥匙
	public void updateKey(KeyInfo ki){
		this.hibernateTemplate.update(ki);
	}
	
	//删除钥匙
	public void deleteKey(int[] ids){
		for (int i = 0; i < ids.length; i ++)
		{
			KeyInfo ki = this.hibernateTemplate.get(KeyInfo.class, ids[i]);
			List<GrantLog> gls = this.hibernateTemplate.find("from GrantLog gl where gl.key.id = ?", ids[i]);
			for (int j = 0; j < gls.size(); j ++)
			{
				this.hibernateTemplate.delete(gls.get(j));
			}
			this.hibernateTemplate.delete(ki);
		}
		
	}
	
	
	
	//添加钥匙类型
	public void addKeyType(KeyTypeInfo li){
		hibernateTemplate.save(li);
	}
	
	//获取钥匙列表
	public List<Map<String, Object>> findKeyInfoByPager(KeyInfoSearch ds,HttpServletRequest request){
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		sb.append("select new map(d.id as id, d.key_no as key_no, d.rfid as rfid, d.key_code as key_code, dep.name as department, kti.type as keyTypeInfo, op.full_name as full_name, op.phone_no as phone_no, d.auth_boxes_count as auth_boxes_count, d.remarks as remarks) from KeyInfo d left join d.department as dep left join d.keyTypeInfo as kti left join d.operators as op where d.department.id in "+ deps +" ");
		if (ds.getKey_no() != null && ! ds.getKey_no().equals(""))
		{
			sb.append(" and d.key_no like '%" + ds.getKey_no() + "%'");
		}
		if (ds.getRfid() != null && ! ds.getRfid().equals(""))
		{
			sb.append(" and d.rfid like '%" + ds.getRfid() + "%'");
		}
		if (ds.getKey_code() != null && ! ds.getKey_code().equals(""))
		{
			sb.append(" and d.key_code like '%" + ds.getKey_code() + "%'");
		}
		if (ds.getDepartment_name() != null && ! ds.getDepartment_name().equals(""))
		{
			sb.append(" and d.department.name like '%" + ds.getDepartment_name() + "%'");
		}
		if (ds.getKey_type() != null && ! ds.getKey_type().equals(""))
		{
			sb.append(" and d.keyTypeInfo.type like '%" + ds.getKey_type() + "%'");
		}
		if (ds.getOp_no() != null && ! ds.getOp_no().equals(""))
		{
			sb.append(" and d.operators.op_no like '%" + ds.getOp_no() + "%'");	
		}
		if (ds.getOp_name() != null && ! ds.getOp_name().equals(""))
		{
			sb.append(" and d.operators.full_name like '%" + ds.getOp_name() + "%'");	
		}
		if (ds.getAuth_boxes_count() > 0)
		{
			sb.append(" and d.auth_boxes_count = " + ds.getAuth_boxes_count() + "%'");
		}
		if (ds.getAuth_boxes_count() > 0)
		{
			sb.append(" and d.auth_boxes_count = " + ds.getAuth_boxes_count() + "%'");
		}
		if (ds.getSort() != null && ! ds.getSort().equals(""))
		{
			sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
		}
	
		
		List<Map<String, Object>> d = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		return d;
	}
	
	//获取钥匙类型列表
	public List<KeyTypeInfo> findKeyTypeInfoByPager(KeyTypeInfoSearch ds){
		StringBuffer sb = new StringBuffer();
		sb.append("from KeyTypeInfo d where 0=0 ");
		if (ds.getSort() != null && ! ds.getSort().equals(""))
		{
			sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
		}
		List<KeyTypeInfo> d = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		return d;
	}
	
	//获取所有钥匙类型
	public List<KeyTypeInfo> findAllKeyType(){
		List<KeyTypeInfo> ds = hibernateTemplate.find("FROM KeyTypeInfo d order by d.type");
		return ds;
	}
	
	//获取所有钥匙
	public List<KeyInfo> findAllKey(){
		List<KeyInfo> ds = hibernateTemplate.find("FROM KeyInfo k order by k.key_no");
		return ds;
	}
	
	//获取部门下所有钥匙
	public List<KeyInfo> findAllKeyByDepartmentId(HttpServletRequest request, int id){
		
		String deps=PrivilegeControl.getDepartments(request);
		List<KeyInfo> ds = hibernateTemplate.find("FROM KeyInfo k where k.department.id = ? and  k.department.id in " + deps + "  order by k.key_no", id);
		return ds;
	
	}
	
	//获取钥匙数量
	public int findKeyCounts(KeyInfoSearch ds,HttpServletRequest request)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory();
		String deps = PrivilegeControl.getDepartments(request);
		StringBuffer sb = new StringBuffer();
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			sb.append("select count(*) from KeyInfo d where 0=0 and d.department.id in "+ deps +" ");
			if (ds.getKey_no() != null && ! ds.getKey_no().equals(""))
			{
				sb.append(" and d.key_no like '%" + ds.getKey_no() + "%'");
			}
			if (ds.getRfid() != null && ! ds.getRfid().equals(""))
			{
				sb.append(" and d.rfid like '%" + ds.getRfid() + "%'");
			}
			if (ds.getKey_code() != null && ! ds.getKey_code().equals(""))
			{
				sb.append(" and d.key_code like '%" + ds.getKey_code() + "%'");
			}
			if (ds.getDepartment_name() != null && ! ds.getDepartment_name().equals(""))
			{
				sb.append(" and d.department.name like '%" + ds.getDepartment_name() + "%'");
			}
			if (ds.getKey_type() != null && ! ds.getKey_type().equals(""))
			{
				sb.append(" and d.keyTypeInfo.type like '%" + ds.getKey_type() + "%'");
			}
			if (ds.getOp_no() != null && ! ds.getOp_no().equals(""))
			{
				sb.append(" and d.operators.op_no like '%" + ds.getOp_no() + "%'");	
			}
			if (ds.getOp_name() != null && ! ds.getOp_name().equals(""))
			{
				sb.append(" and d.operators.full_name like '%" + ds.getOp_name() + "%'");	
			}
			if (ds.getAuth_boxes_count() > 0)
			{
				sb.append(" and d.auth_boxes_count = " + ds.getAuth_boxes_count() + "%'");
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
	
	//获取钥匙类型数量
	public int findKeyTypeCounts()
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			Query q = session.createQuery("select count(*) from KeyTypeInfo d");
			count = (Long)q.uniqueResult();
		}
		finally
		{
			session.close();
		}
		return count.intValue();
	}
	
	
	//添加钥匙授权
	public void addGrantLog(GrantLog li){
		
		GrantLog newli = li;
		KeyInfo likey= this.hibernateTemplate.get(KeyInfo.class, li.getKey_id());
		User liuser= this.hibernateTemplate.get(User.class, li.getOperators().getId());
		newli.setAuth_type(0);
		newli.setKey_no(likey.getKey_no());
		newli.setKey_rfid(likey.getRfid());
		newli.setDep_id(likey.getDepartment().getId());
		newli.setOperators_name(liuser.getFull_name());
		
		hibernateTemplate.save(newli);
		
		for (int i = 0; i < li.getGds().size(); i ++)
		{
			li.getGds().get(i).setGrantLog(li);
			
			this.hibernateTemplate.save(li.getGds().get(i));
		}
		
		KeyInfo key = this.hibernateTemplate.get(KeyInfo.class, li.getKey_id());
		key.setOperators(li.getOperators());
		key.setAuth_boxes_count(li.getGds().size());
		this.hibernateTemplate.update(key);
	}
	
	//修改钥匙授权
	public void updateGrantLog(GrantLog gl){
		
		GrantLog tempgl = this.hibernateTemplate.get(GrantLog.class, gl.getId());
		for (int i = 0; i < tempgl.getGds().size(); i ++)
		{
			this.hibernateTemplate.delete(tempgl.getGds().get(i));
		}
		hibernateTemplate.flush();
		hibernateTemplate.clear();
		
		
		GrantLog newli = gl;
		KeyInfo likey= this.hibernateTemplate.get(KeyInfo.class, gl.getKey_id());
		User liuser= this.hibernateTemplate.get(User.class, gl.getOperators().getId());
		newli.setAuth_type(0);
		newli.setKey_no(likey.getKey_no());
		newli.setKey_rfid(likey.getRfid());
		newli.setDep_id(likey.getDepartment().getId());
		newli.setOperators_name(liuser.getFull_name());
	
		hibernateTemplate.update(newli);
		for (int i = 0; i < gl.getGds().size(); i ++)
		{
			gl.getGds().get(i).setGrantLog(gl);
			this.hibernateTemplate.save(gl.getGds().get(i));
		}
		
		
		KeyInfo key = this.hibernateTemplate.get(KeyInfo.class, gl.getKey_id());
		key.setOperators(gl.getOperators());
		key.setAuth_boxes_count(gl.getGds().size());
		this.hibernateTemplate.update(key);
	}
	
	//删除钥匙授权
	public void deleteGrantLog(int[] ids){
		for (int i = 0; i < ids.length; i ++)
		{
			GrantLog gl = this.hibernateTemplate.get(GrantLog.class, ids[i]);
			if(gl.getAuth_type() == 0 && gl.getKey_id()!=null)
			{	
			
			KeyInfo key = this.hibernateTemplate.get(KeyInfo.class, gl.getKey_id());
			key.setOperators(null);
			key.setAuth_boxes_count(0);
			this.hibernateTemplate.update(key);
			
			}
			this.hibernateTemplate.delete(gl);
		}
	}
	
	//获取钥匙授权列表
	public List<GrantLog> findGrantLogByPager(GrantLogSearch ds, HttpServletRequest request){
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		sb.append("from GrantLog d where 0=0 and d.auth_type = 0  and d.dep_id in " + deps);
		if (ds.getLog_name() != null && ! ds.getLog_name().equals(""))
		{
			sb.append(" and d.log_name like '%" + ds.getLog_name() + "%' ");
		}
		if (ds.getGrant_user() != null && ! ds.getGrant_user().equals(""))
		{
			sb.append(" and d.grant_user like '%" + ds.getGrant_user() + "%' ");
		}
		if (ds.getKey_no() != null && ! ds.getKey_no().equals(""))
		{
			sb.append(" and d.key_no like '%" + ds.getKey_no() + "%' ");
		}
		if (ds.getRfid() != null && ! ds.getRfid().equals(""))
		{
			sb.append(" and d.key_rfid like '%" + ds.getRfid() + "%' ");
		}
		
		if (ds.getOperator_name() != null && ! ds.getOperator_name().equals(""))
		{
			sb.append(" and d.operators.full_name like '%" + ds.getOperator_name() + "%' ");
		}
		if (ds.getSort() != null && ! ds.getSort().equals(""))
		{
			sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
		}
		else
		{
			sb.append(" order by d.grant_time desc ");
		}
		List<GrantLog> d = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		return d;
	}
	
	//获取钥匙授权信息
	public GrantLog findGrantLogById(int id){
		return this.hibernateTemplate.get(GrantLog.class, id);
	}
	
	
	//获取钥匙授权数量
	public int findGrantLogCounts(GrantLogSearch ds, HttpServletRequest request)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			sb.append("select count(*) from GrantLog d where 0=0 and d.auth_type = 0 and d.dep_id in " + deps);
			if (ds.getLog_name() != null && ! ds.getLog_name().equals(""))
			{
				sb.append(" and d.log_name like '%" + ds.getLog_name() + "%' ");
			}
			if (ds.getGrant_user() != null && ! ds.getGrant_user().equals(""))
			{
				sb.append(" and d.grant_user like '%" + ds.getGrant_user() + "%' ");
			}
			if (ds.getKey_no() != null && ! ds.getKey_no().equals(""))
			{
				sb.append(" and d.key_no like '%" + ds.getKey_no() + "%' ");
			}
			if (ds.getRfid() != null && ! ds.getRfid().equals(""))
			{
				sb.append(" and d.key_rfid like '%" + ds.getRfid() + "%' ");
			}
			
			if (ds.getOperator_name() != null && ! ds.getOperator_name().equals(""))
			{
				sb.append(" and d.operators.full_name like '%" + ds.getOperator_name() + "%' ");
			}
			
			if (ds.getSort() != null && ! ds.getSort().equals(""))
			{
				sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
			}else
			{
				sb.append(" order by d.grant_time  desc");
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
	
	//分页工具
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
