import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PollService } from '../../services/poll.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pollform',
  templateUrl: './pollform.component.html',
  styleUrls: ['./pollform.component.scss']
})
export class PollformComponent implements OnInit {

  constructor(
    private titleService: Title,
    private pollService: PollService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private fb: FormBuilder
  ) { }

  pollForm: FormGroup;

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.pollForm = this.fb.group({
      'pollTitle': ['', [
        Validators.required
      ]],
      'pollOptions': ['', [
        Validators.required
      ]]
    });
    this.pollForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  // onValueChanged function taken from the Angular Cookbook's Form Validation section
  // https://angular.io/docs/ts/latest/cookbook/form-validation.html
  onValueChanged(data?: any) {
    if (!this.pollForm) { return; }
    const form = this.pollForm;

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
    'pollTitle': '',
    'pollOptions': ''
  }

  validationMessages = {
    'pollTitle': {
      'required': 'The poll title is required.'
    },
    'pollOptions': {
      'required': 'You must enter at least one option.'
    }
  }

  onCreateClick() {
    // submit form to database
    if (this.pollForm.valid) {
      const pollTitle = this.pollForm.value.pollTitle,
            pollOptions = this.pollForm.value.pollOptions;

      this.pollService.createPoll(pollTitle, pollOptions).subscribe(
        data => {
          if (data.success) {
            this.flashMessage.show('Poll successfully created!', { cssClass: 'alert-success' });
            this.router.navigate(['/']);
          } else {
            console.log('data:', data);
            this.flashMessage.show('Poll was not created.', { cssClass: 'alert-failure' });
          }
        },
        err => {
          console.log(err);
          return false;
        }
      );
    }
  }

}
