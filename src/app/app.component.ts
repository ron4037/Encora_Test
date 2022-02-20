import { Component, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from './app.service';
import { contact } from './models/contact';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  modalReason = '';
  page = 1;
  pageSize = 5;
  contacts: contact[] = [];
  errorFetchingData = false;
  selectedContact = {
    firstName: '',
    lastName: '',
    phone: '',
    id: 0,
  };
  modalRef: any;

  constructor(private appService: AppService, private modalService: NgbModal) {}

  ngOnInit() {
    this.getContacts();
  }

  getContacts() {
    this.appService.getContacts().subscribe(
      (res) => {
        this.errorFetchingData = false;
        this.contacts = res;
      },
      (err) => {
        this.errorFetchingData = true;
      }
    );
  }

  addContact() {
    if(this.errorFetchingData){
      this.errorFetchingData = false;
    }
    this.selectedContact.id =
      this.contacts.length > 0
        ? this.contacts[this.contacts.length - 1].id + 1
        : 1;
    console.log(this.contacts, this.selectedContact);
    this.contacts.push({...this.selectedContact});
    console.log(this.contacts);
    this.modalRef.dismiss();
    this.emptySelectedContact();
  }

  updateContact() {
    const index = this.contacts.findIndex((item) => {
      return item.id === this.selectedContact.id;
    });

    this.contacts[index].firstName = this.selectedContact.firstName;
    this.contacts[index].lastName = this.selectedContact.lastName;
    this.contacts[index].phone = this.selectedContact.phone;

    this.closeModal();
  }

  deleteContact(contact: contact) {
    const index = this.contacts.findIndex((item) => {
      return item === contact;
    });
    this.contacts.splice(index, 1);
    if(this.contacts.length == 0){
      this.errorFetchingData = true;
    }
    // console.log(this.contacts.length, contact, index);
  }

  openModal(template: TemplateRef<any>, modalReason: string, contact?: any) {
    if (contact) {
      this.selectedContact = {...contact};
    }
    this.modalReason = modalReason;
    this.modalRef = this.modalService.open(template, {backdrop:'static', keyboard:false});
  }

  closeModal(){
    this.modalRef.dismiss();
    this.emptySelectedContact();
  }

  emptySelectedContact(){
    this.selectedContact = {
      firstName: '',
      lastName: '',
      phone: '',
      id: 0,
    };
  }
}
