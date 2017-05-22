import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PollService } from '../../services/poll.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private titleService: Title,
    private poll: PollService,
    private auth: AuthService
  ) { }

  polls: any;

  ngOnInit() {
    this.titleService.setTitle('Home - Voteplex');
    this.poll.getPolls().subscribe(
      data => {
        if (data) {
          this.polls = data.polls;
          console.log(this.polls);
        }
      },
      err => {
        console.log(err);
        return false;
      }
    ); 
  }

  isLoggedIn() {
    return this.auth.loggedIn();
  }

}
