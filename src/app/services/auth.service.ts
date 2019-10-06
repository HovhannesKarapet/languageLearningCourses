import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private logged_in = false;

  constructor(private http: HttpClient) {
    this.logged_in = JSON.parse(localStorage.getItem('is_auth'));
  }

  isAuth() {
    return this.logged_in;
  }

  signIn(user) {
    this.logged_in = true;
    localStorage.setItem('is_auth', 'true');
    localStorage.setItem('user', JSON.stringify({
      id        : user.id,
      full_name : user.full_name,
      email     : user.email,
      level     : user.level
    }));
  }

  signOut() {
    this.logged_in = false;
    localStorage.clear();
  }

  getUsers() {
    return this.http.get('http://localhost:3000/users');
  }

  register(data) {
    const user = {
      full_name : data.full_name,
      email     : data.email,
      password  : data.password,
      level     : 1
    };
    return this.http.post('http://localhost:3000/users', user);
  }

  updateUser(id, data) {
    return this.http.put(`http://localhost:3000/users/${id}`, data);
  }
}
