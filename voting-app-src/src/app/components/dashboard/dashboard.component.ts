import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PollService } from '../../services/poll.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: Object;
  polls: any;
  
  constructor(
    private auth: AuthService,
    private titleService: Title,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private pollService: PollService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Dashboard - Voteplex');
    this.auth.getUserProfile().subscribe(
      data => {
        this.user = data.user;
        this.pollService.getPollsByUser(this.user['id']).subscribe(
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
      }, 
      err => {
        console.log(err);
        return false;
      }
    );
  }

}