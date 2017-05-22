import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PollService {

  authToken: any;

  constructor(
    private http: Http
  ) {  }

  createPoll(poll) {
    this.loadToken();
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/api/polls/new', { headers })
      .map(res => res.json());
  }

  getPolls() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/polls/', { headers })
      .map(res => res.json());
  }

  getPoll(poll_id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/polls/' + poll_id, { headers })
      .map(res => res.json());
  }

  loadToken() {
    this.authToken = localStorage.getItem('id_token');
  }

}
