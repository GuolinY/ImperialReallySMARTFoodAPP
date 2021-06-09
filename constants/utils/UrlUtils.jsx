import jwt from "jsonwebtoken";

export default function makeUrl(...endpoints) {
  let url = endpoints.reduce((prevUrl, currentPath) => {
    if (prevUrl.length === 0) {
      return prevUrl + currentPath;
    }

    return prevUrl.endsWith("/")
      ? prevUrl + currentPath + "/"
      : prevUrl + "/" + currentPath + "/";
  }, "");
  return url;
}
