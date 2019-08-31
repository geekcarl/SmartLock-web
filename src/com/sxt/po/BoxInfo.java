package com.sxt.po;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;


@Entity 
public class BoxInfo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String box_no;
	private Long controller_id;
	private String controller_version;
	private String box_name;
	private String address;
	private String business_area;
	private String sim_phone_no;
	private Double longitude;
	private Double latitude;
	private Department department;
	private String box_type;
	private Integer locks_count = 0;
	private Double b_longitude;
	private Double b_latitude;
	private String k_code;
	private Department workorder_department;
	private User workorder_receive_id;
	private Integer sms_notifiable = 0;
	private String sms_reason;
	private Integer use_state = 0;
	private Date use_begindate;
	private Date use_enddate;
	private Integer is_deleted = 0;
	private User lastedituser;
	private Date lastedittime;
	private String remarks;
	private BoxVarInfo boxVarInfo;
	private Set<BoxStates> boxStates;
	private Set<BoxModule> boxModules;
	
	@Id
	@GeneratedValue
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getBox_no() {
		return box_no;
	}
	public void setBox_no(String boxNo) {
		box_no = boxNo;
	}
	public Long getController_id() {
		return controller_id;
	}
	public void setController_id(Long controllerId) {
		controller_id = controllerId;
	}
	public String getBox_name() {
		return box_name;
	}
	public void setBox_name(String boxName) {
		box_name = boxName;
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
	public void setBusiness_area(String businessArea) {
		business_area = businessArea;
	}
	public String getSim_phone_no() {
		return sim_phone_no;
	}
	public void setSim_phone_no(String simPhoneNo) {
		sim_phone_no = simPhoneNo;
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
	
	@ManyToOne
	@JoinColumn(name="department_id")
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	public String getBox_type() {
		return box_type;
	}
	public void setBox_type(String boxType) {
		box_type = boxType;
	}
	public Integer getLocks_count() {
		return locks_count;
	}
	public void setLocks_count(Integer locksCount) {
		locks_count = locksCount;
	}
	public Double getB_longitude() {
		return b_longitude;
	}
	public void setB_longitude(Double bLongitude) {
		b_longitude = bLongitude;
	}
	public Double getB_latitude() {
		return b_latitude;
	}
	public void setB_latitude(Double bLatitude) {
		b_latitude = bLatitude;
	}
	public String getK_code() {
		return k_code;
	}
	public void setK_code(String kCode) {
		k_code = kCode;
	}
	@Column(updatable=false)
	public String getController_version() {
		return controller_version;
	}
	public void setController_version(String controllerVersion) {
		controller_version = controllerVersion;
	}
	@ManyToOne
	@JoinColumn(name="workorder_department")
	public Department getWorkorder_department() {
		return workorder_department;
	}
	public void setWorkorder_department(Department workorderDepartment) {
		workorder_department = workorderDepartment;
	}
	@ManyToOne
	@JoinColumn(name="workorder_receive_id")
	public User getWorkorder_receive_id() {
		return workorder_receive_id;
	}
	public void setWorkorder_receive_id(User workorderReceiveId) {
		workorder_receive_id = workorderReceiveId;
	}
	public int getSms_notifiable() {
		return sms_notifiable;
	}
	public void setSms_notifiable(int smsNotifiable) {
		sms_notifiable = smsNotifiable;
	}
	public String getSms_reason() {
		return sms_reason;
	}
	public void setSms_reason(String smsReason) {
		sms_reason = smsReason;
	}
	public Integer getUse_state() {
		return use_state;
	}
	public void setUse_state(Integer useState) {
		use_state = useState;
	}
	@Column(updatable=false)
	public Date getUse_begindate() {
		return use_begindate;
	}
	public void setUse_begindate(Date useBegindate) {
		use_begindate = useBegindate;
	}
	@Column(updatable=false)
	public Date getUse_enddate() {
		return use_enddate;
	}
	public void setUse_enddate(Date useEnddate) {
		use_enddate = useEnddate;
	}
	public int getIs_deleted() {
		return is_deleted;
	}
	public void setIs_deleted(int isDeleted) {
		is_deleted = isDeleted;
	}
	@ManyToOne
	@JoinColumn(name="lastedituser")
	public User getLastedituser() {
		return lastedituser;
	}
	public void setLastedituser(User lastedituser) {
		this.lastedituser = lastedituser;
	}
	public Date getLastedittime() {
		return lastedittime;
	}
	public void setLastedittime(Date lastedittime) {
		this.lastedittime = lastedittime;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	@OneToOne(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.EAGER, mappedBy="boxInfo")
	@NotFound(action=NotFoundAction.IGNORE)
	public BoxVarInfo getBoxVarInfo() {
		return boxVarInfo;
	}
	public void setBoxVarInfo(BoxVarInfo boxVarInfo) {
		this.boxVarInfo = boxVarInfo;
	}
	@OneToMany(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.EAGER, mappedBy="boxInfo")
	public Set<BoxStates> getBoxStates() {
		return boxStates;
	}
	public void setBoxStates(Set<BoxStates> boxStates) {
		this.boxStates = boxStates;
	}
	@OneToMany(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.EAGER, mappedBy="boxInfo")
	public Set<BoxModule> getBoxModules() {
		return boxModules;
	}
	public void setBoxModules(Set<BoxModule> boxModules) {
		this.boxModules = boxModules;
	}
}
