import {Component, OnInit} from '@angular/core';
import {TemplateService} from "../../../services/api/template.service";
import {Template} from "../../../common/types/template";
import {DataSourceService} from "../../../services/api/data-source.service";
import {Datasource} from "../../../common/types/datasource";
import {RendererService} from "../../../services/renderer.service";
import {ScreenMessageService} from "../../../services/api/screen-message.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-renderer-new',
  templateUrl: './renderer-new.page.html',
  styleUrls: ['./renderer-new.page.scss'],
})
export class RendererNewPage implements OnInit {
  templates: Template[] = [];
  datasource: Datasource[] = [];
  selectedTemplate: Template | undefined;
  selectedDatasource: Datasource[] | undefined;

  availableProperties: any[] = [];

  associationMap: any = {}
  rendererName: string | undefined;

  constructor(
    private templateService: TemplateService,
    private datasourceService: DataSourceService,
    private rendererService: RendererService,
    private screenMessageService: ScreenMessageService,
    private navController: NavController
  ) {
  }

  async ngOnInit() {
    this.templateService.findAll().then(r => {
      this.templates = r.content;
    })
    this.datasourceService.findAll().then(r => {
      this.datasource = r.content;
    })
  }


  updateAssociationMap(p: string, association: any) {
    if(association === 'parameter'){
      this.associationMap[p] = {
        type: 'parameter',
        id: null,
        property: null
      }
    }else{
      this.associationMap[p] = {
        type: 'datasource',
        id: association.ds.id,
        property: association.property
      }
    }
  }

  async createRenderer() {

    const r = await this.rendererService.create(this.rendererName, this.selectedTemplate, this.selectedDatasource, this.associationMap);
    await this.screenMessageService.showDone();
    return this.navController.navigateForward('/renderer-detail/' + r.id);


  }

  updateAvailableAssociations(event: any) {
    const ds = event.detail.value;
    this.availableProperties = [];
    for (const d of ds) {
      console.log(d)
      for (const p of d.properties) {
        this.availableProperties.push({
          ds: d,
          property: p
        })
      }
    }
  }
}
