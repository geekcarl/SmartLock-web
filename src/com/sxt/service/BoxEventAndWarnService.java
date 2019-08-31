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

import com.sxt.dao.BoxEventAndWarnDao;
import com.sxt.dao.DepartmentDao;
import com.sxt.dao.LockAndKeyDao;
import com.sxt.dao.UserDao;
import com.sxt.po.AlarmEvent;
import com.sxt.po.AlarmEventSearch;
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

@Service("boxEventAndWarnService")
public class BoxEventAndWarnService {
	
	private LockAndKeyDao lockandkeyDao;
	private BoxEventAndWarnDao boxEventAndWarnDao;
	
	public Map findOrderStatus(Integer id)
	{
		return this.boxEventAndWarnDao.findOrderStatus(id);
	}
	
	//获取系统配置信息
	public SysConfig findSysConfig() {
		return this.boxEventAndWarnDao.findSysConfig();
	}
	
	//审批维修申请
	public void affirmFixapply(RepairRecord rr) {
		this.boxEventAndWarnDao.affirmFixapply(rr);
	}
	
	public RepairRecord findFixApply(int id) {
		return this.boxEventAndWarnDao.findFixApply(id);
	}
	
	public void deleteFixApply(int[] ids) {
		for (int i = 0; i < ids.length; i ++) this.boxEventAndWarnDao.deleteFixApply(ids[i]);
	}
	
	//获取维修申请列表
	public List<Map<String, Object>> findFixApplyByPager(HttpServletRequest request, GlobalSearch ds){
		return this.boxEventAndWarnDao.findFixApplyByPager(request, ds);
	}
	
	//获取维修申请-数量
	public int findFixApplyCount(HttpServletRequest request)
	{
		return this.boxEventAndWarnDao.findFixApplyCount(request);
	}
	
	//获取门开关列表
	public List<DoorEvent> findDoorEventByPager(HttpServletRequest request, DoorEventSearch ds){
		return this.boxEventAndWarnDao.findDoorEventByPager(request, ds);
	}
	
	//获取门开关列表-数量
	public int findDoorEventCounts(HttpServletRequest request, DoorEventSearch ds) {
		return this.boxEventAndWarnDao.findDoorEventCounts(request, ds);
	}
	
	//获取告警列表
	public List<Map<String, Object>> findAlarmEventByPager(HttpServletRequest request, AlarmEventSearch ds){
		return this.boxEventAndWarnDao.findAlarmEventByPager(request, ds);
	}
	
	//获取告警列表-数量
	public int findAlarmEventCounts(HttpServletRequest request, AlarmEventSearch ds)
	{
		return this.boxEventAndWarnDao.findAlarmEventCounts(request, ds);
	}
	
	//删除告警记录-数量
	public void deleteAlarmEvent(DeleteAlarmForm ae)
	{
		this.boxEventAndWarnDao.deleteAlarmEvent(ae);
	}
	
	//确认告警记录
	public void affirmAlarmEvent(AlarmEvent ae)
	{
		this.boxEventAndWarnDao.affirmAlarmEvent(ae);
	}
	
	//删除告警记录-数量
	public void deleteDoorEvent(DeleteDoorForm daf)
	{
		this.boxEventAndWarnDao.deleteDoorEvent(daf);
	}

	public LockAndKeyDao getLockandkeyDao() {
		return lockandkeyDao;
	}

	@Resource
	public void setLockandkeyDao(LockAndKeyDao lockandkeyDao) {
		this.lockandkeyDao = lockandkeyDao;
	}

	public BoxEventAndWarnDao getBoxEventAndWarnDao() {
		return boxEventAndWarnDao;
	}

	@Resource
	public void setBoxEventAndWarnDao(BoxEventAndWarnDao boxEventAndWarnDao) {
		this.boxEventAndWarnDao = boxEventAndWarnDao;
	}

	
}
