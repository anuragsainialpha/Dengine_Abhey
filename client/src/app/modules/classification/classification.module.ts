import { NgModule } from '@angular/core';
import { ClassificationComponent } from './classification.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
const ClassificationRoutes: Routes = [{ path: '', component: ClassificationComponent }];
@NgModule({
  declarations: [ClassificationComponent],
  imports: [SharedModule, RouterModule.forChild(ClassificationRoutes)]
})
export class ClassificationModule {}
