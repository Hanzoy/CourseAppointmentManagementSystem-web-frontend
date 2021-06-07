import axios from "axios";

// export const baseUrl = "http://127.0.0.1:8080"
// export const baseUrl = "https://kfty.hanzoy.com"
export const baseUrl = "http://123.56.217.92:8080"

// eslint-disable-next-line import/no-anonymous-default-export
export default  (options) => {
  return new Promise((resolve,_) => {
    axios.request({
      url: baseUrl + options.url,
      method: options.method.toUpperCase(),
      headers: {'Content-Type': 'application/json'},
      data: {
        ...options.data
      }
    }).then(r =>resolve(r.data))
  });
}
