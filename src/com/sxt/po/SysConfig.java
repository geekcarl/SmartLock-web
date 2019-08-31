package com.sxt.po;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class SysConfig {
	private int id;
	private Date server_runtime;
	private int order_app;
	private int workover_time;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@Column(updatable=false)
	public Date getServer_runtime() {
		return server_runtime;
	}
	public void setServer_runtime(Date serverRuntime) {
		server_runtime = serverRuntime;
	}
	public int getOrder_app() {
		return order_app;
	}
	public void setOrder_app(int orderApp) {
		order_app = orderApp;
	}
	public int getWorkover_time() {
		return workover_time;
	}
	public void setWorkover_time(int workoverTime) {
		workover_time = workoverTime;
	}
}
