class ResponseModel {
  response(status, message) {
    return { status, message };
  }
  authResponse(status, user, token) {
    return { status, user, token };
  }
}

module.exports = new ResponseModel();
