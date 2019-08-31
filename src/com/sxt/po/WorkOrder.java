package com.sxt.po;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(value={"ops", "ois", "aods"})
public class WorkOrder {
	
	private int id;
	private String order_no;
	private String title;
	private int type;
	//private BoxInfoNew w_boxinfo;
	private User create_user;
	private Department department;
	private User receive_operators;
	private Date receive_time;
	private Date done_time;
	private int done_type;
	private int is_upload;
	private User upload_user;
	private Date upload_time;
	private String content;
	private int create_type;
	private Date create_time;
	private Date respect_starttime;
	private Date respect_endtime;
	private Date infact_starttime;
	private Date infact_endtime;
	private String remarks;
	private int is_deleted;
	private List<OrderRespect> ops;
	private List<OrderInfact> ois;
	private List<AlarmOrderDetails> aods;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getOrder_no() {
		return order_no;
	}
	public void setOrder_no(String orderNo) {
		order_no = orderNo;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	@ManyToOne
	@JoinColumn(name="user_id")
	public User getCreate_user() {
		return create_user;
	}
	public void setCreate_user(User createUser) {
		create_user = createUser;
	}
	
	@ManyToOne
	@JoinColumn(name="department_id")
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	
	@ManyToOne
	@JoinColumn(name="receive_operators_id")
	public User getReceive_operators() {
		return receive_operators;
	}
	public void setReceive_operators(User receiveOperators) {
		receive_operators = receiveOperators;
	}
	public Date getReceive_time() {
		return receive_time;
	}
	public void setReceive_time(Date receiveTime) {
		receive_time = receiveTime;
	}
	public Date getDone_time() {
		return done_time;
	}
	public void setDone_time(Date doneTime) {
		done_time = doneTime;
	}
	public int getIs_upload() {
		return is_upload;
	}
	public void setIs_upload(int is_upload) {
		this.is_upload = is_upload;
	}
	@ManyToOne
	@JoinColumn(name="upload_user_id")
	public User getUpload_user() {
		return upload_user;
	}
	public void setUpload_user(User upload_user) {
		this.upload_user = upload_user;
	}
	public Date getUpload_time() {
		return upload_time;
	}
	public void setUpload_time(Date upload_time) {
		this.upload_time = upload_time;
	}
	public int getDone_type() {
		return done_type;
	}
	public void setDone_type(int doneType) {
		done_type = doneType;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public int getCreate_type() {
		return create_type;
	}
	public void setCreate_type(int createType) {
		create_type = createType;
	}
	public Date getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Date createTime) {
		create_time = createTime;
	}
	public Date getRespect_starttime() {
		return respect_starttime;
	}
	public void setRespect_starttime(Date respectStarttime) {
		respect_starttime = respectStarttime;
	}
	public Date getRespect_endtime() {
		return respect_endtime;
	}
	public void setRespect_endtime(Date respectEndtime) {
		respect_endtime = respectEndtime;
	}
	public Date getInfact_starttime() {
		return infact_starttime;
	}
	public void setInfact_starttime(Date infactStarttime) {
		infact_starttime = infactStarttime;
	}
	public Date getInfact_endtime() {
		return infact_endtime;
	}
	public void setInfact_endtime(Date infactEndtime) {
		infact_endtime = infactEndtime;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public int getIs_deleted() {
		return is_deleted;
	}
	public void setIs_deleted(int is_deleted) {
		this.is_deleted = is_deleted;
	}
	@OneToMany(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.LAZY, mappedBy="order")
	public List<OrderRespect> getOps() {
		return ops;
	}
	public void setOps(List<OrderRespect> ops) {
		this.ops = ops;
	}
	@OneToMany(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.LAZY, mappedBy="order")
	public List<OrderInfact> getOis() {
		return ois;
	}
	public void setOis(List<OrderInfact> ois) {
		this.ois = ois;
	}
	@OneToMany(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.LAZY, mappedBy="order")
	public List<AlarmOrderDetails> getAods() {
		return aods;
	}
	public void setAods(List<AlarmOrderDetails> aods) {
		this.aods = aods;
	}
	
/*	@ManyToOne
	@JoinColumn(name="w_boxid")
	public BoxInfoNew getW_boxinfo() {
		return w_boxinfo;
	}
	public void setW_boxinfo(BoxInfoNew w_boxinfo) {
		this.w_boxinfo = w_boxinfo;
	}*/
}
