import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';
import { CONFIG } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username, password) {
    return this.http.post<User>(`${CONFIG.apiUrl}/users/authenticate`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user.token));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: User) {
    return this.http.post(`${CONFIG.apiUrl}/users/register`, user);
  }

  getAll() {
    return this.http.get<User[]>(`${CONFIG.apiUrl}/users`);
  }

  getById(id: string) {
    return this.http.get<User>(`${CONFIG.apiUrl}/users/${id}`);
  }

  update(id, params) {
    return this.http.put(`${CONFIG.apiUrl}/users/${id}`, params).pipe(map(info => {
      // update stored user if the logged in user updated their own record
      if (id === this.userValue.id) {
        const user = { ...this.userValue, ...params };
        localStorage.setItem('user', JSON.stringify(user.token));

        // publish updated user to subscribers
        this.userSubject.next(user);
      }
      return info;
    }));
  }

  delete(id: string) {
    return this.http.delete(`${CONFIG.apiUrl}/users/${id}`).pipe(map(x => {
      if (id === this.userValue.id) {
        this.logout();
      }
      return x;
    }));
  }
}
