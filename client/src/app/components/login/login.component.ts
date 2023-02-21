import { TransmissionService } from './../../services/transmission.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loader = false;
  error;
  addressForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required]
  });

  constructor(private fb: FormBuilder, private router: Router, public transmissionService: TransmissionService) {
    if (this.transmissionService.userDetails.name) this.router.navigate(['/item']);
  }

  async onSubmit() {
    this.loader = true;
    this.error = null;
    const { data, error } = (await this.transmissionService.login({
      username: this.addressForm.value.username,
      password: this.addressForm.value.password
    })) as any;

    if (error) {
      this.loader = false;
      return (this.error = error);
    }

    localStorage.setItem('token', JSON.stringify(data));
    const token = this.transmissionService.getTokenData(data);
    this.transmissionService.userDetails = {
      name: token.username,
      domain: token.username.split('.')[0],
      role: token.isAdmin ? 'ADMIN' : 'USER',
      instance: token.instance,
      sidebar: token.sidebar
    };
    // this.loader = false;
    this.router.navigate(['/dashboard']);
  }
}
