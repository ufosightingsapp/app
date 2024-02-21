import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-navigation-toggle',
  templateUrl: './navigation-toggle.component.html',
  styleUrls: ['./navigation-toggle.component.scss'],
})
export class NavigationToggleComponent implements OnInit {
  constructor(private menuController: MenuController) {}

  ngOnInit() {}

  toggle() {
    this.menuController.toggle();
  }
}
