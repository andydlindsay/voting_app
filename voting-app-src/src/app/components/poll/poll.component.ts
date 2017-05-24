import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PollService } from '../../services/poll.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Chart from 'chart.js';
import { Jsonp } from '@angular/http';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    private authService: AuthService,
    private jsonp: Jsonp,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private fb: FormBuilder
  ) {

  }

  poll: any;
  optionForm: FormGroup;
  data: any;
  myChart: any;

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.route.params
      .subscribe(params => {
        const poll_id = params['id'];
        this.pollService.getPoll(poll_id).subscribe(
          data => {
            if (data) {
              this.poll = data.poll;
              this.titleService.setTitle(String(this.poll.title) + ' - Voteplex');
              this.buildForm();
              setTimeout(() => { this.drawDonut(); }, 0);
            }
          },
          err => {
            console.log(err);
            return false;
          }
        );
      });
  }

  buildForm() {
    this.optionForm = this.fb.group({
      "newOption": ['', [
        Validators.required
      ]]
    });

    this.optionForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  // onValueChanged function taken from the Angular Cookbook's Form Validation section
  // https://angular.io/docs/ts/latest/cookbook/form-validation.html
  onValueChanged(data?: any) {
    if (!this.optionForm) { return; }
    const form = this.optionForm;

    for (const field in this.formErrors) {
      // clear previous error message if any
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'newOption': ''
  }

  validationMessages = {
    'newOption': {
      'required': 'Some input is required.'
    }
  }

  isLoggedIn() {
    return this.authService.loggedIn();
  }

  isUserOwnedPoll() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      if (user.id == this.poll['user_id']) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  onDeleteClick() {
    this.pollService.deletePoll(this.poll['_id'])
      .subscribe(
        data => {
          if (data.success) {
            this.flashMessage.show('Poll deleted', { cssClass: 'alert-success' });
            this.router.navigate(['/']);
          } else { 
            this.flashMessage.show('Poll was not deleted', { cssClass: 'alert-failure' });
          }
        },
        err => {
          console.log(err);
          return false;
        }
      );
  }

  onVoteClick(option_id) {
    console.log('clicked ' + option_id);
    this.jsonp.get('//api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK').subscribe(res => {
      const userIp = res['_body']['ip'];
      this.pollService.logVote(this.poll['_id'], option_id, userIp)
      .subscribe(
        data => {
          if (data.success) {
            this.flashMessage.show('Thanks for voting!', { cssClass: 'alert-success' });
            this.destroyDonut();
            this.getData();
          } else if (data.msg == 'IP has already voted for this poll') {
            this.flashMessage.show('You have already voted on this poll.', { cssClass: 'alert-failure' });
          } else {
            this.flashMessage.show(data.errmsg, { cssClass: 'alert-failure' });
          }
        },
        err => {
          console.log(err);
          return false;
        }
      );
    });    
  }

  onAddClick() {
    // submit form to database
    if (this.optionForm.valid) {
      const newOption = {
        'option': this.optionForm.value.newOption      
      }
      this.pollService.addOption(this.poll['_id'], newOption).subscribe(
        data => {
          if (data.success) {
            this.getData();            
          } else {
            console.log('error:', data);
            this.flashMessage.show(data.msg, { cssClass: 'alert-failure' });
          }
        },
        error => {
          console.log(error);
          return false;
        }
      );
    }
  }

  // fix for chart.js glitch where old chart data is displayed on hover
  destroyDonut() {
    let oldCanvas = document.getElementById('graph');
    const graphArea = document.getElementById('grapharea');
    graphArea.removeChild(oldCanvas);
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'graph';
    graphArea.appendChild(newCanvas);
  }

  drawDonut() {

    const canvas = <HTMLCanvasElement> document.getElementById('graph');
    const ctx = canvas.getContext('2d');

    // convert the poll data into arrays
    let labelArray = [];
    let voteArray = [];
    for (let i = 0; i < this.poll.options.length; i++) {
      labelArray.push(this.poll.options[i].option);
      voteArray.push(this.poll.options[i].votes);
    }
    const backgroundColorArray = [
      'rgba(255, 153, 0, 0.2)',
      'rgba(74, 111, 227, 0.2)',
      'rgba(181, 187, 227, 0.2)',
      'rgba(230, 175, 185, 0.2)',
      'rgba(211, 63, 106, 0.2)',
      'rgba(17, 198, 56, 0.2)',
      'rgba(141, 213, 147, 0.2)',
      'rgba(198, 222, 199, 0.2)',
      'rgba(2, 63, 165, 0.2)',
      'rgba(125, 135, 185, 0.2)',
      'rgba(190, 193, 212, 0.2)',
      'rgba(214, 188, 192, 0.2)',
      'rgba(187, 119, 132, 0.2)',
      'rgba(142, 6, 59, 0.2)'
    ];
    const borderColorArray = [
      'rgba(255, 153, 0, 1)',
      'rgba(74, 111, 227, 1)',
      'rgba(181, 187, 227, 1)',
      'rgba(230, 175, 185, 1)',
      'rgba(211, 63, 106, 1)',
      'rgba(17, 198, 56, 1)',
      'rgba(141, 213, 147, 1)',
      'rgba(198, 222, 199, 1)',
      'rgba(2, 63, 165, 1)',
      'rgba(125, 135, 185, 1)',
      'rgba(190, 193, 212, 1)',
      'rgba(214, 188, 192, 1)',
      'rgba(187, 119, 132, 1)',
      'rgba(142, 6, 59, 1)'
    ];

    // based on chart.js documentation
    // http://www.chartjs.org/docs/#chart-configuration-chart-data
    this.myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labelArray,
        datasets: [{
          data: voteArray,
          backgroundColor: backgroundColorArray,
          borderColor: borderColorArray,
          borderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          displayColors: false
        },
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: false,
            ticks: {
              beginAtZero: true
            }
          }],
          yAxes: [{
            display: false,
            ticks: {
              beginAtZero: true,
              userCallback: function(label, index, labels) {
                if (Math.floor(label) === label) {
                  return label;
                }
              }
            }
          }]
        }
      }
    });

  }

}
