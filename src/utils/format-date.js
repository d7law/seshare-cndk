function formatToDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function countTimes(created) {
  var now = new Date();

  // Tính số milliseconds bằng cách lấy hiệu của hai thời điểm
  var soMilliseconds = now - created;

  // Tính số giây, phút, giờ, ngày, tháng
  var soGiay = Math.floor(soMilliseconds / 1000);
  var soPhut = Math.floor(soGiay / 60);
  var soGio = Math.floor(soPhut / 60);
  var soNgay = Math.floor(soGio / 24);
  var soTuan = Math.floor(soNgay / 7);

  return {
    seconds: soGiay,
    minutes: soPhut,
    hours: soGio,
    dates: soNgay,
    weeks: soTuan,
  };
}

function formatTimeUpload(doTime) {
  const countTime = countTimes(doTime);
  let res = "";
  if (countTime.minutes === 0) {
    res = "Vừa xong";
  } else if (countTime.minutes > 0 && countTime.hours === 0) {
    res = `${countTime.minutes} phút trước`;
  } else if (countTime.hours > 0 && countTime.dates === 0) {
    res = `${countTime.hours} tiếng trước`;
  } else if (countTime.dates > 0 && countTime.weeks === 0) {
    res = `${countTime.dates} ngày trước`;
  } else {
    res = `${countTime.weeks} tuần trước`;
  }
  return res;
}

function isOver24Hours(doTime) {
  const countTime = countTimes(doTime);
  if (countTime.hours <= 24) {
    return true;
  }
  return false;
}
module.exports = {
  formatToDate,
  countTimes,
  formatTimeUpload,
  isOver24Hours,
};
