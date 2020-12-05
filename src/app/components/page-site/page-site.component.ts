import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../../environments/environment';

import * as moment from 'moment';

declare var io: any;
declare var $: any;

@Component({
  selector: 'app-page-site',
  templateUrl: './page-site.component.html',
  styleUrls: ['./page-site.component.scss']
})
export class PageSiteComponent implements OnInit {
  @Input() socketThread;
  @Input() nameSite;
  @Input() gateways = [];
  @Input() nodesFile;
  @Input() position;
  @Input() zoom;


  nodesSite = [];
  nodesTable;
  nbActiveNodes = 0;
  startServer = "";

  constructor(private router: Router) { }

  ngOnChanges() {
    //console.log(this.gateways)
  }

  ngOnInit(): void {
    const that = this;

    //console.log(this.nodesFile)


    this.processListNodes(this.nodesSite);

    $(document).ready(function () {
      that.nodesTable = $('#nodes_tab').DataTable({
        data: this.nodesSite,
        columns: [
            {
              title: "Noeud",
              name: "node",
              data: "node"
            },
            {
              title: "Nom",
              name: "name",
              data: "name"
            },
            {
              title: "Passerelle",
              name: "gateway",
              data: "gateway"
            },
            {
              title: "Date",
              name: "date",
              data: "date"
            },
            {
              title: "Message",
              name: "message_type",
              data: "message_type"
            },
            {
              title: "Action",
              name: "action",
              data: "node",
              render: function ( data, type, row ) {
                //console.log(row)
                // name / node / mac_gateway / gateway

                let cellHtml = `<button gateway="${row.gateway}" mac_gateway="${row.mac_gateway}" node="${row.node}" class="btn btn-outline-secondary btn-sm my-2 my-sm-0 btn-refresh"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-counterclockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
              </svg></button>`;

                return cellHtml;
              }
            }
        ],
        "rowCallback": function (row, data, dataIndex) {
          //console.log(data)
          if (data.active) {
            $(row).addClass('greenClass');
          }
          else {
            if(data.date == "") $(row).addClass('redClass');
            else $(row).addClass('orangeClass');
          }
        }
      });

      $("#nodes_tab").on("click", "tbody tr td .btn-refresh", function (e) {
        const itemClicked = that.nodesTable.row($(this).parent()).data();
        e.stopPropagation();

      });

      $("#nodes_tab").on("click", "tbody tr td", function () {
        const itemClicked = that.nodesTable.row($(this).parent()).data();

        that.router.navigate(["node/" + encodeURI(itemClicked.mac_gateway) + "/" + encodeURI(itemClicked.gateway) + "/" + encodeURI(itemClicked.node) + "/" + encodeURI(itemClicked.name)]);
      });
    });
  }

  processListNodes(listNodes) {
    this.nbActiveNodes = 0;

    // Reinit gw state
    for (let i = 0; i < this.gateways.length; i++) {
      const gw = this.gateways[i];

      gw.active = false;
    }

    listNodes.map(node => {
      if (node.gateway === undefined) node.gateway = "";
      if (node.message_type === undefined) node.message_type = "";

      if (node.date !== '') {
        let date = moment(node.date)
        node.date = date.format("DD/MM/YYYY HH:mm:ss");

        let hour_ago = moment();
        hour_ago.subtract(1, 'h');
        hour_ago.subtract(15, 'm');

        //console.log(date)
        //console.log(hour_ago)

        let isActive = !date.isBefore(hour_ago)
        node.active = isActive;

        if(isActive) this.nbActiveNodes++;
      }
      else {
        node.active = false;
      }

      for (let i = 0; i < this.gateways.length; i++) {
        const gw = this.gateways[i];

        // If an active node is of this gateway, it is active too
        if(gw.name == node.gateway && node.active) {
          gw.active = true;
        }
      }
    })

    //console.log(this.gateways)

    return listNodes;
  }

}
