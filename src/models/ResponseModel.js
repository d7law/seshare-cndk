class ResponseModel {
  response(status, data) {
    return { status, data };
  }
  authResponse(status, user, token) {
    return { status, user, token };
  }
}

module.exports = new ResponseModel();
