import {Component, OnInit} from '@angular/core';
import {TemplateService} from "../../../services/api/template.service";
import {Template} from "../../../common/types/template";
import {DataSourceService} from "../../../services/api/data-source.service";
import {Datasource} from "../../../common/types/datasource";
import {RendererService} from "../../../services/api/renderer.service";
import {ScreenMessageService} from "../../../services/screen-message.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-renderer-new',
  templateUrl: './renderer-new.page.html',
  styleUrls: ['./renderer-new.page.scss'],
})
export class RendererNewPage implements OnInit {
  selectedTemplate: Template | undefined;
  selectedDatasource: Datasource[] | undefined;

  availableProperties: any[] = [];

  associationMap: any = {}
  rendererName: string | undefined;

  constructor(
    public templateService: TemplateService,
    public datasourceService: DataSourceService,
    private rendererService: RendererService,
    private screenMessageService: ScreenMessageService,
    private navController: NavController
  ) {
  }

  async ngOnInit() {
  }


  updateAssociationMap(p: string, association: any) {
    if (!association) {
      delete this.associationMap[p];
    } else if (association === 'parameter') {
      this.associationMap[p] = {
        type: 'parameter',
        id: null,
        property: null
      }
    } else {
      this.associationMap[p] = {
        type: 'datasource',
        id: association.ds.id,
        property: association.property
      }
    }
  }

  createRenderer() {
    return this.screenMessageService.loadingWrapper(async () => {
      const r = await this.rendererService.create(this.rendererName, this.selectedTemplate, this.selectedDatasource, this.associationMap);
      await this.screenMessageService.showDone();
      return this.navController.navigateForward('/renderer-detail/' + r.id);
    })
  }

  updateAvailableAssociations(event: any) {
    const tmp = [];
    for (const d of event || []) {
      for (const p of d.properties) {
        tmp.push({
          ds: d,
          property: p
        })
      }
    }
    this.availableProperties = tmp.sort((a, b) => (a.ds.name + a.property).localeCompare(b.ds.name + b.property));
  }

  manage($event: any) {
    console.log($event);
  }
}
