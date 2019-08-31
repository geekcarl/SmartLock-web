package com.sxt.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.classic.Session;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sxt.dao.DepartmentDao;
import com.sxt.dao.LockAndKeyDao;
import com.sxt.dao.UserDao;
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
import com.sxt.po.User;

@Service("lockandkeyService")
public class LockAndKeyService {
	
	private LockAndKeyDao lockandkeyDao;
	private DepartmentDao departmentDao;
	
	//获取用户开门授权数量
			public int findUserOpenGrantLogCounts(GrantLogSearch ds, HttpServletRequest request)
			{
				return this.lockandkeyDao.findUserOpenGrantLogCounts(ds, request);
			}
		
			//获取用户开门授权列表
			public List<GrantLog> findUserOpenGrantLogByPager(GrantLogSearch ds, HttpServletRequest request){
				return this.lockandkeyDao.findUserOpenGrantLogByPager(ds, request);
			}
			
			//修改用户授权
			public void updateUserOpenGrantLog(GrantLog gl){
				gl.setGrant_time(new Date());
				this.lockandkeyDao.updateUserOpenGrantLog(gl);
			}
			
			//添加用户开门授权
			public void addUserOpenGrantLog(GrantLog li){
				li.setGrant_time(new Date());
				this.lockandkeyDao.addUserOpenGrantLog(li);
			}
			
			
	
	
	//删除锁类型
	public void deleteLockTypeInfo(int[] ids)
	{
		this.lockandkeyDao.deleteLockTypeInfo(ids);
	}
	
	//删除钥匙类型
	public void deleteKeyTypeInfo(int[] ids)
	{
		this.lockandkeyDao.deleteKeyTypeInfo(ids);
	}
	
	//添加锁
	public void addLock(LockInfo li){
		if (li.getLock_code() != null && ! li.getLock_code().equals("")) {
			List<Map<String, Object>> result = this.lockandkeyDao.findLock(li);
			if (result == null || result.size() <= 0) {
				this.lockandkeyDao.addLock(li);
			}
		}
	}
	
	//删除锁
	public void deleteLockInfo(int[] ids)
	{
		this.lockandkeyDao.deleteLockInfo(ids);
	}
	
	//添加锁类型
	public void addLockType(LockTypeInfo li){
		this.lockandkeyDao.addLockType(li);
	}
	
	//获取锁列表
	public List<LockInfo> findLockInfoByPager(LockInfoSearch ds,HttpServletRequest request){
		return this.lockandkeyDao.findLockInfoByPager(ds,request);
	}
	
	//获取锁类型列表
	public List<LockTypeInfo> findLockTypeInfoByPager(LockTypeInfoSearch ds){
		return this.lockandkeyDao.findLockTypeInfoByPager(ds);
	}
	
	//获取所有锁类型
	public List<LockTypeInfo> findAllLockType(){
		return this.lockandkeyDao.findAllLockType();
	}
	
	
	//获取锁数量
	public int findLockCounts(LockInfoSearch ds,HttpServletRequest request)
	{
		return this.lockandkeyDao.findLockCounts(ds,request);
	}
	
	//获取锁类型数量
	public int findLockTypeCounts()
	{
		return this.lockandkeyDao.findLockTypeCounts();
	}
	
	////////////////////////////////////
	
	//添加钥匙
	public void addKey(KeyInfo li){
		this.lockandkeyDao.addKey(li);
	}
	
	//查看钥匙是否存在
	public int findExistKey(KeyInfo li){
		return this.lockandkeyDao.findExistKey(li);
	}
	
	
	//
	public int findupdateExistKey(KeyInfo li){
		return this.lockandkeyDao.findupdateExistKey(li);
	}
	
	//获取钥匙详情
	public KeyInfo findKey(int id){
		 return this.lockandkeyDao.findKey(id);
	}
	
	//修改钥匙
	public void updateKey(KeyInfo ki){
		this.lockandkeyDao.updateKey(ki);
	}
	
	//删除钥匙
	public void deleteKey(int[] ids){
		this.lockandkeyDao.deleteKey(ids);
	}
	
	//添加钥匙类型
	public void addKeyType(KeyTypeInfo li){
		this.lockandkeyDao.addKeyType(li);
	}
	
	//获取钥匙列表
	public List<Map<String, Object>> findKeyInfoByPager(KeyInfoSearch ds,HttpServletRequest request){
		return this.lockandkeyDao.findKeyInfoByPager(ds,request);
	}
	
	//获取部门下的所有人员树
	public String findTreeByDepartment(HttpServletRequest request) {
		StringBuffer sb = new StringBuffer("");
		sb.append("[");
		List<Department> ds = this.departmentDao.findAllDepartment(request);
		for (int i = 0; i < ds.size(); i ++)
		{
			List <KeyInfo> bs = this.lockandkeyDao.findAllKeyByDepartmentId(request,ds.get(i).getId());
			if (bs.size() > 0)
			{
				sb.append("{\"id\" : \"de_" + ds.get(i).getId() + "\", \"pId\" : 0, \"type\" : 1, \"name\" : \"" + ds.get(i).getFull_name() + "\", \"open\" : true},");
				for (int j = 0; j < bs.size(); j ++)
				{
					sb.append("{\"id\" : " + bs.get(j).getId() + ", \"pId\"  : \"de_" + ds.get(i).getId() + "\", \"type\" : 2, \"operId\" : " + (bs.get(j).getOperators() == null ? 0 : bs.get(j).getOperators().getId()) + ", \"operName\" : \"" + (bs.get(j).getOperators() == null ? 0 : bs.get(j).getOperators().getFull_name()) + "\", \"name\" : \"" + bs.get(j).getRfid() + "\"},");
				}
			}
		}
		return sb.substring(0, sb.length() - 1) + "]";
	}
	
	//获取钥匙类型列表
	public List<KeyTypeInfo> findKeyTypeInfoByPager(KeyTypeInfoSearch ds){
		return this.lockandkeyDao.findKeyTypeInfoByPager(ds);
	}
	
	//获取所有钥匙类型
	public List<KeyTypeInfo> findAllKeyType(){
		return this.lockandkeyDao.findAllKeyType();
	}

	//获取所有钥匙
	public List<KeyInfo> findAllKey(){
		return this.lockandkeyDao.findAllKey();
	}
	
	
	//获取钥匙数量
	public int findKeyCounts(KeyInfoSearch ds,HttpServletRequest request)
	{
		return this.lockandkeyDao.findKeyCounts(ds,request);
	}
	
	//获取钥匙类型数量
	public int findKeyTypeCounts()
	{
		return this.lockandkeyDao.findKeyTypeCounts();
	}
	
	
	//添加钥匙授权
	public void addGrantLog(GrantLog li){
		li.setGrant_time(new Date());
		this.lockandkeyDao.addGrantLog(li);
	}
	

	//修改钥匙授权
	public void updateGrantLog(GrantLog gl){
		gl.setGrant_time(new Date());
		this.lockandkeyDao.updateGrantLog(gl);
	}
	
	//删除钥匙授权
	public void deleteGrantLog(int[] ids){
		this.lockandkeyDao.deleteGrantLog(ids);
	}
	
	//获取钥匙授权列表
	public List<GrantLog> findGrantLogByPager(GrantLogSearch ds, HttpServletRequest request){
		return this.lockandkeyDao.findGrantLogByPager(ds, request);
	}
	
	//获取钥匙授权信息
	public GrantLog findGrantLogById(int id){
		return this.lockandkeyDao.findGrantLogById(id);
	}
	
	
	//获取钥匙授权数量
	public int findGrantLogCounts(GrantLogSearch ds, HttpServletRequest request)
	{
		return this.lockandkeyDao.findGrantLogCounts(ds, request);
	}
	

	public LockAndKeyDao getLockandkeyDao() {
		return lockandkeyDao;
	}

	@Resource
	public void setLockandkeyDao(LockAndKeyDao lockandkeyDao) {
		this.lockandkeyDao = lockandkeyDao;
	}

	public DepartmentDao getDepartmentDao() {
		return departmentDao;
	}

	@Resource
	public void setDepartmentDao(DepartmentDao departmentDao) {
		this.departmentDao = departmentDao;
	}

	
}
