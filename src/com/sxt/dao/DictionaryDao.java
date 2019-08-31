package com.sxt.dao;

import java.sql.SQLException;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.classic.Session;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.sxt.po.Backup;
import com.sxt.po.Department;
import com.sxt.po.GlobalSearch;
import com.sxt.po.Operators;
import com.sxt.po.StateKey;
import com.sxt.po.StateKeySearch;
import com.sxt.po.StateLevel;
import com.sxt.po.StateLevelSearch;
import com.sxt.po.StateValue;
import com.sxt.po.StateValueSearch;
import com.sxt.po.User;

@Component("dictionaryDao")
public class DictionaryDao {
	@Resource
	private HibernateTemplate hibernateTemplate;
	
	public HibernateTemplate getHibernateTemplate() {
		return hibernateTemplate;
	}

	public void setHibernateTemplate(HibernateTemplate hibernateTemplate) {
		this.hibernateTemplate = hibernateTemplate;
	}
	//备份分页
	public List<Backup> findBackupPager(GlobalSearch svs){
		StringBuffer sb = new StringBuffer();
		sb.append("from Backup b where 0=0 ");
		if (svs.getSort() != null && ! svs.getSort().equals("")) sb.append(" order by b." + svs.getSort() + " " + svs.getOrder());
		List<Backup> bs = this.getListForPage(sb.toString(), (svs.getPage() - 1) * svs.getRows(), svs.getRows());
		return bs;
	}
	
	//备份数量
	public int findBackupCounts(GlobalSearch svs)
	{
		StringBuffer sb = new StringBuffer();
		sb.append("select count(*) from Backup b where 0=0 ");
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		session.beginTransaction();
		Query q = session.createQuery(sb.toString());
		Long count = (Long)q.uniqueResult();
		session.close();
		return count.intValue();
	}
	
	//添加备份
	public void addBackup(Backup b)
	{
		b.setCreate_date(new Date());
		this.hibernateTemplate.save(b);
	}
	
	//获取备份
	public Backup findBackup(Integer id) {
		return this.hibernateTemplate.get(Backup.class, id);
	}
	
	public void deleteBackup(Integer id) {
		this.hibernateTemplate.bulkUpdate("delete from Backup b where id = ?", id);
	}
	
	public List<StateKey> findByPager(StateKeySearch sks){
		StringBuffer sb = new StringBuffer();
		sb.append("from StateKey sk where 0=0 ");
		if (sks.getState_key() != null && ! sks.getState_key().equals("")) sb.append(" and sk.state_key like '%" + sks.getState_key() + "%'");
		if (sks.getSort() != null && ! sks.getSort().equals("")) sb.append(" order by sk." + sks.getSort() + " " + sks.getOrder());
		List<StateKey> stateKeys = this.getListForPage(sb.toString(), (sks.getPage() - 1) * sks.getRows(), sks.getRows());
		return stateKeys;
	}
	

	//获取所有状态字典
	public List<StateKey> findStateKeyAll(){
		return this.hibernateTemplate.find("from StateKey sk order by sk.state_key");
	}
	
	//更具状态字典的id获取该状态字典下的所有状态项 
	public List<StateValue> findStateValueByStateKeyId(int id)
	{
		return this.hibernateTemplate.find("from StateValue sv where sv.stateKey.id = ?", id);
	}
	
	//获取所有状态项字典项
	public List<StateValue> findStateValueAll(){
		return this.hibernateTemplate.find("from StateValue sv order by sv.stateKey.id ");
	}
	
	//获取所有状态项字典项
	public List<StateValue> findStateValueAllForCam(){
		return this.hibernateTemplate.find("from StateValue sv order by sv.stateLevel.level");
	}
	
	//删除状态字典
	public void deleteStateKey(int[] sks) {
		for (int i = 0; i < sks.length; i ++)
		{
			StateKey sk = this.hibernateTemplate.get(StateKey.class, sks[i]);
			this.hibernateTemplate.delete(sk);
		}
	}
	
	//删除状态字典等级
	public void deleteStateLevel(int[] lls) {
		for (int i = 0; i < lls.length; i ++)
		{
			StateLevel sl = this.hibernateTemplate.get(StateLevel.class, lls[i]);
			this.hibernateTemplate.delete(sl);
		}
	}
	
	//删除状态字典项
	public void deleteStateValue(int[] svs) {
		for (int i = 0; i < svs.length; i ++)
		{
			StateValue sv = this.hibernateTemplate.get(StateValue.class, svs[i]);
			this.hibernateTemplate.delete(sv);
		}
	}
	
	//获取所有状态字典等级
	public List<StateKey> findStateLevelAll(){
		return this.hibernateTemplate.find("from StateLevel sl order by sl.level");
	}
	
	public int findCounts(StateKeySearch sks)
	{
		StringBuffer sb = new StringBuffer();
		sb.append("select count(*) from StateKey sk where 0=0 ");
		if (sks.getState_key() != null && ! sks.getState_key().equals("")) sb.append(" and sk.state_key like '%" + sks.getState_key() + "%'");
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		session.beginTransaction();
		Query q = session.createQuery(sb.toString());
		Long count = (Long)q.uniqueResult();
		session.close();
		return count.intValue();
	}
	
	public List<StateValue> findStateValueByPager(StateValueSearch svs){
		StringBuffer sb = new StringBuffer();
		sb.append("from StateValue sv where 0=0 ");
		if (svs.getKey_id() > 0) sb.append(" and sv.stateKey.id = " + svs.getKey_id());
		if (svs.getState_value() != null && ! svs.getState_value().equals("")) sb.append(" and sv.state_value like '%" + svs.getState_value() + "%'");
		if (svs.getState_level() > 0) sb.append(" and sv.stateLevel.id = " + svs.getState_value());
		if (svs.getSort() != null && ! svs.getSort().equals("")) sb.append(" order by sv." + svs.getSort() + " " + svs.getOrder());
		List<StateValue> stateValues = this.getListForPage(sb.toString(), (svs.getPage() - 1) * svs.getRows(), svs.getRows());
		return stateValues;
	}
	
	
	public int findStateValueCounts(StateValueSearch svs)
	{
		StringBuffer sb = new StringBuffer();
		sb.append("select count(*) from StateValue sv where 0=0 ");
		if (svs.getKey_id() > 0) sb.append(" and sv.stateKey.id = " + svs.getKey_id());
		if (svs.getState_value() != null && ! svs.getState_value().equals("")) sb.append(" and sv.state_value like '%" + svs.getState_value() + "%'");
		if (svs.getState_level() > 0) sb.append(" and sv.stateLevel.id = " + svs.getState_value());
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		session.beginTransaction();
		Query q = session.createQuery(sb.toString());
		Long count = (Long)q.uniqueResult();
		session.close();
		return count.intValue();
	}
	
	//获取字典等级分页
	public List<StateLevel> findStateLevelByPager(StateLevelSearch sls){
		StringBuffer sb = new StringBuffer();
		sb.append("from StateLevel sl where 0=0 ");
		if (sls.getSort() != null && ! sls.getSort().equals("")) sb.append(" order by sl." + sls.getSort() + " " + sls.getOrder());
		List<StateLevel> stateLevels = this.getListForPage(sb.toString(), (sls.getPage() - 1) * sls.getRows(), sls.getRows());
		return stateLevels;
	}
	
	//获取字典等级总数
	public int findStateLevelCounts()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("select count(*) from StateLevel sl");
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		session.beginTransaction();
		Query q = session.createQuery(sb.toString());
		Long count = (Long)q.uniqueResult();
		session.close();
		return count.intValue();
	}
	
	//判断状态字典有效性
	public int isStateKeyValid(String state_key) {
		StringBuffer sb = new StringBuffer();
		sb.append("select count(*) from StateKey sk where 0=0 and state_key = '" + state_key + "'");
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		session.beginTransaction();
		Query q = session.createQuery(sb.toString());
		Long count = (Long)q.uniqueResult();
		session.close();
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
	
	//添加状态字典
	public void addStateKey(StateKey sk)
	{
		this.hibernateTemplate.save(sk);
	}
	
	//添加状态字典项
	public void addStateValue(StateValue sv)
	{
		this.hibernateTemplate.save(sv);
	}
	
	//添加状态字典等级
	public void addStateLevel(StateLevel sl)
	{
		this.hibernateTemplate.save(sl);
	}
	
	//获取状态字典
	public StateKey findStateKey(int id)
	{
		return this.hibernateTemplate.get(StateKey.class, id);
	}
	
	//获取状态字典等级
	public StateLevel findStateLevel(int id)
	{
		return this.hibernateTemplate.get(StateLevel.class, id);
	}
	
	//获取状态字典项
	public StateValue findStateValue(int id)
	{
		return this.hibernateTemplate.get(StateValue.class, id);
	}
	
	//修改状态字典等级
	public void updateStateLevel(StateLevel sl)
	{
		if (sl.getState_image() == null || sl.getState_image().equals(""))
		{
			StateLevel nowsl = this.hibernateTemplate.get(StateLevel.class, sl.getId());
			sl.setState_image(nowsl.getState_image());
			this.hibernateTemplate.clear();
		}
		this.hibernateTemplate.update(sl);
	}
	
	//修改状态字典项
	public void updateStateValue(StateValue sv)
	{
		this.hibernateTemplate.update(sv);
	}
	
	//修改状态字典
	public void updateStateKey(StateKey sk)
	{
		this.hibernateTemplate.update(sk);
	}
}
