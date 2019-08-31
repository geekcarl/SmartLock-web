package com.sxt.po;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Smsserver_out {
	private Integer id;
	private String type;
	private String recipient;
	private String text;
	private String wap_url;
	private Date wap_expiry_date;
	private String wap_signal;
	private Date create_date;
	private String originator;
	private String encoding;
	private Integer status_report;
	private Integer flash_sms;
	private Integer src_port;
	private Integer dst_port;
	private Date sent_date;
	private String ref_no;
	private Integer priority;
	private String status;
	private Integer errors;
	private String gateway_id;
	@Id
	@GeneratedValue
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getRecipient() {
		return recipient;
	}
	public void setRecipient(String recipient) {
		this.recipient = recipient;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getWap_url() {
		return wap_url;
	}
	public void setWap_url(String wap_url) {
		this.wap_url = wap_url;
	}
	public Date getWap_expiry_date() {
		return wap_expiry_date;
	}
	public void setWap_expiry_date(Date wap_expiry_date) {
		this.wap_expiry_date = wap_expiry_date;
	}
	public String getWap_signal() {
		return wap_signal;
	}
	public void setWap_signal(String wap_signal) {
		this.wap_signal = wap_signal;
	}
	public Date getCreate_date() {
		return create_date;
	}
	public void setCreate_date(Date create_date) {
		this.create_date = create_date;
	}
	public String getOriginator() {
		return originator;
	}
	public void setOriginator(String originator) {
		this.originator = originator;
	}
	public String getEncoding() {
		return encoding;
	}
	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}
	public Integer getStatus_report() {
		return status_report;
	}
	public void setStatus_report(Integer status_report) {
		this.status_report = status_report;
	}
	public Integer getFlash_sms() {
		return flash_sms;
	}
	public void setFlash_sms(Integer flash_sms) {
		this.flash_sms = flash_sms;
	}
	public Integer getSrc_port() {
		return src_port;
	}
	public void setSrc_port(Integer src_port) {
		this.src_port = src_port;
	}
	public Integer getDst_port() {
		return dst_port;
	}
	public void setDst_port(Integer dst_port) {
		this.dst_port = dst_port;
	}
	public Date getSent_date() {
		return sent_date;
	}
	public void setSent_date(Date sent_date) {
		this.sent_date = sent_date;
	}
	public String getRef_no() {
		return ref_no;
	}
	public void setRef_no(String ref_no) {
		this.ref_no = ref_no;
	}
	public Integer getPriority() {
		return priority;
	}
	public void setPriority(Integer priority) {
		this.priority = priority;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Integer getErrors() {
		return errors;
	}
	public void setErrors(Integer errors) {
		this.errors = errors;
	}
	public String getGateway_id() {
		return gateway_id;
	}
	public void setGateway_id(String gateway_id) {
		this.gateway_id = gateway_id;
	}
	
}
