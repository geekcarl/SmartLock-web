package com.sxt.action;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.sxt.po.Department;
import com.sxt.po.SystemInfo;
import com.sxt.po.VersionManage;
import com.sxt.service.BoxInfoService;
import com.sxt.service.DepartmentService;
import com.sxt.service.DictionaryService;
import com.sxt.service.UserService;
import com.sxt.utils.PrivilegeControl;

@Controller
public class IndexController  {

	private DepartmentService departmentService;
	private BoxInfoService boxInfoService;
	private DictionaryService dictionaryService;
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("/index")
	public String index(HttpServletRequest request, ModelMap map){
		System.out.println("IndexController index()");
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "boxinfo", "mapcontrol"))
		{
			map.put("mapcontrol", true);
		}
		
		if (PrivilegeControl.exist(request, "downloadapp", "downloadapp"))
		{
			map.put("downloadapp", true);
			
			VersionManage v = userService.getVersion();
			
			map.put("appadress", v.getUrl());
		}
		
		if (PrivilegeControl.exist(request, "boxeventandwarn", "getAlarmNotAffirmdCount"))
		{
			map.put("getAlarmNotAffirmdCount", true);
		}
		
		//系统名称和版本号
		SystemInfo sysinfo   = new SystemInfo(); 
		sysinfo = userService.findsysinfo();
		map.put("systeminfo", sysinfo);
		
		return "index";
	}
	
	
	@RequestMapping("/menutemplate")
	public String menu(HttpServletRequest request, ModelMap map){
		        //安全管控访问
				if (PrivilegeControl.exist(request, "securitycontrol", "menu"))
				{
					map.put("securitycontrol", true);
				}
				//资源管理访问
				if (PrivilegeControl.exist(request, "resourcemanage", "menu"))
				{
					map.put("resourcemanage", true);
				}
				//日常维护访问
				if (PrivilegeControl.exist(request, "dailymanage", "menu"))
				{
					map.put("dailymanage", true);
				}
				//系统设置访问
				if (PrivilegeControl.exist(request, "systemsetting", "menu"))
				{
					map.put("systemsetting", true);
				}
				//地图菜单访问
				if (PrivilegeControl.exist(request, "boxinfo", "mapcontrol"))
				{
					map.put("mapcontrol", true);
				}
				//智能钥匙列表菜单访问
				if (PrivilegeControl.exist(request, "keyinfo", "view"))
				{
					map.put("keylist", true);
				}
				//智能钥匙权限列表菜单访问
				if (PrivilegeControl.exist(request, "keyAuthorize", "view"))
				{
					map.put("keyauthorize", true);
				}
				//开门授权表菜单访问
				if (PrivilegeControl.exist(request, "user", "opendoorAuthorize"))
				{
					map.put("opendoorAuthorize", true);
				}
				//开关门列表菜单访问
				if (PrivilegeControl.exist(request, "boxeventandwarn", "boxeventListview"))
				{
					map.put("boxeventList", true);
				}
				//告警列表菜单访问
				if (PrivilegeControl.exist(request, "boxeventandwarn", "boxwarnListview"))
				{
					map.put("boxwarnList", true);
				}
				//短信查看列表菜单访问
				if (PrivilegeControl.exist(request, "user", "messageListview"))
				{
					map.put("messageList", true);
				}
				//工作识别卡列表菜单访问
				if (PrivilegeControl.exist(request, "user", "workcardListview"))
				{
					map.put("workcardList", true);
				}
				
				//光交箱管理列表菜单访问
				if (PrivilegeControl.exist(request, "boxinfo", "listview"))
				{
					map.put("boxinfoList", true);
				}
				
				//光缆管理列表菜单访问
				if (PrivilegeControl.exist(request, "opticalcable", "view"))
				{
					map.put("opticalcableList", true);
				}
				//工单列表菜单访问
				if (PrivilegeControl.exist(request, "workorder", "orderlistview"))
				{
					map.put("workorderList", true);
				}
				//维修申请列表菜单访问
				if (PrivilegeControl.exist(request, "fixapply", "view"))
				{
					map.put("fixapplyList", true);
				}
				//部门列表菜单访问
				if (PrivilegeControl.exist(request, "department", "listview"))
				{
					map.put("departmentList", true);
				}
				//用户列表菜单访问
				if (PrivilegeControl.exist(request, "userinfo", "listview"))
				{
					map.put("userList", true);
				}
				//角色列表菜单访问
				if (PrivilegeControl.exist(request, "user", "roleList"))
				{
					map.put("roleList", true);
				}
				//光交箱权限设置列表菜单访问
				if (PrivilegeControl.exist(request, "boxprivilege", "view"))
				{
					map.put("boxPrivilegeList", true);
				}
				
				//短信告警设置列表菜单访问
				if (PrivilegeControl.exist(request, "boxinfo", "smsSetting"))
				{
					map.put("smsSetting", true);
				}
				
				//数据维护菜单访问
				if (PrivilegeControl.exist(request, "dictionary", "list"))
				{
					map.put("dictionary", true);
				}
				
				//参数设置菜单访问
				if (PrivilegeControl.exist(request, "boxinfo", "boxglobalsetting"))
				{
					map.put("boxglobalsetting", true);
				}
				return "menutemplate";
	}
	
	@RequestMapping("/")
	public String Root(ModelMap map){
		System.out.println("indexcontroller /()");
		//系统名称和版本号
		SystemInfo sysinfo   = new SystemInfo(); 
		sysinfo = userService.findsysinfo();
		map.put("systeminfo", sysinfo);
		
		map.put("login_first", "first_login");
		return "login";
	}
	
	@RequestMapping("/randomCode")
	public void randomCode(HttpServletRequest request, HttpServletResponse response) throws IOException {
		System.out.println(request.getSession().getId());
		// 验证码图片的宽度。
        int width = 70;
        // 验证码图片的高度。
        int height = 30;
        BufferedImage buffImg = new BufferedImage(width, height,
                BufferedImage.TYPE_INT_RGB);
        Graphics2D g = buffImg.createGraphics();

        // 创建一个随机数生成器类。
        Random random = new Random();

        // 设定图像背景色(因为是做背景，所以偏淡)
        g.setColor(getRandColor(200, 250));
        g.fillRect(0, 0, width, height);
        // 创建字体，字体的大小应该根据图片的高度来定。
        Font font = new Font("Times New Roman", Font.HANGING_BASELINE, 28);
        // 设置字体。
        g.setFont(font);

        // 画边框。
        g.setColor(Color.BLACK);
        g.drawRect(0, 0, width - 1, height - 1);
        // 随机产生155条干扰线，使图象中的认证码不易被其它程序探测到。
//g.setColor(Color.GRAY);
        g.setColor(getRandColor(160,200));
        for (int i = 0; i < 155; i++) {
            int x = random.nextInt(width);
            int y = random.nextInt(height);
            int xl = random.nextInt(12);
            int yl = random.nextInt(12);
            g.drawLine(x, y, x + xl, y + yl);
        }

        // randomCode用于保存随机产生的验证码，以便用户登录后进行验证。
        StringBuffer randomCode = new StringBuffer();

        // 设置默认生成4个验证码
        int length = 4;
        // 设置备选验证码:包括"a-z"和数字"0-9"
        String base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        int size = base.length();

        // 随机产生4位数字的验证码。
        for (int i = 0; i < length; i++) {
            // 得到随机产生的验证码数字。
            int start = random.nextInt(size);
            String strRand = base.substring(start, start + 1);

            // 用随机产生的颜色将验证码绘制到图像中。
// 生成随机颜色(因为是做前景，所以偏深)
//g.setColor(getRandColor(1, 100));
            
//调用函数出来的颜色相同，可能是因为种子太接近，所以只能直接生成
            g.setColor(new Color(20+random.nextInt(110),20+random.nextInt(110),20+random.nextInt(110)));

            g.drawString(strRand, 15 * i + 6, 24);

            // 将产生的四个随机数组合在一起。
            randomCode.append(strRand);
        }
        // 将四位数字的验证码保存到Session中。
        request.getSession().setAttribute("rand", randomCode.toString());

        //图象生效
        g.dispose();

        // 禁止图像缓存。
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);

        response.setContentType("image/jpeg");

        // 将图像输出到Servlet输出流中。
        ServletOutputStream sos = response.getOutputStream();
        ImageIO.write(buffImg, "jpeg", sos);
        sos.flush();
        sos.close();
	}
	
	Color getRandColor(int fc, int bc) {// 给定范围获得随机颜色
        Random random = new Random();
        if (fc > 255)
            fc = 255;
        if (bc > 255)
            bc = 255;
        int r = fc + random.nextInt(bc - fc);
        int g = fc + random.nextInt(bc - fc);
        int b = fc + random.nextInt(bc - fc);
        return new Color(r, g, b);
    }
	
	@RequestMapping("/login")
	public String Login(ModelMap map){
		
		//系统名称和版本号
		SystemInfo sysinfo   = new SystemInfo(); 
		sysinfo = userService.findsysinfo();
		map.put("systeminfo", sysinfo);
				
		map.put("login_first", "first_login");
		return "login";
	}
	
	@RequestMapping("/noPrivilege")
	public String NoPrivilege(ModelMap map){
		return "noPrivilege";
	}

	public DepartmentService getDepartmentService() {
		return departmentService;
	}

	@Resource
	public void setDepartmentService(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}

	public BoxInfoService getBoxInfoService() {
		return boxInfoService;
	}

	@Resource
	public void setBoxInfoService(BoxInfoService boxInfoService) {
		this.boxInfoService = boxInfoService;
	}

	public DictionaryService getDictionaryService() {
		return dictionaryService;
	}

	@Resource
	public void setDictionaryService(DictionaryService dictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	

	
}
