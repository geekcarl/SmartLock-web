package com.sxt.dao;

import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.classic.Session;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.sxt.po.BoxPrivilege;
import com.sxt.po.DTO_Message;
import com.sxt.po.GlobalSearch;
import com.sxt.po.Privilege;
import com.sxt.po.PrivilegeListSearch;
import com.sxt.po.RFID;
import com.sxt.po.Role;
import com.sxt.po.SystemInfo;
import com.sxt.po.User;
import com.sxt.po.UserSearch;
import com.sxt.po.VersionManage;
import com.sxt.utils.Md5;
import com.sxt.utils.PrivilegeControl;

@Component("userDao")
public class UserDao {
	@Resource
	private HibernateTemplate hibernateTemplate;
	
	//获取指定部门下所有的人员
	public List<User> findByDepartmentId(int id)
	{
		return this.hibernateTemplate.find("from User u where u.department.id = ?", id);
	}
	
	//修改密码
	public int updatepassword(int id, String old_password, String new_password)
	{
		List<User> temp = this.hibernateTemplate.find("from User u where u.id = ? and u.passwd = ?", id, Md5.toMD5(old_password));
		if (temp.size() > 0)
		{
			this.hibernateTemplate.bulkUpdate("update User u set u.passwd = ? where u.id = ?", Md5.toMD5(new_password), id);
		}
		else
		{
			return 0;
		}
		return 1;
	}
	
	
	//admin修改密码
	public int adminupdatepassword(int id, String new_password)
	{
		this.hibernateTemplate.bulkUpdate("update User u set u.passwd = ? where u.id = ?", Md5.toMD5(new_password), id);
		
		return 1;
	}
	
     public  VersionManage getVersion(){
		
		List<VersionManage> v = hibernateTemplate.find("from VersionManage v ");
		if (v.size() > 0)
		{
			return v.get(0);
		}
		else
		{
			return null;
		}
		
	 }
	
	//添加光交箱权限
	public void addBoxPrivilege(BoxPrivilege bp)
	{
		this.hibernateTemplate.save(bp);
	}
	
	public List<Map<String, Object>> findBoxPrivilegeByBoxPrivilege(BoxPrivilege bp) {
		String sql = "select new map(b.id as id) from BoxPrivilege b where b.boxinfo.id = " + bp.getBoxinfo().getId() + " and b.user.id = " + bp.getUser().getId();
		List<Map<String, Object>> result = this.hibernateTemplate.find(sql);
		return result;
	}
	
	//删除光交箱权限
	public void deleteBoxPrivilege(int id)
	{
		this.hibernateTemplate.bulkUpdate("delete from BoxPrivilege where id = ?", id);
	}
	
	//获取光交箱权限分页列表
	public List<Map<String, Object>> findBoxPrivilegeByPager(PrivilegeListSearch gs,HttpServletRequest request)
	{
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		String boxes = PrivilegeControl.getBoxes(request);
		if(! boxes.equals("(-1)")){
			sb.append("select new map(b.id as id, bi.box_no as boxinfo, u1.user_name as user_name, u1.full_name as user, u2.full_name as setuser, b.set_date as set_date) from BoxPrivilege b left join b.boxinfo as bi left join b.user as u1 left join b.setuser as u2 where bi.id in " + boxes + " and bi.is_deleted = 0");
		}
		else
		{
			sb.append("select new map(b.id as id, bi.box_no as boxinfo,u1.user_name as user_name, u1.full_name as user, u2.full_name as setuser, b.set_date as set_date) from BoxPrivilege b left join b.boxinfo as bi left join b.user as u1 left join b.setuser as u2 where bi.department.id in " + deps + " and bi.is_deleted = 0 ");
		}
		if (gs.getBox_no() != null && ! gs.getBox_no().equals(""))
		{
			sb.append(" and bi.box_no like '%" + gs.getBox_no() + "%'");
		}
		if (gs.getUser_name() != null && ! gs.getUser_name().equals(""))
		{
			sb.append(" and u1.user_name like '%" + gs.getUser_name() + "%'");
		}
		if (gs.getFull_name() != null && ! gs.getFull_name().equals(""))
		{
			sb.append(" and u1.full_name like '%" + gs.getFull_name() + "%'");
		}
		if (gs.getSort() != null && ! gs.getSort().equals(""))
		{
			sb.append("order by b." + gs.getSort() + " " + gs.getOrder() + " ");
		}else
		{
			sb.append(" order by b.set_date desc ");
		}
		List<Map<String, Object>> bp = this.getListForPage(sb.toString(), (gs.getPage() - 1) * gs.getRows(), gs.getRows());
		return bp;
	}
	
	//获取光交箱权限
	public List<BoxPrivilege> findBoxPrivilegeByUserId(int id)
	{
		List<BoxPrivilege> bp = this.hibernateTemplate.find("from BoxPrivilege b where b.user.id = ?", id);
		return bp;
	}
	
	//获取光交箱权限总数
	public int findBoxPrivilegeCounts(PrivilegeListSearch us,HttpServletRequest request)
	{
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		String boxes = PrivilegeControl.getBoxes(request);
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			if(! boxes.equals("(-1)")){
				sb.append("select count(*) from BoxPrivilege bp where bp.boxinfo.id in "+ boxes +" and bp.boxinfo.is_deleted = 0");
			}
			else
			{
				sb.append("select count(*) from BoxPrivilege bp where bp.boxinfo.department.id in "+ deps +" and bp.boxinfo.is_deleted = 0");
			}
			if (us.getBox_no() != null && ! us.getBox_no().equals(""))
			{
				sb.append(" and bp.boxinfo.box_no like '%" + us.getBox_no() + "%'");
			}
			if (us.getUser_name() != null && ! us.getUser_name().equals(""))
			{
				sb.append(" and bp.user.user_name like '%" + us.getUser_name() + "%'");
			}
			if (us.getFull_name() != null && ! us.getFull_name().equals(""))
			{
				sb.append(" and bp.user.full_name like '%" + us.getFull_name() + "%'");
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
	
	//删除短信
	public void deleteMessage(int id)
	{
		this.hibernateTemplate.bulkUpdate("delete from Smsserver_out where id = ?", id);
	}
	
	//获取短信分页列表
	public List<DTO_Message> findMessageByPager(GlobalSearch gs, DTO_Message msg ,HttpServletRequest request)
	{
		StringBuffer sb = new StringBuffer();
		String deps=PrivilegeControl.getDepartments(request);
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		sb.append("select new com.sxt.po.DTO_Message(so.id, so.recipient, u.full_name, u.department.name, so.text, so.create_date, so.sent_date, so.errors) from Smsserver_out so, User u where so.recipient = u.phone_no and u.is_deleted = 0  and u.department.id in "+ deps +" ");
	
		if (msg.getFull_name() != null && ! msg.getFull_name().equals(""))
		{
			sb.append(" and u.full_name like '%" + msg.getFull_name() + "%'");
		}
		if (msg.getCreate_date() != null)
		{
			sb.append(" and DateDiff(so.create_date,'" + df.format(msg.getCreate_date()) + "')=0");
		}
		if (gs.getSort() != null && ! gs.getSort().equals(""))
		{
			sb.append(" order by so." + gs.getSort() + " " + gs.getOrder() + " ");
		}
		else
		{
			sb.append(" order by so.create_date desc ");
		}
		
		List<DTO_Message> s = this.getListForPage(sb.toString(), (gs.getPage() - 1) * gs.getRows(), gs.getRows());
		return s;
	}
	
	//获取短信总数
	public int findMessageCounts(GlobalSearch us, DTO_Message msg,HttpServletRequest request)
	{
		StringBuffer sb = new StringBuffer();
		String deps=PrivilegeControl.getDepartments(request);
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			sb.append("select count(*) from Smsserver_out so, User u where so.recipient = u.phone_no and u.department.id in "+ deps +"");
			if (msg.getFull_name() != null && ! msg.getFull_name().equals(""))
			{
				sb.append(" and u.full_name like '%" + msg.getFull_name() + "%'");
			}
			if (msg.getCreate_date() != null)
			{
				sb.append(" and DateDiff(so.create_date,'" + df.format(msg.getCreate_date()) + "')=0");
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
		
	
	//获取角色分页列表
	public List<Role> findRoleByPager(GlobalSearch gs)
	{
		StringBuffer sb = new StringBuffer();
		sb.append("from Role r where 0=0 ");
		if (gs.getSort() != null && ! gs.getSort().equals(""))
		{
			sb.append("order by r." + gs.getSort() + " " + gs.getOrder() + " ");
		}
		List<Role> r = this.getListForPage(sb.toString(), (gs.getPage() - 1) * gs.getRows(), gs.getRows());
		return r;
	}
	
	//获取角色总数
	public int findRoleCounts(GlobalSearch us)
	{
		StringBuffer sb = new StringBuffer();
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			sb.append("select count(*) from Role r ");
			Query q = session.createQuery(sb.toString());
			count = (Long)q.uniqueResult();
		}
		finally
		{
			session.close();
		}
		return count.intValue();
	}
	
	//获取所有角色
	public List<Role> findAllRole() {
		return this.hibernateTemplate.find("from Role r");
	}
	
	//获取所有权限
	public List<Privilege> findAllPrivilege() {
		return this.hibernateTemplate.find("from Privilege p order by p.sequence");
	}
	
	//添加角色及其所拥有的权限
	public void addRole(Role r) {
		this.hibernateTemplate.save(r);
		for (int i = 0; i < r.getRps().size(); i ++)
		{
			r.getRps().get(i).setRole(r);
			this.hibernateTemplate.save(r.getRps().get(i));
		}
	}
	
	//修改角色及其所拥有的权限
	public void updateRole(Role r) {
		
		this.hibernateTemplate.update(r);
		
		if (r.getRps().size() > 0)
		{
			this.hibernateTemplate.bulkUpdate("delete from RolePrivileges r where r.role.id = ?", r.getId());
			for (int i = 0; i < r.getRps().size(); i ++)
			{
				this.hibernateTemplate.save(r.getRps().get(i));
			}
		}
	}
	
	//获取角色
	public Role findRole(int id) {
		return this.hibernateTemplate.get(Role.class, id);
	}
	
	//删除角色
	public void deleteRole(int id) {
		this.hibernateTemplate.bulkUpdate("update User u set u.role = null where u.role.id = ?", id);
		this.hibernateTemplate.bulkUpdate("delete from RolePrivileges r where r.role.id = ?", id);
		this.hibernateTemplate.bulkUpdate("delete from Role r where r.id = ?", id);
	}
	
	//添加工作卡
	public void addRFID(RFID rfid) {
		this.hibernateTemplate.save(rfid);
	}
	
	//查找工作卡
	public RFID findRFID(int id) {
		return this.hibernateTemplate.get(RFID.class, id);
	}
	
	//修改工作卡
	public void updateRFID(RFID rfid) {
		this.hibernateTemplate.update(rfid);
	}
	
	//删除工作卡
	public void deleteRFID(int id) {
		this.hibernateTemplate.bulkUpdate("delete from RFID r where r.id = ?", id);
	}
	
	public List<Map<String, Object>> findRFIDByPager(GlobalSearch us, RFID rfid, HttpServletRequest request){
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		sb.append("select new map(r.id as id, r.type as type, r.status as status, d.name as dep, u1.full_name as user, u2.full_name as manager, r.remark as remark) from RFID r left join r.user as u1 left join r.manager as u2 left join r.dep as d where 0=0 and d.id in " + deps);
		if (rfid.getType() != null && ! rfid.getType().equals(""))
		{
			sb.append(" and r.type like '%" + rfid.getType() + "%' ");
		}
		if (rfid.getUser() != null)
		{
			sb.append(" and u1.full_name like '%" + rfid.getUser().getFull_name() + "%' ");
		}
		if (us.getSort() != null && ! us.getSort().equals(""))
		{
			sb.append("order by r." + us.getSort() + " " + us.getOrder() + " ");
		}
		List<Map<String, Object>> r = this.getListForPage(sb.toString(), (us.getPage() - 1) * us.getRows(), us.getRows());
		return r;
	}
	
	public int findRFIDCounts(GlobalSearch us, RFID rfid, HttpServletRequest request)
	{
		StringBuffer sb = new StringBuffer();
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		String deps = PrivilegeControl.getDepartments(request);
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			sb.append("select count(*) from RFID r left join r.dep as d where 0=0 and d.id in " + deps);
			if (rfid.getType() != null && ! rfid.getType().equals(""))
			{
				sb.append(" and r.type like '%" + rfid.getType() + "%' ");
			}
			if (rfid.getUser() != null)
			{
				sb.append(" and r.user.full_name like '%" + rfid.getUser().getFull_name() + "%' ");
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
	
	public List<User> findByPager(UserSearch us, HttpServletRequest request){
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		Object query = request.getSession().getAttribute("department_query");
		if (query != null)
		{
			sb.append("from User u where u.is_deleted=0 and u.department.id in " + deps + " ");
		}
		else
		{
			sb.append("from User u where u.is_deleted=0 ");
		}
		if (us.getUser_name() != null && ! us.getUser_name().equals(""))
		{
			sb.append(" and u.user_name like '%" + us.getUser_name() + "%' ");
		}
		if (us.getDepartment_name() != null && ! us.getDepartment_name().equals(""))
		{
			sb.append(" and u.department.name like '%" + us.getDepartment_name() + "%' ");
		}
		if (us.getFull_name() != null && ! us.getFull_name().equals(""))
		{
			sb.append(" and u.full_name like '%" + us.getFull_name() + "%' ");
		}
		if (us.getIs_login() > 0)
		{
			sb.append(" and u.is_login = " + (us.getIs_login() - 1) + " ");
		}
		if (us.getLast_login_ip() != null && ! us.getLast_login_ip().equals(""))
		{
			sb.append(" and u.address = '" + us.getLast_login_ip() + "' ");
		}
		if (us.getPhone_no() != null && ! us.getPhone_no().equals(""))
		{
			sb.append(" and u.phone_no = '" + us.getPhone_no() + "' ");
		}
		if (us.getSex() > 0)
		{
			sb.append(" and u.sex = " + (us.getSex() - 1) + " ");
		}
		if (us.getSort() != null && ! us.getSort().equals(""))
		{
			sb.append("order by u." + us.getSort() + " " + us.getOrder() + " ");
		}
		else{
			
			sb.append("order by u.id desc ");
		}
		List<User> u = this.getListForPage(sb.toString(), (us.getPage() - 1) * us.getRows(), us.getRows());
		return u;
	}
	
	public int findCounts(UserSearch us, HttpServletRequest request)
	{
		StringBuffer sb = new StringBuffer();
		String deps = PrivilegeControl.getDepartments(request);
		SessionFactory sf = hibernateTemplate.getSessionFactory(); 
		Session session = sf.getCurrentSession();
		Long count = new Long(0);
		try
		{
			Object query = request.getSession().getAttribute("department_query");
			if (query != null)
			{
				sb.append("select count(*) from User u where u.is_deleted=0and u.department.id in " + deps + " ");
			}
			else
			{
				sb.append("select count(*) from User u where u.is_deleted=0");
			}
			if (us != null)
			{
				if (us.getUser_name() != null && ! us.getUser_name().equals(""))
				{
					sb.append(" and u.user_name like '%" + us.getUser_name() + "%' ");
				}
				if (us.getDepartment_name() != null && ! us.getDepartment_name().equals(""))
				{
					sb.append(" and u.department.name like '%" + us.getDepartment_name() + "%' ");
				}
				if (us.getFull_name() != null && ! us.getFull_name().equals(""))
				{
					sb.append(" and u.full_name like '%" + us.getFull_name() + "%' ");
				}
				if (us.getIs_login() > 0)
				{
					sb.append(" and u.is_login = " + (us.getIs_login() - 1) + " ");
				}
				if (us.getLast_login_ip() != null && ! us.getLast_login_ip().equals(""))
				{
					sb.append(" and u.address = '" + us.getLast_login_ip() + "' ");
				}
				if (us.getPhone_no() != null && ! us.getPhone_no().equals(""))
				{
					sb.append(" and u.phone_no = '" + us.getPhone_no() + "' ");
				}
				if (us.getSex() > 0)
				{
					sb.append(" and u.sex = " + (us.getSex() - 1) + " ");
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
	
	public User Login(User u, String ip){
		List<User> users = hibernateTemplate.find("from User u where u.user_name=? and u.passwd=? and is_login = 1 and is_deleted = 0 ", u.getUser_name(), Md5.toMD5(u.getPasswd()));
		if (users.size() > 0)
		{
			this.hibernateTemplate.bulkUpdate("update User u set last_login_ip = ?, last_login_time = now() where u.id = ?", ip, users.get(0).getId());
			return users.get(0);
		}
		else
		{
			return null;
		}
	}
	
	public User findById(int id) {

		return hibernateTemplate.get(User.class, id);
	}
	
	
	public  SystemInfo findsysinfo(){
		
		
		List<SystemInfo> sys = hibernateTemplate.find("from SystemInfo");
		if (sys.size() > 0)
		{
			
			return sys.get(0);
		}
		else
		{
			return null;
		}
		
	}
	
	public void update(User u) {
		
		hibernateTemplate.update(u);
	}
	
	public int add(User u) {
		List<User> users = this.hibernateTemplate.find("from User u where u.user_name = ?  and u.is_deleted = 0", u.getUser_name());
		if (users.size() <= 0)
		{
			u.setPasswd(Md5.toMD5(u.getPasswd()));
			this.hibernateTemplate.save(u);
		}
		else
		{
			return 0;
		}
		return 1;
	}
	
	public int findExistU(User u) {
		List<User> users = this.hibernateTemplate.find("from User u where u.user_name = ?  and u.is_deleted = 0  and u.id <>?", u.getUser_name(),u.getId());
		if (users != null && users.size()> 0)
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}


	public HibernateTemplate getHibernateTemplate() {
		return hibernateTemplate;
	}

	public void setHibernateTemplate(HibernateTemplate hibernateTemplate) {
		this.hibernateTemplate = hibernateTemplate;
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
}
