package com.sxt.po;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
public class RepairRecord {
	private int id;
	private User user;
	private Department department;
	private BoxInfo boxinfo;
	private User app_user;
	private int app_result;
	private int is_create;
	private String remark;
	private Date app_time;
	private Department receive_department;
	private User receive_user;
	private Date respect_start_time;
	private Date respect_end_time;
	private WorkOrder workorder;
	private int repairtype;
	private int is_deleted;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@ManyToOne
	@JoinColumn(name="user_id")
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	@ManyToOne
	@JoinColumn(name="department_id")
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	@ManyToOne
	@JoinColumn(name="box_id")
	public BoxInfo getBoxinfo() {
		return boxinfo;
	}
	public void setBoxinfo(BoxInfo boxinfo) {
		this.boxinfo = boxinfo;
	}
	@ManyToOne
	@JoinColumn(name="appuser_id")
	public User getApp_user() {
		return app_user;
	}
	public void setApp_user(User app_user) {
		this.app_user = app_user;
	}
	public int getApp_result() {
		return app_result;
	}
	public void setApp_result(int app_result) {
		this.app_result = app_result;
	}
	public int getIs_create() {
		return is_create;
	}
	public void setIs_create(int is_create) {
		this.is_create = is_create;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Date getApp_time() {
		return app_time;
	}
	public void setApp_time(Date app_time) {
		this.app_time = app_time;
	}
	@ManyToOne
	@JoinColumn(name="receivedepartment_id")
	public Department getReceive_department() {
		return receive_department;
	}
	public void setReceive_department(Department receive_department) {
		this.receive_department = receive_department;
	}
	@ManyToOne
	@JoinColumn(name="receiveuser_id")
	public User getReceive_user() {
		return receive_user;
	}
	public void setReceive_user(User receive_user) {
		this.receive_user = receive_user;
	}
	public Date getRespect_start_time() {
		return respect_start_time;
	}
	public void setRespect_start_time(Date respect_start_time) {
		this.respect_start_time = respect_start_time;
	}
	public Date getRespect_end_time() {
		return respect_end_time;
	}
	public void setRespect_end_time(Date respect_end_time) {
		this.respect_end_time = respect_end_time;
	}
	
	@OneToOne
	@NotFound(action=NotFoundAction.IGNORE)
	@JoinColumn(name="workorder_id")
	public WorkOrder getWorkorder() {
		return workorder;
	}
	public void setWorkorder(WorkOrder workorder) {
		this.workorder = workorder;
	}
	public int getRepairtype() {
		return repairtype;
	}
	public void setRepairtype(int repairtype) {
		this.repairtype = repairtype;
	}
	public int getIs_deleted() {
		return is_deleted;
	}
	public void setIs_deleted(int is_deleted) {
		this.is_deleted = is_deleted;
	}
}
