import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PollService {

  authToken: any;

  constructor(
    private http: Http
  ) {  }

  createPoll(title, options) {
    this.loadToken();
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const optionsArray = options.split(',');
    let optionsObjectArray = [];
    for (let i = 0; i < optionsArray.length; i++) {
      optionsObjectArray.push({
        'option': optionsArray[i].trim()
      })
    }
    const newPoll = {
      'title': title,
      'options': optionsObjectArray
    }
    console.log('newPoll:', newPoll);
    return this.http.post('http://localhost:8080/api/polls/new', newPoll, { headers })
      .map(res => res.json());
  }

  getPollsByUser(user_id) {
    this.loadToken();
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/api/polls/user/' + user_id, { headers })
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

  logVote(poll_id, option_id, user_ip) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const vote = {
      'voter_ip': user_ip,
      'option_id': option_id
    }
    return this.http.put('http://localhost:8080/api/polls/' + poll_id + '/vote', vote, { headers })
      .map(res => res.json());
  }

  addOption(poll_id, option) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.loadToken();
    headers.append('Authorization', this.authToken);
    const newOption = {
      'option': option
    }
    return this.http.put('http://localhost:8080/api/polls/' + poll_id + '/addoption', newOption, { headers })
      .map(res => res.json());
  }

  deletePoll(poll_id) {
    this.loadToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    return this.http.delete('http://localhost:8080/api/polls/' + poll_id, { headers })
      .map(res => res.json());
  }

}
