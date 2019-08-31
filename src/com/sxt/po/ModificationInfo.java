package com.sxt.po;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(value={"boxInfo"})
public class ModificationInfo {
	private int id;
	private BoxInfo boxinfo;
	private int flag;
	private int shake_threshold;
	private int shake_rate;
	private String center_ip;
	private int center_upd_port;
	private int is_send;
	private Date sendsuccess_time;
	private User user;
	private Date lastedittime;
	private String remarks;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@OneToOne
	@JoinColumn(name="box_id")
	public BoxInfo getBoxinfo() {
		return boxinfo;
	}
	public void setBoxinfo(BoxInfo boxinfo) {
		this.boxinfo = boxinfo;
	}
	public int getFlag() {
		return flag;
	}
	public void setFlag(int flag) {
		this.flag = flag;
	}
	public int getShake_threshold() {
		return shake_threshold;
	}
	public void setShake_threshold(int shakeThreshold) {
		shake_threshold = shakeThreshold;
	}
	public int getShake_rate() {
		return shake_rate;
	}
	public void setShake_rate(int shakeRate) {
		shake_rate = shakeRate;
	}
	public String getCenter_ip() {
		return center_ip;
	}
	public void setCenter_ip(String centerIp) {
		center_ip = centerIp;
	}
	public int getCenter_upd_port() {
		return center_upd_port;
	}
	public void setCenter_upd_port(int centerUpdPort) {
		center_upd_port = centerUpdPort;
	}
	public int getIs_send() {
		return is_send;
	}
	public void setIs_send(int isSend) {
		is_send = isSend;
	}
	@Column(updatable=false)
	public Date getSendsuccess_time() {
		return sendsuccess_time;
	}
	public void setSendsuccess_time(Date sendsuccessTime) {
		sendsuccess_time = sendsuccessTime;
	}
	@ManyToOne
	@JoinColumn(name="set_user")
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
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
}
