package com.sxt.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public final class DateUtil {
	public static String dateToString(Date time){ 
	    SimpleDateFormat formatter; 
	    formatter = new SimpleDateFormat ("yyyyMMddHHmmss"); 
	    String ctime = formatter.format(time); 
	    return ctime; 
	} 
	
	
	public static String dateToStringNew(Date time){ 
	    SimpleDateFormat formatter; 
	    formatter = new SimpleDateFormat ("yyyy-MM-dd HH:mm:ss"); 
	    String ctime = formatter.format(time); 
	    return ctime; 
	} 
}
