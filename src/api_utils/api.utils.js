export const fetchFromApi = (apiUrl, setHook, initObject = {}) => {
  fetch(apiUrl, initObject)
    .then(checkFetch)
    .then((response) => response.json())
    .then((data) => setHook(data))
    .catch((response) => {
      const isQuantityError =
        response.status === 406 && response.statusText === "Not Acceptable";
      if (isQuantityError)
        setHook({ status: response.status, statusText: response.statusText });
      else setHook(null);
    });
};

export const checkFetch = (response) => {
  if (!response.ok) {
    console.log(new Error(`${response.statusText} -> ${response.url}`));
    throw response;
  }
  return response;
};
