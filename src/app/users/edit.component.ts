import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'edit.component.html' })
export class EditComponent implements OnInit {
    form!: FormGroup;
    id!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.accountService.getById(this.id)
            .pipe(first())
            .subscribe(member => {
                // form with validation rules
                this.form = this.formBuilder.group({
                    fullname: [member.fullname, Validators.required],
                    dateOfBirth: [member.dateOfBirth, Validators.required],
                    gender: [member.gender, Validators.required],
                    membershipType: [member.membershipType, Validators.required],
                    membershipStartDay: [member.membershipStartDay, Validators.required],
                    contact: [member.contact, Validators.required],
                    email: [member.email, Validators.required],
                    residentialAddress: [member.residentialAddress, Validators.required],
                    emergencyContact: [member.emergencyContact, [Validators.required]],
                    medical: [member.medical],
                });
            });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.accountService.update(this.id!, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/users');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }
}