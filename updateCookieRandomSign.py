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
    dataList = ['clientVersion=10.1.2&build=89743&client=android&d_brand=HUAWEI&d_model=PRA-AL00&osVersion=8.0.0&screen=1196*720&partner=huawei&oaid=ff5af76f-be3f-b669-da9f-abd5bcff0904&eid=eidAa2e3812137s6+9L4rAqlQ4eLPjp2VZNoRvvS+ierXhDH95z2NPAxYl81oaV3MuNU+081CksSJCDAHOOQe/LUllHy2AfmeHTIYyOgMYdzjS+8vV5i&sdkVersion=26&lang=zh_CN&uuid=5eabf67951f5ee92&aid=5eabf67951f5ee92&area=19_1611_19919_19966&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJVloh%2FqRQE4ahde%2BfJ%2BZVVRlDllYpLlX5nvWl9ZDmhhmyyFOVJz0w6Bc%2BCSP1J8DHGYg9TT6hmhtov8wwec0E9Ct%2FBh%2FKOQ9ek5lQJrA4dEgRrfH1%2B6w%2FpTA%2FVxDqwiYhgV52U%2FlbrOhyD9qHJtrkoOm9yB3bITI8C0sI8OtU9fr12NRWBI9hVQ%3D%3D&uemps=0-2&harmonyOs=0&st=1630566465446&sign=bc6c70538763fa3f372e61e6ddc68f44&sv=121',
           'data2', 
           'data3', 
           'data4', 
           'data5', 
           'data6'] #  data1 就是从genToken里获取到的参数 自己填写下吧
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
