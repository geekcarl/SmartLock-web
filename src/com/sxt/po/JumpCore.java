package com.sxt.po;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

public class JumpCore {
	private BoxTerminal a;
	private BoxTerminal b;
	public BoxTerminal getA() {
		return a;
	}
	public void setA(BoxTerminal a) {
		this.a = a;
	}
	public BoxTerminal getB() {
		return b;
	}
	public void setB(BoxTerminal b) {
		this.b = b;
	}
}
