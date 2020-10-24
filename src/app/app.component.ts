import { Component, ViewChild, ViewContainerRef, OnInit, Compiler, Injector, NgModuleRef, NgModule } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-dynamic-code';

  @ViewChild('container', {read: ViewContainerRef}) vc: ViewContainerRef;

  constructor(private _compiler: Compiler,
    private _injector: Injector,
    private _m: NgModuleRef<any>) {
      
    }

  ngOnInit() {

  }

  ngAfterViewInit() {
    const template = '<span>generated on the fly: {{name}}</span>';

    const clazz = `
    (class Test {
      ngOnInit() { 
        console.log('dynamic..me.');
      }
    })`;


    const tmpCmp = Component({template: template})(eval(clazz));
    const tmpModule = NgModule({declarations: [tmpCmp]})(class {
    });
  
    this._compiler.compileModuleAndAllComponentsAsync(tmpModule)
      .then((factories) => {
        const f = factories.componentFactories[0];
        const cmpRef = f.create(this._injector, [], null, this._m);
        cmpRef.instance.name = 'dynamic';
        this.vc.insert(cmpRef.hostView);
      })
  }

}
