import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SURVEY_BASE_URL } from '../../models/api';
import { MessageResponse, UserPrivateDetails, UserUpdateRequest } from '../../models/interfaces';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private http = inject(HttpClient);

  getUser(urlId: string): Observable<UserPrivateDetails> {
    return this.http.get<UserPrivateDetails>(`${SURVEY_BASE_URL}users/${urlId}`);
  }

  updateUser(urlId: string, data: UserUpdateRequest): Observable<UserPrivateDetails> {
    return this.http.put<UserPrivateDetails>(`${SURVEY_BASE_URL}users/${urlId}`, data);
  }

  deleteUser(urlId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${SURVEY_BASE_URL}users/${urlId}`);
  }
}
