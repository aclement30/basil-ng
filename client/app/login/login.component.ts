import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss'],
})

export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.authenticateUser()
      .subscribe(() => {
        // Retrieve user base data from server
        this.authService.fetchUser()
          .subscribe((data: any) => {
            if (this.router.url === '/login') {
              this.router.navigate(['/recipes']);
            }
          });
      });
  }

  ngAfterViewInit() {
    (this.authService as GoogleAuthService).bindSignInButton(this.element.nativeElement.querySelector('button.google-oauth'));
  }
}
