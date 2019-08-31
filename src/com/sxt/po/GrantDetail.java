package com.sxt.po;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(value={"grantLog"})
public class GrantDetail {
	private int id;
	private GrantLog grantLog;
	private BoxInfoNew boxInfo;
	private Date begin_time;
	private Date end_time;
	private String remarks;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="log_id")
	public GrantLog getGrantLog() {
		return grantLog;
	}
	public void setGrantLog(GrantLog grantLog) {
		this.grantLog = grantLog;
	}
	
	@ManyToOne
	@JoinColumn(name="box_id")
	public BoxInfoNew getBoxInfo() {
		return boxInfo;
	}
	public void setBoxInfo(BoxInfoNew boxInfo) {
		this.boxInfo = boxInfo;
	}
	public Date getBegin_time() {
		return begin_time;
	}
	public void setBegin_time(Date beginTime) {
		begin_time = beginTime;
	}
	public Date getEnd_time() {
		return end_time;
	}
	public void setEnd_time(Date endTime) {
		end_time = endTime;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
}
