import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup = new FormGroup({
    email     : new FormControl('user@gmail.com', [Validators.required, Validators.email]),
    password  : new FormControl('1234567', [Validators.required, Validators.minLength(6)])
  });
  public message: string;
  public loading: boolean;

  constructor(
    private authService : AuthService,
    private route       : ActivatedRoute,
    private router      : Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.form.get('email').setValue(params.email);
    })
  }

  login() {
    if(this.form.invalid) {
      this.form.get('email').markAsTouched();
      this.form.get('password').markAsTouched();
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.authService.getUsers()
        .subscribe(
          (res) => {
            let data = this.form.value;
            let user;
            let result = Object.values(res).some((item) => {
              if (data.email === item.email && data.password === item.password) {
                user = item;
                return true;
              }
              return false;
            });

            if(result) {
              this.message = null;
              this.authService.signIn(user);
              this.router.navigate(['/home']);
            } else {
              this.message = 'Wrong Email or Password'
            }
          }
        ).add(() => {
        this.loading = false;
      });
    }, 700);
  }

}
