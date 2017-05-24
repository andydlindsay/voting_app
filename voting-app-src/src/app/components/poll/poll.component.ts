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

  ngOnInit() {
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

  onVoteClick(option_id) {
    console.log('clicked ' + option_id);
    this.jsonp.get('//api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK').subscribe(res => {
      const userIp = res['_body']['ip'];
      this.pollService.logVote(this.poll['_id'], option_id, userIp)
      .subscribe(
        data => {
          if (data.success) {
            this.flashMessage.show('Vote recorded!', { cssClass: 'alert-success' });
            this.router.navigate(['/poll/' + this.poll['_id']]);
            location.reload();
          } else {
            this.flashMessage.show(data.msg, { cssClass: 'alert-failure' });
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
            this.flashMessage.show('Option added!', { cssClass: 'alert-success' });
            location.reload();
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

    // based on chart.js documentation
    // http://www.chartjs.org/docs/#chart-configuration-chart-data
    const myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labelArray,
        datasets: [{
          data: voteArray,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false,
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
