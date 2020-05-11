import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private toast: ToastrService) { }

  showSuccessNotify(message: string, title: string) {
    return this.toast.success(message, title, {
      timeOut: 2000
    });
  }

  showErrorNotify(message: string, title: string) {
    return this.toast.error(message, title, {
      timeOut: 2000,
      progressBar: true,
      closeButton: true
    });
  }
}
