export const fetchFromApi = (apiUrl, setHook, initObject = {}) => {
  fetch(apiUrl, initObject)
    .then((response) => response.json())
    .then((data) => setHook(data));
};
