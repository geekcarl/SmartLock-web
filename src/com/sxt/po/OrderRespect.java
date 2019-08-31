package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(value={"order"})
public class OrderRespect {
	private int id;
	private WorkOrder order;
	private int order_type;
	private BoxInfo boxinfo;
	private String core_id;
	private String terminal_id;
	private String a_terminal_id;
	private String z_terminal_id;
	private String a_core_id;
	private String z_core_id;
	private int operate_type;
	private int sequence;
	
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
	public WorkOrder getOrder() {
		return order;
	}
	public void setOrder(WorkOrder order) {
		this.order = order;
	}
	public int getOrder_type() {
		return order_type;
	}
	public void setOrder_type(int orderType) {
		order_type = orderType;
	}
	@ManyToOne
	@JoinColumn(name="box_id")
	public BoxInfo getBoxinfo() {
		return boxinfo;
	}
	public void setBoxinfo(BoxInfo boxinfo) {
		this.boxinfo = boxinfo;
	}
	
	public String getCore_id() {
		return core_id;
	}
	public void setCore_id(String core_id) {
		this.core_id = core_id;
	}
	public String getTerminal_id() {
		return terminal_id;
	}
	public void setTerminal_id(String terminal_id) {
		this.terminal_id = terminal_id;
	}
	public String getA_terminal_id() {
		return a_terminal_id;
	}
	public void setA_terminal_id(String a_terminal_id) {
		this.a_terminal_id = a_terminal_id;
	}
	public String getZ_terminal_id() {
		return z_terminal_id;
	}
	public void setZ_terminal_id(String z_terminal_id) {
		this.z_terminal_id = z_terminal_id;
	}
	public String getA_core_id() {
		return a_core_id;
	}
	public void setA_core_id(String a_core_id) {
		this.a_core_id = a_core_id;
	}
	public String getZ_core_id() {
		return z_core_id;
	}
	public void setZ_core_id(String z_core_id) {
		this.z_core_id = z_core_id;
	}
	public int getOperate_type() {
		return operate_type;
	}
	public void setOperate_type(int operateType) {
		operate_type = operateType;
	}
	public int getSequence() {
		return sequence;
	}
	public void setSequence(int sequence) {
		this.sequence = sequence;
	}
	
}
