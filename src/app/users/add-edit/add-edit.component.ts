import { CommonService } from './../../_services/common.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from 'src/app/_services/account.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toast: CommonService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', passwordValidators]
    });

    if (!this.isAddMode) {
      this.accountService.getById(this.id).pipe(first()).subscribe(x => {
        this.f.firstName.setValue(x.firstName);
        this.f.lastName.setValue(x.lastName);
        this.f.username.setValue(x.username);
      });
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {
    this.accountService.register(this.form.value).pipe(first()).subscribe(
      () => {
        this.toast.showSuccessNotify('Add Success', 'ok ku');
        this.router.navigate(['.', { relativeTo: this.route }]);
      },
      error => {
        this.toast.showErrorNotify(error, 'Error');
        this.loading = false;
      });
  }

  private updateUser() {
    this.accountService.update(this.id, this.form.value).pipe(first()).subscribe(
      () => {
        this.toast.showSuccessNotify('Edit Success', 'ok ku');
        this.router.navigate(['..', { relativeTo: this.route }]);
      },
      error => {
        this.toast.showErrorNotify(error, 'Error');
        this.loading = false;
      });
  }
}
