package com.sxt.po;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(value={"order", "alarmevent"})
public class AlarmOrderDetails {
	private int id;
	private WorkOrderNew order;
	private AlarmEvent alarmevent;
	private BoxInfoNew boxinfo;
	private StateValue statevalue;
	private String alarm_type;
	private Date create_time;
	private int done_type;
	private Date done_time;
	private int is_deleted;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="order_id")
	public WorkOrderNew getOrder() {
		return order;
	}
	public void setOrder(WorkOrderNew order) {
		this.order = order;
	}
	
	@OneToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="alarm_event_id")
	public AlarmEvent getAlarmevent() {
		return alarmevent;
	}
	public void setAlarmevent(AlarmEvent alarmevent) {
		this.alarmevent = alarmevent;
	}
	
	@ManyToOne
	@JoinColumn(name="box_id")
	public BoxInfoNew getBoxinfo() {
		return boxinfo;
	}
	public void setBoxinfo(BoxInfoNew boxinfo) {
		this.boxinfo = boxinfo;
	}
	@ManyToOne
	@JoinColumn(name="alarm_type_id")
	public StateValue getStatevalue() {
		return statevalue;
	}
	public void setStatevalue(StateValue statevalue) {
		this.statevalue = statevalue;
	}
	public String getAlarm_type() {
		return alarm_type;
	}
	public void setAlarm_type(String alarm_type) {
		this.alarm_type = alarm_type;
	}
	public Date getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}
	public int getDone_type() {
		return done_type;
	}
	public void setDone_type(int done_type) {
		this.done_type = done_type;
	}
	public Date getDone_time() {
		return done_time;
	}
	public void setDone_time(Date done_time) {
		this.done_time = done_time;
	}
	public int getIs_deleted() {
		return is_deleted;
	}
	public void setIs_deleted(int is_deleted) {
		this.is_deleted = is_deleted;
	}
}
