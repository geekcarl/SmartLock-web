package com.sxt.action;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sxt.po.User;

@Controller
@RequestMapping("myajax.do")
public class MyAjaxController {
	
	@RequestMapping(params="method=test1",method=RequestMethod.GET)
	public @ResponseBody List<User> test1(String uname) throws Exception{ 
		String uname2 = new String(uname.getBytes("iso8859-1"),"gbk");
		System.out.println(uname2); 
		System.out.println("MyAjaxController.test1()");
		List<User> list = new ArrayList<User>();
		
		return list;
	}
	
}
