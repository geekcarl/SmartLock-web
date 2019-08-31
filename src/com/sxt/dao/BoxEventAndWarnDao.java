package com.sxt.dao;

import java.util.Date;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import org.hibernate.transform.Transformers;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.sxt.po.AlarmEvent;
import com.sxt.po.AlarmEventSearch;
import com.sxt.po.BoxInfo;
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
import com.sxt.po.LockInfo;
import com.sxt.po.LockInfoSearch;
import com.sxt.po.LockTypeInfo;
import com.sxt.po.LockTypeInfoSearch;
import com.sxt.po.Operators;
import com.sxt.po.RepairRecord;
import com.sxt.po.SysConfig;
import com.sxt.po.User;
import com.sxt.po.WorkOrder;
import com.sxt.utils.PrivilegeControl;

@Component("boxEventAndWarnDao")
public class BoxEventAndWarnDao {
	@Resource
	private HibernateTemplate hibernateTemplate;
	

	public Map findOrderStatus(Integer id)
	{
		String hql = "select new map(w.id as id, w.done_type as done_type) from AlarmOrderDetails a, WorkOrder w where w.id = a.order.id and a.alarmevent.id = " + id;
		List<Map<String, Object>> results = this.hibernateTemplate.find(hql);
		if (results.size() > 0) return results.get(0);
		return null;
	}
	
	//获取系统配置信息
	public SysConfig findSysConfig() {
		List<SysConfig> temp = this.hibernateTemplate.find("from SysConfig");
		return temp.size() > 0 ? temp.get(0) : null;
	}
	
	//审批维修申请
	public void affirmFixapply(RepairRecord rr) {
		WorkOrder wo = new WorkOrder();
		this.hibernateTemplate.bulkUpdate("update RepairRecord rr set rr.app_result = ?, rr.app_user.id=?, rr.app_time=now() where rr.id = ?", rr.getApp_result(), rr.getApp_user().getId(), rr.getId());
		
		//如果是审批为通过要绑定工单
		if (rr.getApp_result() == 1)
		{
			rr = this.hibernateTemplate.get(RepairRecord.class, rr.getId());
			wo.setContent(rr.getRemark());
			wo.setDone_type(1);
			wo.setCreate_time(new Date());
			wo.setCreate_type(3);
			wo.setCreate_user(rr.getApp_user());
			wo.setDepartment(rr.getReceive_department());
			wo.setOrder_no("order_" + new Date().getTime());
			wo.setReceive_operators(rr.getReceive_user());
			wo.setRespect_endtime(rr.getRespect_end_time());
			wo.setRespect_starttime(rr.getRespect_start_time());
			wo.setType(rr.getRepairtype() == 1 ? 1 : 3);
			this.hibernateTemplate.save(wo);
			rr.setWorkorder(wo);
			rr.setIs_create(1);
			this.hibernateTemplate.update(rr);
		}
	}
	
	public RepairRecord findFixApply(int id) {
		return this.hibernateTemplate.get(RepairRecord.class, id);
	}
	
	public void deleteFixApply(int id) {
		this.hibernateTemplate.bulkUpdate("delete from RepairReocrd where id = ?", id);
	}
	
	//获取维修申请列表
	public List<Map<String, Object>> findFixApplyByPager(HttpServletRequest request, GlobalSearch ds){
		
		List<Map<String, Object>> list;
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		try
		{
			StringBuffer sb = new StringBuffer();
			if(! boxes.equals("(-1)")){
				sb.append("select new map(r.id as id, r.app_result as app_result, u1.full_name as user, dep1.name as department, b.box_no as box_no, u2.full_name as app_user, r.is_create as is_create, r.remark as remark, r.app_time as app_time, r.repairtype as repairtype, dep2.name as receive_department, u3.full_name as receive_user) from RepairRecord r left join r.user as u1 left join r.department as dep1 left join r.boxinfo as b left join r.app_user as u2 left join r.receive_department as dep2 left join r.receive_user as u3 where r.is_deleted=0 and b.id in " + boxes + " ");
			}
			else
			{
				sb.append("select new map(r.id as id, r.app_result as app_result, u1.full_name as user, dep1.name as department, b.box_no as box_no, u2.full_name as app_user, r.is_create as is_create, r.remark as remark, r.app_time as app_time, r.repairtype as repairtype, dep2.name as receive_department, u3.full_name as receive_user) from RepairRecord r left join r.user as u1 left join r.department as dep1 left join r.boxinfo as b left join r.app_user as u2 left join r.receive_department as dep2 left join r.receive_user as u3 where r.is_deleted=0 and dep1.id "+deps);
			}
			
			if (ds.getSort() != null && ! ds.getSort().equals(""))
			{
				sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
			}
			else
			{
				sb.append(" order by r.app_result asc,app_time desc ");
			}
			list = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		}
		finally
		{
		}
		
		return list;
	}
	
	
	//获取维修申请-数量
	public int findFixApplyCount(HttpServletRequest request)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory();
		Session session = sf.getCurrentSession();
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		Long count;
		try
		{
			StringBuffer sb = new StringBuffer();
			if(! boxes.equals("(-1)")){
				sb.append("select count(*) from RepairRecord r where r.is_deleted=0 and r.boxinfo.id in " + boxes + " ");
			}
			else
			{
				sb.append("select count(*) from RepairRecord r where r.is_deleted=0 and r.department.id in " + deps + " ");
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
	
	
	//获取门开关列表
	public List<DoorEvent> findDoorEventByPager(HttpServletRequest request, DoorEventSearch ds){
		List<DoorEvent> list;
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		try
		{
			StringBuffer sb = new StringBuffer();
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			if (! boxes.equals("(-1)"))
			{
				sb.append("from DoorEvent d where d.boxinfo.is_deleted=0 and d.boxinfo.id in " + boxes + " ");
			}
			else
			{
				sb.append("from DoorEvent d where d.boxinfo.is_deleted=0 and d.boxinfo.department.id in " + deps + " ");
			}
			if (ds.getBox_id() > 0)
			{
				sb.append(" and d.boxinfo.id = " + ds.getBox_id());
			}
			if (ds.getBox_no() != null && ! ds.getBox_no().equals(""))
			{
				sb.append(" and d.boxinfo.box_no like '%" + ds.getBox_no() + "%'");
			}
			if (ds.getAddress() != null && ! ds.getAddress().equals(""))
			{
				sb.append(" and d.boxinfo.address like '%" + ds.getAddress() + "%'");
			}
			if (ds.getController_id() > 0)
			{
				sb.append(" and d.boxinfo.controller_id = " + ds.getController_id());
			}
			if (ds.getOpen_time() != null)
			{
				sb.append(" and DateDiff(d.open_time,'" + df.format(ds.getOpen_time()) + "')=0");
			}
			if (ds.getOpen_keys() != null && ! ds.getOpen_keys().equals(""))
			{
				sb.append(" and d.open_keys like '%" + ds.getOpen_keys() + "%'");
			}
			if (ds.getOpen_operators() != null && ! ds.getOpen_operators().equals(""))
			{
				sb.append(" and d.open_operators like '%" + ds.getOpen_operators() + "%'");
			}
			if (ds.getOpen_rfids() != null && ! ds.getOpen_rfids().equals(""))
			{
				sb.append(" and d.open_rfids like '%" + ds.getOpen_rfids() + "%'");
			}
			if (ds.getClose_time() != null)
			{
				sb.append(" and DateDiff(d.close_time,'" + df.format(ds.getClose_time()) + "')=0");
			}
			if (ds.getClose_keys() != null && ! ds.getClose_keys().equals(""))
			{
				sb.append(" and d.close_keys like '%" + ds.getClose_keys() + "%'");
			}
			if (ds.getClose_operators() != null && ! ds.getClose_operators().equals(""))
			{
				sb.append(" and d.close_operators like '%" + ds.getClose_operators() + "%'");
			}
			if (ds.getClose_rfids() != null && ! ds.getClose_rfids().equals(""))
			{
				sb.append(" and d.close_rfids like '%" + ds.getClose_rfids() + "%'");
			}
			if (ds.getDepartment() != null && ! ds.getDepartment().equals(""))
			{
				sb.append(" and d.boxinfo.department.name = '" + ds.getDepartment() + "'");
			}
			if (ds.getSort() != null && ! ds.getSort().equals(""))
			{
				sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
			}
			else
			{
				sb.append(" order by d.open_time desc ");
			}
			list = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		}
		finally
		{
		}
		return list;
	}
	
	//获取门开关列表-数量
	public int findDoorEventCounts(HttpServletRequest request, DoorEventSearch ds)
	{
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		SessionFactory sf = hibernateTemplate.getSessionFactory();
		Session session = sf.getCurrentSession();
		Long count;
		try
		{
			StringBuffer sb = new StringBuffer();
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			if (! boxes.equals("(-1)"))
			{
				sb.append("select count(*) from DoorEvent d where d.boxinfo.is_deleted=0 and d.boxinfo.id in " + boxes + " ");
			}
			else
			{
				sb.append("select count(*) from DoorEvent d where d.boxinfo.is_deleted=0 and d.boxinfo.department.id in " + deps + " ");
			}
			if (ds.getBox_id() > 0)
			{
				sb.append(" and d.boxinfo.id = " + ds.getBox_id());
			}
			if (ds.getBox_no() != null && ! ds.getBox_no().equals(""))
			{
				sb.append(" and d.boxinfo.box_no like '%" + ds.getBox_no() + "%'");
			}
			if (ds.getAddress() != null && ! ds.getAddress().equals(""))
			{
				sb.append(" and d.boxinfo.address like '%" + ds.getAddress() + "%'");
			}
			if (ds.getController_id() > 0)
			{
				sb.append(" and d.boxinfo.controller_id = " + ds.getController_id());
			}
			if (ds.getOpen_time() != null)
			{
				sb.append(" and DateDiff(d.open_time,'" + df.format(ds.getOpen_time()) + "')=0");
			}
			if (ds.getOpen_keys() != null && ! ds.getOpen_keys().equals(""))
			{
				sb.append(" and d.open_keys like '%" + ds.getOpen_keys() + "%'");
			}
			if (ds.getOpen_operators() != null && ! ds.getOpen_operators().equals(""))
			{
				sb.append(" and d.open_operators like '%" + ds.getOpen_operators() + "%'");
			}
			if (ds.getOpen_rfids() != null && ! ds.getOpen_rfids().equals(""))
			{
				sb.append(" and d.open_rfids like '%" + ds.getOpen_rfids() + "%'");
			}
			if (ds.getClose_time() != null)
			{
				sb.append(" and DateDiff(d.close_time,'" + df.format(ds.getClose_time()) + "')=0");
			}
			if (ds.getClose_keys() != null && ! ds.getClose_keys().equals(""))
			{
				sb.append(" and d.close_keys like '%" + ds.getClose_keys() + "%'");
			}
			if (ds.getClose_operators() != null && ! ds.getClose_operators().equals(""))
			{
				sb.append(" and d.close_operators like '%" + ds.getClose_operators() + "%'");
			}
			if (ds.getClose_rfids() != null && ! ds.getClose_rfids().equals(""))
			{
				sb.append(" and d.close_rfids like '%" + ds.getClose_rfids() + "%'");
			}
			if (ds.getDepartment() != null && ! ds.getDepartment().equals(""))
			{
				sb.append(" and d.boxinfo.department.name = '" + ds.getDepartment() + "'");
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
	
	//获取告警列表
	public List<Map<String, Object>> findAlarmEventByPager(HttpServletRequest request, AlarmEventSearch ds){
		List<Map<String, Object>> list;
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		try
		{
			StringBuffer sb = new StringBuffer();
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			if (! boxes.equals("(-1)"))
			{
				sb.append("select new map(d.id as id, b.box_no as box_no, b.controller_id as controller_id, dep.name as department, d.alarm_type as alarm_type, d.alarm_time as alarm_time, d.alarm_keys as alarm_keys, d.alarm_operators as alarm_operators, d.alarm_rfids as alarm_rfids, d.remarks as remarks) from AlarmEvent d left join d.boxinfo as b left join d.boxinfo.department as dep where b.is_deleted=0 and b.id in " + boxes + " ");
			}
			else
			{
				sb.append("select new map(d.id as id, b.box_no as box_no, b.controller_id as controller_id, dep.name as department, d.alarm_type as alarm_type, d.alarm_time as alarm_time, d.alarm_keys as alarm_keys, d.alarm_operators as alarm_operators, d.alarm_rfids as alarm_rfids, d.remarks as remarks) from AlarmEvent d left join d.boxinfo as b left join d.boxinfo.department as dep where b.is_deleted=0 and dep.id in " + deps + " ");
			}
			if (ds.getBox_id() > 0)
			{
				sb.append(" and d.boxinfo.id = " + ds.getBox_id());
			}
			if (ds.getController_id() > 0)
			{
				sb.append(" and d.boxinfo.controller_id = " + ds.getController_id());
			}
			if (ds.getBox_no() != null && ! ds.getBox_no().equals(""))
			{
				sb.append(" and d.boxinfo.box_no like '%" + ds.getBox_no() + "%'");
			}
			if (ds.getDepartment() != null && ! ds.getDepartment().equals(""))
			{
				sb.append(" and d.boxinfo.department.name like '%" + ds.getDepartment() + "%'");
			}
			if (ds.getAlarm_type() != null && ! ds.getAlarm_type().equals(""))
			{
				sb.append(" and d.alarm_type like '%" + ds.getAlarm_type() + "%'");
			}
			if (ds.getAlarm_time() != null)
			{
				sb.append(" and DateDiff(d.alarm_time,'" + df.format(ds.getAlarm_time()) + "')=0");
			}
			if (ds.getAlarm_keys() != null && ! ds.getAlarm_keys().equals(""))
			{
				sb.append(" and d.alarm_keys like '%" + ds.getAlarm_keys() + "%'");
			}
			if (ds.getAlarm_operators() != null && ! ds.getAlarm_operators().equals(""))
			{
				sb.append(" and d.alarm_operators like '%" + ds.getAlarm_operators() + "%'");
			}
			if (ds.getAlarm_rfids() != null && ! ds.getAlarm_rfids().equals(""))
			{
				sb.append(" and d.alarm_rfids like '%" + ds.getAlarm_rfids() + "%'");
			}
			/*if (ds.getIs_affirmed() > 0)
			{
				sb.append(" and d.is_affirmed = " + (ds.getIs_affirmed() - 1));
			}
			if (ds.getAffirm_time() != null)
			{
				sb.append(" and DateDiff(d.affirm_time,'" + df.format(ds.getAffirm_time()) + "')=0");
			}
			if (ds.getAffirm_user() != null && ! ds.getAffirm_user().equals(""))
			{
				sb.append(" and d.affirm_user like '%" + ds.getAffirm_user() + "%'");
			}*/
			if (ds.getSort() != null && ! ds.getSort().equals(""))
			{
				sb.append(" order by d." + ds.getSort() + " " + ds.getOrder() + " ");
			}
			else
			{
				sb.append(" order by d.alarm_time desc ");
			}
			list = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		}
		finally
		{
		}
		return list;
	}
	
	//获取告警列表-数量
	public int findAlarmEventCounts(HttpServletRequest request, AlarmEventSearch ds)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory();
		Session session = sf.getCurrentSession();
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		Long count;
		try
		{
			StringBuffer sb = new StringBuffer();
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			if (! boxes.equals("(-1)"))
			{
				sb.append("select count(*) from AlarmEvent d where d.boxinfo.is_deleted=0 and d.boxinfo.id in " + boxes + " ");
			}
			else
			{
				sb.append("select count(*) from AlarmEvent d where d.boxinfo.is_deleted=0 and d.boxinfo.department.id in " + deps + " ");
			}
			if (ds.getBox_id() > 0)
			{
				sb.append(" and d.boxinfo.id = " + ds.getBox_id());
			}
			if (ds.getController_id() > 0)
			{
				sb.append(" and d.boxinfo.controller_id = " + ds.getController_id());
			}
			if (ds.getBox_no() != null && ! ds.getBox_no().equals(""))
			{
				sb.append(" and d.boxinfo.box_no like '%" + ds.getBox_no() + "%'");
			}
			if (ds.getDepartment() != null && ! ds.getDepartment().equals(""))
			{
				sb.append(" and d.boxinfo.department.name like '%" + ds.getDepartment() + "%'");
			}
			if (ds.getAlarm_type() != null && ! ds.getAlarm_type().equals(""))
			{
				sb.append(" and d.alarm_type like '%" + ds.getAlarm_type() + "%'");
			}
			if (ds.getAlarm_time() != null)
			{
				sb.append(" and DateDiff(d.alarm_time,'" + df.format(ds.getAlarm_time()) + "')=0");
			}
			if (ds.getAlarm_keys() != null && ! ds.getAlarm_keys().equals(""))
			{
				sb.append(" and d.alarm_keys like '%" + ds.getAlarm_keys() + "%'");
			}
			if (ds.getAlarm_operators() != null && ! ds.getAlarm_operators().equals(""))
			{
				sb.append(" and d.alarm_operators like '%" + ds.getAlarm_operators() + "%'");
			}
			if (ds.getAlarm_rfids() != null && ! ds.getAlarm_rfids().equals(""))
			{
				sb.append(" and d.alarm_rfids like '%" + ds.getAlarm_rfids() + "%'");
			}
			/*if (ds.getIs_affirmed() > 0)
			{
				sb.append(" and d.is_affirmed = " + (ds.getIs_affirmed() - 1));
			}
			if (ds.getAffirm_time() != null)
			{
				sb.append(" and DateDiff(d.affirm_time,'" + df.format(ds.getAffirm_time()) + "')=0");
			}
			if (ds.getAffirm_user() != null && ! ds.getAffirm_user().equals(""))
			{
				sb.append(" and d.affirm_user like '%" + ds.getAffirm_user() + "%'");
			}*/
			Query q = session.createQuery(sb.toString());
			count = (Long)q.uniqueResult();
		}
		finally
		{
			session.close();
		}
		return count.intValue();
	}
	
	//删除告警记录-数量
	public void deleteAlarmEvent(DeleteAlarmForm daf)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory();
		Session session = sf.getCurrentSession();
		for (int i = 0; i < daf.getAe().size(); i ++)
		{
			AlarmEvent ae = daf.getAe().get(i);
			Query q = session.createSQLQuery("delete from alarmevent where id = ?");
			q.setParameter(0, ae.getId());
			q.executeUpdate();
		}
	}
	
	//确认告警记录
	public void affirmAlarmEvent(AlarmEvent ae)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory();
		Session session = null;
		session = sf.getCurrentSession();
		Query q = session.createSQLQuery("update alarmevent a set a.is_affirmed = 1, a.affirm_time = now(), a.affirm_user = ? where a.id = ?");
		q.setParameter(0, ae.getAffirm_user());
		q.setParameter(1, ae.getId());
		q.executeUpdate();
	}
	
	//删除告警记录-数量
	public void deleteDoorEvent(DeleteDoorForm daf)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory();
		Session session = sf.getCurrentSession();
		for (int i = 0; i < daf.getDe().size(); i ++)
		{
			DoorEvent de = daf.getDe().get(i);
			Query q = session.createSQLQuery("delete from doorevent where id = ?");
			q.setParameter(0, de.getId());
			q.executeUpdate();
		}
	}
	
	
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
