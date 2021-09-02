#coding=utf-8
# 在这里输入青龙面板用户名密码，如果不填写，就自动从auth.json中读取
username = ""
password = ""

import random
import requests
import time
import json
import re
from urllib.parse import urlencode

requests.packages.urllib3.disable_warnings()

token = ""
if username == "" or password == "":
    f = open("/ql/config/auth.json") 
    auth = f.read()
    auth = json.loads(auth)
    username = auth["username"]
    password = auth["password"]
    token = auth["token"]
    f.close()

# 随机获取sign
def randomData():
    dataList = ['clientVersion=10.1.2&build=89743&client=android' \
          '&d_brand=&d_model=&osVersion=&screen=&partner=&oaid=&openudid=a27b83d3d1dba1cc&eid=&sdkVersion=30&lang' \
          '=zh_CN&uuid=a27b83d3d1dba1cc&aid=a27b83d3d1dba1cc&area=19_1601_36953_50397&networkType=wifi&wifiBssid=&uts' \
          '=&uemps=0-2&harmonyOs=0&st=1630413012009&sign=5007129410fde6508ec43dae1aa6a3ca&sv=121',
	  
          'clientVersion=10.1.2&build=89743&client=android' \          '&d_brand=vivo&d_model=vivoX7Plus&osVersion=7.1.1&screen=1920*1080&partner=vivo&oaid=&eid=eidA112b8122fbs1lkKChfN2QmuUqLlxvPFTRZZChAGZZClHZtSjHOY7T6BvRHXbKRDdVklifFsJwp4d0VdDLo0VxFmFVEcvkyKS6KjRvJYry590zbJP&sdkVersion=25&lang' \          '=zh_CN&uuid=3e10e8b575b93d38&aid=3e10e8b575b93d38&area=8_579_581_40008&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSt1aepCvEamYvsSIav7GnfUiOy6KB53RSAlq70u6I4GHOIWIEmGQ4SnPvQI0R%2BH9MWFM10avlZjauXJqPjSHtSg79IyUOihR9pzGJZEF%2FUsBn4UCjscDifwnrE9O29H5jbc0v8Kg5fpiXrhjIdALTbbyxD2OI4ozNBr3acBYtP69FeZVOtjwZKuUlWxJOr5mxY6o1yKFUQZ6A%3D%3D' \
          '=&uemps=0-2&harmonyOs=0&st=1630576680700&sign=4ee8cd4ecfe97e94b07556728ed6431f&sv=122',
		  
          'clientVersion=10.1.2&build=89743&client=android' \          '&d_brand=HUAWEI&d_model=TAS-AL00&osVersion=7.1.2&screen=1600*900&partner=cymqj01&oaid=&eid=eidAf4b9812282s6ZR8sr8YfSx+cNoViUfTDGWUfLitrdf3TVP/luZsA7xGlGX6cmnGXI3JQ7Ev/PboTx2nAW808EvLJMBNekHdcFIMeaystmIdr3CNw&sdkVersion=25&lang' \          '=zh_CN&uuid=b9d8230f24b4e371&aid=b9d8230f24b4e371&area=14_1137_0_0&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJzF0QmnB0uyams1f%2F5tCB%2BRIJMuzu9kHEgvYXthqRK5tf3xyuAoXjVULLjo1acCaJNZD%2BZDqAIT9stWykyznkYwTop7ZEvFXRMT1lLxFTWqjm6AJW2sa1GKhUFfZDmd2WxXDTyI3H6aTjpznS3pvx6RuUBj0EsPn7bldBH3E%2FXDP5mLVIqzw8TQ%3D%3D' \
          '=&uemps=0-2&harmonyOs=0&st=1630567416888&sign=9af1464b96ec998c308de53f516add76&sv=111',

          'clientVersion=10.1.2&build=89743&client=android' \          '&d_brand=oppo&d_model=PEEM00&osVersion=11&screen=2340*1080&partner=cymqj01&oaid=&openudid=5a58be9bad10b160&eid=eidAc8af812181s9FRBQXSC7TfO39cXNMUvhZBUQUdgCzuf0Yg5xpaF0KkHWFpMqYYx2iHdBVRLg2y0vhI3iJPUi6MrhIXkeGHgof+Xm7/7XnF6RL45l&sdkVersion=30&lang' \          '==zh_CN&uuid=5a58be9bad10b160&aid=5a58be9bad10b160&area=12_988_39628_58085&networkType=4g&wifiBssid=unknown&uts=0f31TVRjBStnJLPkE6Qjdf%2FbEDW2kmN83uQpfyOa%2FkS%2BQe0iWFlvA7OEVUT%2BKK8ZA%2BpVPMRGcuCR3cX3e9wGZvreRNLQH0R%2BYHOSNVGz8%2BabU8d%2FJvdADtnQrMxQ4na%2FDkbC9gITzS%2B25KdJouXeIe7MqMyTLDFGyu%2FXfr2O6QPu531%2Fl268OXrBKYSu7mBmk%2FKCrwPLE66dPGB8mxBryg%3D%3D' \
          '=&uemps=0-2&harmonyOs=0&st=1630565781487&sign=58499ceca2feb327f868cd004f7bdf7a&sv=120',
		  
          'clientVersion=10.1.0&build=89568&client=android' \          '&d_brand=OnePlus&d_model=LE2110&osVersion=11&screen=2297*1080&partner=lc001&oaid=&openudid=6b1601dca8546b0c&eid=eidAe82f81229fs9B4ZsLfRBQyuVT/L0+I1SjQeGbabPdLiqqAlBWdZaxXmIeRrfGbc9021yEMIuMnLe6OxdixnGd1tZu3diHmzFmSRsHt5NPWe1KGRV&sdkVersion=30&lang' \          '=zh_CN&uuid=6b1601dca8546b0c&aid=6b1601dca8546b0c&area=16_1332_1334_43086&networkType=4g&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJVloh%2FqRQE4bxGpeOi6OtO%2BZjyuQk8mLpFD%2FWgFNOgYrQu016rDJpeUacumQuHhN7obKdtrDtbE4e1nfIPvFL0g50Je2Hetp%2BevrnGtmoK7nesibwfUHGoyCsb%2F%2BQvCwo0T7SlPNMRGBci08aMqwAO0mYzFO6lLqrJRva71es2npkNpjmK1Gpxg%3D%3D' \
          '&uemps=0-0&harmonyOs=0&st=1630565356412&sign=76f3ea0ce8bc91cc05f799329dd2296c&sv=101'] #  data1 就是从genToken里获取到的参数 自己填写下吧
    index = random.randint(0, len(dataList)-1)
    return dataList[index]
    print('使用的是第'+ str(index) + '随机sign')
    return dataList[index]

def gettimestamp():
    return str(int(time.time() * 1000))


def login(username, password):
    url = "http://127.0.0.1:5700/api/login?t=%s" % gettimestamp()
    data = {"username": username, "password": password}
    r = s.post(url, data)
    s.headers.update({"authorization": "Bearer " + json.loads(r.text)["data"]["token"]})


def getitem(key):
    url = "http://127.0.0.1:5700/api/envs?searchValue=%s&t=%s" % (key, gettimestamp())
    r = s.get(url)
    item = json.loads(r.text)["data"]
    return item


def getckitem(key):
    url = "http://127.0.0.1:5700/api/envs?searchValue=JD_COOKIE&t=%s" % gettimestamp()
    r = s.get(url)
    for i in json.loads(r.text)["data"]:
        if key in i["value"]:
            return i
    return []


def wstopt(cookies):
    headers = {
        'user-agent': 'okhttp/3.12.1;jdmall;android;version/10.1.2;build/89743;screen/1080x2293;os/11;network/wifi;',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': cookies,
    }
    url = 'https://api.m.jd.com/client.action?functionId=genToken&' + randomData()
    body = 'body=%7B%22to%22%3A%22https%253a%252f%252fplogin.m.jd.com%252fjd-mlogin%252fstatic%252fhtml' \
           '%252fappjmp_blank.html%22%7D&'
    response = requests.post(url, data=body, headers=headers, verify=False)
    data = json.loads(response.text)
    if data.get('code') != '0':
        return None
    tokenKey = data.get('tokenKey')
    url = data.get('url')
    session = requests.session()
    params = {
        'tokenKey': tokenKey,
        'to': 'https://plogin.m.jd.com/jd-mlogin/static/html/appjmp_blank.html'
    }
    url += '?' + urlencode(params)
    session.get(url, allow_redirects=True)
    result = ""
    for k, v in session.cookies.items():
        if k == 'pt_key' or k == 'pt_pin':
            result += k + "=" + v + "; "
    return result


def update(text, qlid):
    url = "http://127.0.0.1:5700/api/envs?t=%s" % gettimestamp()
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})
    data = {
        "name": "JD_COOKIE",
        "value": text,
        "_id": qlid
    }
    r = s.put(url, data=json.dumps(data))
    if json.loads(r.text)["code"] == 200:
        return True
    else:
        return False


def insert(text):
    url = "http://127.0.0.1:5700/api/envs?t=%s" % gettimestamp()
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})
    data = []
    data_json = {
        "value": text,
        "name": "JD_COOKIE"
    }
    data.append(data_json)
    r = s.post(url, json.dumps(data))
    if json.loads(r.text)["code"] == 200:
        return True
    else:
        return False


if __name__ == '__main__':
    s = requests.session()
    if token == "":
        login(username, password)
    else:
        s.headers.update({"authorization": "Bearer " + token})
    wskeys = getitem("JD_WSCK")
    count = 1
    for i in wskeys:
        if i["status"]==0:
            ptck = wstopt(i["value"])
            wspin = re.findall(r"pin=(.*?);", i["value"])[0]
            item = getckitem("pt_pin=" + wspin)
            if item != []:
                qlid = item["_id"]
                if update(ptck, qlid):
                    print("第%s个wskey更新成功, pin:%s" % (count, wspin))
                else:
                    print("第%s个wskey更新失败, pin:%s" % (count, wspin))
            else:
                if insert(ptck):
                    print("第%s个wskey添加成功" % count)
                else:
                    print("第%s个wskey添加失败" % count)
            count += 1
        else:
            print("有一个wskey被禁用了")
