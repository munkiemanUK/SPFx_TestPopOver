import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './TestPopOverWebPart.module.scss';
import * as strings from 'TestPopOverWebPartStrings';

export interface ITestPopOverWebPartProps {
  description: string;
  imageName: string;
}

export default class TestPopOverWebPart extends BaseClientSideWebPart<ITestPopOverWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    this.properties.imageName = "Tech_Op_Model.png";

    this.domElement.innerHTML = `
    <section class="${styles.testPopOver} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">
      <div class="${styles.welcome}">
        <img class="mapImage" alt="" src="${this._isDarkTheme ? require('./assets/welcome-dark.png') : require('./assets/welcome-light.png')}" class="${styles.welcomeImage}" />
        <h2>Well done, ${escape(this.context.pageContext.user.displayName)}!</h2>
        <div>${this._environmentMessage}</div>
        <div>Web part property value: <strong>${escape(this.properties.description)}</strong></div>
      </div>
      <div class="${styles.mapContainer}">
        <img src="${this.context.pageContext.web.absoluteUrl}/SiteAssets/${this.properties.imageName}" usemap="#image_map">
        <map name="image_map">
          <div class="${styles.gridContainer}" id="gridContainer">
            <div class="${styles.gridItem}">
              <div speech-bubble pbottom aright style="--bbColor:#af2d58">
                <div class="title">Bottom Right</div>
                <code>[pbottom]</code><code>[aright]</code>
              </div>        
            </div>
            <div class="${styles.gridItem}">
              <div speech-bubble pbottom acenter style="--bbColor:#a9528d">
                <div class="title">Bottom Center</div>
                <code>[pbottom]</code><code>[acenter]</code>
              </div>        
            </div>
            <div class="${styles.gridItem}">
              <div speech-bubble pbottom aleft style="--bbColor:#744b9f">
                <div class="title">Bottom Left</div>
                <code>[pbottom]</code><code>[aright]</code>
              </div>        
            </div>  
            <div class="${styles.gridItem}">
              <div speech-bubble pright abottom style="--bbColor:#f05142"> 
                <div class="title">Right Bottom</div>
                <code>[pright]</code><code>[abottom]</code>
              </div>
            </div>

            <div class="${styles.gridItem}">5</div>                        
            
            <div class="${styles.gridItem}">
              <div speech-bubble pleft abottom style="--bbColor:#484a9b">
                <div class="title">Left Bottom</div>
                <code>[pleft]</code><code>[abottom]</code>
              </div>        
            </div>
            <div class="${styles.gridItem}">
              <div speech-bubble pright acenter style="--bbColor:#f5882f">
                <div class="title">Right Center</div>
                <code>[pright]</code><code>[acenter]</code>
              </div>
            </div> 
            
            <div class="${styles.gridItem}">8</div>  
            
            <div class="${styles.gridItem}">
              <div speech-bubble pleft acenter style="--bbColor:#086899">
                <div class="title">Left Center</div>
                <code>[pleft]</code><code>[acenter]</code>
              </div>        
            </div>
            <div class="${styles.gridItem}">
              <div speech-bubble pright atop style="--bbColor:#fdbb3c">
                <div class="title">Right Top</div>
                <code>[pright]</code><code>[atop]</code>
              </div>
            </div> 

            <div class="${styles.gridItem}">11</div>         
            
            <div class="${styles.gridItem}">
              <div speech-bubble pleft atop style="--bbColor:#45c5e0">
                <div class="title">Left Top</div>
                <code>[pleft]</code><code>[atop]</code>
              </div>        
            </div>
            <div class="${styles.gridItem}">
              <div speech-bubble ptop aright flip style="--bbColor:#c5d863">
                <div class="title">Top Right</div>
                <code>[ptop]</code><code>[aright]</code><code>[flip]</code>
              </div>
            </div>
            <div class="${styles.gridItem}">
              <div speech-bubble ptop acenter style="--bbColor:#63c08c">
                <div class="title">Top Center</div>
                <code>[ptop]</code><code>[acenter]</code>
              </div>        
            </div>
            <div class="${styles.gridItem}">
              <div speech-bubble ptop aleft flip style="--bbColor:#51bfae">
                <div class="title">Top Left</div>
                <code>[ptop]</code><code>[aleft]</code><code>[flip]</code>
              </div>        
            </div>                       
          </div>
        </map>
      </div>
    </section>`;
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
