package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="core_used")
public class CoreUsed {
	private int id;
	private Core core;
	private int a_type;
	private int a_freezed;
	private BoxTerminal a_terminal;
	private Core a_core;
	private String a_string;
	private int z_type;
	private int z_freezed;
	private BoxTerminal z_terminal;
	private Core z_core;
	private String z_string;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@OneToOne
	@JoinColumn(name="core_id")
	public Core getCore() {
		return core;
	}
	public void setCore(Core core) {
		this.core = core;
	}
	public int getA_type() {
		return a_type;
	}
	public void setA_type(int aType) {
		a_type = aType;
	}
	public int getA_freezed() {
		return a_freezed;
	}
	public void setA_freezed(int aFreezed) {
		a_freezed = aFreezed;
	}
	@OneToOne
	@JoinColumn(name="a_terminal_id")
	public BoxTerminal getA_terminal() {
		return a_terminal;
	}
	public void setA_terminal(BoxTerminal aTerminal) {
		a_terminal = aTerminal;
	}
	@OneToOne
	@JoinColumn(name="a_core_id")
	public Core getA_core() {
		return a_core;
	}
	public void setA_core(Core aCore) {
		a_core = aCore;
	}
	public String getA_string() {
		return a_string;
	}
	public void setA_string(String aString) {
		a_string = aString;
	}
	public int getZ_type() {
		return z_type;
	}
	public void setZ_type(int zType) {
		z_type = zType;
	}
	public int getZ_freezed() {
		return z_freezed;
	}
	public void setZ_freezed(int zFreezed) {
		z_freezed = zFreezed;
	}
	@OneToOne
	@JoinColumn(name="z_terminal_id")
	public BoxTerminal getZ_terminal() {
		return z_terminal;
	}
	public void setZ_terminal(BoxTerminal zTerminal) {
		z_terminal = zTerminal;
	}
	@OneToOne
	@JoinColumn(name="z_core_id")
	public Core getZ_core() {
		return z_core;
	}
	public void setZ_core(Core zCore) {
		z_core = zCore;
	}
	public String getZ_string() {
		return z_string;
	}
	public void setZ_string(String zString) {
		z_string = zString;
	}
}
