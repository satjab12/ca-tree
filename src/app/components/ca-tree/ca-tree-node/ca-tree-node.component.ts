import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked,
  Inject, forwardRef
} from '@angular/core';
import {CaTreeService} from '../../../services/ca-tree.service';
import {BasicTreeNode, CaTreeModel, NodeFilter, SelectableTreeNode} from './ca-tree-model';
import {CaTreeComponent} from '../ca-tree.component';

//
//export class TreeNode {
//  name: String;
//  nr: number;
//  children: Array<TreeNode>;
//  selected: boolean;
//  childSelected: boolean = false;
//
//  constructor(name: String, nr: number, children: Array<TreeNode>) {
//    this.name = name;
//    this.nr = nr;
//    if (children == null) {
//      this.children = new Array<TreeNode>();
//    } else {
//      this.children = children;
//    }
//  }
//}

@Component({
  moduleId: module.id,
  selector: 'co-tree-node',
  templateUrl: 'ca-tree-node.component.html',
  styleUrls: ['ca-tree-node.component.css'],
  directives: [CaTreeNodeComponent],
  providers: [CaTreeService],
  pipes: [NodeFilter]

})
export class CaTreeNodeComponent implements OnInit, AfterViewChecked {

  extended: boolean = false;
  paddingPerLevel: number = 10;
  changing: boolean = false;

  @Input()
  model: CaTreeModel;

  @Input()
  level: number;

  @Input()
  node: BasicTreeNode;

  @Input()
  classStringOpen: String = 'https://freeiconshop.com/files/edd/folder-open-solid.png';
  classStringClose: String = 'http://plainicon.com/dboard/userprod/2800_a1826/prod_thumb/plainicon.com-44945-128px.png';


  @Output()
  nodeSelected: EventEmitter<BasicTreeNode> = new EventEmitter<BasicTreeNode>();

  @ViewChild('nodeTextInput')
  nodeTextInput: ElementRef;

  constructor(@Inject(forwardRef(() => CaTreeComponent)) private _caTreeComponent: CaTreeComponent) {
  }

  ngOnInit(): void {
    this.changing = false;
    this.extended = false;
  }

  ngAfterViewChecked(): void {
    if (this.changing) {
      this.nodeTextInput.nativeElement.focus();
    }
  }

  extend(): void {
    this.node.extended = !this.node.extended;
  }

  getPadding(): String {
    return this.paddingPerLevel * this.level + 'px';
  }

  onNodeSelected(): void {
    this.nodeSelected.emit(this.node);
    console.log('selected ' + this.node.name);
  }

  changePic(): void {
    let newPic = prompt("Change Pic for Open", "");
    console.log(newPic);
    if(newPic){
      this.classStringOpen = newPic;
      newPic = prompt("Change Pic for Close", "");
      console.log(newPic);
      if(newPic){
        this.classStringClose = newPic;


    }
  }}

  editNode(): void {
    this.changing = true;
  }

  addNode(): void {

   let node = {
     name : "Neuer Child",
     nr: this.model.getNewID(),
    parentNr: this.node.nr,
     extended: false,
     selected: false,
     childSelected: false
     };

    this.model.addResource(node);

   }



  onKeyDown(event): void {
    //handle text change if source of event is nodeTextInput-element
    if (event.srcElement === this.nodeTextInput.nativeElement) {
      if (event.keyCode === 13) {
        this.saveNodeChange();
      }
    }

  }

  saveNodeChange(): void {
    this.nodeTextInput.nativeElement.blur();
    this.node.name = this.nodeTextInput.nativeElement.value;
    this.changing = false;
  }

  deleteNode(): void {

  }

}
