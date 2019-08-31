package com.sxt.dao;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
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
import com.sxt.po.BoxInfoSearch;
import com.sxt.po.BoxModule;
import com.sxt.po.BoxStates;
import com.sxt.po.BoxTerminal;
import com.sxt.po.BoxTerminalUsed;
import com.sxt.po.BoxVarInfo;
import com.sxt.po.Core;
import com.sxt.po.CoreUsed;
import com.sxt.po.DTO_BoxStates_Values_Levels;
import com.sxt.po.DTO_Core;
import com.sxt.po.Department;
import com.sxt.po.Operators;
import com.sxt.po.Opticalcable;
import com.sxt.po.OpticalcableCoreTree;
import com.sxt.po.OpticalcableSearch;
import com.sxt.po.Pager;
import com.sxt.po.User;
import com.sxt.utils.PrivilegeControl;

@Component("opticalcableDao")
public class OpticalcableDao {
	
	private HibernateTemplate hibernateTemplate;
	
	//判断端子是否跳纤
	public List<BoxTerminalUsed> checkJumped(String ids)
	{
		return this.hibernateTemplate.find("from BoxTerminalUsed bt where bt.boxTerminal.id in (" + ids + ") and bt.frontUsed!=0");
	}
	
	//添加光缆
	public void add(Opticalcable b){
		int i;
		String name;
		name = (b.getStart_box() == null ? b.getStartAddress() : b.getStart_box().getBox_no()) + "_" + (b.getEnd_box() == null ? b.getEndAddress() : b.getEnd_box().getBox_no());
		b.setName(name);
		hibernateTemplate.save(b);
		if (b.getCoreCounts() > 0)
		{
			for (i = 0; i < b.getCoreCounts(); i ++)
			{
				Core core = new Core();
				core.setOpticalcable(b);
				core.setSequence(i + 1);
				core.setName((b.getStart_box() == null ? b.getStartAddress() : b.getStart_box().getBox_no()) + "_" + (b.getEnd_box() == null ? b.getEndAddress() : b.getEnd_box().getBox_no()) + "_纤芯_" + (i + 1));
				this.hibernateTemplate.save(core);
				CoreUsed cu = new CoreUsed();
				cu.setCore(core);
				this.hibernateTemplate.save(cu);
			}
		}
	}
	
	public Map<String, Object> findOpticalcable(Integer id) {
		StringBuffer sb = new StringBuffer();
		sb.append("select new map (b.id as id, b.name as name, b.startAddress as address, sb.box_no as start_box, b.endAddress as endAddress, eb.box_no as end_box, b.coreCounts as coreCounts, b.type as type, b.remarks as remarks) from Opticalcable b left join b.start_box as sb left join b.end_box as eb where b.id=" + id);
		List<Map<String, Object>> results = this.hibernateTemplate.find(sb.toString());
		return results.size() > 0 ? results.get(0) : null;
	}
	
	//光缆分页
	public List<Map<String, Object>> findByPager(OpticalcableSearch bis,HttpServletRequest request){
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		String boxes = PrivilegeControl.getBoxes(request);
		if(! boxes.equals("(-1)")){
			sb.append("select new map (b.id as id, b.name as name, b.startAddress as address, sb.box_no as start_box, b.endAddress as endAddress, eb.box_no as end_box, b.coreCounts as coreCounts, b.type as type, b.remarks as remarks) from Opticalcable b left join b.start_box as sb left join b.end_box as eb where 0=0 and (b.start_box.id in "+ boxes +" "+"or b.end_box.id in "+ boxes +") ");
		}
		else
		{
			sb.append("select new map (b.id as id, b.name as name, b.startAddress as address, sb.box_no as start_box, b.endAddress as endAddress, eb.box_no as end_box, b.coreCounts as coreCounts, b.type as type, b.remarks as remarks) from Opticalcable b left join b.start_box as sb left join b.end_box as eb where 0=0 and (b.start_box.department.id in "+ deps +" "+"or b.end_box.department.id in "+ deps +") ");
		}
		
		if (bis.getName() != null && ! bis.getName().equals(""))
		{
			sb.append(" and b.name like '%" + bis.getName() + "%'");
		}
		if (bis.getStartAddress() != null && ! bis.getStartAddress().equals(""))
		{
			sb.append(" and b.startAddress like '%" + bis.getStartAddress() + "%'");
		}
		if (bis.getStartBoxName() != null && ! bis.getStartBoxName().equals(""))
		{
			sb.append(" and b.start_box.box_no = '" + bis.getStartBoxName() + "'");
		}
		if (bis.getEndAddress() != null && ! bis.getEndAddress().equals(""))
		{
			sb.append(" and b.endAddress like '%" + bis.getEndAddress() + "%'");
		}
		if (bis.getEndBoxName() != null && ! bis.getEndBoxName().equals(""))
		{
			sb.append(" and b.end_box.box_no = '" + bis.getEndBoxName() + "'");
		}
		if (bis.getType() != null && ! bis.getType().equals(""))
		{
			sb.append(" and b.type like '%" + bis.getType() + "%'");
		}
		if (bis.getSort() != null && ! bis.getSort().equals(""))
		{
			sb.append(" order by b." + bis.getSort() + " " + bis.getOrder() + " ");
		}
		List<Map<String, Object>> b = this.getListForPage(sb.toString(), (bis.getPage() - 1) * bis.getRows(), bis.getRows());
		return b;
	}
	
	//铅芯分页
	public List<CoreUsed> findCoreByPager(Pager bis){
		StringBuffer sb = new StringBuffer();
		sb.append("from CoreUsed c where 0=0 ");
		if (bis.getId() > 0)
		{
			sb.append(" and c.core.opticalcable.id = " + bis.getId() + "");
		}
		sb.append(" order by c.core.sequence ");
		List<CoreUsed> b = this.getListForPage(sb.toString(), (bis.getPage() - 1) * bis.getRows(), bis.getRows());
		return b;
	}
	
	//获取全部光缆
	public List<Opticalcable> findAll(){
		String sql = "from Opticalcable b";
		List<Opticalcable> b = this.hibernateTemplate.find(sql);
		return b;
	}
	
	//获取全部光缆
	public List<Opticalcable> findAllByBoxId(int id){
		String sql = "from Opticalcable b where b.start_box.id = ? or b.end_box.id = ?";
		List<Opticalcable> b = this.hibernateTemplate.find(sql, id, id);
		return b;
	}
	
	//获取全部光缆和纤芯
	public List<OpticalcableCoreTree> findAllTreeByBoxId(int id){
		String sql = "from Opticalcable b where b.start_box.id = ? or b.end_box.id = ?";
		List<Opticalcable> b = this.hibernateTemplate.find(sql, id, id);
		List<OpticalcableCoreTree> o = new ArrayList<OpticalcableCoreTree>();
		for (Opticalcable t : b)
		{
			OpticalcableCoreTree temp = new OpticalcableCoreTree();
			temp.setId(t.getId());
			temp.setCoreCounts(t.getCoreCounts());
			temp.setEnd_box(t.getEnd_box());
			temp.setEndAddress(t.getEndAddress());
			temp.setName(t.getName());
			temp.setRemarks(t.getRemarks());
			temp.setStart_box(t.getStart_box());
			temp.setStartAddress(t.getStartAddress());
			temp.setType(t.getType());
			List<CoreUsed> cs = this.hibernateTemplate.find("from CoreUsed c where c.core.opticalcable.id = ?", t.getId());
			temp.setCores(cs);
			o.add(temp);
		}
		return o;
	}
	
	//获取光缆全部纤芯
	public List<CoreUsed> findAllCore(int id){
		String sql = "from CoreUsed c where c.core.opticalcable.id = ?";
		List<CoreUsed> c = this.hibernateTemplate.find(sql, id);
		return c;
	}
	
	//获取光缆全部可用纤芯
	public List<CoreUsed> findAllCoreByBoxId(int boxid, int optiid){
		String sql = "from CoreUsed c where c.core.opticalcable.id = ? and c.a_type = 0 and c.core.opticalcable.start_box.id = ?";
		List<CoreUsed> c1 = this.hibernateTemplate.find(sql, optiid, boxid);
		sql = "from CoreUsed c where c.core.opticalcable.id = ? and c.z_type = 0 and c.core.opticalcable.end_box.id = ?";
		List<CoreUsed> c2 = this.hibernateTemplate.find(sql, optiid, boxid);
		c1.addAll(c2);
		return c1;
	}
	
	//获取某光缆
	public Opticalcable find(int id)
	{
		return hibernateTemplate.get(Opticalcable.class, id);
	}
	
	//修改光缆信息
	public void update(Opticalcable b){
		int i;
		String name;
		name = (b.getStart_box() == null ? b.getStartAddress() : b.getStart_box().getBox_no()) + "_" + (b.getEnd_box() == null ? b.getEndAddress() : b.getEnd_box().getBox_no());
		b.setName(name);
		hibernateTemplate.update(b);
		this.hibernateTemplate.flush();
		this.hibernateTemplate.clear();
		if (b.getCoreCounts() > 0)
		{
			List<Core> cs = this.hibernateTemplate.find("from Core c where c.opticalcable.id = ?", b.getId());
			if (cs.size() > 0)
			{
				for (i = 0; i < cs.size(); i ++)
				{
					Core core = cs.get(i);
					core.setName((b.getStart_box() == null ? b.getStartAddress() : b.getStart_box().getBox_no()) + "_" + (b.getEnd_box() == null ? b.getEndAddress() : b.getEnd_box().getBox_no()) + "_纤芯_" + core.getSequence());
					this.hibernateTemplate.update(core);
				}
			}
		}
	}
	
	//删除光缆
	public int delete(int[] ids) {
		for (int i = 0; i < ids.length; i ++)
		{
			List<CoreUsed> temp = this.hibernateTemplate.find("from CoreUsed cu where (cu.a_type != 0 or cu.z_type != 0 or cu.a_freezed != 0 or cu.z_freezed != 0) and cu.core.opticalcable.id = ?", ids[i]);
			if (temp.size() > 0)
			{
				throw new RuntimeException();
			}
			Opticalcable o = hibernateTemplate.get(Opticalcable.class, ids[i]);
			this.hibernateTemplate.bulkUpdate("update BoxTerminalUsed bt set bt.backUsed=0, bt.backCore.id=NULL where bt.backCore.id in (select c.id from Core c where c.opticalcable.id = ?)", o.getId());
			this.hibernateTemplate.bulkUpdate("update CoreUsed cu set cu.a_type = 0, cu.a_core.id = NULL where cu.a_type = 3 and cu.a_core.id in (select c.id from Core c where c.opticalcable.id = ?)", o.getId());
			this.hibernateTemplate.bulkUpdate("update CoreUsed cu set cu.z_type = 0, cu.z_core.id = NULL where cu.z_type = 3 and cu.z_core.id in (select c.id from Core c where c.opticalcable.id = ?)", o.getId());
			this.hibernateTemplate.delete(o);
		}
		return 1;
	}
	
	//获取数量
	public int findCounts(OpticalcableSearch bis,HttpServletRequest request)
	{
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		String boxes = PrivilegeControl.getBoxes(request);
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			if (! boxes.equals("(-1)"))
			{
				sb.append("select count(*) from Opticalcable b where 0=0 and (b.start_box.id in "+ boxes + " "+ "or b.end_box.id in "+ boxes+ ") ");
			}
			else
			{
				sb.append("select count(*) from Opticalcable b where 0=0 and (b.start_box.department.id in "+ deps + " "+ "or b.end_box.department.id in "+ deps+ ") ");
			}
			if (bis.getName() != null && ! bis.getName().equals(""))
			{
				sb.append(" and b.name like '%" + bis.getName() + "%'");
			}
			if (bis.getStartAddress() != null && ! bis.getStartAddress().equals(""))
			{
				sb.append(" and b.startAddress like '%" + bis.getStartAddress() + "%'");
			}
			if (bis.getStartBoxName() != null && ! bis.getStartBoxName().equals(""))
			{
				sb.append(" and b.start_box.box_no = '" + bis.getStartBoxName() + "'");
			}
			if (bis.getEndAddress() != null && ! bis.getEndAddress().equals(""))
			{
				sb.append(" and b.endAddress like '%" + bis.getEndAddress() + "%'");
			}
			if (bis.getEndBoxName() != null && ! bis.getEndBoxName().equals(""))
			{
				sb.append(" and b.end_box.box_no = '" + bis.getEndBoxName() + "'");
			}
			if (bis.getType() != null && ! bis.getType().equals(""))
			{
				sb.append(" and b.type like '%" + bis.getType() + "%'");
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
	
	//获取铅芯分页数量
	public int findCoreCounts(Pager bis)
	{
		StringBuffer sb = new StringBuffer();
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			sb.append("select count(*) from CoreUsed b where 0=0 ");
			if (bis.getId() > 0)
			{
				sb.append(" and b.core.opticalcable.id = " + bis.getId() + "");
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

	@Resource
	public void setHibernateTemplate(HibernateTemplate hibernateTemplate) {
		this.hibernateTemplate = hibernateTemplate;
	}
	
}
