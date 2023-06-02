const { ONE_SIGNAL_CONFIG } = require("../config/one-signal");

async function SendNotification(data, username, callback) {
  let inputMessage = {
    app_id: ONE_SIGNAL_CONFIG.APP_ID,
    contents: {
      en: `${data}`,
    },
    included_segments: ["Active Users"],
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "SeShare thông báo mới!",
    },
  };
  let headers = {
    "Content-Type": "application/json; charset = utf-8",
    Authorization: "Basic " + ONE_SIGNAL_CONFIG.API_KEY,
  };
  const options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers,
  };

  var https = require("https");
  let req = https.request(options, function (res) {
    res.on("data", function (data) {
      console.log(JSON.parse(data));
      return callback(null, JSON.parse(data));
    });
  });
  req.on("error", function (e) {
    return callback({
      message: e,
    });
  });

  req.write(JSON.stringify(inputMessage));
  req.end();
}
async function SendNotificationToDevice(player_ids, data, username, callback) {
  let inputMessage = {
    app_id: ONE_SIGNAL_CONFIG.APP_ID,
    contents: {
      en: `${data}`,
    },
    include_player_ids: player_ids,
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "Thông báo từ SeShare",
    },
  };
  let headers = {
    "Content-Type": "application/json; charset = utf-8",
    Authorization: "Basic " + ONE_SIGNAL_CONFIG.API_KEY,
  };
  const options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers,
  };

  var https = require("https");
  let req = https.request(options, function (res) {
    res.on("data", function (data) {
      console.log(JSON.parse(data));
      return callback(null, JSON.parse(data));
    });
  });
  req.on("error", function (e) {
    return callback({
      message: e,
    });
  });

  req.write(JSON.stringify(inputMessage));
  req.end();

  if (!pushNoti) {
    console.log("Fail to save notification");
  }
}
module.exports = { SendNotification, SendNotificationToDevice };
