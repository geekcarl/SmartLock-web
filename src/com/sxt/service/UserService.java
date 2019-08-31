package com.sxt.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import com.sxt.dao.UserDao;
import com.sxt.po.BoxPrivilege;
import com.sxt.po.BoxPrivilegeOper;
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

@Component("userService")
public class UserService {
	private UserDao userDao;
	
	//获取部门下所有的人员
	public List<User> findByDepartmentId(int id)
	{
		return this.userDao.findByDepartmentId(id);
	}
	
	//修改密码
	public int updatepassword(int id, String old_password, String new_password)
	{
		
		return this.userDao.updatepassword(id, old_password, new_password);
	
	}
	
	//admin修改密码
	public int adminupdatepassword(int id, String new_password)
	{
		
		return this.userDao.adminupdatepassword(id, new_password);
	
	}
	
	public int findExistU(User u)
	{
		
		return this.userDao.findExistU(u);
	
	}
	
    public VersionManage getVersion(){
		
		VersionManage v = userDao.getVersion();
		return v;
	}
    
	
	//添加光交箱权限
	public void addBoxPrivilege(BoxPrivilegeOper bpo)
	{
		if (bpo.getBps() != null) { 
			for (int i = 0; i < bpo.getBps().size(); i ++) 
			{
				if (bpo.getBps().get(i).getBoxinfo() != null && bpo.getBps().get(i).getUser() != null) {
					List<Map<String, Object>> list = this.userDao.findBoxPrivilegeByBoxPrivilege(bpo.getBps().get(i));
					if (list == null || list.size() <= 0 || list.isEmpty()) {
						this.userDao.addBoxPrivilege(bpo.getBps().get(i));
					}
				}
			}
		}
	}
	
	//删除光交箱权限
	public void deleteBoxPrivilege(int[] ids)
	{
		for (int i = 0; i < ids.length; i ++) this.userDao.deleteBoxPrivilege(ids[i]);
	}
	
	//获取光交箱权限分页列表
	public List<Map<String, Object>> findBoxPrivilegeByPager(PrivilegeListSearch gs,HttpServletRequest request)
	{
		return this.userDao.findBoxPrivilegeByPager(gs,request);
	}
	
	//获取光交箱权限
	public List<BoxPrivilege> findBoxPrivilegeByUserId(int id)
	{
		return this.userDao.findBoxPrivilegeByUserId(id);
	}
	
	//获取光交箱权限总数
	public int findBoxPrivilegeCounts(PrivilegeListSearch us,HttpServletRequest request)
	{
		return this.userDao.findBoxPrivilegeCounts(us,request);
	}
	
	//删除短信
	public void deleteMessage(int[] ids)
	{
		for (int i = 0; i < ids.length; i ++) this.userDao.deleteMessage(ids[i]);
	}
	
	//获取短信分页列表
	public List<DTO_Message> findMessageByPager(GlobalSearch gs, DTO_Message msg,HttpServletRequest request)
	{
		return this.userDao.findMessageByPager(gs, msg,request);
	}
	
	//获取短信总数
	public int findMessageCounts(GlobalSearch us, DTO_Message msg,HttpServletRequest request)
	{
		return this.userDao.findMessageCounts(us, msg,request);
	}
	
	//获取角色分页列表
	public List<Role> findRoleByPager(GlobalSearch gs)
	{
		return this.userDao.findRoleByPager(gs);
	}
	
	//获取角色总数
	public int findRoleCounts(GlobalSearch us)
	{
		return this.userDao.findRoleCounts(us);
	}
	
	//获取所有角色
	public List<Role> findAllRole() {
		return this.userDao.findAllRole();
	}
	
	//删除角色
	public void deleteRole(int[] ids) {
		for (int i = 0; i < ids.length; i ++) this.userDao.deleteRole(ids[i]);
	}
	
	//获取所有权限
	public String findAllPrivilegeTree() {
		List<Privilege> ps = this.userDao.findAllPrivilege();
		StringBuffer sb = new StringBuffer("");
		sb.append("[");
		for (int i = 0; i < ps.size(); i ++)
		{
			if (ps.get(i).getParent() == null)
			{
				sb.append("{\"id\" : " + ps.get(i).getId() + ", \"pId\" : 0, \"type\" : 1, \"name\" : \"" + ps.get(i).getName() + "\", \"open\" : true},");
			}
			else
			{
				sb.append("{\"id\" : " + ps.get(i).getId() + ", \"pId\" : " + ps.get(i).getParent().getId() + ", \"type\" : 2, \"name\" : \"" + ps.get(i).getName() + "\", \"open\" : true},");
			}
		}
		return sb.substring(0, sb.length() - 1) + "]";
	}
	
	//获取所有权限
	public List<Privilege> findAllPrivilege() {
		return this.userDao.findAllPrivilege();
	}

	//添加角色及其所拥有的权限
	public void addRole(Role r) {
		this.userDao.addRole(r);
	}
	//修改角色及其所拥有的权限
	public void updateRole(Role r) {
		this.userDao.updateRole(r);
	}
	
	//获取角色
	public Role findRole(int id) {
		return this.userDao.findRole(id);
	}
	
	//添加工作卡
	public void addRFID(RFID rfid) {
		this.userDao.addRFID(rfid);
	}
	
	//查找工作卡
	public RFID findRFID(int id) {
		return this.userDao.findRFID(id);
	}
	
	//修改工作卡
	public void updateRFID(RFID rfid) {
		this.userDao.updateRFID(rfid);
	}
	
	//删除工作卡
	public void deleteRFID(int[] ids) {
		for (int i = 0; i < ids.length; i ++) this.userDao.deleteRFID(ids[i]);
	}
	
	public List<Map<String, Object>> findRFIDByPager(GlobalSearch us, RFID rfid, HttpServletRequest request){
		return this.userDao.findRFIDByPager(us, rfid, request);
	}
	
	public int findRFIDCounts(GlobalSearch us, RFID rfid, HttpServletRequest request)
	{
		return this.userDao.findRFIDCounts(us, rfid, request);
	}
	
	public List<User> findByPager(UserSearch us, HttpServletRequest request){
		return userDao.findByPager(us, request);
	}
	
	public int findCounts(UserSearch us, HttpServletRequest request)
	{
		return userDao.findCounts(us, request);
	}
	
	public User Login(User u, String ip){
		User user = userDao.Login(u, ip);
		return user;
	}
	
	public SystemInfo  findsysinfo(){
		
		SystemInfo sys  = userDao.findsysinfo();
		return sys;
	
	}
	
	
	public User findById(int id) {

		return userDao.findById(id);
	}
	
	public void update(User u) {
		userDao.update(u);
	}
	
	public int add(User u) {
		return userDao.add(u);
	}

	public UserDao getUserDao() {
		return userDao;
	}

	@Resource
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}
	
}
