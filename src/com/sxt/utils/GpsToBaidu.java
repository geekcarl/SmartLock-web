package com.sxt.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import com.sxt.utils.Base64;

public class GpsToBaidu {

	public static String GetBaiduLocation(Double x, Double y)
			throws MalformedURLException, IOException {
		String url = String
				.format("http://api.map.baidu.com/ag/coord/convert?from=0&to=4&x=%f&y=%f",
						x, y);
		HttpURLConnection urlConnection = (HttpURLConnection) (new URL(url)
				.openConnection());
		urlConnection.connect();
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				urlConnection.getInputStream()));
		String lines = reader.readLine();
		reader.close();
		urlConnection.disconnect();
		return lines;
	}

	public static boolean GetBaiduLocation(BaiduLocation bl) {
		try {
			bl.ok = false;
			String res = GetBaiduLocation(bl.gpsx, bl.gpsy);
			if (res.startsWith("{") && res.endsWith("}")) {
				res = res.substring(1, res.length() - 2).replace("\"", "");
				String[] lines = res.split(",");
				for (String line : lines) {
					String[] items = line.split(":");
					if (items.length == 2) {
						if ("error".equals(items[0])) {
							bl.ok = "0".equals(items[1]);
						}
						if ("x".equals(items[0])) {
							bl.baidux = ConvertBase64(items[1]);
						}
						if ("y".equals(items[0])) {
							bl.baiduy = ConvertBase64(items[1]);
						}
					}
				}
			}
		} catch (Exception e) {
			bl.ok = false;
		}
		return bl.ok;
	}

	private static Double ConvertBase64(String str) {
		byte[] bs = Base64.decode(str);
		return Double.valueOf(new String(bs));
	}

}
