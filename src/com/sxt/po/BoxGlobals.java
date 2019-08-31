package com.sxt.po;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.hibernate.validator.NotNull;

@Entity
@JsonIgnoreProperties(value={"user"})
public class BoxGlobals {
	private int id;
	private int hb_interval;
	private double volt_threshold;
	private double high_t_threshold;
	private double low_t_threshold;
	private int shake_threshold;
	private int shake_rate;
	private int angle_threshold;
	private String center_ip;
	private int center_upd_port;
	private int sms_per_month;
	private int lowpower_period;
	private int lowpower_periodpercent;
	private int shake_peroid;
	private int shake_frequency;
	private int shake_time;
	private Integer open_lock_timeout;
	private String remarks;
	private UserNew user;
	private Date lastedittime;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	public int getAngle_threshold() {
		return angle_threshold;
	}
	public void setAngle_threshold(int angleThreshold) {
		angle_threshold = angleThreshold;
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
	public int getSms_per_month() {
		return sms_per_month;
	}
	public void setSms_per_month(int smsPerMonth) {
		sms_per_month = smsPerMonth;
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
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="set_user")
	public UserNew getUser() {
		return user;
	}
	public void setUser(UserNew user) {
		this.user = user;
	}
	public Date getLastedittime() {
		return lastedittime;
	}
	public void setLastedittime(Date lastedittime) {
		this.lastedittime = lastedittime;
	}
	public Integer getOpen_lock_timeout() {
		return open_lock_timeout;
	}
	public void setOpen_lock_timeout(Integer open_lock_timeout) {
		this.open_lock_timeout = open_lock_timeout;
	}
}
