import { Component, OnInit, TemplateRef } from '@angular/core';

import { CommonService } from './../../_services/common.service';
import { AccountService } from 'src/app/_services/account.service';

import { first } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  users = null;
  modalRef: BsModalRef;

  constructor(
    private accountService: AccountService,
    private toast: CommonService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.accountService.getAll().pipe(first()).subscribe(
      users => this.users = users
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  deleteUser(id: string) {
    const user = this.users.find(x => x.id === id);
    user.isDeleting = true;
    this.accountService.delete(id).pipe(first()).subscribe(() => {
      this.users = this.users.filter(x => x.id !== id);
      this.toast.showSuccessNotify('Delete Success', 'ok ku');
      this.modalRef.hide();
    });
  }

  decline() {
    this.modalRef.hide();
  }
}
