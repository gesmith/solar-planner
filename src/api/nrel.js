export default class NREL {
  static api_url = 'https://developer.nrel.gov/api/';
  static api_key = 'DeorpJQ247sUUm6FcicOGIneEimfcIUujaxWzwof';

  async getPVData(params) {
    params.api_key = NREL.api_key;
    params.format = 'json';

    let url = NREL.api_url + 'pvwatts/v6.json';
    url += '?' + new URLSearchParams(params).toString();

    return await fetch(url)
      .then((response) => response.json())
      .then((data) => data);
  }
}
