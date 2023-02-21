import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localtoken = JSON.parse(localStorage.getItem('token'));
    if (!localtoken) return next.handle(req);
    const headers = req.headers.set('x-auth-token', localtoken);
    const authReq = req.clone({ headers });
    return next.handle(authReq);
  }
}
