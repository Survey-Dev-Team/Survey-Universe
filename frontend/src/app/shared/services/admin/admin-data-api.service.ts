import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SURVEY_BASE_URL } from '../../models/api';
import { MessageResponse } from '../../models/interfaces';
import {
  AdminUsersPageDto,
  UserSurveyResponseDto,
  GetUsersParams,
} from '../../models/api/admin-data-api.models';

@Injectable({ providedIn: 'root' })
export class AdminDataApiService {
  private http = inject(HttpClient);

  getUsers(params: GetUsersParams = {}): Observable<AdminUsersPageDto> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get<AdminUsersPageDto>(`${SURVEY_BASE_URL}users`, { params: httpParams });
  }

  getUserResponses(urlId: string): Observable<UserSurveyResponseDto[]> {
    return this.http.get<UserSurveyResponseDto[]>(`${SURVEY_BASE_URL}users/${urlId}/responses`);
  }

  deleteUser(urlId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${SURVEY_BASE_URL}users/${urlId}`);
  }
}
