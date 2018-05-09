// We are storing the content in 3 different ways
// This makes sure we return the correct content field without crashing the app
// 1. { json: ...content }
// 2. { ...content }
// 3. "[...content]"
export default (data) => {
  let o;
  try {
    o = JSON.parse(data);
  } catch (i) { o = data; }

  if (o && 'json' in o) {
    if (typeof o.json === 'string') return JSON.parse(o.json);
    return o.json;
  }
  return o;
};
