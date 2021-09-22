/*

https://wbbny.m.jd.com/babelDiy/Zeus/2rtpffK8wqNyPBH6wyUDuBKoAbCt/index.html


*/


const $ = new Env('东东玩家');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

$.joyytoken = "";
let joyytoken_count = 0

let outuserIdArr = [];
let outuserID = '';// 指定执行 2,5,7
outuserID = $.isNode() ? (process.env.gua_DDwj_outuserID ? process.env.gua_DDwj_outuserID : `${outuserID}`) : ($.getdata('gua_DDwj_outuserID') ? $.getdata('gua_DDwj_outuserID') : `${outuserID}`);
for(let i of outuserID && outuserID.split(',')){
  outuserIdArr.push(i)
}

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [];
$.cookie = '';
$.inviteList = [];
$.secretpInfo = {};
$.ShInviteList = [];
$.innerShInviteList = [];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
// 是否开启星球
$.raise = 'false'
$.raise = $.isNode() ? (process.env.gua_DDwj_raise ? process.env.gua_DDwj_raise : `${$.raise}`) : ($.getdata('gua_DDwj_raise') ? $.getdata('gua_DDwj_raise') : `${$.raise}`);

$.tgID = ''
$.tgID = $.isNode() ? (process.env.gua_DDwj_tgID ? process.env.gua_DDwj_tgID : `${$.tgID}`) : ($.getdata('gua_DDwj_tgID') ? $.getdata('gua_DDwj_tgID') : `${$.tgID}`);
$.appid = 'o2_act';
$.UA = ''
$.UUID = ''
let utils = ''

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  console.log('\n\n该脚本启用了[正道的光]模式\n执行 做任务、做店铺任务 会有几率不执行\n本脚本不让任务一次全部做完\n您可以多跑几次\n北京时间18时后是正常模式\n\n🐸\n')

  
  console.log(`您指定执行的账号是${outuserID}`)
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.index = i + 1;
      let out = false
      if(outuserIdArr[0]){
        for(let c of outuserIdArr){
            if(c == $.index) {
                out = true
                break
            }
        }
        if(!out) continue
      }
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.isLogin = true;
      $.nickName = $.UserName;
      $.hotFlag = false; //是否火爆
      $.joyytoken = ''
      joyytoken_count = 0
      getUA()
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      console.log(`\n如有未完成的任务，请多执行几次\n`);
      await movement()
      if($.hotFlag)$.secretpInfo[$.UserName] = false;//火爆账号不执行助力
    }
  }

  // 助力
  if($.inviteList.length > 0){
    for (let i = 0; i < cookiesArr.length; i++) {
      if (!$.secretpInfo[$.UserName]) {
        continue;
      }
      $.index = i + 1;
      let out = false
      if(outuserIdArr[0]){
        for(let c of outuserIdArr){
            if(c == $.index) {
                out = true
                break
            }
        }
        if(!out) continue
      }
      $.canHelp = true;
      $.hotFlag = false;
      $.index = i + 1;
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.nickName = $.UserName;
      $.joyytoken = ''
      joyytoken_count = 0
      getUA()
      $.secretp = $.secretpInfo[$.UserName];
      // if ($.inviteList && $.inviteList.length) console.log(`\n******开始内部京东账号【邀请好友助力】*********\n`);
      for (let j = 0; j < $.inviteList.length && $.canHelp && !$.hotFlag; j++) {
        $.oneInviteInfo = $.inviteList[j];
        $.inviteId = $.oneInviteInfo.inviteId || '';
        if ($.oneInviteInfo.ues === $.UserName || $.oneInviteInfo.max || $.inviteId == '') {
          continue;
        }
        console.log(`${$.UserName}去助力${$.oneInviteInfo.ues},助力码${$.inviteId}`);
        await takePostRequest('help');
        await $.wait(getRndInteger(2000, 4000));
      }
    }
  }
  

})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


async function movement() {
  try {
    $.signSingle = {};
    $.homeData = {};
    $.secretp = ``;
    $.taskList = [];
    $.shopSign = ``;
    $.userInfo = ''
    $.collectScore = false
    await takePostRequest('funny_getHomeData');
    if($.homeData.result){
      $.homeMainInfo = $.homeData.result.homeMainInfo
      $.raiseInfo = $.homeMainInfo.raiseInfo
      console.log(`等级${$.raiseInfo.scoreLevel} 好玩豆:共${$.raiseInfo.totalScore} 剩${$.raiseInfo.remainScore} 下一级需${$.raiseInfo.nextLevelScore-$.raiseInfo.curLevelStartScore}`)
    }
    if($.homeData.result.popupInfo){
      // 弹窗
      $.oneActivityInfo = $.homeData.result.popupInfo.continuousSignInfo || ''
      if($.oneActivityInfo){
        await $.wait(getRndInteger(1000, 2000));
        $.oneTask = $.oneActivityInfo
        console.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName}`);
        $.oneActivityInfo = $.oneActivityInfo.simpleRecordInfoVo
        console.log($.oneTask.taskId,$.oneActivityInfo.taskToken)
        await takePostRequest('funny_collectScore');
        await $.wait(getRndInteger(2000, 4000));
      }
    }
    if(!$.hotFlag) await takePostRequest('funny_getTaskDetail');
    console.log(`\n做任务\n`);
    await $.wait(1000);
    //做任务
    for (let i = 0; i < $.taskList.length && !$.hotFlag; i++) {
      if(!aabbiill()) continue;
      $.oneTask = $.taskList[i];
      if ([1, 3, 5, 7, 9, 21, 26].includes($.oneTask.taskType) && $.oneTask.status === 1) { // 21 开通
        $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          console.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName} ${$.oneTask.waitDuration > 0 && '等待'+$.oneTask.waitDuration+'秒'||''}`);
          if ($.oneTask.taskType === 21 && false){
            let channel = $.oneActivityInfo.memberUrl.match(/channel=(\d+)/) ? $.oneActivityInfo.memberUrl.match(/channel=(\d+)/)[1] : '';
            const jiarubody = {
              venderId: $.oneActivityInfo.vendorIds,
              shopId: $.oneActivityInfo.ext.shopId,
              bindByVerifyCodeFlag: 1,
              registerExtend: {},
              writeChildFlag: 0,
              channel: channel
            }
          }
          $.collectScore = true
          await takePostRequest('funny_collectScore');
          if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
            await $.wait((Number($.oneTask.waitDuration) || 6) * 1000);
            let body = ''
            let sign = ''
            let signBody = `{"dataSource":"shortTermAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}"}`
            sign = await jdSign('qryViewkitCallbackResult', signBody)
            if(sign) await callbackResult(sign)
          }
          await $.wait(getRndInteger(2000, 4000));
          if($.hotFlag) break
        }
      } else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 2){
        console.log(`做任务：${$.oneTask.taskName};等待完成 (实际不会添加到购物车)`);
        $.taskId = $.oneTask.taskId;
        $.feedDetailInfo = {};
        await takePostRequest('funny_getFeedDetail');
        let productList = $.feedDetailInfo.productInfoVos;
        let needTime = Number($.feedDetailInfo.maxTimes) - Number($.feedDetailInfo.times);
        for (let j = 0; j < productList.length && needTime > 0; j++) {
          if(productList[j].status !== 1){
            continue;
          }
          $.taskToken = productList[j].taskToken;
          console.log(`加购：${productList[j].skuName}`);
          await takePostRequest('add_car');
          await $.wait(getRndInteger(1000, 2000));
          needTime --;
          if($.hotFlag) break
        }
      }else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 0){
        $.activityInfoList = $.oneTask.productInfoVos ;
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          console.log(`做任务：浏览${$.oneActivityInfo.skuName} ${$.oneTask.waitDuration > 0 && '等待'+$.oneTask.waitDuration+'秒'||''}`);
          $.collectScore = true
          await takePostRequest('funny_collectScore');
          await $.wait(getRndInteger(4000, 10000));
          if($.hotFlag) break
        }
      }
      
      if($.hotFlag) break
    }

    $.shopInfoList = [];
    if(!$.hotFlag) await takePostRequest('qryCompositeMaterials');
    console.log(`\n去做店铺任务\n`);
    $.shopInfoList = [...$.shopInfoList,...$.homeData.result.homeMainInfo.raiseInfo.userEarthInfo.earthInfoList || []]
    for (let i = 0; i < $.shopInfoList.length && true; i++) {
      if(!aabbiill()) continue;
      $.shopSign = $.shopInfoList[i].extension && $.shopInfoList[i].extension.shopId || $.shopInfoList[i].link && $.shopInfoList[i].link.match(/shopSign=([^&]+)/) && $.shopInfoList[i].link.match(/shopSign=([^&]+)/)[1] || $.shopInfoList[i].earthLogoJumpUrl && $.shopInfoList[i].earthLogoJumpUrl.match(/shopSign=([^&]+)/) && $.shopInfoList[i].earthLogoJumpUrl.match(/shopSign=([^&]+)/)[1] || '';
      if($.shopSign == '') continue
      console.log(`执行第${i+1}个店铺任务：${$.shopInfoList[i].name || $.shopInfoList[i].earthName || ''} ID:${$.shopSign}`);
      $.shopResult = {};
      await takePostRequest('funny_shopLotteryInfo');
      await $.wait(getRndInteger(2000, 3000));
      if(JSON.stringify($.shopResult) === `{}`) continue;
      $.shopTask = $.shopResult.taskVos;
      for (let i = 0; i < $.shopTask.length; i++) {
        $.oneTask = $.shopTask[i];
        if([14].includes($.oneTask.taskType)|| $.oneTask.status !== 1){continue;} //不做入会//不做邀请
        $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.simpleRecordInfoVo || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo || [];
        if([12].includes($.oneTask.taskType)){//签到
          if($.shopResult.dayFirst === 0){
            $.oneActivityInfo =  $.activityInfoList;
            console.log($.oneTask.taskName);
            await takePostRequest('funny_bdCollectScore');
          }
          await $.wait(getRndInteger(2000, 4000));
          continue;
        }
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          console.log(`做任务：${$.oneActivityInfo.subtitle || $.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName} ${$.oneTask.waitDuration > 0 && '等待'+$.oneTask.waitDuration+'秒'||''}`);
          $.collectScore = true
          await takePostRequest('funny_bdCollectScore');
          if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
            await $.wait((Number($.oneTask.waitDuration) || 6) * 1000);
            await takePostRequest('funny_bdCollectScore');
          }
          await $.wait(getRndInteger(2000, 4000));
        }
      }
      await $.wait(1000);
      let boxLotteryNum = $.shopResult.boxLotteryNum;
      for (let j = 0; j < boxLotteryNum; j++) {
        console.log(`开始第${j+1}次拆盒`)
        //抽奖
        await takePostRequest('funny_boxShopLottery');
        await $.wait(getRndInteger(3000, 5000));
      }
      await $.wait(getRndInteger(3000, 5000));
    }
    
    //==================================微信任务========================================================================
    $.wxTaskList = [];
    if(!$.hotFlag) await takePostRequest('wxTaskDetail');
    // if(!$.hotFlag && !$.maxLevel) await takePostRequest('wxTaskDetail');
    console.log(`\n去做微信任务\n`);
    for (let i = 0; i < $.wxTaskList.length; i++) {
      if(!aabbiill()) continue;
      $.oneTask = $.wxTaskList[i];
      if($.oneTask.taskType === 2 || $.oneTask.status !== 1){continue;} //不做加购
      $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
      for (let j = 0; j < $.activityInfoList.length; j++) {
        $.oneActivityInfo = $.activityInfoList[j];
        if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
          continue;
        }
        $.callbackInfo = {};
        console.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
        $.collectScore = true
        await takePostRequest('funny_collectScore');
        if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
          await $.wait((Number($.oneTask.waitDuration) || 6) * 1000);
            let body = ''
            let sign = ''
            let signBody = `{"dataSource":"shortTermAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}"}`
            sign = await jdSign('qryViewkitCallbackResult', signBody)
            if(sign) await callbackResult(sign)
        // } else  {
        //   await $.wait(2000);
        //   console.log(`任务完成`);
        }
        await $.wait(getRndInteger(2000, 4000));
        if($.hotFlag) break
      }
    }
    console.log('\n')
    await takePostRequest('funny_getHomeData');
    $.earthInfoList = []
    if($.homeData.result){
      $.homeMainInfo = $.homeData.result.homeMainInfo
      $.raiseInfo = $.homeMainInfo.raiseInfo
      console.log(`等级${$.raiseInfo.scoreLevel} 好玩豆:共${$.raiseInfo.totalScore} 剩${$.raiseInfo.remainScore} 下一级需${$.raiseInfo.nextLevelScore-$.raiseInfo.curLevelStartScore}`)
      $.earthInfoList = $.raiseInfo.userEarthInfo.earthInfoList || []
      $.oneLeveScore = 0
      for(let i of $.earthInfoList){
        // funny_raise kaiqi
        console.log(`${i.earthName} 开启${i.unLockedNum}/${i.placeInfos.length}`)
        if(i.earthStatus === 0 && $.raiseInfo.remainScore-$.oneLeveScore >= $.raiseInfo.nextLevelScore-$.raiseInfo.curLevelStartScore){
          for(let o of i.placeInfos){
            $.id = o.id
            console.log(`${o.name} ${o.status == 2 && '开启' || '未开启'}`)
            if(o.status == 1 && $.raiseInfo.remainScore - $.oneLeveScore >= $.raiseInfo.nextLevelScore-$.raiseInfo.curLevelStartScore && $.raise+"" === 'true') await takePostRequest('funny_raise');
          }
        }
      }
    }
    await $.wait(getRndInteger(3000, 5000));
  } catch (e) {
    $.logErr(e)
  }
}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case 'funny_getHomeData':
      body = `functionId=${type}&body={}&client=wh5&clientVersion=1.0.0&uuid=${$.UUID}&appid=${$.appid}`;
      myRequest = await getPostRequest(type, body);
      break;
    case 'funny_getTaskDetail':
      body = `functionId=${type}&body={"taskId":"","appSign":"1"}&client=wh5&clientVersion=1.0.0&uuid=${$.UUID}&appid=${$.appid}`;
      myRequest = await getPostRequest(type, body);
      break;
    case 'wxTaskDetail':
      body = `functionId=funny_getTaskDetail&body={"taskId":"","appSign":"2"}&client=wh5&clientVersion=1.0.0&uuid=${$.UUID}&appid=${$.appid}`;
      myRequest = await getPostRequest("funny_getTaskDetail", body);
      break;
    case 'qryCompositeMaterials':
      body = `functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"advertGroupResult\\",\\"id\\":\\"05794435\\"}]"}&client=wh5&clientVersion=1.0.0&uuid=&appid=${$.appid}`;
      myRequest = await getPostRequest('', body);
      break;
    case 'funny_boxShopLottery':
    case 'funny_shopLotteryInfo':
      body = `functionId=${type}&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0&uuid=${$.UUID}&appid=${$.appid}`;
      myRequest = await getPostRequest(type,body);
      break;
    case 'funny_bdCollectScore':
    case 'funny_collectScore':
    case 'funny_raise':
    case 'add_car':
      body = await getPostBody(type);
      if(body){
        myRequest = await getPostRequest(type, body);
      }
      break;
    case 'funny_getFeedDetail':
      body = `functionId=${type}&body={"taskId":"${$.taskId}"}&client=wh5&clientVersion=1.0.0&uuid=${$.UUID}&appid=${$.appid}`;
      myRequest = await getPostRequest(type, body);
      break;
    case 'help':
      body = await getPostBody(type);
      if(body){
        myRequest = await getPostRequest(`funny_collectScore`, body);
      }
      break;
    default:
      console.log(`错误${type}`);
  }
  if (myRequest) {
    return new Promise(async resolve => {
      $.post(myRequest, (err, resp, data) => {
        try {
          // console.log(data);
          dealReturn(type, data);
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }
}


async function dealReturn(type, res) {
  try {
    data = JSON.parse(res);
  } catch (e) {
    console.log(`返回异常：${res}`);
    return;
  }
  switch (type) {
    case 'funny_getHomeData':
      if (data.code === 0 && data.data && data.data.result) {
        if (data.data['bizCode'] === 0) {
          $.homeData = data.data;
          $.secretp = data.data.result.homeMainInfo.secretp;
          $.secretpInfo[$.UserName] = $.secretp;
          // $.secretpInfo[$.UserName] = true
        }
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'funny_getTaskDetail':
      // console.log(res)
      if (data.data && data.data.bizCode === 0) {
        console.log(`互助码：${data.data.result && data.data.result.inviteId || '助力已满，获取助力码失败'}\n`);
        if (data.data.result && data.data.result.inviteId) {
          $.inviteList.push({
            'ues': $.UserName,
            // 'secretp': $.secretp,
            'inviteId': data.data.result.inviteId,
            'max': false
          });
        }
        $.taskList = data.data.result && data.data.result.taskVos || [];
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'wxTaskDetail':
      if (data.code === 0) {
        $.wxTaskList = data.data.result.taskVos;
      }
      break;
    case 'qryCompositeMaterials':
      // console.log(res);
      if (data.code === '0') {
        $.shopInfoList = data.data.advertGroupResult.list || [];
        console.log(`获取到${$.shopInfoList.length}个店铺`);
      }
      break
    case 'funny_shopLotteryInfo':
      if (data.code === 0) {
        $.shopResult = data.data.result;
      }
      break;
    case 'funny_raise':
      console.log(res)
      if(data.data && data.data.bizCode === 0){
        if(data.data.result.raiseInfo){
          $.oneLeveScore += $.raiseInfo.nextLevelScore-$.raiseInfo.curLevelStartScore
          $.raiseInfo.nextLevelScore = data.data.result.raiseInfo.nextLevelScore || 0
          $.raiseInfo.curLevelStartScore = data.data.result.raiseInfo.curLevelStartScore || 0
        }
        let msg = ''
        if(data.data.result.levelUpAward.score) msg += ` ${data.data.result.levelUpAward.score}好玩豆`
        if(data.data.result.levelUpAward.pieceRedpacket) msg += ` 红包:${data.data.result.levelUpAward.pieceRedpacket.value || 0}元 期限:${data.data.result.levelUpAward.pieceRedpacket.desc || ''}`
        if(data.data.result.levelUpAward.score) $.oneLeveScore -= Number(data.data.result.levelUpAward.score) || 0
        console.log(`获得:${msg || res}`);
        console.log($.oneLeveScore)
      }else if(data.data && data.data.bizMsg){
        console.log(data.data.bizMsg);
      }else{
        console.log(res);
      }
      break;
      case 'funny_bdCollectScore':
      case 'funny_collectScore':
        $.callbackInfo = data;
      case 'funny_boxShopLottery':
      // console.log(res)
      if(data.data && data.data.bizCode === 0){
        if(!data.data.result.taskToken){
          let msg = ''
          if(data.data.result.score || data.data.result.rewardScore || false) {
            msg += ` ${data.data.result.score || data.data.result.rewardScore}好玩豆`
          }
          if(data.data.result.redpacket) msg += ` 红包:${data.data.result.redpacket.value || 0}元 期限:${data.data.result.redpacket.desc || ''}`
          console.log(`获得:${msg || res}`);
        }
      }else if(data.data && data.data.bizMsg){
        console.log(data.data.bizMsg);
      }else{
        console.log(res);
      }
      break;
    case 'funny_getFeedDetail':
      if (data.code === 0) {
        $.feedDetailInfo = data.data.result.addProductVos[0];
      }
      break;
    case 'add_car':
      if (data.code === 0) {
        let acquiredScore = data.data.result.acquiredScore;
        if(Number(acquiredScore) > 0){
          console.log(`加购成功,获得金币:${acquiredScore}`);
        }else{
          console.log(`加购成功`);
        }
      }else{
        console.log(JSON.stringify(data));
        console.log(`加购失败`);
      }
      break
    case 'help':
    // case 'pkHelp':
      // console.log(data);
      switch (data.data.bizCode) {
        case 0:
          console.log(`助力成功`);
          break;
        case -201:
          console.log(`助力已满`);
          $.oneInviteInfo.max = true;
          break;
        case -202:
          console.log(`已助力`);
          break;
        case -8:
          console.log(`已经助力过该队伍`);
          break;
        case -4:
          console.log(`助力失败：${JSON.stringify(data)}`);
          break;
        case -6:
        case 108:
          console.log(`助力次数已用光`);
          $.canHelp = false;
          break;
        case -1002:
          console.log(`助力失败：${JSON.stringify(data)}`);
          $.canHelp = false;
          break;
        default:
          console.log(`助力失败：${JSON.stringify(data)}`);
      }
      break;
    default:
      console.log(`未判断的异常:${type}`);
  }
}

async function getPostBody(type) {
  return new Promise(async resolve => {
    let taskBody = '';
    try {
      var random = Math.floor(1e+6 * Math.random()).toString().padEnd(8, '8');
      var senddata = {
        data: {
          random
        }
      };
      $.riskData = {}
      if($.secretp){
        $.riskData = {...$.riskData,"secretp":$.secretp}
      }
      var log = ''
      let data = {
        "joyytoken_count": $.joyytoken_count || 0,
        "joyytoken": $.joyytoken,
        "riskData": $.riskData,
        "UUID": $.UUID,
        "UANumber": $.UANumber,
      }
      let res = await get_risk_result(data);
      log = res.log || ''
      if(log == '') {
        resolve(taskBody)
        return
      }
      $.joyytoken = res.joyytoken || ''
      var uuid = `&uuid=${$.UUID}`;
      if (type === 'help' || type === 'shHelp') {
        taskBody = `functionId=funny_collectScore&body=${JSON.stringify({"inviteId":$.inviteId,"isCommonDealError": true,"ss" :log})}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`
      } else if (type === 'funny_raise') {
        taskBody = `functionId=funny_raise&body=${JSON.stringify({"id": $.id,"ss":log})}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`;
      } else if (type === 'funny_startTraining' || type === 'funny_speedTraining') {
        taskBody = `functionId=${type}&body=${JSON.stringify({ "ss" : log})}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`;
      } else if(type === 'add_car'){
        taskBody = `functionId=funny_collectScore&body=${JSON.stringify({"taskId": $.taskId,"taskToken" : $.taskToken,"ss" : log,"actionType":0})}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`
      }else{
        let body = {"taskId": $.oneTask.taskId,"taskToken" : $.oneActivityInfo.taskToken,"ss":log}
        if(type == 'funny_bdCollectScore'){
          body = {...body,"shopSign":$.shopSign}
        }
        if($.collectScore){
          body = {...body,"actionType":1}
          $.collectScore = false
        }
        taskBody = `functionId=${type}&body=${JSON.stringify(body)}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`
      }
    } catch (e) {
      $.logErr(e)
    } finally {
      resolve(taskBody);
    }
  })
}

async function getPostRequest(type, body) {
  let url = `https://api.m.jd.com/client.action${type && '?advId='+type || ''}`;
  const method = `POST`;
  const headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Content-Type": "application/x-www-form-urlencoded",
    'Cookie': `${$.cookie}${$.joyytoken && 'joyytoken=50088'+$.joyytoken+';' || ''}`,
    "Origin": "https://h5.m.jd.com",
    "Referer": "https://h5.m.jd.com/",
    "User-Agent": $.UA,
  };
  return {url: url, method: method, headers: headers, body: body, timeout:30000};
}
function jdSign(fn,body) {
  return new Promise((resolve) => {
    let url = {
      url: `https://jd.smiek.tk/jdsign_21092132`,
      body:`{"fn":"${fn}","body":${body}}`,
      followRedirect:false,
      headers: {
        'Accept':'*/*',
        "accept-encoding": "gzip, deflate, br",
        'Content-Type': 'application/json',
      },
      timeout:30000
    }
    $.post(url, async (err, resp, data) => {
      try {
        let res = $.toObj(data,data)
        if(res && typeof res === 'object'){
          if(res.code && res.code == 200 && res.msg == "ok" && res.data){
            let sign = ''
            if(res.data.sign) sign = res.data.sign || ''
            resolve(sign)
          }else{
            console.log(data)
          }
        }else{
          console.log(data)
        }
      } catch (e) {
        console.log(e);
      } finally {
        resolve('')
      }
    })
  })
}
function get_risk_result(data) {
  return new Promise((resolve) => {
    let url = {
      url: `https://jd.smiek.tk/ddwj_210921152`,
      body:`{"user":{"code":"${$.tgID || ""}","pin":"${$.UserName}"},"data":${$.toStr(data,data)}}`,
      followRedirect:false,
      headers: {
        'Accept':'*/*',
        "accept-encoding": "gzip, deflate, br",
        'Content-Type': 'application/json',
      },
      timeout:30000
    }
    $.post(url, async (err, resp, data) => {
      try {
        let res = $.toObj(data,data)
        if(res && typeof res === 'object'){
          if(res.code && res.code == 200 && res.msg == "ok" && res.data){
            let log = ''
            if(res.data) log = res.data || ''
            resolve(log)
          }else{
            console.log(data)
          }
        }else{
          console.log(data)
        }
      } catch (e) {
        console.log(e);
      } finally {
        resolve({})
      }
    })
  })
}



//领取奖励
function callbackResult(info) {
  return new Promise((resolve) => {
    let url = {
      url: `https://api.m.jd.com/client.action?functionId=qryViewkitCallbackResult`,
      body:info,
      headers: {
        'Cookie': $.cookie,
        'Connection': `keep-alive`,
        'Accept': `*/*`,
        'Host': `api.m.jd.com`,
        'User-Agent': $.UA,
        'Accept-Encoding': `gzip, deflate, br`,
        'Accept-Language': `zh-cn`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': ''
      },
      timeout:30000
    }
    $.post(url, async (err, resp, data) => {
      try {
        // console.log(data)
        data = JSON.parse(data);
        console.log(data.toast.subTitle)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    })
  })
}


function getUA(){
  $.UANumber = '167814'
  $.UUID = randomString(40)
  $.UA = `jdapp;iPhone;10.1.4;13.1.2;${$.UUID};network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/${$.UANumber};jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}

function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
/**
 * 随机从一数组里面取
 * @param arr
 * @param count
 * @returns {Buffer}
 */
 function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

// 正道的光
function aabbiill(){
  let ccdd = 0
  if(new Date().getUTCHours() + 8 >= 18 && new Date().getUTCHours() + 8 < 24){
    ccdd = 1
  }else{
    ccdd = getRndInteger(0,3)
  }
  return ccdd == 1
}

// 随机数
function getRndInteger(min, max) {
  return Math.round(Math.random() * (max - min) ) + min;
}

// 计算时间
function timeFn(dateBegin) {
  //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  var dateEnd = new Date(0);//获取当前时间
  var dateDiff = dateBegin - dateEnd.getTime();//时间差的毫秒数
  var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)

  var timeFn = hours + ":" + minutes + ":" + seconds;
  return timeFn;
}


function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
