// login.component.ts

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string | undefined;
  password: string | undefined;
  // private apiGatewayUrl = 'http://localhost:3000'; 
  private apiGatewayUrl = 'http://localhost:8080'; 

  constructor(private http: HttpClient) {}

  onSubmit() {
    const credentials = {
      username: this.username,
      password: this.password
    };

    // Replace 'api/login' with your actual login endpoint
    this.http.post(`${this.apiGatewayUrl}/login`,  { credentials })
      .subscribe(response => {
        // Handle successful login response
        console.log('Login successful!', response);
      }, error => {
        // Handle login error
        console.error('Login failed!', error);
      });
  }
}
