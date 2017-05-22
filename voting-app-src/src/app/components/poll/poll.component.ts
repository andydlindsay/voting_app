import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PollService } from '../../services/poll.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {

  constructor(
    private titleService: Title,
    private pollService: PollService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  poll: any;

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        const poll_id = params['id'];
        this.pollService.getPoll(poll_id).subscribe(
          data => {
            if (data) {
              this.poll = data.poll;
              console.log(this.poll);
            }
          },
          err => {
            console.log(err);
            return false;
          }
        );
      });
  }

  isLoggedIn() {
    return this.authService.loggedIn();
  }

}
