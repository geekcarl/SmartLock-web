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
public class OrderInfact {
	private int id;
	private WorkOrder order;
	private int order_type;
	private BoxInfo boxinfo;
	private Core core;
	private BoxTerminal terminal;
	private BoxTerminal a_terminal;
	private BoxTerminal z_terminal;
	private Core a_core;
	private Core z_core;
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
	@ManyToOne
	@JoinColumn(name="core_id")
	public Core getCore() {
		return core;
	}
	public void setCore(Core core) {
		this.core = core;
	}
	@ManyToOne
	@JoinColumn(name="terminal_id")
	public BoxTerminal getTerminal() {
		return terminal;
	}
	public void setTerminal(BoxTerminal terminal) {
		this.terminal = terminal;
	}
	@ManyToOne
	@JoinColumn(name="a_terminal_id")
	public BoxTerminal getA_terminal() {
		return a_terminal;
	}
	public void setA_terminal(BoxTerminal aTerminal) {
		a_terminal = aTerminal;
	}
	@ManyToOne
	@JoinColumn(name="z_terminal_id")
	public BoxTerminal getZ_terminal() {
		return z_terminal;
	}
	public void setZ_terminal(BoxTerminal zTerminal) {
		z_terminal = zTerminal;
	}
	@ManyToOne
	@JoinColumn(name="a_core_id")
	public Core getA_core() {
		return a_core;
	}
	public void setA_core(Core aCore) {
		a_core = aCore;
	}
	@ManyToOne
	@JoinColumn(name="z_core_id")
	public Core getZ_core() {
		return z_core;
	}
	public void setZ_core(Core zCore) {
		z_core = zCore;
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
