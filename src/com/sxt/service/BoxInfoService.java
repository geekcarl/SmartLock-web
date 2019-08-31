package com.sxt.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.sxt.dao.BoxInfoDao;
import com.sxt.dao.DepartmentDao;
import com.sxt.dao.UserDao;
import com.sxt.po.BoxGlobals;
import com.sxt.po.BoxImages;
import com.sxt.po.BoxInfo;
import com.sxt.po.BoxInfoNew;
import com.sxt.po.BoxInfoOper;
import com.sxt.po.BoxInfoSearch;
import com.sxt.po.BoxModule;
import com.sxt.po.BoxPrivilege;
import com.sxt.po.BoxSettings;
import com.sxt.po.BoxStates;
import com.sxt.po.BoxTerminal;
import com.sxt.po.BoxTerminalUsed;
import com.sxt.po.CoreUsed;
import com.sxt.po.DTO_BoxStates_Values_Levels;
import com.sxt.po.Department;
import com.sxt.po.ModificationInfo;
import com.sxt.po.PhoneOpenLog;
import com.sxt.po.SmsSettingOper;
import com.sxt.po.SmsSettingSearch;
import com.sxt.po.User;
import com.sxt.po.WorkOrder;
import com.sxt.po.WorkOrderImage;
import com.sxt.po.WorkOrderNew;
import com.sxt.po.WorkOrderSearch;

@Service("boxInfoService")
public class BoxInfoService {
	private BoxInfoDao boxInfoDao;
	private DepartmentDao departmentDao;
	private UserDao userDao;
	
	public WorkOrder findWorkorder(Integer id) {
		return this.boxInfoDao.findWorkorder(id);
	}
	
	public void savephonelog(PhoneOpenLog p)
	{
		
		this.boxInfoDao.savephonelog(p);
	
	}
	
	
	//findWorkorderNew
	public WorkOrderNew findWorkorderNew(Integer id) {
		return this.boxInfoDao.findWorkorderNew(id);
	}
	
	public void updateWorkorder(WorkOrder wo) {
		this.boxInfoDao.updateWorkorder(wo);
	}
	
	//添加工单
	public int addWorkorder(WorkOrder order)
	{
		return this.boxInfoDao.addWorkorder(order);
	}
	
	
	public WorkOrder viewWorkOrder(Integer id) {
		
		WorkOrder result = this.boxInfoDao.findWorkorder(id);
		
		return result;
	}
	
	
	//同步到端子和纤芯状态字段中
	public int finishWorkOrder(int id, int userid)
	{
		return this.boxInfoDao.finishWorkOrder(id, userid);
	}
	
	//验证光交箱编号
	public int validBoxNo(BoxInfoOper bio)
	{
		return this.boxInfoDao.validBoxNo(bio);
	}
	
	//验证控制器
	public int validControllerId(BoxInfoOper bio)
	{
		return this.boxInfoDao.validControllerId(bio);
	}
	
	//修改端子业务信息
	public int updateLabelInfo(int id, String info)
	{
		return this.boxInfoDao.updateLabelInfo(id, info);
	}
	
	//删除面板
	public int deleteModule(int id)
	{
		return this.boxInfoDao.deleteModule(id);
	}
	
	//删除面板一行
	public int deleteRow(int id, int row)
	{
		return this.boxInfoDao.deleteRow(id, row);
	}
	
	//添加面板一行
	public int addRow(int id, int row)
	{
		return this.boxInfoDao.addRow(id, row);
	}
	
	//添加面板
	public int addModule(BoxModule bm)
	{
		return this.boxInfoDao.addModule(bm);
	}
	
	public void smsset(SmsSettingOper sso) {
		this.boxInfoDao.smsset(sso);
	}
	
	public void deleteSmsSetting(int[] ss)
	{
		this.boxInfoDao.deleteSmsSetting(ss);
	}
	
	//获取短信设置分页
	public List<Map<String, Object>> findSmsSettingByPager(HttpServletRequest request, SmsSettingSearch ds){
		return this.boxInfoDao.findSmsSettingByPager(request, ds);
	}
	
	//获取短信设置数量
	public int findSmsSettingCounts(HttpServletRequest request, SmsSettingSearch ds)
	{
		return this.boxInfoDao.findSmsSettingCounts(request, ds);
	}

	public BoxSettings getBoxSettings(int id){
		return this.boxInfoDao.getBoxSettings(id);
	}
	
	public ModificationInfo getBoxModifi(int id){
		return this.boxInfoDao.getBoxModifi(id);
	}
	
	public void updateBoxSettings(BoxSettings bs){
		this.boxInfoDao.updateBoxSettings(bs);
	}
	
	public void updateBoxModifi(ModificationInfo mi){
		this.boxInfoDao.updateBoxModifi(mi);
	}
	
	public List<BoxImages> getBoxImages(int id)
	{
		return this.boxInfoDao.getBoxImages(id);
	}
	
	public void deleteimage(int id){
		
		 this.boxInfoDao.deleteimage(id);
	}
	
	public List<WorkOrderImage> getOrderImages(int id)
	{
		return this.boxInfoDao.getOrderImages(id);
	}
	
	public BoxGlobals getBoxGlobals()
	{
		return this.boxInfoDao.getBoxGlobals();
	}
	
	public void updateBoxGlobals(BoxGlobals bg)
	{
		this.boxInfoDao.updateBoxGlobals(bg);
	}
	
	public void add(BoxInfoOper b, HttpServletRequest request){
		BoxInfo boxinfo = this.boxInfoDao.add(b);
		//如果不是超级管理员，则往数据库中添加一条光交箱权限的记录
		if (! request.getSession().getAttribute("user_name").toString().equals("admin")) {
			BoxPrivilege bp = new BoxPrivilege();
			bp.setBoxinfo(boxinfo);
			bp.setSet_date(new Date());
			User u = new User();
			u.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
			bp.setSetuser(u);
			bp.setUser(u);
			this.userDao.addBoxPrivilege(bp);
		}
		//赋予光交箱权限
		List<BoxPrivilege> old = (List<BoxPrivilege>)request.getSession().getAttribute("boxprivilege");
		BoxPrivilege temp = new BoxPrivilege();
		temp.setBoxinfo(boxinfo);
		old.add(temp);
		request.getSession().setAttribute("boxprivilege", old);
	}
	
	public List<BoxInfo> findByPager(HttpServletRequest request, BoxInfoSearch bis){
		return boxInfoDao.findByPager(request, bis);
	}
	
	//获取所有光交箱
	public List<Map<String, Object>> findAllBoxInfo() {
		return boxInfoDao.findAllBoxInfo();
	}
	
	public List<Map<String, Object>> findAll(HttpServletRequest request, BoxInfoSearch bis){
		return boxInfoDao.findAll(request, bis);
	}
	
	//获取某部门下的光交箱
	public List<Map<String, Object>> findByDepartmentId(HttpServletRequest request, Integer id, String box_no, Long controller_id)
	{
		return boxInfoDao.findByDepartmentId(request, id, box_no, controller_id);
	}
	
	//获取部门下的所有光交箱树
	public String findTreeByDepartment(HttpServletRequest request) {
		StringBuffer sb = new StringBuffer("");
		sb.append("[");
		List<Department> ds = this.departmentDao.findAllDepartment(request);
		for (int i = 0; i < ds.size(); i ++)
		{
			List <BoxInfoNew> bs = this.boxInfoDao.findAllByDepartmentId(request, ds.get(i).getId());
			if (bs.size() > 0)
			{
				sb.append("{\"id\" : \"de_" + ds.get(i).getId() + "\", \"pId\" : 0, \"type\" : 1, \"name\" : \"" + ds.get(i).getFull_name() + "\", \"open\" : true},");
				for (int j = 0; j < bs.size(); j ++)
				{
					sb.append("{\"id\" : " + bs.get(j).getId() + ", \"pId\" : \"de_" + ds.get(i).getId() + "\", \"type\" : 2, \"name\" : \"" + bs.get(j).getBox_no() + "\"},");
				}
			}
		}
		

		return sb.substring(0, sb.length() - 1) + "]";
	}
	
	public BoxInfoOper find(int id)
	{
		return boxInfoDao.find(id);
	}
	
	public int update(BoxInfoOper b)
	{
		return boxInfoDao.update(b);
	}
	
	public void delete(int[] ids) {
		boxInfoDao.delete(ids);
	}
	
	public int findCounts(HttpServletRequest request, BoxInfoSearch bis)
	{
		return boxInfoDao.findCounts(request, bis);
	}

	public BoxInfoDao getBoxInfoDao() {
		return boxInfoDao;
	}

	@Resource
	public void setBoxInfoDao(BoxInfoDao boxInfoDao) {
		this.boxInfoDao = boxInfoDao;
	}

	public DepartmentDao getDepartmentDao() {
		return departmentDao;
	}

	@Resource
	public void setDepartmentDao(DepartmentDao departmentDao) {
		this.departmentDao = departmentDao;
	}

	public UserDao getUserDao() {
		return userDao;
	}

	@Resource
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	public List<BoxStates> findAllBoxStatesByAjax(int id) {
		return this.boxInfoDao.findAllBoxStatesByAjax(id);
	}
	
	//获取所有光交箱状态DTO
	public List<DTO_BoxStates_Values_Levels> findAllBoxStatesByAjax(HttpServletRequest request) {
		return this.boxInfoDao.findAllBoxStatesByAjax(request);
	}
	
	//获取所有光交箱状态
	public List<DTO_BoxStates_Values_Levels> findAllBoxStatesByDepartmentId(HttpServletRequest request, Integer id, String box_no, Long controller_id) {
		return this.boxInfoDao.findAllBoxStatesByDepartmentId(request, id, box_no, controller_id);
	}
	
	//解除跳纤
	public List<BoxTerminalUsed> relieveJumpTerminal(int id1, int id2) {
		return this.boxInfoDao.relieveJumpTerminal(id1, id2);
	}
	
	//获取跳纤
	public List<BoxTerminal> findJumpTerminal(int id) {
		return this.boxInfoDao.findJumpTerminal(id);
	}
	
	//获取预占
	public List<BoxTerminal> findRespectTerminal(int id) {
		return this.boxInfoDao.findRespectTerminal(id);
	}
	
	//获取端子
	public BoxTerminal findTerminal(int id) {
		return this.boxInfoDao.findTerminal(id);
	}
	
	
	//获取端子名称
	public  String  findTerminalName(int id){
		
		return this.boxInfoDao.findTerminalName(id);
	
	}
	
	//获取纤芯名称
	public  String  findCoreName(int id){
			
		return this.boxInfoDao.findCoreName(id);
			
	}
	
	//跳纤
	public void jumpTerminal(int a, int b) {
	
		this.boxInfoDao.jumpTerminal(a, b);
	}
	

	//解除纤芯成端
	public void relieveCoreToTerminal(int tid) {
		this.boxInfoDao.relieveCoreToTerminal(tid);
	}
	
	//纤芯成端
	public void coreToTerminal(int tid, int oid, int cid, int bid) {
		this.boxInfoDao.coreToTerminal(tid, oid, cid, bid);
	}
	
	//纤芯直熔
	public void coreToCore(int bid, int sid, int eid) {
		this.boxInfoDao.coreToCore(bid, sid, eid);
	}
	
	//获取纤芯成端
	public CoreUsed findCoreToTerminal(int tid) {
		return this.boxInfoDao.findCoreToTerminal(tid);
	}
	
	//获取光交箱面板
	public List<BoxModule> findBoxModuleById(HttpServletRequest request, int id) {
		return this.boxInfoDao.findBoxModuleById(request, id);
	}
	
	//获取光交箱端子
	public List<BoxTerminalUsed> findBoxTerminalById(int id) {
		return this.boxInfoDao.findBoxTerminalById(id);
	}
	

	//查询工单列表
	public List<Map<String, Object>> findAllWorkOrder(WorkOrderSearch wo,HttpServletRequest request){
		return this.boxInfoDao.findAllWorkOrder(wo,request);
	}
	
	public List<WorkOrderNew> findAllWorkOrderNew(WorkOrderSearch wo,HttpServletRequest request){
		return this.boxInfoDao.findAllWorkOrderNew(wo,request);
	}
	
	public int findOrderTypeAlarmCounts(HttpServletRequest request) {
		return this.boxInfoDao.findOrderTypeAlarmCounts(request);
	}
	
	//获取工单总数量
	public int findWorkOrderCounts(WorkOrderSearch wo,HttpServletRequest request)
	{
		return this.boxInfoDao.findWorkOrderCounts(wo,request);
	}
}
