package com.sxt.po;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;


public class BoxInfoSearch {
	private int page;
	private int rows;
	private String sort;
	private String order;
	private int id;
	private String box_no;
	private long controller_id;
	private String box_name;
	private String address;
	private String business_area;
	private String sim_phone_no;
	private double longitude;
	private double latitude;
	private String department_name;
	private Integer department_id;
	private String box_type;
	private int locks_count;
	private double b_longitude;
	private double b_latitude;
	private String k_code;
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
	}
	public int getRows() {
		return rows;
	}
	public void setRows(int rows) {
		this.rows = rows;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	public String getOrder() {
		return order;
	}
	public void setOrder(String order) {
		this.order = order;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getBox_no() {
		return box_no;
	}
	public void setBox_no(String boxNo) {
		box_no = boxNo;
	}
	public long getController_id() {
		return controller_id;
	}
	public void setController_id(long controllerId) {
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
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public String getDepartment_name() {
		return department_name;
	}
	public void setDepartment_name(String departmentName) {
		department_name = departmentName;
	}
	public String getBox_type() {
		return box_type;
	}
	public void setBox_type(String boxType) {
		box_type = boxType;
	}
	public int getLocks_count() {
		return locks_count;
	}
	public void setLocks_count(int locksCount) {
		locks_count = locksCount;
	}
	public double getB_longitude() {
		return b_longitude;
	}
	public void setB_longitude(double bLongitude) {
		b_longitude = bLongitude;
	}
	public double getB_latitude() {
		return b_latitude;
	}
	public void setB_latitude(double bLatitude) {
		b_latitude = bLatitude;
	}
	public String getK_code() {
		return k_code;
	}
	public void setK_code(String kCode) {
		k_code = kCode;
	}
	public Integer getDepartment_id() {
		return department_id;
	}
	public void setDepartment_id(Integer department_id) {
		this.department_id = department_id;
	}
	
}
