import { Mark } from './../models/mark';
import { HttpClient } from './http-client';


export class MarkerService {
  httpClient!: HttpClient;

  constructor() {
    //this.httpClient = new HttpClient({ baseURL: 'http://ec2-3-130-73-179.us-east-2.compute.amazonaws.com:3000' });
    this.httpClient = new HttpClient({ baseURL: 'http://localhost:3000' });
    //this.httpClient = new HttpClient({ baseURL: 'https://marius96.uber.space' });
    // Backup Gateway
    // this.httpClient = new HttpClient({ baseURL: ' http://10.42.30.122:8080/finance/' });
  }

  async getMarks(): Promise<Mark[]> {
    try {
      const response = await this.httpClient.get('/marks');
      console.log(response);
      const marks: Mark[] = (await response.json() as Mark[]);
      return marks;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getMarkById(id: string): Promise<Mark> {
      const response = await this.httpClient.get('/marks/' + id);
      console.log(response);
      const mark = (await response.json() as Mark);
      return mark;
  }

  async createMark(mark: Mark): Promise<Mark | undefined> {
    try {
      const response = await this.httpClient.post('/marks', mark);
      const createdMark: Mark = (await response.json() as Mark);
      return createdMark;
    } catch (error) {
      return undefined;
    }
  }

  async updateMark(mark: Mark): Promise<Mark> {
    const response = await this.httpClient.put('/marks', mark);
    console.log(response);
    const newMark = (await response.json() as Mark);
    return newMark;
}

  async deleteMark(mark: Mark): Promise<void> {
    try {
      await this.httpClient.delete('/marks/' + mark.id);
    } catch (error) {
      console.log(error);
    }
  }
}
