import { Component, OnInit } from '@angular/core';
import { error, GetNetworkError } from '@app/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { IResponse } from 'response-type';
import { Router } from '@angular/router';
import { IResetForm } from '@app/definitions';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public url = `${environment.api}/api/user/reset-password`;
  public error = error;
  public response: IResponse<any> = null;
  public isRequesting = false;
  public form: IResetForm = {
    password1: null,
    password2: null,
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService,
  ) { }

  ngOnInit() {
  }
  public SubmitForm () {
    this.execute(this.form);
  }
  private execute (data: IResetForm) {
    this.http.post(this.url, data).subscribe(
      (response) => {
        this.response = response;
        if (this.response.data && this.response.data.items[0]) {
          this.notification.InvokePasswordReset();
          this.router.navigateByUrl('/login');
        }
        this.isRequesting = false;
      },
      (response) => {
        this.isRequesting = false;
        if (response.name === 'HttpErrorResponse') {
          this.response = GetNetworkError();
          return false;
        }
        this.response = response;
      }
    );
  }

}