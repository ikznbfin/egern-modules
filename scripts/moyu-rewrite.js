// 墨鱼去开屏 · 通用重写脚本（Egern / Surge）
// 承接原 Quantumult X 版中的 response-body / jsonjq / echo-response / request-body 规则
// 原作者：@ddgksf2013 ｜ 转换：非官方
// 用法：由 StartUpAds.sgmodule 中的 [Script] 条目调用，无需手动配置

const RULES = [
 {
  "url": "https://beta-api.crunchyroll.com/cms",
  "t": "replace",
  "s": "offset_ms\":\\d+",
  "r": "offset_ms\":99999999999999"
 },
 {
  "url": "^https?:\\/\\/ap\\.(dongqiudi|dongdianqiu)\\.com\\/plat\\/v4",
  "t": "echo",
  "body": "{\"sdk\":[],\"addata\":[]}",
  "ct": "application/json"
 },
 {
  "url": "^https?:\\/\\/maicai\\.api\\.ddxq\\.mobi\\/advert\\/getAd",
  "t": "replace",
  "s": "rt_time\":\\d{2}",
  "r": "rt_time\":40"
 },
 {
  "url": "^https?:\\/\\/.*flyert.*\\/api\\/mobile\\/index\\.php\\?version=\\d&mobile=yes&module=basicdata&type=forumlist",
  "t": "replace",
  "s": "adv",
  "r": "ddgksf2013"
 },
 {
  "url": "^https?:\\/\\/api\\.m\\.jd\\.com\\/client\\.action\\?functionId=lite_advertising",
  "t": "replace",
  "s": "jdLiteAdvertisingVO",
  "r": "ddgksf2013"
 },
 {
  "url": "^https?:\\/\\/api\\.m\\.jd\\.com\\/client\\.action\\?functionId=lite_SmartPush",
  "t": "replace",
  "s": "pushData",
  "r": "ddgksf2013"
 },
 {
  "url": "^https?:\\/\\/res.kfc.com.cn\\/CRM\\/kfcad\\/apphome6\\/apphome.*json",
  "t": "replace",
  "s": "bootStrapAd",
  "r": "ddgksf2013"
 },
 {
  "url": "^https?:\\/\\/api\\.qeeniao\\.com\\/nap\\/ad",
  "t": "emptyData"
 },
 {
  "url": "^https?:\\/\\/apapia-sqk\\.manmanbuy\\.com\\/index_json\\.ashx",
  "t": "replace",
  "s": "splashAD",
  "r": "ddgksf2013"
 },
 {
  "url": "^https?:\\/\\/careapi\\.oclean\\.com\\/mall\\/v\\d\\/User\\/GetUserCenter",
  "t": "replace",
  "s": "banner\"",
  "r": "ddgksf2013\""
 },
 {
  "url": "^https?:\\/\\/j1\\.pupuapi\\.com\\/client\\/marketing\\/advertisement\\/v",
  "t": "replace",
  "s": "launch_time_close\":\\d+",
  "r": "launch_time_close\":1660716799999"
 },
 {
  "url": "^https?:\\/\\/sh-gateway\\.shihuo\\.cn\\/v\\d\\/services\\/sh-adapi\\/home\\/screen",
  "t": "replace",
  "s": "egin_time\":\"\\d{4}",
  "r": "egin_time\":\"2099"
 },
 {
  "url": "^https?:\\/\\/tft-app\\.cdtft\\.cn\\/gateway-customer\\/tftapp\\/tft-ams\\/api\\/appAd",
  "t": "replace",
  "s": "officialAdvertResultVo",
  "r": "ddgksf2013"
 },
 {
  "url": "^https?:\\/\\/testflight\\.apple\\.com\\/v2\\/accounts\\/.*\\/apps\\/\\d*/builds/\\d*/install",
  "t": "reqReplace",
  "s": "storefrontId\" : \".*\"",
  "r": "storefrontId\" : \"143441-1,29\""
 },
 {
  "url": "^https?:\\/\\/acs\\.m\\.taobao\\.com\\/gw\\/mtop\\.alibaba.*mytab",
  "t": "filterYingxiao"
 },
 {
  "url": "^https?:\\/\\/mp\\.weixin\\.qq\\.com\\/mp\\/getappmsgad",
  "t": "replace",
  "s": "advertisement",
  "r": "ddgksf2013"
 },
 {
  "url": "^https?:\\/\\/lcen\\.xiaote\\.net\\/api\\/graphql",
  "t": "replace",
  "s": "screenSplashAd",
  "r": "ddgksf2013"
 },
 {
  "url": "^https?:\\/\\/apps\\.workair\\.cn\\/app\\/version",
  "t": "replace",
  "s": "ads\"",
  "r": "ddgksf2013\""
 },
 {
  "url": "^https:\\/\\/gw\\.xiaocantech\\.com\\/rpc",
  "t": "replace",
  "s": "\"vip_pop_up\":0",
  "r": "\"vip_pop_up\":2"
 }
];

function main() {
  const url = $request.url;
  const isReqPhase = (typeof $response === 'undefined' || !$response || typeof $response.body === 'undefined');
  for (const rule of RULES) {
    let upat;
    try { upat = new RegExp(rule.url); } catch (e) { continue; }
    if (!upat.test(url)) continue;

    // 请求体重写（仅 http-request 阶段）
    if (rule.t === 'reqReplace') {
      if (!isReqPhase) continue;
      try {
        const body = ($request.body || '').replace(new RegExp(rule.s, 'g'), rule.r);
        $done({ body });
      } catch (e) { $done({}); }
      return;
    }
    if (isReqPhase) continue;

    // 直接返回伪造响应
    if (rule.t === 'echo') {
      $done({ body: rule.body, headers: Object.assign({}, $response.headers, { 'Content-Type': rule.ct }) });
      return;
    }

    let body = $response.body || '';
    try {
      if (rule.t === 'replace') {
        body = body.replace(new RegExp(rule.s, 'g'), rule.r);
      } else if (rule.t === 'emptyData') {
        const j = JSON.parse(body);
        j.data = {};
        body = JSON.stringify(j);
      } else if (rule.t === 'filterYingxiao') {
        const j = JSON.parse(body);
        const ch = j && j.data && j.data.model && j.data.model.children;
        if (Array.isArray(ch)) {
          j.data.model.children = ch.filter(c => !(c && c.name && c.name.indexOf('营销') !== -1));
        }
        body = JSON.stringify(j);
      }
    } catch (e) { /* 解析失败则原样返回 */ }
    $done({ body });
    return;
  }
  $done({});
}
main();
