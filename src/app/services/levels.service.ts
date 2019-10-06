import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LevelsService {

  constructor(private http: HttpClient) { }

  getLevels() {
    return this.http.get('http://localhost:3000/levels')
  }

  getLesson(id) {
    return this.http.get(`http://localhost:3000/lessons/${id}`);
  }

  getTest(id) {
    return this.http.get(`http://localhost:3000/tests/${id}`);
  }
}
