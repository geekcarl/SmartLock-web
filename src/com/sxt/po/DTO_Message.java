package com.sxt.po;

import java.util.Date;

public class DTO_Message {
	private Integer id;
	private String recipient;
	private String full_name;
	private String name;
	private String text;
	private Date create_date;
	private Date sent_date;
	private Integer errors;
	
	public DTO_Message() {
		super();
	}
	
	public DTO_Message(Integer id, String recipient, String full_name, String name, String text, Date create_date, Date sent_date, Integer errors) {
		super();
		this.id = id;
		this.recipient = recipient;
		this.full_name = full_name;
		this.name = name;
		this.text = text;
		this.create_date = create_date;
		this.sent_date = sent_date;
		this.errors = errors;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getRecipient() {
		return recipient;
	}

	public void setRecipient(String recipient) {
		this.recipient = recipient;
	}

	public String getFull_name() {
		return full_name;
	}

	public void setFull_name(String full_name) {
		this.full_name = full_name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Date getCreate_date() {
		return create_date;
	}

	public void setCreate_date(Date create_date) {
		this.create_date = create_date;
	}

	public Date getSent_date() {
		return sent_date;
	}

	public void setSent_date(Date sent_date) {
		this.sent_date = sent_date;
	}

	public Integer getErrors() {
		return errors;
	}

	public void setErrors(Integer errors) {
		this.errors = errors;
	}
	
}
