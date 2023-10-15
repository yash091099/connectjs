
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "icon",
  templateUrl: "./icon.component.html",
  styleUrls: ["./icon.component.css"]
})
export class IconComponent implements OnInit {
  public assets = "/assets/symbol-defs.svg#"; // <use> is causing perf issues
  public iconPath: string;

  @Input() public icon!: string;

  constructor() {}

  ngOnInit(): void {
    this.iconPath = this.icon ? `${this.assets}${this.icon}` : "";
  }
}
