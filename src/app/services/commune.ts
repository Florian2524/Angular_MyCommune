import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommuneService {

  constructor(private http: HttpClient) {}

  public getCommunesByDepartement(code: string) {
    return this.http.get<any[]>(
      `https://geo.api.gouv.fr/departements/${code}/communes`
    );
  }
}