import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public form: FormGroup = new FormGroup({
    full_name       : new FormControl('User', [Validators.required, Validators.pattern("[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*")]),
    email           : new FormControl('user@gmail.com', [Validators.required, Validators.email]),
    password        : new FormControl('123456', [Validators.required, Validators.minLength(6)]),
    repeat_password : new FormControl('123456', [Validators.required, Validators.minLength(6)])
  });
  public messages : string[];
  public loading  : boolean;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  register() {
    if(this.form.invalid) {
      this.form.get('full_name').markAsTouched();
      this.form.get('email').markAsTouched();
      this.form.get('password').markAsTouched();
      this.form.get('repeat_password').markAsTouched();
      return;
    } else if (this.form.value.password !== this.form.value.repeat_password) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.authService.getUsers()
        .subscribe(
        res => {

          let data = this.form.value;
          let result = Object.values(res).some((item) => {
            if (data.email === item.email && data.password === item.password)
              return true;
            return false;
          });

          if (!result) {
            this.authService.register(data).subscribe();
            this.router.navigate(['/auth/login'],
              {
                queryParams: {
                  email: this.form.value.email
                }
              })
          } else {
            this.messages = ['this Email address is already in use'];
          }
        }
      ).add(() => {
        this.loading = false;
      })
    }, 700);
  }

}
