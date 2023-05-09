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

module.exports = { formatToDate, countTimes };
