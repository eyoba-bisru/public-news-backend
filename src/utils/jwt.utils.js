const jwt = require("jsonwebtoken");
require("dotenv/config");

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgFDXAwf/R+OGOwCTnM9dQ1/c6fHZiNMHSgzsPAr1A5ZrRvFpNNP7
wt28bXhZzCRkMq9lDbou6+8VsE7qJU+dU/rlcEzaTwbG8VBI7rKg4ZylZQX4Vc/W
V85l5P9VcaeJnqlgib5Y7QQr+WjQhK9R7eaFIf3xTXE2yE03qSeg7BPTAgMBAAEC
gYA1VskvO6dJXsYLiVpMEHNmCzNpWmlHJGYdxLmRWTz2wO3cV9h9jn5zI+LvKADk
eiBfTkQSdudBp4PfbesUbvB7u4rMMZ1QGioCzfrN3kIRoPPd5wevLTcTs6+7l1ft
b7tq8Iyf50q1BozstxG+qLiG/ZnMUzwGtfum0hxdxOfOkQJBAJLEVz8dncafWgSQ
zCoNWshnWcdIwohU3VLxqbVT0wsWql2agOMKg4aXoM4dMkpMm6WZe1w0lcUIRsHB
UnsNlr8CQQCNAYTuXMt6/0yAFHek5nfoiclBG+L+bloR1DvzAHMV9tFX7VTDRQYs
hyRUHJmP8Nx8JAiMvFlUrg8FxUJwRrvtAkA758Qs0OvbbKOThX6wE29gqT6t5vbw
KqOD/XvltWdI+WFkf3HoOhxhTXanaqdiSE6nkzQU+KnBGJW49C20aGGFAkAXibVj
BOKCubNPfhsqz74cd0O9NqaBynIGn+MSAXU0qWrwvpFzt0X8kOKjl9KakJ59qpYy
yA4xcIzZbcBVdblRAkBL8DtBbWWL0Fx4lFsAMaanMmPoGdA3kgzMKcQ+E9DhEI8m
9tWaV7RjnW+4ciDIt8A+phGgjxpH9W+t7poGyqQD
-----END RSA PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFDXAwf/R+OGOwCTnM9dQ1/c6fHZ
iNMHSgzsPAr1A5ZrRvFpNNP7wt28bXhZzCRkMq9lDbou6+8VsE7qJU+dU/rlcEza
TwbG8VBI7rKg4ZylZQX4Vc/WV85l5P9VcaeJnqlgib5Y7QQr+WjQhK9R7eaFIf3x
TXE2yE03qSeg7BPTAgMBAAE=
-----END PUBLIC KEY-----`;

// sign jwt
function signJWT(payload, expiresIn) {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn,
  });
}

// verify jwt
function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
}

module.exports = { verifyJWT, signJWT };
