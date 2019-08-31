package com.sxt.po;

public class DTO_Core {
	private int id;
	private String name;
	private int a_type;
	private int a_freezed;
	private String a_string;
	private String a_terminal;
	private String a_core;
	private int z_type;
	private int z_freezed;
	private String z_string;
	private String z_terminal;
	private String z_core;
	
	public DTO_Core(int id, String name, int a_type, int a_freezed, String a_string, String a_terminal, String a_core, int z_type, int z_freezed, String z_string, String z_terminal, String z_core)
	{
		super();
		this.id = id;
		this.name = name;
		this.a_type = a_type;
		this.a_freezed = a_freezed;
		this.a_string = a_string;
		this.a_terminal = a_terminal;
		this.a_core = a_core;
		this.z_type = z_type;
		this.z_freezed = z_freezed;
		this.z_string = z_string;
		this.z_terminal = z_terminal;
		this.z_core = z_core;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public String getA_string() {
		return a_string;
	}

	public void setA_string(String aString) {
		a_string = aString;
	}

	public String getA_terminal() {
		return a_terminal;
	}

	public void setA_terminal(String aTerminal) {
		a_terminal = aTerminal;
	}

	public String getA_core() {
		return a_core;
	}

	public void setA_core(String aCore) {
		a_core = aCore;
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

	public String getZ_string() {
		return z_string;
	}

	public void setZ_string(String zString) {
		z_string = zString;
	}

	public String getZ_terminal() {
		return z_terminal;
	}

	public void setZ_terminal(String zTerminal) {
		z_terminal = zTerminal;
	}

	public String getZ_core() {
		return z_core;
	}

	public void setZ_core(String zCore) {
		z_core = zCore;
	}
	
}
