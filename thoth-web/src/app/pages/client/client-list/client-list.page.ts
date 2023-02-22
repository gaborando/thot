import {Component, OnInit} from '@angular/core';
import {Client} from "../../../common/types/client";
import {ClientService} from "../../../services/api/client.service";
import {ListPage} from "../../../common/utils/ui-patterns/list-page";
import {ScreenMessageService} from "../../../services/screen-message.service";
import {IonModal, ModalController} from "@ionic/angular";
import {SharingOptionsComponent} from "../../../components/sharing-options/sharing-options.component";

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.page.html',
  styleUrls: ['./client-list.page.scss'],
})
export class ClientListPage extends ListPage<Client> implements OnInit {
  selectedClient: Client | undefined;

  constructor(private clientService: ClientService,
              private screenMessageService: ScreenMessageService,
              private modalController: ModalController) {
    super(clientService)
  }

  ionViewWillEnter() {
    return super.loadPageData();
  }

  ngOnInit() {
  }

  unregister(client: Client) {
    return this.screenMessageService.showDeleteAlert(async () => {
      await this.clientService.deleteById(client.identifier);
      this.elements = this.elements?.filter(c => c.identifier !== client.identifier)
    })
  }

  updateSharingOptions(modal: IonModal) {
    if(!this.selectedClient){
      return ;
    }
    const c = this.selectedClient;
    return this.screenMessageService.showDeleteAlert(async () => {
      await this.clientService.update(c);
      return modal.dismiss();
    })
  }
}
