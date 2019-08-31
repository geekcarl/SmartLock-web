package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="box_terminal_used")
public class BoxTerminalUsed {
	private int id;
	private BoxTerminal boxTerminal;
	private int frontUsed;
	private int frontFreezed;
	private String front_terminal_id;
	private int backUsed;
	private int backFreezed;
	private Core backCore;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@OneToOne
	@JoinColumn(name="box_terminal_id")
	public BoxTerminal getBoxTerminal() {
		return boxTerminal;
	}
	public void setBoxTerminal(BoxTerminal boxTerminal) {
		this.boxTerminal = boxTerminal;
	}
	public int getFrontUsed() {
		return frontUsed;
	}
	public void setFrontUsed(int frontUsed) {
		this.frontUsed = frontUsed;
	}
	public int getFrontFreezed() {
		return frontFreezed;
	}
	public void setFrontFreezed(int frontFreezed) {
		this.frontFreezed = frontFreezed;
	}
	
	public String getFront_terminal_id() {
		return front_terminal_id;
	}
	public void setFront_terminal_id(String frontTerminalId) {
		front_terminal_id = frontTerminalId;
	}
	public int getBackUsed() {
		return backUsed;
	}
	public void setBackUsed(int backUsed) {
		this.backUsed = backUsed;
	}
	public int getBackFreezed() {
		return backFreezed;
	}
	public void setBackFreezed(int backFreezed) {
		this.backFreezed = backFreezed;
	}
	@OneToOne
	@JoinColumn(name="back_core_id")
	public Core getBackCore() {
		return backCore;
	}
	public void setBackCore(Core backCore) {
		this.backCore = backCore;
	}
}
