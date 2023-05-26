const _ = require("lodash");

let a = [{ photo: [1, 2, 3] }, { photo: [4, 5, 6] }];
const r = _.countBy(a);
console.log(r);

const arr = [
  {
    _id: "646b358a9a4b6e76d4bb8d54",
    photo_path: ["7r71K_url_1512AQ4L.jpg", "L1WAU_url_ZmM56c9w.jpg"],
    caption: "Picnic ☘️🌈",
    total_likes: 2,
    list_likes: ["646b31b01ac9a8d738d3acb9", "646cd025f6ad2d12b7d956fb"],
    liked: false,
    total_comment: 1,
    isAvatar: false,
    privacy: "public",
    user_id: {
      _id: "646b34fbc0dc95754e1cf359",
      full_name: "Duy Khang",
      avatar_path: "Kkj70_url_yAqYefOD.jpg",
    },
    user_location: "Gò Vấp, Thành phố Hồ Chí Minh, Việt Nam ",
    checkin_location:
      "137 Thùy Vân, Thành phố Vũng Tầu, Bà Rịa - Vũng Tàu, Việt Nam ",
    uploadAt: "4 ngày trước",
    __v: 0,
    isFriend: false,
  },
  {
    _id: "646b358a9a4b6e76d4bb8d54",
    photo_path: ["7r71K_url_1512AQ4L.jpg", "L1WAU_url_ZmM56c9w.jpg"],
    caption: "Picnic ☘️🌈",
    total_likes: 2,
    list_likes: ["646b31b01ac9a8d738d3acb9", "646cd025f6ad2d12b7d956fb"],
    liked: false,
    total_comment: 1,
    isAvatar: false,
    privacy: "public",
    user_id: {
      _id: "646b34fbc0dc95754e1cf359",
      full_name: "Duy Khang",
      avatar_path: "Kkj70_url_yAqYefOD.jpg",
    },
    user_location: "Gò Vấp, Thành phố Hồ Chí Minh, Việt Nam ",
    checkin_location:
      "137 Thùy Vân, Thành phố Vũng Tầu, Bà Rịa - Vũng Tàu, Việt Nam ",
    uploadAt: "4 ngày trước",
    __v: 0,
    isFriend: false,
  },
];

console.log(_.uniqBy(arr, "_id"));
