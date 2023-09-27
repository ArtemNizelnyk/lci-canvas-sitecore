

export default class SitecoreClient {
  private apiKey: string;
  private sitecoreApiUrl: string;
  private database: string;
  private lang: string;


  constructor(apiKey: string, sitecoreApiUrl: string, database = 'master', language = 'en') {
    this.apiKey = apiKey;
    this.sitecoreApiUrl = sitecoreApiUrl;
    this.database = database;
    this.lang = language;
  }

  async getItemByPath(path: string): Promise<any> {
    const url = `${this.sitecoreApiUrl}/sitecore/api/ssc/item/?path=${path}&sc_apikey=${this.apiKey}&database=${this.database}&sc_lang=${this.lang}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not retrieve item at path ${path}`);
    }

    return response.json();
  }
  async getItemChildrenByItemId(id: string): Promise<any> {
    const url = `${this.sitecoreApiUrl}/sitecore/api/ssc/item/${id}/children?sc_apikey=${this.apiKey}&database=${this.database}&sc_lang=${this.lang}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not retrieve item ${id} childrens `);
    }

    return response.json();
  }
  async getItemBySearch(term: string, page: number): Promise<any> {
    const url = `${this.sitecoreApiUrl}/sitecore/api/ssc/item/?term=${term}&sc_apikey=${this.apiKey}&database=${this.database}&sc_lang=${this.lang}&page=${page}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not retrieve item at path ${term}`);
    }

    return response.json();
  }
  async getItemById(id: string): Promise<any> {
    const url = `${this.sitecoreApiUrl}/sitecore/api/ssc/item/${id}?sc_apikey=${this.apiKey}&database=${this.database}&sc_lang=${this.lang}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not retrieve item with id ${id}`);
    }

    return response.json();
  }

}
