package com.sxt.po;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Set;


public class BoxInfoOper {
	private Integer id;
	private String box_no;
	private Long controller_id;
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
	private Integer is_deleted;
	private Integer use_state = 0;
	private Date use_begindate;
	private Date use_enddate;
	private User lastedituser;
	private Date lastedittime;
	private Integer box_setting_flag = 0;
	private Integer modificationInfo_flag = 0;
	private Integer dbm = 0;
	private String remarks;
	private List<BoxStates> boxStates;
	private List<BoxModule> boxModules;
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
	public Department getWorkorder_department() {
		return workorder_department;
	}
	public void setWorkorder_department(Department workorderDepartment) {
		workorder_department = workorderDepartment;
	}
	public User getWorkorder_receive_id() {
		return workorder_receive_id;
	}
	public void setWorkorder_receive_id(User workorderReceiveId) {
		workorder_receive_id = workorderReceiveId;
	}
	public Integer getSms_notifiable() {
		return sms_notifiable;
	}
	public void setSms_notifiable(Integer smsNotifiable) {
		sms_notifiable = smsNotifiable;
	}
	public String getSms_reason() {
		return sms_reason;
	}
	public void setSms_reason(String smsReason) {
		sms_reason = smsReason;
	}
	public Integer getIs_deleted() {
		return is_deleted;
	}
	public void setIs_deleted(Integer is_deleted) {
		this.is_deleted = is_deleted;
	}
	public Integer getUse_state() {
		return use_state;
	}
	public void setUse_state(Integer useState) {
		use_state = useState;
	}
	public Date getUse_begindate() {
		return use_begindate;
	}
	public void setUse_begindate(Date useBegindate) {
		use_begindate = useBegindate;
	}
	public Date getUse_enddate() {
		return use_enddate;
	}
	public void setUse_enddate(Date useEnddate) {
		use_enddate = useEnddate;
	}
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
	public Integer getBox_setting_flag() {
		return box_setting_flag;
	}
	public void setBox_setting_flag(Integer boxSettingFlag) {
		box_setting_flag = boxSettingFlag;
	}
	public Integer getModificationInfo_flag() {
		return modificationInfo_flag;
	}
	public void setModificationInfo_flag(Integer modificationInfoFlag) {
		modificationInfo_flag = modificationInfoFlag;
	}
	public Integer getDbm() {
		return dbm;
	}
	public void setDbm(Integer dbm) {
		this.dbm = dbm;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public List<BoxStates> getBoxStates() {
		return boxStates;
	}
	public void setBoxStates(List<BoxStates> boxStates) {
		this.boxStates = boxStates;
	}
	public List<BoxModule> getBoxModules() {
		return boxModules;
	}
	public void setBoxModules(List<BoxModule> boxModules) {
		this.boxModules = boxModules;
	}

}
