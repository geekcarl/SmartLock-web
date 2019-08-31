package com.sxt.interceptor;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.interceptor.Interceptors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.sxt.po.Role;


public class MyInterceptor implements HandlerInterceptor {

	@Override
	public void afterCompletion(HttpServletRequest request,	HttpServletResponse response, Object handler, Exception ex)	throws Exception {
		
		
	}

	@Override
	public void postHandle(HttpServletRequest request,HttpServletResponse response, Object handler,	ModelAndView modelAndView) throws Exception {
		
	}

	@Override
	public boolean preHandle(HttpServletRequest request,HttpServletResponse response, Object handler) throws Exception {
		String uri = request.getRequestURI();
		//System.out.println("uri is : \"" + uri + "\", method=" + (request.getParameter("method") == null ? "null" : request.getParameter("method")));
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date d = new Date();
		String dstring = format.format(d);
		if (uri.equals("/gjx/randomCode")) return true;
		if (dstring.compareToIgnoreCase("2099-02-28 12:00:00") >= 0)
		{
			if (!(request.getHeader("accept").indexOf("application/json") > -1 || (request
					.getHeader("X-Requested-With") != null && request
					.getHeader("X-Requested-With").indexOf("XMLHttpRequest") > -1))) 
        	{
				// 如果不是异步请求
				// Apply HTTP status code for error views, if specified.
				// Only apply it if we're processing a top-level request.
        		response.sendRedirect("/gjx/login");		
        	}
        	else
        	{
        		String resultMark = "{\"resultMark\" : -1, \"errMessage\" : \"试用期已过，请联系我们的工作人员\"}";
        		response.setContentType("application/json; charset=UTF-8");
        		response.getWriter().print(resultMark);
        	}
			return false;
		}
		if (! uri.equals("/gjx/login") && ! uri.equals("/gjx/menutemplate") && !uri.equals("/gjx/randomCode") && ! uri.equals("/gjx/noPrivilege") && ! (uri.equals("/gjx/user.do") && request.getParameter("method").equals("login")))
		{
            Object t =  request.getSession().getAttribute("user_id");
            if (t == null) //没有session,或者是session超时了
            {
            	if (!(request.getHeader("accept").indexOf("application/json") > -1 || (request
    					.getHeader("X-Requested-With") != null && request
    					.getHeader("X-Requested-With").indexOf("XMLHttpRequest") > -1))) 
            	{
    				// 如果不是异步请求
    				// Apply HTTP status code for error views, if specified.
    				// Only apply it if we're processing a top-level request.
            		response.sendRedirect("/gjx/login");     		
            	}
            	else
            	{
            		String resultMark = "{\"resultMark\" : -1, \"errMessage\" : \"会话超时，请重新登录确认身份\"}";
            		response.setContentType("application/json; charset=UTF-8");
            		response.getWriter().print(resultMark);
            	}
            	return false;
            }
            else //有session
            {
            	/*if (! uri.equals("/gjx/index"))
            	{
	                Role r =  (Role)request.getSession().getAttribute("role");
	                int i = 0;
	                if (r != null && r.getRps() != null)
	                {
		                String method = request.getParameter("method");
		                for (i = 0; i < r.getRps().size(); i ++)
		                {
		                	if (uri.equals("/gjx/" + r.getRps().get(i).getPrivilege().getPrivilege() + ".do") && method.equals(r.getRps().get(i).getPrivilege().getMethod()))
		                	{
		                		System.out.println("success match : " + uri + "?method=" + method);
		                		break;
		                	}
		                }
	                }
	                if (r != null && r.getRps() != null && i >= r.getRps().size())
	                {
	                	if (!(request.getHeader("accept").indexOf("application/json") > -1 || (request
	        					.getHeader("X-Requested-With") != null && request
	        					.getHeader("X-Requested-With").indexOf("XMLHttpRequest") > -1))) 
	                	{
	        				// 如果不是异步请求
	        				// Apply HTTP status code for error views, if specified.
	        				// Only apply it if we're processing a top-level request.
	                		response.sendRedirect("/gjx/noPrivilege");     		
	                	}
	                	else
	                	{
	                		String resultMark = "{\"resultMark\" : -1, \"errMessage\" : \"对不起，您没有该操作权限！\"}";
	                		response.setContentType("application/json; charset=UTF-8");
	                		response.getWriter().print(resultMark);
	                	}
	                	return false;
	                }
            	}*/
            }
		}
		return true;
	}

}

