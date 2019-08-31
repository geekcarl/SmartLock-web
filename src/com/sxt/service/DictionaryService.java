package com.sxt.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.classic.Session;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sxt.dao.DepartmentDao;
import com.sxt.dao.DictionaryDao;
import com.sxt.dao.UserDao;
import com.sxt.po.Backup;
import com.sxt.po.GlobalSearch;
import com.sxt.po.Operators;
import com.sxt.po.StateKey;
import com.sxt.po.StateKeySearch;
import com.sxt.po.StateLevel;
import com.sxt.po.StateLevelSearch;
import com.sxt.po.StateValue;
import com.sxt.po.StateValueSearch;
import com.sxt.po.User;
import com.sxt.utils.PropertyMgr;

@Service("dictionaryService")
public class DictionaryService {
	
	private DictionaryDao dictionaryDao;
	
	public DictionaryDao getDictionaryDao() {
		return dictionaryDao;
	}

	@Resource
	public void setDictionaryDao(DictionaryDao dictionaryDao) {
		this.dictionaryDao = dictionaryDao;
	}
	
	@Transactional(rollbackFor=Exception.class)
	public int addBackup(Backup b, HttpServletRequest request) throws IOException {
		String host = PropertyMgr.getProperty("host");
		String port = PropertyMgr.getProperty("port");
		String user = PropertyMgr.getProperty("username");
		String password = PropertyMgr.getProperty("password");
		String upd = PropertyMgr.getProperty("upddump");
		String dbname = PropertyMgr.getProperty("dbname");
		// 要用来做导入用的sql目标文件：
		String path = request.getSession().getServletContext()
				.getRealPath("../gjx_uploadfile/backup/");
		String time = "" + new Date().getTime();

			
        // 调用 mysql 的 cmd:
		Process child = Runtime.getRuntime().exec(upd + "mysqldump --host="  + host + " --port=" + port + 
		           " --user=" + user + " --password=" + password + " --single-transaction --opt " + dbname);
        // 把进程执行中的控制台输出信息写入.sql文件，即生成了备份文件。注：如果不对控制台信息进行读出，则会导致进程堵塞无法运行
        InputStream in = child.getInputStream();// 控制台的输出信息作为输入流

        InputStreamReader xx = new InputStreamReader(in, "utf8");// 设置输出流编码为utf8。这里必须是utf8，否则从流中读入的是乱码

        String inStr;
        StringBuffer sb = new StringBuffer("");
        String outStr;
        // 组合控制台输出信息字符串
        BufferedReader br = new BufferedReader(xx);
        while ((inStr = br.readLine()) != null) {
            sb.append(inStr + "\r\n");
        }
        outStr = sb.toString();

        File file =new File(path);    
	    //如果文件夹不存在则创建    
	    if  (!file .exists()  && !file .isDirectory())      
	    {       
	        file.mkdir();    
	    }   
        
        FileOutputStream fout = new FileOutputStream(path + "/" +  time + ".sql");
        OutputStreamWriter writer = new OutputStreamWriter(fout, "utf8");
        writer.write(outStr);
        // 注：这里如果用缓冲方式写入文件的话，会导致中文乱码，用flush()方法则可以避免
        writer.flush();

        // 别忘记关闭输入输出流
        in.close();
        xx.close();
        br.close();
        writer.close();
        fout.close();
        
        //先备份再添加备份记录 ，这样还原了就没有此次备份记录
		User u = new User();
		u.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
		b.setCreate_user(u);
		b.setUrl(time + ".sql");
		this.addBackup(b);
	
        
		return 1;
	}
	
	public int restoreBackup(Integer id, HttpServletRequest request) throws IOException, InterruptedException {
		int result = 0;
		String host = PropertyMgr.getProperty("host");
		String port = PropertyMgr.getProperty("port");
		String user = PropertyMgr.getProperty("username");
		String password = PropertyMgr.getProperty("password");
		String upd = PropertyMgr.getProperty("updmysql");
		String dbname = PropertyMgr.getProperty("dbname");
		Backup b = this.findBackup(id);
		// 要用来做导入用的sql目标文件：
		String path = request.getSession().getServletContext()
				.getRealPath("../gjx_uploadfile/backup/");
        // 调用 mysql 的 cmd:
		/*Process child = Runtime.getRuntime().exec(upd + "mysql --host="  + host + " --port=" + port + 
		           " --user=" + user + " --password=" + password + " " + dbname + " < " + path + "/" + b.getUrl());
		int processComplete = child.waitFor();
		
		if (processComplete == 0) {
			arot.setResultMark(1);
			
		} else {
			arot.setResultMark(0);
		}*/
		/*Process p = null;
		String[] executeCmd = new String[]{upd + "mysql", dbname, "--host=" + host,
				"--port=" + port, "--user=" + user,"--password=" + password,
				" -e ", " source " + path + "/" + b.getUrl()};
		p = Runtime.getRuntime().exec(executeCmd);
		int processComplete = p.waitFor();
		
		if (processComplete == 0) {
			arot.setResultMark(1);
			
		} else {
			arot.setResultMark(0);
		}*/
		String comando = upd + "mysql " + dbname + " --host=" + host + " --port=" + port
	            + " --user=" + user + " --password=" + password
	            + " < " + path + "/" + b.getUrl();
	    File f = new File("restore.bat");
	    FileOutputStream fos = new FileOutputStream(f);
	    fos.write(comando.getBytes());
	    fos.close();
	    //Process run = Runtime.getRuntime().exec("cmd /C start restore.bat ");
	    Process child = Runtime.getRuntime().exec("restore.bat");
		InputStream in = child.getInputStream();
		int c;
		while ((c = in.read()) != -1) {}
		in.close();
		int processComplete = child.waitFor();
		if (processComplete == 0) {
			result = 1;
		} else {
			result = 0;
		}
		return result;
	}
	
	//备份分页
	public List<Backup> findBackupPager(GlobalSearch svs){
		return this.dictionaryDao.findBackupPager(svs);
	}
	
	//备份数量
	public int findBackupCounts(GlobalSearch svs)
	{
		return this.dictionaryDao.findBackupCounts(svs);
	}
	
	//添加备份
	public void addBackup(Backup b)
	{
		this.dictionaryDao.addBackup(b);
	}
	
	//获取备份
	public Backup findBackup(Integer id) {
		return this.dictionaryDao.findBackup(id);
	}
	
	public void deleteBackup(int[] ids) {
		for (int i = 0; i < ids.length; i ++)
		{
			this.dictionaryDao.deleteBackup(ids[i]);
		}
	}
	
	//根据状态字典的id获取该状态字典下所有的状态项
	public String findStateValueGroupByStateKey() {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		List<StateKey> sks = this.dictionaryDao.findStateKeyAll();
		for (int i = 0; i < sks.size(); i ++)
		{
			List<StateValue> svs = this.dictionaryDao.findStateValueByStateKeyId(sks.get(i).getId());
			if (svs.size() > 0)
			{
				sb.append("{\"id\" : \"key_" + sks.get(i).getId() + "\", \"pId\" : 0, \"type\" : 1, \"name\" : \"" + sks.get(i).getState_key() + "\", \"open\" : true},");
				for (int j = 0; j < svs.size(); j ++)
				{
					sb.append("{\"id\" : " + svs.get(j).getId() + ", \"pId\" : \"key_" + sks.get(i).getId() + "\", \"type\" : 2, \"name\" : \"" + svs.get(j).getState_value() + "\"},");
				}
			}
		}
		return sb.substring(0, sb.length() - 1) + "]";
	}
	
	//获取状态字典分页
	public List<StateKey> findByPager(StateKeySearch sks){
		return dictionaryDao.findByPager(sks);
	}
	
	
	//获取所有状态字典
	public List<StateKey> findStateKeyAll(){
		return dictionaryDao.findStateKeyAll();
	}
	
	//获取所有状态项字典
	public List<StateValue> findStateValueAll(){
		return dictionaryDao.findStateValueAll();
	}
	
	//获取所有状态项字典项
	public List<StateValue> findStateValueAllForCam(){
		return this.dictionaryDao.findStateValueAllForCam();
	}
	
	//删除状态字典
	@Transactional
	public void deleteStateKey(int[] sks) {
		dictionaryDao.deleteStateKey(sks);
	}
	
	//删除状态字典等级
	@Transactional
	public void deleteStateLevel(int[] lls) {
		dictionaryDao.deleteStateLevel(lls);
	}
	
	//删除状态字典项
	@Transactional
	public void deleteStateValue(int[] svs) {
		dictionaryDao.deleteStateValue(svs);
	}
	
	//获取所有状态字典等级
	public List<StateKey> findStateLevelAll(){
		return dictionaryDao.findStateLevelAll();
	}
	
	//获取状态字典总数
	public int findCounts(StateKeySearch sks)
	{
		return dictionaryDao.findCounts(sks);
	}

	//获取状态字典项分页
	public List<StateValue> findStateValueByPager(StateValueSearch svs){
		return dictionaryDao.findStateValueByPager(svs);
	}
	
	//获取状态字典项总数
	public int findStateValueCounts(StateValueSearch svs)
	{
		return dictionaryDao.findStateValueCounts(svs);
	}
	

	//获取字典等级分页
	public List<StateLevel> findStateLevelByPager(StateLevelSearch sls){
		return dictionaryDao.findStateLevelByPager(sls);
	}

	//获取字典等级总数
	public int findStateLevelCounts()
	{
		return dictionaryDao.findStateLevelCounts();
	}
	
	
	//判断字典项是否唯一
	public int isStateKeyValid(String state_key) {
		return dictionaryDao.isStateKeyValid(state_key);
	}
	
	//添加状态字典
	@Transactional
	public void addStateKey(StateKey sk)
	{
		this.dictionaryDao.addStateKey(sk);
	}
	
	//添加状态字典项
	@Transactional
	public void addStateValue(StateValue sv)
	{
		this.dictionaryDao.addStateValue(sv);
	}
	
	//添加状态字典等级
	@Transactional
	public void addStateLevel(StateLevel sl)
	{
		this.dictionaryDao.addStateLevel(sl);
	}
	
	//修改状态字典
	public void updateStateKey(StateKey sk)
	{
		this.dictionaryDao.updateStateKey(sk);
	}
	
	//修改状态字典等级
	@Transactional
	public void updateStateLevel(StateLevel sl)
	{
		this.dictionaryDao.updateStateLevel(sl);
	}
	
	//修改状态字典项
	@Transactional
	public void updateStateValue(StateValue sv)
	{
		this.dictionaryDao.updateStateValue(sv);
	}
	
	//获取状态字
	public StateKey findStateKey(int id)
	{
		return this.dictionaryDao.findStateKey(id);
	}
	
	//获取状态字典等级
	public StateLevel findStateLevel(int id)
	{
		return this.dictionaryDao.findStateLevel(id);
	}
	
	//获取状态字典项
	public StateValue findStateValue(int id)
	{
		return this.dictionaryDao.findStateValue(id);
	}
}
