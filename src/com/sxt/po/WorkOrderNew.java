package com.sxt.po;

import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
@Table(name="workorder")
public class WorkOrderNew {
	private int id;
	private String order_no;
	private String title;
	private int type;
	//private BoxInfoNew w_boxinfo;
	private UserNew create_user;
	private Department department;
	private UserNew receive_operators;
	private Date receive_time;
	private Date done_time;
	private int done_type;
	private String content;
	private int create_type;
	private Date create_time;
	private Date respect_starttime;
	private Date respect_endtime;
	private Date infact_starttime;
	private Date infact_endtime;
	private String remarks;
	private Set<OrderRespectNew> ops;
//	private Set<OrderInfact> ois;
	private Set<AlarmOrderDetails> als;
	
	
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
	
	@ManyToOne
	@JoinColumn(name="user_id")
	@NotFound(action=NotFoundAction.IGNORE)
	public UserNew getCreate_user() {
		return create_user;
	}
	public void setCreate_user(UserNew createUser) {
		create_user = createUser;
	}
	@ManyToOne
	@JoinColumn(name="department_id")
	@NotFound(action=NotFoundAction.IGNORE)
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	
	@ManyToOne
	@JoinColumn(name="receive_operators_id")
	@NotFound(action=NotFoundAction.IGNORE)
	public UserNew getReceive_operators() {
		return receive_operators;
	}
	public void setReceive_operators(UserNew receiveOperators) {
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
	
	@OneToMany(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.EAGER, mappedBy="order")
	@NotFound(action=NotFoundAction.IGNORE)
	public Set<OrderRespectNew> getOps() {
		return ops;
	}
	public void setOps(Set<OrderRespectNew> ops) {
		this.ops = ops;
	}
	
	/*@OneToMany(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.EAGER, mappedBy="order")
	public Set<OrderInfact> getOis() {
		return ois;
	}
	public void setOis(Set<OrderInfact> ois) {
		this.ois = ois;
	}
	*/
	
	@OneToMany(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.EAGER,  mappedBy="order")
	@NotFound(action=NotFoundAction.IGNORE)
	public Set<AlarmOrderDetails> getAls() {
		return als;
	}
	public void setAls(Set<AlarmOrderDetails> als) {
		this.als = als;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	
	/*@ManyToOne
	@JoinColumn(name="w_boxid")
	@NotFound(action=NotFoundAction.IGNORE)
	public BoxInfoNew getW_boxinfo() {
		return w_boxinfo;
	}
	public void setW_boxinfo(BoxInfoNew w_boxinfo) {
		this.w_boxinfo = w_boxinfo;
	}*/
	
}
