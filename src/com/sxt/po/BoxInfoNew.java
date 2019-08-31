package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity 
@Table(name="boxinfo")
public class BoxInfoNew {
	private int id;
	private String box_no;
	private Long controller_id;
	private String box_name;
	private String address;
	private String business_area;
	private String sim_phone_no;
	private Double longitude;
	private Double latitude;
	private Integer department_id;
	private String box_type;
	private Integer locks_count;
	private Double b_longitude;
	private Double b_latitude;
	private String k_code;
	private String remarks;
	private Integer use_state;
	private String use_begindate;
	private String  use_enddate;
	private Integer workorder_department;
	private Integer workorder_receive_id;
	private Integer is_deleted;
	
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getBox_no() {
		return box_no;
	}
	public void setBox_no(String box_no) {
		this.box_no = box_no;
	}
	public Long getController_id() {
		return controller_id;
	}
	public void setController_id(Long controller_id) {
		this.controller_id = controller_id;
	}
	public String getBox_name() {
		return box_name;
	}
	public void setBox_name(String box_name) {
		this.box_name = box_name;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getBusiness_area() {
		return business_area;
	}
	public void setBusiness_area(String business_area) {
		this.business_area = business_area;
	}
	public String getSim_phone_no() {
		return sim_phone_no;
	}
	public void setSim_phone_no(String sim_phone_no) {
		this.sim_phone_no = sim_phone_no;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public String getBox_type() {
		return box_type;
	}
	public void setBox_type(String box_type) {
		this.box_type = box_type;
	}
	public Integer getLocks_count() {
		return locks_count;
	}
	public void setLocks_count(Integer locks_count) {
		this.locks_count = locks_count;
	}
	public Double getB_longitude() {
		return b_longitude;
	}
	public void setB_longitude(Double b_longitude) {
		this.b_longitude = b_longitude;
	}
	public Double getB_latitude() {
		return b_latitude;
	}
	public void setB_latitude(Double b_latitude) {
		this.b_latitude = b_latitude;
	}
	public String getK_code() {
		return k_code;
	}
	public void setK_code(String k_code) {
		this.k_code = k_code;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public Integer getUse_state() {
		return use_state;
	}
	public void setUse_state(Integer use_state) {
		this.use_state = use_state;
	}
	public String getUse_begindate() {
		return use_begindate;
	}
	public void setUse_begindate(String use_begindate) {
		this.use_begindate = use_begindate;
	}
	public String getUse_enddate() {
		return use_enddate;
	}
	public void setUse_enddate(String use_enddate) {
		this.use_enddate = use_enddate;
	}
	public Integer getWorkorder_department() {
		return workorder_department;
	}
	public void setWorkorder_department(Integer workorder_department) {
		this.workorder_department = workorder_department;
	}
	public Integer getWorkorder_receive_id() {
		return workorder_receive_id;
	}
	public void setWorkorder_receive_id(Integer workorder_receive_id) {
		this.workorder_receive_id = workorder_receive_id;
	}
	public Integer getDepartment_id() {
		return department_id;
	}
	public void setDepartment_id(Integer department_id) {
		this.department_id = department_id;
	}
	public Integer getIs_deleted() {
		return is_deleted;
	}
	public void setIs_deleted(Integer is_deleted) {
		this.is_deleted = is_deleted;
	}

	
	

	
	
	
	
}
