export const fetchFromApi = (apiUrl, setHook, initObject = {}) => {
  fetch(apiUrl, initObject)
    .then(checkFetch)
    .then((response) => response.json())
    .then((data) => setHook(data))
    .catch((error) => {
      setHook(null);
      console.log(error);
    });
};

export const checkFetch = (response) => {
  if (!response.ok) {
    throw new Error(`${response.statusText} -> ${response.url}`);
  }
  return response;
};
