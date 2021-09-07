# 在这里输入青龙面板用户名密码，如果不填写，就自动从auth.json中读取
username = ""
password = ""

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


def gettimestamp():
    return str(int(time.time() * 1000))


def login(username, password):
    url = "http://127.0.0.1:5700/api/login?t=%s" % gettimestamp()
    data = {"username": username, "password": password}
    r = s.post(url, data)
    s.headers.update({"authorization": "Bearer " + json.loads(r.text)["data"]["token"]})


def getitem(searchValue):
    url = "http://127.0.0.1:5700/api/envs?searchValue=%s&t=%s" % (searchValue, gettimestamp())
    r = s.get(url)
    item = json.loads(r.text)["data"]
    return item


def getckitem(searchValue, value):
    url = "http://127.0.0.1:5700/api/envs?searchValue=%s&t=%s" % (searchValue, gettimestamp())
    r = s.get(url)
    for i in json.loads(r.text)["data"]:
        if value in i["value"]:
            return i
    return []


def getsign():
    url = "https://hellodns.coding.net/p/sign/d/jsign/git/raw/master/sign"
    r = s.get(url, verify=False)
    data = "&uuid=" + json.loads(r.text)["uuid"] + "&st=" + json.loads(r.text)["st"] + "&sign=" + json.loads(r.text)["sign"] + "&sv=" + json.loads(r.text)["sv"]
    return data


def wstopt(cookies):
    headers = {
        'user-agent': 'okhttp/3.12.1;jdmall;android;version/;build/0;screen/1080x1920;os/5.1.1;network/wifi;',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': cookies,
    }
    url = 'https://api.m.jd.com/client.action?functionId=genToken&clientVersion=10.1.2&build=89743&client=android&d_brand=OPPO&d_model=PCRT00&osVersion=5.1.1&screen=1920*1080&partner=lc023&oaid=&eid=eidAe81b812187s36z8QOkxpRJWzMceSvZJ6Ges/EbXnbK3TBxc/JEcutXxuELIRMJDVeTNJFcAF/+tx1qw9GllLTdSnFeV3ic6909a697SbDL9zxEc4&sdkVersion=22&lang=zh_CN&aid=21e9fa9db1e4e15d&area=19_1601_3633_63257&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJw%2B3mGtYmx2hY8nVZkXFqGJ2D3wO8rvc%2BnAbe881zrDZjz3yU3z8vQgL8NZ7e39M3H2YpLER13q%2B3VUzHQXXLg4BMmeH%2B1W0%2BxQY%2FL%2FR4Y58JMW9A9F9yD2BtQPynkeKYtBsYDCkOn35Tv9ci57mPbqxYWU0TDVJ8t7JBXRhLckTorzxtEAVucA%3D%3D&uemps=0-0&harmonyOs=0' + getsign()
    body = 'body=%7B%22action%22%3A%22to%22%2C%22to%22%3A%22https%253A%252F%252Fplogin.m.jd.com%252Fcgi-bin%252Fm%252Fthirdapp_auth_page%253Ftoken%253DAAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg%2526client_type%253Dandroid%2526appid%253D879%2526appup_type%253D1%22%7D&'
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
    if result[0:15] == 'pt_key=app_open':
        return result
    else:
        return 'error'



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
    count = 0
    wskeys = getitem("JD_WSCK")
    for i in wskeys:
        count += 1
        if i["status"] == 0:
            wspin = re.findall(r"pin=(.*?);", i["value"])[0]
            ptck = wstopt(i["value"])
            if ptck == "error":
                    print("第%s个wskey转换失败, pin:%s" % (count, wspin))
            else:
                item = getckitem("JD_COOKIE", "pt_pin=" + wspin)
                if item != []:
                    if update(ptck, item["_id"]):
                        print("第%s个wskey更新成功, pin:%s" % (count, wspin))
                    else:
                        print("第%s个wskey更新失败, pin:%s" % (count, wspin))
                else:
                    if insert(ptck):
                        print("第%s个wskey添加成功, pin:%s" % (count, wspin))
                    else:
                        print("第%s个wskey添加失败, pin:%s" % (count, wspin))
        else:
            print("第%s个wskey已禁用, pin:%s" % (count, wspin))
