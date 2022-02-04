import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-content-top',
  templateUrl: './content-top.component.html',
  styleUrls: ['./content-top.component.scss']
})
export class ContentTopComponent implements OnInit {

  paths : Array<string> = [];

  constructor() {
    let intervalId = setInterval(() => {
      if (sessionStorage.getItem('selectMenu')) {
        clearInterval(intervalId);

        let groupMenu : any = JSON.parse(sessionStorage.getItem('selectMenuGroup') || '{}');
        let menu : any = JSON.parse(sessionStorage.getItem('selectMenu') || '{}');

        if (groupMenu.groupName) {
          this.paths.push(groupMenu.groupName);
        }

        if (menu.menuName) {
          this.paths.push(menu.menuName);
        }
      }
    }, 100);
  }

  ngOnInit() {
  }
}
