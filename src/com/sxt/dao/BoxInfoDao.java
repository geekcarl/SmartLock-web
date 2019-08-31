package com.sxt.dao;

import java.math.BigInteger;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.hibernate.Hibernate;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.classic.Session;
import org.hibernate.transform.Transformers;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.sxt.po.BoxGlobals;
import com.sxt.po.BoxImages;
import com.sxt.po.BoxInfo;
import com.sxt.po.BoxInfoNew;
import com.sxt.po.BoxInfoOper;
import com.sxt.po.BoxInfoSearch;
import com.sxt.po.BoxModule;
import com.sxt.po.BoxSettings;
import com.sxt.po.BoxStates;
import com.sxt.po.BoxTerminal;
import com.sxt.po.BoxTerminalUsed;
import com.sxt.po.BoxVarInfo;
import com.sxt.po.Core;
import com.sxt.po.CoreNew;
import com.sxt.po.CoreUsed;
import com.sxt.po.DTO_BoxStates_Values_Levels;
import com.sxt.po.JumpCore;
import com.sxt.po.ModificationInfo;
import com.sxt.po.Opticalcable;
import com.sxt.po.OrderInfact;
import com.sxt.po.OrderRespect;
import com.sxt.po.PhoneOpenLog;
import com.sxt.po.SmsSetting;
import com.sxt.po.SmsSettingOper;
import com.sxt.po.SmsSettingSearch;
import com.sxt.po.WorkOrder;
import com.sxt.po.WorkOrderImage;
import com.sxt.po.WorkOrderNew;
import com.sxt.po.WorkOrderSearch;
import com.sxt.utils.BaiduLocation;
import com.sxt.utils.GpsToBaidu;
import com.sxt.utils.PrivilegeControl;

@Component("boxInfoDao")
public class BoxInfoDao {

	@Resource
	private HibernateTemplate hibernateTemplate;
	
	public WorkOrder findWorkorder(Integer id) {
		return this.hibernateTemplate.get(WorkOrder.class, id);
	}

	public void savephonelog(PhoneOpenLog p ){
	    	 
	     hibernateTemplate.save(p);
	    	 
	}
	  
	//findWorkorderNew
	public WorkOrderNew findWorkorderNew(Integer id) {
		
		return this.hibernateTemplate.get(WorkOrderNew.class, id);
	
	}

	public void updateWorkorder(WorkOrder wo) {
		
		StringBuffer sb = new StringBuffer("");
		
		if (wo.getReceive_operators() != null) {
			sb.append(", wo.receive_operators.id = " + wo.getReceive_operators().getId());
		}
	
		List<OrderRespect> orlist = wo.getOps();
		
		if  (orlist != null && orlist.size() > 0)
		{
			for (int i = 0; i < orlist.size(); i ++)
			{
				orlist.get(i).setOrder(wo);
				this.hibernateTemplate.save(orlist.get(i));

				/*if (order.getOps().get(i).getOrder_type() == 1) //成端
				{
					this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set backFreezed=1 where b.boxTerminal.id = ?", Integer.parseInt(order.getOps().get(i).getTerminal_id()));
					//this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_freezed=1 where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(order.getOps().get(i).getCore_id()), order.getOps().get(i).getBoxinfo().getId());
					//this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_freezed=1 where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(order.getOps().get(i).getCore_id()), order.getOps().get(i).getBoxinfo().getId());
					Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
					query.setParameter(0, Integer.parseInt(order.getOps().get(i).getCore_id()));
					query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
					query.executeUpdate();
					query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
					query.setParameter(0, Integer.parseInt(order.getOps().get(i).getCore_id()));
					query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
					query.executeUpdate();
					
				}*/
				/*else if (order.getOps().get(i).getOrder_type() == 2) //跳纤
				{
					this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set frontFreezed=frontFreezed+1 where b.boxTerminal.id = ?", Integer.parseInt(order.getOps().get(i).getA_terminal_id()));
					this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set frontFreezed=frontFreezed+1 where b.boxTerminal.id = ?", Integer.parseInt(order.getOps().get(i).getZ_terminal_id()));
					this.hibernateTemplate.bulkUpdate("update BoxTerminal b set status=4 where b.id in (?,?)", Integer.parseInt(order.getOps().get(i).getA_terminal_id()), Integer.parseInt(order.getOps().get(i).getZ_terminal_id()));
				}
				else if (order.getOps().get(i).getOrder_type() == 3) //直熔
				{
					this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_freezed=1 where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(order.getOps().get(i).getA_core_id()), order.getOps().get(i).getBoxinfo().getId());
					this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_freezed=1 where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(order.getOps().get(i).getA_core_id()), order.getOps().get(i).getBoxinfo().getId());
					this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_freezed=1 where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(order.getOps().get(i).getZ_core_id()), order.getOps().get(i).getBoxinfo().getId());
					this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_freezed=1 where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(order.getOps().get(i).getZ_core_id()), order.getOps().get(i).getBoxinfo().getId());
					Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
					query.setParameter(0, Integer.parseInt(order.getOps().get(i).getA_core_id()));
					query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
					query.executeUpdate();
					query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
					query.setParameter(0, Integer.parseInt(order.getOps().get(i).getA_core_id()));
					query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
					query.executeUpdate();
					query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
					query.setParameter(0, Integer.parseInt(order.getOps().get(i).getZ_core_id()));
					query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
					query.executeUpdate();
					query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
					query.setParameter(0, Integer.parseInt(order.getOps().get(i).getZ_core_id()));
					query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
					query.executeUpdate();
				}*/
			}
		
		}
		
		this.hibernateTemplate.bulkUpdate("update WorkOrder wo set wo.order_no = ?, wo.title = ?, wo.department.id = ?, respect_starttime = ?, respect_endtime = ?, remarks = ? " + sb.toString() + " where wo.id = ?", wo.getOrder_no(), wo.getTitle(), wo.getRespect_starttime(), wo.getRespect_endtime(), wo.getRemarks(), wo.getId());
	    
	     //修改orderrespect表的情况
		
		
	}
	
	public int addWorkorder(WorkOrder order)
	{
		order.setCreate_time(new Date());
		order.setDone_type(1);
		order.setCreate_type(2);
		this.hibernateTemplate.save(order);
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		try
		{
			if  (order.getOps() != null && order.getOps().size() > 0)
			{
				for (int i = 0; i < order.getOps().size(); i ++)
				{
					order.getOps().get(i).setOrder(order);
					this.hibernateTemplate.save(order.getOps().get(i));
					if (order.getOps().get(i).getOrder_type() == 1) //成端
					{
						this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set backFreezed=1 where b.boxTerminal.id = ?", Integer.parseInt(order.getOps().get(i).getTerminal_id()));
						//this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_freezed=1 where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(order.getOps().get(i).getCore_id()), order.getOps().get(i).getBoxinfo().getId());
						//this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_freezed=1 where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(order.getOps().get(i).getCore_id()), order.getOps().get(i).getBoxinfo().getId());
						Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
						query.setParameter(0, Integer.parseInt(order.getOps().get(i).getCore_id()));
						query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, Integer.parseInt(order.getOps().get(i).getCore_id()));
						query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
						query.executeUpdate();
						
					}
					else if (order.getOps().get(i).getOrder_type() == 2) //跳纤
					{
						this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set frontFreezed=frontFreezed+1 where b.boxTerminal.id = ?", Integer.parseInt(order.getOps().get(i).getA_terminal_id()));
						this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set frontFreezed=frontFreezed+1 where b.boxTerminal.id = ?", Integer.parseInt(order.getOps().get(i).getZ_terminal_id()));
						this.hibernateTemplate.bulkUpdate("update BoxTerminal b set status=4 where b.id in (?,?)", Integer.parseInt(order.getOps().get(i).getA_terminal_id()), Integer.parseInt(order.getOps().get(i).getZ_terminal_id()));
					}
					else if (order.getOps().get(i).getOrder_type() == 3) //直熔
					{
						/*this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_freezed=1 where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(order.getOps().get(i).getA_core_id()), order.getOps().get(i).getBoxinfo().getId());
						this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_freezed=1 where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(order.getOps().get(i).getA_core_id()), order.getOps().get(i).getBoxinfo().getId());
						this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_freezed=1 where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(order.getOps().get(i).getZ_core_id()), order.getOps().get(i).getBoxinfo().getId());
						this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_freezed=1 where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(order.getOps().get(i).getZ_core_id()), order.getOps().get(i).getBoxinfo().getId());*/
						Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
						query.setParameter(0, Integer.parseInt(order.getOps().get(i).getA_core_id()));
						query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, Integer.parseInt(order.getOps().get(i).getA_core_id()));
						query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, Integer.parseInt(order.getOps().get(i).getZ_core_id()));
						query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_freezed=1 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, Integer.parseInt(order.getOps().get(i).getZ_core_id()));
						query.setParameter(1, order.getOps().get(i).getBoxinfo().getId());
						query.executeUpdate();
					}
				}
			}
		}
		finally {
			//session.close();
		}
		return 1;
	}
	
	
	
	//通过id找到boxterminal对象‘
	public List<BoxTerminal> findboxterminal1(int aid ,int zid){
		
		List<BoxTerminal> bts = this.hibernateTemplate.find("from BoxTerminal b where  b.id in (?,?) and b.boxterminalused.frontFreezed=0 and b.boxterminalused.frontUsed=0", aid,zid);
	
	    return bts;
	
	}
	
	//通过id找到boxterminal对象‘
	public List<BoxTerminal> findboxterminal2(int aid ,int zid){
			
		List<BoxTerminal> bts = this.hibernateTemplate.find("from BoxTerminal b where  b.id in (?,?) and b.boxterminalused.frontFreezed=0 and b.boxterminalused.frontUsed!=0", aid,zid);
		
		return bts;
		
     }
		
		
	//同步到端子和纤芯状态字段中
	public int finishWorkOrder(int id, int userid)
	{
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		//获取计划
		List<OrderRespect> ops = this.hibernateTemplate.find("from OrderRespect o where o.order.id = ?", id);
		//恢复冻结状态
		if  (ops != null && ops.size() > 0)
		{
			for (int i = 0; i < ops.size(); i ++)
			{
				if (ops.get(i).getOrder_type() == 1) //成端
				{
					this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set backFreezed=0 where b.boxTerminal.id = ?", Integer.parseInt(ops.get(i).getTerminal_id()));
					//this.hibernateTemplate.bulkUpdate("update CoreUsed c set a_freezed=0 where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(ops.get(i).getCore_id()), ops.get(i).getBoxinfo().getId());
					//this.hibernateTemplate.bulkUpdate("update CoreUsed c set z_freezed=0 where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(ops.get(i).getCore_id()), ops.get(i).getBoxinfo().getId());
					Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_freezed=0 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
					query.setParameter(0, Integer.parseInt(ops.get(i).getCore_id()));
					query.setParameter(1, ops.get(i).getBoxinfo().getId());
					query.executeUpdate();
					query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_freezed=0 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
					query.setParameter(0, Integer.parseInt(ops.get(i).getCore_id()));
					query.setParameter(1, ops.get(i).getBoxinfo().getId());
					query.executeUpdate();
				}
				else if (ops.get(i).getOrder_type() == 2) //跳纤
				{
					
					this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set frontFreezed=frontFreezed-1 where b.boxTerminal.id in (?, ?)", Integer.parseInt(ops.get(i).getA_terminal_id()), Integer.parseInt(ops.get(i).getZ_terminal_id()));
					
					List<BoxTerminal> bts = this.findboxterminal1(Integer.parseInt(ops.get(i).getA_terminal_id()), Integer.parseInt(ops.get(i).getZ_terminal_id()));
					
					for (BoxTerminal boxTerminal : bts) {
						
						boxTerminal.setStatus(1);
						this.hibernateTemplate.update(boxTerminal);
					}
					
					
                    List<BoxTerminal> bts2 = this.findboxterminal2(Integer.parseInt(ops.get(i).getA_terminal_id()), Integer.parseInt(ops.get(i).getZ_terminal_id()));
					
					for (BoxTerminal boxTerminal : bts2) {
						
						boxTerminal.setStatus(2);
						this.hibernateTemplate.update(boxTerminal);
					}
					
					
					
					//	this.hibernateTemplate.bulkUpdate("update BoxTerminal b set b.status = 1 where b.id in (?,?) and b.boxterminalused.frontFreezed=0 and b.boxterminalused.frontUsed=0", Integer.parseInt(ops.get(i).getA_terminal_id()), Integer.parseInt(ops.get(i).getZ_terminal_id()));
					//this.hibernateTemplate.bulkUpdate("update BoxTerminal b set b.status = 2 where b.id in (?,?) and b.boxterminalused.frontFreezed=0 and b.boxterminalused.frontUsed!=0", Integer.parseInt(ops.get(i).getA_terminal_id()), Integer.parseInt(ops.get(i).getZ_terminal_id()));
				
				}
				else if (ops.get(i).getOrder_type() == 3) //直熔
				{
					/*this.hibernateTemplate.bulkUpdate("update CoreUsed c set a_freezed=0 where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(ops.get(i).getA_core_id()), ops.get(i).getBoxinfo().getId());
					this.hibernateTemplate.bulkUpdate("update CoreUsed c set z_freezed=0 where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(ops.get(i).getA_core_id()), ops.get(i).getBoxinfo().getId());
					this.hibernateTemplate.bulkUpdate("update CoreUsed c set a_freezed=0 where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(ops.get(i).getZ_core_id()), ops.get(i).getBoxinfo().getId());
					this.hibernateTemplate.bulkUpdate("update CoreUsed c set z_freezed=0 where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(ops.get(i).getZ_core_id()), ops.get(i).getBoxinfo().getId());*/
					Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_freezed=0 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
					query.setParameter(0, Integer.parseInt(ops.get(i).getA_core_id()));
					query.setParameter(1, ops.get(i).getBoxinfo().getId());
					query.executeUpdate();
					query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_freezed=0 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
					query.setParameter(0, Integer.parseInt(ops.get(i).getA_core_id()));
					query.setParameter(1, ops.get(i).getBoxinfo().getId());
					query.executeUpdate();
					query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_freezed=0 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
					query.setParameter(0, Integer.parseInt(ops.get(i).getZ_core_id()));
					query.setParameter(1, ops.get(i).getBoxinfo().getId());
					query.executeUpdate();
					query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_freezed=0 where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
					query.setParameter(0, Integer.parseInt(ops.get(i).getZ_core_id()));
					query.setParameter(1, ops.get(i).getBoxinfo().getId());
					query.executeUpdate();
				}
			}
		}
		//获取实际上传的任务情况
		List<OrderInfact> ois = this.hibernateTemplate.find("from OrderInfact o where o.order.id = ?", id);
		//修改端子和纤芯的状态
		if  (ois != null && ois.size() > 0)
		{
			for (int i = 0; i < ois.size(); i ++)
			{
				if (ois.get(i).getOrder_type() == 1) //成端操作
				{
					if (ois.get(i).getOperate_type() == 1) //安装
					{
						this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set b.backUsed=1, b.backCore.id=? where b.boxTerminal.id = ?", ois.get(i).getCore().getId(), ois.get(i).getTerminal().getId());
						//this.hibernateTemplate.bulkUpdate("update CoreUsed c set a_type=2, c.a_terminal.id=? where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(ops.get(i).getTerminal_id()), Integer.parseInt(ops.get(i).getCore_id()), ops.get(i).getBoxinfo().getId());
						//this.hibernateTemplate.bulkUpdate("update CoreUsed c set z_type=2, c.z_terminal.id=? where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(ops.get(i).getTerminal_id()), Integer.parseInt(ops.get(i).getCore_id()), ops.get(i).getBoxinfo().getId());
						Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_type=2, c.a_terminal_id=? where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
						query.setParameter(0, ois.get(i).getTerminal().getId());
						query.setParameter(1, ois.get(i).getCore().getId());
						query.setParameter(2, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_type=2, c.z_terminal_id=? where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, ois.get(i).getTerminal().getId());
						query.setParameter(1, ois.get(i).getCore().getId());
						query.setParameter(2, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
					}
					else
					{
						this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed b set b.backUsed=0, b.backCore.id=NULL where b.boxTerminal.id = ?", ois.get(i).getCore().getId(), ois.get(i).getTerminal().getId());
						Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_type=0, c.a_terminal_id=NULL where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
						query.setParameter(0, ois.get(i).getCore().getId());
						query.setParameter(1, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_type=0, c.z_terminal_id=NULL where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, ois.get(i).getCore().getId());
						query.setParameter(1, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
					}
				}
				else if (ois.get(i).getOrder_type() == 2) //跳纤操作
				{
					if (ois.get(i).getOperate_type() == 1) //安装
					{
						this.jumpTerminal(ois.get(i).getA_terminal().getId(), ois.get(i).getZ_terminal().getId());
						this.hibernateTemplate.bulkUpdate("update BoxTerminal b set b.status=2 where b.id in (?,?) and b.boxterminalused.frontFreezed=0", ois.get(i).getA_terminal().getId(), ois.get(i).getZ_terminal().getId());
					}
					else //解除安装
					{
						this.relieveJumpTerminal(ois.get(i).getA_terminal().getId(), ois.get(i).getZ_terminal().getId());
						this.hibernateTemplate.bulkUpdate("update BoxTerminal b set b.status=1 where b.id in (?,?) and b.boxterminalused.frontUsed=0 and b.boxterminalused.frontFreezed=0", ois.get(i).getA_terminal().getId(), ois.get(i).getZ_terminal().getId());
					}
				}
				else if (ois.get(i).getOrder_type() == 3) //直熔操作
				{
					if (ois.get(i).getOperate_type() == 1)
					{
						/*this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_type=3, c.a_core.id=? where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(ops.get(i).getZ_core_id()), Integer.parseInt(ops.get(i).getA_core_id()), ops.get(i).getBoxinfo().getId());
						this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_type=3, c.z_core.id=? where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(ops.get(i).getZ_core_id()), Integer.parseInt(ops.get(i).getA_core_id()), ops.get(i).getBoxinfo().getId());
						this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_type=3, c.a_core.id=? where c.core.id = ? and c.core.opticalcable.start_box.id = ?", Integer.parseInt(ops.get(i).getA_core_id()), Integer.parseInt(ops.get(i).getZ_core_id()), ops.get(i).getBoxinfo().getId());
						this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_type=3, c.z_core.id=? where c.core.id = ? and c.core.opticalcable.end_box.id = ?", Integer.parseInt(ops.get(i).getA_core_id()), Integer.parseInt(ops.get(i).getZ_core_id()), ops.get(i).getBoxinfo().getId());*/
						Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_type=3, c.a_core_id=? where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
						query.setParameter(0, ois.get(i).getZ_core().getId());
						query.setParameter(1, ois.get(i).getA_core().getId());
						query.setParameter(2, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_type=3, c.z_core_id=? where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, ois.get(i).getZ_core().getId());
						query.setParameter(1, ois.get(i).getA_core().getId());
						query.setParameter(2, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_type=3, c.a_core_id=? where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
						query.setParameter(0, ois.get(i).getA_core().getId());
						query.setParameter(1, ois.get(i).getZ_core().getId());
						query.setParameter(2, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_type=3, c.z_core_id=? where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, ois.get(i).getA_core().getId());
						query.setParameter(1, ois.get(i).getZ_core().getId());
						query.setParameter(2, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
					}
					else
					{
						Query query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_type=0, c.a_core_id=NULL where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
						query.setParameter(0, ois.get(i).getA_core().getId());
						query.setParameter(1, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_type=0, c.z_core_id=NULL where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, ois.get(i).getA_core().getId());
						query.setParameter(1, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.a_type=0, c.a_core_id=NULL where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.start_box_id = ?");
						query.setParameter(0, ois.get(i).getZ_core().getId());
						query.setParameter(1, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
						query = session.createSQLQuery("update core_used c, core co, opticalcable o set c.z_type=0, c.z_core_id=NULL where c.core_id=co.id and co.opticalcable_id = o.id and co.id=? and o.end_box_id = ?");
						query.setParameter(0, ois.get(i).getZ_core().getId());
						query.setParameter(1, ois.get(i).getBoxinfo().getId());
						query.executeUpdate();
					}
				}
			}
		}
		this.hibernateTemplate.bulkUpdate("update WorkOrder wo set wo.is_upload=1, upload_time=now(), upload_user_id=? where wo.id=?", userid, id);
		return 1;
	}
	
	//修改端子业务信息
	public int updateLabelInfo(int id, String info)
	{
		return this.hibernateTemplate.bulkUpdate("update BoxTerminal bt set bt.label_info = ? where bt.id = ?", info, id);
	}
	
	//删除面板
	public int deleteModule(int id)
	{
		
		List<BoxTerminalUsed> temp = this.hibernateTemplate.find("from BoxTerminalUsed bt where bt.boxTerminal.boxModule.id = ? and (bt.frontUsed = 1 or bt.frontFreezed = 1 or bt.backUsed = 1 or bt.backFreezed = 1)", id);
		if (temp.size() <= 0)
		{
			this.hibernateTemplate.bulkUpdate("delete from BoxTerminal bt where bt.boxModule.id = ?", id);
			this.hibernateTemplate.bulkUpdate("delete from BoxModule bm where bm.id = ?", id);
		}
		else
		{
			return 0;
		}
		return 1;
	
	}
	
	//删除面板一行
	public int deleteRow(int id, int row)
	{
		List<BoxTerminalUsed> temp = this.hibernateTemplate.find("from BoxTerminalUsed bt where bt.boxTerminal.boxModule.id = ? and bt.boxTerminal.row = ? and (bt.frontUsed = 1 or bt.frontFreezed = 1 or bt.backUsed = 1 or bt.backFreezed = 1)", id, row);
		if (temp.size() <= 0)
		{
			this.hibernateTemplate.bulkUpdate("delete from BoxTerminal bt where bt.boxModule.id = ? and bt.row = ?", id, row);
		}
		else
		{
			return 0;
		}
		return 1;
	}
	
	//添加面板一行
	public int addRow(int id, int row)
	{
		BoxModule bm = this.hibernateTemplate.get(BoxModule.class, id);
		for (int i = 0; i < bm.getCols(); i ++)
		{
			BoxTerminal bt = new BoxTerminal();
			bt.setBoxInfo(bm.getBoxInfo());
			bt.setBoxModule(bm);
			bt.setCol(i + 1);
			bt.setName(bm.getBoxInfo().getBox_no() + "_" + bm.getSideName() + "面_" + row + "行_" + (i + 1) + "列");
			bt.setRow(row);
			bt.setSideName(bm.getSideName());
			bt.setStatus(1);
			this.hibernateTemplate.save(bt);
			BoxTerminalUsed btu = new BoxTerminalUsed();
			btu.setBoxTerminal(bt);
			this.hibernateTemplate.save(btu);
		}
		return 1;
	}
	
	//添加面板
	public int addModule(BoxModule bm)
	{
		if (bm.getBoxInfo() != null)
		{
			BoxInfo temp = this.hibernateTemplate.get(BoxInfo.class, bm.getBoxInfo().getId());
			bm.setName(temp.getBox_no() + bm.getSideName() + "_面");
			this.hibernateTemplate.save(bm);
		}
		else
		{
			return 0;
		}
		return 1;
	}
	
	public void smsset(SmsSettingOper sso) {
		for (int i = 0; i < sso.getBis().size(); i ++)
		{
			for (int j = 0; j < sso.getSvs().size(); j ++)
			{
				for (int k = 0; k < sso.getUs().size(); k ++)
				{
					SmsSetting ss = new SmsSetting();
					ss.setBox(sso.getBis().get(i));
					ss.setStateValue(sso.getSvs().get(j));
					ss.setUser(sso.getUs().get(k));
					ss.setRemarks(sso.getRemarks());
					List<Map<String, Object>> result = null;
					if (ss.getBox() != null && ss.getStateValue() != null && ss.getUser() != null) {
						result = this.findSmsset(ss);
						if (result == null || result.size() <= 0 || result.isEmpty()) {
							this.hibernateTemplate.save(ss);
						}
						result = null;
					}
				}
			}
		}
	}
	
	public List<Map<String, Object>> findSmsset(SmsSetting ss) {
		String sql = "select new map(s.id as id) from SmsSetting s where s.box.id = " + ss.getBox().getId() + " and s.stateValue.id = " + ss.getStateValue().getId() + " and s.user.id = " + ss.getUser().getId();
		return this.hibernateTemplate.find(sql);
	}
	
	public void deleteSmsSetting(int[] ss)
	{
		for (int i = 0; i < ss.length; i ++)
		{
			SmsSetting s = this.hibernateTemplate.get(SmsSetting.class, ss[i]);
			this.hibernateTemplate.delete(s);
		}
	}
	
	//获取短信设置分页
	public List<Map<String, Object>> findSmsSettingByPager(HttpServletRequest request, SmsSettingSearch ds){
		
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		
		StringBuffer sb = new StringBuffer();
		
		//注意添加光交箱权限过滤
		if(! boxes.equals("(-1)")){
			sb.append("select new map(s.id as id, s.box.box_no as box, s.stateValue.state_value as stateValue, s.user.user_name as user_name, s.user.full_name as full_name,s.user.phone_no as phone_no, s.remarks as remarks) from SmsSetting s where 0=0 and s.box.id in " + boxes + " ");
		}
		else
		{
			sb.append("select new map(s.id as id, s.box.box_no as box, s.stateValue.state_value as stateValue, s.user.user_name as user_name, s.user.full_name as full_name,s.user.phone_no as phone_no, s.remarks as remarks) from SmsSetting s where 0=0 and s.box.department.id in " + deps + " ");
			
		}
		
		if (ds.getUser_name() != null && ! ds.getUser_name().equals(""))
		{
			sb.append(" and s.user.user_name like '%" + ds.getUser_name() + "%'");
		}
		if (ds.getType() != null && ! ds.getType().equals(""))
		{
			sb.append(" and s.stateValue.state_value like '%" + ds.getType() + "%'");
		}
		if (ds.getBoxno() != null && ! ds.getBoxno().equals(""))
		{
			sb.append(" and s.box.box_no like '%" + ds.getBoxno() + "%'");
		}
		if (ds.getControllerid() != null && ! ds.getControllerid().equals(""))
		{
			sb.append(" and s.box.controller_id = " + ds.getControllerid() + "");
		}
		if (ds.getDep() != null && ! ds.getDep().equals(""))
		{
			sb.append(" and s.box.department_id = "+ ds.getDep() + "");
		}
		if (ds.getSort() != null && ! ds.getSort().equals(""))
		{
			sb.append(" order by s." + ds.getSort() + " " + ds.getOrder() + " ");
		}
		
		List<Map<String, Object>> d = this.getListForPage(sb.toString(), (ds.getPage() - 1) * ds.getRows(), ds.getRows());
		return d;
	}
	
	//获取短信设置数量
	public int findSmsSettingCounts(HttpServletRequest request, SmsSettingSearch ds)
	{
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		StringBuffer sb = new StringBuffer();
		Long count = new Long(0);
		Session session = sf.getCurrentSession();
		try
		{
			if(! boxes.equals("(-1)")){
				sb.append("select count(*) from SmsSetting s where 0=0 and s.box.id in " + boxes + " ");
			}
			else
			{
				sb.append("select count(*) from SmsSetting s where 0=0 and s.box.department.id in " + deps + " ");
			}
			
			if (ds.getUser_name() != null && ! ds.getUser_name().equals(""))
			{
				sb.append(" and s.user.user_name like '%" + ds.getUser_name() + "%'");
			}
			if (ds.getType() != null && ! ds.getType().equals(""))
			{
				sb.append(" and s.stateValue.state_value like '%" + ds.getType() + "%'");
			}
			if (ds.getBoxno() != null && ! ds.getBoxno().equals(""))
			{
				sb.append(" and s.box.box_no like '%" + ds.getBoxno() + "%'");
			}
			if (ds.getControllerid() != null && ! ds.getControllerid().equals(""))
			{
				sb.append(" and s.box.controller_id = " + ds.getControllerid() + "");
			}
			if (ds.getDep() != null && ! ds.getDep().equals(""))
			{
				sb.append(" and s.box.department_id = "+ ds.getDep() + "");
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
	
	public BoxSettings getBoxSettings(int id){
		BoxSettings bs = null;
		List<BoxSettings> bss = this.hibernateTemplate.find("from BoxSettings bs where bs.boxinfo.id = ?", id);
		if (bss.size() > 0) bs = bss.get(0);
		return bs;
	}
	
	public ModificationInfo getBoxModifi(int id){
		ModificationInfo mi = null;
		List<ModificationInfo> mis = this.hibernateTemplate.find("from ModificationInfo mi where mi.boxinfo.id = ?", id);
		if (mis.size() > 0) mi = mis.get(0);
		return mi;
	}
	
	public void updateBoxSettings(BoxSettings bs){
		if (bs.getFlag() != 0)
		{
			BoxGlobals bg = this.getBoxGlobals();
			bs.setHb_interval(bg.getHb_interval());
			bs.setVolt_threshold(bg.getVolt_threshold());
			bs.setAngle_threshold(bg.getAngle_threshold());
			bs.setHigh_t_threshold(bg.getHigh_t_threshold());
			bs.setLow_t_threshold(bg.getLow_t_threshold());
			bs.setLowpower_period(bg.getLowpower_period());
			bs.setLowpower_periodpercent(bg.getLowpower_periodpercent());
			bs.setShake_peroid(bg.getShake_peroid());
			bs.setShake_frequency(bg.getShake_frequency());
			bs.setShake_time(bg.getShake_time());
			bs.setLastedittime(new Date());
		}
		this.hibernateTemplate.update(bs);
	}
	
	public void updateBoxModifi(ModificationInfo mi){
		if (mi.getFlag() != 0)
		{
			BoxGlobals bg = this.getBoxGlobals();
			mi.setShake_threshold(bg.getShake_threshold());
			mi.setShake_rate(bg.getShake_rate());
			mi.setCenter_ip(bg.getCenter_ip());
			mi.setCenter_upd_port(bg.getCenter_upd_port());
			mi.setIs_send(0);
			mi.setLastedittime(new Date());
		}
		else {
			mi.setIs_send(1);
		}
		this.hibernateTemplate.update(mi);
	}
	
	public List<BoxImages> getBoxImages(int id)
	{
		return (List<BoxImages>)this.hibernateTemplate.find("from BoxImages bi where bi.boxinfo.id = ?", id);
	}
	
	//删除光交箱图片
		public void deleteimage(int id)
		{
			
	       this.hibernateTemplate.bulkUpdate("delete from BoxImages bt where bt.id = ? ", id);
			
			
		}
	
	public List<WorkOrderImage> getOrderImages(int id)
	{
		return (List<WorkOrderImage>)this.hibernateTemplate.find("from WorkOrderImage woi where woi.order.id = ?", id);
	}
	
	public BoxGlobals getBoxGlobals()
	{
		BoxGlobals bg = null;
		List<BoxGlobals> bgs = this.hibernateTemplate.find("from BoxGlobals bg");
		if (bgs.size() > 0)
		{
			bg = bgs.get(0);
		}
		return bg;
	}
	
	public void updateBoxGlobals(BoxGlobals bg)
	{
		if (bg.getId() > 0)
		{
			this.hibernateTemplate.update(bg);
		}
		else
		{
			this.hibernateTemplate.save(bg);
		}
	}
	
	//添加光交箱
	public BoxInfo add(BoxInfoOper bio){
		int i, j, k;
		BoxInfo b = new BoxInfo();
		List<BoxInfo> temp = this.hibernateTemplate.find("from BoxInfo b where ( b.box_no = ? or b.controller_id = ?) and b.is_deleted = 0", bio.getBox_no(), bio.getController_id());
		if (temp.size() <= 0)
		{
			//保存基本信息
			b.setBox_no(bio.getBox_no());
			b.setController_id(bio.getController_id());
			b.setAddress(bio.getAddress());
			b.setBusiness_area(bio.getBusiness_area());
			b.setSim_phone_no(bio.getSim_phone_no());
			b.setLongitude(bio.getLongitude());
			b.setLatitude(bio.getLatitude());
			b.setDepartment(bio.getDepartment());
			b.setBox_type(bio.getBox_type());
			BaiduLocation bl = new BaiduLocation();
			bl.setGpsx(bio.getLongitude());
			bl.setGpsy(bio.getLatitude());
			if (GpsToBaidu.GetBaiduLocation(bl))
			{
				b.setB_longitude(bl.getBaidux());
				b.setB_latitude(bl.getBaiduy());
			}
			b.setK_code(bio.getK_code());
			b.setWorkorder_department(bio.getWorkorder_department());
			b.setWorkorder_receive_id(bio.getWorkorder_receive_id());
			b.setSms_notifiable(bio.getSms_notifiable());
			b.setSms_reason(bio.getSms_reason());
			if (b.getController_id() != 0)
			{
				b.setUse_state(3);
			}
			else
			{
				b.setUse_state(1);
			}
			b.setIs_deleted(0);
			b.setLastedituser(bio.getLastedituser());
			b.setLastedittime(new Date());
			b.setRemarks(bio.getRemarks());
//			if (bio.getBoxModules() != null)
//			{
//				Set<BoxModule> s_bm = new HashSet<BoxModule>();
//				s_bm.addAll(bio.getBoxModules());
//				b.setBoxModules(s_bm);
//			}
			hibernateTemplate.save(b);
			//保存动态信息
			BoxVarInfo bvi = new BoxVarInfo();
			bvi.setBoxInfo(b);
			this.hibernateTemplate.save(bvi);
			//保存设置值
			BoxGlobals bg = null;
			if (bio.getBox_setting_flag() != 0 || bio.getModificationInfo_flag() != 0)
			{
				bg = this.getBoxGlobals();
			}
			BoxSettings bs = new BoxSettings();
			bs.setBoxinfo(b);
			bs.setFlag(bio.getBox_setting_flag());
			if (bio.getBox_setting_flag() != 0 && bg != null)
			{
				bs.setHb_interval(bg.getHb_interval());
				bs.setVolt_threshold(bg.getVolt_threshold());
				bs.setAngle_threshold(bg.getAngle_threshold());
				bs.setHigh_t_threshold(bg.getHigh_t_threshold());
				bs.setLow_t_threshold(bg.getLow_t_threshold());
				bs.setLowpower_period(bg.getLowpower_period());
				bs.setLowpower_periodpercent(bg.getLowpower_periodpercent());
				bs.setShake_peroid(bg.getShake_peroid());
				bs.setShake_frequency(bg.getShake_frequency());
				bs.setShake_time(bg.getShake_time());
				bs.setUser(b.getLastedituser());
				bs.setLastedittime(new Date());
			}
			this.hibernateTemplate.save(bs);
			//保存下发设置
			ModificationInfo mi = new ModificationInfo();
			mi.setBoxinfo(b);
			mi.setFlag(bio.getModificationInfo_flag());
			if (bio.getModificationInfo_flag() != 0 && bg != null)
			{
				mi.setShake_threshold(bg.getShake_threshold());
				mi.setShake_rate(bg.getShake_rate());
				mi.setCenter_ip(bg.getCenter_ip());
				mi.setCenter_upd_port(bg.getCenter_upd_port());
				mi.setIs_send(0);
				mi.setUser(b.getLastedituser());
				mi.setLastedittime(new Date());
			}
			this.hibernateTemplate.save(mi);
			//保存面板以及端子
//			if (b.getBoxModules() != null) 
//			{
//				for (BoxModule bm : b.getBoxModules())
//				{
//					//保存面板
//					bm.setBoxInfo(b);
//					bm.setName(b.getBox_name() + "_" + bm.getSideName() + "面");
//					hibernateTemplate.save(bm);
//					for (j = 0; j < bm.getRows(); j ++)
//					{
//						for (k = 0; k < bm.getCols(); k ++)
//						{
//							//保存端子
//							BoxTerminal bt = new BoxTerminal();
//							bt.setBoxInfo(b);
//							bt.setBoxModule(bm);
//							bt.setSideName(bm.getSideName());
//							bt.setName(b.getBox_name() + "_" + bm.getSideName() + "面_" + (j + 1) + "行_" + (k + 1) + "列");
//							bt.setRow(j + 1);
//							bt.setCol(k + 1);
//							bt.setStatus(1);
//							this.hibernateTemplate.save(bt);
//							//保存端子使用
//							BoxTerminalUsed btu = new BoxTerminalUsed();
//							btu.setBoxTerminal(bt);
//							this.hibernateTemplate.save(btu);
//						}
//					}
//				}
//			}
		}
		else
		{
			return null;
		}
		return b;
	}
	
	//分页查询
	public List<BoxInfo> findByPager(HttpServletRequest request, BoxInfoSearch bis){
		StringBuffer sb = new StringBuffer();
		String boxes = PrivilegeControl.getBoxes(request);
		sb.append("from BoxInfo b where b.is_deleted=0 and b.id in " + boxes + " ");
		if (bis.getController_id() > 0)
		{
			sb.append(" and b.controller_id = " + bis.getController_id() + " ");
		}
		if (bis.getBox_no() != null && ! bis.getBox_no().equals(""))
		{
			sb.append(" and b.box_no like '%" + bis.getBox_no() + "%' ");
		}
		if (bis.getAddress() != null && ! bis.getAddress().equals(""))
		{
			sb.append(" and b.address like '%" + bis.getAddress() + "%' ");
		}
		if (bis.getDepartment_name() != null && ! bis.getDepartment_name().equals(""))
		{
			sb.append(" and b.department.name like '%" + bis.getDepartment_name() + "%' ");
		}
		if (bis.getBox_type() != null && ! bis.getBox_type().equals(""))
		{
			sb.append(" and b.box_type like '%" + bis.getBox_type() + "%' ");
		}
		if (bis.getSim_phone_no() != null && ! bis.getSim_phone_no().equals(""))
		{
			sb.append(" and b.sim_phone_no like '%" + bis.getSim_phone_no() + "%' ");
		}
		if (bis.getLocks_count() > 0)
		{
			sb.append(" and b.locks_count = " + bis.getLocks_count() + " ");
		}
		if (bis.getSort() != null && ! bis.getSort().equals(""))
		{
			sb.append("order by b." + bis.getSort() + " " + bis.getOrder() + " ");
		}
		List<BoxInfo> b = this.getListForPage(sb.toString(), (bis.getPage() - 1) * bis.getRows(), bis.getRows());
		/*for (int i = 0; i < b.size(); i ++)
		{
			List<BoxModule> bm = this.hibernateTemplate.find("from BoxModule bm where bm.boxInfo.id = " + b.get(i).getId());
			Set<BoxModule> s_bm = new HashSet<BoxModule>();
			s_bm.addAll(bm);
			b.get(i).setBoxModules(s_bm);
		}*/
		return b;
	}
	
	//获取某部门下的光交箱
	public List<BoxInfoNew> findAllByDepartmentId(HttpServletRequest request, int id)
	{
		String boxes = PrivilegeControl.getBoxes(request);
		List<BoxInfoNew> bi = this.hibernateTemplate.find("from BoxInfoNew b where b.is_deleted=0 and b.id in " + boxes + " and b.department_id = ?", id);
		return bi;
	}
	
	public List<Map<String, Object>> findByDepartmentId(HttpServletRequest request, Integer id, String box_no, Long controller_id)
	{
		
		String boxes = PrivilegeControl.getBoxes(request);
		String deps=PrivilegeControl.getDepartments(request);
		StringBuffer sb = new StringBuffer();
		
		if (! boxes.equals("(-1)")) 
		{
			sb.append("select b.id as id, (select DATE_FORMAT(bv.last_heard,'%Y-%m-%d %k:%i:%s') from boxvarinfo bv where bv.box_id = b.id ) as last_heard , b.box_no as box_no, b.controller_id as controller_id, b.controller_version as controller_version, b.box_name as box_name, b.address as address, b.business_area as business_area, b.sim_phone_no as sim_phone_no, b.longitude as longitude, b.latitude as latitude, b.box_type as box_type, b.locks_count as locks_count, d.name as dep_name, b.b_longitude as b_longitude, b.b_latitude as b_latitude, b.remarks as remarks, (select bm.dbm from BoxMeasures bm where bm.box_id = b.id order by bm.update_time desc limit 0,1) as dbm from boxinfo b, department d  where b.department_id = d.id and b.is_deleted=0 and b.id in " + boxes + " ");
		}
		else
		{
			sb.append("select b.id as id, (select DATE_FORMAT(bv.last_heard,'%Y-%m-%d %k:%i:%s') from boxvarinfo bv where bv.box_id = b.id ) as last_heard , b.box_no as box_no, b.controller_id as controller_id, b.controller_version as controller_version, b.box_name as box_name, b.address as address, b.business_area as business_area, b.sim_phone_no as sim_phone_no, b.longitude as longitude, b.latitude as latitude, b.box_type as box_type, b.locks_count as locks_count, d.name as dep_name, b.b_longitude as b_longitude, b.b_latitude as b_latitude, b.remarks as remarks, (select bm.dbm from BoxMeasures bm where bm.box_id = b.id order by bm.update_time desc limit 0,1) as dbm from boxinfo b, department d  where b.department_id = d.id  and b.is_deleted=0 and d.id in " + deps + " ");
		}
		
		if (id != null && id != 0) sb.append(" and b.department_id = " + id + " ");
		if (box_no != null && ! box_no.equals("")) sb.append(" and b.box_no like '%" + box_no + "%' ");
		if (controller_id != null && controller_id != 0) sb.append(" and b.controller_id = " + controller_id + " ");
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		List<Map<String, Object>> bs;
		try {
			
			Query query = session.createSQLQuery(sb.toString())
				.addScalar("id", Hibernate.INTEGER)
				.addScalar("last_heard", Hibernate.STRING)
				.addScalar("box_no", Hibernate.STRING)
				.addScalar("controller_id", Hibernate.BIG_INTEGER)
				.addScalar("controller_version", Hibernate.STRING)
				.addScalar("box_name", Hibernate.STRING)
				.addScalar("address", Hibernate.STRING)
				.addScalar("business_area", Hibernate.STRING)
				.addScalar("sim_phone_no", Hibernate.STRING)
				.addScalar("longitude", Hibernate.DOUBLE)
				.addScalar("latitude", Hibernate.DOUBLE)
				.addScalar("box_type", Hibernate.STRING)
				.addScalar("locks_count", Hibernate.INTEGER)
				.addScalar("dep_name", Hibernate.STRING)
				.addScalar("b_longitude", Hibernate.DOUBLE)
				.addScalar("b_latitude", Hibernate.DOUBLE)
				.addScalar("remarks", Hibernate.STRING)
				.addScalar("dbm", Hibernate.DOUBLE)
				.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
			bs = query.list();
		}
		finally {
			session.close();
		}
		return bs;
	}
	
	//获取某光交箱
	public BoxInfoOper find(int id)
	{
		BoxInfo b = hibernateTemplate.get(BoxInfo.class, id);
		BoxSettings bs = null;
		List<BoxSettings> bs_temp = hibernateTemplate.find("from BoxSettings bs where bs.boxinfo.id = ?", id);
		if (bs_temp.size() > 0) bs = bs_temp.get(0);
		ModificationInfo mi = null;
		List<ModificationInfo> mi_temp = hibernateTemplate.find("from ModificationInfo mi where mi.boxinfo.id = ?", id);
		if (mi_temp.size() > 0) mi = mi_temp.get(0);
		BoxInfoOper bo = new BoxInfoOper();
		bo.setBox_setting_flag(bs != null ? bs.getFlag() : 1);
		bo.setModificationInfo_flag(mi != null ? mi.getFlag() : 1);
		bo.setId(b.getId());
		bo.setBox_no(b.getBox_no());
		bo.setController_id(b.getController_id());
		bo.setAddress(b.getAddress());
		bo.setBusiness_area(b.getBusiness_area());
		bo.setSim_phone_no(b.getSim_phone_no());
		bo.setLongitude(b.getLongitude());
		bo.setLatitude(b.getLatitude());
		bo.setDepartment(b.getDepartment());
		bo.setBox_type(b.getBox_type());
		bo.setB_longitude(b.getB_longitude());
		bo.setB_latitude(b.getB_latitude());
		bo.setK_code(b.getK_code());
		bo.setWorkorder_department(b.getWorkorder_department());
		bo.setWorkorder_receive_id(b.getWorkorder_receive_id());
		bo.setSms_notifiable(b.getSms_notifiable());
		bo.setSms_reason(b.getSms_reason());
		bo.setRemarks(b.getRemarks());
		List<BoxStates> bss = new ArrayList<BoxStates>();
		bss.addAll(b.getBoxStates());
		bo.setBoxStates(bss);
		List<BoxModule> bms = new ArrayList<BoxModule>();
		bms.addAll(b.getBoxModules());
		bo.setBoxModules(bms);
		return bo;
	}
	
	
	//获取所有光交箱
	public List<Map<String, Object>> findAllBoxInfo() {
		return this.hibernateTemplate.find("select new map(b.id as id) from BoxInfo b");
	}
	
	//查询列表
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> findAll(HttpServletRequest request, BoxInfoSearch bis){
	
		String boxes = PrivilegeControl.getBoxes(request);
		String deps=PrivilegeControl.getDepartments(request);
		StringBuffer sb = new StringBuffer();
		
		if (! boxes.equals("(-1)")) 
		{
			sb.append("select b.id as id, (select DATE_FORMAT(bv.last_heard,'%Y-%m-%d %k:%i:%s') from boxvarinfo bv where bv.box_id = b.id ) as last_heard , b.box_no as box_no, b.controller_id as controller_id, b.controller_version as controller_version, b.box_name as box_name, b.address as address, b.business_area as business_area, b.sim_phone_no as sim_phone_no, b.longitude as longitude, b.latitude as latitude, b.box_type as box_type, b.locks_count as locks_count, d.name as dep_name,d.id as dep_id , b.b_longitude as b_longitude, b.b_latitude as b_latitude, b.remarks as remarks, (select bm.dbm from BoxMeasures bm where bm.box_id = b.id order by bm.update_time desc limit 0,1) as dbm from boxinfo b, department d  where b.department_id = d.id and b.is_deleted=0 and b.id in " + boxes + " ");
		}
		else
		{
			sb.append("select b.id as id, (select DATE_FORMAT(bv.last_heard,'%Y-%m-%d %k:%i:%s') from boxvarinfo bv where bv.box_id = b.id ) as last_heard ,  b.box_no as box_no, b.controller_id as controller_id, b.controller_version as controller_version, b.box_name as box_name, b.address as address, b.business_area as business_area, b.sim_phone_no as sim_phone_no, b.longitude as longitude, b.latitude as latitude, b.box_type as box_type, b.locks_count as locks_count, d.name as dep_name, d.id as dep_id ,b.b_longitude as b_longitude, b.b_latitude as b_latitude, b.remarks as remarks, (select bm.dbm from BoxMeasures bm where bm.box_id = b.id order by bm.update_time desc limit 0,1) as dbm from boxinfo b, department d  where b.department_id = d.id and b.is_deleted=0 and d.id in " + deps + " ");
		}
		
		if (bis != null)
		{
			if (bis.getController_id() > 0)
			{
				sb.append(" and b.controller_id = " + bis.getController_id() + " ");
			}
			if (bis.getBox_no() != null && ! bis.getBox_no().equals(""))
			{
				sb.append(" and b.box_no like '%" + bis.getBox_no() + "%' ");
			}
			if (bis.getAddress() != null && ! bis.getAddress().equals(""))
			{
				sb.append(" and b.address like '%" + bis.getAddress() + "%' ");
			}
			if (bis.getDepartment_name() != null && ! bis.getDepartment_name().equals(""))
			{
				sb.append(" and d.name like '%" + bis.getDepartment_name() + "%' ");
			}
			if (bis.getDepartment_id() != null )
			{
				sb.append(" and d.id  = " + bis.getDepartment_id() + " ");
			}
			if (bis.getBox_type() != null && ! bis.getBox_type().equals(""))
			{
				sb.append(" and b.box_type like '%" + bis.getBox_type() + "%' ");
			}
			if (bis.getSim_phone_no() != null && ! bis.getSim_phone_no().equals(""))
			{
				sb.append(" and b.sim_phone_no like '%" + bis.getSim_phone_no() + "%' ");
			}
			if (bis.getLocks_count() > 0)
			{
				sb.append(" and b.locks_count = " + bis.getLocks_count() + " ");
			}
		}
		
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		List<Map<String, Object>> bs;
		try {
			
			Query query = session.createSQLQuery(sb.toString())
			.addScalar("id", Hibernate.INTEGER)
			.addScalar("last_heard", Hibernate.STRING)
			.addScalar("box_no", Hibernate.STRING)
			.addScalar("controller_id", Hibernate.BIG_INTEGER)
			.addScalar("controller_version", Hibernate.STRING)
			.addScalar("box_name", Hibernate.STRING)
			.addScalar("address", Hibernate.STRING)
			.addScalar("business_area", Hibernate.STRING)
			.addScalar("sim_phone_no", Hibernate.STRING)
			.addScalar("longitude", Hibernate.DOUBLE)
			.addScalar("latitude", Hibernate.DOUBLE)
			.addScalar("box_type", Hibernate.STRING)
			.addScalar("locks_count", Hibernate.INTEGER)
			.addScalar("dep_name", Hibernate.STRING) 
			.addScalar("dep_id", Hibernate.STRING) 
			.addScalar("b_longitude", Hibernate.DOUBLE)
			.addScalar("b_latitude", Hibernate.DOUBLE)
			.addScalar("remarks", Hibernate.STRING)
			.addScalar("dbm", Hibernate.DOUBLE)
			.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
			bs = (List<Map<String, Object>>)query.list();
		   }
		finally {
			session.close();
		}
		return bs;
	}
	
	//验证光交箱编号
	public int validBoxNo(BoxInfoOper bio)
	{
		List<BoxInfo> valid = null;
		if (bio.getId() != null && bio.getId() > 0) valid = this.hibernateTemplate.find("from BoxInfo b where b.box_no = ? and b.id != ? and is_deleted = 0 ", bio.getBox_no(), bio.getId());
		else valid = this.hibernateTemplate.find("from BoxInfo b where b.box_no = ?  and is_deleted = 0", bio.getBox_no());
		return valid.size() <= 0 ? 1 : 0;
	}
	
	//验证控制器
	public int validControllerId(BoxInfoOper bio)
	{
		List<BoxInfo> valid = null;
		if (bio.getId() != null && bio.getId() > 0) valid = this.hibernateTemplate.find("from BoxInfo b where b.controller_id = ? and b.id != ? and is_deleted = 0", bio.getController_id(), bio.getId());
		else valid = this.hibernateTemplate.find("from BoxInfo b where b.controller_id = ? and is_deleted = 0", bio.getController_id());
		return valid.size() <= 0 ? 1 : 0;
	}
	
	//修改光交箱
	public int update(BoxInfoOper bio){
		List<BoxInfo> valid = this.hibernateTemplate.find("from BoxInfo b where (b.controller_id = ? or b.box_no = ?) and b.id != ?", bio.getController_id(), bio.getBox_no(), bio.getId());
		if (valid.size() <= 0)
		{
			BoxInfo b = this.hibernateTemplate.get(BoxInfo.class, bio.getId());
			//修改基本信息
			b.setId(bio.getId());
			b.setBox_no(bio.getBox_no());
			b.setController_id(bio.getController_id());
			b.setAddress(bio.getAddress());
			b.setBusiness_area(bio.getBusiness_area());
			b.setSim_phone_no(bio.getSim_phone_no());
			b.setLongitude(bio.getLongitude());
			b.setLatitude(bio.getLatitude());
			b.setDepartment(bio.getDepartment());
			b.setBox_type(bio.getBox_type());
			if (bio.getIs_deleted() != null) b.setIs_deleted(bio.getIs_deleted());
			BaiduLocation bl = new BaiduLocation();
			bl.setGpsx(bio.getLongitude());
			bl.setGpsy(bio.getLatitude());
			if (GpsToBaidu.GetBaiduLocation(bl))
			{
				b.setB_longitude(bl.getBaidux());
				b.setB_latitude(bl.getBaiduy());
			}
			b.setK_code(bio.getK_code());
			b.setWorkorder_department(bio.getWorkorder_department());
			b.setWorkorder_receive_id(bio.getWorkorder_receive_id());
			b.setSms_notifiable(bio.getSms_notifiable());
			b.setSms_reason(bio.getSms_reason());
			if (b.getController_id() != 0)
			{
				b.setUse_state(3);
			}
			else
			{
				b.setUse_state(1);
			}
			b.setLastedituser(bio.getLastedituser());
			b.setLastedittime(new Date());
			b.setRemarks(bio.getRemarks());
			hibernateTemplate.update(b);
			//修改设置值
			BoxSettings bs = null;
			BoxGlobals bg = this.getBoxGlobals();
			List<BoxSettings> bs_temp = this.hibernateTemplate.find("from BoxSettings bs where bs.boxinfo.id = ?", bio.getId());
			if (bs_temp.size() > 0)
			{
				bs = bs_temp.get(0);
				bs.setFlag(bio.getBox_setting_flag());
				if (bio.getBox_setting_flag() != 0)
				{
					bs.setHb_interval(bg.getHb_interval());
					bs.setVolt_threshold(bg.getVolt_threshold());
					bs.setAngle_threshold(bg.getAngle_threshold());
					bs.setHigh_t_threshold(bg.getHigh_t_threshold());
					bs.setLow_t_threshold(bg.getLow_t_threshold());
					bs.setLowpower_period(bg.getLowpower_period());
					bs.setLowpower_periodpercent(bg.getLowpower_periodpercent());
					bs.setShake_peroid(bg.getShake_peroid());
					bs.setShake_frequency(bg.getShake_frequency());
					bs.setShake_time(bg.getShake_time());
					bs.setUser(b.getLastedituser());
					bs.setLastedittime(new Date());
				}
				this.hibernateTemplate.update(bs);
			}
			else
			{
				bs = new BoxSettings();
				bs.setBoxinfo(b);
				bs.setFlag(bio.getBox_setting_flag());
				if (bio.getBox_setting_flag() != 0)
				{
					bs.setHb_interval(bg.getHb_interval());
					bs.setVolt_threshold(bg.getVolt_threshold());
					bs.setAngle_threshold(bg.getAngle_threshold());
					bs.setHigh_t_threshold(bg.getHigh_t_threshold());
					bs.setLow_t_threshold(bg.getLow_t_threshold());
					bs.setLowpower_period(bg.getLowpower_period());
					bs.setLowpower_periodpercent(bg.getLowpower_periodpercent());
					bs.setShake_peroid(bg.getShake_peroid());
					bs.setShake_frequency(bg.getShake_frequency());
					bs.setShake_time(bg.getShake_time());
					bs.setUser(b.getLastedituser());
					bs.setLastedittime(new Date());
				}
				this.hibernateTemplate.save(bs);
			}
			
			//修改下发设置
			ModificationInfo mi = null;
			List<ModificationInfo> mi_temp = this.hibernateTemplate.find("from ModificationInfo mi where mi.boxinfo.id = ?", bio.getId());
			if (mi_temp.size() > 0)
			{
				mi = mi_temp.get(0);
				mi.setFlag(bio.getModificationInfo_flag());
				if (bio.getModificationInfo_flag() != 0)
				{
					mi.setShake_threshold(bg.getShake_threshold());
					mi.setShake_rate(bg.getShake_rate());
					mi.setCenter_ip(bg.getCenter_ip());
					mi.setCenter_upd_port(bg.getCenter_upd_port());
					mi.setIs_send(0);
					mi.setUser(b.getLastedituser());
					mi.setLastedittime(new Date());
				}
				this.hibernateTemplate.update(mi);
			}
			else
			{
				mi = new ModificationInfo();
				mi.setBoxinfo(b);
				mi.setFlag(bio.getModificationInfo_flag());
				if (bio.getModificationInfo_flag() != 0)
				{
					mi.setShake_threshold(bg.getShake_threshold());
					mi.setShake_rate(bg.getShake_rate());
					mi.setCenter_ip(bg.getCenter_ip());
					mi.setCenter_upd_port(bg.getCenter_upd_port());
					mi.setIs_send(0);
					mi.setUser(b.getLastedituser());
					mi.setLastedittime(new Date());
				}
				this.hibernateTemplate.save(mi);
			}
			String sql = "";
			//修改面板信息
			List<BoxModule> bm = this.hibernateTemplate.find("from BoxModule b where b.boxInfo.id = ?", b.getId());
			for (BoxModule boxm : bm)
			{
				boxm.setName(b.getBox_name() + "_" + boxm.getSideName() + "面");
				this.hibernateTemplate.update(boxm);
			}
			//修改端子信息
			List<BoxTerminal> bt = this.hibernateTemplate.find("from BoxTerminal b where b.boxInfo.id = ?", b.getId());
			for (BoxTerminal boxm : bt)
			{
				boxm.setName(b.getBox_name() + "_" + boxm.getSideName() + "面_" + boxm.getRow() + "行_" + boxm.getCol() + "列");
				this.hibernateTemplate.update(boxm);
			}
		}
		else
		{
			return 0;
		}
		return 1;
	}
	
	//删除光交箱
	public void delete(int[] ids) {
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		for (int i = 0; i < ids.length; i ++)
		{
			BoxInfo bi = hibernateTemplate.get(BoxInfo.class, ids[i]);
			bi.setIs_deleted(1);
			hibernateTemplate.update(bi);
		}
	}
	
	//获取光交箱总数量
	public int findCounts(HttpServletRequest request, BoxInfoSearch bis)
	{
		StringBuffer sb = new StringBuffer();
		String boxes = PrivilegeControl.getBoxes(request);
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			sb.append("select count(*) from BoxInfo b where b.is_deleted=0 and b.id in " + boxes + " ");
			if (bis != null)
			{
				if (bis.getController_id() > 0)
				{
					sb.append(" and b.controller_id = " + bis.getController_id() + " ");
				}
				if (bis.getBox_no() != null && ! bis.getBox_no().equals(""))
				{
					sb.append(" and b.box_no like '%" + bis.getBox_no() + "%' ");
				}
				if (bis.getBox_name() != null && ! bis.getBox_name().equals(""))
				{
					sb.append(" and b.box_name like '%" + bis.getBox_name() + "%' ");
				}
				if (bis.getAddress() != null && ! bis.getAddress().equals(""))
				{
					sb.append(" and b.address like '%" + bis.getAddress() + "%' ");
				}
				if (bis.getDepartment_name() != null && ! bis.getDepartment_name().equals(""))
				{
					sb.append(" and b.department.name like '%" + bis.getDepartment_name() + "%' ");
				}
				if (bis.getBox_type() != null && ! bis.getBox_type().equals(""))
				{
					sb.append(" and b.box_type like '%" + bis.getBox_type() + "%' ");
				}
				if (bis.getSim_phone_no() != null && ! bis.getSim_phone_no().equals(""))
				{
					sb.append(" and b.sim_phone_no like '%" + bis.getSim_phone_no() + "%' ");
				}
				if (bis.getLocks_count() > 0)
				{
					sb.append(" and b.locks_count = " + bis.getLocks_count() + " ");
				}
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
	

	//获取某光交箱的所有状态
	public List<BoxStates> findAllBoxStatesByAjax(int id) {
		return this.hibernateTemplate.find("from BoxStates bs where bs.boxInfo.id = " + id);
	}
	
	//获取所有光交箱状态
	public List<DTO_BoxStates_Values_Levels> findAllBoxStatesByAjax(HttpServletRequest request) {
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		if (! boxes.equals("(-1)")) {
			 List<DTO_BoxStates_Values_Levels>  lst = this.hibernateTemplate.find("select new com.sxt.po.DTO_BoxStates_Values_Levels(bs.boxInfo.id, bs.stateKey.state_key, bs.stateValue.state_value, bs.stateValue.stateLevel.level, bs.stateValue.stateLevel.state_image) from BoxStates bs where bs.boxInfo.is_deleted = 0 and bs.boxInfo.id in " + boxes + " order by  bs.stateValue.stateLevel.level");
			return lst;
		}
		else
		{
			
			 return this.hibernateTemplate.find("select new com.sxt.po.DTO_BoxStates_Values_Levels(bs.boxInfo.id, bs.stateKey.state_key, bs.stateValue.state_value, bs.stateValue.stateLevel.level, bs.stateValue.stateLevel.state_image) from BoxStates bs where bs.boxInfo.is_deleted = 0 and bs.boxInfo.department.id in " + deps + " order by  bs.stateValue.stateLevel.level");
		}
	}
	
	//获取所有光交箱状态
	public List<DTO_BoxStates_Values_Levels> findAllBoxStatesByDepartmentId(HttpServletRequest request, Integer id, String box_no, Long controller_id) {
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		StringBuffer sb = new StringBuffer("");
		if (id != null && id != 0) sb.append(" and bs.boxInfo.department.id = " + id + " ");
		if (box_no != null && ! box_no.equals("")) sb.append(" and bs.boxInfo.box_no like '%" + box_no + "%' ");
		if (controller_id != null && controller_id != 0) sb.append(" and bs.boxInfo.controller_id = " + controller_id + " ");
		if (! boxes.equals("(-1)")) {
			return this.hibernateTemplate.find("select new com.sxt.po.DTO_BoxStates_Values_Levels(bs.boxInfo.id, bs.stateKey.state_key, bs.stateValue.state_value, bs.stateValue.stateLevel.level, bs.stateValue.stateLevel.state_image) from BoxStates bs where bs.boxInfo.is_deleted = 0 and bs.boxInfo.id in " + boxes + " " + sb.toString() + " order by bs.stateValue.stateLevel.level");
		}
		else
		{
			return this.hibernateTemplate.find("select new com.sxt.po.DTO_BoxStates_Values_Levels(bs.boxInfo.id, bs.stateKey.state_key, bs.stateValue.state_value, bs.stateValue.stateLevel.level, bs.stateValue.stateLevel.state_image) from BoxStates bs where bs.boxInfo.is_deleted = 0 and bs.boxInfo.department.id in " + deps + " " + sb.toString() + " order by bs.stateValue.stateLevel.level");
		}
	}
	
	//获取某光交箱所有模块
	public List<BoxModule> findBoxModuleById(HttpServletRequest request, int id) {
		String boxes = PrivilegeControl.getBoxes(request);
		return this.hibernateTemplate.find("from BoxModule bm where bm.boxInfo.id = " + id + " order by bm.sideName");
	}
	
	//获取某光交箱下的所有端子
	public List<BoxTerminalUsed> findBoxTerminalById(int id) {
		return this.hibernateTemplate.find("from BoxTerminalUsed bt where bt.boxTerminal.boxInfo.id = " + id + " order by bt.boxTerminal.boxModule.sideName, bt.boxTerminal.row, bt.boxTerminal.col");
	}
	
	//获取端子名称
	public String findTerminalName(int id) {
	         
		BoxTerminal dep =hibernateTemplate.get(BoxTerminal.class, id);
			
		String tname = "";
		
		tname = dep.getName();
			
		return tname;
	  }
	
	
	//
	public String findCoreName(int id) {
        
		CoreNew core =hibernateTemplate.get(CoreNew.class, id);
			
		String tname = "";
		
		tname = core.getName();
			
		return tname;
	  }
	

	//解除跳纤
	public List<BoxTerminalUsed> relieveJumpTerminal(int id1, int id2) {
		JumpCore jc = new JumpCore();
		List<BoxTerminalUsed> jcs = this.hibernateTemplate.find("from BoxTerminalUsed bt where bt.boxTerminal.id in (?, ?)", id1, id2);
		if (jcs.size() > 0)
		{
			for (int i = 0; i < jcs.size(); i ++)
			{
				BoxTerminalUsed bt = jcs.get(i);
				String result = "";
				if (bt.getBoxTerminal().getId() == id1)
				{
					result = splitAndDeleteId(bt.getFront_terminal_id(), id2);
					if (bt.getFront_terminal_id() != null && ! bt.getFront_terminal_id().equals("") && ! result.equals(bt.getFront_terminal_id())) {
						bt.setFrontUsed(bt.getFrontUsed() - 1);
						bt.setFront_terminal_id(result);
					}
				}
				else if (bt.getBoxTerminal().getId() == id2)
				{
					result = splitAndDeleteId(bt.getFront_terminal_id(), id1);
					if (bt.getFront_terminal_id() != null && ! bt.getFront_terminal_id().equals("") && ! result.equals(bt.getFront_terminal_id())) {
						bt.setFrontUsed(bt.getFrontUsed() - 1);
						bt.setFront_terminal_id(result);
					}
				}
				//设置端子的状态为空闲
				if (bt.getFrontUsed() == 0 && bt.getFrontFreezed() == 0) {
					bt.getBoxTerminal().setStatus(1);
					this.hibernateTemplate.update(bt.getBoxTerminal());
				}
				this.hibernateTemplate.update(bt);
			}
		}
		return this.hibernateTemplate.find("from BoxTerminalUsed bt where bt.boxTerminal.id in (?, ?)", id1, id2);
	}
	
	public String splitAndDeleteId(String old, int cut) {
		if (old == null || old.equals("")) return "";
		String[] array = old.split(",");
		StringBuffer sb = new StringBuffer("");
		if (array.length > 0) {
			for (int i = 0; i < array.length; i ++){
				if (Integer.parseInt(array[i]) != cut) {
					sb.append(array[i] + ",");
				}
			}
		}
		return sb.length() > 0 ? sb.toString().substring(0, sb.toString().length() - 1) : "";
	}
	
	
	public String splitAndAddId(String old, int add) {
		String result = old;
		if (old == null || old.equals("")) {
			return ("" + add);
		}
		else
		{
			if (! existId(old, add)) {
				result = result + "," + add;
			}
		}
		return result;
	}
	
	//判断该id是否存在
	public Boolean existId(String ids, int id) {
		Boolean result = false;
		if (ids == null) return false;
		String[] array = ids.split(",");
		if (array.length > 0) {
			for (int i = 0; i < array.length; i ++)
			{
				if (Integer.parseInt(array[i]) == id) {
					result = true;
					break;
				}
			}
		}
		return result;
	}
	
	//解除纤芯成端
	public void relieveCoreToTerminal(int tid) {
		List<CoreUsed> cs = this.hibernateTemplate.find("from CoreUsed c where c.a_terminal.id = ? or c.z_terminal.id = ?", tid, tid);
		if (cs.size() > 0)
		{
			this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed bt set bt.backUsed = 0, bt.backCore = NULL where bt.boxTerminal.id = ?", tid);
			if (cs.get(0).getA_terminal() != null && cs.get(0).getA_terminal().getId() == tid)
			{
				this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_terminal = NULL, c.a_type = 0 where c.a_terminal.id = ?", tid);
			}
			else if (cs.get(0).getZ_terminal() != null && cs.get(0).getZ_terminal().getId() == tid)
			{
				this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_terminal = NULL, c.z_type = 0 where c.z_terminal.id = ?", tid);
			}
		}
	}
	
	//纤芯成端
	public void coreToTerminal(int tid, int oid, int cid, int bid) {
		List<CoreUsed> cs = this.hibernateTemplate.find("from CoreUsed c where c.a_terminal.id = ? or c.z_terminal.id = ?", tid, tid);
		if (cs.size() <= 0)
		{
			Opticalcable o = this.hibernateTemplate.get(Opticalcable.class, oid);
			this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed bt set bt.backUsed = 1, bt.backCore.id = ? where bt.boxTerminal.id = ?", cid, tid);
			if (o.getStart_box() != null && o.getStart_box().getId() == bid)
			{
				this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.a_terminal.id = ?, c.a_type = 2 where c.core.id = ?", tid, cid);
			}
			else if (o.getEnd_box() != null && o.getEnd_box().getId() == bid)
			{
				this.hibernateTemplate.bulkUpdate("update CoreUsed c set c.z_terminal.id = ?, c.z_type = 2 where c.core.id = ?", tid, cid);
			}
		}
	}
	
	//获取纤芯成端
	public CoreUsed findCoreToTerminal(int tid) {
		List<CoreUsed> cs = this.hibernateTemplate.find("from CoreUsed c where c.a_terminal.id = ? or c.z_terminal.id = ?", tid, tid);
		if (cs.size() > 0)
		{
			return cs.get(0);
		}
		return null;
	}
	
	//获取跳纤
	public List<BoxTerminal> findJumpTerminal(int id) {
		List<BoxTerminalUsed> jcs = this.hibernateTemplate.find("from BoxTerminalUsed btu where btu.boxTerminal.id = ?", id);
		if (jcs.size() > 0)
		{
			if (jcs.get(0).getFront_terminal_id() != null && ! jcs.get(0).getFront_terminal_id().equals(""))
			{
				List<BoxTerminal> result = this.hibernateTemplate.find("from BoxTerminal bt where bt.id in (" + jcs.get(0).getFront_terminal_id() + ")");
				return result;
			}
		}
		return null;
	}
	
	//获取预占信息
	public List<BoxTerminal> findRespectTerminal(int id) {
		List<OrderRespect> ors = this.hibernateTemplate.find("from OrderRespect o where o.a_terminal_id = ? or o.z_terminal_id = ?", ("" + id), ("" + id));
		StringBuffer sb = new StringBuffer("");
		for (int i = 0; i < ors.size(); i ++)
		{
			if (Integer.parseInt(ors.get(i).getA_terminal_id()) == id)
			{
				sb.append(ors.get(i).getZ_terminal_id() + ",");
			}
			else
			{
				sb.append(ors.get(i).getA_terminal_id() + ",");
			}
		}
		if (sb.length() > 0)
		{
			return this.hibernateTemplate.find("from BoxTerminal bt where bt.id in (" + sb.toString().substring(0, sb.toString().length() - 1) + ")");
		}
		return null;
	}
	
	//获取端子
	public BoxTerminal findTerminal(int id) {
		return this.hibernateTemplate.get(BoxTerminal.class, id);
	}
	
	//跳纤
	public void jumpTerminal(int id1, int id2) {
		List<BoxTerminalUsed> jcs = this.hibernateTemplate.find("from BoxTerminalUsed bt where bt.boxTerminal.id in (?, ?)", id1, id2);
		if (jcs.size() > 0)
		{
			for (int i = 0; i < jcs.size(); i ++)
			{
				BoxTerminalUsed bt = jcs.get(i);
				String result = "";
				if (bt.getBoxTerminal().getId() == id1)
				{
					result = splitAndAddId(bt.getFront_terminal_id(), id2);
					if (! result.equals(bt.getFront_terminal_id())) {
						bt.setFrontUsed(bt.getFrontUsed() + 1);
						bt.setFront_terminal_id(result);
					}
				}
				else if (bt.getBoxTerminal().getId() == id2)
				{
					result = splitAndAddId(bt.getFront_terminal_id(), id1);
					if (! result.equals(bt.getFront_terminal_id())) {
						bt.setFrontUsed(bt.getFrontUsed() + 1);
						bt.setFront_terminal_id(result);
					}
				}
				//设置端子的状态为占用
				if (bt.getFrontFreezed() == 0) {
					bt.getBoxTerminal().setStatus(2);
					this.hibernateTemplate.update(bt.getBoxTerminal());
				}
				this.hibernateTemplate.update(bt);
			}
		}
	}
	
	//纤芯直熔
	public void coreToCore(int bid, int sid, int eid) {
		String sql = "";
		Core sc = this.hibernateTemplate.get(Core.class, sid);
		if (sc.getOpticalcable() != null && sc.getOpticalcable().getStart_box() != null && sc.getOpticalcable().getStart_box().getId() == bid)
		{
			sql = "update CoreUsed c set c.a_type = 3, c.a_core.id = ?, c.a_string = NULL, c.a_terminal = NULL where c.core.id = ? and c.a_type = 0";
			this.hibernateTemplate.bulkUpdate(sql, eid, sid);
		}
		else
		{
			sql = "update CoreUsed c set c.z_type = 3, c.z_core.id = ?, c.z_string = NULL, c.z_terminal = NULL where c.core.id = ? and c.z_type = 0";
			this.hibernateTemplate.bulkUpdate(sql, eid, sid);
		}
		Core ec = this.hibernateTemplate.get(Core.class, eid);
		if (ec.getOpticalcable() != null && ec.getOpticalcable().getStart_box() != null && ec.getOpticalcable().getStart_box().getId() == bid)
		{
			sql = "update CoreUsed c set c.a_type = 3, c.a_core.id = ?, c.a_string = NULL, c.a_terminal = NULL where c.core.id = ? and c.a_type = 0";
			this.hibernateTemplate.bulkUpdate(sql, sid, eid);
		}
		else
		{
			sql = "update CoreUsed c set c.z_type = 3, c.z_core.id = ?, c.z_string = NULL, c.z_terminal = NULL where c.core.id = ? and c.z_type = 0";
			this.hibernateTemplate.bulkUpdate(sql, sid, eid);
		}
	}
	
	//查询工单列表
	public List<Map<String, Object>> findAllWorkOrder(WorkOrderSearch wo,HttpServletRequest request){
		StringBuffer sb = new StringBuffer();
		String deps=PrivilegeControl.getDepartments(request);
		String boxes = PrivilegeControl.getBoxes(request);
		if (! boxes.equals("(-1)")) {
			//sb.append("from WorkOrder w where w.is_deleted=0 and ((w.type = 1 and w.id in (select DISTINCT(o.order.id) from OrderRespect o where o.order.id=w.id and o.boxinfo.id in " + boxes + ")) or (w.type = 3 and w.id in (select r.workorder.id from RepairRecord r where r.workorder.id = w.id and r.boxinfo.id in " + boxes + ")) or (w.type = 2 and w.id in (select DISTINCT(a.order.id) from AlarmOrderDetails a where a.order.id=w.id and a.boxinfo.id in " + boxes + ")))");
			sb.append("SELECT result.id AS id, result.order_no AS order_no, result.title AS title, result.type AS type, u1.full_name AS create_user, u2.full_name AS receive_operators, d.name AS department, result.create_time AS create_time, result.create_type AS create_type, result.done_type AS done_type, result.is_upload AS is_upload, result.receive_time AS receive_time, result.respect_starttime AS respect_starttime, result.respect_endtime AS respect_endtime FROM ((SELECT DISTINCT wo3.* FROM workorder wo3, orderrespect os WHERE os.order_id = wo3.id and os.box_id in " + boxes + " AND wo3.type=1 AND wo3.is_deleted=0) UNION (SELECT wo1.* FROM workorder wo1, repairrecord rr WHERE rr.workorder_id = wo1.id AND wo1.type=3 and rr.box_id in " + boxes + " AND wo1.is_deleted=0) UNION (SELECT wo2.* FROM workorder wo2, alarmorderdetails aod WHERE aod.order_id=wo2.id AND wo2.type=2 and aod.box_id in " + boxes + " AND wo2.is_deleted=0)) AS result LEFT JOIN userinfo u1 ON result.user_id = u1.id LEFT JOIN userinfo u2 ON u2.id=result.receive_operators_id LEFT JOIN department d ON d.id=result.department_id where 0=0 ");
		}
		else
		{
			sb.append("select result.id as id, result.order_no as order_no, result.title as title, result.type as type, u1.full_name as create_user, u2.full_name as receive_operators, d.name as department, result.create_time as create_time, result.create_type as create_type, result.done_type as done_type, result.is_upload AS is_upload,result.receive_time as receive_time, result.respect_starttime as respect_starttime, result.respect_endtime as respect_endtime from WorkOrder result left join userinfo u1 on u1.id=result.user_id left join userinfo u2 on u2.id=result.receive_operators_id left join department d on d.id=result.department_id where result.is_deleted=0 and result.department_id in "+ deps +" " );
		}
		if (wo != null)
		{
			if (wo.getOrder_no() != null && ! wo.getOrder_no().equals(""))
			{
				sb.append(" and result.order_no = '" + wo.getOrder_no() + "'");
			}
			if (wo.getType() != null && wo.getType() > 0)
			{
				sb.append(" and result.type = " + wo.getType());
			}
			if (wo.getCreate_user_id() != null && wo.getCreate_user_id() > 0)
			{
				sb.append(" and result.user_id = " + wo.getCreate_user_id());
			}
			if (wo.getCreate_type() != null && wo.getCreate_type() > 0)
			{
				sb.append(" and result.create_type = " + wo.getCreate_type());
			}
			if (wo.getDone_type() != null && wo.getDone_type() > 0)
			{
				sb.append(" and result.done_type = " + wo.getDone_type());
			}
			if (wo.getDepartment_id() != null && wo.getDepartment_id() > 0)
			{
				sb.append(" and result.department_id = " + wo.getDepartment_id());
			}
			if (wo.getReceive_user_id() != null && wo.getReceive_user_id() > 0)
			{
				sb.append(" and result.receive_operators_id = " + wo.getReceive_user_id());
			}
			if (wo.getSort() != null && ! wo.getSort().equals(""))
			{
				sb.append(" order by result." + wo.getSort() + " " + wo.getOrder());
			}
			else 
			{
				sb.append(" order by result.create_time desc ");
			}
		}
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		List<Map<String, Object>> bs;
		try {
			Query query = session.createSQLQuery(sb.toString())
				.addScalar("id", Hibernate.INTEGER)
				.addScalar("order_no", Hibernate.STRING)
				.addScalar("title", Hibernate.STRING)
				.addScalar("type", Hibernate.INTEGER)
				.addScalar("is_upload", Hibernate.INTEGER)
				.addScalar("create_user", Hibernate.STRING)
				.addScalar("receive_operators", Hibernate.STRING)
				.addScalar("department", Hibernate.STRING)
				.addScalar("create_time", Hibernate.TIMESTAMP)
				.addScalar("create_type", Hibernate.INTEGER)
				.addScalar("done_type", Hibernate.INTEGER)
				.addScalar("receive_time", Hibernate.TIMESTAMP)
				.addScalar("respect_starttime", Hibernate.TIMESTAMP)
				.addScalar("respect_endtime", Hibernate.TIMESTAMP)
				.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
			query.setFirstResult((wo.getPage() - 1) * wo.getRows());
			query.setMaxResults(wo.getRows());
			bs = query.list();
		}
		finally {
			session.close();
		}
		return bs;
	}
	
	//查询工单列表
	public List<WorkOrderNew> findAllWorkOrderNew(WorkOrderSearch wo,HttpServletRequest request){
		List<WorkOrderNew> list;
		String boxes = PrivilegeControl.getBoxes(request);
		String deps = PrivilegeControl.getDepartments(request);
		try
		{
			StringBuffer sb = new StringBuffer();
			if (! boxes.equals("(-1)"))
			{
				sb.append("from WorkOrderNew");
			}
			else
			{
				//sb.append("from DoorEvent d where d.boxinfo.is_deleted=0 and d.boxinfo.department.id in " + deps + " ");
			}
			
			list = this.getListForPage(sb.toString(), (wo.getPage() - 1) * wo.getRows(), wo.getRows());
		}
		finally
		{
		}
		return list;
	}
	
	//获取工单类型为告警，并且为完成的工单数量
	public int findOrderTypeAlarmCounts(HttpServletRequest request) {
		StringBuffer sb = new StringBuffer("");
		String deps = PrivilegeControl.getDepartments(request);
		String boxes = PrivilegeControl.getBoxes(request);
		Session session = hibernateTemplate.getSessionFactory().getCurrentSession();
		Long count = new Long(0);
		try
		{
			if(! boxes.equals("(-1)")){
				sb.append("select count(*) from WorkOrder w where w.is_deleted=0 and w.type = 2 and w.done_type != 3 and w.id in (select DISTINCT(a.order.id) from AlarmOrderDetails a where a.order.id=w.id and a.boxinfo.id in " + boxes + ")");
			}
			else
			{
				sb.append("select count(*) from WorkOrder w where w.is_deleted=0 and w.type = 2 and w.done_type != 3 and w.department.id in "+ deps + " ");
			}
			Query q = session.createQuery(sb.toString());
			count = (Long)q.uniqueResult();
		}
		finally
		{
			if (session != null) session.close();
		}
		return count.intValue();
	}
	
	//获取工单总数量
	public int findWorkOrderCounts(WorkOrderSearch wo,HttpServletRequest request)
	{
		StringBuffer sb = new StringBuffer();
		String deps=PrivilegeControl.getDepartments(request);
		String boxes =PrivilegeControl.getBoxes(request);
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		int count = 0;
		try
		{
			if (! boxes.equals("(-1)")) {
				//sb.append("from WorkOrder w where w.is_deleted=0 and ((w.type = 1 and w.id in (select DISTINCT(o.order.id) from OrderRespect o where o.order.id=w.id and o.boxinfo.id in " + boxes + ")) or (w.type = 3 and w.id in (select r.workorder.id from RepairRecord r where r.workorder.id = w.id and r.boxinfo.id in " + boxes + ")) or (w.type = 2 and w.id in (select DISTINCT(a.order.id) from AlarmOrderDetails a where a.order.id=w.id and a.boxinfo.id in " + boxes + ")))");
				sb.append("SELECT count(*) FROM ((SELECT DISTINCT wo3.* FROM workorder wo3, orderrespect os WHERE os.order_id = wo3.id and os.box_id in " + boxes + " AND wo3.type=1 AND wo3.is_deleted=0) UNION (SELECT wo1.* FROM workorder wo1, repairrecord rr WHERE rr.workorder_id = wo1.id AND wo1.type=3 and rr.box_id in " + boxes + " AND wo1.is_deleted=0) UNION (SELECT wo2.* FROM workorder wo2, alarmorderdetails aod WHERE aod.order_id=wo2.id AND wo2.type=2 and aod.box_id in " + boxes + " AND wo2.is_deleted=0)) AS result where 0=0 ");
			}
			else
			{
				sb.append("select count(*) from WorkOrder result where result.is_deleted=0 and result.department_id in "+ deps +" " );
			}
			if (wo != null)
			{
				if (wo.getOrder_no() != null && ! wo.getOrder_no().equals(""))
				{
					sb.append(" and result.order_no = '" + wo.getOrder_no() + "'");
				}
				if (wo.getType() != null && wo.getType() > 0)
				{
					sb.append(" and result.type = " + wo.getType());
				}
				if (wo.getCreate_user_id() != null && wo.getCreate_user_id() > 0)
				{
					sb.append(" and result.user_id = " + wo.getCreate_user_id());
				}
				if (wo.getCreate_type() != null && wo.getCreate_type() > 0)
				{
					sb.append(" and result.create_type = " + wo.getCreate_type());
				}
				if (wo.getDone_type() != null && wo.getDone_type() > 0)
				{
					sb.append(" and result.done_type = " + wo.getDone_type());
				}
				if (wo.getDepartment_id() != null && wo.getDepartment_id() > 0)
				{
					sb.append(" and result.department_id = " + wo.getDepartment_id());
				}
				if (wo.getReceive_user_id() != null && wo.getReceive_user_id() > 0)
				{
					sb.append(" and result.receive_operators_id = " + wo.getReceive_user_id());
				}
			}
			Query q = session.createSQLQuery(sb.toString());
			count = ((BigInteger)q.uniqueResult()).intValue();
		}
		finally
		{
			session.close();
		}
		return count;
	}
	
	
	
	public HibernateTemplate getHibernateTemplate() {
		return hibernateTemplate;
	}

	public void setHibernateTemplate(HibernateTemplate hibernateTemplate) {
		this.hibernateTemplate = hibernateTemplate;
	}
	
}
