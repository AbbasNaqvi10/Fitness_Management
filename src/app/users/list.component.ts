import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { User } from '@app/_models';


interface ExtendedUser extends User {
    isDeleting?: boolean;
}
@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users?: ExtendedUser[];

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    deleteUser(memberId: string) {
        const user = this.users!.find(x => x.memberId === memberId);
        this.accountService.delete(memberId)
            .pipe(first())
            .subscribe(() => this.ngOnInit());
    }
}