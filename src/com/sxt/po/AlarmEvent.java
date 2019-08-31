package com.sxt.po;

import java.math.BigInteger;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
public class AlarmEvent {
	private int id;
	private BoxInfo boxinfo;
	private StateValue stateValue;
	private String alarm_type;
	private Long controller_id;
	private String address;
	private String department;
	private Date alarm_time;
	private String alarm_keys;
	private String alarm_operators;
	private String alarm_rfids;
	private int is_affirmed;
	private Date affirm_time;
	private String affirm_user;
	private String remarks;
	private AlarmOrderDetails aods;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	@JoinColumn(name="alarm_type_id")
	public StateValue getStateValue() {
		return stateValue;
	}
	public void setStateValue(StateValue stateValue) {
		this.stateValue = stateValue;
	}
	public String getAlarm_type() {
		return alarm_type;
	}
	public void setAlarm_type(String alarm_type) {
		this.alarm_type = alarm_type;
	}
	public Long getController_id() {
		return controller_id;
	}
	public void setController_id(Long controller_id) {
		this.controller_id = controller_id;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public Date getAlarm_time() {
		return alarm_time;
	}
	public void setAlarm_time(Date alarm_time) {
		this.alarm_time = alarm_time;
	}
	public String getAlarm_keys() {
		return alarm_keys;
	}
	public void setAlarm_keys(String alarm_keys) {
		this.alarm_keys = alarm_keys;
	}
	public String getAlarm_operators() {
		return alarm_operators;
	}
	public void setAlarm_operators(String alarm_operators) {
		this.alarm_operators = alarm_operators;
	}
	public String getAlarm_rfids() {
		return alarm_rfids;
	}
	public void setAlarm_rfids(String alarm_rfids) {
		this.alarm_rfids = alarm_rfids;
	}
	public int getIs_affirmed() {
		return is_affirmed;
	}
	public void setIs_affirmed(int is_affirmed) {
		this.is_affirmed = is_affirmed;
	}
	public Date getAffirm_time() {
		return affirm_time;
	}
	public void setAffirm_time(Date affirm_time) {
		this.affirm_time = affirm_time;
	}
	public String getAffirm_user() {
		return affirm_user;
	}
	public void setAffirm_user(String affirm_user) {
		this.affirm_user = affirm_user;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	@OneToOne(cascade={CascadeType.REFRESH, CascadeType.REMOVE},fetch=FetchType.EAGER, mappedBy="alarmevent")
	public AlarmOrderDetails getAods() {
		return aods;
	}
	public void setAods(AlarmOrderDetails aods) {
		this.aods = aods;
	}
}
