package com.sxt.po;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(value={"boxinfo"})
public class BoxSettings {
	private int id;
	private BoxInfo boxinfo;
	private int flag;
	private int hb_interval;
	private double volt_threshold;
	private int angle_threshold;
	private double high_t_threshold;
	private double low_t_threshold;
	private int lowpower_period;
	private int lowpower_periodpercent;
	private int shake_peroid;
	private int shake_frequency;
	private int shake_time;
	private String remarks;
	private User user;
	private Date lastedittime;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@OneToOne(fetch=FetchType.LAZY)
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
	public int getHb_interval() {
		return hb_interval;
	}
	public void setHb_interval(int hbInterval) {
		hb_interval = hbInterval;
	}
	public double getVolt_threshold() {
		return volt_threshold;
	}
	public void setVolt_threshold(double voltThreshold) {
		volt_threshold = voltThreshold;
	}
	public int getAngle_threshold() {
		return angle_threshold;
	}
	public void setAngle_threshold(int angleThreshold) {
		angle_threshold = angleThreshold;
	}
	public double getHigh_t_threshold() {
		return high_t_threshold;
	}
	public void setHigh_t_threshold(double highTThreshold) {
		high_t_threshold = highTThreshold;
	}
	public double getLow_t_threshold() {
		return low_t_threshold;
	}
	public void setLow_t_threshold(double lowTThreshold) {
		low_t_threshold = lowTThreshold;
	}
	@Column(updatable=false)
	public int getLowpower_period() {
		return lowpower_period;
	}
	public void setLowpower_period(int lowpowerPeriod) {
		lowpower_period = lowpowerPeriod;
	}
	@Column(updatable=false)
	public int getLowpower_periodpercent() {
		return lowpower_periodpercent;
	}
	public void setLowpower_periodpercent(int lowpowerPeriodpercent) {
		lowpower_periodpercent = lowpowerPeriodpercent;
	}
	@Column(updatable=false)
	public int getShake_peroid() {
		return shake_peroid;
	}
	public void setShake_peroid(int shakePeroid) {
		shake_peroid = shakePeroid;
	}
	@Column(updatable=false)
	public int getShake_frequency() {
		return shake_frequency;
	}
	public void setShake_frequency(int shakeFrequency) {
		shake_frequency = shakeFrequency;
	}
	@Column(updatable=false)
	public int getShake_time() {
		return shake_time;
	}
	public void setShake_time(int shakeTime) {
		shake_time = shakeTime;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
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
}
